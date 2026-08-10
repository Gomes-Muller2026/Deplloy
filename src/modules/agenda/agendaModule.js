const agendaModule = {
  normalizeRecurrenceType(value) {
    const raw = String(value || '').trim().toLowerCase();
    if (!raw) return 'nao_recorrente';
    if (raw.includes('recorr')) return 'recorrente';
    if (raw === 'sim' || raw === 'yes' || raw === 'true') return 'recorrente';
    return 'nao_recorrente';
  },

  normalizeBulkUpdateMode(value) {
    const raw = String(value || '').trim().toLowerCase();
    if (raw === 'futuros_mesmo_paciente') return 'futuros_mesmo_paciente';
    if (raw === 'futuros_mesmo_procedimento') return 'futuros_mesmo_procedimento';
    if (raw === 'recorrentes_futuros_paciente') return 'recorrentes_futuros_paciente';
    return 'nao_aplicar';
  },

  applyRecurringPatientUpdates(app, baseAppointment, fields = {}, mode = 'nao_aplicar') {
    if (!app || !baseAppointment) return 0;

    const normalizedMode = this.normalizeBulkUpdateMode(mode);
    if (normalizedMode === 'nao_aplicar') return 0;

    const clientId = String(baseAppointment.clientId || '').trim();
    if (!clientId) return 0;
    const baseProcedure = String(baseAppointment.procedure || '').trim().toLowerCase();

    const baseId = String(baseAppointment.id || '').trim();
    const baseDate = String(baseAppointment.date || '').trim();
    const baseTime = String(baseAppointment.time || '').trim() || '00:00';
    let updatedCount = 0;

    app.appointments = (app.appointments || []).map((appointment) => {
      const currentId = String((appointment && appointment.id) || '').trim();
      if (!currentId || currentId === baseId) return appointment;

      const sameClient = String((appointment && appointment.clientId) || '').trim() === clientId;
      if (!sameClient) return appointment;

      const currentDate = String((appointment && appointment.date) || '').trim();
      const currentTime = String((appointment && appointment.time) || '').trim() || '00:00';
      if (currentDate && baseDate) {
        if (currentDate < baseDate) return appointment;
        if (currentDate === baseDate && currentTime < baseTime) return appointment;
      }

      if (normalizedMode === 'futuros_mesmo_procedimento') {
        const currentProcedure = String((appointment && appointment.procedure) || '').trim().toLowerCase();
        if (!baseProcedure || currentProcedure !== baseProcedure) return appointment;
      }

      if (normalizedMode === 'recorrentes_futuros_paciente') {
        const currentRecurrence = this.normalizeRecurrenceType((appointment && appointment.recurrenceType) || '');
        if (currentRecurrence !== 'recorrente') return appointment;
      }

      updatedCount += 1;
      return {
        ...appointment,
        ...fields
      };
    });

    return updatedCount;
  },

  scheduleGoogleCalendarAutoSync(app, reason = 'agenda-change') {
    if (!app || typeof app !== 'object') return;
    if (!app.googleCalendarAuthorized) return;
    if (typeof app.syncAppointmentsToGoogleCalendar !== 'function') return;

    const timerKey = '__googleCalendarAutoSyncTimerId';
    if (app[timerKey]) {
      window.clearTimeout(app[timerKey]);
      app[timerKey] = null;
    }

    app[timerKey] = window.setTimeout(() => {
      app[timerKey] = null;
      void app.syncAppointmentsToGoogleCalendar({ showToast: false, importFromGoogle: false }).catch((err) => {
        if (typeof app.logSyncAudit === 'function') {
          const message = String((err && err.message) || err || 'erro desconhecido');
          app.logSyncAudit('warning', `Google Calendar auto-sync falhou (${reason}): ${message}`);
        }
      });
    }, 700);
  },

  init(app) {
    return this;
  },

  // Pacotes pré-pagos: um agendamento pode estar vinculado a um `app.packages` (por
  // clientId), consumindo o valor da consulta (`normalizedAppointment.price`) do
  // `remainingBalance` do pacote em vez de virar uma cobrança avulsa. Esta função é
  // chamada em toda gravação (criação ou edição) e faz duas coisas, nesta ordem:
  //   1) Estorna ao pacote anterior (se havia) o valor que uma gravação anterior desta
  //      MESMA consulta já havia debitado (`previousAppointment.packageAmountApplied`).
  //      Isso garante que editar o preço, trocar de pacote ou desvincular o pacote nunca
  //      vaza saldo nem duplica desconto — sempre parte de um estado "neutro" antes de
  //      aplicar o novo débito.
  //   2) Debita do pacote selecionado (se houver) o preço atual da consulta, e marca a
  //      consulta como já paga (Status "Pago", Valor Pago = preço) para não cobrar de
  //      novo no financeiro avulso. Se isso deixar o saldo do pacote negativo, avisa via
  //      toast mas não bloqueia o salvamento (prioridade: não travar o fluxo da profissional).
  reconcileAppointmentPackageBalance(app, previousAppointment, normalizedAppointment) {
    if (!Array.isArray(app.packages)) app.packages = [];

    const prevPackageId = String((previousAppointment && previousAppointment.packageId) || '').trim();
    const prevApplied = toNumber(previousAppointment && previousAppointment.packageAmountApplied);
    if (prevPackageId && prevApplied > 0) {
      const prevPkg = app.packages.find((p) => p.id === prevPackageId);
      if (prevPkg) {
        prevPkg.remainingBalance = toNumber(prevPkg.remainingBalance) + prevApplied;
        prevPkg.updatedAt = new Date().toISOString();
      }
    }

    const newPackageId = String(normalizedAppointment.packageId || '').trim();
    if (!newPackageId) {
      normalizedAppointment.packageId = '';
      normalizedAppointment.packageAmountApplied = 0;
      return;
    }

    const pkg = app.packages.find((p) => p.id === newPackageId);
    if (!pkg || String(pkg.clientId || '') !== String(normalizedAppointment.clientId || '')) {
      normalizedAppointment.packageId = '';
      normalizedAppointment.packageAmountApplied = 0;
      if (typeof app.showToast === 'function') {
        app.showToast('O pacote selecionado não pertence a este cliente; a consulta foi salva sem vínculo de pacote.', 'warning');
      }
      return;
    }

    const amount = Math.max(0, toNumber(normalizedAppointment.price));
    pkg.remainingBalance = toNumber(pkg.remainingBalance) - amount;
    pkg.updatedAt = new Date().toISOString();

    normalizedAppointment.packageAmountApplied = amount;
    normalizedAppointment.amountPaid = amount;
    normalizedAppointment.paymentStatus = 'Pago';

    if (pkg.remainingBalance < 0 && typeof app.showToast === 'function') {
      app.showToast(`Saldo do pacote "${pkg.name}" ficou negativo (${formatCurrency(pkg.remainingBalance)}). Considere renovar o pacote deste cliente.`, 'warning');
    }
  },

  // Contrapartida de reconcileAppointmentPackageBalance para exclusão definitiva de uma
  // consulta vinculada a pacote: devolve ao saldo o valor que havia sido debitado.
  refundAppointmentPackageBalance(app, appointment) {
    const packageId = String((appointment && appointment.packageId) || '').trim();
    const applied = toNumber(appointment && appointment.packageAmountApplied);
    if (!packageId || applied <= 0) return;
    if (!Array.isArray(app.packages)) return;

    const pkg = app.packages.find((p) => p.id === packageId);
    if (!pkg) return;
    pkg.remainingBalance = toNumber(pkg.remainingBalance) + applied;
    pkg.updatedAt = new Date().toISOString();
  },

  saveAppointment(app, payload, appointmentId) {
    if (!payload.clientId && !payload.clientName) {
      app.showToast('Selecione um cliente para agendar.', 'warning');
      return;
    }

    const matchedClient = payload.clientId
      ? app.clients.find((client) => String(client.id || '') === String(payload.clientId || ''))
      : app.clients.find((client) => String(client.name || '').trim().toLowerCase() === String(payload.clientName || '').trim().toLowerCase());

    const existing = app.appointments.find((a) => a.id === appointmentId);

    // Começa a partir do registro existente (se houver) e só então aplica o payload do
    // formulário por cima. O formulário de edição só conhece um subconjunto dos campos
    // (data, horário, valor, etc.) — campos que vivem fora dele, como confirmationToken/
    // confirmationStatus/confirmationSentAt (fluxo de confirmação por WhatsApp) e
    // googleEventId/googleCalendarUpdatedAt/source (sincronização com o Google Calendar),
    // precisam sobreviver a uma edição comum, senão qualquer "Salvar Consulta" (mesmo só
    // pra ajustar o preço) apaga silenciosamente esses dados.
    const normalized = {
      ...(existing || {}),
      ...payload,
      clientId: String((matchedClient && matchedClient.id) || payload.clientId || '').trim(),
      clientName: String((matchedClient && matchedClient.name) || payload.clientName || '').trim(),
      id: appointmentId || `app-${Date.now()}`,
      status: payload.status || 'Agendado',
      paymentStatus: payload.paymentStatus || 'Pendente',
      recurrenceType: this.normalizeRecurrenceType(payload.recurrenceType),
      price: toNumber(payload.price),
      amountPaid: toNumber(payload.amountPaid),
      packageId: String(payload.packageId || '').trim(),
      packageAmountApplied: 0
    };

    const bulkUpdateMode = this.normalizeBulkUpdateMode(payload.bulkUpdateMode);

    if (typeof app.clearAppointmentDeletionTombstone === 'function' && normalized.id) {
      app.clearAppointmentDeletionTombstone(normalized.id);
    }

    this.reconcileAppointmentPackageBalance(app, existing, normalized);
    let updatedRecurringCount = 0;
    if (existing) {
      app.appointments = app.appointments.map((a) => (a.id === appointmentId ? normalized : a));
      if (bulkUpdateMode !== 'nao_aplicar') {
        updatedRecurringCount = this.applyRecurringPatientUpdates(app, normalized, {
          procedure: normalized.procedure,
          price: normalized.price,
          paymentMethod: normalized.paymentMethod,
          color: normalized.color,
          notes: normalized.notes
        }, bulkUpdateMode);
      }
      app.showToast('Consulta atualizada com sucesso.', 'success');
    } else {
      app.appointments.push(normalized);
      app.showToast('Consulta agendada com sucesso.', 'success');
    }

    if (bulkUpdateMode !== 'nao_aplicar' && existing) {
      if (updatedRecurringCount > 0) {
        app.showToast(`Atualização recorrente aplicada em ${updatedRecurringCount} consulta(s) do mesmo paciente.`, 'success');
      } else {
        app.showToast('Nenhum outro agendamento futuro do paciente precisou de ajuste.', 'info');
      }
    }

    app.saveData();
    app.render();
    app.closeAppointmentModal();
    this.scheduleGoogleCalendarAutoSync(app, existing ? 'appointment-update' : 'appointment-create');
  },

  async deleteAppointment(app, appointmentId) {
    let confirmed = false;
    if (typeof app.askConfirmation === 'function') {
      confirmed = await app.askConfirmation('Deseja realmente excluir esta consulta?', {
        title: 'Excluir consulta',
        confirmLabel: 'Excluir'
      });
    } else {
      confirmed = confirm('Deseja realmente excluir esta consulta?');
    }
    if (!confirmed) return;

    const targetAppointment = app.appointments.find((a) => a.id === appointmentId);
    if (targetAppointment) {
      this.refundAppointmentPackageBalance(app, targetAppointment);
    }

    app.appointments = app.appointments.filter((a) => a.id !== appointmentId);
    if (typeof app.registerAppointmentDeletionTombstone === 'function') {
      app.registerAppointmentDeletionTombstone(appointmentId);
    }
    app.logSyncAudit('info', `Exclusão solicitada para consulta ${appointmentId}.`);
    app.saveData();
    if (typeof app.deleteAppointmentInFirebaseNow === 'function') {
      void app.deleteAppointmentInFirebaseNow(appointmentId).then((ok) => {
        if (!ok && typeof app.requestFirebasePushSync === 'function') {
          app.requestFirebasePushSync();
        }
      });
    }
    app.render();
    app.showToast('Consulta excluída com sucesso.', 'success');
    this.scheduleGoogleCalendarAutoSync(app, 'appointment-delete');

    window.setTimeout(() => {
      const revived = app.appointments.some((a) => String(a.id || '') === String(appointmentId || ''));
      if (!revived) return;
      app.logSyncAudit('error', `Consulta ${appointmentId} reapareceu após exclusão (possível rollback de sync).`);
      app.showToast('A consulta reapareceu após excluir. Copie o diagnóstico em Configurações > Auditoria.', 'warning');
    }, 2600);
  },

  sendAppointmentWhatsApp(app, appointmentId) {
    const appointment = app.appointments.find((a) => a.id === appointmentId);
    if (!appointment) return;

    const client = app.clients.find((c) => c.id === appointment.clientId);
    const rawPhone = (client && client.phone) || '';
    const phone = app.normalizeWhatsAppPhone(rawPhone);
    if (!phone) {
      app.showToast('Cliente sem telefone válido para WhatsApp.', 'warning');
      return;
    }

    const text = typeof app.buildAppointmentWhatsAppMessage === 'function'
      ? app.buildAppointmentWhatsAppMessage(appointment, client)
      : [
          `Olá, ${(client && client.name) || appointment.clientName || 'cliente'}!`,
          '',
          'Passando para confirmar seu agendamento:',
          `Data: ${formatDateBR(appointment.date)}`,
          `Horário: ${appointment.time || ''}`,
          `Procedimento: ${appointment.procedure || 'Consulta'}`,
          `Valor: ${formatCurrency(appointment.price || 0)}`
        ].join('\n');

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener');
    app.showToast('Mensagem de WhatsApp preparada.', 'success');
  },

  // Lembrete de pagamento independente do fluxo de confirmação: não lê nem
  // grava confirmationToken/confirmationStatus/confirmationSentAt/confirmationRespondedAt.
  sendAppointmentReminderWhatsApp(app, appointmentId) {
    const appointment = app.appointments.find((a) => a.id === appointmentId);
    if (!appointment) return;

    const client = app.clients.find((c) => c.id === appointment.clientId);
    const rawPhone = (client && client.phone) || '';
    const phone = app.normalizeWhatsAppPhone(rawPhone);
    if (!phone) {
      app.showToast('Cliente sem telefone válido para WhatsApp.', 'warning');
      return;
    }

    const text = typeof app.buildAppointmentReminderMessage === 'function'
      ? app.buildAppointmentReminderMessage(appointment, client)
      : [
          `Olá, ${(client && client.name) || appointment.clientName || 'cliente'}!`,
          `Passando para lembrar do seu atendimento amanhã, às ${appointment.time || '--:--'}.`,
          `Valor: ${formatCurrency(appointment.price || 0)}`
        ].join('\n');

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener');
    app.showToast('Lembrete de pagamento preparado.', 'success');
  },

  CONFIRMATION_ENDPOINT: 'https://southamerica-east1-consultorio-patricia.cloudfunctions.net/confirmarAgendamento',

  generateConfirmationToken() {
    const part = () => Math.random().toString(36).slice(2);
    return `${part()}${part()}${Date.now().toString(36)}`;
  },

  buildConfirmationLink(appointmentId, token) {
    return `${this.CONFIRMATION_ENDPOINT}?id=${encodeURIComponent(appointmentId)}&token=${encodeURIComponent(token)}`;
  },

  clearAppointmentConfirmationStatus(app, appointmentId) {
    const appointment = app.appointments.find((a) => a.id === appointmentId);
    if (!appointment) return;

    app.appointments = app.appointments.map((a) => (a.id === appointmentId ? {
      ...a,
      confirmationStatus: null,
      confirmationToken: null,
      confirmationSentAt: null
    } : a));

    if (Array.isArray(app.agendaConfirmPendingQueue)) {
      app.agendaConfirmPendingQueue = app.agendaConfirmPendingQueue.filter((id) => id !== appointmentId);
    }

    app.saveData();
    app.render();
    app.showToast('Status de confirmação limpo. Pode enviar novamente quando quiser.', 'info');
  },

  // Permite corrigir manualmente o status de confirmação (ex.: cliente confirmou
  // mas depois desistiu por telefone) sem precisar reenviar o link de WhatsApp.
  cycleAppointmentConfirmationStatus(app, appointmentId) {
    const appointment = app.appointments.find((a) => a.id === appointmentId);
    if (!appointment) return;

    const current = String(appointment.confirmationStatus || '').trim();
    if (!current) return;

    const cycle = ['confirmado', 'nao_confirmado', 'pendente'];
    const labels = { confirmado: 'Confirmado', nao_confirmado: 'Não confirmado', pendente: 'Aguardando resposta' };
    const currentIndex = cycle.indexOf(current);
    const next = cycle[(currentIndex === -1 ? 0 : currentIndex + 1) % cycle.length];

    app.appointments = app.appointments.map((a) => (a.id === appointmentId ? {
      ...a,
      confirmationStatus: next
    } : a));

    app.saveData();
    app.render();
    app.showToast(`Status de confirmação alterado para "${labels[next]}".`, 'info');
  },

  sendAppointmentConfirmationWhatsApp(app, appointmentId, options = {}) {
    const appointment = app.appointments.find((a) => a.id === appointmentId);
    if (!appointment) return 'not-found';

    const client = app.clients.find((c) => c.id === appointment.clientId);

    // Reenviar gera SEMPRE um confirmationToken novo, o que invalida silenciosamente qualquer
    // link já entregue ao paciente (o link antigo passa a bater "Link inválido ou expirado" na
    // Cloud Function confirmarAgendamento). Se já existe uma confirmação pendente com token
    // (ou seja, um link que pode já estar na conversa de WhatsApp do paciente), confirmamos com
    // quem está operando antes de invalidá-lo — evita reenvios acidentais (duplo clique, clique
    // repetido por não perceber que já foi enviado, etc.) quebrarem um link que o paciente ainda
    // não abriu. Usa window.confirm (síncrono) de propósito: um modal assíncrono quebraria o
    // "user gesture" exigido pelo navegador para o window.open do wa.me logo abaixo.
    const hasPendingUnansweredLink = String(appointment.confirmationStatus || '').trim() === 'pendente' && Boolean(appointment.confirmationToken);
    if (hasPendingUnansweredLink && !options.skipConfirm) {
      const clientLabel = (client && client.name) || appointment.clientName || 'este cliente';
      const whenLabel = `${formatDateBR(appointment.date)} às ${appointment.time || '--:--'}`;
      const confirmMessage = `Já existe uma confirmação enviada para ${clientLabel} (${whenLabel}) que ainda está aguardando resposta.\n\nReenviar agora vai gerar um novo link — o link já enviado ao paciente deixará de funcionar.\n\nDeseja reenviar mesmo assim?`;
      const proceed = window.confirm(confirmMessage);
      if (!proceed) return 'cancelled';
    }

    const rawPhone = (client && client.phone) || '';
    const phone = app.normalizeWhatsAppPhone(rawPhone);
    if (!phone) {
      if (!options.silent) app.showToast('Cliente sem telefone válido para WhatsApp.', 'warning');
      return 'no-phone';
    }

    const token = this.generateConfirmationToken();
    const link = this.buildConfirmationLink(appointment.id, token);

    const baseText = typeof app.buildAppointmentWhatsAppMessage === 'function'
      ? app.buildAppointmentWhatsAppMessage(appointment, client)
      : [
          `Olá, ${(client && client.name) || appointment.clientName || 'cliente'}!`,
          '',
          'Passando para confirmar seu agendamento:',
          `Data: ${formatDateBR(appointment.date)}`,
          `Horário: ${appointment.time || ''}`,
          `Procedimento: ${appointment.procedure || 'Consulta'}`
        ].join('\n');

    const text = `${baseText}\n\nPor favor, confirme clicando no link abaixo:\n${link}`;

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
    const opened = window.open(url, '_blank', 'noopener');

    // O navegador pode bloquear pop-ups abertos em sequência no mesmo clique
    // (Chrome, por padrão, só permite 1 por gesto do usuário). Nesse caso
    // window.open retorna null/undefined: tratamos como "bloqueado" em vez de
    // marcar como enviado, e deixamos o item na fila para um clique manual.
    if (!opened) {
      if (!Array.isArray(app.agendaConfirmPendingQueue)) app.agendaConfirmPendingQueue = [];
      if (!app.agendaConfirmPendingQueue.includes(appointmentId)) app.agendaConfirmPendingQueue.push(appointmentId);
      if (!options.skipRender) app.render();
      return 'blocked';
    }

    app.appointments = app.appointments.map((a) => (a.id === appointmentId ? {
      ...a,
      confirmationStatus: 'pendente',
      confirmationToken: token,
      confirmationSentAt: new Date().toISOString()
    } : a));

    if (Array.isArray(app.agendaConfirmPendingQueue)) {
      app.agendaConfirmPendingQueue = app.agendaConfirmPendingQueue.filter((id) => id !== appointmentId);
    }

    app.saveData();
    if (!options.skipRender) app.render();
    return 'sent';
  },

  sendSelectedAppointmentConfirmations(app, appointmentIds) {
    const ids = Array.from(appointmentIds || []);
    if (!ids.length) {
      app.showToast('Selecione ao menos um cliente para enviar a confirmação.', 'warning');
      return;
    }

    // Tentamos abrir a janela do WhatsApp para todos os selecionados dentro do
    // mesmo clique. O navegador pode bloquear algumas como pop-up (em geral,
    // permite só a primeira por gesto do usuário) — nesse caso elas entram
    // numa fila e ficam destacadas na lista, exigindo um clique manual em
    // cada uma para abrir (contornando o bloqueio).
    let sentCount = 0;
    let blockedCount = 0;
    app.agendaConfirmPendingQueue = [];
    ids.forEach((id) => {
      const result = this.sendAppointmentConfirmationWhatsApp(app, id, { skipRender: true });
      if (result === 'sent') sentCount += 1;
      else if (result === 'blocked') blockedCount += 1;
    });
    app.render();

    if (blockedCount === 0 && sentCount > 0) {
      app.showToast(`Confirmação enviada para ${sentCount} cliente(s). Confira as janelas do WhatsApp abertas.`, 'success');
    } else if (blockedCount > 0) {
      const sentPart = sentCount > 0 ? `Enviado para ${sentCount} cliente(s). ` : '';
      app.showToast(`${sentPart}O navegador bloqueou o envio para ${blockedCount} cliente(s) — clique no ícone de enviar ao lado de cada um destacado como "Próximo" para continuar. Para enviar tudo de uma vez da próxima vez, permita pop-ups para este site nas configurações do navegador.`, 'warning');
    }
  }
};

window.agendaModule = agendaModule;

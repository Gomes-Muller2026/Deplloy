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

  saveAppointment(app, payload, appointmentId) {
    if (!payload.clientId && !payload.clientName) {
      app.showToast('Selecione um cliente para agendar.', 'warning');
      return;
    }

    const matchedClient = payload.clientId
      ? app.clients.find((client) => String(client.id || '') === String(payload.clientId || ''))
      : app.clients.find((client) => String(client.name || '').trim().toLowerCase() === String(payload.clientName || '').trim().toLowerCase());

    const normalized = {
      ...payload,
      clientId: String((matchedClient && matchedClient.id) || payload.clientId || '').trim(),
      clientName: String((matchedClient && matchedClient.name) || payload.clientName || '').trim(),
      id: appointmentId || `app-${Date.now()}`,
      status: payload.status || 'Agendado',
      paymentStatus: payload.paymentStatus || 'Pendente',
      recurrenceType: this.normalizeRecurrenceType(payload.recurrenceType),
      price: toNumber(payload.price),
      amountPaid: toNumber(payload.amountPaid)
    };

    const bulkUpdateMode = this.normalizeBulkUpdateMode(payload.bulkUpdateMode);

    if (typeof app.clearAppointmentDeletionTombstone === 'function' && normalized.id) {
      app.clearAppointmentDeletionTombstone(normalized.id);
    }

    const existing = app.appointments.find((a) => a.id === appointmentId);
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

    // Envios manuais (um clique de cada vez, ex.: "Enviar próximo" da fila ou
    // o botão de reenvio de uma linha) reaproveitam a mesma aba já aberta em
    // vez de acumular uma aba nova por contato — basta navegar a referência
    // existente, o que não é bloqueado por pop-up blocker (só window.open novo é).
    const existingWindow = app.whatsappSendWindowRef;
    if (options.reuseTab && existingWindow && !existingWindow.closed) {
      existingWindow.location.href = url;
      existingWindow.focus();
    } else {
      const opened = window.open(url, '_blank');

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

      opened.opener = null;
      app.whatsappSendWindowRef = opened;
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

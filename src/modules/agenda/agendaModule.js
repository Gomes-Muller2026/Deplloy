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

  sendAppointmentConfirmationWhatsApp(app, appointmentId, options = {}) {
    const appointment = app.appointments.find((a) => a.id === appointmentId);
    if (!appointment) return false;

    const client = app.clients.find((c) => c.id === appointment.clientId);
    const rawPhone = (client && client.phone) || '';
    const phone = app.normalizeWhatsAppPhone(rawPhone);
    if (!phone) {
      app.showToast('Cliente sem telefone válido para WhatsApp.', 'warning');
      return false;
    }

    const token = this.generateConfirmationToken();
    const link = this.buildConfirmationLink(appointment.id, token);

    app.appointments = app.appointments.map((a) => (a.id === appointmentId ? {
      ...a,
      confirmationStatus: 'pendente',
      confirmationToken: token,
      confirmationSentAt: new Date().toISOString()
    } : a));

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
    window.open(url, '_blank', 'noopener');

    app.saveData();
    if (!options.skipRender) app.render();
    return true;
  },

  sendSelectedAppointmentConfirmations(app, appointmentIds) {
    const ids = Array.from(appointmentIds || []);
    if (!ids.length) {
      app.showToast('Selecione ao menos um cliente para enviar a confirmação.', 'warning');
      return;
    }

    // window.open precisa rodar de forma síncrona dentro do clique do usuário,
    // senão o navegador bloqueia como pop-up (mesmo com atraso de poucos ms).
    let sentCount = 0;
    ids.forEach((id) => {
      if (this.sendAppointmentConfirmationWhatsApp(app, id, { skipRender: true })) sentCount += 1;
    });
    app.render();

    if (sentCount > 0) {
      app.showToast(`Confirmação enviada para ${sentCount} cliente(s). Confira as janelas do WhatsApp abertas.`, 'success');
    }
  }
};

window.agendaModule = agendaModule;

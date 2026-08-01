const agendaModule = {
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
      price: toNumber(payload.price),
      amountPaid: toNumber(payload.amountPaid)
    };

    if (typeof app.clearAppointmentDeletionTombstone === 'function' && normalized.id) {
      app.clearAppointmentDeletionTombstone(normalized.id);
    }

    const existing = app.appointments.find((a) => a.id === appointmentId);
    if (existing) {
      app.appointments = app.appointments.map((a) => (a.id === appointmentId ? normalized : a));
      app.showToast('Consulta atualizada com sucesso.', 'success');
    } else {
      app.appointments.push(normalized);
      app.showToast('Consulta agendada com sucesso.', 'success');
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
  }
};

window.agendaModule = agendaModule;

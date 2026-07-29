const agendaModule = {
  init(app) {
    return this;
  },

  saveAppointment(app, payload, appointmentId) {
    if (!payload.clientId && !payload.clientName) {
      app.showToast('Selecione um cliente para agendar.', 'warning');
      return;
    }

    const normalized = {
      ...payload,
      id: appointmentId || `app-${Date.now()}`,
      status: payload.status || 'Agendado',
      paymentStatus: payload.paymentStatus || 'Pendente',
      price: toNumber(payload.price),
      amountPaid: toNumber(payload.amountPaid)
    };

    const existing = app.appointments.find((a) => a.id === appointmentId);
    if (existing) {
      app.appointments = app.appointments.map((a) => (a.id === appointmentId ? normalized : a));
      app.showToast('Consulta atualizada com sucesso.', 'success');
    } else {
      app.appointments.push(normalized);
      app.showToast('Consulta agendada com sucesso.', 'success');
    }

    app.saveStore();
    app.render();
    app.closeAppointmentModal();
  },

  deleteAppointment(app, appointmentId) {
    if (!confirm('Deseja realmente excluir esta consulta?')) return;
    app.appointments = app.appointments.filter((a) => a.id !== appointmentId);
    app.saveStore();
    app.render();
    app.showToast('Consulta excluída com sucesso.', 'success');
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

    const text = [
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

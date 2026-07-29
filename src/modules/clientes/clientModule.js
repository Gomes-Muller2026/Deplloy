const clientModule = {
  init(app) {
    return this;
  },

  saveClient(app, payload, clientId) {
    if (!payload.name || !payload.phone) {
      app.showToast('Nome e telefone são obrigatórios.', 'warning');
      return;
    }

    const normalized = {
      ...payload,
      id: clientId || `client-${Date.now()}`,
      createdAt: payload.createdAt || getTodayStr(),
      registrationNumber: payload.registrationNumber || app.getNextClientRegistrationNumber()
    };

    const existing = app.clients.find((c) => c.id === clientId);
    if (existing) {
      app.clients = app.clients.map((c) => (c.id === clientId ? normalized : c));
      app.showToast('Cliente atualizado com sucesso.', 'success');
    } else {
      app.clients.push(normalized);
      app.showToast('Cliente cadastrado com sucesso.', 'success');
    }

    app.saveStore();
    app.render();
    app.closeClientModal();
  },

  deleteClient(app, clientId) {
    if (!confirm('Deseja realmente excluir este cliente?')) return;
    app.clients = app.clients.filter((c) => c.id !== clientId);
    app.appointments = app.appointments.filter((a) => a.clientId !== clientId);
    app.saveStore();
    app.render();
    app.showToast('Cliente excluído com sucesso.', 'success');
  }
};

window.clientModule = clientModule;

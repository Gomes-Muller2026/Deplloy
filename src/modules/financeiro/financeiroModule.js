const financeiroModule = {
  init(app) {
    return this;
  },

  saveExpense(app, payload, expenseId) {
    if (!payload.description || !payload.amount) {
      app.showToast('Descrição e valor são obrigatórios.', 'warning');
      return;
    }

    const normalized = {
      ...payload,
      id: expenseId || `expense-${Date.now()}`,
      amount: toNumber(payload.amount)
    };

    const existing = app.expenses.find((e) => e.id === expenseId);
    if (existing) {
      app.expenses = app.expenses.map((e) => (e.id === expenseId ? normalized : e));
      app.showToast('Despesa atualizada com sucesso.', 'success');
    } else {
      app.expenses.push(normalized);
      app.showToast('Despesa cadastrada com sucesso.', 'success');
    }

    app.saveData();
    app.render();
    app.closeExpenseModal();
  },

  async deleteExpense(app, expenseId) {
    let confirmed = false;
    if (typeof app.askConfirmation === 'function') {
      confirmed = await app.askConfirmation('Deseja realmente excluir esta despesa?', {
        title: 'Excluir despesa',
        confirmLabel: 'Excluir'
      });
    } else {
      confirmed = confirm('Deseja realmente excluir esta despesa?');
    }
    if (!confirmed) return;

    app.expenses = app.expenses.filter((e) => e.id !== expenseId);
    app.saveData();
    app.render();
    app.showToast('Despesa excluída com sucesso.', 'success');
  }
};

window.financeiroModule = financeiroModule;

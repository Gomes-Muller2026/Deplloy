/**
 * Consultório Control - Aplicação Principal JS
 * Gerenciamento de Clientes, Agenda de Consultas, Controle Financeiro (Total/Parcial),
 * Filtro Global de Período, Avisos Sonoros e Sincronização em Tempo Real na Nuvem (Firebase)
 */

const APP_BRAND_NAME = 'Patrícia Psicoterapeuta';
const APP_BRAND_SUBTITLE = 'Consultório de Psicoterapia';

// Helper para formatar moeda em Real (R$)
const formatCurrency = (val) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);
};

// Helper para formatar data BR (DD/MM/AAAA)
const formatDateBR = (dateStr) => {
  if (!dateStr) return '';
  const normalized = String(dateStr).trim();
  if (!normalized) return '';

  if (/^\d{4}-\d{2}-\d{2}$/.test(normalized)) {
    const [year, month, day] = normalized.split('-');
    return `${day}/${month}/${year}`;
  }

  if (/^\d{2}\/\d{2}\/\d{4}$/.test(normalized)) {
    const [day, month, year] = normalized.split('/');
    return `${day}/${month}/${year}`;
  }

  return normalized;
};

// Converter data no formato DD/MM/AAAA para YYYY-MM-DD
const parseDateBR = (dateStr) => {
  if (!dateStr) return '';
  const normalized = String(dateStr).trim();
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(normalized)) {
    const [day, month, year] = normalized.split('/');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }
  return normalized;
};

// Obter a data de hoje no formato YYYY-MM-DD
const getTodayStr = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Obter 1º dia do mês atual
const getFirstDayOfMonthStr = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}-01`;
};

// Obter último dia do mês atual
const getLastDayOfMonthStr = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const lastDayObj = new Date(year, month, 0);
  const day = String(lastDayObj.getDate()).padStart(2, '0');
  const monthStr = String(month).padStart(2, '0');
  return `${year}-${monthStr}-${day}`;
};

// Dados Demonstrativos Iniciais
const INITIAL_DEMO_CLIENTS = [
  {
    id: 'cli-1',
    name: 'Carlos Eduardo Oliveira',
    phone: '(11) 98765-4321',
    email: 'carlos.eduardo@email.com',
    cpf: '123.456.789-00',
    dob: '1988-04-15',
    notes: 'Paciente relata dores na coluna lombar. Retorno em 15 dias.',
    createdAt: '2026-07-01'
  },
  {
    id: 'cli-2',
    name: 'Fernanda Lima Santos',
    phone: '(11) 97654-3210',
    email: 'fernanda.lima@email.com',
    cpf: '987.654.321-11',
    dob: '1995-09-20',
    notes: 'Acompanhamento nutricional mensal. Dieta adaptada.',
    createdAt: '2026-07-05'
  },
  {
    id: 'cli-3',
    name: 'Roberto Alves de Souza',
    phone: '(21) 99123-4567',
    email: 'roberto.souza@email.com',
    cpf: '456.789.123-22',
    dob: '1976-12-02',
    notes: 'Consulta clínica inicial. Sem alergias declaradas.',
    createdAt: '2026-07-10'
  },
  {
    id: 'cli-4',
    name: 'Beatriz Mendes Rocha',
    phone: '(31) 98888-7777',
    email: 'beatriz.mendes@email.com',
    cpf: '321.654.987-33',
    dob: '2001-06-18',
    notes: 'Sessão de fisioterapia preventiva.',
    createdAt: '2026-07-15'
  }
];

const today = getTodayStr();

const INITIAL_DEMO_APPOINTMENTS = [
  {
    id: 'app-1',
    clientId: 'cli-1',
    clientName: 'Carlos Eduardo Oliveira',
    date: today,
    time: '09:00',
    procedure: 'Consulta Clínica Geral',
    price: 250.00,
    amountPaid: 250.00,
    paymentMethod: 'Pix',
    status: 'Concluído',
    paymentStatus: 'Pago',
    notes: 'Paciente compareceu no horário. Receita entregue.'
  },
  {
    id: 'app-2',
    clientId: 'cli-2',
    clientName: 'Fernanda Lima Santos',
    date: today,
    time: '14:30',
    procedure: 'Avaliação Nutricional',
    price: 300.00,
    amountPaid: 150.00,
    paymentMethod: 'Pix',
    status: 'Agendado',
    paymentStatus: 'Parcial',
    notes: 'Sinal de 50% pago no agendamento. Restante no atendimento.'
  },
  {
    id: 'app-3',
    clientId: 'cli-3',
    clientName: 'Roberto Alves de Souza',
    date: today,
    time: '16:00',
    procedure: 'Retorno e Exames',
    price: 180.00,
    amountPaid: 0,
    paymentMethod: 'Dinheiro',
    status: 'Agendado',
    paymentStatus: 'Pendente',
    notes: 'Checar exames de sangue trazidos pelo paciente.'
  },
  {
    id: 'app-4',
    clientId: 'cli-4',
    clientName: 'Beatriz Mendes Rocha',
    date: '2026-07-20',
    time: '10:00',
    procedure: 'Sessão de Fisioterapia',
    price: 200.00,
    amountPaid: 200.00,
    paymentMethod: 'Pix',
    status: 'Concluído',
    paymentStatus: 'Pago',
    notes: 'Pagamento efetuado via Pix.'
  },
  {
    id: 'app-5',
    clientId: 'cli-1',
    clientName: 'Carlos Eduardo Oliveira',
    date: '2026-07-28',
    time: '11:00',
    procedure: 'Retorno Fisioterapia Lombar',
    price: 150.00,
    amountPaid: 0,
    paymentMethod: 'Pix',
    status: 'Agendado',
    paymentStatus: 'Pendente',
    notes: 'Agendado para a próxima semana.'
  }
];

const INITIAL_DEMO_EXPENSES = [
  {
    id: 'exp-1',
    description: 'Aluguel do consultório',
    category: 'Aluguel',
    amount: 1800.00,
    date: getFirstDayOfMonthStr(),
    notes: 'Pagamento mensal do imóvel.'
  },
  {
    id: 'exp-2',
    description: 'Mercado da semana',
    category: 'Mercado',
    amount: 320.50,
    date: today,
    notes: 'Compras para a recepção.'
  }
];

class ConsultorioApp {
  constructor() {
    this.clients = [];
    this.appointments = [];
    this.expenses = [];
    this.activeTab = 'dashboard';
    this.finFilter = 'todos';
    this.soundEnabled = true;
    this.notifiedApptIds = new Set();

    // Estado da Nuvem (Firebase)
    this.db = null;
    this.unsubClients = null;
    this.unsubAppointments = null;

    // Filtro Global de Período de Datas
    this.startDate = getFirstDayOfMonthStr();
    this.endDate = getLastDayOfMonthStr();

    // Minutos de antecedência do aviso sonoro
    this.reminderMinutes = parseInt(localStorage.getItem('consultorio_reminder_minutes')) || 15;

    this.initStore();
    this.initFirebase();
    this.initDOM();
    this.initEvents();
    this.initAudioAndReminders();
    this.render();
  }

  // Inicializa a persistência no LocalStorage
  initStore() {
    const savedClients = localStorage.getItem('consultorio_clients');
    const savedAppointments = localStorage.getItem('consultorio_appointments');
    const savedExpenses = localStorage.getItem('consultorio_expenses');

    if (savedClients && savedAppointments) {
      this.clients = JSON.parse(savedClients);
      this.appointments = JSON.parse(savedAppointments);
      this.expenses = savedExpenses ? JSON.parse(savedExpenses) : [...INITIAL_DEMO_EXPENSES];
      this.appointments.forEach(app => {
        if (app.amountPaid === undefined) {
          app.amountPaid = app.paymentStatus === 'Pago' ? parseFloat(app.price || 0) : 0;
        }
      });
    } else {
      this.clients = [...INITIAL_DEMO_CLIENTS];
      this.appointments = [...INITIAL_DEMO_APPOINTMENTS];
      this.expenses = [...INITIAL_DEMO_EXPENSES];
      this.saveStore();
    }
  }

  saveStore() {
    localStorage.setItem('consultorio_clients', JSON.stringify(this.clients));
    localStorage.setItem('consultorio_appointments', JSON.stringify(this.appointments));
    localStorage.setItem('consultorio_expenses', JSON.stringify(this.expenses));
  }

  // Sincronização em Tempo Real via Firebase
  initFirebase() {
    const cfgStr = localStorage.getItem('consultorio_firebase_config');
    const badge = document.getElementById('cloud-sync-status');
    const text = document.getElementById('cloud-status-text');

    if (!cfgStr || typeof firebase === 'undefined') {
      if (badge) badge.className = 'cloud-status-badge offline';
      if (text) text.textContent = 'Modo Local';
      return;
    }

    try {
      const config = JSON.parse(cfgStr);
      if (!firebase.apps.length) {
        firebase.initializeApp(config);
      }
      this.db = firebase.firestore();

      if (badge) badge.className = 'cloud-status-badge online';
      if (text) text.textContent = 'Nuvem Conectada (Tempo Real)';

      // Listener em Tempo Real para Clientes
      this.unsubClients = this.db.collection('clients').onSnapshot(snapshot => {
        const cloudClients = [];
        snapshot.forEach(doc => cloudClients.push(doc.data()));
        if (cloudClients.length > 0) {
          this.clients = cloudClients;
          this.saveStore();
          this.render();
        }
      }, err => console.log('Erro listener clientes:', err));

      // Listener em Tempo Real para Consultas
      this.unsubAppointments = this.db.collection('appointments').onSnapshot(snapshot => {
        const cloudAppointments = [];
        snapshot.forEach(doc => cloudAppointments.push(doc.data()));
        if (cloudAppointments.length > 0) {
          this.appointments = cloudAppointments;
          this.saveStore();
          this.render();
        }
      }, err => console.log('Erro listener consultas:', err));

    } catch (e) {
      console.log('Falha ao conectar Firebase:', e);
      if (badge) badge.className = 'cloud-status-badge offline';
      if (text) text.textContent = 'Erro de Conexão Nuvem';
    }
  }

  // Enviar dados para a Nuvem
  syncClientToCloud(client) {
    if (this.db) {
      this.db.collection('clients').doc(client.id).set(client).catch(err => console.log('Erro cloud client:', err));
    }
  }

  deleteClientFromCloud(clientId) {
    if (this.db) {
      this.db.collection('clients').doc(clientId).delete().catch(err => console.log('Erro delete client cloud:', err));
    }
  }

  syncAppointmentToCloud(appt) {
    if (this.db) {
      this.db.collection('appointments').doc(appt.id).set(appt).catch(err => console.log('Erro cloud appt:', err));
    }
  }

  deleteAppointmentFromCloud(apptId) {
    if (this.db) {
      this.db.collection('appointments').doc(apptId).delete().catch(err => console.log('Erro delete appt cloud:', err));
    }
  }

  resetDemoData() {
    this.clients = [...INITIAL_DEMO_CLIENTS];
    this.appointments = [...INITIAL_DEMO_APPOINTMENTS];
    this.expenses = [...INITIAL_DEMO_EXPENSES];
    this.saveStore();
    
    if (this.db) {
      this.clients.forEach(c => this.syncClientToCloud(c));
      this.appointments.forEach(a => this.syncAppointmentToCloud(a));
    }

    this.render();
    this.showToast('Dados de demonstração restaurados com sucesso!', 'success');
  }

  // Preenche os campos do topo com as datas e minutos
  initDOM() {
    const startInput = document.getElementById('top-date-start');
    const endInput = document.getElementById('top-date-end');
    const minsInput = document.getElementById('top-reminder-mins');
    const firebaseJsonInput = document.getElementById('cfg-firebase-json');

    if (startInput) startInput.value = formatDateBR(this.startDate);
    if (endInput) endInput.value = formatDateBR(this.endDate);
    if (minsInput) minsInput.value = this.reminderMinutes;

    const savedCfg = localStorage.getItem('consultorio_firebase_config');
    if (savedCfg && firebaseJsonInput) {
      firebaseJsonInput.value = savedCfg;
    }

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  // Registra eventos de clique, formulários e atalhos
  initEvents() {
    // Configurações do Firebase Cloud
    const btnSaveFb = document.getElementById('btn-save-firebase');
    if (btnSaveFb) {
      btnSaveFb.addEventListener('click', () => {
        const jsonText = document.getElementById('cfg-firebase-json').value.trim();
        if (!jsonText) {
          this.showToast('Cole o código JSON de configuração do Firebase.', 'warning');
          return;
        }

        try {
          const parsed = JSON.parse(jsonText);
          if (!parsed.projectId || !parsed.apiKey) {
            this.showToast('Código de configuração do Firebase inválido.', 'danger');
            return;
          }

          localStorage.setItem('consultorio_firebase_config', JSON.stringify(parsed));
          this.initFirebase();

          // Sincronizar dados atuais locais com a nuvem
          if (this.db) {
            this.clients.forEach(c => this.syncClientToCloud(c));
            this.appointments.forEach(a => this.syncAppointmentToCloud(a));
          }

          this.showToast('Conectado à nuvem Firebase com sucesso! Sincronizando...', 'success');
        } catch (err) {
          this.showToast('Erro ao analisar o JSON do Firebase.', 'danger');
        }
      });
    }

    const btnDisconnectFb = document.getElementById('btn-disconnect-firebase');
    if (btnDisconnectFb) {
      btnDisconnectFb.addEventListener('click', () => {
        localStorage.removeItem('consultorio_firebase_config');
        if (this.unsubClients) this.unsubClients();
        if (this.unsubAppointments) this.unsubAppointments();
        this.db = null;

        const badge = document.getElementById('cloud-sync-status');
        const text = document.getElementById('cloud-status-text');
        if (badge) badge.className = 'cloud-status-badge offline';
        if (text) text.textContent = 'Modo Local';

        document.getElementById('cfg-firebase-json').value = '';
        this.showToast('Desconectado da nuvem. O aplicativo voltará ao modo local.', 'info');
      });
    }

    // Minutos de Antecedência do Aviso Sonoro
    const minsInput = document.getElementById('top-reminder-mins');
    if (minsInput) {
      minsInput.addEventListener('change', (e) => {
        let val = parseInt(e.target.value);
        if (isNaN(val) || val < 1) val = 15;
        this.reminderMinutes = val;
        localStorage.setItem('consultorio_reminder_minutes', val.toString());
        this.showToast(`Lembrete sonoro configurado para ${val} min antes da consulta!`, 'info');
      });
    }

    // Filtro de Data do Topo (Editável)
    document.getElementById('top-date-start').addEventListener('change', (e) => {
      this.startDate = parseDateBR(e.target.value);
      this.render();
      this.showToast(`Filtro atualizado: a partir de ${formatDateBR(this.startDate)}`, 'info');
    });

    document.getElementById('top-date-end').addEventListener('change', (e) => {
      this.endDate = parseDateBR(e.target.value);
      this.render();
      this.showToast(`Filtro atualizado: até ${formatDateBR(this.endDate)}`, 'info');
    });

    document.getElementById('btn-reset-top-dates').addEventListener('click', () => {
      this.startDate = getFirstDayOfMonthStr();
      this.endDate = getLastDayOfMonthStr();
      document.getElementById('top-date-start').value = formatDateBR(this.startDate);
      document.getElementById('top-date-end').value = formatDateBR(this.endDate);
      this.render();
      this.showToast('Período redefinido para o Mês Atual.', 'info');
    });

    // Sound Toggle
    const soundBtn = document.getElementById('btn-toggle-sound');
    soundBtn.addEventListener('click', () => {
      this.soundEnabled = !this.soundEnabled;
      const statusText = document.getElementById('sound-status-text');
      if (this.soundEnabled) {
        soundBtn.classList.add('active-sound');
        soundBtn.classList.remove('sound-off');
        statusText.textContent = 'Avisos: ON';
        this.playReminderSound();
        this.showToast('Avisos sonoros ativados!', 'success');
      } else {
        soundBtn.classList.remove('active-sound');
        soundBtn.classList.add('sound-off');
        statusText.textContent = 'Avisos: OFF';
        this.showToast('Avisos sonoros desativados.', 'info');
      }
    });

    // Tab Navigation
    document.querySelectorAll('.sidebar-nav .nav-item').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetTab = btn.getAttribute('data-tab');
        this.switchTab(targetTab);
      });
    });

    // Quick Actions Header & Sidebar
    document.getElementById('btn-quick-appointment').addEventListener('click', () => this.openAppointmentModal());
    document.getElementById('btn-header-new-appointment').addEventListener('click', () => this.openAppointmentModal());
    document.getElementById('btn-new-appointment-agenda').addEventListener('click', () => this.openAppointmentModal());
    
    document.getElementById('btn-header-new-client').addEventListener('click', () => this.openClientModal());
    document.getElementById('btn-new-client').addEventListener('click', () => this.openClientModal());
    document.getElementById('btn-new-expense').addEventListener('click', () => this.openExpenseModal());

    // Client Form Submit
    document.getElementById('form-client').addEventListener('submit', (e) => {
      e.preventDefault();
      this.saveClientForm();
    });

    document.getElementById('btn-cancel-client').addEventListener('click', () => this.closeClientModal());
    document.getElementById('btn-close-client').addEventListener('click', () => this.closeClientModal());

    // Appointment Form Submit
    document.getElementById('form-appointment').addEventListener('submit', (e) => {
      e.preventDefault();
      this.saveAppointmentForm();
    });

    // Toggle amount paid field based on payment status selection in appointment modal
    document.getElementById('appt-payment-status').addEventListener('change', (e) => {
      const val = e.target.value;
      const groupAmount = document.getElementById('group-amount-paid');
      const inputAmount = document.getElementById('appt-amount-paid');
      const priceVal = parseFloat(document.getElementById('appt-price').value || 0);

      if (val === 'Parcial') {
        groupAmount.style.display = 'flex';
        inputAmount.value = (priceVal / 2).toFixed(2);
      } else if (val === 'Pago') {
        groupAmount.style.display = 'flex';
        inputAmount.value = priceVal.toFixed(2);
      } else {
        groupAmount.style.display = 'none';
        inputAmount.value = '0';
      }
    });

    document.getElementById('btn-cancel-appointment').addEventListener('click', () => this.closeAppointmentModal());
    document.getElementById('btn-close-appointment').addEventListener('click', () => this.closeAppointmentModal());

    // Quick Pay Form Submit
    document.getElementById('form-quick-pay').addEventListener('submit', (e) => {
      e.preventDefault();
      this.saveQuickPayForm();
    });

    document.getElementById('btn-cancel-pay').addEventListener('click', () => this.closeQuickPayModal());
    document.getElementById('btn-close-pay').addEventListener('click', () => this.closeQuickPayModal());

    document.getElementById('form-expense').addEventListener('submit', (e) => {
      e.preventDefault();
      this.saveExpenseForm();
    });

    document.getElementById('btn-cancel-expense').addEventListener('click', () => this.closeExpenseModal());
    document.getElementById('btn-close-expense').addEventListener('click', () => this.closeExpenseModal());

    document.getElementById('pay-status-select').addEventListener('change', (e) => {
      const status = e.target.value;
      const apptId = document.getElementById('pay-appt-id').value;
      const app = this.appointments.find(a => a.id === apptId);
      if (!app) return;

      const inputAmount = document.getElementById('pay-amount-input');
      if (status === 'Pago') {
        inputAmount.value = app.price.toFixed(2);
      } else if (status === 'Pendente') {
        inputAmount.value = '0.00';
      } else if (status === 'Parcial') {
        inputAmount.value = (app.amountPaid || (app.price / 2)).toFixed(2);
      }
    });

    // Client Details Modal Close
    document.getElementById('btn-close-client-details').addEventListener('click', () => this.closeClientDetailsModal());
    document.getElementById('btn-close-client-details-footer').addEventListener('click', () => this.closeClientDetailsModal());

    // Search and Filters
    document.getElementById('agenda-search').addEventListener('input', () => this.renderAgendaTable());
    document.getElementById('agenda-filter-date').addEventListener('change', () => this.renderAgendaTable());
    document.getElementById('agenda-filter-status').addEventListener('change', () => this.renderAgendaTable());

    document.getElementById('clientes-search').addEventListener('input', () => this.renderClientsTable());

    document.getElementById('financeiro-search').addEventListener('input', () => this.renderFinanceiroTable());

    // Financeiro Filter Tabs
    document.querySelectorAll('[data-fin-filter]').forEach(tabBtn => {
      tabBtn.addEventListener('click', (e) => {
        document.querySelectorAll('[data-fin-filter]').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        this.finFilter = e.currentTarget.getAttribute('data-fin-filter');
        this.renderFinanceiroTable();
      });
    });

    // Config Actions
    document.getElementById('btn-export-backup').addEventListener('click', () => this.exportBackup());
    document.getElementById('input-import-backup').addEventListener('change', (e) => this.importBackup(e));
    document.getElementById('btn-report-clientes').addEventListener('click', () => this.generateAllClientsReport());
    document.getElementById('btn-print-client-individual').addEventListener('click', () => this.printCurrentClientReport());
    document.getElementById('btn-report-paciente').addEventListener('click', () => this.generateReport('paciente'));
    document.getElementById('btn-report-receitas').addEventListener('click', () => this.generateReport('receitas'));
    document.getElementById('btn-report-financeiro').addEventListener('click', () => this.generateReport('financeiro'));
    document.getElementById('btn-report-despesas').addEventListener('click', () => this.generateReport('despesas'));
    document.getElementById('btn-copy-report').addEventListener('click', () => this.copyReport());
    document.getElementById('btn-print-report').addEventListener('click', () => this.printReport());
    document.getElementById('btn-reset-demo').addEventListener('click', () => {
      if (confirm('Tem certeza que deseja restaurar os dados originais de demonstração? Seus registros atuais serão substituídos.')) {
        this.resetDemoData();
      }
    });
  }

  // Filtra lista de consultas pelo período de datas definido no topo
  filterByTopDateRange(appointmentsList) {
    return appointmentsList.filter(app => {
      if (this.startDate && app.date < this.startDate) return false;
      if (this.endDate && app.date > this.endDate) return false;
      return true;
    });
  }

  // Sintetizador de Áudio da Web (Aviso Sonoro)
  playReminderSound() {
    if (!this.soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;

      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(587.33, now);
      gain1.gain.setValueAtTime(0.3, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.35);

      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(880, now + 0.18);
      gain2.gain.setValueAtTime(0.3, now + 0.18);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.18);
      osc2.stop(now + 0.7);
    } catch (e) {
      console.log('Web Audio erro:', e);
    }
  }

  // Inicializa o temporizador de verificação de lembretes
  initAudioAndReminders() {
    setInterval(() => this.checkUpcomingAppointments(), 20000);
    setTimeout(() => this.checkUpcomingAppointments(), 3000);
  }

  // Verifica se há consultas nos próximos minutos
  checkUpcomingAppointments() {
    const now = new Date();
    const todayStr = getTodayStr();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const todayAppointments = this.appointments.filter(a => a.date === todayStr && a.status === 'Agendado');

    todayAppointments.forEach(app => {
      if (this.notifiedApptIds.has(app.id)) return;

      const [h, m] = app.time.split(':').map(Number);
      const apptMinutes = h * 60 + m;
      const diff = apptMinutes - currentMinutes;

      const maxMins = this.reminderMinutes || 15;
      if (diff >= -5 && diff <= maxMins) {
        this.notifiedApptIds.add(app.id);
        this.playReminderSound();

        const timeMsg = diff <= 0 ? 'agora mesmo' : `em cerca de ${diff} minuto(s)`;
        this.showToast(`🔔 <strong>Lembrete de Consulta (${maxMins}min):</strong> ${app.clientName} às ${app.time} (${timeMsg})!`, 'warning');
      }
    });
  }

  // Alternar abas da aplicação
  switchTab(tabId) {
    this.activeTab = tabId;
    
    document.querySelectorAll('.sidebar-nav .nav-item').forEach(btn => {
      if (btn.getAttribute('data-tab') === tabId) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    document.querySelectorAll('.tab-content').forEach(section => {
      section.classList.remove('active');
    });

    const targetSection = document.getElementById(`tab-${tabId}`);
    if (targetSection) {
      targetSection.classList.add('active');
    }

    const titles = {
      dashboard: { title: 'Dashboard', sub: 'Visão geral do seu consultório no período selecionado' },
      agenda: { title: 'Agenda & Consultas', sub: 'Gerencie horários, sessões e atendimentos do período' },
      clientes: { title: 'Clientes / Pacientes', sub: 'Cadastro e histórico completo dos seus clientes' },
      financeiro: { title: 'Controle Financeiro', sub: 'Acompanhe receitas recebidas (Total/Parcial) e pendências do período' },
      despesas: { title: 'Despesas', sub: 'Controle de gastos e relatório de saldo líquido' },
      config: { title: 'Configurações', sub: 'Backup, nuvem e preferências do sistema' }
    };

    if (titles[tabId]) {
      document.getElementById('page-title').textContent = titles[tabId].title;
      document.getElementById('page-subtitle').textContent = titles[tabId].sub;
    }

    this.render();
  }

  // Renderização Geral
  render() {
    this.updateBadges();
    this.renderDashboard();
    this.renderAgendaTable();
    this.renderClientsTable();
    this.renderFinanceiroTable();
    this.renderDespesasTable();
    this.populateClientSelectOptions();

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  // Atualiza indicadores dos menus
  updateBadges() {
    const rangeApps = this.filterByTopDateRange(this.appointments);
    const pendingApps = rangeApps.filter(a => a.paymentStatus !== 'Pago');
    const pendingCount = pendingApps.length;

    const navBadge = document.getElementById('nav-pending-badge');
    const finBadge = document.getElementById('fin-pending-badge');

    if (navBadge) navBadge.textContent = pendingCount;
    if (finBadge) finBadge.textContent = pendingCount;
  }

  // Renderiza a visão do Dashboard
  renderDashboard() {
    const rangeApps = this.filterByTopDateRange(this.appointments);

    const completedInPeriod = rangeApps.filter(a => a.status === 'Concluído').length;
    document.getElementById('dash-appointments-today').textContent = rangeApps.length;
    document.getElementById('dash-appointments-sub').textContent = `${completedInPeriod} concluída(s) no período`;

    const totalReceived = rangeApps.reduce((sum, a) => sum + (parseFloat(a.amountPaid) || 0), 0);
    document.getElementById('dash-received-month').textContent = formatCurrency(totalReceived);

    const pendingApps = rangeApps.filter(a => (parseFloat(a.price || 0) - parseFloat(a.amountPaid || 0)) > 0);
    const totalPending = pendingApps.reduce((sum, a) => sum + Math.max(0, (parseFloat(a.price || 0) - parseFloat(a.amountPaid || 0))), 0);
    
    document.getElementById('dash-pending-total').textContent = formatCurrency(totalPending);
    document.getElementById('dash-pending-count').textContent = `${pendingApps.length} cobrança(s) pendente(s) no período`;

    document.getElementById('dash-total-clients').textContent = this.clients.length;

    const todayListContainer = document.getElementById('dash-today-list');
    if (rangeApps.length === 0) {
      todayListContainer.innerHTML = `
        <div class="empty-state">
          <i data-lucide="calendar-x2"></i>
          <h4>Nenhuma consulta agendada neste período</h4>
          <p>Altere as datas no topo ou agende um novo atendimento.</p>
        </div>
      `;
    } else {
      const sortedPeriod = [...rangeApps].sort((a, b) => {
        const dateA = `${a.date} ${a.time}`;
        const dateB = `${b.date} ${b.time}`;
        return dateA.localeCompare(dateB);
      });

      todayListContainer.innerHTML = sortedPeriod.slice(0, 5).map(app => {
        const statusClass = app.paymentStatus.toLowerCase();
        return `
          <div class="appt-compact-item">
            <div class="appt-time-box">
              <div style="font-size:0.7rem;">${formatDateBR(app.date)}</div>
              ${app.time}
            </div>
            <div class="appt-details">
              <h4>${app.clientName}</h4>
              <p>${app.procedure} • Total: ${formatCurrency(app.price)} ${app.paymentStatus === 'Parcial' ? `(Pago: ${formatCurrency(app.amountPaid)})` : ''}</p>
            </div>
            <div>
              <span class="badge badge-${app.status.toLowerCase()}">${app.status}</span>
              <span class="badge badge-${statusClass}">${app.paymentStatus === 'Parcial' ? 'Pago Parcial' : app.paymentStatus}</span>
            </div>
          </div>
        `;
      }).join('');
    }

    const pendingListContainer = document.getElementById('dash-pending-list');
    if (pendingApps.length === 0) {
      pendingListContainer.innerHTML = `
        <div class="empty-state">
          <i data-lucide="check-circle-2"></i>
          <h4>Sem pendências no período</h4>
          <p>Todos os pagamentos foram liquidados neste intervalo!</p>
        </div>
      `;
    } else {
      pendingListContainer.innerHTML = pendingApps.slice(0, 4).map(app => {
        const rest = Math.max(0, app.price - (app.amountPaid || 0));
        return `
          <div class="pending-mini-item">
            <div class="pending-mini-info">
              <h4>${app.clientName}</h4>
              <p>${formatDateBR(app.date)} - ${app.procedure}</p>
              ${app.paymentStatus === 'Parcial' ? `<small style="color:var(--purple);">Já pago: ${formatCurrency(app.amountPaid)}</small>` : ''}
            </div>
            <div style="text-align: right;">
              <div class="pending-mini-val">${formatCurrency(rest)}</div>
              <button class="btn btn-sm btn-success" style="margin-top: 4px;" onclick="app.openQuickPayModal('${app.id}')">
                Registrar Pagamento
              </button>
            </div>
          </div>
        `;
      }).join('');
    }
  }

  // Renderiza a Tabela de Agenda
  renderAgendaTable() {
    const tbody = document.getElementById('agenda-table-body');
    const search = document.getElementById('agenda-search').value.toLowerCase();
    const filterDate = parseDateBR(document.getElementById('agenda-filter-date').value);
    const filterStatus = document.getElementById('agenda-filter-status').value;

    let filtered = this.filterByTopDateRange(this.appointments);

    if (search) {
      filtered = filtered.filter(a => 
        a.clientName.toLowerCase().includes(search) || 
        a.procedure.toLowerCase().includes(search)
      );
    }

    if (filterDate) {
      filtered = filtered.filter(a => a.date === filterDate);
    }

    if (filterStatus && filterStatus !== 'todos') {
      filtered = filtered.filter(a => a.status === filterStatus);
    }

    filtered.sort((a, b) => {
      const dateA = `${a.date} ${a.time}`;
      const dateB = `${b.date} ${b.time}`;
      return dateB.localeCompare(dateA);
    });

    if (filtered.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7">
            <div class="empty-state">
              <i data-lucide="calendar"></i>
              <h4>Nenhum agendamento encontrado no período</h4>
              <p>Altere o filtro de datas no topo ou realize um novo agendamento.</p>
            </div>
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = filtered.map(app => {
      const statusClass = app.paymentStatus.toLowerCase();
      const statusText = app.paymentStatus === 'Parcial' ? `Parcial (${formatCurrency(app.amountPaid)})` : app.paymentStatus;
      return `
        <tr>
          <td>
            <strong>${formatDateBR(app.date)}</strong>
            <div style="font-size:0.8rem; color: var(--text-muted);">${app.time} hs</div>
          </td>
          <td><strong>${app.clientName}</strong></td>
          <td>${app.procedure}</td>
          <td><strong>${formatCurrency(app.price)}</strong></td>
          <td>
            <select class="form-control" style="padding:0.2rem 0.5rem; font-size:0.8rem; width: auto;" onchange="app.changeApptStatus('${app.id}', this.value)">
              <option value="Agendado" ${app.status === 'Agendado' ? 'selected' : ''}>Agendado</option>
              <option value="Concluído" ${app.status === 'Concluído' ? 'selected' : ''}>Concluído</option>
              <option value="Cancelado" ${app.status === 'Cancelado' ? 'selected' : ''}>Cancelado</option>
            </select>
          </td>
          <td>
            <span class="badge badge-${statusClass}">${statusText}</span>
          </td>
          <td style="text-align: right;">
            <button class="btn btn-sm btn-secondary" title="Editar Data / Horário / Consulta" onclick="app.editAppointment('${app.id}')">
              <i data-lucide="edit-3"></i> Editar
            </button>
            <button class="btn btn-sm btn-ghost" style="color: var(--danger);" title="Excluir Consulta" onclick="app.deleteAppointment('${app.id}')">
              <i data-lucide="trash-2"></i>
            </button>
          </td>
        </tr>
      `;
    }).join('');
  }

  // Renderiza Tabela de Clientes
  renderClientsTable() {
    const tbody = document.getElementById('clientes-table-body');
    const search = document.getElementById('clientes-search').value.toLowerCase();

    let filtered = [...this.clients];

    if (search) {
      filtered = filtered.filter(c => 
        c.name.toLowerCase().includes(search) || 
        c.phone.includes(search) || 
        (c.email && c.email.toLowerCase().includes(search)) ||
        (c.cpf && c.cpf.includes(search))
      );
    }

    filtered.sort((a, b) => a.name.localeCompare(b.name));

    if (filtered.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6">
            <div class="empty-state">
              <i data-lucide="users"></i>
              <h4>Nenhum cliente encontrado</h4>
              <p>Cadastre novos clientes clicando no botão acima.</p>
            </div>
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = filtered.map(cli => {
      const clientAppts = this.appointments.filter(a => a.clientId === cli.id);
      return `
        <tr>
          <td><strong>${cli.name}</strong></td>
          <td>${cli.phone}</td>
          <td>${cli.email || '-'}</td>
          <td>${cli.cpf || '-'}</td>
          <td><span class="badge badge-agendado">${clientAppts.length} atendimento(s)</span></td>
          <td style="text-align: right;">
            <button class="btn btn-sm btn-secondary" title="Ver Histórico" onclick="app.viewClientDetails('${cli.id}')">
              <i data-lucide="eye"></i> Histórico
            </button>
            <button class="btn btn-sm btn-secondary" title="Editar Paciente" onclick="app.editClient('${cli.id}')">
              <i data-lucide="edit-3"></i> Editar
            </button>
            <button class="btn btn-sm btn-ghost" style="color: var(--danger);" title="Excluir Paciente" onclick="app.deleteClient('${cli.id}')">
              <i data-lucide="trash-2"></i> Excluir
            </button>
          </td>
        </tr>
      `;
    }).join('');
  }

  // Renderiza Tabela de Despesas
  getExpenseOccurrences(exp, rangeStart, rangeEnd) {
    const occurrences = [];
    if (!exp.date) return occurrences;
    if (!exp.recurring) {
      if (exp.date >= rangeStart && exp.date <= rangeEnd) {
        occurrences.push({ ...exp, occurrenceDate: exp.date, parentId: exp.id });
      }
      return occurrences;
    }

    const addMonthsToDate = (dateStr, months) => {
      const [year, month, day] = dateStr.split('-').map(Number);
      const base = new Date(year, month - 1, 1);
      base.setMonth(base.getMonth() + months);
      const lastDay = new Date(base.getFullYear(), base.getMonth() + 1, 0).getDate();
      base.setDate(Math.min(day, lastDay));
      return `${base.getFullYear()}-${String(base.getMonth() + 1).padStart(2, '0')}-${String(base.getDate()).padStart(2, '0')}`;
    };

    let occurrenceDate = exp.date;
    if (occurrenceDate > rangeEnd) return occurrences;

    while (occurrenceDate < rangeStart) {
      occurrenceDate = addMonthsToDate(occurrenceDate, 1);
      if (occurrenceDate > rangeEnd) return occurrences;
    }

    while (occurrenceDate <= rangeEnd) {
      occurrences.push({ ...exp, occurrenceDate, parentId: exp.id });
      occurrenceDate = addMonthsToDate(occurrenceDate, 1);
    }

    return occurrences;
  }

  renderDespesasTable() {
    const tbody = document.getElementById('despesas-table-body');
    const totalEl = document.getElementById('desp-total');
    const countEl = document.getElementById('desp-count');
    const netEl = document.getElementById('desp-net');

    const rangeApps = this.filterByTopDateRange(this.appointments);
    const visibleExpenses = this.expenses.flatMap(exp => this.getExpenseOccurrences(exp, this.startDate, this.endDate));
    const totalReceitas = rangeApps.reduce((sum, a) => sum + (parseFloat(a.amountPaid) || 0), 0);
    const totalDespesas = visibleExpenses.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);
    const saldoLiquido = totalReceitas - totalDespesas;

    if (totalEl) totalEl.textContent = formatCurrency(totalDespesas);
    if (countEl) countEl.textContent = `${visibleExpenses.length} lançamento(s) no período`;
    if (netEl) netEl.textContent = formatCurrency(saldoLiquido);

    if (!tbody) return;

    visibleExpenses.sort((a, b) => b.occurrenceDate.localeCompare(a.occurrenceDate));

    if (visibleExpenses.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6">
            <div class="empty-state">
              <i data-lucide="receipt"></i>
              <h4>Nenhuma despesa cadastrada</h4>
              <p>Adicione custos do consultório para acompanhar o saldo líquido.</p>
            </div>
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = visibleExpenses.map(exp => {
      const recurringBadge = exp.recurring ? '<span class="badge badge-parcial">Recorrente</span>' : '';
      const displayDate = formatDateBR(exp.occurrenceDate || exp.date);
      return `
      <tr>
        <td>${displayDate}</td>
        <td><strong>${exp.description}</strong> ${recurringBadge}</td>
        <td>${exp.category || 'Outros'}</td>
        <td><strong>${formatCurrency(exp.amount)}</strong></td>
        <td>${exp.notes || '-'}</td>
        <td style="text-align: right;">
          <button class="btn btn-sm btn-secondary" onclick="app.editExpense('${exp.parentId || exp.id}')">
            <i data-lucide="edit-3"></i> Editar
          </button>
          <button class="btn btn-sm btn-ghost" style="color: var(--danger);" onclick="app.deleteExpense('${exp.parentId || exp.id}')">
            <i data-lucide="trash-2"></i>
          </button>
        </td>
      </tr>
    `;
    }).join('');
  }

  // Renderiza Tabela Financeira
  renderFinanceiroTable() {
    const tbody = document.getElementById('financeiro-table-body');
    const search = document.getElementById('financeiro-search').value.toLowerCase();

    let rangeApps = this.filterByTopDateRange(this.appointments);

    const grandTotal = rangeApps.reduce((sum, a) => sum + (parseFloat(a.price) || 0), 0);
    const paidTotal = rangeApps.reduce((sum, a) => sum + (parseFloat(a.amountPaid) || 0), 0);
    const pendingTotal = Math.max(0, grandTotal - paidTotal);

    const paidCount = rangeApps.filter(a => a.paymentStatus === 'Pago').length;
    const pendingCount = rangeApps.filter(a => a.paymentStatus !== 'Pago').length;

    const visibleExpenses = this.expenses.flatMap(exp => this.getExpenseOccurrences(exp, this.startDate, this.endDate));
    const totalDespesas = visibleExpenses.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);
    const saldoLiquido = paidTotal - totalDespesas;

    document.getElementById('fin-stat-total').textContent = formatCurrency(grandTotal);
    document.getElementById('fin-stat-received').textContent = formatCurrency(paidTotal);
    document.getElementById('fin-stat-received-count').textContent = `${paidCount} pagamento(s) quitados no período`;
    
    document.getElementById('fin-stat-pending').textContent = formatCurrency(pendingTotal);
    document.getElementById('fin-stat-pending-count').textContent = `${pendingCount} lançamento(s) com saldo no período`;

    const finSummaryCards = document.querySelectorAll('#tab-financeiro .fin-card');
    if (finSummaryCards.length >= 3) {
      finSummaryCards[0].querySelector('.fin-desc').textContent = `Soma de todas as consultas no período`;
      finSummaryCards[1].querySelector('.fin-desc').textContent = `${formatCurrency(paidTotal)} recebidos e ${formatCurrency(totalDespesas)} descontados`;
      finSummaryCards[2].querySelector('.fin-desc').textContent = `Saldo líquido: ${formatCurrency(saldoLiquido)}`;
    }

    let filtered = [...rangeApps];

    if (this.finFilter === 'pendente') {
      filtered = filtered.filter(a => a.paymentStatus !== 'Pago');
    } else if (this.finFilter === 'pago') {
      filtered = filtered.filter(a => a.paymentStatus === 'Pago');
    }

    if (search) {
      filtered = filtered.filter(a => 
        a.clientName.toLowerCase().includes(search) || 
        a.procedure.toLowerCase().includes(search)
      );
    }

    filtered.sort((a, b) => b.date.localeCompare(a.date));

    if (filtered.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7">
            <div class="empty-state">
              <i data-lucide="wallet"></i>
              <h4>Nenhum registro financeiro encontrado no período</h4>
              <p>Altere o filtro de datas no topo ou os filtros de busca.</p>
            </div>
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = filtered.map(app => {
      const price = parseFloat(app.price || 0);
      const amountPaid = parseFloat(app.amountPaid || 0);
      const pendingBalance = Math.max(0, price - amountPaid);
      const statusClass = app.paymentStatus.toLowerCase();

      return `
        <tr>
          <td>${formatDateBR(app.date)}</td>
          <td><strong>${app.clientName}</strong></td>
          <td>${app.procedure}</td>
          <td>${app.paymentMethod || 'Não informado'}</td>
          <td>
            <strong>Total: ${formatCurrency(price)}</strong>
            <div style="font-size:0.78rem; color:var(--success);">Pago: ${formatCurrency(amountPaid)}</div>
            ${pendingBalance > 0 ? `<div style="font-size:0.78rem; color:var(--warning);">A receber: ${formatCurrency(pendingBalance)}</div>` : ''}
          </td>
          <td>
            <span class="badge badge-${statusClass}">${app.paymentStatus === 'Parcial' ? 'Pago Parcial' : app.paymentStatus}</span>
          </td>
          <td style="text-align: right;">
            <button class="btn btn-sm btn-secondary" onclick="app.openQuickPayModal('${app.id}')" style="margin-right: 0.35rem;">
              <i data-lucide="credit-card"></i> Pagamento
            </button>
            <button class="btn btn-sm btn-secondary" onclick="app.editAppointment('${app.id}')" style="margin-right: 0.35rem;">
              <i data-lucide="edit-3"></i> Editar
            </button>
            <button class="btn btn-sm btn-ghost" style="color: var(--danger);" onclick="app.deleteAppointment('${app.id}')" title="Excluir lançamento">
              <i data-lucide="trash-2"></i>
            </button>
          </td>
        </tr>
      `;
    }).join('');
  }

  // Preenche seletor de clientes
  populateClientSelectOptions() {
    const select = document.getElementById('appt-client-id');
    const currentValue = select.value;

    select.innerHTML = '<option value="">Selecione um cliente...</option>';
    this.clients.sort((a, b) => a.name.localeCompare(b.name)).forEach(cli => {
      const opt = document.createElement('option');
      opt.value = cli.id;
      opt.textContent = `${cli.name} (${cli.phone})`;
      select.appendChild(opt);
    });

    select.value = currentValue;
  }

  // Modal de Cliente
  openClientModal(clientId = null) {
    document.getElementById('form-client').reset();
    document.getElementById('client-id').value = '';
    document.getElementById('modal-client-title').textContent = 'Cadastrar Novo Cliente';

    if (clientId) {
      const cli = this.clients.find(c => c.id === clientId);
      if (cli) {
        document.getElementById('client-id').value = cli.id;
        document.getElementById('client-name').value = cli.name;
        document.getElementById('client-phone').value = cli.phone;
        document.getElementById('client-email').value = cli.email || '';
        document.getElementById('client-cpf').value = cli.cpf || '';
        document.getElementById('client-dob').value = cli.dob || '';
        document.getElementById('client-notes').value = cli.notes || '';
        document.getElementById('modal-client-title').textContent = 'Editar Dados do Cliente';
      }
    }

    document.getElementById('modal-client').classList.add('active');
  }

  closeClientModal() {
    document.getElementById('modal-client').classList.remove('active');
  }

  saveClientForm() {
    const id = document.getElementById('client-id').value;
    const name = document.getElementById('client-name').value.trim();
    const phone = document.getElementById('client-phone').value.trim();
    const email = document.getElementById('client-email').value.trim();
    const cpf = document.getElementById('client-cpf').value.trim();
    const dob = document.getElementById('client-dob').value;
    const notes = document.getElementById('client-notes').value.trim();

    if (!name || !phone) {
      this.showToast('Por favor, preencha o Nome e Telefone.', 'warning');
      return;
    }

    let savedClient = null;

    if (id) {
      const idx = this.clients.findIndex(c => c.id === id);
      if (idx !== -1) {
        this.clients[idx] = { ...this.clients[idx], name, phone, email, cpf, dob, notes };
        savedClient = this.clients[idx];
        
        this.appointments.forEach(app => {
          if (app.clientId === id) {
            app.clientName = name;
            this.syncAppointmentToCloud(app);
          }
        });

        this.showToast('Dados do cliente atualizados com sucesso!', 'success');
      }
    } else {
      savedClient = {
        id: 'cli-' + Date.now(),
        name,
        phone,
        email,
        cpf,
        dob,
        notes,
        createdAt: getTodayStr()
      };
      this.clients.push(savedClient);
      this.showToast('Cliente cadastrado com sucesso!', 'success');
    }

    this.saveStore();
    if (savedClient) this.syncClientToCloud(savedClient);
    this.closeClientModal();
    this.render();
  }

  editClient(id) {
    this.openClientModal(id);
  }

  deleteClient(id) {
    const cli = this.clients.find(c => c.id === id);
    if (!cli) return;

    if (confirm(`Tem certeza que deseja excluir o paciente "${cli.name}"?\nTodas as consultas deste paciente também serão removidas.`)) {
      this.clients = this.clients.filter(c => c.id !== id);
      
      const apptsToDelete = this.appointments.filter(a => a.clientId === id);
      apptsToDelete.forEach(a => this.deleteAppointmentFromCloud(a.id));

      this.appointments = this.appointments.filter(a => a.clientId !== id);

      this.saveStore();
      this.deleteClientFromCloud(id);
      this.render();
      this.showToast('Paciente e histórico excluídos.', 'info');
    }
  }

  viewClientDetails(clientId) {
    const cli = this.clients.find(c => c.id === clientId);
    if (!cli) return;

    document.getElementById('modal-client-detail-name').textContent = cli.name;

    const infoBox = document.getElementById('client-detail-info-box');
    infoBox.innerHTML = `
      <div class="client-detail-item">
        <label>Telefone / WhatsApp</label>
        <p>${cli.phone}</p>
      </div>
      <div class="client-detail-item">
        <label>E-mail</label>
        <p>${cli.email || '-'}</p>
      </div>
      <div class="client-detail-item">
        <label>CPF</label>
        <p>${cli.cpf || '-'}</p>
      </div>
      <div class="client-detail-item">
        <label>Data de Nascimento</label>
        <p>${cli.dob ? formatDateBR(cli.dob) : '-'}</p>
      </div>
      <div class="client-detail-item" style="grid-column: span 2;">
        <label>Observações / Histórico Médico</label>
        <p>${cli.notes || 'Sem observações cadastradas.'}</p>
      </div>
    `;

    const tbody = document.getElementById('client-history-tbody');
    const clientAppts = this.appointments
      .filter(a => a.clientId === clientId)
      .sort((a, b) => b.date.localeCompare(a.date));

    if (clientAppts.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:1.5rem; color:var(--text-muted);">Nenhuma consulta registrada para este cliente.</td></tr>`;
    } else {
      tbody.innerHTML = clientAppts.map(app => `
        <tr>
          <td>${formatDateBR(app.date)} às ${app.time}</td>
          <td>${app.procedure}</td>
          <td>${formatCurrency(app.price)} ${app.amountPaid < app.price ? `(Pago: ${formatCurrency(app.amountPaid)})` : ''}</td>
          <td><span class="badge badge-${app.status.toLowerCase()}">${app.status}</span></td>
          <td><span class="badge badge-${app.paymentStatus.toLowerCase()}">${app.paymentStatus === 'Parcial' ? 'Pago Parcial' : app.paymentStatus}</span></td>
        </tr>
      `).join('');
    }

    document.getElementById('modal-client-details').classList.add('active');
    // store current client id for report generation
    document.getElementById('modal-client-details').setAttribute('data-client-id', clientId);
  }

  closeClientDetailsModal() {
    document.getElementById('modal-client-details').classList.remove('active');
  }

  // Modal de Agendamento
  openAppointmentModal(appId = null) {
    document.getElementById('form-appointment').reset();
    document.getElementById('appointment-id').value = '';
    document.getElementById('modal-appointment-title').textContent = 'Agendar Consulta';
    document.getElementById('appt-date').value = formatDateBR(getTodayStr());
    document.getElementById('appt-time').value = '10:00';
    document.getElementById('group-amount-paid').style.display = 'none';

    this.populateClientSelectOptions();

    if (appId) {
      const app = this.appointments.find(a => a.id === appId);
      if (app) {
        document.getElementById('appointment-id').value = app.id;
        document.getElementById('appt-client-id').value = app.clientId;
        document.getElementById('appt-date').value = formatDateBR(app.date);
        document.getElementById('appt-time').value = app.time;
        document.getElementById('appt-procedure').value = app.procedure;
        document.getElementById('appt-price').value = app.price;
        document.getElementById('appt-payment-method').value = app.paymentMethod || 'Pix';
        document.getElementById('appt-status').value = app.status;
        document.getElementById('appt-payment-status').value = app.paymentStatus;
        document.getElementById('appt-amount-paid').value = app.amountPaid || 0;
        document.getElementById('appt-notes').value = app.notes || '';
        document.getElementById('modal-appointment-title').textContent = 'Editar Consulta & Data';

        if (app.paymentStatus !== 'Pendente') {
          document.getElementById('group-amount-paid').style.display = 'flex';
        }
      }
    }

    document.getElementById('modal-appointment').classList.add('active');
  }

  closeAppointmentModal() {
    document.getElementById('modal-appointment').classList.remove('active');
  }

  saveAppointmentForm() {
    const id = document.getElementById('appointment-id').value;
    const clientId = document.getElementById('appt-client-id').value;
    const date = parseDateBR(document.getElementById('appt-date').value);
    const time = document.getElementById('appt-time').value;
    const procedure = document.getElementById('appt-procedure').value.trim();
    const price = parseFloat(document.getElementById('appt-price').value);
    const paymentMethod = document.getElementById('appt-payment-method').value;
    const status = document.getElementById('appt-status').value;
    const paymentStatus = document.getElementById('appt-payment-status').value;
    let amountPaid = parseFloat(document.getElementById('appt-amount-paid').value || 0);
    const notes = document.getElementById('appt-notes').value.trim();

    if (!clientId || !date || !time || !procedure || isNaN(price)) {
      this.showToast('Preencha todos os campos obrigatórios.', 'warning');
      return;
    }

    if (paymentStatus === 'Pago') {
      amountPaid = price;
    } else if (paymentStatus === 'Pendente') {
      amountPaid = 0;
    }

    const clientObj = this.clients.find(c => c.id === clientId);
    const clientName = clientObj ? clientObj.name : 'Cliente';

    let savedAppt = null;

    if (id) {
      const idx = this.appointments.findIndex(a => a.id === id);
      if (idx !== -1) {
        this.appointments[idx] = {
          ...this.appointments[idx],
          clientId,
          clientName,
          date,
          time,
          procedure,
          price,
          amountPaid,
          paymentMethod,
          status,
          paymentStatus,
          notes
        };
        savedAppt = this.appointments[idx];
        this.showToast('Consulta e data atualizadas com sucesso!', 'success');
      }
    } else {
      savedAppt = {
        id: 'app-' + Date.now(),
        clientId,
        clientName,
        date,
        time,
        procedure,
        price,
        amountPaid,
        paymentMethod,
        status,
        paymentStatus,
        notes
      };
      this.appointments.push(savedAppt);
      this.showToast('Consulta agendada com sucesso!', 'success');
    }

    this.saveStore();
    if (savedAppt) this.syncAppointmentToCloud(savedAppt);
    this.closeAppointmentModal();
    this.render();
  }

  editAppointment(id) {
    this.openAppointmentModal(id);
  }

  deleteAppointment(id) {
    if (confirm('Tem certeza que deseja excluir esta consulta do sistema?')) {
      this.appointments = this.appointments.filter(a => a.id !== id);
      this.saveStore();
      this.deleteAppointmentFromCloud(id);
      this.render();
      this.showToast('Consulta excluída com sucesso.', 'info');
    }
  }

  changeApptStatus(appId, newStatus) {
    const app = this.appointments.find(a => a.id === appId);
    if (app) {
      app.status = newStatus;
      this.saveStore();
      this.syncAppointmentToCloud(app);
      this.render();
      this.showToast(`Status da consulta alterado para "${newStatus}".`, 'success');
    }
  }

  // Modal de Despesas
  openExpenseModal(expenseId = null) {
    document.getElementById('form-expense').reset();
    document.getElementById('expense-id').value = '';
    document.getElementById('expense-date').value = formatDateBR(getTodayStr());
    document.getElementById('modal-expense-title').textContent = 'Registrar Despesa';

    if (expenseId) {
      const expense = this.expenses.find(e => e.id === expenseId);
      if (expense) {
        document.getElementById('expense-id').value = expense.id;
        document.getElementById('expense-description').value = expense.description;
        document.getElementById('expense-category').value = expense.category || 'Outros';
        document.getElementById('expense-amount').value = expense.amount;
        document.getElementById('expense-date').value = formatDateBR(expense.date);
        document.getElementById('expense-recurring').checked = Boolean(expense.recurring);
        document.getElementById('expense-notes').value = expense.notes || '';
        document.getElementById('modal-expense-title').textContent = 'Editar Despesa';
      }
    }

    document.getElementById('modal-expense').classList.add('active');
  }

  closeExpenseModal() {
    document.getElementById('modal-expense').classList.remove('active');
  }

  saveExpenseForm() {
    const id = document.getElementById('expense-id').value;
    const description = document.getElementById('expense-description').value.trim();
    const category = document.getElementById('expense-category').value;
    const amount = parseFloat(document.getElementById('expense-amount').value || 0);
    const date = parseDateBR(document.getElementById('expense-date').value);
    const recurring = document.getElementById('expense-recurring').checked;
    const notes = document.getElementById('expense-notes').value.trim();

    if (!description || !date || isNaN(amount) || amount <= 0) {
      this.showToast('Preencha descrição, data e um valor válido da despesa.', 'warning');
      return;
    }

    if (id) {
      const idx = this.expenses.findIndex(e => e.id === id);
      if (idx !== -1) {
        this.expenses[idx] = { ...this.expenses[idx], description, category, amount, date, recurring, notes };
        this.showToast('Despesa atualizada com sucesso!', 'success');
      }
    } else {
      this.expenses.push({ id: 'exp-' + Date.now(), description, category, amount, date, recurring, notes });
      this.showToast('Despesa cadastrada com sucesso!', 'success');
    }

    this.saveStore();
    this.closeExpenseModal();
    this.render();
  }

  editExpense(id) {
    this.openExpenseModal(id);
  }

  deleteExpense(id) {
    if (confirm('Tem certeza que deseja excluir esta despesa?')) {
      this.expenses = this.expenses.filter(e => e.id !== id);
      this.saveStore();
      this.render();
      this.showToast('Despesa removida.', 'info');
    }
  }

  // Modal Rápido de Pagamento
  openQuickPayModal(appId) {
    const app = this.appointments.find(a => a.id === appId);
    if (!app) return;

    document.getElementById('pay-appt-id').value = app.id;
    document.getElementById('pay-total-display').value = formatCurrency(app.price);
    document.getElementById('pay-status-select').value = app.paymentStatus || 'Pago';

    const inputAmount = document.getElementById('pay-amount-input');
    if (app.paymentStatus === 'Pago') {
      inputAmount.value = app.price.toFixed(2);
    } else if (app.paymentStatus === 'Parcial') {
      inputAmount.value = (app.amountPaid || (app.price / 2)).toFixed(2);
    } else {
      inputAmount.value = app.price.toFixed(2);
    }

    document.getElementById('modal-payment-quick').classList.add('active');
  }

  closeQuickPayModal() {
    document.getElementById('modal-payment-quick').classList.remove('active');
  }

  saveQuickPayForm() {
    const appId = document.getElementById('pay-appt-id').value;
    const app = this.appointments.find(a => a.id === appId);
    if (!app) return;

    const newStatus = document.getElementById('pay-status-select').value;
    let newAmount = parseFloat(document.getElementById('pay-amount-input').value || 0);

    if (newStatus === 'Pago') {
      newAmount = app.price;
    } else if (newStatus === 'Pendente') {
      newAmount = 0;
    } else if (newStatus === 'Parcial') {
      if (newAmount >= app.price) {
        newAmount = app.price;
        app.paymentStatus = 'Pago';
      } else {
        app.paymentStatus = 'Parcial';
      }
    }

    app.paymentStatus = newStatus;
    app.amountPaid = newAmount;

    this.saveStore();
    this.syncAppointmentToCloud(app);
    this.closeQuickPayModal();
    this.render();

    if (newStatus === 'Pago') {
      this.showToast(`Pagamento total de ${formatCurrency(app.price)} confirmado!`, 'success');
    } else if (newStatus === 'Parcial') {
      this.showToast(`Pagamento parcial de ${formatCurrency(newAmount)} registrado!`, 'success');
    } else {
      this.showToast(`Pagamento alterado para Pendente.`, 'warning');
    }
  }

  generateReport(type) {
    const rangeApps = this.filterByTopDateRange(this.appointments);
    const visibleExpenses = this.expenses.flatMap(exp => this.getExpenseOccurrences(exp, this.startDate, this.endDate));
    const totalReceitas = rangeApps.reduce((sum, a) => sum + (parseFloat(a.amountPaid) || 0), 0);
    const totalRecebimentos = rangeApps.reduce((sum, a) => sum + (parseFloat(a.price) || 0), 0);
    const totalDespesas = visibleExpenses.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);
    const saldoLiquido = totalReceitas - totalDespesas;

    let report = '';

    if (type === 'paciente') {
      report = ['RELATÓRIO POR PACIENTE', '', `Período: ${formatDateBR(this.startDate)} a ${formatDateBR(this.endDate)}`, ''].join('\n');
      const clientsWithValue = this.clients.map(client => {
        const clientApps = rangeApps.filter(a => a.clientId === client.id);
        const total = clientApps.reduce((sum, a) => sum + (parseFloat(a.amountPaid) || 0), 0);
        return { client, total, count: clientApps.length };
      }).filter(item => item.total > 0 || item.count > 0);

      if (clientsWithValue.length === 0) {
        report += 'Nenhuma receita registrada para os pacientes neste período.';
      } else {
        report += clientsWithValue.map(item => `${item.client.name} | Consultas: ${item.count} | Recebido: ${formatCurrency(item.total)}`).join('\n');
      }
    } else if (type === 'receitas') {
      report = ['RELATÓRIO DE RECEITAS', '', `Período: ${formatDateBR(this.startDate)} a ${formatDateBR(this.endDate)}`, ''].join('\n');
      report += `Total de receitas recebidas: ${formatCurrency(totalReceitas)}\n`;
      report += `Total de consultas: ${formatCurrency(totalRecebimentos)}\n`;
      report += `Receitas pendentes: ${formatCurrency(Math.max(0, totalRecebimentos - totalReceitas))}`;
    } else if (type === 'financeiro') {
      report = ['RELATÓRIO FINANCEIRO', '', `Período: ${formatDateBR(this.startDate)} a ${formatDateBR(this.endDate)}`, ''].join('\n');
      report += `Receitas recebidas: ${formatCurrency(totalReceitas)}\n`;
      report += `Despesas: ${formatCurrency(totalDespesas)}\n`;
      report += `Saldo líquido: ${formatCurrency(saldoLiquido)}`;
    } else if (type === 'despesas') {
      const visibleExpenses = this.expenses.flatMap(exp => this.getExpenseOccurrences(exp, this.startDate, this.endDate));
      report = ['RELATÓRIO DE DESPESAS', '', `Período: ${formatDateBR(this.startDate)} a ${formatDateBR(this.endDate)}`, ''].join('\n');
      if (visibleExpenses.length === 0) {
        report += 'Nenhuma despesa cadastrada para este período.';
      } else {
        report += visibleExpenses.map(exp => `${formatDateBR(exp.occurrenceDate || exp.date)} | ${exp.category || 'Outros'} | ${exp.description}${exp.recurring ? ' (Recorrente)' : ''} | ${formatCurrency(exp.amount)}`).join('\n');
      }
    }

    const output = document.getElementById('report-output');
    if (output) output.value = report;
    this.showToast('Relatório gerado com sucesso!', 'success');
  }

  copyReport() {
    const output = document.getElementById('report-output');
    if (!output || !output.value) {
      this.showToast('Gere um relatório antes de copiar.', 'warning');
      return;
    }

    navigator.clipboard.writeText(output.value).then(() => {
      this.showToast('Relatório copiado para a área de transferência.', 'success');
    }).catch(() => {
      this.showToast('Não foi possível copiar automaticamente.', 'warning');
    });
  }

  printReport() {
    const output = document.getElementById('report-output');
    if (!output || !output.value) {
      this.showToast('Gere um relatório antes de imprimir.', 'warning');
      return;
    }

    this._printTextWindow('Relatório', output.value);
  }

  // Print arbitrary text in a simple window
  _printTextWindow(title, text) {
    const html = `
      <html>
        <head>
          <title>${title}</title>
          <style>
            body { font-family: Arial, Helvetica, sans-serif; padding: 20px; color: #111; }
            .report-header { display: flex; align-items: center; gap: 16px; margin-bottom: 20px; }
            .report-logo { height: 72px; width: auto; max-width: 220px; object-fit: contain; }
            .report-title { margin: 0; font-size: 1.4rem; }
            .report-subtitle { margin: 4px 0 0; color: #555; }
            pre { white-space: pre-wrap; font-family: Consolas, monospace; font-size: 0.95rem; line-height: 1.4; }
            hr { margin: 20px 0; border: none; border-top: 1px solid #ccc; }
          </style>
        </head>
        <body>
          <div class="report-header">
            <img src="Patricia.avif" class="report-logo" alt="Logo">
            <div>
              <h1 class="report-title">${APP_BRAND_NAME}</h1>
              <p class="report-subtitle">${APP_BRAND_SUBTITLE}</p>
            </div>
          </div>
          <hr>
          <h2>${title}</h2>
          <pre>${text}</pre>
        </body>
      </html>
    `;
    const w = window.open('', '', 'width=900,height=700');
    w.document.write(html);
    w.document.close();
    w.focus();
    w.print();
  }

  // Generate and print report for current client shown in modal
  printCurrentClientReport() {
    const modal = document.getElementById('modal-client-details');
    const clientId = modal ? modal.getAttribute('data-client-id') : null;
    if (!clientId) {
      this.showToast('Abra o detalhe do cliente antes de imprimir o relatório.', 'warning');
      return;
    }
    const cli = this.clients.find(c => c.id === clientId);
    if (!cli) return;

    const clientAppts = this.appointments.filter(a => a.clientId === clientId).sort((a,b)=> b.date.localeCompare(a.date));
    const totalReceived = clientAppts.reduce((sum,a)=> sum + (parseFloat(a.amountPaid)||0),0);
    const totalDue = clientAppts.reduce((sum,a)=> sum + Math.max(0,(parseFloat(a.price)||0) - (parseFloat(a.amountPaid)||0)),0);

    let text = `RELATÓRIO INDIVIDUAL: ${cli.name}\n`;
    text += `Período: ${formatDateBR(this.startDate)} a ${formatDateBR(this.endDate)}\n`;
    text += `Telefone: ${cli.phone} | E-mail: ${cli.email || '-'} | CPF: ${cli.cpf || '-'}\n\n`;
    if (clientAppts.length === 0) {
      text += 'Nenhuma consulta registrada para este paciente.';
    } else {
      text += 'Consultas:\n';
      text += clientAppts.map(a => `${formatDateBR(a.date)} ${a.time} | ${a.procedure} | Valor: ${formatCurrency(a.price)} | Pago: ${formatCurrency(a.amountPaid)} | Status: ${a.paymentStatus}`).join('\n');
      text += `\n\nTotal recebido pelo paciente: ${formatCurrency(totalReceived)}\nTotal a receber: ${formatCurrency(totalDue)}`;
    }

    this._printTextWindow(`Relatório - ${cli.name}`, text);
  }

  // Generate a report for all clients (summary)
  generateAllClientsReport() {
    const rangeApps = this.filterByTopDateRange(this.appointments);
    let text = 'RELATÓRIO TOTAL DE CLIENTES\n';
    text += `Período: ${formatDateBR(this.startDate)} a ${formatDateBR(this.endDate)}\n\n`;

    const list = this.clients.map(c => {
      const apps = rangeApps.filter(a => a.clientId === c.id);
      const received = apps.reduce((s,a)=> s + (parseFloat(a.amountPaid)||0),0);
      return { name: c.name, count: apps.length, received };
    }).filter(i=> i.count > 0);

    if (list.length === 0) {
      text += 'Nenhum registro de clientes no período.';
    } else {
      text += list.map(i => `${i.name} | Consultas: ${i.count} | Recebido: ${formatCurrency(i.received)}`).join('\n');
      const total = list.reduce((s,i)=> s + i.received, 0);
      text += `\n\nTotal recebido (todos clientes): ${formatCurrency(total)}`;
    }

    this._printTextWindow('Relatório Total de Clientes', text);
  }

  // Exportar Backup JSON
  exportBackup() {
    const data = {
      clients: this.clients,
      appointments: this.appointments,
      expenses: this.expenses,
      exportedAt: new Date().toISOString()
    };

    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup_consultorio_${getTodayStr()}.json`;
    a.click();
    URL.revokeObjectURL(url);

    this.showToast('Backup baixado com sucesso!', 'success');
  }

  // Importar Backup JSON
  importBackup(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (parsed && Array.isArray(parsed.clients) && Array.isArray(parsed.appointments)) {
          this.clients = parsed.clients;
          this.appointments = parsed.appointments;
          this.expenses = Array.isArray(parsed.expenses) ? parsed.expenses : [];
          this.saveStore();

          if (this.db) {
            this.clients.forEach(c => this.syncClientToCloud(c));
            this.appointments.forEach(a => this.syncAppointmentToCloud(a));
          }

          this.render();
          this.showToast('Backup restaurado com sucesso!', 'success');
        } else {
          this.showToast('Arquivo de backup inválido.', 'danger');
        }
      } catch (err) {
        this.showToast('Erro ao ler o arquivo JSON.', 'danger');
      }
    };
    reader.readAsText(file);
  }

  // Notificações Toast
  showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    const icons = {
      success: 'check-circle-2',
      warning: 'alert-triangle',
      danger: 'x-circle',
      info: 'info'
    };

    toast.innerHTML = `
      <i data-lucide="${icons[type] || 'info'}"></i>
      <div>${message}</div>
    `;

    container.appendChild(toast);

    if (window.lucide) {
      window.lucide.createIcons();
    }

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 4500);
  }
}

// Instanciar a aplicação
document.addEventListener('DOMContentLoaded', () => {
  window.app = new ConsultorioApp();

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js')
      .then(reg => console.log('[PWA] Service Worker registrado:', reg.scope))
      .catch(err => console.log('[PWA] Falha Service Worker:', err));
  }
});

// oi
/**
 * Consultório Control - Bootstrap estável + módulos essenciais
 * Restaura login, navegação, clientes, agenda e financeiro básicos.
 */

const LOGIN_DEFAULT_USERNAME = 'Patricia';
const LOGIN_DEFAULT_PASSWORD = 'Flora1658';
const LOGIN_USER_STORAGE_KEY = 'consultorio_login_user';
const LOGIN_PASSWORD_STORAGE_KEY = 'consultorio_login_password';
const SOUND_ENABLED_STORAGE_KEY = 'consultorio_sound_enabled';
const REMINDER_MINS_STORAGE_KEY = 'consultorio_reminder_mins';
const FIREBASE_CONFIG_STORAGE_KEY = 'consultorio_firebase_config';
const CLIENT_GROUPS_STORAGE_KEY = 'consultorio_client_groups';
const DEFAULT_FIREBASE_CONFIG = {
  apiKey: 'AIzaSyCKFg8ypyYLRbD8PoeP9NqO2KHBrmN70uk',
  authDomain: 'consultorio-a07c8.firebaseapp.com',
  projectId: 'consultorio-a07c8',
  storageBucket: 'consultorio-a07c8.firebasestorage.app',
  messagingSenderId: '399470846657',
  appId: '1:399470846657:web:dc9ac3d7af7c348100aa40',
  measurementId: 'G-68H2HBV9MB'
};

const getTodayStr = () => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

const parseIsoDate = (isoDate) => {
  if (!isoDate || !/^\d{4}-\d{2}-\d{2}$/.test(String(isoDate))) return null;
  const [y, m, d] = String(isoDate).split('-').map((v) => Number(v));
  return new Date(y, m - 1, d);
};

const addDaysIso = (isoDate, days) => {
  const base = parseIsoDate(isoDate);
  if (!base) return isoDate;
  base.setDate(base.getDate() + Number(days || 0));
  const y = base.getFullYear();
  const m = String(base.getMonth() + 1).padStart(2, '0');
  const d = String(base.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const getWeekStartMondayIso = (isoDate) => {
  const base = parseIsoDate(isoDate);
  if (!base) return isoDate;
  const day = base.getDay();
  const delta = day === 0 ? -6 : 1 - day;
  base.setDate(base.getDate() + delta);
  const y = base.getFullYear();
  const m = String(base.getMonth() + 1).padStart(2, '0');
  const d = String(base.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const weekdayShortPt = (isoDate) => {
  const d = parseIsoDate(isoDate);
  if (!d) return '-';
  return d.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '');
};

const formatDateBR = (isoDate) => {
  if (!isoDate || !/^\d{4}-\d{2}-\d{2}$/.test(String(isoDate))) return '-';
  const [y, m, d] = String(isoDate).split('-');
  return `${d}/${m}/${y}`;
};

const formatCurrency = (value) => {
  const num = Number(value || 0);
  return num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

const toNumber = (value) => {
  const parsed = parseFloat(String(value || '0').replace(',', '.'));
  return Number.isFinite(parsed) ? parsed : 0;
};

const safeText = (value) => String(value == null ? '' : value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');

const ensureLoginCredentials = () => {
  try {
    if (!localStorage.getItem(LOGIN_USER_STORAGE_KEY)) {
      localStorage.setItem(LOGIN_USER_STORAGE_KEY, LOGIN_DEFAULT_USERNAME);
    }
    if (!localStorage.getItem(LOGIN_PASSWORD_STORAGE_KEY)) {
      localStorage.setItem(LOGIN_PASSWORD_STORAGE_KEY, LOGIN_DEFAULT_PASSWORD);
    }
  } catch (err) {
    console.log('Falha ao inicializar credenciais locais:', err);
  }
};

const getLoginCredentials = () => {
  ensureLoginCredentials();
  try {
    return {
      username: localStorage.getItem(LOGIN_USER_STORAGE_KEY) || LOGIN_DEFAULT_USERNAME,
      password: localStorage.getItem(LOGIN_PASSWORD_STORAGE_KEY) || LOGIN_DEFAULT_PASSWORD
    };
  } catch (err) {
    return { username: LOGIN_DEFAULT_USERNAME, password: LOGIN_DEFAULT_PASSWORD };
  }
};

class ConsultorioApp {
  constructor() {
    this.clients = [];
    this.appointments = [];
    this.expenses = [];
    this.currentTab = 'dashboard';
    this.localLoginUnlocked = false;
    this.financeViewFilter = 'all';
    this.soundEnabled = true;
    this.reminderMinutes = 15;
    this.agendaViewMode = 'calendar';
    this.agendaCalendarStartDate = getWeekStartMondayIso(getTodayStr());
    this.firebaseConfig = null;
    this.firebaseApp = null;
    this.firebaseDb = null;
    this.firebaseConnected = false;
    this.clientGroups = [];
    this.dashboardLastActiveCardId = 'dash-card-consultas';
    this.dashboardCardByTab = {
      agenda: 'dash-card-consultas',
      financeiro: 'dash-card-resultado',
      clientes: 'dash-card-clientes'
    };
    this.lastDashboardCardAction = '';
    this.lastDashboardCardActionAt = 0;
    this.loadStore();
  }

  setDashboardCardActive(cardId, animate = true) {
    const cards = document.querySelectorAll('.stats-grid .stat-card');
    cards.forEach((card) => {
      const isActive = card.id === cardId;
      card.classList.toggle('active', isActive);
      card.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });

    const selectedCard = document.getElementById(cardId);
    if (selectedCard && animate) {
      selectedCard.classList.remove('is-triggered');
      // Restart transient click animation for clear action feedback.
      void selectedCard.offsetWidth;
      selectedCard.classList.add('is-triggered');
    }
  }

  rememberDashboardCardForTab(cardId, targetTab) {
    if (!cardId) return;
    this.dashboardLastActiveCardId = cardId;
    if (targetTab === 'agenda' || targetTab === 'financeiro' || targetTab === 'clientes') {
      this.dashboardCardByTab[targetTab] = cardId;
    }
  }

  syncDashboardCardFromTab(currentTab, previousTab = '') {
    let cardId = '';

    if (currentTab === 'agenda' || currentTab === 'financeiro' || currentTab === 'clientes') {
      cardId = this.dashboardCardByTab[currentTab] || '';
    } else if (currentTab === 'dashboard') {
      if (previousTab === 'agenda' || previousTab === 'financeiro' || previousTab === 'clientes') {
        cardId = this.dashboardCardByTab[previousTab] || this.dashboardLastActiveCardId;
      } else {
        cardId = this.dashboardLastActiveCardId;
      }
    }

    if (cardId) this.setDashboardCardActive(cardId, false);
  }

  loadStore() {
    try {
      const c = JSON.parse(localStorage.getItem('consultorio_clients') || '[]');
      const a = JSON.parse(localStorage.getItem('consultorio_appointments') || '[]');
      const e = JSON.parse(localStorage.getItem('consultorio_expenses') || '[]');
      const g = JSON.parse(localStorage.getItem(CLIENT_GROUPS_STORAGE_KEY) || '[]');
      this.clients = Array.isArray(c) ? c : [];
      this.appointments = Array.isArray(a) ? a : [];
      this.expenses = Array.isArray(e) ? e : [];
      this.clientGroups = Array.isArray(g) ? g.filter((item) => String(item || '').trim()) : [];
      if (!this.clientGroups.length) {
        this.clientGroups = this.collectClientGroupsFromClients();
      }
    } catch (err) {
      console.log('Falha ao carregar dados locais:', err);
      this.clients = [];
      this.appointments = [];
      this.expenses = [];
      this.clientGroups = [];
    }
  }

  saveStore() {
    localStorage.setItem('consultorio_clients', JSON.stringify(this.clients));
    localStorage.setItem('consultorio_appointments', JSON.stringify(this.appointments));
    localStorage.setItem('consultorio_expenses', JSON.stringify(this.expenses));
    localStorage.setItem(CLIENT_GROUPS_STORAGE_KEY, JSON.stringify(this.clientGroups));
  }

  normalizeClientGroupName(groupName) {
    return String(groupName || '').replace(/\s+/g, ' ').trim();
  }

  normalizeCep(value) {
    return String(value || '').replace(/\D/g, '').slice(0, 8);
  }

  formatCep(value) {
    const digits = this.normalizeCep(value);
    if (digits.length <= 5) return digits;
    return `${digits.slice(0, 5)}-${digits.slice(5)}`;
  }

  formatDobDisplay(value) {
    const digits = String(value || '').replace(/\D/g, '').slice(0, 8);
    if (digits.length <= 2) return digits;
    if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
  }

  formatDobForInput(value) {
    const raw = String(value || '').trim();
    if (!raw) return '';

    if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
      const [year, month, day] = raw.split('-');
      return `${day}/${month}/${year}`;
    }

    return this.formatDobDisplay(raw);
  }

  normalizeDobToIso(value) {
    const raw = String(value || '').trim();
    if (!raw) return '';
    if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw;

    const digits = raw.replace(/\D/g, '');
    if (digits.length !== 8) return '';

    const day = Number(digits.slice(0, 2));
    const month = Number(digits.slice(2, 4));
    const year = Number(digits.slice(4, 8));
    if (!Number.isFinite(day) || !Number.isFinite(month) || !Number.isFinite(year)) return '';

    const parsed = new Date(year, month - 1, day);
    if (
      parsed.getFullYear() !== year
      || parsed.getMonth() !== month - 1
      || parsed.getDate() !== day
    ) {
      return '';
    }

    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  }

  async fillAddressByCep(rawCep) {
    const cepInput = document.getElementById('client-cep');
    const cep = this.normalizeCep(rawCep);

    if (cepInput) cepInput.value = this.formatCep(cep);
    if (cep.length !== 8) return;

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`, { cache: 'no-store' });
      if (!response.ok) throw new Error('Falha na consulta de CEP');

      const data = await response.json();
      if (data && data.erro) {
        this.showToast('CEP não encontrado.', 'warning');
        return;
      }

      const setIfPresent = (id, value) => {
        const field = document.getElementById(id);
        if (!field) return;
        field.value = String(value || '').trim();
      };

      setIfPresent('client-street', data.logradouro);
      setIfPresent('client-neighborhood', data.bairro);
      setIfPresent('client-city', data.localidade);
      setIfPresent('client-state', data.uf);

      const complementField = document.getElementById('client-complement');
      if (complementField && !String(complementField.value || '').trim()) {
        complementField.value = String(data.complemento || '').trim();
      }

      const numberField = document.getElementById('client-number');
      if (numberField && !String(numberField.value || '').trim()) {
        numberField.focus();
      }

      this.showToast('Endereço preenchido automaticamente pelo CEP.', 'success');
    } catch (err) {
      this.showToast('Não foi possível consultar o CEP agora.', 'warning');
    }
  }

  collectClientGroupsFromClients() {
    const seen = new Set();
    return this.clients
      .map((client) => this.normalizeClientGroupName(client.group))
      .filter((group) => {
        if (!group) return false;
        const key = group.toLowerCase();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .sort((a, b) => a.localeCompare(b, 'pt-BR'));
  }

  rememberClientGroup(groupName) {
    const normalized = this.normalizeClientGroupName(groupName);
    if (!normalized) return;

    const existingIndex = this.clientGroups.findIndex((item) => item.toLowerCase() === normalized.toLowerCase());
    if (existingIndex >= 0) this.clientGroups.splice(existingIndex, 1);
    this.clientGroups.unshift(normalized);
    this.clientGroups = this.clientGroups.slice(0, 40);
    this.populateClientGroupOptions();
  }

  populateClientGroupOptions(preferredGroup = '') {
    const datalist = document.getElementById('client-group-options');
    if (!datalist) return;

    const groups = this.clientGroups.slice();
    const preferred = this.normalizeClientGroupName(preferredGroup);
    if (preferred && !groups.some((item) => item.toLowerCase() === preferred.toLowerCase())) {
      groups.unshift(preferred);
    }

    datalist.innerHTML = groups
      .map((group) => `<option value="${safeText(group)}"></option>`)
      .join('');
  }

  showToast(message, type = 'info') {
    const level = type === 'danger' ? 'error' : type;
    console.log(`[${level}] ${message}`);
  }

  initDOM() {
    ensureLoginCredentials();

    const userInput = document.getElementById('login-username');
    const creds = getLoginCredentials();
    if (userInput && !userInput.value) userInput.value = creds.username;

    const startDateInput = document.getElementById('top-date-start');
    const endDateInput = document.getElementById('top-date-end');
    const today = getTodayStr();
    if (startDateInput && !startDateInput.value) startDateInput.value = today;
    if (endDateInput && !endDateInput.value) endDateInput.value = today;

    this.syncTopDatesToAgendaFilters();
    this.ensureAppointmentProcedureOptions();
    this.loadSoundSettings();
    this.updateSoundControlsUI();
    this.populateClientGroupOptions();
    this.prefillFirebaseConfig();
    this.updateCloudSyncMeta('Modo local', 'local');
  }

  loadSoundSettings() {
    try {
      const rawEnabled = localStorage.getItem(SOUND_ENABLED_STORAGE_KEY);
      const rawMinutes = localStorage.getItem(REMINDER_MINS_STORAGE_KEY);
      this.soundEnabled = rawEnabled == null ? true : rawEnabled === '1';
      const parsedMinutes = Number(rawMinutes);
      this.reminderMinutes = Number.isFinite(parsedMinutes) ? Math.max(1, parsedMinutes) : 15;
    } catch (err) {
      this.soundEnabled = true;
      this.reminderMinutes = 15;
    }
  }

  saveSoundSettings() {
    try {
      localStorage.setItem(SOUND_ENABLED_STORAGE_KEY, this.soundEnabled ? '1' : '0');
      localStorage.setItem(REMINDER_MINS_STORAGE_KEY, String(this.reminderMinutes));
    } catch (err) {
      console.log('Falha ao salvar configuração de avisos:', err);
    }
  }

  updateSoundControlsUI() {
    const toggleBtn = document.getElementById('btn-toggle-sound');
    const statusText = document.getElementById('sound-status-text');
    const minutesInput = document.getElementById('top-reminder-mins');

    if (toggleBtn) toggleBtn.classList.toggle('sound-off', !this.soundEnabled);
    if (statusText) statusText.textContent = this.soundEnabled ? 'Avisos: ON' : 'Avisos: OFF';
    if (minutesInput) minutesInput.value = String(this.reminderMinutes);
  }

  playReminderSound() {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(660, now + 0.25);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.14, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.32);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.34);

      osc.onended = () => {
        if (audioCtx && typeof audioCtx.close === 'function') audioCtx.close();
      };
    } catch (err) {
      this.showToast('Não foi possível tocar o som neste dispositivo.', 'warning');
    }
  }

  ensureAppointmentProcedureOptions() {
    const select = document.getElementById('appt-procedure');
    if (!select) return;
    if (select.options && select.options.length > 0) return;

    const defaults = [
      'Consulta Individual',
      'Terapia de Casal',
      'Sessão de Retorno',
      'Avaliação Inicial'
    ];

    select.innerHTML = ['<option value="">Selecione uma abordagem</option>']
      .concat(defaults.map((name) => `<option value="${safeText(name)}">${safeText(name)}</option>`))
      .join('');
  }


  initEvents() {
    const loginForm = document.getElementById('login-form');
    const saveFirebaseBtn = document.getElementById('btn-save-firebase');
    const disconnectFirebaseBtn = document.getElementById('btn-disconnect-firebase');
    const firebaseConfigInput = document.getElementById('cfg-firebase-json');
    const loginUserInput = document.getElementById('login-username');
    const loginPassInput = document.getElementById('login-password');
    const showPassInput = document.getElementById('login-show-password');

    if (loginForm) {
      loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const enteredUser = String((loginUserInput && loginUserInput.value) || '').trim();
        const enteredPass = String((loginPassInput && loginPassInput.value) || '');
        const creds = getLoginCredentials();

        if (enteredUser === creds.username && enteredPass === creds.password) {
          this.localLoginUnlocked = true;
          this.showAppShell();
          this.render();
          this.showToast('Login realizado com sucesso!', 'success');
        } else {
          this.showLoginScreen('Usuário ou senha incorretos.');
        }
      });
    }

    if (showPassInput && loginPassInput) {
      showPassInput.addEventListener('change', () => {
        loginPassInput.type = showPassInput.checked ? 'text' : 'password';
      });
    }

    if (saveFirebaseBtn) {
      saveFirebaseBtn.addEventListener('click', () => {
        void this.initFirebase();
      });
    }

    if (disconnectFirebaseBtn) {
      disconnectFirebaseBtn.addEventListener('click', () => {
        this.disconnectFirebase();
      });
    }

    if (firebaseConfigInput) {
      firebaseConfigInput.addEventListener('input', () => {
        try {
          const parsed = JSON.parse(firebaseConfigInput.value || '{}');
          this.firebaseConfig = parsed;
        } catch (err) {
          this.firebaseConfig = null;
        }
      });
    }

    const resolveDashboardTarget = (cardId) => {
      if (!cardId) return null;
      const map = {
        'dash-card-consultas': 'agenda',
        'dash-card-recebido': 'financeiro',
        'dash-card-pendente': 'financeiro',
        'dash-card-resultado': 'financeiro',
        'dash-card-clientes': 'clientes'
      };
      return map[cardId] || null;
    };

    const globalClickGuard = (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      if (target.closest('.agenda-event-whatsapp')) {
        return;
      }

      const bubbleCard = target.closest('.dash-bubble-item[data-appointment-id]');
      if (bubbleCard) {
        const appointmentId = String(bubbleCard.getAttribute('data-appointment-id') || '').trim();
        if (appointmentId) {
          event.preventDefault();
          event.stopPropagation();
          const isPending = bubbleCard.classList.contains('is-pending');
          if (isPending) {
            this.openPaymentModal(appointmentId);
          } else {
            this.openAppointmentModal(appointmentId);
          }
          return;
        }
      }

      const weeklyAgendaCard = target.closest('.agenda-event[data-appointment-id]');
      if (weeklyAgendaCard) {
        const appointmentId = String(weeklyAgendaCard.getAttribute('data-appointment-id') || '').trim();
        if (appointmentId) {
          event.preventDefault();
          event.stopPropagation();
          this.openAppointmentModal(appointmentId);
          return;
        }
      }

      const actionNode = target.closest('[data-action]');
      if (actionNode) {
        const action = String(actionNode.getAttribute('data-action') || '').trim();
        const actionTarget = String(actionNode.getAttribute('data-target') || '').trim();
        const appointmentId = String(actionNode.getAttribute('data-appointment-id') || '').trim();

        if (action === 'open-appointment' && appointmentId) {
          event.preventDefault();
          event.stopPropagation();
          this.openAppointmentModal(appointmentId);
          return;
        }

        if (action === 'dashboard-card' && actionTarget) {
          event.preventDefault();
          event.stopPropagation();
          this.handleDashboardCardClick(actionNode.id || '', actionTarget);
          return;
        }

        if (action === 'switch-tab' && actionTarget) {
          event.preventDefault();
          event.stopPropagation();
          if (actionTarget === 'agenda') this.clearDashboardQuickFilters();
          if (actionTarget === 'financeiro') this.financeViewFilter = 'all';
          this.switchTab(actionTarget);
          return;
        }
      }

      const appointmentTrigger = target.closest('#btn-header-new-appointment, #btn-new-appointment-agenda');
      if (appointmentTrigger) {
        event.preventDefault();
        event.stopPropagation();
        this.openAppointmentModal();
        return;
      }

      const clientTrigger = target.closest('#btn-header-new-client, #btn-new-client');
      if (clientTrigger) {
        event.preventDefault();
        event.stopPropagation();
        this.openClientModal();
        return;
      }

      const dashAgendaTrigger = target.closest('#btn-view-agenda-completa');
      if (dashAgendaTrigger) {
        event.preventDefault();
        event.stopPropagation();
        this.clearDashboardQuickFilters();
        this.switchTab('agenda');
        return;
      }

      const dashFinanceiroTrigger = target.closest('#btn-view-financeiro-tudo');
      if (dashFinanceiroTrigger) {
        event.preventDefault();
        event.stopPropagation();
        this.financeViewFilter = 'all';
        this.switchTab('financeiro');
        return;
      }

      const statCard = target.closest('.stat-card');
      if (statCard && statCard.id) {
        const targetTab = resolveDashboardTarget(statCard.id);
        if (targetTab) {
          event.preventDefault();
          event.stopPropagation();
          this.handleDashboardCardClick(statCard.id, targetTab);
        }
      }
    };

    document.addEventListener('click', globalClickGuard, true);
    document.addEventListener('touchstart', globalClickGuard, { capture: true, passive: false });
    document.addEventListener('keydown', (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (event.key !== 'Enter' && event.key !== ' ') return;

      const weeklyAgendaCard = target.closest('.agenda-event[data-appointment-id]');
      if (weeklyAgendaCard) {
        const appointmentId = String(weeklyAgendaCard.getAttribute('data-appointment-id') || '').trim();
        if (!appointmentId) return;
        event.preventDefault();
        event.stopPropagation();
        this.openAppointmentModal(appointmentId);
        return;
      }

      const bubbleCard = target.closest('.dash-bubble-item[data-appointment-id]');
      if (bubbleCard) {
        const appointmentId = String(bubbleCard.getAttribute('data-appointment-id') || '').trim();
        if (!appointmentId) return;
        event.preventDefault();
        event.stopPropagation();
        this.openAppointmentModal(appointmentId);
        return;
      }

      const actionNode = target.closest('[data-action="open-appointment"]');
      if (!actionNode) return;
      const appointmentId = String(actionNode.getAttribute('data-appointment-id') || '').trim();
      if (!appointmentId) return;
      event.preventDefault();
      event.stopPropagation();
      this.openAppointmentModal(appointmentId);
    }, true);

    document.querySelectorAll('.sidebar-nav .nav-item').forEach((btn) => {
      btn.addEventListener('click', () => {
        const tab = btn.getAttribute('data-tab') || 'dashboard';
        if (tab === 'financeiro') this.financeViewFilter = 'all';
        this.switchTab(tab);
      });
    });

    const logoutBtn = document.getElementById('btn-logout-session');
    if (logoutBtn) logoutBtn.addEventListener('click', () => this.logoutSession());

    const btnHeaderBack = document.getElementById('btn-header-back');
    if (btnHeaderBack) {
      btnHeaderBack.addEventListener('click', () => {
        this.switchTab('dashboard');
      });
    }

    const resetDatesBtn = document.getElementById('btn-reset-top-dates');
    if (resetDatesBtn) {
      resetDatesBtn.addEventListener('click', () => {
        const today = getTodayStr();
        const startDateInput = document.getElementById('top-date-start');
        const endDateInput = document.getElementById('top-date-end');
        if (startDateInput) startDateInput.value = today;
        if (endDateInput) endDateInput.value = today;
        this.syncTopDatesToAgendaFilters();
        this.render();
      });
    }

    const topStart = document.getElementById('top-date-start');
    const topEnd = document.getElementById('top-date-end');
    if (topStart) topStart.addEventListener('change', () => { this.syncTopDatesToAgendaFilters(); this.render(); });
    if (topEnd) topEnd.addEventListener('change', () => { this.syncTopDatesToAgendaFilters(); this.render(); });

    const btnHeaderNewClient = document.getElementById('btn-header-new-client');
    const btnNewClient = document.getElementById('btn-new-client');
    void btnHeaderNewClient;
    void btnNewClient;

    const btnHeaderNewAppointment = document.getElementById('btn-header-new-appointment');
    void btnHeaderNewAppointment;

    const formClient = document.getElementById('form-client');
    if (formClient) formClient.addEventListener('submit', (e) => { e.preventDefault(); this.saveClientForm(); });

    const clientDobInput = document.getElementById('client-dob');
    if (clientDobInput) {
      clientDobInput.addEventListener('input', () => {
        clientDobInput.value = this.formatDobDisplay(clientDobInput.value);
      });
      clientDobInput.addEventListener('blur', () => {
        clientDobInput.value = this.formatDobForInput(clientDobInput.value);
      });
    }

    const clientCepInput = document.getElementById('client-cep');
    if (clientCepInput) {
      clientCepInput.addEventListener('input', () => {
        clientCepInput.value = this.formatCep(clientCepInput.value);
      });
      clientCepInput.addEventListener('blur', () => {
        void this.fillAddressByCep(clientCepInput.value);
      });
    }

    const formAppointment = document.getElementById('form-appointment');
    if (formAppointment) formAppointment.addEventListener('submit', (e) => { e.preventDefault(); this.saveAppointmentForm(); });

    const formExpense = document.getElementById('form-expense');
    if (formExpense) formExpense.addEventListener('submit', (e) => { e.preventDefault(); this.saveExpenseForm(); });

    const closeClientButtons = ['btn-cancel-client', 'btn-close-client'];
    closeClientButtons.forEach((id) => {
      const btn = document.getElementById(id);
      if (btn) btn.addEventListener('click', () => this.closeClientModal());
    });

    const manageClientGroupsBtn = document.getElementById('btn-manage-client-groups');
    if (manageClientGroupsBtn) {
      manageClientGroupsBtn.addEventListener('click', () => this.openClientGroupsModal());
    }

    const closeClientGroupsButtons = ['btn-close-client-groups', 'btn-close-client-groups-footer'];
    closeClientGroupsButtons.forEach((id) => {
      const btn = document.getElementById(id);
      if (btn) btn.addEventListener('click', () => this.closeClientGroupsModal());
    });

    const closeAppointmentButtons = ['btn-cancel-appointment', 'btn-close-appointment'];
    closeAppointmentButtons.forEach((id) => {
      const btn = document.getElementById(id);
      if (btn) btn.addEventListener('click', () => this.closeAppointmentModal());
    });

    const closeExpenseButtons = ['btn-cancel-expense', 'btn-close-expense'];
    closeExpenseButtons.forEach((id) => {
      const btn = document.getElementById(id);
      if (btn) btn.addEventListener('click', () => this.closeExpenseModal());
    });

    ['btn-cancel-payment', 'btn-close-payment'].forEach((id) => {
      const btn = document.getElementById(id);
      if (btn) btn.addEventListener('click', () => this.closePaymentModal());
    });
    const btnSavePayment = document.getElementById('btn-save-payment');
    if (btnSavePayment) btnSavePayment.addEventListener('click', () => this.savePaymentForm());
    const btnPayQuitar = document.getElementById('btn-pay-quitar');
    if (btnPayQuitar) btnPayQuitar.addEventListener('click', () => {
      const balanceEl = document.getElementById('pay-balance');
      const input = document.getElementById('pay-amount-now');
      if (input && balanceEl) {
        const raw = String(balanceEl.textContent || '').replace(/[^\d,\.]/g, '').replace(',', '.');
        input.value = parseFloat(raw) || 0;
      }
    });

    const btnNewExpense = document.getElementById('btn-new-expense');
    if (btnNewExpense) btnNewExpense.addEventListener('click', () => this.openExpenseModal());

    const agendaSearch = document.getElementById('agenda-search');
    const agendaStart = document.getElementById('agenda-filter-start');
    const agendaEnd = document.getElementById('agenda-filter-end');
    const agendaStatus = document.getElementById('agenda-filter-status');
    if (agendaSearch) agendaSearch.addEventListener('input', () => this.renderAgendaTable());
    if (agendaStart) agendaStart.addEventListener('change', () => this.renderAgendaTable());
    if (agendaEnd) agendaEnd.addEventListener('change', () => this.renderAgendaTable());
    if (agendaStatus) agendaStatus.addEventListener('change', () => this.renderAgendaTable());

    const btnAgendaViewList = document.getElementById('btn-agenda-view-list');
    const btnAgendaViewCalendar = document.getElementById('btn-agenda-view-calendar');
    const btnAgendaPrev = document.getElementById('btn-agenda-prev');
    const btnAgendaToday = document.getElementById('btn-agenda-today');
    const btnAgendaNext = document.getElementById('btn-agenda-next');

    if (btnAgendaViewList) {
      btnAgendaViewList.addEventListener('click', () => {
        this.agendaViewMode = 'list';
        this.updateAgendaViewModeUI();
      });
    }

    if (btnAgendaViewCalendar) {
      btnAgendaViewCalendar.addEventListener('click', () => {
        this.agendaViewMode = 'calendar';
        this.updateAgendaViewModeUI();
      });
    }

    if (btnAgendaPrev) {
      btnAgendaPrev.addEventListener('click', () => {
        this.agendaCalendarStartDate = addDaysIso(this.agendaCalendarStartDate, -7);
        const inp = document.getElementById('agenda-filter-start');
        if (inp) inp.value = this.agendaCalendarStartDate;
        this.renderAgendaTable();
      });
    }

    if (btnAgendaNext) {
      btnAgendaNext.addEventListener('click', () => {
        this.agendaCalendarStartDate = addDaysIso(this.agendaCalendarStartDate, 7);
        const inp = document.getElementById('agenda-filter-start');
        if (inp) inp.value = this.agendaCalendarStartDate;
        this.renderAgendaTable();
      });
    }

    if (btnAgendaToday) {
      btnAgendaToday.addEventListener('click', () => {
        this.agendaCalendarStartDate = getWeekStartMondayIso(getTodayStr());
        const inp = document.getElementById('agenda-filter-start');
        if (inp) inp.value = this.agendaCalendarStartDate;
        this.renderAgendaTable();
      });
    }

    const clientesSearch = document.getElementById('clientes-search');
    const clientesPhoneFilter = document.getElementById('clientes-phone-filter');
    if (clientesSearch) clientesSearch.addEventListener('input', () => this.renderClientsTable());
    if (clientesPhoneFilter) clientesPhoneFilter.addEventListener('change', () => this.renderClientsTable());

    const financeiroSearch = document.getElementById('financeiro-search');
    if (financeiroSearch) financeiroSearch.addEventListener('input', () => this.renderFinanceiroTable());

    const btnToggleSound = document.getElementById('btn-toggle-sound');
    if (btnToggleSound) {
      btnToggleSound.addEventListener('click', () => {
        this.soundEnabled = !this.soundEnabled;
        this.saveSoundSettings();
        this.updateSoundControlsUI();
        this.showToast(this.soundEnabled ? 'Avisos sonoros ativados.' : 'Avisos sonoros desativados.', 'info');
      });
    }

    const btnTestSound = document.getElementById('btn-test-sound');
    if (btnTestSound) {
      btnTestSound.addEventListener('click', () => {
        this.playReminderSound();
        this.showToast('Som de teste reproduzido.', 'success');
      });
    }

    const reminderInput = document.getElementById('top-reminder-mins');
    if (reminderInput) {
      reminderInput.addEventListener('change', () => {
        const value = Number(reminderInput.value);
        const safeValue = Number.isFinite(value) ? Math.max(1, Math.round(value)) : 15;
        this.reminderMinutes = safeValue;
        reminderInput.value = String(safeValue);
        this.saveSoundSettings();
        this.showToast(`Aviso configurado para ${safeValue} min antes.`, 'success');
      });
    }

    const clearFinanceFilterBtn = document.getElementById('btn-clear-finance-filter');
    if (clearFinanceFilterBtn) {
      clearFinanceFilterBtn.addEventListener('click', () => {
        this.financeViewFilter = 'all';
        this.renderFinanceiroTable();
      });
    }

    const btnViewAgenda = document.getElementById('btn-view-agenda-completa');
    void btnViewAgenda;
    const btnViewFin = document.getElementById('btn-view-financeiro-tudo');
    void btnViewFin;

    const dashboardCardMap = {
      'dash-card-consultas': 'agenda',
      'dash-card-recebido': 'financeiro',
      'dash-card-pendente': 'financeiro',
      'dash-card-resultado': 'financeiro',
      'dash-card-clientes': 'clientes'
    };

    Object.keys(dashboardCardMap).forEach((id) => {
      const card = document.getElementById(id);
      if (!card) return;
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.setAttribute('aria-disabled', 'false');
      card.addEventListener('click', () => this.handleDashboardCardClick(id, dashboardCardMap[id]));
      card.addEventListener('keydown', (event) => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        this.handleDashboardCardClick(id, dashboardCardMap[id]);
      });
    });

    const reportHandlers = {
      'btn-report-paciente': () => this.generatePatientReport(),
      'btn-report-receitas': () => this.generateReceitasReport(),
      'btn-report-financeiro': () => this.generateFinanceiroReport(),
      'btn-report-despesas': () => this.generateDespesasReport(),
      'btn-report-aniversarios': () => this.generateAniversariosReport(),
      'btn-report-patient-individual': () => this.generatePacienteIndividualReport(false),
      'btn-print-patient-individual': () => this.generatePacienteIndividualReport(true)
    };

    Object.keys(reportHandlers).forEach((id) => {
      const btn = document.getElementById(id);
      if (btn) btn.addEventListener('click', reportHandlers[id]);
    });

    const birthdaysBtn = document.getElementById('btn-open-birthdays');
    if (birthdaysBtn) {
      birthdaysBtn.addEventListener('click', () => {
        this.switchTab('clientes');
        this.showToast('Painel de aniversários simplificado: use a busca de clientes por data de nascimento.', 'info');
      });
    }
  }

  clearDashboardQuickFilters() {
    const agendaSearch = document.getElementById('agenda-search');
    const agendaStatus = document.getElementById('agenda-filter-status');
    const financeSearch = document.getElementById('financeiro-search');

    if (agendaSearch) agendaSearch.value = '';
    if (agendaStatus) agendaStatus.value = 'todos';
    if (financeSearch) financeSearch.value = '';
  }

  handleDashboardCardClick(cardId, targetTab) {
    const now = Date.now();
    const duplicatedAction = this.lastDashboardCardAction === cardId && (now - this.lastDashboardCardActionAt) < 160;
    if (duplicatedAction) return;

    this.lastDashboardCardAction = cardId;
    this.lastDashboardCardActionAt = now;
    this.rememberDashboardCardForTab(cardId, targetTab);
    if (cardId) this.setDashboardCardActive(cardId);

    if (cardId === 'dash-card-consultas') {
      const today = getTodayStr();
      const agendaSearch = document.getElementById('agenda-search');
      const agendaStart = document.getElementById('agenda-filter-start');
      const agendaEnd = document.getElementById('agenda-filter-end');
      const agendaStatus = document.getElementById('agenda-filter-status');

      if (agendaSearch) agendaSearch.value = '';
      if (agendaStart) agendaStart.value = today;
      if (agendaEnd) agendaEnd.value = today;
      if (agendaStatus) agendaStatus.value = 'todos';
      this.switchTab('agenda');
      return;
    }

    if (cardId === 'dash-card-recebido') {
      const financeSearch = document.getElementById('financeiro-search');
      if (financeSearch) financeSearch.value = '';
      this.financeViewFilter = 'paid';
      this.switchTab('financeiro');
      return;
    }

    if (cardId === 'dash-card-pendente') {
      const financeSearch = document.getElementById('financeiro-search');
      if (financeSearch) financeSearch.value = '';
      this.financeViewFilter = 'pending';
      this.switchTab('financeiro');
      return;
    }

    if (cardId === 'dash-card-resultado') {
      const financeSearch = document.getElementById('financeiro-search');
      if (financeSearch) financeSearch.value = '';
      this.financeViewFilter = 'all';
      this.switchTab('financeiro');
      return;
    }

    this.switchTab(targetTab);
  }

  switchTab(tabId) {
    const previousTab = this.currentTab;
    const targetId = document.getElementById(`tab-${tabId}`) ? tabId : 'dashboard';
    this.currentTab = targetId;

    const pageTitle = document.getElementById('page-title');
    const pageSubtitle = document.getElementById('page-subtitle');
    const tabMeta = {
      dashboard: { title: 'Consultório Control', subtitle: 'Gestão de clientes, agenda e financeiro' },
      agenda: { title: 'Agenda & Consultas', subtitle: 'Gerencie horários, sessões e atendimentos do período' },
      clientes: { title: 'Clientes', subtitle: 'Cadastros, contatos e histórico de pacientes' },
      financeiro: { title: 'Financeiro', subtitle: 'Recebimentos, pendências e relatórios do período' },
      despesas: { title: 'Despesas', subtitle: 'Controle de gastos operacionais do consultório' },
      whatsapp: { title: 'WhatsApp', subtitle: 'Modelos e envios de mensagens para os clientes' },
      senha: { title: 'Senha', subtitle: 'Atualize o acesso com segurança' },
      graficos: { title: 'Gráficos', subtitle: 'Visualizações e indicadores do consultório' },
      config: { title: 'Configurações', subtitle: 'Ajustes gerais e integrações do sistema' }
    };
    const meta = tabMeta[this.currentTab] || tabMeta.dashboard;
    if (pageTitle) pageTitle.textContent = meta.title;
    if (pageSubtitle) pageSubtitle.textContent = meta.subtitle;

    const btnHeaderBack = document.getElementById('btn-header-back');
    if (btnHeaderBack) {
      const showBack = this.currentTab !== 'dashboard';
      btnHeaderBack.style.display = showBack ? 'inline-flex' : 'none';
    }

    document.querySelectorAll('.sidebar-nav .nav-item').forEach((btn) => {
      btn.classList.toggle('active', btn.getAttribute('data-tab') === this.currentTab);
    });

    document.querySelectorAll('.tab-content').forEach((section) => {
      section.classList.remove('active');
    });

    const target = document.getElementById(`tab-${this.currentTab}`);
    if (target) target.classList.add('active');

    if (window.matchMedia && window.matchMedia('(max-width: 900px)').matches) {
      const main = document.querySelector('.main-content');
      if (main && typeof main.scrollIntoView === 'function') {
        main.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }

    this.render();
    this.syncDashboardCardFromTab(this.currentTab, previousTab);
  }

  showLoginScreen(message = '') {
    const loginScreen = document.getElementById('login-screen');
    const appShell = document.getElementById('app-shell');
    const errorEl = document.getElementById('login-error');
    const passInput = document.getElementById('login-password');
    const showPassInput = document.getElementById('login-show-password');

    if (loginScreen) loginScreen.classList.remove('app-hidden');
    if (appShell) appShell.classList.add('app-hidden');
    if (loginScreen) {
      loginScreen.style.zIndex = '9999';
      loginScreen.style.pointerEvents = 'auto';
      loginScreen.style.visibility = 'visible';
    }
    if (appShell) {
      appShell.style.display = 'none';
      appShell.style.pointerEvents = 'none';
    }

    if (passInput) {
      passInput.value = '';
      passInput.type = 'password';
    }
    if (showPassInput) showPassInput.checked = false;

    if (errorEl) {
      errorEl.textContent = message;
      errorEl.style.display = message ? 'block' : 'none';
    }
  }

  showAppShell() {
    const loginScreen = document.getElementById('login-screen');
    const appShell = document.getElementById('app-shell');
    const errorEl = document.getElementById('login-error');

    if (loginScreen) loginScreen.classList.add('app-hidden');
    if (appShell) appShell.classList.remove('app-hidden');
    if (loginScreen) {
      loginScreen.style.pointerEvents = 'none';
      loginScreen.style.zIndex = '-1';
      loginScreen.style.visibility = 'hidden';
    }
    if (appShell) {
      appShell.style.display = '';
      appShell.style.pointerEvents = 'auto';
    }
    if (errorEl) {
      errorEl.textContent = '';
      errorEl.style.display = 'none';
    }
  }

  logoutSession() {
    this.localLoginUnlocked = false;
    this.showLoginScreen('Sessão encerrada. Faça login novamente para continuar.');
    this.showToast('Você saiu da sessão.', 'info');
  }

  prefillFirebaseConfig() {
    const input = document.getElementById('cfg-firebase-json');
    if (!input) return;

    const storedConfig = this.loadFirebaseConfig();
    const configToShow = storedConfig || DEFAULT_FIREBASE_CONFIG;
    input.value = JSON.stringify(configToShow, null, 2);
    this.firebaseConfig = configToShow;
  }

  loadFirebaseConfig() {
    try {
      const raw = localStorage.getItem(FIREBASE_CONFIG_STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return parsed && typeof parsed === 'object' ? parsed : null;
    } catch (err) {
      return null;
    }
  }

  saveFirebaseConfig(config) {
    try {
      localStorage.setItem(FIREBASE_CONFIG_STORAGE_KEY, JSON.stringify(config));
    } catch (err) {
      console.log('Falha ao salvar configuração do Firebase:', err);
    }
  }

  setFirebaseStatus(connected, message, mode = 'live') {
    const badge = document.getElementById('cloud-sync-status');
    const text = document.getElementById('cloud-status-text');
    if (badge) {
      badge.className = connected ? 'cloud-status-badge live' : 'cloud-status-badge offline';
    }
    if (text) text.textContent = connected ? 'Firebase Online' : 'Modo Local';
    this.updateCloudSyncMeta(message, mode);
  }

  disconnectFirebase() {
    this.firebaseConnected = false;
    this.firebaseApp = null;
    this.firebaseDb = null;
    this.setFirebaseStatus(false, 'Desconectado do Firebase', 'local');
    this.showToast('Firebase desconectado.', 'info');
  }

  async initFirebase() {
    const input = document.getElementById('cfg-firebase-json');
    const config = this.firebaseConfig || this.loadFirebaseConfig() || DEFAULT_FIREBASE_CONFIG;

    if (!config || !config.projectId) {
      this.setFirebaseStatus(false, 'Configure o JSON do Firebase', 'local');
      this.showToast('Cole a configuração do Firebase no campo indicado.', 'warning');
      return false;
    }

    if (input) input.value = JSON.stringify(config, null, 2);
    this.firebaseConfig = config;
    this.saveFirebaseConfig(config);

    try {
      if (!window.firebase || !window.firebase.apps || !window.firebase.firestore) {
        throw new Error('SDK do Firebase não carregada');
      }

      if (!this.firebaseApp) {
        const existingApp = window.firebase.apps.find((app) => app.name === 'consultorio-app');
        this.firebaseApp = existingApp || window.firebase.initializeApp(config, 'consultorio-app');
      }

      if (window.firebase.auth) {
        const auth = window.firebase.auth(this.firebaseApp);
        if (!auth.currentUser) {
          try {
            await auth.signInAnonymously();
          } catch (authErr) {
            console.log('Falha ao autenticar anonimamente:', authErr);
          }
        }
      }

      this.firebaseDb = window.firebase.firestore(this.firebaseApp);
      this.firebaseConnected = true;
      this.setFirebaseStatus(true, 'Conectado ao Firebase', 'live');
      this.showToast('Firebase conectado com sucesso.', 'success');

      try {
        await this.syncDataWithFirebase();
      } catch (syncErr) {
        const message = syncErr && syncErr.message ? syncErr.message : 'Erro desconhecido';
        this.firebaseConnected = false;
        this.firebaseDb = null;
        this.setFirebaseStatus(false, 'Firebase indisponível para sincronização', 'local');
        this.showToast(`Sincronização cancelada: ${message}`, 'warning');
      }
      return true;
    } catch (err) {
      const message = err && err.message ? err.message : 'Erro desconhecido';
      const isPermissionError = /permission|permissions/i.test(message);
      const isNetworkError = /network|Failed to fetch|ERR_ABORTED|unavailable/i.test(message);
      this.firebaseConnected = false;
      this.firebaseDb = null;
      this.setFirebaseStatus(false, isPermissionError ? 'Firebase sem permissão' : 'Falha ao conectar no Firebase', 'local');
      this.showToast(
        isPermissionError
          ? 'O Firebase respondeu, mas as regras não permitiram a leitura. O app continuará em modo local.'
          : 'Não foi possível conectar ao Firebase. O app continuará em modo local.',
        'warning'
      );
      return false;
    }
  }

  async syncDataWithFirebase() {
    if (!this.firebaseDb) return;
    try {
      const collections = [
        { name: 'clients', data: this.clients },
        { name: 'appointments', data: this.appointments },
        { name: 'expenses', data: this.expenses }
      ];

      for (const item of collections) {
        const snapshot = await this.firebaseDb.collection(item.name).get();
        if (!snapshot.empty) {
          const remoteData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          if (item.name === 'clients') this.clients = remoteData;
          if (item.name === 'appointments') this.appointments = remoteData;
          if (item.name === 'expenses') this.expenses = remoteData;
        }
      }

      this.saveStore();
      this.render();
    } catch (err) {
      const message = err && err.message ? err.message : 'Erro desconhecido';
      console.log('Falha ao sincronizar com Firestore:', message);
      throw new Error(message);
    }
  }

  updateCloudSyncMeta(customText = '', mode = 'local') {
    const info = document.getElementById('cloud-sync-last');
    if (!info) return;

    info.classList.remove('live', 'local');
    info.classList.add(mode === 'live' ? 'live' : 'local');

    if (customText) {
      info.textContent = customText;
      return;
    }

    const now = new Date();
    info.textContent = `Atualizado ${now.toLocaleTimeString('pt-BR')}`;
  }

  syncTopDatesToAgendaFilters() {
    const topStart = document.getElementById('top-date-start');
    const topEnd = document.getElementById('top-date-end');
    const agendaStart = document.getElementById('agenda-filter-start');
    const agendaEnd = document.getElementById('agenda-filter-end');
    if (agendaStart && topStart && !agendaStart.value) agendaStart.value = topStart.value;
    if (agendaEnd && topEnd && !agendaEnd.value) agendaEnd.value = topEnd.value;
  }

  getNextClientRegistrationNumber() {
    const max = this.clients.reduce((acc, c) => Math.max(acc, Number(c.registrationNumber || 0)), 0);
    return max + 1;
  }

  normalizeWhatsAppPhone(phone) {
    const digits = String(phone || '').replace(/\D/g, '');
    if (digits.length < 10) return '';
    if (digits.length === 10 || digits.length === 11) return `55${digits}`;
    return digits;
  }

  filterAppointmentsForAgenda() {
    const search = String((document.getElementById('agenda-search') || {}).value || '').toLowerCase().trim();
    const start = (document.getElementById('agenda-filter-start') || {}).value || '';
    const end = (document.getElementById('agenda-filter-end') || {}).value || '';
    const status = (document.getElementById('agenda-filter-status') || {}).value || 'todos';

    let filtered = this.appointments.slice();
    if (search) {
      filtered = filtered.filter((a) =>
        String(a.clientName || '').toLowerCase().includes(search) ||
        String(a.procedure || '').toLowerCase().includes(search)
      );
    }

    if (start) filtered = filtered.filter((a) => String(a.date || '') >= start);
    if (end) filtered = filtered.filter((a) => String(a.date || '') <= end);
    if (status !== 'todos') filtered = filtered.filter((a) => String(a.status || '') === status);

    return filtered.sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));
  }

  renderDashboard() {
    const today = getTodayStr();
    const todayApps = this.appointments.filter((a) => a.date === today);
    const doneToday = todayApps.filter((a) => String(a.status || '').toLowerCase() === 'concluido').length;

    const received = this.appointments.reduce((sum, a) => sum + toNumber(a.amountPaid), 0);
    const pending = this.appointments.reduce((sum, a) => sum + Math.max(0, toNumber(a.price) - toNumber(a.amountPaid)), 0);
    const expensesTotal = this.expenses.reduce((sum, e) => sum + toNumber(e.amount), 0);
    const result = received - expensesTotal;

    const setText = (id, value) => {
      const el = document.getElementById(id);
      if (el) el.textContent = String(value);
    };

    setText('dash-consultas-hoje', todayApps.length);
    setText('dash-consultas-hoje-sub', `${doneToday} concluídas`);
    setText('dash-received-month', formatCurrency(received));
    setText('dash-pending-total', formatCurrency(pending));
    setText('dash-pending-count', `${this.appointments.filter((a) => toNumber(a.price) - toNumber(a.amountPaid) > 0).length} cobranças pendentes`);
    setText('dash-result-total', formatCurrency(result));
    setText('dash-result-sub', result > 0 ? `Superávit de ${formatCurrency(result)}` : (result < 0 ? `Déficit de ${formatCurrency(Math.abs(result))}` : 'Equilíbrio no período'));
    setText('dash-total-clients', this.clients.length);
    setText('nav-pending-badge', this.appointments.filter((a) => toNumber(a.price) - toNumber(a.amountPaid) > 0).length);

    const dashToday = document.getElementById('dash-today-list');
    if (dashToday) {
      const rows = this.appointments
        .slice()
        .sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`))
        .filter((a) => a.date >= today)
        .slice(0, 6);

      if (!rows.length) {
        dashToday.innerHTML = '<div class="empty-state"><p>Nenhuma consulta futura cadastrada.</p></div>';
      } else {
        dashToday.innerHTML = rows.map((a) => `
          <div class="dash-bubble-item" role="button" tabindex="0" data-action="open-appointment" data-appointment-id="${safeText(a.id || '')}" aria-label="Abrir consulta de ${safeText(a.clientName || '-')}">
            <div class="dash-bubble-date">
              <span>${formatDateBR(a.date)}</span>
              <strong>${safeText(a.time || '--:--')}</strong>
            </div>
            <div class="dash-bubble-content">
              <strong>${safeText(a.clientName || '-')}</strong>
              <p>${safeText(a.procedure || 'Consulta')} - Total ${formatCurrency(a.price || 0)}</p>
            </div>
            <span class="dash-status-chip ${String(a.status || '').toLowerCase().includes('concl') ? 'is-success' : (String(a.status || '').toLowerCase().includes('cancel') ? 'is-danger' : 'is-info')}">${safeText(a.status || 'Agendado')}</span>
          </div>
        `).join('');
      }
    }

    const dashPending = document.getElementById('dash-pending-list');
    if (dashPending) {
      const pend = this.appointments
        .filter((a) => toNumber(a.price) - toNumber(a.amountPaid) > 0)
        .slice(0, 6);
      if (!pend.length) {
        dashPending.innerHTML = '<div class="empty-state"><p>Sem cobranças pendentes.</p></div>';
      } else {
        dashPending.innerHTML = pend.map((a) => `
          <div class="dash-bubble-item is-pending" role="button" tabindex="0" data-action="open-appointment" data-appointment-id="${safeText(a.id || '')}" aria-label="Abrir cobrança pendente de ${safeText(a.clientName || '-')}">
            <div class="dash-bubble-content">
              <strong>${safeText(a.clientName || '-')}</strong>
              <p>${formatDateBR(a.date)} - Em aberto</p>
            </div>
            <span class="dash-amount-chip">${formatCurrency(Math.max(0, toNumber(a.price) - toNumber(a.amountPaid)))}</span>
          </div>
        `).join('');
      }
    }
  }

  renderAgendaTable() {
    const tbody = document.getElementById('agenda-table-body');
    const calendarGrid = document.getElementById('agenda-calendar-grid');
    const rangeLabel = document.getElementById('agenda-calendar-range');
    const agendaStartInput = document.getElementById('agenda-filter-start');
    const agendaEndInput = document.getElementById('agenda-filter-end');
    const filtered = this.filterAppointmentsForAgenda();

    if (this.agendaViewMode === 'calendar' && agendaStartInput && agendaEndInput) {
      const selectedDate = agendaStartInput.value || this.agendaCalendarStartDate || getTodayStr();
      this.agendaCalendarStartDate = getWeekStartMondayIso(selectedDate);
      agendaStartInput.value = this.agendaCalendarStartDate;
      agendaEndInput.value = addDaysIso(this.agendaCalendarStartDate, 6);
    }

    this.updateAgendaViewModeUI();

    if (rangeLabel) {
      const start = (document.getElementById('agenda-filter-start') || {}).value || '-';
      const end = (document.getElementById('agenda-filter-end') || {}).value || '-';
      rangeLabel.textContent = `${formatDateBR(start)} até ${formatDateBR(end)}`;
    }

    if (calendarGrid) {
      if (!filtered.length) {
        calendarGrid.innerHTML = '<div class="empty-state" style="grid-column:1 / -1;"><p>Nenhum agendamento no período.</p></div>';
      } else {
        const start = agendaStartInput && agendaStartInput.value ? agendaStartInput.value : this.agendaCalendarStartDate;
        const days = Array.from({ length: 7 }, (_, idx) => addDaysIso(start, idx));
        const hours = Array.from({ length: 14 }, (_, idx) => 7 + idx);

        const grouped = {};
        filtered.forEach((a) => {
          const h = Number(String(a.time || '00:00').split(':')[0] || 0);
          const key = `${a.date}|${String(h).padStart(2, '0')}`;
          grouped[key] = grouped[key] || [];
          grouped[key].push(a);
        });

        const headerHtml = ['<div class="agenda-header blank"></div>']
          .concat(days.map((date) => `
            <div class="agenda-header">
              <div>${safeText(weekdayShortPt(date))}</div>
              <div class="agenda-header-date">${formatDateBR(date)}</div>
            </div>
          `))
          .join('');

        const bodyHtml = hours.map((hour) => {
          const hourLabel = `${String(hour).padStart(2, '0')}:00`;
          const rowCells = days.map((date) => {
            const key = `${date}|${String(hour).padStart(2, '0')}`;
            const events = (grouped[key] || []).sort((a, b) => String(a.time || '').localeCompare(String(b.time || '')));
            if (!events.length) return '<div class="agenda-cell"></div>';

            return `
              <div class="agenda-cell">
                ${events.map((a) => {
                  const statusClass = String(a.paymentStatus || '').toLowerCase().includes('pago')
                    ? 'agenda-event-pago'
                    : (String(a.paymentStatus || '').toLowerCase().includes('parcial') ? 'agenda-event-parcial' : 'agenda-event-pendente');
                  return `
                    <div class="agenda-event ${statusClass}" role="button" tabindex="0" data-appointment-id="${safeText(a.id || '')}" onclick="app.openAppointmentModal('${a.id}')" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();app.openAppointmentModal('${a.id}');}">
                      <div class="agenda-event-time">${safeText(a.time || '--:--')}</div>
                      <div class="agenda-event-title-row">
                        <div class="agenda-event-title">${safeText(a.clientName || '-')}</div>
                        <button class="agenda-event-whatsapp" type="button" title="Enviar confirmação no WhatsApp" onclick="event.stopPropagation();app.sendAppointmentWhatsApp('${a.id}')">
                          <i data-lucide="message-circle"></i>
                        </button>
                      </div>
                      <div class="agenda-event-procedure">${safeText(a.procedure || 'Consulta')}</div>
                      <div class="agenda-event-payment">${safeText(a.paymentStatus || 'Pendente')}</div>
                    </div>
                  `;
                }).join('')}
              </div>
            `;
          }).join('');

          return `<div class="agenda-time-axis">${hourLabel}</div>${rowCells}`;
        }).join('');

        calendarGrid.innerHTML = headerHtml + bodyHtml;
      }
    }

    if (!tbody) return;

    if (!filtered.length) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7">
            <div class="empty-state">
              <p>Nenhum agendamento encontrado no período.</p>
            </div>
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = filtered.map((a) => {
      const payment = String(a.paymentStatus || 'Pendente');
      const status = String(a.status || 'Agendado');
      const statusClass = String(status).toLowerCase().includes('concl')
        ? 'badge-concluido'
        : (String(status).toLowerCase().includes('cancel') ? 'badge-cancelado' : 'badge-agendado');
      const paymentClass = String(payment).toLowerCase().includes('pago')
        ? 'badge-pago'
        : (String(payment).toLowerCase().includes('parcial') ? 'badge-parcial' : 'badge-pendente');
      return `
        <tr>
          <td><strong>${formatDateBR(a.date)}</strong><br><span style="color:var(--text-muted);font-size:0.82rem;">${safeText(a.time || '--:--')} hs</span></td>
          <td>${safeText(a.clientName || '-')}</td>
          <td>${safeText(a.procedure || '-')}</td>
          <td><strong>${formatCurrency(a.price || 0)}</strong></td>
          <td><button type="button" class="badge ${statusClass}" onclick="app.cycleAppointmentStatus('${a.id}')" title="Clique para alterar status">${safeText(status)}</button></td>
          <td><button type="button" class="badge ${paymentClass}" onclick="app.cycleAppointmentPayment('${a.id}')" title="Clique para alterar pagamento">${safeText(payment)}</button></td>
          <td style="text-align: right;">
            <button class="btn btn-sm btn-secondary" onclick="app.openAppointmentModal('${a.id}')"><i data-lucide="pencil"></i> Editar</button>
            <button class="btn btn-sm btn-secondary" onclick="app.sendAppointmentWhatsApp('${a.id}')"><i data-lucide="message-circle"></i> WhatsApp</button>
            <button class="btn btn-sm btn-ghost" style="color:var(--danger);" onclick="app.deleteAppointment('${a.id}')"><i data-lucide="trash-2"></i></button>
          </td>
        </tr>
      `;
    }).join('');

    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  }

  cycleAppointmentStatus(id) {
    const appt = this.appointments.find((a) => a.id === id);
    if (!appt) return;
    const cycle = ['Agendado', 'Concluido', 'Cancelado'];
    const next = cycle[(cycle.indexOf(appt.status) + 1) % cycle.length];
    appt.status = next;
    this.saveData();
    this.renderAgendaTable();
    this.render();
  }

  cycleAppointmentPayment(id) {
    const appt = this.appointments.find((a) => a.id === id);
    if (!appt) return;
    const cycle = ['Pendente', 'Parcial', 'Pago'];
    const next = cycle[(cycle.indexOf(appt.paymentStatus) + 1) % cycle.length];
    appt.paymentStatus = next;
    this.saveData();
    this.renderAgendaTable();
    this.render();
  }

  updateAgendaViewModeUI() {
    const calendarCard = document.getElementById('agenda-calendar-card');
    const tableCard = document.getElementById('agenda-table-card');
    const btnList = document.getElementById('btn-agenda-view-list');
    const btnCalendar = document.getElementById('btn-agenda-view-calendar');

    const isCalendar = this.agendaViewMode === 'calendar';
    if (calendarCard) calendarCard.style.display = isCalendar ? 'block' : 'none';
    if (tableCard) tableCard.style.display = isCalendar ? 'none' : 'block';

    if (btnList) btnList.classList.toggle('active', !isCalendar);
    if (btnCalendar) btnCalendar.classList.toggle('active', isCalendar);
  }

  renderClientsTable() {
    const tbody = document.getElementById('clientes-table-body');
    if (!tbody) return;

    const search = String((document.getElementById('clientes-search') || {}).value || '').toLowerCase().trim();
    const phoneFilter = (document.getElementById('clientes-phone-filter') || {}).value || 'todos';

    let filtered = this.clients.slice();
    if (search) {
      filtered = filtered.filter((c) =>
        String(c.name || '').toLowerCase().includes(search) ||
        String(c.phone || '').toLowerCase().includes(search) ||
        String(c.email || '').toLowerCase().includes(search)
      );
    }

    if (phoneFilter === 'validos') {
      filtered = filtered.filter((c) => Boolean(this.normalizeWhatsAppPhone(c.phone || '')));
    } else if (phoneFilter === 'invalidos') {
      filtered = filtered.filter((c) => !this.normalizeWhatsAppPhone(c.phone || ''));
    }

    filtered.sort((a, b) => Number(a.registrationNumber || 0) - Number(b.registrationNumber || 0));

    if (!filtered.length) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6">
            <div class="empty-state"><p>Nenhum cliente encontrado.</p></div>
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = filtered.map((c) => `
      <tr>
        <td><strong>${c.registrationNumber || '-'}</strong></td>
        <td>${safeText(c.name || '-')}</td>
        <td>${safeText(c.phone || '-')}</td>
        <td>${safeText(c.email || '-')}</td>
        <td>${formatDateBR(c.createdAt || '')}</td>
        <td>
          <button class="btn btn-sm btn-secondary" onclick="app.openClientModal('${c.id}')">Editar</button>
          <button class="btn btn-sm btn-ghost" style="color:var(--danger);" onclick="app.deleteClient('${c.id}')">Excluir</button>
        </td>
      </tr>
    `).join('');
  }

  renderFinanceiroTable() {
    const tbody = document.getElementById('financeiro-table-body');
    if (!tbody) return;

    const filterIndicator = document.getElementById('finance-filter-indicator');
    const filterLabel = document.getElementById('finance-filter-label');

    const filterLabels = {
      all: 'Filtro: Todos',
      paid: 'Filtro: Recebidos',
      pending: 'Filtro: Pendentes'
    };

    if (filterLabel) {
      filterLabel.textContent = filterLabels[this.financeViewFilter] || filterLabels.all;
    }
    if (filterIndicator) {
      const shouldShow = this.financeViewFilter === 'paid' || this.financeViewFilter === 'pending';
      filterIndicator.classList.toggle('is-hidden', !shouldShow);
    }

    const search = String((document.getElementById('financeiro-search') || {}).value || '').toLowerCase().trim();
    const grouped = {};

    this.appointments.forEach((a) => {
      const key = String(a.clientId || 'sem-cliente');
      grouped[key] = grouped[key] || {
        clientId: key,
        clientName: a.clientName || 'Sem cliente',
        qty: 0,
        total: 0,
        paid: 0,
        pending: 0
      };
      grouped[key].qty += 1;
      grouped[key].total += toNumber(a.price);
      grouped[key].paid += toNumber(a.amountPaid);
      grouped[key].pending += Math.max(0, toNumber(a.price) - toNumber(a.amountPaid));
    });

    let rows = Object.keys(grouped).map((k) => grouped[k]);
    if (search) {
      rows = rows.filter((r) => String(r.clientName || '').toLowerCase().includes(search));
    }

    if (this.financeViewFilter === 'pending') {
      rows = rows.filter((r) => r.pending > 0);
    } else if (this.financeViewFilter === 'paid') {
      rows = rows.filter((r) => r.paid > 0);
    }

    rows.sort((a, b) => b.pending - a.pending);

    if (!rows.length) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7"><div class="empty-state"><p>Nenhum registro financeiro encontrado.</p></div></td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = rows.map((r) => {
      const status = r.pending > 0 ? (r.paid > 0 ? 'Parcial' : 'Pendente') : 'Pago';
      return `
        <tr>
          <td>
            <button class="finance-client-link" type="button" onclick="app.openLatestAppointmentByClient('${safeText(r.clientId)}')">${safeText(r.clientName)}</button>
          </td>
          <td>${r.qty}</td>
          <td><button type="button" class="money-pill money-pill-total" onclick="app.openLatestAppointmentByClient('${safeText(r.clientId)}')" title="Clique para editar">${formatCurrency(r.total)}</button></td>
          <td><button type="button" class="money-pill money-pill-pending" onclick="app.openLatestAppointmentByClient('${safeText(r.clientId)}')" title="Clique para editar">${formatCurrency(r.pending)}</button></td>
          <td><button type="button" class="money-pill money-pill-paid" onclick="app.openLatestAppointmentByClient('${safeText(r.clientId)}')" title="Clique para editar">${formatCurrency(r.paid)}</button></td>
          <td>
            <button class="finance-status-link" type="button" onclick="app.openLatestAppointmentByClient('${safeText(r.clientId)}')">${safeText(status)}</button>
          </td>
          <td>
            <button class="btn btn-sm btn-secondary" onclick="app.openLatestAppointmentByClient('${safeText(r.clientId)}')">Editar</button>
          </td>
        </tr>
      `;
    }).join('');
  }

  openLatestAppointmentByClient(clientId) {
    const key = String(clientId || '').trim();
    if (!key) {
      this.showToast('Cliente inválido para edição.', 'warning');
      return;
    }

    const matches = this.appointments
      .filter((a) => String(a.clientId || '') === key)
      .sort((a, b) => `${b.date || ''} ${b.time || ''}`.localeCompare(`${a.date || ''} ${a.time || ''}`));

    if (!matches.length) {
      this.showToast('Nenhuma consulta encontrada para este cliente.', 'warning');
      return;
    }

    this.switchTab('agenda');
    this.openAppointmentModal(matches[0].id);
  }

  renderDespesasTable() {
    const tbody = document.getElementById('despesas-table-body');
    if (!tbody) return;

    if (!this.expenses.length) {
      tbody.innerHTML = `
        <tr>
          <td colspan="5"><div class="empty-state"><p>Nenhuma despesa cadastrada.</p></div></td>
        </tr>
      `;
      return;
    }

    const sorted = this.expenses.slice().sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')));
    tbody.innerHTML = sorted.map((e) => `
      <tr>
        <td>${safeText(e.description || '-')}</td>
        <td>${safeText(e.category || '-')}</td>
        <td>${formatCurrency(e.amount || 0)}</td>
        <td>${formatDateBR(e.date || '')}</td>
        <td>
          <button class="btn btn-sm btn-secondary" onclick="app.openExpenseModal('${e.id}')">Editar</button>
          <button class="btn btn-sm btn-ghost" style="color:var(--danger);" onclick="app.deleteExpense('${e.id}')">Excluir</button>
        </td>
      </tr>
    `).join('');
  }

  openExpenseModal(expenseId = '') {
    const modal = document.getElementById('modal-expense');
    if (!modal) return;

    const form = document.getElementById('form-expense');
    if (form) form.reset();

    const idInput = document.getElementById('expense-id');
    const title = document.getElementById('modal-expense-title');
    if (idInput) idInput.value = '';
    if (title) title.textContent = 'Nova Despesa';

    const dateInput = document.getElementById('expense-date');
    if (dateInput && !dateInput.value) dateInput.value = getTodayStr();

    if (expenseId) {
      const expense = this.expenses.find((e) => e.id === expenseId);
      if (expense) {
        if (idInput) idInput.value = expense.id;
        const set = (id, val) => {
          const el = document.getElementById(id);
          if (el) el.value = val == null ? '' : val;
        };
        set('expense-description', expense.description || '');
        set('expense-category', expense.category || 'Outros');
        set('expense-amount', toNumber(expense.amount));
        set('expense-date', expense.date || getTodayStr());
        if (title) title.textContent = 'Editar Despesa';
      }
    }

    modal.classList.add('active');
  }

  closeExpenseModal() {
    const modal = document.getElementById('modal-expense');
    if (modal) modal.classList.remove('active');
  }

  saveExpenseForm() {
    const id = String((document.getElementById('expense-id') || {}).value || '').trim();
    const description = String((document.getElementById('expense-description') || {}).value || '').trim();
    const category = String((document.getElementById('expense-category') || {}).value || 'Outros');
    const amount = toNumber((document.getElementById('expense-amount') || {}).value || 0);
    const date = String((document.getElementById('expense-date') || {}).value || '').trim();

    const payload = { id, description, category, amount, date };
    if (window.financeiroModule && typeof window.financeiroModule.saveExpense === 'function') {
      window.financeiroModule.saveExpense(this, payload, id || '');
    } else {
      this.showToast('Módulo financeiro não carregado.', 'warning');
    }
  }

  populateClientSelectOptions(selectedId = '') {
    const select = document.getElementById('appt-client-id');
    if (!select) return;

    const current = selectedId || select.value;
    const options = ['<option value="">Selecione um cliente...</option>']
      .concat(this.clients
        .slice()
        .sort((a, b) => String(a.name || '').localeCompare(String(b.name || '')))
        .map((c) => `<option value="${safeText(c.id)}">${safeText(c.name)} - ${safeText(c.phone || '-')}</option>`));

    select.innerHTML = options.join('');
    if (current) select.value = current;
  }

  openClientModal(clientId = '') {
    const modal = document.getElementById('modal-client');
    if (!modal) return;

    const form = document.getElementById('form-client');
    if (form) form.reset();

    const idInput = document.getElementById('client-id');
    const title = document.getElementById('modal-client-title');
    if (idInput) idInput.value = '';
    if (title) title.textContent = 'Cadastrar Novo Paciente';
    this.populateClientGroupOptions();

    let _anamneseData = null;
    if (clientId) {
      const c = this.clients.find((x) => x.id === clientId);
      if (c) {
        if (idInput) idInput.value = c.id;
        _anamneseData = c.anamnese || null;
        const set = (id, val) => {
          const el = document.getElementById(id);
          if (el) el.value = val || '';
        };
        set('client-name', c.name);
        set('client-phone', c.phone);
        set('client-email', c.email);
        set('client-cpf', c.cpf);
        set('client-rg', c.rg);
        set('client-dob', this.formatDobForInput(c.dob));
        set('client-group', c.group);
        set('client-cep', this.formatCep(c.cep));
        set('client-street', c.street);
        set('client-number', c.number);
        set('client-complement', c.complement);
        set('client-neighborhood', c.neighborhood);
        set('client-city', c.city);
        set('client-state', c.state);
        set('client-notes', c.notes);
        set('client-emergency-name', c.emergencyName);
        set('client-emergency-phone', c.emergencyPhone);
        set('client-emergency-relation', c.emergencyRelation);
        this.populateClientGroupOptions(c.group);
        if (title) title.textContent = 'Editar Dados do Paciente';
      }
    }

    this.loadAnamneseData(_anamneseData);
    modal.classList.add('active');
    if (window.lucide && typeof window.lucide.createIcons === 'function') window.lucide.createIcons();
  }

  selectAnamneseType(type) {
    const typeInput = document.getElementById('anamnese-selected-type');
    const current = typeInput ? typeInput.value : '';
    document.querySelectorAll('.anamnese-type-card').forEach((c) => c.classList.remove('active'));
    document.querySelectorAll('.anamnese-form').forEach((f) => { f.style.display = 'none'; });
    if (current === type) {
      if (typeInput) typeInput.value = '';
      return;
    }
    if (typeInput) typeInput.value = type;
    const card = document.querySelector(`.anamnese-type-card[data-type="${type}"]`);
    if (card) card.classList.add('active');
    const form = document.getElementById(`anamnese-form-${type}`);
    if (form) form.style.display = 'flex';
  }

  getAnamneseData() {
    const typeInput = document.getElementById('anamnese-selected-type');
    const type = typeInput ? typeInput.value : '';
    if (!type) return null;
    const form = document.getElementById(`anamnese-form-${type}`);
    if (!form) return { type, data: {} };
    const data = {};
    form.querySelectorAll('[data-anamnese]').forEach((el) => {
      const key = String(el.getAttribute('data-anamnese') || '').replace(`${type}.`, '');
      data[key] = el.value || '';
    });
    return { type, data };
  }

  loadAnamneseData(anamnese) {
    document.querySelectorAll('.anamnese-type-card').forEach((c) => c.classList.remove('active'));
    document.querySelectorAll('.anamnese-form').forEach((f) => { f.style.display = 'none'; });
    const typeInput = document.getElementById('anamnese-selected-type');
    if (typeInput) typeInput.value = '';
    if (!anamnese || !anamnese.type) return;
    this.selectAnamneseType(anamnese.type);
    if (!anamnese.data) return;
    const form = document.getElementById(`anamnese-form-${anamnese.type}`);
    if (!form) return;
    form.querySelectorAll('[data-anamnese]').forEach((el) => {
      const key = String(el.getAttribute('data-anamnese') || '').replace(`${anamnese.type}.`, '');
      if (anamnese.data[key] !== undefined) el.value = anamnese.data[key];
    });
  }

  closeClientModal() {
    const modal = document.getElementById('modal-client');
    if (modal) modal.classList.remove('active');
  }

  openClientGroupsModal() {
    const modal = document.getElementById('modal-client-groups');
    if (!modal) return;
    this.renderClientGroupsManager();
    modal.classList.add('active');
  }

  closeClientGroupsModal() {
    const modal = document.getElementById('modal-client-groups');
    if (modal) modal.classList.remove('active');
  }

  renderClientGroupsManager() {
    const container = document.getElementById('client-groups-list');
    if (!container) return;

    // wire add-group button each render
    const addBtn = document.getElementById('btn-add-group');
    const addInput = document.getElementById('new-group-input');
    if (addBtn) {
      addBtn.onclick = () => {
        const name = this.normalizeClientGroupName((addInput || {}).value || '');
        if (!name) { this.showToast('Informe um nome para o grupo.', 'warning'); return; }
        if (this.clientGroups.some((g) => this.normalizeClientGroupName(g).toLowerCase() === name.toLowerCase())) {
          this.showToast('Grupo já existe.', 'warning'); return;
        }
        this.rememberClientGroup(name);
        this.saveStore();
        if (addInput) addInput.value = '';
        this.populateClientGroupOptions();
        this.renderClientGroupsManager();
        this.showToast(`Grupo "${name}" criado.`, 'success');
      };
    }
    if (addInput) {
      addInput.onkeydown = (e) => { if (e.key === 'Enter') { e.preventDefault(); if (addBtn) addBtn.click(); } };
    }

    if (!this.clientGroups.length) {
      container.innerHTML = '<div class="empty-state"><p>Nenhum grupo salvo ainda.</p></div>';
      return;
    }

    container.innerHTML = this.clientGroups.map((group) => `
      <div class="group-manager-card" data-group-row="${safeText(group)}">
        <i data-lucide="tag"></i>
        <input type="text" class="form-control group-manager-input" value="${safeText(group)}" data-group-edit aria-label="Nome do grupo">
        <div class="group-manager-actions">
          <button type="button" class="btn btn-sm btn-secondary" data-group-action="rename" data-group="${safeText(group)}"><i data-lucide="check"></i> Salvar</button>
          <button type="button" class="btn btn-sm btn-ghost group-manager-delete" data-group-action="delete" data-group="${safeText(group)}"><i data-lucide="trash-2"></i></button>
        </div>
      </div>
    `).join('');

    container.querySelectorAll('[data-group-action]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const action = String(btn.getAttribute('data-group-action') || '');
        const groupName = this.normalizeClientGroupName(btn.getAttribute('data-group') || '');
        if (!groupName) return;

        if (action === 'rename') {
          const row = btn.closest('[data-group-row]');
          const input = row ? row.querySelector('[data-group-edit]') : null;
          const nextName = input ? String(input.value || '') : '';
          this.renameClientGroup(groupName, nextName);
          return;
        }

        if (action === 'delete') {
          this.deleteClientGroup(groupName);
        }
      });
    });
  }

  renameClientGroup(oldGroup, newGroup) {
    const oldNormalized = this.normalizeClientGroupName(oldGroup);
    const newNormalized = this.normalizeClientGroupName(newGroup);

    if (!oldNormalized) return;
    if (!newNormalized) {
      this.showToast('Informe um nome válido para o grupo.', 'warning');
      return;
    }

    const oldKey = oldNormalized.toLowerCase();
    const newKey = newNormalized.toLowerCase();
    if (oldKey === newKey) return;

    let updatedClients = 0;
    this.clients = this.clients.map((client) => {
      const currentGroup = this.normalizeClientGroupName(client.group).toLowerCase();
      if (currentGroup !== oldKey) return client;
      updatedClients += 1;
      return { ...client, group: newNormalized };
    });

    this.clientGroups = this.clientGroups.filter((group) => this.normalizeClientGroupName(group).toLowerCase() !== oldKey);
    this.rememberClientGroup(newNormalized);

    const groupInput = document.getElementById('client-group');
    if (groupInput && this.normalizeClientGroupName(groupInput.value).toLowerCase() === oldKey) {
      groupInput.value = newNormalized;
    }

    this.populateClientGroupOptions(newNormalized);
    this.saveStore();
    this.renderClientGroupsManager();
    this.render();
    this.showToast(`Grupo atualizado. ${updatedClients} cliente(s) ajustado(s).`, 'success');
  }

  deleteClientGroup(groupName) {
    const normalized = this.normalizeClientGroupName(groupName);
    if (!normalized) return;

    const targetKey = normalized.toLowerCase();
    let affectedClients = 0;

    this.clients = this.clients.map((client) => {
      const currentGroup = this.normalizeClientGroupName(client.group).toLowerCase();
      if (currentGroup !== targetKey) return client;
      affectedClients += 1;
      return { ...client, group: '' };
    });

    this.clientGroups = this.clientGroups.filter((group) => this.normalizeClientGroupName(group).toLowerCase() !== targetKey);

    const groupInput = document.getElementById('client-group');
    if (groupInput && this.normalizeClientGroupName(groupInput.value).toLowerCase() === targetKey) {
      groupInput.value = '';
    }

    this.populateClientGroupOptions();
    this.saveStore();
    this.renderClientGroupsManager();
    this.render();
    this.showToast(`Grupo removido. ${affectedClients} cliente(s) ajustado(s).`, 'success');
  }

  saveClientForm() {
    const id = (document.getElementById('client-id') || {}).value || '';
    const name = String((document.getElementById('client-name') || {}).value || '').trim();
    const phone = String((document.getElementById('client-phone') || {}).value || '').trim();
    const email = String((document.getElementById('client-email') || {}).value || '').trim();

    const group = this.normalizeClientGroupName((document.getElementById('client-group') || {}).value || '');
    const dobRaw = String((document.getElementById('client-dob') || {}).value || '').trim();
    const dobIso = this.normalizeDobToIso(dobRaw);

    if (dobRaw && !dobIso) {
      this.showToast('Data de nascimento inválida. Use o formato ddmmaaaa.', 'warning');
      return;
    }

    const payload = {
      id,
      name,
      phone,
      email,
      cpf: String((document.getElementById('client-cpf') || {}).value || '').trim(),
      rg: String((document.getElementById('client-rg') || {}).value || '').trim(),
      dob: dobIso,
      group,
      cep: this.formatCep((document.getElementById('client-cep') || {}).value || ''),
      street: String((document.getElementById('client-street') || {}).value || '').trim(),
      number: String((document.getElementById('client-number') || {}).value || '').trim(),
      complement: String((document.getElementById('client-complement') || {}).value || '').trim(),
      neighborhood: String((document.getElementById('client-neighborhood') || {}).value || '').trim(),
      city: String((document.getElementById('client-city') || {}).value || '').trim(),
      state: String((document.getElementById('client-state') || {}).value || '').trim().toUpperCase().slice(0, 2),
      notes: String((document.getElementById('client-notes') || {}).value || '').trim(),
      emergencyName: String((document.getElementById('client-emergency-name') || {}).value || '').trim(),
      emergencyPhone: String((document.getElementById('client-emergency-phone') || {}).value || '').trim(),
      emergencyRelation: String((document.getElementById('client-emergency-relation') || {}).value || '').trim(),
      anamnese: this.getAnamneseData()
    };

    if (window.clientModule && typeof window.clientModule.saveClient === 'function') {
      window.clientModule.saveClient(this, payload, id || '');
      this.populateClientSelectOptions();
    } else {
      this.showToast('Módulo de clientes não carregado.', 'warning');
    }
  }

  deleteClient(clientId) {
    if (window.clientModule && typeof window.clientModule.deleteClient === 'function') {
      window.clientModule.deleteClient(this, clientId);
    } else {
      this.showToast('Módulo de clientes não carregado.', 'warning');
    }
  }

  openAppointmentModal(appointmentId = '') {
    const modal = document.getElementById('modal-appointment');
    if (!modal) return;

    const form = document.getElementById('form-appointment');
    if (form) form.reset();

    this.populateClientSelectOptions();

    const idInput = document.getElementById('appointment-id');
    const title = document.getElementById('modal-appointment-title');
    if (idInput) idInput.value = '';
    if (title) title.textContent = 'Agendar Consulta';

    const dateInput = document.getElementById('appt-date');
    if (dateInput && !dateInput.value) dateInput.value = getTodayStr();

    if (appointmentId) {
      const a = this.appointments.find((x) => x.id === appointmentId);
      if (a) {
        if (idInput) idInput.value = a.id;
        const set = (id, val) => {
          const el = document.getElementById(id);
          if (el) el.value = val == null ? '' : val;
        };
        set('appt-client-id', a.clientId);
        set('appt-date', a.date);
        set('appt-time', a.time);
        set('appt-procedure', a.procedure);
        set('appt-price', a.price);
        set('appt-payment-method', a.paymentMethod || 'Pix');
        set('appt-status', a.status || 'Agendado');
        set('appt-payment-status', a.paymentStatus || 'Pendente');
        set('appt-amount-paid', a.amountPaid || 0);
        set('appt-notes', a.notes || '');
        if (title) title.textContent = 'Editar Consulta';
      }
    }

    modal.classList.add('active');
  }

  closeAppointmentModal() {
    const modal = document.getElementById('modal-appointment');
    if (modal) modal.classList.remove('active');
  }

  openPaymentModal(appointmentId) {
    const appt = this.appointments.find((a) => a.id === appointmentId);
    if (!appt) return;
    const modal = document.getElementById('modal-payment');
    if (!modal) return;

    document.getElementById('pay-appointment-id').value = appt.id;
    document.getElementById('pay-client-name').textContent = appt.clientName || '-';
    document.getElementById('pay-date-time').textContent = `${formatDateBR(appt.date)} às ${appt.time || '--:--'}`;
    document.getElementById('pay-procedure').textContent = appt.procedure || '-';

    const total = toNumber(appt.price);
    const paid = toNumber(appt.amountPaid);
    const balance = Math.max(0, total - paid);
    document.getElementById('pay-total').textContent = formatCurrency(total);
    document.getElementById('pay-paid').textContent = formatCurrency(paid);
    document.getElementById('pay-balance').textContent = formatCurrency(balance);

    const methodEl = document.getElementById('pay-method');
    if (methodEl) methodEl.value = appt.paymentMethod || 'Pix';
    const amountNowEl = document.getElementById('pay-amount-now');
    if (amountNowEl) amountNowEl.value = balance > 0 ? balance : '';

    modal.classList.add('active');
    if (window.lucide && typeof window.lucide.createIcons === 'function') window.lucide.createIcons();
  }

  closePaymentModal() {
    const modal = document.getElementById('modal-payment');
    if (modal) modal.classList.remove('active');
  }

  savePaymentForm() {
    const id = (document.getElementById('pay-appointment-id') || {}).value || '';
    const appt = this.appointments.find((a) => a.id === id);
    if (!appt) { this.showToast('Agendamento não encontrado.', 'warning'); return; }

    const amountNow = toNumber((document.getElementById('pay-amount-now') || {}).value);
    const method = String((document.getElementById('pay-method') || {}).value || appt.paymentMethod || 'Pix');

    if (amountNow <= 0) { this.showToast('Informe um valor maior que zero.', 'warning'); return; }

    const newPaid = toNumber(appt.amountPaid) + amountNow;
    const total = toNumber(appt.price);
    appt.amountPaid = newPaid;
    appt.paymentMethod = method;
    appt.paymentStatus = newPaid >= total ? 'Pago' : (newPaid > 0 ? 'Parcial' : 'Pendente');

    this.saveData();
    this.render();
    this.closePaymentModal();
    this.showToast(`Pagamento de ${formatCurrency(amountNow)} registrado.`, 'success');
  }

  saveAppointmentForm() {
    const id = (document.getElementById('appointment-id') || {}).value || '';
    const clientId = String((document.getElementById('appt-client-id') || {}).value || '').trim();
    const date = String((document.getElementById('appt-date') || {}).value || '').trim();
    const time = String((document.getElementById('appt-time') || {}).value || '').trim();
    const procedure = String((document.getElementById('appt-procedure') || {}).value || '').trim();
    const price = toNumber((document.getElementById('appt-price') || {}).value || 0);

    if (!clientId || !date || !time || !procedure || price <= 0) {
      this.showToast('Preencha cliente, data, horário, abordagem e valor da consulta.', 'warning');
      return;
    }

    const client = this.clients.find((c) => c.id === clientId);
    if (!client) {
      this.showToast('Cliente selecionado inválido.', 'warning');
      return;
    }

    const payload = {
      id,
      clientId,
      clientName: client.name,
      date,
      time,
      procedure,
      price,
      paymentMethod: String((document.getElementById('appt-payment-method') || {}).value || 'Pix'),
      status: String((document.getElementById('appt-status') || {}).value || 'Agendado'),
      paymentStatus: String((document.getElementById('appt-payment-status') || {}).value || 'Pendente'),
      amountPaid: toNumber((document.getElementById('appt-amount-paid') || {}).value || 0),
      notes: String((document.getElementById('appt-notes') || {}).value || '').trim()
    };

    if (window.agendaModule && typeof window.agendaModule.saveAppointment === 'function') {
      window.agendaModule.saveAppointment(this, payload, id || '');
    } else {
      this.showToast('Módulo de agenda não carregado.', 'warning');
    }
  }

  deleteAppointment(appointmentId) {
    if (window.agendaModule && typeof window.agendaModule.deleteAppointment === 'function') {
      window.agendaModule.deleteAppointment(this, appointmentId);
    } else {
      this.showToast('Módulo de agenda não carregado.', 'warning');
    }
  }

  deleteExpense(expenseId) {
    if (window.financeiroModule && typeof window.financeiroModule.deleteExpense === 'function') {
      window.financeiroModule.deleteExpense(this, expenseId);
    } else {
      this.showToast('Módulo financeiro não carregado.', 'warning');
    }
  }

  sendAppointmentWhatsApp(appointmentId) {
    if (window.agendaModule && typeof window.agendaModule.sendAppointmentWhatsApp === 'function') {
      window.agendaModule.sendAppointmentWhatsApp(this, appointmentId);
    } else {
      this.showToast('Módulo de agenda não carregado.', 'warning');
    }
  }

  getTopRange() {
    const start = String((document.getElementById('top-date-start') || {}).value || '').trim();
    const end = String((document.getElementById('top-date-end') || {}).value || '').trim();
    return { start, end };
  }

  filterItemsByTopRange(items, fieldName) {
    const { start, end } = this.getTopRange();
    return items.filter((item) => {
      const date = String(item[fieldName] || '');
      if (start && date < start) return false;
      if (end && date > end) return false;
      return true;
    });
  }

  openReportWindow(title, content, autoPrint = false) {
    const popup = window.open('', '_blank', 'noopener');
    if (!popup) return;

    popup.document.write(`
      <html>
        <head>
          <title>${safeText(title)}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 24px; white-space: pre-wrap; line-height: 1.5; }
            h1 { font-size: 20px; margin: 0 0 12px 0; }
          </style>
        </head>
        <body>
          <h1>${safeText(title)}</h1>
          <div>${safeText(content).replace(/\n/g, '<br>')}</div>
        </body>
      </html>
    `);
    popup.document.close();
    if (autoPrint) {
      popup.focus();
      popup.print();
    }
  }

  generatePatientReport() {
    const total = this.clients.length;
    const withPhone = this.clients.filter((c) => this.normalizeWhatsAppPhone(c.phone || '')).length;
    const lines = [
      'RELATÓRIO DE PACIENTES',
      '',
      `Total de pacientes: ${total}`,
      `Com WhatsApp válido: ${withPhone}`,
      '',
      'Lista:',
      ...this.clients
        .slice()
        .sort((a, b) => Number(a.registrationNumber || 0) - Number(b.registrationNumber || 0))
        .map((c) => `- ${c.registrationNumber || '-'} | ${c.name || '-'} | ${c.phone || '-'}`)
    ];
    this.openReportWindow('Relatório de Pacientes', lines.join('\n'));
  }

  generateReceitasReport() {
    const rangeAppointments = this.filterItemsByTopRange(this.appointments, 'date');
    const total = rangeAppointments.reduce((sum, a) => sum + toNumber(a.price), 0);
    const paid = rangeAppointments.reduce((sum, a) => sum + toNumber(a.amountPaid), 0);
    const pending = Math.max(0, total - paid);
    const lines = [
      'RELATÓRIO DE RECEITAS',
      '',
      `Período: ${formatDateBR(this.getTopRange().start || '')} até ${formatDateBR(this.getTopRange().end || '')}`,
      `Total lançado: ${formatCurrency(total)}`,
      `Total recebido: ${formatCurrency(paid)}`,
      `Total em aberto: ${formatCurrency(pending)}`
    ];
    this.openReportWindow('Relatório de Receitas', lines.join('\n'));
  }

  generateFinanceiroReport() {
    const rangeAppointments = this.filterItemsByTopRange(this.appointments, 'date');
    const grouped = {};
    rangeAppointments.forEach((a) => {
      const key = a.clientId || 'sem-cliente';
      grouped[key] = grouped[key] || { name: a.clientName || 'Sem cliente', total: 0, paid: 0, pending: 0 };
      grouped[key].total += toNumber(a.price);
      grouped[key].paid += toNumber(a.amountPaid);
      grouped[key].pending += Math.max(0, toNumber(a.price) - toNumber(a.amountPaid));
    });

    const lines = ['RELATÓRIO FINANCEIRO', ''];
    Object.keys(grouped)
      .map((k) => grouped[k])
      .sort((a, b) => b.pending - a.pending)
      .forEach((g) => {
        lines.push(`${g.name} | Total: ${formatCurrency(g.total)} | Pago: ${formatCurrency(g.paid)} | Aberto: ${formatCurrency(g.pending)}`);
      });

    this.openReportWindow('Relatório Financeiro', lines.join('\n'));
  }

  generateDespesasReport() {
    const rangeExpenses = this.filterItemsByTopRange(this.expenses, 'date');
    const total = rangeExpenses.reduce((sum, e) => sum + toNumber(e.amount), 0);
    const lines = [
      'RELATÓRIO DE DESPESAS',
      '',
      `Período: ${formatDateBR(this.getTopRange().start || '')} até ${formatDateBR(this.getTopRange().end || '')}`,
      `Total de despesas: ${formatCurrency(total)}`,
      '',
      'Lançamentos:',
      ...rangeExpenses
        .slice()
        .sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')))
        .map((e) => `- ${formatDateBR(e.date)} | ${e.description || '-'} | ${e.category || '-'} | ${formatCurrency(e.amount)}`)
    ];
    this.openReportWindow('Relatório de Despesas', lines.join('\n'));
  }

  generateAniversariosReport() {
    const clientsWithDob = this.clients.filter((c) => /^\d{4}-\d{2}-\d{2}$/.test(String(c.dob || '')));
    const lines = [
      'RELATÓRIO DE ANIVERSÁRIOS',
      '',
      ...clientsWithDob
        .slice()
        .sort((a, b) => String(a.dob || '').slice(5).localeCompare(String(b.dob || '').slice(5)))
        .map((c) => `- ${c.name || '-'} | ${formatDateBR(c.dob)} | ${c.phone || '-'}`)
    ];

    if (!clientsWithDob.length) {
      lines.push('Nenhum paciente com data de nascimento cadastrada.');
    }

    this.openReportWindow('Relatório de Aniversários', lines.join('\n'));
  }

  generatePacienteIndividualReport(autoPrint = false) {
    const search = String((document.getElementById('report-patient-search') || {}).value || '').trim().toLowerCase();
    if (!search) {
      this.showToast('Digite o nome, telefone ou ID do paciente para gerar o relatório individual.', 'warning');
      return;
    }

    const patient = this.clients.find((c) =>
      String(c.name || '').toLowerCase().includes(search) ||
      String(c.phone || '').toLowerCase().includes(search) ||
      String(c.registrationNumber || '').toLowerCase().includes(search)
    );

    if (!patient) {
      this.showToast('Paciente não encontrado para relatório individual.', 'warning');
      return;
    }

    const patientAppointments = this.appointments
      .filter((a) => a.clientId === patient.id)
      .sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));

    const total = patientAppointments.reduce((sum, a) => sum + toNumber(a.price), 0);
    const paid = patientAppointments.reduce((sum, a) => sum + toNumber(a.amountPaid), 0);
    const pending = Math.max(0, total - paid);

    const lines = [
      `RELATÓRIO INDIVIDUAL - ${patient.name || '-'}`,
      '',
      `Telefone: ${patient.phone || '-'}`,
      `E-mail: ${patient.email || '-'}`,
      `CPF: ${patient.cpf || '-'}`,
      '',
      `Total de consultas: ${patientAppointments.length}`,
      `Valor total: ${formatCurrency(total)}`,
      `Valor pago: ${formatCurrency(paid)}`,
      `Valor em aberto: ${formatCurrency(pending)}`,
      '',
      'Histórico:',
      ...patientAppointments.map((a) => `- ${formatDateBR(a.date)} ${a.time || ''} | ${a.procedure || '-'} | ${formatCurrency(a.price)} | Pago: ${formatCurrency(a.amountPaid || 0)} | ${a.status || '-'}`)
    ];

    this.openReportWindow(`Relatório - ${patient.name || 'Paciente'}`, lines.join('\n'), autoPrint);
  }

  render() {
    this.renderDashboard();
    this.renderAgendaTable();
    this.renderClientsTable();
    this.renderFinanceiroTable();
    this.renderDespesasTable();
    this.populateClientSelectOptions();

    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  }
}

const appInstance = new ConsultorioApp();

window.app = new Proxy(appInstance, {
  get(target, prop) {
    if (prop in target) {
      const value = target[prop];
      return typeof value === 'function' ? value.bind(target) : value;
    }
    return function noopHandler() {
      console.log(`Ação temporariamente indisponível: ${String(prop)}`);
    };
  }
});

document.addEventListener('DOMContentLoaded', async () => {
  try {
    if (window.loadPartial) {
      await Promise.all([
        window.loadPartial('src/components/partials/login-screen.html?v=20260729-1', 'login-root'),
        window.loadPartial('src/components/partials/main-shell.html?v=20260729-3', 'app-root')
      ]);
    }
  } catch (err) {
    console.log('Falha ao carregar partials:', err);
  }

  window.app.initDOM();
  window.app.initEvents();
  window.app.render();
  window.app.showLoginScreen();
  window.app.initFirebase();

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js')
      .then((reg) => console.log('[PWA] Service Worker registrado:', reg.scope))
      .catch((err) => console.log('[PWA] Falha Service Worker:', err));
  }
});
    // inicialização
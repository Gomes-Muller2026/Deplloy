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
const WHATSAPP_CONFIRM_TEMPLATE_STORAGE_KEY = 'consultorio_whatsapp_confirm_template';
const WHATSAPP_BIRTHDAY_TEMPLATE_STORAGE_KEY = 'consultorio_whatsapp_birthday_template';
const WHATSAPP_CONFIRM_TEMPLATES_STORAGE_KEY = 'consultorio_whatsapp_confirm_templates';
const WHATSAPP_BIRTHDAY_TEMPLATES_STORAGE_KEY = 'consultorio_whatsapp_birthday_templates';
const WHATSAPP_CONFIRM_SELECTED_TEMPLATE_STORAGE_KEY = 'consultorio_whatsapp_confirm_selected';
const WHATSAPP_BIRTHDAY_SELECTED_TEMPLATE_STORAGE_KEY = 'consultorio_whatsapp_birthday_selected';
const DEFAULT_WHATSAPP_CONFIRM_TEMPLATE = [
  'Olá, {{cliente}}!',
  '',
  'Passando para confirmar sua consulta:',
  'Data: {{data}}',
  'Horário: {{hora}}',
  'Procedimento: {{procedimento}}',
  'Valor: {{valor}}',
  '',
  '{{assinatura}}'
].join('\n');
const DEFAULT_WHATSAPP_BIRTHDAY_TEMPLATE = [
  'Olá, {{cliente}}!',
  '',
  'Passando para desejar um feliz aniversário! Que seu novo ciclo seja de muita saúde, paz e conquistas.',
  '',
  'Com carinho,',
  '{{assinatura}}'
].join('\n');
const DEFAULT_FIREBASE_CONFIG = {
  apiKey: 'AIzaSyCKFg8ypyYLRbD8PoeP9NqO2KHBrmN70uk',
  authDomain: 'consultorio-a07c8.firebaseapp.com',
  projectId: 'consultorio-a07c8',
  storageBucket: 'consultorio-a07c8.firebasestorage.app',
  messagingSenderId: '399470846657',
  appId: '1:399470846657:web:9ec1b5dd326a766100aa40',
  measurementId: 'G-1G96K5B02L'
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

const DEFAULT_APPOINTMENT_COLOR = '#0ea5e9';

const normalizeHexColor = (value, fallback = DEFAULT_APPOINTMENT_COLOR) => {
  const raw = String(value || '').trim();
  if (/^#[0-9a-fA-F]{6}$/.test(raw)) return raw.toLowerCase();
  if (/^#[0-9a-fA-F]{3}$/.test(raw)) {
    const r = raw[1];
    const g = raw[2];
    const b = raw[3];
    return `#${r}${r}${g}${g}${b}${b}`.toLowerCase();
  }
  return fallback;
};

const hexToRgb = (hexColor) => {
  const hex = normalizeHexColor(hexColor);
  const value = hex.slice(1);
  return {
    r: parseInt(value.slice(0, 2), 16),
    g: parseInt(value.slice(2, 4), 16),
    b: parseInt(value.slice(4, 6), 16)
  };
};

const agendaEventInlineStyle = (hexColor) => {
  const color = normalizeHexColor(hexColor);
  const rgb = hexToRgb(color);
  return `background-color: rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.18); border-color: rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.52);`;
};

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

const setLoginCredentials = (username, password) => {
  const safeUser = String(username || '').trim();
  const safePass = String(password || '');
  if (!safeUser || !safePass) return false;

  try {
    localStorage.setItem(LOGIN_USER_STORAGE_KEY, safeUser);
    localStorage.setItem(LOGIN_PASSWORD_STORAGE_KEY, safePass);
    return true;
  } catch (err) {
    return false;
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
    this.whatsAppConfirmTemplate = DEFAULT_WHATSAPP_CONFIRM_TEMPLATE;
    this.whatsAppBirthdayTemplate = DEFAULT_WHATSAPP_BIRTHDAY_TEMPLATE;
    this.whatsAppConfirmTemplates = [];
    this.whatsAppBirthdayTemplates = [];
    this.whatsAppSelectedConfirmTemplateId = '';
    this.whatsAppSelectedBirthdayTemplateId = '';
    this.lastDashboardCardAction = '';
    this.lastDashboardCardActionAt = 0;
    this.lastAnamneseIndividualCepLookup = '';
    this.selectedClientReportIds = new Set();
    this.selectedFinanceReportClientIds = new Set();
    this.lastFinanceiroRows = [];
    this.reminderIntervalId = null;
    this.reminderNotifiedKeys = new Set();
    this.reminderCheckIntervalMs = 30000;
    this.loadStore();
    this.loadWhatsAppTemplates();
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

  saveData() {
    this.saveStore();
    this.updateCloudSyncMeta();

    if (this.firebaseConnected && this.firebaseDb) {
      // Sync in background; UI should not block local save flow.
      void this.syncDataWithFirebase().catch((err) => {
        console.log('Falha ao sincronizar após salvar:', err);
      });
    }
  }

  createWhatsAppTemplateId(prefix) {
    return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  }

  getWhatsAppTemplateState(kind) {
    if (kind === 'birthday') {
      return {
        templates: this.whatsAppBirthdayTemplates,
        selectedId: this.whatsAppSelectedBirthdayTemplateId,
        defaultText: DEFAULT_WHATSAPP_BIRTHDAY_TEMPLATE,
        defaultName: 'Aniversário Padrão',
        prefix: 'tpl-birthday',
        selectId: 'ws-birthday-template-select',
        nameId: 'ws-birthday-template-name',
        textId: 'ws-birthday-template'
      };
    }

    return {
      templates: this.whatsAppConfirmTemplates,
      selectedId: this.whatsAppSelectedConfirmTemplateId,
      defaultText: DEFAULT_WHATSAPP_CONFIRM_TEMPLATE,
      defaultName: 'Confirmação Padrão',
      prefix: 'tpl-confirm',
      selectId: 'ws-confirm-template-select',
      nameId: 'ws-confirm-template-name',
      textId: 'ws-confirm-template'
    };
  }

  setWhatsAppSelectedTemplate(kind, templateId) {
    const state = this.getWhatsAppTemplateState(kind);
    const selected = state.templates.find((item) => item.id === templateId);
    if (!selected && state.templates.length) {
      templateId = state.templates[0].id;
    }

    if (kind === 'birthday') {
      this.whatsAppSelectedBirthdayTemplateId = String(templateId || '');
    } else {
      this.whatsAppSelectedConfirmTemplateId = String(templateId || '');
    }

    this.syncActiveWhatsAppTemplateTexts();
  }

  syncActiveWhatsAppTemplateTexts() {
    const confirmSelected = this.whatsAppConfirmTemplates.find((tpl) => tpl.id === this.whatsAppSelectedConfirmTemplateId);
    const birthdaySelected = this.whatsAppBirthdayTemplates.find((tpl) => tpl.id === this.whatsAppSelectedBirthdayTemplateId);
    this.whatsAppConfirmTemplate = String((confirmSelected && confirmSelected.text) || DEFAULT_WHATSAPP_CONFIRM_TEMPLATE);
    this.whatsAppBirthdayTemplate = String((birthdaySelected && birthdaySelected.text) || DEFAULT_WHATSAPP_BIRTHDAY_TEMPLATE);
  }

  ensureWhatsAppTemplateCollections() {
    if (!Array.isArray(this.whatsAppConfirmTemplates) || !this.whatsAppConfirmTemplates.length) {
      this.whatsAppConfirmTemplates = [{
        id: 'tpl-confirm-default',
        name: 'Confirmação Padrão',
        text: this.whatsAppConfirmTemplate || DEFAULT_WHATSAPP_CONFIRM_TEMPLATE
      }];
    }

    if (!Array.isArray(this.whatsAppBirthdayTemplates) || !this.whatsAppBirthdayTemplates.length) {
      this.whatsAppBirthdayTemplates = [{
        id: 'tpl-birthday-default',
        name: 'Aniversário Padrão',
        text: this.whatsAppBirthdayTemplate || DEFAULT_WHATSAPP_BIRTHDAY_TEMPLATE
      }];
    }

    if (!this.whatsAppSelectedConfirmTemplateId || !this.whatsAppConfirmTemplates.some((tpl) => tpl.id === this.whatsAppSelectedConfirmTemplateId)) {
      this.whatsAppSelectedConfirmTemplateId = this.whatsAppConfirmTemplates[0].id;
    }
    if (!this.whatsAppSelectedBirthdayTemplateId || !this.whatsAppBirthdayTemplates.some((tpl) => tpl.id === this.whatsAppSelectedBirthdayTemplateId)) {
      this.whatsAppSelectedBirthdayTemplateId = this.whatsAppBirthdayTemplates[0].id;
    }
    this.syncActiveWhatsAppTemplateTexts();
  }

  loadWhatsAppTemplates() {
    try {
      const legacyConfirm = localStorage.getItem(WHATSAPP_CONFIRM_TEMPLATE_STORAGE_KEY);
      const legacyBirthday = localStorage.getItem(WHATSAPP_BIRTHDAY_TEMPLATE_STORAGE_KEY);
      this.whatsAppConfirmTemplate = String(legacyConfirm || DEFAULT_WHATSAPP_CONFIRM_TEMPLATE).trim() || DEFAULT_WHATSAPP_CONFIRM_TEMPLATE;
      this.whatsAppBirthdayTemplate = String(legacyBirthday || DEFAULT_WHATSAPP_BIRTHDAY_TEMPLATE).trim() || DEFAULT_WHATSAPP_BIRTHDAY_TEMPLATE;

      const confirmRaw = JSON.parse(localStorage.getItem(WHATSAPP_CONFIRM_TEMPLATES_STORAGE_KEY) || '[]');
      const birthdayRaw = JSON.parse(localStorage.getItem(WHATSAPP_BIRTHDAY_TEMPLATES_STORAGE_KEY) || '[]');

      this.whatsAppConfirmTemplates = Array.isArray(confirmRaw)
        ? confirmRaw
          .map((item) => ({
            id: String(item && item.id ? item.id : ''),
            name: String(item && item.name ? item.name : '').trim(),
            text: String(item && item.text ? item.text : '').trim()
          }))
          .filter((item) => item.id && item.name && item.text)
        : [];

      this.whatsAppBirthdayTemplates = Array.isArray(birthdayRaw)
        ? birthdayRaw
          .map((item) => ({
            id: String(item && item.id ? item.id : ''),
            name: String(item && item.name ? item.name : '').trim(),
            text: String(item && item.text ? item.text : '').trim()
          }))
          .filter((item) => item.id && item.name && item.text)
        : [];

      this.whatsAppSelectedConfirmTemplateId = String(localStorage.getItem(WHATSAPP_CONFIRM_SELECTED_TEMPLATE_STORAGE_KEY) || '').trim();
      this.whatsAppSelectedBirthdayTemplateId = String(localStorage.getItem(WHATSAPP_BIRTHDAY_SELECTED_TEMPLATE_STORAGE_KEY) || '').trim();
      this.ensureWhatsAppTemplateCollections();
    } catch (err) {
      this.whatsAppConfirmTemplate = DEFAULT_WHATSAPP_CONFIRM_TEMPLATE;
      this.whatsAppBirthdayTemplate = DEFAULT_WHATSAPP_BIRTHDAY_TEMPLATE;
      this.whatsAppConfirmTemplates = [];
      this.whatsAppBirthdayTemplates = [];
      this.whatsAppSelectedConfirmTemplateId = '';
      this.whatsAppSelectedBirthdayTemplateId = '';
      this.ensureWhatsAppTemplateCollections();
    }
  }

  saveWhatsAppTemplates() {
    try {
      this.ensureWhatsAppTemplateCollections();
      localStorage.setItem(WHATSAPP_CONFIRM_TEMPLATES_STORAGE_KEY, JSON.stringify(this.whatsAppConfirmTemplates));
      localStorage.setItem(WHATSAPP_BIRTHDAY_TEMPLATES_STORAGE_KEY, JSON.stringify(this.whatsAppBirthdayTemplates));
      localStorage.setItem(WHATSAPP_CONFIRM_SELECTED_TEMPLATE_STORAGE_KEY, this.whatsAppSelectedConfirmTemplateId);
      localStorage.setItem(WHATSAPP_BIRTHDAY_SELECTED_TEMPLATE_STORAGE_KEY, this.whatsAppSelectedBirthdayTemplateId);
      localStorage.setItem(WHATSAPP_CONFIRM_TEMPLATE_STORAGE_KEY, this.whatsAppConfirmTemplate);
      localStorage.setItem(WHATSAPP_BIRTHDAY_TEMPLATE_STORAGE_KEY, this.whatsAppBirthdayTemplate);
    } catch (err) {
      console.log('Falha ao salvar templates de WhatsApp:', err);
    }
  }

  renderWhatsAppTemplateEditor(kind) {
    const state = this.getWhatsAppTemplateState(kind);
    const selectEl = document.getElementById(state.selectId);
    const nameEl = document.getElementById(state.nameId);
    const textEl = document.getElementById(state.textId);
    if (!selectEl || !nameEl || !textEl) return;

    const selectedId = state.selectedId;
    selectEl.innerHTML = state.templates
      .map((tpl) => `<option value="${safeText(tpl.id)}">${safeText(tpl.name)}</option>`)
      .join('');

    const selected = state.templates.find((tpl) => tpl.id === selectedId) || state.templates[0];
    if (!selected) return;

    selectEl.value = selected.id;
    nameEl.value = selected.name;
    textEl.value = selected.text;
  }

  selectWhatsAppTemplate(kind, templateId) {
    this.setWhatsAppSelectedTemplate(kind, templateId);
    this.saveWhatsAppTemplates();
    this.renderWhatsAppTemplateEditor(kind);
  }

  saveNewWhatsAppTemplate(kind) {
    const state = this.getWhatsAppTemplateState(kind);
    const nameEl = document.getElementById(state.nameId);
    const textEl = document.getElementById(state.textId);
    const name = String((nameEl || {}).value || '').trim();
    const text = String((textEl || {}).value || '').trim();

    if (!name) {
      this.showToast('Informe um nome para o novo envio.', 'warning');
      return;
    }
    if (!text) {
      this.showToast('Informe o texto do envio personalizado.', 'warning');
      return;
    }

    const next = {
      id: this.createWhatsAppTemplateId(state.prefix),
      name,
      text
    };

    if (kind === 'birthday') {
      this.whatsAppBirthdayTemplates.unshift(next);
      this.whatsAppSelectedBirthdayTemplateId = next.id;
    } else {
      this.whatsAppConfirmTemplates.unshift(next);
      this.whatsAppSelectedConfirmTemplateId = next.id;
    }

    this.syncActiveWhatsAppTemplateTexts();
    this.saveWhatsAppTemplates();
    this.renderWhatsAppTemplateEditor(kind);
    this.showToast('Novo envio personalizado cadastrado.', 'success');
  }

  updateSelectedWhatsAppTemplate(kind) {
    const state = this.getWhatsAppTemplateState(kind);
    const nameEl = document.getElementById(state.nameId);
    const textEl = document.getElementById(state.textId);
    const name = String((nameEl || {}).value || '').trim();
    const text = String((textEl || {}).value || '').trim();
    if (!name || !text) {
      this.showToast('Nome e texto são obrigatórios para atualizar.', 'warning');
      return;
    }

    let changed = false;
    if (kind === 'birthday') {
      this.whatsAppBirthdayTemplates = this.whatsAppBirthdayTemplates.map((tpl) => {
        if (tpl.id !== this.whatsAppSelectedBirthdayTemplateId) return tpl;
        changed = true;
        return { ...tpl, name, text };
      });
    } else {
      this.whatsAppConfirmTemplates = this.whatsAppConfirmTemplates.map((tpl) => {
        if (tpl.id !== this.whatsAppSelectedConfirmTemplateId) return tpl;
        changed = true;
        return { ...tpl, name, text };
      });
    }

    if (!changed) {
      this.showToast('Selecione um envio para atualizar.', 'warning');
      return;
    }

    this.syncActiveWhatsAppTemplateTexts();
    this.saveWhatsAppTemplates();
    this.renderWhatsAppTemplateEditor(kind);
    this.showToast('Envio personalizado atualizado.', 'success');
  }

  deleteSelectedWhatsAppTemplate(kind) {
    const state = this.getWhatsAppTemplateState(kind);
    if (state.templates.length <= 1) {
      this.showToast('Mantenha ao menos um envio cadastrado.', 'warning');
      return;
    }

    if (kind === 'birthday') {
      this.whatsAppBirthdayTemplates = this.whatsAppBirthdayTemplates.filter((tpl) => tpl.id !== this.whatsAppSelectedBirthdayTemplateId);
      this.whatsAppSelectedBirthdayTemplateId = this.whatsAppBirthdayTemplates[0].id;
    } else {
      this.whatsAppConfirmTemplates = this.whatsAppConfirmTemplates.filter((tpl) => tpl.id !== this.whatsAppSelectedConfirmTemplateId);
      this.whatsAppSelectedConfirmTemplateId = this.whatsAppConfirmTemplates[0].id;
    }

    this.syncActiveWhatsAppTemplateTexts();
    this.saveWhatsAppTemplates();
    this.renderWhatsAppTemplateEditor(kind);
    this.showToast('Envio personalizado removido.', 'info');
  }

  duplicateSelectedWhatsAppTemplate(kind) {
    const state = this.getWhatsAppTemplateState(kind);
    const selected = state.templates.find((tpl) => tpl.id === state.selectedId) || state.templates[0];
    if (!selected) {
      this.showToast('Selecione um envio para duplicar.', 'warning');
      return;
    }

    const copy = {
      id: this.createWhatsAppTemplateId(state.prefix),
      name: `${selected.name} (copia)`,
      text: selected.text
    };

    if (kind === 'birthday') {
      this.whatsAppBirthdayTemplates.unshift(copy);
      this.whatsAppSelectedBirthdayTemplateId = copy.id;
    } else {
      this.whatsAppConfirmTemplates.unshift(copy);
      this.whatsAppSelectedConfirmTemplateId = copy.id;
    }

    this.syncActiveWhatsAppTemplateTexts();
    this.saveWhatsAppTemplates();
    this.renderWhatsAppTemplateEditor(kind);
    this.showToast('Envio duplicado com sucesso.', 'success');
  }

  resetSelectedWhatsAppTemplate(kind) {
    const state = this.getWhatsAppTemplateState(kind);
    const selectedId = state.selectedId;

    if (kind === 'birthday') {
      this.whatsAppBirthdayTemplates = this.whatsAppBirthdayTemplates.map((tpl) =>
        tpl.id === selectedId ? { ...tpl, text: state.defaultText } : tpl
      );
    } else {
      this.whatsAppConfirmTemplates = this.whatsAppConfirmTemplates.map((tpl) =>
        tpl.id === selectedId ? { ...tpl, text: state.defaultText } : tpl
      );
    }

    this.syncActiveWhatsAppTemplateTexts();
    this.saveWhatsAppTemplates();
    this.renderWhatsAppTemplateEditor(kind);
    this.showToast('Texto do envio restaurado para o padrão.', 'info');
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

  async fetchCepData(rawCep) {
    const cep = this.normalizeCep(rawCep);
    if (cep.length !== 8) return { cep, data: null, notFound: false };

    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`, { cache: 'no-store' });
    if (!response.ok) throw new Error('Falha na consulta de CEP');

    const data = await response.json();
    if (data && data.erro) return { cep, data: null, notFound: true };
    return { cep, data, notFound: false };
  }

  async fillAddressByCep(rawCep) {
    const cepInput = document.getElementById('client-cep');
    const cep = this.normalizeCep(rawCep);

    if (cepInput) cepInput.value = this.formatCep(cep);
    if (cep.length !== 8) return;

    try {
      const result = await this.fetchCepData(cep);
      if (result.notFound || !result.data) {
        this.showToast('CEP não encontrado.', 'warning');
        return;
      }
      const data = result.data;

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

  async fillAnamneseIndividualAddressByCep(rawCep) {
    const cepField = document.querySelector('[data-anamnese="individual.cep"]');
    const cep = this.normalizeCep(rawCep);

    if (cepField) cepField.value = this.formatCep(cep);
    if (cep.length !== 8) return;

    try {
      const result = await this.fetchCepData(cep);
      if (result.notFound || !result.data) {
        this.showToast('CEP não encontrado.', 'warning');
        return;
      }

      const data = result.data;
      const setAnamneseIfPresent = (key, value) => {
        const field = document.querySelector(`[data-anamnese="individual.${key}"]`);
        if (!field) return;
        field.value = String(value || '').trim();
      };

      setAnamneseIfPresent('endereco', data.logradouro);
      setAnamneseIfPresent('bairro', data.bairro);
      setAnamneseIfPresent('municipio', data.localidade);
      setAnamneseIfPresent('uf', data.uf);

      const complementField = document.querySelector('[data-anamnese="individual.endereco_complemento"]');
      if (complementField && !String(complementField.value || '').trim()) {
        complementField.value = String(data.complemento || '').trim();
      }

      const numberField = document.querySelector('[data-anamnese="individual.numero_residencia"]');
      if (numberField && !String(numberField.value || '').trim()) {
        numberField.focus();
      }

      this.showToast('Endereço da anamnese preenchido automaticamente pelo CEP.', 'success');
    } catch (err) {
      this.lastAnamneseIndividualCepLookup = '';
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
    const toneMap = {
      danger: 'error',
      error: 'error',
      warning: 'warning',
      success: 'success',
      info: 'info'
    };
    const tone = toneMap[String(type || 'info').toLowerCase()] || 'info';
    const text = String(message || '').trim();
    if (!text) return;

    const container = this.getToastContainer();
    if (!container) {
      console.log(`[${tone}] ${text}`);
      return;
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${tone}`;
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    toast.textContent = text;

    container.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('is-visible'));

    const removeToast = () => {
      toast.classList.remove('is-visible');
      window.setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 220);
    };

    window.setTimeout(removeToast, 4200);
  }

  getToastContainer() {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    return container;
  }

  getAppointmentDateTime(appointment) {
    const date = String((appointment && appointment.date) || '').trim();
    const time = String((appointment && appointment.time) || '').trim();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return null;
    if (!/^\d{2}:\d{2}$/.test(time)) return null;

    const [year, month, day] = date.split('-').map((v) => Number(v));
    const [hour, minute] = time.split(':').map((v) => Number(v));
    const parsed = new Date(year, month - 1, day, hour, minute, 0, 0);
    if (Number.isNaN(parsed.getTime())) return null;
    return parsed;
  }

  isReminderBlockedByStatus(appointment) {
    const status = String((appointment && appointment.status) || '').toLowerCase();
    return status.includes('cancel') || status.includes('conclu') || status.includes('realiz');
  }

  buildReminderKey(appointment) {
    const id = String((appointment && appointment.id) || '').trim();
    const date = String((appointment && appointment.date) || '').trim();
    const time = String((appointment && appointment.time) || '').trim();
    return `${id}|${date}|${time}`;
  }

  pruneReminderNotifiedKeys() {
    const validKeys = new Set(
      this.appointments
        .filter((appt) => !this.isReminderBlockedByStatus(appt))
        .map((appt) => this.buildReminderKey(appt))
    );

    this.reminderNotifiedKeys.forEach((key) => {
      if (!validKeys.has(key)) this.reminderNotifiedKeys.delete(key);
    });
  }

  async ensureNotificationPermission(showFeedback = false) {
    if (!('Notification' in window)) {
      this.updateNotificationPermissionUI();
      if (showFeedback) this.showToast('Este navegador não suporta notificações do sistema.', 'warning');
      return 'unsupported';
    }

    if (Notification.permission === 'granted') {
      this.updateNotificationPermissionUI();
      return 'granted';
    }

    if (Notification.permission === 'denied') {
      this.updateNotificationPermissionUI();
      if (showFeedback) this.showToast('Notificações bloqueadas no navegador. Libere nas permissões do site.', 'warning');
      return 'denied';
    }

    try {
      const permission = await Notification.requestPermission();
      this.updateNotificationPermissionUI();
      if (permission === 'granted' && showFeedback) {
        this.showToast('Notificações do sistema ativadas.', 'success');
      } else if (permission !== 'granted' && showFeedback) {
        this.showToast('Permissão de notificação não concedida.', 'warning');
      }
      return permission;
    } catch (err) {
      this.updateNotificationPermissionUI();
      if (showFeedback) this.showToast('Falha ao solicitar permissão de notificação.', 'warning');
      return 'error';
    }
  }

  async sendSystemNotification(title, body, options = {}) {
    const permission = await this.ensureNotificationPermission(false);
    if (permission !== 'granted') return false;

    const payload = {
      body,
      icon: './assets/icons/icon-192.png',
      badge: './assets/icons/icon-192.png',
      tag: options.tag || `consultorio-notification-${Date.now()}`,
      renotify: true,
      requireInteraction: false,
      data: {
        appointmentId: options.appointmentId || '',
        url: './'
      }
    };

    try {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready;
        if (registration && typeof registration.showNotification === 'function') {
          await registration.showNotification(title, payload);
          return true;
        }
      }

      // Fallback para navegadores sem suporte completo ao Service Worker.
      // eslint-disable-next-line no-new
      new Notification(title, payload);
      return true;
    } catch (err) {
      return false;
    }
  }

  async notifyUpcomingAppointment(appointment, minutesLeft, isManualTest = false) {
    const clientName = String((appointment && appointment.clientName) || 'Paciente').trim() || 'Paciente';
    const procedure = String((appointment && appointment.procedure) || 'Consulta').trim() || 'Consulta';
    const time = String((appointment && appointment.time) || '--:--').trim() || '--:--';
    const whenText = minutesLeft <= 0 ? 'agora' : `em ${minutesLeft} min`;

    const title = isManualTest ? 'Teste de aviso' : 'Lembrete de consulta';
    const body = `${clientName} - ${procedure} às ${time} (${whenText})`;
    this.showToast(body, 'warning');

    if (this.soundEnabled) this.playReminderSound();

    const sent = await this.sendSystemNotification(title, body, {
      appointmentId: appointment && appointment.id ? appointment.id : '',
      tag: appointment && appointment.id ? `appt-reminder-${appointment.id}` : `appt-reminder-${Date.now()}`
    });

    if (isManualTest) {
      if (sent) this.showToast('Notificação do sistema enviada com sucesso.', 'success');
      else this.showToast('Não foi possível enviar notificação do sistema. Verifique a permissão do navegador.', 'warning');
    }
  }

  checkAppointmentReminders() {
    if (!Array.isArray(this.appointments) || !this.appointments.length) return;

    this.pruneReminderNotifiedKeys();

    const now = new Date();
    const reminderWindow = Number.isFinite(Number(this.reminderMinutes)) ? Math.max(1, Number(this.reminderMinutes)) : 15;

    this.appointments.forEach((appointment) => {
      if (!appointment || !appointment.id) return;
      if (this.isReminderBlockedByStatus(appointment)) return;

      const startsAt = this.getAppointmentDateTime(appointment);
      if (!startsAt) return;

      const diffMs = startsAt.getTime() - now.getTime();
      const diffMinutes = diffMs / 60000;
      if (diffMinutes > reminderWindow) return;
      if (diffMinutes < -2) return;

      const reminderKey = this.buildReminderKey(appointment);
      if (this.reminderNotifiedKeys.has(reminderKey)) return;
      this.reminderNotifiedKeys.add(reminderKey);

      const minutesLeft = Math.max(0, Math.round(diffMinutes));
      void this.notifyUpcomingAppointment(appointment, minutesLeft, false);
    });
  }

  startReminderWatcher() {
    if (this.reminderIntervalId) {
      window.clearInterval(this.reminderIntervalId);
      this.reminderIntervalId = null;
    }

    this.checkAppointmentReminders();
    this.reminderIntervalId = window.setInterval(() => {
      this.checkAppointmentReminders();
    }, this.reminderCheckIntervalMs);
  }

  prefillSenhaTabFields() {
    const creds = getLoginCredentials();
    const currentUser = document.getElementById('senha-current-user');
    const newUser = document.getElementById('novo-user-name');

    if (currentUser) currentUser.value = creds.username || '';
    if (newUser && !String(newUser.value || '').trim()) newUser.value = creds.username || '';
  }

  handleChangePasswordForm() {
    const currentPassword = String((document.getElementById('senha-current-pass') || {}).value || '');
    const newPassword = String((document.getElementById('senha-new-pass') || {}).value || '');
    const confirmPassword = String((document.getElementById('senha-confirm-pass') || {}).value || '');
    const creds = getLoginCredentials();

    if (!currentPassword || !newPassword || !confirmPassword) {
      this.showToast('Preencha todos os campos para alterar a senha.', 'warning');
      return;
    }

    if (currentPassword !== creds.password) {
      this.showToast('Senha atual incorreta.', 'warning');
      return;
    }

    if (newPassword.length < 4) {
      this.showToast('A nova senha deve ter ao menos 4 caracteres.', 'warning');
      return;
    }

    if (newPassword !== confirmPassword) {
      this.showToast('A confirmação da nova senha não confere.', 'warning');
      return;
    }

    if (!setLoginCredentials(creds.username, newPassword)) {
      this.showToast('Não foi possível salvar a nova senha.', 'warning');
      return;
    }

    const form = document.getElementById('form-change-password');
    if (form) form.reset();

    const currentUser = document.getElementById('senha-current-user');
    if (currentUser) currentUser.value = creds.username || '';

    const loginUserInput = document.getElementById('login-username');
    if (loginUserInput) loginUserInput.value = creds.username || '';

    this.showToast('Senha alterada com sucesso.', 'success');
  }

  handleCreateUserForm() {
    const newUsername = String((document.getElementById('novo-user-name') || {}).value || '').trim();
    const newPassword = String((document.getElementById('novo-user-pass') || {}).value || '');
    const confirmPassword = String((document.getElementById('novo-user-pass-confirm') || {}).value || '');

    if (!newUsername || !newPassword || !confirmPassword) {
      this.showToast('Preencha usuário e senha para criar o novo acesso.', 'warning');
      return;
    }

    if (newPassword.length < 4) {
      this.showToast('A senha do novo usuário deve ter ao menos 4 caracteres.', 'warning');
      return;
    }

    if (newPassword !== confirmPassword) {
      this.showToast('A confirmação da senha do novo usuário não confere.', 'warning');
      return;
    }

    if (!setLoginCredentials(newUsername, newPassword)) {
      this.showToast('Não foi possível salvar o novo usuário.', 'warning');
      return;
    }

    const form = document.getElementById('form-create-user');
    if (form) form.reset();

    const newUser = document.getElementById('novo-user-name');
    if (newUser) newUser.value = newUsername;

    const currentUser = document.getElementById('senha-current-user');
    if (currentUser) currentUser.value = newUsername;

    const loginUserInput = document.getElementById('login-username');
    if (loginUserInput) loginUserInput.value = newUsername;

    this.showToast('Novo usuário cadastrado com sucesso.', 'success');
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
    this.prefillSenhaTabFields();
    this.prefillFirebaseConfig();
    this.updateCloudSyncMeta('Modo local', 'local');
    this.startReminderWatcher();
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
    this.updateNotificationPermissionUI();
  }

  updateNotificationPermissionUI() {
    const pill = document.getElementById('notification-permission-pill');
    const enableBtn = document.getElementById('btn-enable-notifications');

    if (!pill && !enableBtn) return;

    const resetPillState = () => {
      if (!pill) return;
      pill.classList.remove('is-granted', 'is-prompt', 'is-denied', 'is-unsupported', 'is-default');
    };

    const unsupported = !('Notification' in window);
    const permission = unsupported ? 'unsupported' : Notification.permission;

    if (pill) {
      resetPillState();
      if (permission === 'granted') {
        pill.classList.add('is-granted');
        pill.textContent = 'Notificação: Permitida';
      } else if (permission === 'denied') {
        pill.classList.add('is-denied');
        pill.textContent = 'Notificação: Bloqueada';
      } else if (permission === 'prompt') {
        pill.classList.add('is-prompt');
        pill.textContent = 'Notificação: Pendente';
      } else {
        pill.classList.add('is-unsupported');
        pill.textContent = 'Notificação: Indisponível';
      }
    }

    if (enableBtn) {
      const shouldShow = permission === 'prompt' || permission === 'denied';
      enableBtn.style.display = shouldShow ? 'inline-flex' : 'none';
      enableBtn.disabled = permission === 'denied';
      enableBtn.title = permission === 'denied'
        ? 'Notificação bloqueada no navegador. Libere nas permissões do site.'
        : 'Ativar permissão de notificações do navegador';
    }
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

  selectAppointmentColor(color) {
    const normalized = normalizeHexColor(color);
    const hidden = document.getElementById('appt-color');
    if (hidden) hidden.value = normalized;

    document.querySelectorAll('#appt-color-palette .color-swatch').forEach((swatch) => {
      const swatchColor = normalizeHexColor(swatch.getAttribute('data-color'));
      swatch.classList.toggle('selected', swatchColor === normalized);
      swatch.setAttribute('aria-pressed', swatchColor === normalized ? 'true' : 'false');
    });
  }


  initEvents() {
    const loginForm = document.getElementById('login-form');
    const saveFirebaseBtn = document.getElementById('btn-save-firebase');
    const disconnectFirebaseBtn = document.getElementById('btn-disconnect-firebase');
    const firebaseConfigInput = document.getElementById('cfg-firebase-json');
    const loginUserInput = document.getElementById('login-username');
    const loginPassInput = document.getElementById('login-password');
    const showPassInput = document.getElementById('login-show-password');
    const changePasswordForm = document.getElementById('form-change-password');
    const createUserForm = document.getElementById('form-create-user');
    const toggleSenhaCurrent = document.getElementById('senha-toggle-current');
    const toggleSenhaNew = document.getElementById('senha-toggle-new');
    const toggleSenhaConfirm = document.getElementById('senha-toggle-confirm');
    const toggleNovoUserPass = document.getElementById('novo-user-toggle-pass');
    const toggleNovoUserConfirm = document.getElementById('novo-user-toggle-confirm');

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

    if (changePasswordForm) {
      changePasswordForm.addEventListener('submit', (event) => {
        event.preventDefault();
        this.handleChangePasswordForm();
      });
    }

    if (createUserForm) {
      createUserForm.addEventListener('submit', (event) => {
        event.preventDefault();
        this.handleCreateUserForm();
      });
    }

    if (toggleSenhaCurrent) {
      toggleSenhaCurrent.addEventListener('change', () => {
        const input = document.getElementById('senha-current-pass');
        if (input) input.type = toggleSenhaCurrent.checked ? 'text' : 'password';
      });
    }

    if (toggleSenhaNew) {
      toggleSenhaNew.addEventListener('change', () => {
        const input = document.getElementById('senha-new-pass');
        if (input) input.type = toggleSenhaNew.checked ? 'text' : 'password';
      });
    }

    if (toggleSenhaConfirm) {
      toggleSenhaConfirm.addEventListener('change', () => {
        const input = document.getElementById('senha-confirm-pass');
        if (input) input.type = toggleSenhaConfirm.checked ? 'text' : 'password';
      });
    }

    if (toggleNovoUserPass) {
      toggleNovoUserPass.addEventListener('change', () => {
        const input = document.getElementById('novo-user-pass');
        if (input) input.type = toggleNovoUserPass.checked ? 'text' : 'password';
      });
    }

    if (toggleNovoUserConfirm) {
      toggleNovoUserConfirm.addEventListener('change', () => {
        const input = document.getElementById('novo-user-pass-confirm');
        if (input) input.type = toggleNovoUserConfirm.checked ? 'text' : 'password';
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

      const paymentSaveTrigger = target.closest('#btn-save-payment');
      if (paymentSaveTrigger) {
        event.preventDefault();
        event.stopPropagation();
        this.savePaymentForm();
        return;
      }

      const paymentCloseTrigger = target.closest('#btn-cancel-payment, #btn-close-payment, #btn-cancel-pay, #btn-close-pay');
      if (paymentCloseTrigger) {
        event.preventDefault();
        event.stopPropagation();
        this.closePaymentModal();
        return;
      }

      const paymentQuitarTrigger = target.closest('#btn-pay-quitar');
      if (paymentQuitarTrigger) {
        event.preventDefault();
        event.stopPropagation();
        const balanceEl = document.getElementById('pay-balance');
        const input = document.getElementById('pay-amount-now');
        if (input && balanceEl) {
          const raw = String(balanceEl.textContent || '').replace(/[^\d,\.]/g, '').replace(',', '.');
          input.value = parseFloat(raw) || 0;
        }
        return;
      }

      const clientCloseTrigger = target.closest('#btn-cancel-client, #btn-close-client');
      if (clientCloseTrigger) {
        event.preventDefault();
        event.stopPropagation();
        this.closeClientModal();
        return;
      }

      const clientGroupsOpenTrigger = target.closest('#btn-manage-client-groups');
      if (clientGroupsOpenTrigger) {
        event.preventDefault();
        event.stopPropagation();
        this.openClientGroupsModal();
        return;
      }

      const clientGroupsCloseTrigger = target.closest('#btn-close-client-groups, #btn-close-client-groups-footer');
      if (clientGroupsCloseTrigger) {
        event.preventDefault();
        event.stopPropagation();
        this.closeClientGroupsModal();
        return;
      }

      const appointmentCloseTrigger = target.closest('#btn-cancel-appointment, #btn-close-appointment');
      if (appointmentCloseTrigger) {
        event.preventDefault();
        event.stopPropagation();
        this.closeAppointmentModal();
        return;
      }

      const expenseCloseTrigger = target.closest('#btn-cancel-expense, #btn-close-expense');
      if (expenseCloseTrigger) {
        event.preventDefault();
        event.stopPropagation();
        this.closeExpenseModal();
        return;
      }

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

    const anamneseIndividualCepInput = document.querySelector('[data-anamnese="individual.cep"]');
    if (anamneseIndividualCepInput) {
      anamneseIndividualCepInput.addEventListener('input', () => {
        anamneseIndividualCepInput.value = this.formatCep(anamneseIndividualCepInput.value);

        const cep = this.normalizeCep(anamneseIndividualCepInput.value);
        if (cep.length < 8) {
          this.lastAnamneseIndividualCepLookup = '';
          return;
        }

        if (cep === this.lastAnamneseIndividualCepLookup) return;
        this.lastAnamneseIndividualCepLookup = cep;
        void this.fillAnamneseIndividualAddressByCep(cep);
      });
      anamneseIndividualCepInput.addEventListener('blur', () => {
        const cep = this.normalizeCep(anamneseIndividualCepInput.value);
        if (cep.length !== 8) return;
        if (cep === this.lastAnamneseIndividualCepLookup) return;

        this.lastAnamneseIndividualCepLookup = cep;
        void this.fillAnamneseIndividualAddressByCep(cep);
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

    ['btn-cancel-payment', 'btn-close-payment', 'btn-cancel-pay', 'btn-close-pay'].forEach((id) => {
      const btn = document.getElementById(id);
      if (btn) btn.addEventListener('click', () => this.closePaymentModal());
    });
    const btnSavePayment = document.getElementById('btn-save-payment');
    if (btnSavePayment) btnSavePayment.addEventListener('click', () => this.savePaymentForm());
    const formQuickPay = document.getElementById('form-quick-pay');
    if (formQuickPay) {
      formQuickPay.addEventListener('submit', (e) => {
        e.preventDefault();
        this.savePaymentForm();
      });
    }
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
    const btnEnableNotifications = document.getElementById('btn-enable-notifications');
    if (btnTestSound) {
      btnTestSound.addEventListener('click', async () => {
        await this.ensureNotificationPermission(true);
        const simulatedAppointment = {
          id: `appt-test-${Date.now()}`,
          clientName: 'Paciente de teste',
          procedure: 'Lembrete de consulta',
          time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        };
        void this.notifyUpcomingAppointment(simulatedAppointment, 0, true);
      });
    }

    if (btnEnableNotifications) {
      btnEnableNotifications.addEventListener('click', async () => {
        await this.ensureNotificationPermission(true);
        this.updateNotificationPermissionUI();
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
        this.checkAppointmentReminders();
      });
    }

    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        this.checkAppointmentReminders();
        this.updateNotificationPermissionUI();
      }
    });

    window.addEventListener('focus', () => {
      this.checkAppointmentReminders();
      this.updateNotificationPermissionUI();
    });

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
      'btn-print-patient-individual': () => this.generatePacienteIndividualReport(true),
      'btn-print-client-individual': () => this.printClientIndividualReport(),
      'btn-print-selected-clients': () => this.printSelectedClientsReports(),
      'btn-print-selected-finance': () => this.printSelectedFinanceiroReports(),
      'btn-print-total-finance': () => this.printFinanceiroTotalReport()
    };

    Object.keys(reportHandlers).forEach((id) => {
      const btn = document.getElementById(id);
      if (btn) btn.addEventListener('click', reportHandlers[id]);
    });

    const confirmSelect = document.getElementById('ws-confirm-template-select');
    if (confirmSelect) {
      confirmSelect.addEventListener('change', () => this.selectWhatsAppTemplate('confirm', confirmSelect.value));
    }

    const birthdaySelect = document.getElementById('ws-birthday-template-select');
    if (birthdaySelect) {
      birthdaySelect.addEventListener('change', () => this.selectWhatsAppTemplate('birthday', birthdaySelect.value));
    }

    const btnConfirmSaveNew = document.getElementById('btn-ws-confirm-save-new');
    if (btnConfirmSaveNew) btnConfirmSaveNew.addEventListener('click', () => this.saveNewWhatsAppTemplate('confirm'));

    const btnConfirmUpdate = document.getElementById('btn-ws-confirm-update');
    if (btnConfirmUpdate) btnConfirmUpdate.addEventListener('click', () => this.updateSelectedWhatsAppTemplate('confirm'));

    const btnConfirmDelete = document.getElementById('btn-ws-confirm-delete');
    if (btnConfirmDelete) btnConfirmDelete.addEventListener('click', () => this.deleteSelectedWhatsAppTemplate('confirm'));

    const btnConfirmDuplicate = document.getElementById('btn-ws-confirm-duplicate');
    if (btnConfirmDuplicate) btnConfirmDuplicate.addEventListener('click', () => this.duplicateSelectedWhatsAppTemplate('confirm'));

    const btnResetConfirmTemplate = document.getElementById('btn-ws-confirm-reset');
    if (btnResetConfirmTemplate) btnResetConfirmTemplate.addEventListener('click', () => this.resetSelectedWhatsAppTemplate('confirm'));

    const btnBirthdaySaveNew = document.getElementById('btn-ws-birthday-save-new');
    if (btnBirthdaySaveNew) btnBirthdaySaveNew.addEventListener('click', () => this.saveNewWhatsAppTemplate('birthday'));

    const btnBirthdayUpdate = document.getElementById('btn-ws-birthday-update');
    if (btnBirthdayUpdate) btnBirthdayUpdate.addEventListener('click', () => this.updateSelectedWhatsAppTemplate('birthday'));

    const btnBirthdayDelete = document.getElementById('btn-ws-birthday-delete');
    if (btnBirthdayDelete) btnBirthdayDelete.addEventListener('click', () => this.deleteSelectedWhatsAppTemplate('birthday'));

    const btnBirthdayDuplicate = document.getElementById('btn-ws-birthday-duplicate');
    if (btnBirthdayDuplicate) btnBirthdayDuplicate.addEventListener('click', () => this.duplicateSelectedWhatsAppTemplate('birthday'));

    const btnResetBirthdayTemplate = document.getElementById('btn-ws-birthday-reset');
    if (btnResetBirthdayTemplate) btnResetBirthdayTemplate.addEventListener('click', () => this.resetSelectedWhatsAppTemplate('birthday'));

    const btnRefreshBirthdays = document.getElementById('btn-ws-birthday-refresh');
    if (btnRefreshBirthdays) btnRefreshBirthdays.addEventListener('click', () => this.renderWhatsAppBirthdayList());

    const birthdaysBtn = document.getElementById('btn-open-birthdays');
    if (birthdaysBtn) {
      birthdaysBtn.addEventListener('click', () => {
        this.switchTab('whatsapp');
        this.renderWhatsAppBirthdayList();
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
    const userInput = document.getElementById('login-username');

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
    if (userInput) {
      const creds = getLoginCredentials();
      userInput.value = creds.username || '';
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

  updateFirebaseAuthStatus(state = 'offline', label = '') {
    const el = document.getElementById('firebase-auth-status');
    if (!el) return;

    el.classList.remove('auth-ok', 'auth-pending', 'auth-error', 'auth-offline');

    if (state === 'ok') {
      el.classList.add('auth-ok');
      el.textContent = label || 'Auth Firebase: OK';
      return;
    }

    if (state === 'pending') {
      el.classList.add('auth-pending');
      el.textContent = label || 'Auth Firebase: Autenticando';
      return;
    }

    if (state === 'error') {
      el.classList.add('auth-error');
      el.textContent = label || 'Auth Firebase: Bloqueado';
      return;
    }

    el.classList.add('auth-offline');
    el.textContent = label || 'Auth Firebase: Desconectado';
  }

  disconnectFirebase() {
    this.firebaseConnected = false;
    this.firebaseApp = null;
    this.firebaseDb = null;
    this.setFirebaseStatus(false, 'Desconectado do Firebase', 'local');
    this.updateFirebaseAuthStatus('offline', 'Auth Firebase: Desconectado');
    this.showToast('Firebase desconectado.', 'info');
  }

  async initFirebase() {
    const input = document.getElementById('cfg-firebase-json');
    const config = this.firebaseConfig || this.loadFirebaseConfig() || DEFAULT_FIREBASE_CONFIG;

    if (!config || !config.projectId) {
      this.setFirebaseStatus(false, 'Configure o JSON do Firebase', 'local');
      this.updateFirebaseAuthStatus('error', 'Auth Firebase: Configuração inválida');
      this.showToast('Cole a configuração do Firebase no campo indicado.', 'warning');
      return false;
    }

    if (input) input.value = JSON.stringify(config, null, 2);
    this.firebaseConfig = config;
    this.saveFirebaseConfig(config);
    this.updateFirebaseAuthStatus('pending', 'Auth Firebase: Autenticando');

    try {
      if (!window.firebase || !window.firebase.apps || !window.firebase.firestore) {
        this.updateFirebaseAuthStatus('error', 'Auth Firebase: SDK ausente');
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
            const authMessage = authErr && authErr.message ? authErr.message : 'Autenticação anônima indisponível.';
            this.updateFirebaseAuthStatus('error', 'Auth Firebase: anônimo bloqueado');
            throw new Error(`Falha ao autenticar no Firebase: ${authMessage}`);
          }
        }

        if (!auth.currentUser) {
          this.updateFirebaseAuthStatus('error', 'Auth Firebase: sem usuário');
          throw new Error('Sem usuário autenticado no Firebase. Verifique Auth anônimo no Console.');
        }

        this.updateFirebaseAuthStatus('ok', 'Auth Firebase: OK');
      } else {
        this.updateFirebaseAuthStatus('error', 'Auth Firebase: SDK Auth ausente');
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
        this.updateFirebaseAuthStatus('error', 'Auth Firebase: sem permissão');
        this.showToast(`Sincronização cancelada: ${message}`, 'warning');
      }
      return true;
    } catch (err) {
      const message = err && err.message ? err.message : 'Erro desconhecido';
      const isPermissionError = /permission|permissions/i.test(message);
      const isAuthError = /auth|autentica|signInAnonymously|anonymous/i.test(message);
      const isNetworkError = /network|Failed to fetch|ERR_ABORTED|unavailable/i.test(message);
      this.firebaseConnected = false;
      this.firebaseDb = null;
      this.setFirebaseStatus(false, (isPermissionError || isAuthError) ? 'Firebase sem permissão' : 'Falha ao conectar no Firebase', 'local');
      this.updateFirebaseAuthStatus((isPermissionError || isAuthError) ? 'error' : 'offline', (isPermissionError || isAuthError) ? 'Auth Firebase: Bloqueado' : 'Auth Firebase: Offline');
      this.showToast(
        (isPermissionError || isAuthError)
          ? 'Sem permissão no Firebase. Confirme as regras e a autenticação anônima no Console.'
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

  applyTemplateVars(templateText, vars) {
    return String(templateText || '').replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (_, key) => {
      const value = vars[key];
      return value == null ? '' : String(value);
    });
  }

  getSignatureName() {
    const creds = getLoginCredentials();
    return creds && creds.username ? creds.username : 'Consultório';
  }

  buildAppointmentWhatsAppMessage(appointment, client) {
    const vars = {
      cliente: (client && client.name) || appointment.clientName || 'Cliente',
      data: formatDateBR(appointment.date),
      hora: appointment.time || '--:--',
      procedimento: appointment.procedure || 'Consulta',
      valor: formatCurrency(appointment.price || 0),
      status: appointment.status || 'Agendado',
      assinatura: this.getSignatureName()
    };
    return this.applyTemplateVars(this.whatsAppConfirmTemplate, vars).trim();
  }

  buildBirthdayWhatsAppMessage(client) {
    const firstName = String(client.name || '').trim().split(' ')[0] || 'Cliente';
    const vars = {
      cliente: client.name || 'Cliente',
      primeiro_nome: firstName,
      aniversario: formatDateBR(client.dob || ''),
      assinatura: this.getSignatureName()
    };
    return this.applyTemplateVars(this.whatsAppBirthdayTemplate, vars).trim();
  }

  getBirthdaysFromWindow(windowDays = 30) {
    const today = new Date();
    const base = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const clientsWithDob = this.clients.filter((c) => /^\d{4}-\d{2}-\d{2}$/.test(String(c.dob || '')));

    const list = clientsWithDob.map((client) => {
      const dob = parseIsoDate(client.dob);
      if (!dob) return null;

      let nextBirthday = new Date(base.getFullYear(), dob.getMonth(), dob.getDate());
      if (nextBirthday < base) nextBirthday = new Date(base.getFullYear() + 1, dob.getMonth(), dob.getDate());

      const diffMs = nextBirthday.getTime() - base.getTime();
      const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
      return {
        client,
        nextBirthday,
        diffDays
      };
    }).filter(Boolean);

    return list
      .filter((item) => item.diffDays >= 0 && item.diffDays <= windowDays)
      .sort((a, b) => a.diffDays - b.diffDays);
  }

  renderWhatsAppBirthdayList() {
    const container = document.getElementById('ws-birthday-list');
    const birthdays = this.getBirthdaysFromWindow(30);
    const birthdaysToday = birthdays.filter((item) => item.diffDays === 0).length;
    const birthdayBadge = document.querySelector('#btn-open-birthdays .btn-notification-badge');
    if (birthdayBadge) birthdayBadge.textContent = String(birthdaysToday);

    if (!container) return;

    if (!birthdays.length) {
      container.innerHTML = '<div class="empty-state"><p>Nenhum aniversariante nos próximos 30 dias.</p></div>';
      return;
    }

    container.innerHTML = birthdays.map((item) => {
      const c = item.client;
      const whenLabel = item.diffDays === 0 ? 'Hoje' : (item.diffDays === 1 ? 'Amanhã' : `Em ${item.diffDays} dias`);
      const phoneValid = Boolean(this.normalizeWhatsAppPhone(c.phone || ''));
      return `
        <div class="pending-mini-item" style="margin-bottom:0.6rem;">
          <div class="pending-mini-info">
            <h4>${safeText(c.name || '-')}</h4>
            <p>${safeText(formatDateBR(c.dob || ''))} • ${safeText(whenLabel)} • ${safeText(c.phone || 'Sem telefone')}</p>
          </div>
          <div style="display:flex; gap:0.45rem; align-items:center;">
            <button class="btn btn-sm btn-secondary" type="button" onclick="app.sendBirthdayWhatsApp('${safeText(c.id || '')}')" ${phoneValid ? '' : 'disabled'}>
              <i data-lucide="message-circle"></i> Parabenizar
            </button>
          </div>
        </div>
      `;
    }).join('');

    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  }

  renderWhatsAppTab() {
    this.ensureWhatsAppTemplateCollections();
    this.renderWhatsAppTemplateEditor('confirm');
    this.renderWhatsAppTemplateEditor('birthday');

    this.renderWhatsAppBirthdayList();
  }

  sendBirthdayWhatsApp(clientId) {
    const client = this.clients.find((c) => String(c.id || '') === String(clientId || ''));
    if (!client) {
      this.showToast('Cliente não encontrado para envio.', 'warning');
      return;
    }

    const phone = this.normalizeWhatsAppPhone(client.phone || '');
    if (!phone) {
      this.showToast('Cliente sem telefone válido para WhatsApp.', 'warning');
      return;
    }

    const text = this.buildBirthdayWhatsAppMessage(client);
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener');
    this.showToast('Mensagem de aniversário preparada.', 'success');
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
                    <div class="agenda-event ${statusClass}" style="${agendaEventInlineStyle(a.color || DEFAULT_APPOINTMENT_COLOR)}" role="button" tabindex="0" data-appointment-id="${safeText(a.id || '')}" onclick="app.openAppointmentModal('${a.id}')" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();app.openAppointmentModal('${a.id}');}">
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
      const pendingBalance = Math.max(0, toNumber(a.price) - toNumber(a.amountPaid));
      const paymentAction = pendingBalance > 0
        ? `app.openPaymentModal('${a.id}')`
        : `app.openAppointmentModal('${a.id}')`;
      const paymentTitle = pendingBalance > 0
        ? 'Clique para dar baixa'
        : 'Pagamento quitado';
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
          <td><button type="button" class="badge ${paymentClass}" onclick="${paymentAction}" title="${paymentTitle}">${safeText(payment)}</button></td>
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

    const existingClientIds = new Set(this.clients.map((c) => c.id));
    this.selectedClientReportIds.forEach((id) => {
      if (!existingClientIds.has(id)) this.selectedClientReportIds.delete(id);
    });

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
          <td colspan="7">
            <div class="empty-state"><p>Nenhum cliente encontrado.</p></div>
          </td>
        </tr>
      `;
      this.updateClientPrintSelectionUI();
      return;
    }

    tbody.innerHTML = filtered.map((c) => `
      <tr>
        <td>
          <input
            type="checkbox"
            class="client-print-check"
            data-print-client-id="${safeText(c.id || '')}"
            ${this.selectedClientReportIds.has(c.id) ? 'checked' : ''}
            onchange="app.toggleClientReportSelection('${c.id}', this.checked)">
        </td>
        <td><strong>${c.registrationNumber || '-'}</strong></td>
        <td>${safeText(c.name || '-')}</td>
        <td>${safeText(c.phone || '-')}</td>
        <td>${safeText(c.email || '-')}</td>
        <td>${formatDateBR(c.createdAt || '')}</td>
        <td>
          <button class="btn btn-sm btn-secondary" onclick="app.printClientIndividualReport('${c.id}')">Imprimir</button>
          <button class="btn btn-sm btn-secondary" onclick="app.openClientModal('${c.id}')">Editar</button>
          <button class="btn btn-sm btn-ghost" style="color:var(--danger);" onclick="app.deleteClient('${c.id}')">Excluir</button>
        </td>
      </tr>
    `).join('');

    this.updateClientPrintSelectionUI();
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
    this.lastFinanceiroRows = rows.slice();

    if (!rows.length) {
      this.lastFinanceiroRows = [];
      tbody.innerHTML = `
        <tr>
          <td colspan="8"><div class="empty-state"><p>Nenhum registro financeiro encontrado.</p></div></td>
        </tr>
      `;
      this.updateFinancePrintSelectionUI();
      return;
    }

    tbody.innerHTML = rows.map((r) => {
      const status = r.pending > 0 ? (r.paid > 0 ? 'Parcial' : 'Pendente') : 'Pago';
      const statusAction = r.pending > 0
        ? `app.openPendingAppointmentByClient('${safeText(r.clientId)}')`
        : `app.openLatestAppointmentByClient('${safeText(r.clientId)}')`;
      const rowActionLabel = r.pending > 0 ? 'Baixar' : 'Editar';
      return `
        <tr>
          <td>
            <input
              type="checkbox"
              class="finance-print-check"
              data-finance-client-id="${safeText(r.clientId || '')}"
              ${this.selectedFinanceReportClientIds.has(r.clientId) ? 'checked' : ''}
              onchange="app.toggleFinanceReportSelection('${safeText(r.clientId)}', this.checked)">
          </td>
          <td>
            <button class="finance-client-link" type="button" onclick="app.openLatestAppointmentByClient('${safeText(r.clientId)}')">${safeText(r.clientName)}</button>
          </td>
          <td>${r.qty}</td>
          <td><button type="button" class="money-pill money-pill-total" onclick="app.openLatestAppointmentByClient('${safeText(r.clientId)}')" title="Clique para editar">${formatCurrency(r.total)}</button></td>
          <td><button type="button" class="money-pill money-pill-pending" onclick="app.openPendingAppointmentByClient('${safeText(r.clientId)}')" title="Clique para dar baixa">${formatCurrency(r.pending)}</button></td>
          <td><button type="button" class="money-pill money-pill-paid" onclick="app.openLatestAppointmentByClient('${safeText(r.clientId)}')" title="Clique para editar">${formatCurrency(r.paid)}</button></td>
          <td>
            <button class="finance-status-link" type="button" onclick="${statusAction}">${safeText(status)}</button>
          </td>
          <td>
            <button class="btn btn-sm btn-secondary" onclick="${statusAction}">${rowActionLabel}</button>
          </td>
        </tr>
      `;
    }).join('');

    this.updateFinancePrintSelectionUI();
  }

  toggleFinanceReportSelection(clientId, checked) {
    const key = String(clientId || '').trim();
    if (!key) return;

    if (checked) this.selectedFinanceReportClientIds.add(key);
    else this.selectedFinanceReportClientIds.delete(key);

    this.updateFinancePrintSelectionUI();
  }

  toggleAllVisibleFinanceReports(checked) {
    const checkboxes = Array.from(document.querySelectorAll('#financeiro-table-body .finance-print-check'));
    checkboxes.forEach((checkbox) => {
      const clientId = String(checkbox.getAttribute('data-finance-client-id') || '').trim();
      if (!clientId) return;

      checkbox.checked = Boolean(checked);
      if (checked) this.selectedFinanceReportClientIds.add(clientId);
      else this.selectedFinanceReportClientIds.delete(clientId);
    });

    this.updateFinancePrintSelectionUI();
  }

  updateFinancePrintSelectionUI() {
    const rows = Array.isArray(this.lastFinanceiroRows) ? this.lastFinanceiroRows : [];
    const selectedCount = rows.filter((row) => this.selectedFinanceReportClientIds.has(String(row.clientId || ''))).length;

    const btnPrintSelected = document.getElementById('btn-print-selected-finance');
    if (btnPrintSelected) {
      btnPrintSelected.disabled = selectedCount === 0;
      btnPrintSelected.innerHTML = `<i data-lucide="printer"></i> Imprimir Selecionados (${selectedCount})`;
    }

    const btnPrintTotal = document.getElementById('btn-print-total-finance');
    if (btnPrintTotal) {
      btnPrintTotal.disabled = rows.length === 0;
    }

    const selectAll = document.getElementById('financeiro-select-all-print');
    if (selectAll) {
      const checkboxes = Array.from(document.querySelectorAll('#financeiro-table-body .finance-print-check'));
      const totalVisible = checkboxes.length;
      const visibleChecked = checkboxes.filter((checkbox) => checkbox.checked).length;
      selectAll.checked = totalVisible > 0 && visibleChecked === totalVisible;
      selectAll.indeterminate = visibleChecked > 0 && visibleChecked < totalVisible;
    }

    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  }

  buildFinanceiroRowsReportLines(rows) {
    const safeRows = Array.isArray(rows) ? rows : [];
    const grandTotal = safeRows.reduce((sum, row) => sum + toNumber(row.total), 0);
    const grandPaid = safeRows.reduce((sum, row) => sum + toNumber(row.paid), 0);
    const grandPending = safeRows.reduce((sum, row) => sum + toNumber(row.pending), 0);

    const lines = [
      'RELATÓRIO FINANCEIRO',
      '',
      `Filtro atual: ${this.financeViewFilter === 'pending' ? 'Pendentes' : (this.financeViewFilter === 'paid' ? 'Recebidos' : 'Todos')}`,
      `Clientes no relatório: ${safeRows.length}`,
      `Total lançado: ${formatCurrency(grandTotal)}`,
      `Total pago: ${formatCurrency(grandPaid)}`,
      `Total pendente: ${formatCurrency(grandPending)}`,
      '',
      'Detalhamento por cliente:'
    ];

    safeRows.forEach((row) => {
      const status = row.pending > 0 ? (row.paid > 0 ? 'Parcial' : 'Pendente') : 'Pago';
      lines.push(`- ${row.clientName || 'Sem cliente'} | Qtd: ${row.qty} | Total: ${formatCurrency(row.total)} | Pendente: ${formatCurrency(row.pending)} | Pago: ${formatCurrency(row.paid)} | Status: ${status}`);

      const appointmentDetails = this.appointments
        .filter((appt) => String(appt.clientId || '') === String(row.clientId || ''))
        .sort((a, b) => `${a.date || ''} ${a.time || ''}`.localeCompare(`${b.date || ''} ${b.time || ''}`));

      appointmentDetails.forEach((appt) => {
        const price = toNumber(appt.price);
        const paid = toNumber(appt.amountPaid);
        const open = Math.max(0, price - paid);
        lines.push(`  • ${formatDateBR(appt.date)} ${appt.time || ''} | ${appt.procedure || '-'} | Total: ${formatCurrency(price)} | Pago: ${formatCurrency(paid)} | Aberto: ${formatCurrency(open)} | ${appt.status || '-'}`);
      });

      lines.push('');
    });

    return lines;
  }

  printSelectedFinanceiroReports() {
    const rows = (this.lastFinanceiroRows || []).filter((row) => this.selectedFinanceReportClientIds.has(String(row.clientId || '')));
    if (!rows.length) {
      this.showToast('Marque ao menos um cliente no financeiro para imprimir.', 'warning');
      return;
    }

    const lines = this.buildFinanceiroRowsReportLines(rows);
    this.openReportWindow('Relatório Financeiro (Selecionados)', lines.join('\n'), true);
  }

  printFinanceiroTotalReport() {
    const rows = this.lastFinanceiroRows || [];
    if (!rows.length) {
      this.showToast('Não há dados financeiros no filtro atual para imprimir.', 'warning');
      return;
    }

    const lines = this.buildFinanceiroRowsReportLines(rows);
    this.openReportWindow('Relatório Financeiro (Total)', lines.join('\n'), true);
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

  openPendingAppointmentByClient(clientId) {
    const key = String(clientId || '').trim();
    if (!key) {
      this.showToast('Cliente inválido para baixa.', 'warning');
      return;
    }

    const pendingMatches = this.appointments
      .filter((a) => String(a.clientId || '') === key)
      .filter((a) => Math.max(0, toNumber(a.price) - toNumber(a.amountPaid)) > 0)
      .sort((a, b) => `${b.date || ''} ${b.time || ''}`.localeCompare(`${a.date || ''} ${a.time || ''}`));

    if (!pendingMatches.length) {
      this.showToast('Este cliente não possui consulta pendente para baixa.', 'info');
      this.openLatestAppointmentByClient(key);
      return;
    }

    this.openPaymentModal(pendingMatches[0].id);
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
    const colorInput = document.getElementById('appt-color');
    if (idInput) idInput.value = '';
    if (title) title.textContent = 'Agendar Consulta';
    if (colorInput) colorInput.value = DEFAULT_APPOINTMENT_COLOR;
    this.selectAppointmentColor(DEFAULT_APPOINTMENT_COLOR);

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
        this.selectAppointmentColor(a.color || DEFAULT_APPOINTMENT_COLOR);
        if (title) title.textContent = 'Editar Consulta/Financeiro';
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
    const modal = document.getElementById('modal-payment') || document.getElementById('modal-payment-quick');
    if (!modal) return;

    const setText = (id, value) => {
      const el = document.getElementById(id);
      if (el) el.textContent = value;
    };

    const setValue = (id, value) => {
      const el = document.getElementById(id);
      if (el) el.value = value;
    };

    setValue('pay-appointment-id', appt.id);
    setValue('pay-appt-id', appt.id);
    setText('pay-client-name', appt.clientName || '-');
    setText('pay-date-time', `${formatDateBR(appt.date)} às ${appt.time || '--:--'}`);
    setText('pay-procedure', appt.procedure || '-');

    const total = toNumber(appt.price);
    const paid = toNumber(appt.amountPaid);
    const balance = Math.max(0, total - paid);
    setText('pay-total', formatCurrency(total));
    setText('pay-paid', formatCurrency(paid));
    setText('pay-balance', formatCurrency(balance));
    setValue('pay-total-display', formatCurrency(total));

    const methodEl = document.getElementById('pay-method');
    if (methodEl) methodEl.value = appt.paymentMethod || 'Pix';
    const amountNowEl = document.getElementById('pay-amount-now');
    if (amountNowEl) amountNowEl.value = balance > 0 ? balance : '';
    const amountInputLegacy = document.getElementById('pay-amount-input');
    if (amountInputLegacy) amountInputLegacy.value = paid;

    const statusSelect = document.getElementById('pay-status-select');
    if (statusSelect) {
      statusSelect.value = balance <= 0 ? 'Pago' : (paid > 0 ? 'Parcial' : 'Pendente');
    }

    modal.classList.add('active');
    if (window.lucide && typeof window.lucide.createIcons === 'function') window.lucide.createIcons();
  }

  closePaymentModal() {
    const modal = document.getElementById('modal-payment');
    const modalQuick = document.getElementById('modal-payment-quick');
    if (modal) modal.classList.remove('active');
    if (modalQuick) modalQuick.classList.remove('active');
  }

  savePaymentForm() {
    const id = (document.getElementById('pay-appointment-id') || {}).value || (document.getElementById('pay-appt-id') || {}).value || '';
    const appt = this.appointments.find((a) => a.id === id);
    if (!appt) { this.showToast('Agendamento não encontrado.', 'warning'); return; }

    const amountNowField = document.getElementById('pay-amount-now');
    const amountLegacyField = document.getElementById('pay-amount-input');
    const amountNow = toNumber((amountNowField || amountLegacyField || {}).value);
    const method = String((document.getElementById('pay-method') || {}).value || appt.paymentMethod || 'Pix');
    const total = toNumber(appt.price);
    const currentPaid = toNumber(appt.amountPaid);
    const balance = Math.max(0, total - currentPaid);

    const statusSelect = document.getElementById('pay-status-select');
    const explicitStatus = String((statusSelect || {}).value || '').trim();

    if (explicitStatus === 'Pendente') {
      appt.amountPaid = 0;
      appt.paymentMethod = method;
      appt.paymentStatus = 'Pendente';
      this.saveData();
      this.render();
      this.closePaymentModal();
      this.showToast('Pagamento marcado como pendente.', 'success');
      return;
    }

    if (explicitStatus === 'Pago') {
      appt.amountPaid = total;
      appt.paymentMethod = method;
      appt.paymentStatus = 'Pago';
      this.saveData();
      this.render();
      this.closePaymentModal();
      this.showToast(`Pagamento quitado em ${formatCurrency(total)}.`, 'success');
      return;
    }

    if (balance <= 0) {
      this.showToast('Esta consulta já está quitada.', 'info');
      return;
    }

    if (amountNow <= 0) { this.showToast('Informe um valor maior que zero.', 'warning'); return; }
    if (amountNow > balance) {
      this.showToast(`O valor informado excede o saldo pendente (${formatCurrency(balance)}).`, 'warning');
      return;
    }

    const newPaid = currentPaid + amountNow;
    appt.amountPaid = newPaid;
    appt.paymentMethod = method;
    appt.paymentStatus = newPaid >= total ? 'Pago' : (newPaid > 0 ? 'Parcial' : 'Pendente');

    this.saveData();
    this.render();
    this.closePaymentModal();
    this.showToast(`Pagamento de ${formatCurrency(amountNow)} registrado.`, 'success');
  }

  openQuickPayModal(appointmentId) {
    this.openPaymentModal(appointmentId);
  }

  editAppointment(appointmentId) {
    this.openAppointmentModal(appointmentId);
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
      color: normalizeHexColor((document.getElementById('appt-color') || {}).value || DEFAULT_APPOINTMENT_COLOR),
      paymentMethod: String((document.getElementById('appt-payment-method') || {}).value || 'Pix'),
      status: String((document.getElementById('appt-status') || {}).value || 'Agendado'),
      paymentStatus: String((document.getElementById('appt-payment-status') || {}).value || 'Pendente'),
      amountPaid: toNumber((document.getElementById('appt-amount-paid') || {}).value || 0),
      notes: String((document.getElementById('appt-notes') || {}).value || '').trim()
    };

    if (window.agendaModule && typeof window.agendaModule.saveAppointment === 'function') {
      window.agendaModule.saveAppointment(this, payload, id || '');
      this.checkAppointmentReminders();
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
    const popup = window.open('', '_blank');
    if (!popup) {
      this.showToast('Permita pop-ups para gerar o PDF do relatório.', 'warning');
      return;
    }

    const logoUrl = new URL('./assets/icons/icon-512.png', window.location.href).href;

    const html = `
      <!doctype html>
      <html lang="pt-BR">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>${safeText(title)}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 24px; white-space: pre-wrap; line-height: 1.5; color: #0f172a; }
            .report-header { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; border-bottom: 2px solid #d1d5db; padding-bottom: 10px; }
            .report-logo { width: 42px; height: 42px; border-radius: 10px; object-fit: cover; border: 1px solid #cbd5e1; }
            .report-title-wrap { display: flex; flex-direction: column; gap: 2px; }
            h1 { font-size: 20px; margin: 0; }
            .report-meta { font-size: 12px; color: #334155; }
            .report-content { font-size: 14px; }
            @media print {
              body { padding: 12px; }
            }
          </style>
        </head>
        <body>
          <div class="report-header">
            <img class="report-logo" src="${logoUrl}" alt="Logo" onerror="this.style.display='none'">
            <div class="report-title-wrap">
              <h1>${safeText(title)}</h1>
              <div class="report-meta">Emitido em: ${new Date().toLocaleString('pt-BR')}</div>
            </div>
          </div>
          <div class="report-content">${safeText(content).replace(/\n/g, '<br>')}</div>
        </body>
      </html>
    `;

    popup.document.open();
    popup.document.write(html);
    popup.document.close();

    if (autoPrint) {
      const triggerPrint = () => {
        try {
          popup.focus();
          popup.print();
        } catch (err) {
          this.showToast('Não foi possível abrir a impressão automaticamente.', 'warning');
        }
      };

      // Some browsers need a small delay after document render.
      popup.addEventListener('load', () => setTimeout(triggerPrint, 120), { once: true });
      setTimeout(triggerPrint, 300);
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

  getClientByReportSearch(searchTerm) {
    const search = String(searchTerm || '').trim().toLowerCase();
    if (!search) return null;

    return this.clients.find((c) =>
      String(c.id || '').toLowerCase() === search ||
      String(c.name || '').toLowerCase().includes(search) ||
      String(c.phone || '').toLowerCase().includes(search) ||
      String(c.registrationNumber || '').toLowerCase().includes(search)
    ) || null;
  }

  getPatientAppointments(patientId) {
    return this.appointments
      .filter((a) => a.clientId === patientId)
      .sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));
  }

  buildPacienteIndividualReportLines(patient) {
    const patientAppointments = this.getPatientAppointments(patient.id);
    const fullAddress = [
      patient.street,
      patient.number ? `Nº ${patient.number}` : '',
      patient.complement,
      patient.neighborhood,
      patient.city,
      patient.state,
      patient.cep
    ].filter((part) => String(part || '').trim()).join(' - ');

    return [
      `RELATÓRIO INDIVIDUAL - ${patient.name || '-'}`,
      '',
      'FICHA DE CADASTRO',
      '',
      `Cadastro: ${patient.registrationNumber || '-'}`,
      `Nome: ${patient.name || '-'}`,
      `Telefone: ${patient.phone || '-'}`,
      `E-mail: ${patient.email || '-'}`,
      `CPF: ${patient.cpf || '-'}`,
      `RG: ${patient.rg || '-'}`,
      `Nascimento: ${patient.dob ? formatDateBR(patient.dob) : '-'}`,
      `Grupo: ${patient.group || '-'}`,
      `Endereço: ${fullAddress || '-'}`,
      `Contato de emergência: ${patient.emergencyName || '-'} | ${patient.emergencyPhone || '-'} | ${patient.emergencyRelation || '-'}`,
      `Observações: ${patient.notes || '-'}`,
      '',
      'ATENDIMENTOS',
      '',
      `Total de consultas: ${patientAppointments.length}`,
      '',
      'Histórico:',
      ...patientAppointments.map((a) => `- ${formatDateBR(a.date)} ${a.time || ''} | ${a.procedure || '-'} | Status: ${a.status || '-'}`)
    ];
  }

  printClientIndividualReport(clientId = '') {
    let patient = null;

    if (clientId) {
      patient = this.clients.find((c) => c.id === clientId) || null;
    }

    if (!patient && this.selectedClientReportIds.size === 1) {
      const [selectedId] = Array.from(this.selectedClientReportIds);
      patient = this.clients.find((c) => c.id === selectedId) || null;
    }

    if (!patient) {
      const typed = window.prompt('Digite nome, telefone, ID ou número de cadastro do paciente para imprimir o relatório individual:');
      if (!typed) return;
      patient = this.getClientByReportSearch(typed);
    }

    if (!patient) {
      this.showToast('Paciente não encontrado para relatório individual.', 'warning');
      return;
    }

    const lines = this.buildPacienteIndividualReportLines(patient);
    this.openReportWindow(`Relatório - ${patient.name || 'Paciente'}`, lines.join('\n'), true);
  }

  toggleClientReportSelection(clientId, checked) {
    if (!clientId) return;

    if (checked) this.selectedClientReportIds.add(clientId);
    else this.selectedClientReportIds.delete(clientId);

    this.updateClientPrintSelectionUI();
  }

  toggleAllVisibleClientReports(checked) {
    const checkboxes = Array.from(document.querySelectorAll('#clientes-table-body .client-print-check'));
    checkboxes.forEach((checkbox) => {
      const clientId = String(checkbox.getAttribute('data-print-client-id') || '').trim();
      if (!clientId) return;

      checkbox.checked = Boolean(checked);
      if (checked) this.selectedClientReportIds.add(clientId);
      else this.selectedClientReportIds.delete(clientId);
    });

    this.updateClientPrintSelectionUI();
  }

  updateClientPrintSelectionUI() {
    const selectedCount = Array.from(this.selectedClientReportIds)
      .filter((id) => this.clients.some((c) => c.id === id)).length;

    const btnPrintSelected = document.getElementById('btn-print-selected-clients');
    if (btnPrintSelected) {
      btnPrintSelected.disabled = selectedCount === 0;
      btnPrintSelected.innerHTML = `<i data-lucide="printer"></i> Imprimir Selecionados (${selectedCount})`;
    }

    const selectAll = document.getElementById('clientes-select-all-print');
    if (selectAll) {
      const checkboxes = Array.from(document.querySelectorAll('#clientes-table-body .client-print-check'));
      const totalVisible = checkboxes.length;
      const visibleChecked = checkboxes.filter((checkbox) => checkbox.checked).length;

      selectAll.checked = totalVisible > 0 && visibleChecked === totalVisible;
      selectAll.indeterminate = visibleChecked > 0 && visibleChecked < totalVisible;
    }

    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  }

  printSelectedClientsReports() {
    const selectedClients = this.clients
      .filter((client) => this.selectedClientReportIds.has(client.id))
      .sort((a, b) => Number(a.registrationNumber || 0) - Number(b.registrationNumber || 0));

    if (!selectedClients.length) {
      this.showToast('Marque ao menos um paciente para imprimir.', 'warning');
      return;
    }

    const reportLines = [];
    selectedClients.forEach((patient, index) => {
      if (index > 0) {
        reportLines.push('');
        reportLines.push('------------------------------------------------------------');
        reportLines.push('');
      }
      reportLines.push(...this.buildPacienteIndividualReportLines(patient));
    });

    this.openReportWindow('Relatório de Pacientes Selecionados', reportLines.join('\n'), true);
  }

  generatePacienteIndividualReport(autoPrint = false) {
    const search = String((document.getElementById('report-patient-search') || {}).value || '').trim().toLowerCase();
    if (!search) {
      this.showToast('Digite o nome, telefone ou ID do paciente para gerar o relatório individual.', 'warning');
      return;
    }

    const patient = this.getClientByReportSearch(search);

    if (!patient) {
      this.showToast('Paciente não encontrado para relatório individual.', 'warning');
      return;
    }

    const lines = this.buildPacienteIndividualReportLines(patient);

    this.openReportWindow(`Relatório - ${patient.name || 'Paciente'}`, lines.join('\n'), autoPrint);
  }

  getAnalyticsDateLabels(maxPoints = 12) {
    const { start: rawStart, end: rawEnd } = this.getTopRange();
    const today = getTodayStr();
    let start = rawStart;
    let end = rawEnd;

    if (!start && !end) {
      end = today;
      start = addDaysIso(today, -6);
    } else if (start && !end) {
      end = start;
    } else if (!start && end) {
      start = end;
    }

    if (start > end) {
      const swap = start;
      start = end;
      end = swap;
    }

    // Quando o filtro estiver em apenas 1 dia, expandimos para o mês completo
    // para exibir a leitura mensal esperada nos gráficos.
    if (start && end && start === end) {
      const [year, month] = start.split('-').map((value) => Number(value));
      if (Number.isFinite(year) && Number.isFinite(month)) {
        const first = new Date(year, month - 1, 1);
        const last = new Date(year, month, 0);
        const fY = first.getFullYear();
        const fM = String(first.getMonth() + 1).padStart(2, '0');
        const fD = String(first.getDate()).padStart(2, '0');
        const lY = last.getFullYear();
        const lM = String(last.getMonth() + 1).padStart(2, '0');
        const lD = String(last.getDate()).padStart(2, '0');
        start = `${fY}-${fM}-${fD}`;
        end = `${lY}-${lM}-${lD}`;
      }
    }

    const labels = [];
    let cursor = start;
    let guard = 0;
    while (cursor <= end && guard < 120) {
      labels.push(cursor);
      cursor = addDaysIso(cursor, 1);
      guard += 1;
    }

    if (!labels.length) labels.push(today);
    return labels.length > maxPoints ? labels.slice(labels.length - maxPoints) : labels;
  }

  build3DBarChartMarkup(labels, series, options = {}) {
    const safeLabels = Array.isArray(labels) ? labels : [];
    const safeSeries = Array.isArray(series) ? series : [];
    const grouped = safeSeries.length > 1;
    const maxValue = Math.max(1, ...safeSeries.flatMap((item) => item.values || []).map((value) => Number(value || 0)));

    const width = 760;
    const height = 290;
    const padLeft = 24;
    const padRight = 16;
    const padTop = 20;
    const padBottom = 62;
    const plotWidth = width - padLeft - padRight;
    const plotHeight = height - padTop - padBottom;
    const labelCount = Math.max(1, safeLabels.length);
    const seriesCount = Math.max(1, safeSeries.length);
    const groupWidth = plotWidth / labelCount;
    const clusterWidth = Math.min(groupWidth * 0.82, grouped ? 58 : 34);
    const barGap = grouped ? Math.max(3, clusterWidth * 0.08) : 0;
    const barWidth = grouped
      ? Math.max(8, (clusterWidth - barGap * (seriesCount - 1)) / seriesCount)
      : Math.max(10, Math.min(34, clusterWidth));
    const depthX = options.depthX || 9;
    const depthY = options.depthY || 7;

    const gridLines = Array.from({ length: 5 }, (_, index) => {
      const ratio = index / 4;
      const y = padTop + plotHeight - (plotHeight * ratio);
      return `<line class="chart-grid-line" x1="${padLeft}" y1="${y.toFixed(2)}" x2="${(padLeft + plotWidth).toFixed(2)}" y2="${y.toFixed(2)}"></line>`;
    }).join('');

    const bars = safeLabels.map((_, labelIndex) => {
      const currentGroupWidth = seriesCount * barWidth + (seriesCount - 1) * barGap;
      const baseX = padLeft + labelIndex * groupWidth + (groupWidth - currentGroupWidth) / 2;

      return safeSeries.map((item, seriesIndex) => {
        const rawValue = Number((item.values || [])[labelIndex] || 0);
        const ratio = rawValue <= 0 ? 0 : rawValue / maxValue;
        const barHeight = Math.max(0, ratio * (plotHeight - 8));
        const x = baseX + seriesIndex * (barWidth + barGap);
        const y = padTop + plotHeight - barHeight;

        const frontColor = item.front || '#60a5fa';
        const topColor = item.top || '#93c5fd';
        const sideColor = item.side || '#3b82f6';

        const valueLabel = rawValue > 0
          ? `<text class="chart-value-label" x="${(x + (barWidth / 2) + depthX * 0.4).toFixed(2)}" y="${(y - depthY - 4).toFixed(2)}">${safeText(String(rawValue.toFixed(rawValue % 1 === 0 ? 0 : 2)).replace('.', ','))}</text>`
          : '';

        const glossHeight = Math.max(8, barHeight * 0.28);
        const shineWidth = Math.max(2.4, barWidth * 0.18);
        const shineX = x + barWidth * 0.2;

        return `
          <g class="chart-bar-group">
            <rect class="chart-bar-face-front" x="${x.toFixed(2)}" y="${y.toFixed(2)}" width="${barWidth.toFixed(2)}" height="${barHeight.toFixed(2)}" rx="7" ry="7" style="fill:${frontColor};"></rect>
            <rect class="chart-bar-gloss" x="${(x + 1.2).toFixed(2)}" y="${(y + 1.2).toFixed(2)}" width="${Math.max(0, barWidth - 2.4).toFixed(2)}" height="${glossHeight.toFixed(2)}" rx="6" ry="6" style="fill:${topColor};opacity:0.34;"></rect>
            <rect class="chart-bar-shine" x="${shineX.toFixed(2)}" y="${(y + 2).toFixed(2)}" width="${shineWidth.toFixed(2)}" height="${Math.max(0, barHeight - 4).toFixed(2)}" rx="3" ry="3"></rect>
            ${valueLabel}
          </g>
        `;
      }).join('');
    }).join('');

    const svg = `
      <svg class="analytics-chart-svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="Gráfico analítico 3D">
        ${gridLines}
        ${bars}
      </svg>
    `;

    const legend = `
      <div class="analytics-legend">
        ${safeSeries.map((item) => `<span><i style="background:${item.front};"></i>${safeText(item.name || '-')}</span>`).join('')}
      </div>
    `;

    const axis = `
      <div class="chart-axis-labels ${grouped ? 'chart-axis-labels-grouped' : ''}" style="--chart-columns:${labelCount};">
        ${safeLabels.map((dateLabel) => `<span>${safeText(formatDateBR(dateLabel).slice(0, 5))}</span>`).join('')}
      </div>
    `;

    return `
      <div class="analytics-chart-stage">
        <div class="analytics-chart-panel">
          ${svg}
        </div>
      </div>
      ${legend}
      ${axis}
    `;
  }

  renderAttendanceChart() {
    const container = document.getElementById('analytics-attendance-chart');
    if (!container) return;

    const labels = this.getAnalyticsDateLabels(31);
    const labelSet = new Set(labels);

    const scheduledByDate = {};
    const attendedByDate = {};
    this.appointments.forEach((appt) => {
      const date = String(appt.date || '');
      if (!labelSet.has(date)) return;

      const clientKey = String(appt.clientId || appt.clientName || '').trim() || String(appt.id || '').trim();
      if (!scheduledByDate[date]) scheduledByDate[date] = new Set();
      if (clientKey) scheduledByDate[date].add(clientKey);

      const status = String(appt.status || '').toLowerCase();
      if (!(status.includes('conclu') || status.includes('realiz'))) return;
      attendedByDate[date] = (attendedByDate[date] || 0) + 1;
    });

    const scheduledValues = labels.map((date) => Number((scheduledByDate[date] && scheduledByDate[date].size) || 0));
    const attendedValues = labels.map((date) => Number(attendedByDate[date] || 0));
    const hasData = scheduledValues.some((value) => value > 0) || attendedValues.some((value) => value > 0);

    if (!hasData) {
      container.innerHTML = '<div class="empty-state analytics-empty-state"><p>Sem clientes agendados no período selecionado.</p></div>';
      return;
    }

    container.innerHTML = this.build3DBarChartMarkup(labels, [
      {
        name: 'Agendados',
        values: scheduledValues,
        front: '#22d3ee',
        top: '#67e8f9',
        side: '#0e7490'
      },
      {
        name: 'Atendidos',
        values: attendedValues,
        front: '#84cc16',
        top: '#bef264',
        side: '#4d7c0f'
      }
    ], { depthX: 10, depthY: 8 });
  }

  renderFinanceComparisonChart() {
    const container = document.getElementById('analytics-finance-chart');
    if (!container) return;

    const labels = this.getAnalyticsDateLabels(31);
    const labelSet = new Set(labels);
    const revenueByDate = {};
    const expenseByDate = {};

    this.appointments.forEach((appt) => {
      const date = String(appt.date || '');
      if (!labelSet.has(date)) return;
      revenueByDate[date] = (revenueByDate[date] || 0) + toNumber(appt.amountPaid);
    });

    this.expenses.forEach((expense) => {
      const date = String(expense.date || '');
      if (!labelSet.has(date)) return;
      expenseByDate[date] = (expenseByDate[date] || 0) + toNumber(expense.amount);
    });

    const revenueValues = labels.map((date) => Number((revenueByDate[date] || 0).toFixed(2)));
    const expenseValues = labels.map((date) => Number((expenseByDate[date] || 0).toFixed(2)));
    const hasData = revenueValues.some((value) => value > 0) || expenseValues.some((value) => value > 0);

    if (!hasData) {
      container.innerHTML = '<div class="empty-state analytics-empty-state"><p>Sem receita ou despesas no período selecionado.</p></div>';
      return;
    }

    container.innerHTML = this.build3DBarChartMarkup(labels, [
      {
        name: 'Receita',
        values: revenueValues,
        front: '#38bdf8',
        top: '#93c5fd',
        side: '#1d4ed8'
      },
      {
        name: 'Despesas',
        values: expenseValues,
        front: '#f97316',
        top: '#fdba74',
        side: '#c2410c'
      }
    ], { depthX: 10, depthY: 8 });
  }

  toggleChartFocus(cardKey) {
    const grid = document.querySelector('#tab-graficos .analytics-grid');
    if (!grid) return;

    const normalized = String(cardKey || '').trim();
    const cards = Array.from(grid.querySelectorAll('.analytics-card[data-chart-card]'));
    if (!normalized || !cards.length) return;

    const isAlreadyFocused = grid.classList.contains('is-focus-active')
      && Boolean(grid.querySelector(`.analytics-card.is-focused[data-chart-card="${normalized}"]`));

    cards.forEach((card) => {
      const key = String(card.getAttribute('data-chart-card') || '').trim();
      const isTarget = key === normalized;
      card.classList.toggle('is-focused', !isAlreadyFocused && isTarget);
      card.classList.toggle('is-collapsed', !isAlreadyFocused && !isTarget);

      const toggleBtn = card.querySelector('[data-chart-toggle]');
      if (toggleBtn) {
        toggleBtn.textContent = !isAlreadyFocused && isTarget ? 'Voltar' : 'Ampliar';
      }
    });

    grid.classList.toggle('is-focus-active', !isAlreadyFocused);
  }

  bindAnalyticsInteractions() {
    const tab = document.getElementById('tab-graficos');
    if (!tab || tab.dataset.analyticsBound === '1') return;

    tab.dataset.analyticsBound = '1';

    tab.addEventListener('click', (event) => {
      const toggleBtn = event.target.closest('[data-chart-toggle]');
      if (toggleBtn) {
        event.preventDefault();
        event.stopPropagation();
        const key = toggleBtn.getAttribute('data-chart-toggle') || '';
        this.toggleChartFocus(key);
        return;
      }

      const card = event.target.closest('.analytics-card[data-chart-card]');
      if (!card) return;

      const key = card.getAttribute('data-chart-card') || '';
      this.toggleChartFocus(key);
    });

    tab.addEventListener('keydown', (event) => {
      const card = event.target.closest('.analytics-card[data-chart-card]');
      if (!card) return;
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      const key = card.getAttribute('data-chart-card') || '';
      this.toggleChartFocus(key);
    });
  }

  renderGraficosTab() {
    this.bindAnalyticsInteractions();
    this.renderAttendanceChart();
    this.renderFinanceComparisonChart();
  }

  render() {
    this.renderDashboard();
    this.renderAgendaTable();
    this.renderClientsTable();
    this.renderFinanceiroTable();
    this.renderDespesasTable();
    this.renderWhatsAppTab();
    this.renderGraficosTab();
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
        window.loadPartial('src/components/partials/main-shell.html?v=20260730-6', 'app-root')
      ]);
    }
  } catch (err) {
    console.log('Falha ao carregar partials:', err);
  }

  window.app.initDOM();
  window.app.updateFirebaseAuthStatus('offline', 'Auth Firebase: Desconectado');
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
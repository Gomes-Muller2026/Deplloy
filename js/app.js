// oi
/**
 * Consultório Control - Bootstrap estável + módulos essenciais
 * Restaura login, navegação, clientes, agenda e financeiro básicos.
 */

const LOGIN_DEFAULT_USERNAME = 'Patricia';
const LOGIN_DEFAULT_PASSWORD = 'Flora1658';
const LOGIN_USER_STORAGE_KEY = 'consultorio_login_user';
const LOGIN_PASSWORD_STORAGE_KEY = 'consultorio_login_password';
const LOGIN_USERS_STORAGE_KEY = 'consultorio_login_users';
const LOGIN_ACTIVE_USER_STORAGE_KEY = 'consultorio_login_active_user';
const SOUND_ENABLED_STORAGE_KEY = 'consultorio_sound_enabled';
const REMINDER_MINS_STORAGE_KEY = 'consultorio_reminder_mins';
const REMINDER_INTENSITY_STORAGE_KEY = 'consultorio_reminder_intensity';
const FIREBASE_CONFIG_STORAGE_KEY = 'consultorio_firebase_config';
const FIREBASE_SYNC_DIRTY_STORAGE_KEY = 'consultorio_firebase_sync_dirty';
const APP_VERSION_STORAGE_KEY = 'consultorio_app_version_info';
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
  apiKey: 'AIzaSyAp-6HFGCVfMr_W8Anw82V70qiUh9sh8WQ',
  authDomain: 'consultorio-patricia.firebaseapp.com',
  projectId: 'consultorio-patricia',
  storageBucket: 'consultorio-patricia.firebasestorage.app',
  messagingSenderId: '210238418315',
  appId: '1:210238418315:web:54fb4fdc33036cecd4538e',
  measurementId: 'G-FQN28L95LC'
};

const normalizeFirebaseConfig = (rawConfig) => {
  if (!rawConfig || typeof rawConfig !== 'object') return null;

  const normalized = { ...rawConfig };
  const projectId = String(normalized.projectId || '').trim();
  const authDomain = String(normalized.authDomain || '').trim();
  const storageBucket = String(normalized.storageBucket || '').trim();
  const apiKey = String(normalized.apiKey || '').trim();

  const shouldUseCanonicalConfig = [
    'consultorio-a07c8',
    'consultorio-patricia'
  ].includes(projectId) || [
    'consultorio-a07c8.firebaseapp.com',
    'consultorio-patricia.firebaseapp.com'
  ].includes(authDomain) || [
    'consultorio-a07c8.firebasestorage.app',
    'consultorio-patricia.firebasestorage.app'
  ].includes(storageBucket) || [
    'AIzaSyCKFg8ypyYLRbD8PoeP9NqO2KHBrmN70uk',
    'AIzaSyAp-6HFGCVfMr_W8Anw82V70qiUh9sh8WQ'
  ].includes(apiKey);

  if (shouldUseCanonicalConfig) {
    return {
      ...normalized,
      ...DEFAULT_FIREBASE_CONFIG
    };
  }

  return normalized;
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

const normalizeLoginUsers = (rawUsers) => {
  if (!Array.isArray(rawUsers)) return [];

  const seen = new Set();
  const users = [];

  rawUsers.forEach((entry) => {
    const username = String((entry && entry.username) || '').trim();
    const password = String((entry && entry.password) || '');
    if (!username || !password) return;

    const key = username.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);

    users.push({
      username,
      password,
      createdAt: String((entry && entry.createdAt) || getTodayStr()),
      updatedAt: String((entry && entry.updatedAt) || getTodayStr())
    });
  });

  return users;
};

const saveLoginUsers = (users) => {
  const normalized = normalizeLoginUsers(users);
  localStorage.setItem(LOGIN_USERS_STORAGE_KEY, JSON.stringify(normalized));
  return normalized;
};

const ensureLoginCredentials = () => {
  try {
    const legacyUsername = String(localStorage.getItem(LOGIN_USER_STORAGE_KEY) || LOGIN_DEFAULT_USERNAME).trim() || LOGIN_DEFAULT_USERNAME;
    const legacyPassword = String(localStorage.getItem(LOGIN_PASSWORD_STORAGE_KEY) || LOGIN_DEFAULT_PASSWORD) || LOGIN_DEFAULT_PASSWORD;

    let users = [];
    try {
      users = normalizeLoginUsers(JSON.parse(localStorage.getItem(LOGIN_USERS_STORAGE_KEY) || '[]'));
    } catch (err) {
      users = [];
    }

    if (!users.length) {
      users = [{
        username: legacyUsername,
        password: legacyPassword,
        createdAt: getTodayStr(),
        updatedAt: getTodayStr()
      }];
    }

    users = saveLoginUsers(users);

    const activeStored = String(localStorage.getItem(LOGIN_ACTIVE_USER_STORAGE_KEY) || '').trim();
    const activeMatch = users.find((item) => item.username.toLowerCase() === activeStored.toLowerCase());
    const activeUser = activeMatch || users[0];

    localStorage.setItem(LOGIN_ACTIVE_USER_STORAGE_KEY, activeUser.username);
    localStorage.setItem(LOGIN_USER_STORAGE_KEY, activeUser.username);
    localStorage.setItem(LOGIN_PASSWORD_STORAGE_KEY, activeUser.password);
  } catch (err) {
    console.log('Falha ao inicializar credenciais locais:', err);
  }
};

const getLoginUsers = () => {
  ensureLoginCredentials();
  try {
    return normalizeLoginUsers(JSON.parse(localStorage.getItem(LOGIN_USERS_STORAGE_KEY) || '[]'));
  } catch (err) {
    return [{ username: LOGIN_DEFAULT_USERNAME, password: LOGIN_DEFAULT_PASSWORD, createdAt: getTodayStr(), updatedAt: getTodayStr() }];
  }
};

const getLoginCredentials = (preferredUsername = '') => {
  const users = getLoginUsers();
  const wanted = String(preferredUsername || '').trim().toLowerCase();

  let selected = null;
  if (wanted) {
    selected = users.find((item) => item.username.toLowerCase() === wanted) || null;
  }

  if (!selected) {
    try {
      const activeStored = String(localStorage.getItem(LOGIN_ACTIVE_USER_STORAGE_KEY) || '').trim().toLowerCase();
      selected = users.find((item) => item.username.toLowerCase() === activeStored) || null;
    } catch (err) {
      selected = null;
    }
  }

  selected = selected || users[0] || { username: LOGIN_DEFAULT_USERNAME, password: LOGIN_DEFAULT_PASSWORD };
  return { username: selected.username, password: selected.password };
};

const setActiveLoginUser = (username) => {
  const wanted = String(username || '').trim();
  if (!wanted) return false;

  const users = getLoginUsers();
  const selected = users.find((item) => item.username.toLowerCase() === wanted.toLowerCase());
  if (!selected) return false;

  try {
    localStorage.setItem(LOGIN_ACTIVE_USER_STORAGE_KEY, selected.username);
    localStorage.setItem(LOGIN_USER_STORAGE_KEY, selected.username);
    localStorage.setItem(LOGIN_PASSWORD_STORAGE_KEY, selected.password);
    return true;
  } catch (err) {
    return false;
  }
};

const setLoginCredentials = (username, password, options = {}) => {
  const safeUser = String(username || '').trim();
  const safePass = String(password || '');
  if (!safeUser || !safePass) return false;

  const allowCreate = options.allowCreate !== false;

  const users = getLoginUsers();
  const index = users.findIndex((item) => item.username.toLowerCase() === safeUser.toLowerCase());

  if (index < 0 && !allowCreate) return false;

  const today = getTodayStr();
  if (index >= 0) {
    users[index] = {
      ...users[index],
      username: safeUser,
      password: safePass,
      updatedAt: today
    };
  } else {
    users.push({
      username: safeUser,
      password: safePass,
      createdAt: today,
      updatedAt: today
    });
  }

  try {
    saveLoginUsers(users);
    return setActiveLoginUser(safeUser);
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
    this.reminderIntensity = 'strong';
    this.agendaViewMode = 'calendar';
    this.agendaCalendarStartDate = getWeekStartMondayIso(getTodayStr());
    this.firebaseConfig = null;
    this.firebaseApp = null;
    this.firebaseDb = null;
    this.firebaseConnected = false;
    this.firebaseAuthUid = '';
    this.firebaseLastErrorCode = '';
    this.firebaseLastErrorMessage = '';
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
    this.firebaseSyncIntervalId = null;
    this.firebaseSyncIntervalMs = 5 * 60 * 1000;
    this.versionInfo = { dateKey: getTodayStr(), seq: 0, label: 'v00.00/000000' };
    this.updateReady = false;
    this.loadStore();
    this.loadWhatsAppTemplates();
    this.loadVersionInfo();
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

  buildVersionLabel(dateKey, seq) {
    const safeDate = /^\d{4}-\d{2}-\d{2}$/.test(String(dateKey || '')) ? String(dateKey) : getTodayStr();
    const [year, month, day] = safeDate.split('-');
    const serial = `${day}${month}${year}`;
    const safeSeq = Math.max(0, Number(seq) || 0);
    return `v${String(safeSeq).padStart(2, '0')}.${serial}`;
  }

  loadVersionInfo() {
    try {
      const raw = JSON.parse(localStorage.getItem(APP_VERSION_STORAGE_KEY) || '{}');
      const dateKey = /^\d{4}-\d{2}-\d{2}$/.test(String(raw.dateKey || '')) ? String(raw.dateKey) : getTodayStr();
      const seq = Number.isFinite(Number(raw.seq)) ? Math.max(0, Number(raw.seq)) : 0;
      const today = getTodayStr();
      const normalizedSeq = dateKey === today ? seq : 0;

      this.versionInfo = {
        dateKey: today,
        seq: normalizedSeq,
        label: this.buildVersionLabel(today, normalizedSeq)
      };
      this.saveVersionInfo();
    } catch (err) {
      const today = getTodayStr();
      this.versionInfo = { dateKey: today, seq: 0, label: this.buildVersionLabel(today, 0) };
      this.saveVersionInfo();
    }
  }

  saveVersionInfo() {
    try {
      localStorage.setItem(APP_VERSION_STORAGE_KEY, JSON.stringify(this.versionInfo));
    } catch (err) {
      console.log('Falha ao salvar versão local:', err);
    }
  }

  bumpVersion() {
    const today = getTodayStr();
    const baseSeq = this.versionInfo && this.versionInfo.dateKey === today ? Number(this.versionInfo.seq || 0) : 0;
    const nextSeq = baseSeq + 1;
    this.versionInfo = {
      dateKey: today,
      seq: nextSeq,
      label: this.buildVersionLabel(today, nextSeq)
    };
    this.saveVersionInfo();
    this.renderVersionBadge();
  }

  renderVersionBadge() {
    const el = document.getElementById('app-version-badge');
    if (!el) return;
    const label = (this.versionInfo && this.versionInfo.label) ? this.versionInfo.label : this.buildVersionLabel(getTodayStr(), 0);

    if (this.updateReady) {
      el.textContent = `Nova versão disponível - Atualizar`;
      el.classList.add('update-ready');
      el.setAttribute('role', 'button');
      el.setAttribute('tabindex', '0');
      el.setAttribute('title', 'Clique para atualizar para a versão mais recente');
    } else {
      el.textContent = `Versão: ${label}`;
      el.classList.remove('update-ready');
      el.removeAttribute('role');
      el.removeAttribute('tabindex');
      el.removeAttribute('title');
    }
  }

  setUpdateReady(isReady) {
    this.updateReady = Boolean(isReady);
    this.renderVersionBadge();
  }

  saveStore() {
    localStorage.setItem('consultorio_clients', JSON.stringify(this.clients));
    localStorage.setItem('consultorio_appointments', JSON.stringify(this.appointments));
    localStorage.setItem('consultorio_expenses', JSON.stringify(this.expenses));
    localStorage.setItem(CLIENT_GROUPS_STORAGE_KEY, JSON.stringify(this.clientGroups));
  }

  saveData() {
    this.saveStore();
    this.bumpVersion();
    this.updateCloudSyncMeta();
    this.setFirebaseSyncDirty(true);

    if (this.firebaseConnected && this.firebaseDb) {
      // Sync in background; UI should not block local save flow.
      void this.pushAllDataToFirebase()
        .then(() => {
          this.setFirebaseSyncDirty(false);
        })
        .catch((err) => {
          console.log('Falha ao enviar dados para o Firebase:', err);
        });
    }
  }

  isFirebaseSyncDirty() {
    try {
      return localStorage.getItem(FIREBASE_SYNC_DIRTY_STORAGE_KEY) === '1';
    } catch (err) {
      return false;
    }
  }

  setFirebaseSyncDirty(isDirty) {
    try {
      localStorage.setItem(FIREBASE_SYNC_DIRTY_STORAGE_KEY, isDirty ? '1' : '0');
    } catch (err) {
      console.log('Falha ao atualizar estado de sincronização local:', err);
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
      this.bumpVersion();
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

  formatTopDateDisplay(value) {
    return this.formatDobDisplay(value);
  }

  normalizeTopDateToIso(value) {
    return this.normalizeDobToIso(value);
  }

  formatTopDateForInput(value) {
    const iso = this.normalizeTopDateToIso(value);
    if (!iso) return this.formatTopDateDisplay(value);
    return this.formatDobForInput(iso);
  }

  formatAgendaDateDisplay(value) {
    return this.formatDobDisplay(value);
  }

  normalizeAgendaDateToIso(value) {
    return this.normalizeDobToIso(value);
  }

  formatAgendaDateForInput(value) {
    const iso = this.normalizeAgendaDateToIso(value);
    if (!iso) return this.formatAgendaDateDisplay(value);
    return this.formatDobForInput(iso);
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
      requireInteraction: options.requireInteraction === true,
      silent: false,
      vibrate: Array.isArray(options.vibrate) ? options.vibrate : [260, 120, 260, 120, 420],
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

    const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent || '');
    const level = ['normal', 'strong', 'ultra'].includes(this.reminderIntensity) ? this.reminderIntensity : 'strong';
    const vibratePattern = level === 'ultra'
      ? [320, 110, 320, 110, 320, 110, 520]
      : (level === 'strong' ? [260, 120, 260, 120, 420] : [160, 90, 160]);

    if (this.soundEnabled) {
      this.playReminderSound(level);
    }

    if (isMobile && navigator.vibrate) {
      navigator.vibrate(vibratePattern);
    }

    if (isMobile && !isManualTest) {
      window.setTimeout(() => this.showToast(body, 'warning'), 1200);
    }

    const sent = await this.sendSystemNotification(title, body, {
      appointmentId: appointment && appointment.id ? appointment.id : '',
      tag: appointment && appointment.id ? `appt-reminder-${appointment.id}` : `appt-reminder-${Date.now()}`,
      requireInteraction: !isManualTest,
      vibrate: vibratePattern
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
    this.renderRegisteredUsersCards();
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

    if (!setLoginCredentials(creds.username, newPassword, { allowCreate: false })) {
      this.showToast('Não foi possível salvar a nova senha.', 'warning');
      return;
    }

    const form = document.getElementById('form-change-password');
    if (form) form.reset();

    const currentUser = document.getElementById('senha-current-user');
    if (currentUser) currentUser.value = creds.username || '';

    const loginUserInput = document.getElementById('login-username');
    if (loginUserInput) loginUserInput.value = creds.username || '';

    this.bumpVersion();
    this.renderRegisteredUsersCards();
    this.render();
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

    const exists = getLoginUsers().some((user) => user.username.toLowerCase() === newUsername.toLowerCase());
    if (exists) {
      this.showToast('Este usuário já existe. Edite o card abaixo para atualizar.', 'warning');
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

    this.bumpVersion();
    this.renderRegisteredUsersCards();
    this.render();
    this.showToast('Novo usuário cadastrado com sucesso.', 'success');
  }

  renderRegisteredUsersCards() {
    const container = document.getElementById('senha-users-cards-list');
    if (!container) return;

    const users = getLoginUsers();
    const active = getLoginCredentials().username;

    if (!users.length) {
      container.innerHTML = '<div class="empty-state"><p>Nenhum usuário cadastrado.</p></div>';
      return;
    }

    container.innerHTML = users.map((user, index) => {
      const isActive = String(user.username || '').toLowerCase() === String(active || '').toLowerCase();
      return `
        <div class="user-manage-card ${isActive ? 'is-active' : ''}" data-user-index="${index}">
          <div class="user-manage-head">
            <strong>${safeText(user.username || '-')}</strong>
            ${isActive ? '<span class="user-active-pill">Ativo</span>' : ''}
          </div>
          <div class="user-manage-grid">
            <div class="form-group">
              <label>Usuário</label>
              <input type="text" class="form-control" data-user-field="username" value="${safeText(user.username || '')}">
            </div>
            <div class="form-group">
              <label>Senha</label>
              <input type="password" class="form-control" data-user-field="password" value="${safeText(user.password || '')}">
            </div>
          </div>
          <label class="login-show-password user-manage-toggle"><input type="checkbox" data-user-action="toggle-pass" data-user-index="${index}" onchange="app.toggleRegisteredUserPassword(this)"> Mostrar senha</label>
          <div class="user-manage-actions">
            <button type="button" class="btn btn-secondary btn-sm" data-user-action="activate" data-user-index="${index}"><i data-lucide="user-round-check"></i> Usar neste login</button>
            <button type="button" class="btn btn-primary btn-sm" data-user-action="save" data-user-index="${index}"><i data-lucide="save"></i> Salvar</button>
            <button type="button" class="btn btn-ghost btn-sm" style="color:var(--danger);" data-user-action="delete" data-user-index="${index}"><i data-lucide="trash-2"></i> Excluir</button>
          </div>
        </div>
      `;
    }).join('');

    container.querySelectorAll('[data-user-action="toggle-pass"]').forEach((checkbox) => {
      checkbox.addEventListener('change', () => this.toggleRegisteredUserPassword(checkbox));
    });

    container.querySelectorAll('[data-user-action="activate"]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const index = Number(btn.getAttribute('data-user-index'));
        const usersList = getLoginUsers();
        const selected = usersList[index];
        if (!selected) return;

        if (!setActiveLoginUser(selected.username)) {
          this.showToast('Não foi possível ativar este usuário.', 'warning');
          return;
        }

        this.bumpVersion();
        this.prefillSenhaTabFields();
        const loginUserInput = document.getElementById('login-username');
        if (loginUserInput) loginUserInput.value = selected.username;
        this.render();
        this.showToast(`Usuário ativo: ${selected.username}`, 'success');
      });
    });

    container.querySelectorAll('[data-user-action="save"]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const index = Number(btn.getAttribute('data-user-index'));
        const usersList = getLoginUsers();
        const target = usersList[index];
        if (!target) return;

        const card = btn.closest('[data-user-index]');
        if (!card) return;

        const nextUsername = String(((card.querySelector('[data-user-field="username"]') || {}).value) || '').trim();
        const nextPassword = String(((card.querySelector('[data-user-field="password"]') || {}).value) || '');

        if (!nextUsername || !nextPassword) {
          this.showToast('Usuário e senha são obrigatórios.', 'warning');
          return;
        }

        if (nextPassword.length < 4) {
          this.showToast('A senha deve ter ao menos 4 caracteres.', 'warning');
          return;
        }

        const usernameConflict = usersList.some((user, idx) => idx !== index && String(user.username || '').toLowerCase() === nextUsername.toLowerCase());
        if (usernameConflict) {
          this.showToast('Já existe outro usuário com esse nome.', 'warning');
          return;
        }

        const previousUsername = target.username;
        const today = getTodayStr();
        usersList[index] = {
          ...target,
          username: nextUsername,
          password: nextPassword,
          updatedAt: today
        };

        try {
          saveLoginUsers(usersList);
        } catch (err) {
          this.showToast('Não foi possível salvar o usuário.', 'warning');
          return;
        }

        const activeUser = getLoginCredentials().username;
        if (String(activeUser || '').toLowerCase() === String(previousUsername || '').toLowerCase()) {
          setActiveLoginUser(nextUsername);
        }

        this.bumpVersion();
        this.prefillSenhaTabFields();
        this.render();
        this.showToast('Usuário atualizado com sucesso.', 'success');
      });
    });

    container.querySelectorAll('[data-user-action="delete"]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const index = Number(btn.getAttribute('data-user-index'));
        const usersList = getLoginUsers();
        if (!Number.isInteger(index) || index < 0 || index >= usersList.length) return;

        if (usersList.length <= 1) {
          this.showToast('Não é possível excluir o último usuário do sistema.', 'warning');
          return;
        }

        const removed = usersList[index];
        if (!confirm(`Excluir o usuário ${removed.username}?`)) return;

        usersList.splice(index, 1);
        saveLoginUsers(usersList);

        const activeUser = getLoginCredentials().username;
        if (String(activeUser || '').toLowerCase() === String((removed || {}).username || '').toLowerCase()) {
          setActiveLoginUser((usersList[0] || {}).username || '');
        }

        this.bumpVersion();
        this.prefillSenhaTabFields();
        this.render();
        this.showToast('Usuário excluído com sucesso.', 'success');
      });
    });

    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  }

  toggleRegisteredUserPassword(checkbox) {
    const card = checkbox && checkbox.closest ? checkbox.closest('[data-user-index]') : null;
    if (!card) return;

    const passInput = card.querySelector('[data-user-field="password"]');
    if (passInput) passInput.type = checkbox.checked ? 'text' : 'password';
  }

  initDOM() {
    ensureLoginCredentials();
    this.renderVersionBadge();

    const userInput = document.getElementById('login-username');
    const creds = getLoginCredentials();
    if (userInput && !userInput.value) userInput.value = creds.username;

    const startDateInput = document.getElementById('top-date-start');
    const endDateInput = document.getElementById('top-date-end');
    const today = getTodayStr();
    if (startDateInput && !startDateInput.value) startDateInput.value = this.formatTopDateForInput(today);
    if (endDateInput && !endDateInput.value) endDateInput.value = this.formatTopDateForInput(today);

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
      const rawIntensity = String(localStorage.getItem(REMINDER_INTENSITY_STORAGE_KEY) || '').toLowerCase();
      this.soundEnabled = rawEnabled == null ? true : rawEnabled === '1';
      const parsedMinutes = Number(rawMinutes);
      this.reminderMinutes = Number.isFinite(parsedMinutes) ? Math.max(1, parsedMinutes) : 15;
      this.reminderIntensity = ['normal', 'strong', 'ultra'].includes(rawIntensity) ? rawIntensity : 'strong';
    } catch (err) {
      this.soundEnabled = true;
      this.reminderMinutes = 15;
      this.reminderIntensity = 'strong';
    }
  }

  saveSoundSettings() {
    try {
      localStorage.setItem(SOUND_ENABLED_STORAGE_KEY, this.soundEnabled ? '1' : '0');
      localStorage.setItem(REMINDER_MINS_STORAGE_KEY, String(this.reminderMinutes));
      localStorage.setItem(
        REMINDER_INTENSITY_STORAGE_KEY,
        ['normal', 'strong', 'ultra'].includes(this.reminderIntensity) ? this.reminderIntensity : 'strong'
      );
    } catch (err) {
      console.log('Falha ao salvar configuração de avisos:', err);
    }
  }

  updateSoundControlsUI() {
    const toggleBtn = document.getElementById('btn-toggle-sound');
    const statusText = document.getElementById('sound-status-text');
    const minutesInput = document.getElementById('top-reminder-mins');
    const intensityInput = document.getElementById('top-reminder-intensity');

    if (toggleBtn) toggleBtn.classList.toggle('sound-off', !this.soundEnabled);
    if (statusText) statusText.textContent = this.soundEnabled ? 'Avisos: ON' : 'Avisos: OFF';
    if (minutesInput) minutesInput.value = String(this.reminderMinutes);
    if (intensityInput) intensityInput.value = ['normal', 'strong', 'ultra'].includes(this.reminderIntensity)
      ? this.reminderIntensity
      : 'strong';
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

  playReminderSound(level = 'normal') {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const now = audioCtx.currentTime;

      const pattern = level === 'ultra'
        ? [
          { at: 0, duration: 0.22, from: 1080, to: 780, gain: 0.28, type: 'square' },
          { at: 0.27, duration: 0.22, from: 1080, to: 780, gain: 0.27, type: 'square' },
          { at: 0.54, duration: 0.24, from: 1160, to: 760, gain: 0.3, type: 'sawtooth' },
          { at: 0.84, duration: 0.32, from: 1240, to: 700, gain: 0.34, type: 'sawtooth' }
        ]
        : (level === 'strong'
          ? [
            { at: 0, duration: 0.2, from: 980, to: 760, gain: 0.24, type: 'square' },
            { at: 0.26, duration: 0.2, from: 980, to: 760, gain: 0.22, type: 'square' },
            { at: 0.52, duration: 0.28, from: 1040, to: 690, gain: 0.28, type: 'sawtooth' }
          ]
          : [
            { at: 0, duration: 0.26, from: 880, to: 660, gain: 0.14, type: 'sine' }
          ]);

      pattern.forEach((tone) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        const startAt = now + tone.at;
        const endAt = startAt + tone.duration;

        osc.type = tone.type;
        osc.frequency.setValueAtTime(tone.from, startAt);
        osc.frequency.exponentialRampToValueAtTime(Math.max(80, tone.to), endAt);

        gain.gain.setValueAtTime(0.0001, startAt);
        gain.gain.exponentialRampToValueAtTime(tone.gain, startAt + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, endAt);

        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(startAt);
        osc.stop(endAt + 0.01);
      });

      const totalDuration = pattern.reduce((max, tone) => Math.max(max, tone.at + tone.duration), 0);
      window.setTimeout(() => {
        if (audioCtx && typeof audioCtx.close === 'function') audioCtx.close();
      }, Math.ceil((totalDuration + 0.08) * 1000));
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

  async forceAppUpdate() {
    if (!('serviceWorker' in navigator)) {
      this.showToast('Service Worker não suportado neste navegador.', 'warning');
      return;
    }

    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (!registration) {
        this.showToast('Atualização acionada. Recarregando...', 'info');
        window.location.reload();
        return;
      }

      await registration.update();

      if (registration.waiting) {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      }

      this.showToast('Buscando versão mais recente do app...', 'info');
      window.setTimeout(() => {
        window.location.reload();
      }, 450);
    } catch (err) {
      this.showToast('Não foi possível forçar atualização agora.', 'warning');
    }
  }


  initEvents() {
    const loginForm = document.getElementById('login-form');
    const saveFirebaseBtn = document.getElementById('btn-save-firebase');
    const forceAppUpdateBtn = document.getElementById('btn-force-app-update');
    const versionBadge = document.getElementById('app-version-badge');
    const refreshFirebaseBtns = document.querySelectorAll('[data-action="refresh-firebase"]');
    const validateFirebaseBtn = document.getElementById('btn-validate-firebase');
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
        const creds = getLoginCredentials(enteredUser);

        if (enteredUser.toLowerCase() === String(creds.username || '').toLowerCase() && enteredPass === creds.password) {
          setActiveLoginUser(creds.username);
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

    if (forceAppUpdateBtn) {
      forceAppUpdateBtn.addEventListener('click', () => {
        void this.forceAppUpdate();
      });
    }

    if (versionBadge) {
      const handleVersionBadgeUpdate = () => {
        if (!this.updateReady) return;
        void this.forceAppUpdate();
      };

      versionBadge.addEventListener('click', handleVersionBadgeUpdate);
      versionBadge.addEventListener('keydown', (event) => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        handleVersionBadgeUpdate();
      });
    }

    refreshFirebaseBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        void this.refreshFirebaseDataNow();
      });
    });

    if (disconnectFirebaseBtn) {
      disconnectFirebaseBtn.addEventListener('click', () => {
        this.disconnectFirebase();
      });
    }

    if (validateFirebaseBtn) {
      validateFirebaseBtn.addEventListener('click', () => {
        void this.runFirebaseValidationChecklist();
      });
    }

    if (firebaseConfigInput) {
      firebaseConfigInput.addEventListener('input', () => {
        try {
          const parsed = JSON.parse(firebaseConfigInput.value || '{}');
          this.firebaseConfig = normalizeFirebaseConfig(parsed);
        } catch (err) {
          this.firebaseConfig = null;
        }
      });
    }

    const firebaseAuthStatus = document.getElementById('firebase-auth-status');
    if (firebaseAuthStatus) {
      const openDiag = () => this.showFirebaseAuthDiagnostic();
      firebaseAuthStatus.addEventListener('click', openDiag);
      firebaseAuthStatus.addEventListener('keydown', (event) => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        openDiag();
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
        if (startDateInput) startDateInput.value = this.formatTopDateForInput(today);
        if (endDateInput) endDateInput.value = this.formatTopDateForInput(today);
        this.syncTopDatesToAgendaFilters();
        this.render();
      });
    }

    const topStart = document.getElementById('top-date-start');
    const topEnd = document.getElementById('top-date-end');
    if (topStart) {
      topStart.addEventListener('click', () => topStart.focus());
      topStart.addEventListener('input', () => {
        topStart.value = this.formatTopDateDisplay(topStart.value);
        // Keep manual typing uninterrupted (do not rerender on each keystroke).
        this.syncTopDatesToAgendaFilters();
      });
      topStart.addEventListener('blur', () => {
        topStart.value = this.formatTopDateForInput(topStart.value);
        this.syncTopDatesToAgendaFilters();
        this.render();
      });
      topStart.addEventListener('change', () => {
        topStart.value = this.formatTopDateForInput(topStart.value);
        this.syncTopDatesToAgendaFilters();
        this.render();
      });
    }
    if (topEnd) {
      topEnd.addEventListener('click', () => topEnd.focus());
      topEnd.addEventListener('input', () => {
        topEnd.value = this.formatTopDateDisplay(topEnd.value);
        // Keep manual typing uninterrupted (do not rerender on each keystroke).
        this.syncTopDatesToAgendaFilters();
      });
      topEnd.addEventListener('blur', () => {
        topEnd.value = this.formatTopDateForInput(topEnd.value);
        this.syncTopDatesToAgendaFilters();
        this.render();
      });
      topEnd.addEventListener('change', () => {
        topEnd.value = this.formatTopDateForInput(topEnd.value);
        this.syncTopDatesToAgendaFilters();
        this.render();
      });
    }

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

    const apptDateInput = document.getElementById('appt-date');
    if (apptDateInput) {
      apptDateInput.addEventListener('input', () => {
        apptDateInput.value = this.formatDobDisplay(apptDateInput.value);
      });
      apptDateInput.addEventListener('blur', () => {
        apptDateInput.value = this.formatDobForInput(apptDateInput.value);
      });
    }

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
    if (agendaStart) {
      agendaStart.addEventListener('input', () => {
        agendaStart.value = this.formatAgendaDateDisplay(agendaStart.value);
      });
      agendaStart.addEventListener('blur', () => {
        agendaStart.value = this.formatAgendaDateForInput(agendaStart.value);
        this.renderAgendaTable();
      });
      agendaStart.addEventListener('change', () => {
        agendaStart.value = this.formatAgendaDateForInput(agendaStart.value);
        this.renderAgendaTable();
      });
    }
    if (agendaEnd) {
      agendaEnd.addEventListener('input', () => {
        agendaEnd.value = this.formatAgendaDateDisplay(agendaEnd.value);
      });
      agendaEnd.addEventListener('blur', () => {
        agendaEnd.value = this.formatAgendaDateForInput(agendaEnd.value);
        this.renderAgendaTable();
      });
      agendaEnd.addEventListener('change', () => {
        agendaEnd.value = this.formatAgendaDateForInput(agendaEnd.value);
        this.renderAgendaTable();
      });
    }
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
        if (inp) inp.value = this.formatAgendaDateForInput(this.agendaCalendarStartDate);
        this.renderAgendaTable();
      });
    }

    if (btnAgendaNext) {
      btnAgendaNext.addEventListener('click', () => {
        this.agendaCalendarStartDate = addDaysIso(this.agendaCalendarStartDate, 7);
        const inp = document.getElementById('agenda-filter-start');
        if (inp) inp.value = this.formatAgendaDateForInput(this.agendaCalendarStartDate);
        this.renderAgendaTable();
      });
    }

    if (btnAgendaToday) {
      btnAgendaToday.addEventListener('click', () => {
        this.agendaCalendarStartDate = getWeekStartMondayIso(getTodayStr());
        const inp = document.getElementById('agenda-filter-start');
        if (inp) inp.value = this.formatAgendaDateForInput(this.agendaCalendarStartDate);
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

    const reminderIntensityInput = document.getElementById('top-reminder-intensity');
    if (reminderIntensityInput) {
      reminderIntensityInput.addEventListener('change', () => {
        const level = String(reminderIntensityInput.value || '').toLowerCase();
        this.reminderIntensity = ['normal', 'strong', 'ultra'].includes(level) ? level : 'strong';
        reminderIntensityInput.value = this.reminderIntensity;
        this.saveSoundSettings();
        this.showToast(
          this.reminderIntensity === 'ultra'
            ? 'Intensidade do aviso: Ultra.'
            : (this.reminderIntensity === 'strong'
              ? 'Intensidade do aviso: Forte.'
              : 'Intensidade do aviso: Normal.'),
          'success'
        );
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
      if (!parsed || typeof parsed !== 'object') return null;

      const normalized = normalizeFirebaseConfig(parsed);
      if (normalized && JSON.stringify(parsed) !== JSON.stringify(normalized)) {
        localStorage.setItem(FIREBASE_CONFIG_STORAGE_KEY, JSON.stringify(normalized));
      }

      return normalized;
    } catch (err) {
      return null;
    }
  }

  saveFirebaseConfig(config) {
    try {
      localStorage.setItem(FIREBASE_CONFIG_STORAGE_KEY, JSON.stringify(config));
      this.bumpVersion();
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
    const detail = this.getFirebaseDiagnosticHint();
    el.title = detail || 'Clique para ver diagnóstico de autenticação Firebase';

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

  setFirebaseLastError(err, fallbackMessage = '') {
    const rawCode = String((err && err.code) || '').trim();
    const message = String((err && err.message) || fallbackMessage || '').trim();

    let code = rawCode;
    if (!code && message) {
      const match = message.match(/(auth\/[\w-]+|firestore\/[\w-]+|[a-z-]+(?:\/[\w-]+)?)/i);
      if (match && match[1]) code = match[1];
    }

    this.firebaseLastErrorCode = code;
    this.firebaseLastErrorMessage = message;
  }

  clearFirebaseLastError() {
    this.firebaseLastErrorCode = '';
    this.firebaseLastErrorMessage = '';
  }

  getFirebaseDiagnosticHint() {
    const code = String(this.firebaseLastErrorCode || '').trim();
    if (!code) return String(this.firebaseLastErrorMessage || '').trim();

    if (code === 'auth/configuration-not-found') {
      return 'Configuração Auth não encontrada. Verifique se apiKey/authDomain pertencem ao projeto consultorio-patricia e habilite Authentication no Console.';
    }
    if (code === 'auth/api-key-not-valid') {
      return 'A apiKey usada no app não é válida para o projeto consultorio-patricia. Recarregue a página para limpar cache/config salva e confirme no Firebase Console se essa Web API Key está ativa.';
    }
    if (code === 'auth/operation-not-allowed') {
      return 'Ative Anonymous em Firebase Authentication > Sign-in method.';
    }
    if (code === 'auth/unauthorized-domain') {
      return 'Adicione o domínio atual em Authentication > Settings > Authorized domains.';
    }
    if (code === 'permission-denied' || code === 'firestore/permission-denied') {
      return 'Publique regras do Firestore com request.auth != null e valide a autenticação anônima.';
    }
    if (code === 'unauthenticated') {
      return 'Usuário não autenticado no momento da leitura. Verifique o login anônimo.';
    }
    if (code === 'failed-precondition') {
      return 'Crie/ative o Firestore no projeto e tente novamente.';
    }

    return this.firebaseLastErrorMessage || `Erro Firebase: ${code}`;
  }

  showFirebaseAuthDiagnostic() {
    const stateLine = this.firebaseConnected
      ? `Status atual: conectado${this.firebaseAuthUid ? ` (uid ${this.firebaseAuthUid})` : ''}`
      : 'Status atual: sem conexão com Firebase';

    const code = this.firebaseLastErrorCode ? `Código: ${this.firebaseLastErrorCode}` : 'Código: sem erro registrado';
    const msg = this.firebaseLastErrorMessage ? `Mensagem: ${this.firebaseLastErrorMessage}` : 'Mensagem: sem detalhe adicional';
    const hint = this.getFirebaseDiagnosticHint();
    const action = hint ? `Ação sugerida: ${hint}` : 'Ação sugerida: clique em Conectar e aguarde o retorno.';

    window.alert([
      'Diagnóstico Firebase',
      '',
      stateLine,
      code,
      msg,
      '',
      action
    ].join('\n'));
  }

  renderFirebaseValidationPanel(summaryText, items = []) {
    const panel = document.getElementById('firebase-validation-panel');
    if (!panel) return;

    const summary = `<p class="firebase-validation-summary">${safeText(summaryText || '')}</p>`;
    if (!items.length) {
      panel.innerHTML = summary;
      return;
    }

    const list = `
      <ul class="firebase-validation-list" style="margin-top:0.6rem;">
        ${items.map((item) => `
          <li class="firebase-validation-item ${safeText(item.state || 'pending')}">
            <span class="firebase-validation-bullet" aria-hidden="true"></span>
            <span>${safeText(item.text || '')}</span>
          </li>
        `).join('')}
      </ul>
    `;

    panel.innerHTML = summary + list;
  }

  async runFirebaseValidationChecklist() {
    this.renderFirebaseValidationPanel('Executando validação do Firebase...', [
      { state: 'pending', text: 'Verificando configuração local...' },
      { state: 'pending', text: 'Verificando SDK Firebase...' },
      { state: 'pending', text: 'Validando autenticação anônima...' },
      { state: 'pending', text: 'Validando acesso ao Firestore...' }
    ]);

    const config = normalizeFirebaseConfig(this.firebaseConfig || this.loadFirebaseConfig() || DEFAULT_FIREBASE_CONFIG);
    const hasCoreConfig = Boolean(config && config.apiKey && config.authDomain && config.projectId && config.appId);
    const hasFirebaseSdk = Boolean(window.firebase && window.firebase.apps && window.firebase.firestore);
    const hasAuthSdk = Boolean(window.firebase && window.firebase.auth);

    const connected = await this.initFirebase();
    const authOk = Boolean(this.firebaseAuthUid);
    const firestoreOk = Boolean(connected && this.firebaseConnected && this.firebaseDb);
    const code = String(this.firebaseLastErrorCode || '').trim();
    const msg = String(this.firebaseLastErrorMessage || '').trim();
    const hint = this.getFirebaseDiagnosticHint();

    const items = [
      {
        state: hasCoreConfig ? 'ok' : 'error',
        text: hasCoreConfig ? 'Configuração Firebase válida (apiKey/authDomain/projectId/appId).' : 'Configuração incompleta ou inválida no JSON.'
      },
      {
        state: hasFirebaseSdk ? 'ok' : 'error',
        text: hasFirebaseSdk ? 'SDK Firebase carregado.' : 'SDK Firebase não carregado na página.'
      },
      {
        state: hasAuthSdk ? (authOk ? 'ok' : 'error') : 'error',
        text: hasAuthSdk
          ? (authOk ? `Autenticação anônima OK (uid ${this.firebaseAuthUid}).` : `Autenticação anônima falhou${code ? ` (${code})` : ''}.`)
          : 'SDK Firebase Auth não carregado.'
      },
      {
        state: firestoreOk ? 'ok' : 'error',
        text: firestoreOk
          ? 'Leitura inicial no Firestore permitida.'
          : `Acesso ao Firestore bloqueado${code ? ` (${code})` : ''}${msg ? `: ${msg}` : ''}`
      }
    ];

    const summary = firestoreOk
      ? 'Validação concluída: Firebase conectado e com acesso liberado.'
      : `Validação concluída com falha${hint ? ` - ${hint}` : '.'}`;

    this.renderFirebaseValidationPanel(summary, items);
  }

  disconnectFirebase() {
    if (this.firebaseSyncIntervalId) {
      window.clearInterval(this.firebaseSyncIntervalId);
      this.firebaseSyncIntervalId = null;
    }

    this.firebaseConnected = false;
    this.firebaseApp = null;
    this.firebaseDb = null;
    this.firebaseAuthUid = '';
    this.setFirebaseStatus(false, 'Desconectado do Firebase', 'local');
    this.updateFirebaseAuthStatus('offline', 'Auth Firebase: Desconectado');
    this.showToast('Firebase desconectado.', 'info');
  }

  async initFirebase() {
    const input = document.getElementById('cfg-firebase-json');
    const config = normalizeFirebaseConfig(this.firebaseConfig || this.loadFirebaseConfig() || DEFAULT_FIREBASE_CONFIG);

    if (!config || !config.projectId) {
      this.setFirebaseStatus(false, 'Configure o JSON do Firebase', 'local');
      this.updateFirebaseAuthStatus('error', 'Auth Firebase: Configuração inválida');
      this.showToast('Cole a configuração do Firebase no campo indicado.', 'warning');
      return false;
    }

    if (input) input.value = JSON.stringify(config, null, 2);
    this.firebaseConfig = config;
    this.saveFirebaseConfig(config);
    this.clearFirebaseLastError();
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
            this.setFirebaseLastError(authErr, authMessage);
            this.updateFirebaseAuthStatus('error', 'Auth Firebase: anônimo bloqueado');
            throw new Error(`Falha ao autenticar no Firebase: ${authMessage}`);
          }
        }

        if (!auth.currentUser) {
          this.setFirebaseLastError({ code: 'unauthenticated', message: 'Sem usuário autenticado após tentativa de login anônimo.' });
          this.updateFirebaseAuthStatus('error', 'Auth Firebase: sem usuário');
          throw new Error('Sem usuário autenticado no Firebase. Verifique Auth anônimo no Console.');
        }

        this.firebaseAuthUid = String(auth.currentUser.uid || '');
        this.updateFirebaseAuthStatus('ok', 'Auth Firebase: OK');
      } else {
        this.setFirebaseLastError({ code: 'auth/sdk-missing', message: 'SDK de autenticação do Firebase não carregada.' });
        this.updateFirebaseAuthStatus('error', 'Auth Firebase: SDK Auth ausente');
      }

      this.firebaseDb = window.firebase.firestore(this.firebaseApp);
      this.firebaseConnected = true;
      this.setFirebaseStatus(true, 'Conectado ao Firebase', 'live');
      this.startFirebaseAutoRefresh();
      this.showToast('Firebase conectado com sucesso.', 'success');

      try {
        if (this.isFirebaseSyncDirty()) {
          await this.pushAllDataToFirebase();
          this.setFirebaseSyncDirty(false);
        }

        await this.syncDataWithFirebase();
      } catch (syncErr) {
        const message = syncErr && syncErr.message ? syncErr.message : 'Erro desconhecido';
        this.setFirebaseLastError(syncErr, message);
        this.firebaseConnected = false;
        this.firebaseDb = null;
        this.setFirebaseStatus(false, 'Firebase indisponível para sincronização', 'local');
        const errorCode = String((syncErr && syncErr.code) || '');
        this.updateFirebaseAuthStatus('error', errorCode ? `Auth Firebase: ${errorCode}` : 'Auth Firebase: sem permissão');
        this.showToast(`Sincronização cancelada: ${message}`, 'warning');
      }
      return true;
    } catch (err) {
      const message = err && err.message ? err.message : 'Erro desconhecido';
      this.setFirebaseLastError(err, message);
      const isPermissionError = /permission|permissions/i.test(message);
      const isAuthError = /auth|autentica|signInAnonymously|anonymous/i.test(message);
      const isNetworkError = /network|Failed to fetch|ERR_ABORTED|unavailable/i.test(message);
      this.firebaseConnected = false;
      this.firebaseDb = null;
      this.setFirebaseStatus(false, (isPermissionError || isAuthError) ? 'Firebase sem permissão' : 'Falha ao conectar no Firebase', 'local');
      const code = String((err && err.code) || '').trim();
      this.updateFirebaseAuthStatus(
        (isPermissionError || isAuthError) ? 'error' : 'offline',
        (isPermissionError || isAuthError)
          ? `Auth Firebase: ${code || 'Bloqueado'}`
          : 'Auth Firebase: Offline'
      );
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
      let shouldSeedRemoteFromLocal = false;

      for (const item of collections) {
        const snapshot = await this.firebaseDb.collection(item.name).get();
        if (snapshot.empty) {
          if (Array.isArray(item.data) && item.data.length) {
            shouldSeedRemoteFromLocal = true;
          } else {
            if (item.name === 'clients') this.clients = [];
            if (item.name === 'appointments') this.appointments = [];
            if (item.name === 'expenses') this.expenses = [];
          }
          continue;
        }

        const remoteData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        if (item.name === 'clients') this.clients = remoteData;
        if (item.name === 'appointments') this.appointments = remoteData;
        if (item.name === 'expenses') this.expenses = remoteData;
      }

      if (shouldSeedRemoteFromLocal) {
        await this.pushAllDataToFirebase();
      }

      this.saveStore();
      this.render();
    } catch (err) {
      const message = err && err.message ? err.message : 'Erro desconhecido';
      console.log('Falha ao sincronizar com Firestore:', message);
      throw err;
    }
  }

  async pushAllDataToFirebase() {
    if (!this.firebaseDb) return;
    try {
      const operations = [];
      const localIdsByCollection = {
        clients: new Set(),
        appointments: new Set(),
        expenses: new Set()
      };

      this.clients.forEach((client) => {
        if (!client.id) return;
        const id = String(client.id);
        localIdsByCollection.clients.add(id);
        operations.push({ type: 'set', collection: 'clients', id, data: client });
      });

      this.appointments.forEach((appt) => {
        if (!appt.id) return;
        const id = String(appt.id);
        localIdsByCollection.appointments.add(id);
        operations.push({ type: 'set', collection: 'appointments', id, data: appt });
      });

      this.expenses.forEach((expense) => {
        if (!expense.id) return;
        const id = String(expense.id);
        localIdsByCollection.expenses.add(id);
        operations.push({ type: 'set', collection: 'expenses', id, data: expense });
      });

      const collections = ['clients', 'appointments', 'expenses'];
      for (const collectionName of collections) {
        const snapshot = await this.firebaseDb.collection(collectionName).get();
        snapshot.docs.forEach((doc) => {
          if (localIdsByCollection[collectionName].has(doc.id)) return;
          operations.push({ type: 'delete', collection: collectionName, id: doc.id });
        });
      }

      const maxBatchSize = 450;
      for (let index = 0; index < operations.length; index += maxBatchSize) {
        const batch = this.firebaseDb.batch();
        const chunk = operations.slice(index, index + maxBatchSize);

        chunk.forEach((operation) => {
          const ref = this.firebaseDb.collection(operation.collection).doc(operation.id);
          if (operation.type === 'delete') {
            batch.delete(ref);
            return;
          }

          batch.set(ref, operation.data);
        });

        await batch.commit();
      }
    } catch (err) {
      console.log('Falha ao enviar dados para o Firestore:', err);
      throw err;
    }
  }

  async refreshFirebaseDataNow() {
    this.updateCloudSyncMeta('Atualizando dados do Firebase...', 'live');

    if (!this.firebaseConnected || !this.firebaseDb) {
      const connected = await this.initFirebase();
      if (!connected || !this.firebaseDb) return;
    }

    try {
      await this.syncDataWithFirebase();
      this.updateCloudSyncMeta('Dados atualizados do Firebase', 'live');
      this.showToast('Dados atualizados com sucesso.', 'success');
    } catch (err) {
      const message = err && err.message ? err.message : 'Erro desconhecido';
      this.updateCloudSyncMeta('Falha ao atualizar dados do Firebase', 'local');
      this.showToast(`Falha ao atualizar dados: ${message}`, 'warning');
    }
  }

  startFirebaseAutoRefresh() {
    if (this.firebaseSyncIntervalId) {
      window.clearInterval(this.firebaseSyncIntervalId);
      this.firebaseSyncIntervalId = null;
    }

    this.firebaseSyncIntervalId = window.setInterval(() => {
      if (!this.firebaseConnected || !this.firebaseDb) return;

      void this.syncDataWithFirebase()
        .then(() => {
          this.updateCloudSyncMeta('Dados atualizados do Firebase', 'live');
        })
        .catch((err) => {
          console.log('Falha ao atualizar dados automaticamente do Firebase:', err);
        });
    }, this.firebaseSyncIntervalMs);
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
    const topStartIso = this.normalizeTopDateToIso((topStart || {}).value || '');
    const topEndIso = this.normalizeTopDateToIso((topEnd || {}).value || '');
    if (agendaStart) agendaStart.value = topStartIso || '';
    if (agendaEnd) agendaEnd.value = topEndIso || '';
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
    const start = this.normalizeAgendaDateToIso((document.getElementById('agenda-filter-start') || {}).value || '');
    const end = this.normalizeAgendaDateToIso((document.getElementById('agenda-filter-end') || {}).value || '');
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

    const currentUserName = this.getSignatureName();

    setText('dash-consultas-hoje', todayApps.length);
    setText('dash-consultas-hoje-sub', `${doneToday} concluídas`);
    setText('dash-received-month', formatCurrency(received));
    setText('dash-pending-total', formatCurrency(pending));
    setText('dash-pending-count', `${this.appointments.filter((a) => toNumber(a.price) - toNumber(a.amountPaid) > 0).length} cobranças pendentes`);
    setText('dash-result-total', formatCurrency(result));
    setText('dash-result-sub', result > 0 ? `Superávit de ${formatCurrency(result)}` : (result < 0 ? `Déficit de ${formatCurrency(Math.abs(result))}` : 'Equilíbrio no período'));
    setText('dash-total-clients', this.clients.length);
    setText('dash-current-user', currentUserName);
    setText('dash-current-user-sub', 'Usuário da sessão atual');
    setText('header-current-user-name', `Olá, ${currentUserName}`);
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
      const startIso = this.normalizeAgendaDateToIso(agendaStartInput.value);
      const endIso = this.normalizeAgendaDateToIso(agendaEndInput.value);
      const selectedDate = startIso || this.agendaCalendarStartDate || getTodayStr();
      this.agendaCalendarStartDate = getWeekStartMondayIso(selectedDate);

      // Keep manual period edits; only auto-fill when fields are empty.
      if (!startIso) {
        agendaStartInput.value = this.formatAgendaDateForInput(this.agendaCalendarStartDate);
      }
      if (!endIso) {
        agendaEndInput.value = this.formatAgendaDateForInput(addDaysIso(this.agendaCalendarStartDate, 6));
      }
    }

    this.updateAgendaViewModeUI();

    if (rangeLabel) {
      const start = this.normalizeAgendaDateToIso((document.getElementById('agenda-filter-start') || {}).value || '') || '-';
      const end = this.normalizeAgendaDateToIso((document.getElementById('agenda-filter-end') || {}).value || '') || '-';
      rangeLabel.textContent = `${formatDateBR(start)} até ${formatDateBR(end)}`;
    }

    if (calendarGrid) {
      if (!filtered.length) {
        calendarGrid.innerHTML = '<div class="empty-state" style="grid-column:1 / -1;"><p>Nenhum agendamento no período.</p></div>';
      } else {
        const start = agendaStartInput ? (this.normalizeAgendaDateToIso(agendaStartInput.value) || this.agendaCalendarStartDate) : this.agendaCalendarStartDate;
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
        set('client-referral-source', c.referralSource);
        set('client-referral-notes', c.referralNotes);
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
      referralSource: String((document.getElementById('client-referral-source') || {}).value || '').trim(),
      referralNotes: String((document.getElementById('client-referral-notes') || {}).value || '').trim(),
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
    if (dateInput && !dateInput.value) dateInput.value = this.formatDobForInput(getTodayStr());

    if (appointmentId) {
      const a = this.appointments.find((x) => x.id === appointmentId);
      if (a) {
        if (idInput) idInput.value = a.id;
        const set = (id, val) => {
          const el = document.getElementById(id);
          if (el) el.value = val == null ? '' : val;
        };
        set('appt-client-id', a.clientId);
        set('appt-date', this.formatDobForInput(a.date));
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
    const dateRaw = String((document.getElementById('appt-date') || {}).value || '').trim();
    const date = this.normalizeDobToIso(dateRaw);
    const time = String((document.getElementById('appt-time') || {}).value || '').trim();
    const procedure = String((document.getElementById('appt-procedure') || {}).value || '').trim();
    const price = toNumber((document.getElementById('appt-price') || {}).value || 0);

    if (dateRaw && !date) {
      this.showToast('Data inválida. Use o formato ddmmaaaa.', 'warning');
      return;
    }

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
    const start = this.normalizeTopDateToIso((document.getElementById('top-date-start') || {}).value || '');
    const end = this.normalizeTopDateToIso((document.getElementById('top-date-end') || {}).value || '');
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
      `Como chegou: ${patient.referralSource || '-'}${patient.referralNotes ? ` | ${patient.referralNotes}` : ''}`,
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
    const allowNegative = options.allowNegative === true;
    const allValues = safeSeries.flatMap((item) => item.values || []).map((value) => Number(value || 0));
    const maxRawValue = Math.max(0, ...allValues);
    const minRawValue = allowNegative ? Math.min(0, ...allValues) : 0;
    const range = Math.max(1, maxRawValue - minRawValue);

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
    const legendType = String(options.legendType || 'count');

    const gridLines = Array.from({ length: 5 }, (_, index) => {
      const ratio = index / 4;
      const y = padTop + plotHeight - (plotHeight * ratio);
      return `<line class="chart-grid-line" x1="${padLeft}" y1="${y.toFixed(2)}" x2="${(padLeft + plotWidth).toFixed(2)}" y2="${y.toFixed(2)}"></line>`;
    }).join('');

    const zeroRatio = (maxRawValue - 0) / range;
    const zeroY = padTop + (plotHeight * zeroRatio);
    const zeroLine = allowNegative
      ? `<line class="chart-grid-line" x1="${padLeft}" y1="${zeroY.toFixed(2)}" x2="${(padLeft + plotWidth).toFixed(2)}" y2="${zeroY.toFixed(2)}" style="opacity:0.92;stroke-width:1.4;"></line>`
      : '';

    const bars = safeLabels.map((_, labelIndex) => {
      const currentGroupWidth = seriesCount * barWidth + (seriesCount - 1) * barGap;
      const baseX = padLeft + labelIndex * groupWidth + (groupWidth - currentGroupWidth) / 2;

      return safeSeries.map((item, seriesIndex) => {
        const rawValue = Number((item.values || [])[labelIndex] || 0);
        const valueY = padTop + (((maxRawValue - rawValue) / range) * plotHeight);
        const barHeight = Math.abs(zeroY - valueY);
        if (barHeight <= 0.5) return '';

        const x = baseX + seriesIndex * (barWidth + barGap);
        const y = rawValue >= 0 ? valueY : zeroY;

        const isNegative = rawValue < 0;
        const frontColor = isNegative ? (item.negativeFront || '#ef4444') : (item.front || '#60a5fa');
        const topColor = isNegative ? (item.negativeTop || '#fca5a5') : (item.top || '#93c5fd');
        const valueLabel = rawValue !== 0
          ? `<text class="chart-value-label" x="${(x + (barWidth / 2)).toFixed(2)}" y="${(isNegative ? (y + barHeight + 14) : (y - 6)).toFixed(2)}">${safeText(String(rawValue.toFixed(rawValue % 1 === 0 ? 0 : 2)).replace('.', ','))}</text>`
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
        ${zeroLine}
        ${bars}
      </svg>
    `;

    const formatLegendTotal = (total) => {
      if (legendType === 'currency') return formatCurrency(total);
      if (Math.abs(total - Math.round(total)) < 0.001) return String(Math.round(total));
      return String(total.toFixed(2)).replace('.', ',');
    };

    const legend = `
      <div class="analytics-legend">
        ${safeSeries.map((item) => {
          const computedTotal = (item.values || []).reduce((sum, value) => sum + Number(value || 0), 0);
          const total = Number.isFinite(Number(item.totalOverride)) ? Number(item.totalOverride) : computedTotal;
          const legendColor = total < 0
            ? (item.legendNegative || item.front)
            : (item.legendPositive || item.front);
          const legendValueColor = total < 0
            ? (item.legendValueNegative || item.legendNegative || '#fda4af')
            : (item.legendValuePositive || item.legendPositive || '#d9f99d');
          return `<span class="analytics-legend-item"><i style="background:${legendColor};"></i><strong>${safeText(item.name || '-')}</strong><em style="color:${legendValueColor};">${safeText(formatLegendTotal(total))}</em></span>`;
        }).join('')}
      </div>
    `;

    const axis = `
      <div class="chart-axis-labels ${grouped ? 'chart-axis-labels-grouped' : ''}" style="--chart-columns:${labelCount};">
        ${safeLabels.map((dateLabel) => {
          const normalized = String(dateLabel || '').trim().toLowerCase();
          const labelText = normalized === 'total' ? 'Total' : formatDateBR(dateLabel).slice(0, 5);
          return `<span>${safeText(labelText)}</span>`;
        }).join('')}
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
    ], { legendType: 'count' });
  }

  renderFinanceComparisonChart() {
    const container = document.getElementById('analytics-finance-chart');
    if (!container) return;

    const labels = ['total'];
    const revenueTotal = Number(this.appointments.reduce((sum, appt) => sum + toNumber(appt.amountPaid), 0).toFixed(2));
    const expenseTotal = Number(this.expenses.reduce((sum, expense) => sum + toNumber(expense.amount), 0).toFixed(2));
    const resultTotal = Number((revenueTotal - expenseTotal).toFixed(2));

    const revenueValues = [revenueTotal];
    const expenseValues = [expenseTotal];
    const resultValues = [resultTotal];
    const hasData = revenueTotal > 0 || expenseTotal > 0 || resultTotal !== 0;

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
        side: '#1d4ed8',
        totalOverride: revenueTotal,
        legendValuePositive: '#7dd3fc',
        legendValueNegative: '#7dd3fc'
      },
      {
        name: 'Despesas',
        values: expenseValues,
        front: '#f97316',
        top: '#fdba74',
        side: '#c2410c',
        totalOverride: expenseTotal,
        legendValuePositive: '#fdba74',
        legendValueNegative: '#fdba74'
      },
      {
        name: 'Resultado',
        values: resultValues,
        front: '#84cc16',
        top: '#bef264',
        side: '#4d7c0f',
        negativeFront: '#ef4444',
        negativeTop: '#fca5a5',
        legendPositive: '#84cc16',
        legendNegative: '#ef4444',
        totalOverride: resultTotal,
        legendValuePositive: '#a3e635',
        legendValueNegative: '#fca5a5'
      }
    ], { legendType: 'currency', allowNegative: true });
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
    this.renderVersionBadge();
    this.renderDashboard();
    this.renderAgendaTable();
    this.renderClientsTable();
    this.renderFinanceiroTable();
    this.renderDespesasTable();
    this.renderWhatsAppTab();
    this.renderGraficosTab();
    this.renderRegisteredUsersCards();
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
        window.loadPartial('src/components/partials/main-shell.html?v=20260730-8', 'app-root')
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
  await window.app.initFirebase();

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js?v=20260730-1')
      .then((reg) => {
        console.log('[PWA] Service Worker registrado:', reg.scope);
        if (reg.waiting) window.app.setUpdateReady(true);

        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          if (!newWorker) return;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              window.app.setUpdateReady(true);
            }
          });
        });

        navigator.serviceWorker.addEventListener('controllerchange', () => {
          window.app.setUpdateReady(false);
        });

        if (reg && typeof reg.update === 'function') reg.update();
      })
      .catch((err) => console.log('[PWA] Falha Service Worker:', err));
  }
});
    // inicialização
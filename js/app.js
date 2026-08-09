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
const VOICE_NARRATION_ENABLED_STORAGE_KEY = 'consultorio_voice_narration_enabled';
const REMINDER_MINS_STORAGE_KEY = 'consultorio_reminder_mins';
const REMINDER_INTENSITY_STORAGE_KEY = 'consultorio_reminder_intensity';
const AGENDA_HOUR_RANGE_STORAGE_KEY = 'consultorio_agenda_hour_range';
const FIREBASE_CONFIG_STORAGE_KEY = 'consultorio_firebase_config';
const FIREBASE_SYNC_DIRTY_STORAGE_KEY = 'consultorio_firebase_sync_dirty';
const FIREBASE_DEVICE_ID_STORAGE_KEY = 'consultorio_firebase_device_id';
const FIREBASE_LAST_PUSH_MILLIS_STORAGE_KEY = 'consultorio_firebase_last_push_millis';
const FIREBASE_PUSH_SHADOW_STORAGE_KEY = 'consultorio_firebase_push_shadow';
const GOOGLE_CALENDAR_CLIENT_ID_STORAGE_KEY = 'consultorio_google_calendar_client_id';
const GOOGLE_CALENDAR_REQUIRED_CLIENT_ID = '210238418315-lavm9rn9vpne0hqa3fgt77oj1e0cvvis.apps.googleusercontent.com';
const GOOGLE_CALENDAR_LAST_IMPORTED_STORAGE_KEY = 'consultorio_google_calendar_last_imported';
// O app só importa (lê) do Google Calendar — nunca cria/edita/apaga eventos lá — por isso usa
// escopos somente-leitura: calendar.events.readonly para os eventos e calendar.calendarlist.readonly
// para listar as demais agendas do usuário (ex.: "CONSULTÓRIO", "PsicoManager", agendas
// secundárias/compartilhadas), sem o qual a importação só enxergava a agenda "primary". Usuários
// já conectados com o escopo de escrita antigo precisam clicar em "Conectar Google Calendar" de
// novo para trocar de escopo (o app força a tela de consentimento via prompt: 'select_account consent').
const GOOGLE_CALENDAR_SCOPES = 'https://www.googleapis.com/auth/calendar.events.readonly https://www.googleapis.com/auth/calendar.calendarlist.readonly';
const GOOGLE_CALENDAR_DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';
const GOOGLE_CALENDAR_ALLOWED_ORIGINS = [
  'http://127.0.0.1:8000',
  'http://localhost:8000',
  'https://gomes-muller2026.github.io'
];
const SHARED_SETTINGS_SIGNATURE_STORAGE_KEY = 'consultorio_shared_settings_signature';
const FIREBASE_FORCE_LONG_POLLING = true;
const LOCAL_BACKUP_DATA_URL = './data/backup_consultorio_2026-07-26%20(1).json';
const APPOINTMENT_DELETE_TOMBSTONES_STORAGE_KEY = 'consultorio_deleted_appointment_tombstones';
const APP_VERSION_STORAGE_KEY = 'consultorio_app_version_info';
const APP_RELEASE_SEEN_STORAGE_KEY = 'consultorio_app_release_seen';
const APP_RELEASE_VERSION = 'v09.08.2026-2';
const LANDSCAPE_SIDEBAR_COLLAPSED_STORAGE_KEY = 'consultorio_landscape_sidebar_collapsed';
const LOGIN_USERS_FIRESTORE_COLLECTION = 'login_users';
const CLIENT_GROUPS_STORAGE_KEY = 'consultorio_client_groups';
const CLIENT_CATEGORIES_STORAGE_KEY = 'consultorio_client_categories';
const DEFAULT_CLIENT_CATEGORIES = ['Paciente', 'Medico', 'Yoga', 'Limpeza'];
const EXPENSE_CATEGORIES_STORAGE_KEY = 'consultorio_expense_categories';
const DEFAULT_EXPENSE_CATEGORIES = ['Outros', 'Aluguel', 'Internet', 'Material', 'Folha', 'Transporte', 'Software'];

const CLIENT_MANAGED_LISTS = {
  convenio: {
    stateKey: 'convenioOptions',
    storageKey: 'consultorio_client_convenio_options',
    defaults: ['Particular', 'Convênio'],
    clientField: 'convenio',
    fallback: '',
    label: 'Convênio',
    selectId: 'client-convenio',
    filterId: 'clientes-convenio-filter',
    modalId: 'modal-client-convenio',
    listId: 'client-convenio-list',
    addBtnId: 'btn-add-convenio',
    addInputId: 'new-convenio-input'
  },
  planoFinanceiro: {
    stateKey: 'planoFinanceiroOptions',
    storageKey: 'consultorio_client_plano_financeiro_options',
    defaults: ['Por sessão', 'Pacote mensal', 'Pacote fechado', 'Por mês (mensalista)', 'Convênio', 'Isento'],
    clientField: 'planoFinanceiro',
    fallback: '',
    label: 'Plano financeiro',
    selectId: 'client-plano-financeiro',
    filterId: 'clientes-plano-financeiro-filter',
    modalId: 'modal-client-plano-financeiro',
    listId: 'client-plano-financeiro-list',
    addBtnId: 'btn-add-plano-financeiro',
    addInputId: 'new-plano-financeiro-input'
  },
  tags: {
    stateKey: 'clientTagsOptions',
    storageKey: 'consultorio_client_tags_options',
    defaults: [],
    clientField: 'tags',
    fallback: '',
    label: 'Tags',
    selectId: '',
    filterId: 'clientes-tags-filter',
    modalId: 'modal-client-tags',
    listId: 'client-tags-list',
    addBtnId: 'btn-add-tag',
    addInputId: 'new-tag-input',
    multi: true
  }
};
const WHATSAPP_CONFIRM_TEMPLATE_STORAGE_KEY = 'consultorio_whatsapp_confirm_template';
const WHATSAPP_BIRTHDAY_TEMPLATE_STORAGE_KEY = 'consultorio_whatsapp_birthday_template';
const WHATSAPP_CONFIRM_TEMPLATES_STORAGE_KEY = 'consultorio_whatsapp_confirm_templates';
const WHATSAPP_BIRTHDAY_TEMPLATES_STORAGE_KEY = 'consultorio_whatsapp_birthday_templates';
const WHATSAPP_CONFIRM_SELECTED_TEMPLATE_STORAGE_KEY = 'consultorio_whatsapp_confirm_selected';
const WHATSAPP_BIRTHDAY_SELECTED_TEMPLATE_STORAGE_KEY = 'consultorio_whatsapp_birthday_selected';
const PAYMENT_RECEIPT_TEMPLATE_STORAGE_KEY = 'consultorio_payment_receipt_template';
const PAYMENT_RECEIPT_COUNTER_STORAGE_KEY = 'consultorio_payment_receipt_counter';
const PAYMENT_RECEIPT_NUMBER_MAP_STORAGE_KEY = 'consultorio_payment_receipt_number_map';
const PAYMENT_RECEIPT_PROFILE_STORAGE_KEY = 'consultorio_payment_receipt_profile';
const REQUIRED_LOGIN_USERS = [
  {
    username: 'Rafael',
    password: '160658'
  }
];
const MASTER_CONFIG_USERNAME = 'Rafael';
const DEFAULT_RECEIPT_PROFESSIONAL_NAME = 'Patricia Grando Muller';
const DEFAULT_RECEIPT_PROFESSIONAL_CRP = '[Numero do CRP/Regiao]';
const DEFAULT_RECEIPT_PROFESSIONAL_CPF = '001.715.930-06';
const DEFAULT_RECEIPT_PROFESSIONAL_ADDRESS = '[Endereco do Consultorio]';
const DEFAULT_RECEIPT_CITY_UF = '[Cidade - RS]';
const DEFAULT_PAYMENT_RECEIPT_PROFILE = {
  professionalName: DEFAULT_RECEIPT_PROFESSIONAL_NAME,
  professionalCrp: DEFAULT_RECEIPT_PROFESSIONAL_CRP,
  professionalCpf: DEFAULT_RECEIPT_PROFESSIONAL_CPF,
  professionalAddress: DEFAULT_RECEIPT_PROFESSIONAL_ADDRESS,
  cityUf: DEFAULT_RECEIPT_CITY_UF
};
const LEGACY_PAYMENT_RECEIPT_TEMPLATE = [
  'LOGO: Patricia Grando Muller',
  'RECIBO DE PAGAMENTO',
  '',
  'Profissional: Patricia Grando Muller',
  'Responsavel: {{assinatura}}',
  'Paciente: {{cliente}}',
  'Data da consulta: {{data}} as {{hora}}',
  'Procedimento: {{procedimento}}',
  'Forma de pagamento: {{forma_pagamento}}',
  '',
  'Valor total: {{valor_total}}',
  'Valor ja pago (antes): {{valor_pago_antes}}',
  'Valor pago agora: {{valor_pago_agora}}',
  'Total pago (apos): {{total_pago}}',
  'Saldo em aberto: {{saldo_aberto}}',
  '',
  'Emitido em: {{emitido_em}}',
  '',
  'Assinatura: ____________________________'
].join('\n');
const DEFAULT_PAYMENT_RECEIPT_TEMPLATE = [
  'RECIBO DE PAGAMENTO',
  'Nº: {{recibo_numero}}',
  '',
  'Valor: {{valor_pago_agora}} ({{valor_pago_agora_extenso}})',
  '',
  'Recebi de {{pagador_nome}}, inscrito(a) no CPF sob o nº {{pagador_cpf}}, a importancia de {{valor_pago_agora}}, referente a prestacao de servicos de psicoterapia realizada para o(a) paciente {{paciente_nome}}, inscrito(a) no CPF sob o nº {{paciente_cpf}}.',
  '',
  'Servico: {{servico}}',
  'Quantidade: {{quantidade_sessoes}} sessao(oes)',
  'Data(s) do atendimento: {{datas_atendimento}}',
  '',
  '{{cidade_uf}}, {{data_emissao_extenso}}.',
  '',
  'Assinatura do(a) Profissional',
  'Nome: {{profissional_nome}}',
  'CRP: {{profissional_crp}}',
  'CPF: {{profissional_cpf}}',
  'Endereco: {{profissional_endereco}}'
].join('\n');

const sanitizePaymentReceiptTemplate = (templateText) => String(templateText || '')
  .replace(/\r/g, '')
  .split('\n')
  .filter((line) => !/^\s*logo\s*:/i.test(String(line || '').trim()))
  .join('\n')
  .trim();

const isLegacyPaymentReceiptTemplate = (templateText) => {
  const normalized = String(templateText || '').toLowerCase();
  const hasLegacyMarkers = [
    '{{cliente}}',
    '{{procedimento}}',
    '{{valor_total}}',
    'data da consulta:',
    'forma de pagamento:'
  ].some((token) => normalized.includes(token));

  const hasNewMarkers = [
    '{{paciente_nome}}',
    '{{paciente_cpf}}',
    '{{pagador_nome}}',
    '{{pagador_cpf}}',
    '{{recibo_numero}}'
  ].some((token) => normalized.includes(token));

  return hasLegacyMarkers && !hasNewMarkers;
};
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

const getCurrentMonthRange = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const monthLabel = String(month + 1).padStart(2, '0');
  const lastDay = String(new Date(year, month + 1, 0).getDate()).padStart(2, '0');
  return {
    start: `${year}-${monthLabel}-01`,
    end: `${year}-${monthLabel}-${lastDay}`
  };
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

const weekdayLongPt = (isoDate) => {
  const d = parseIsoDate(isoDate);
  if (!d) return '-';
  const label = d.toLocaleDateString('pt-BR', { weekday: 'long' });
  return label.charAt(0).toUpperCase() + label.slice(1);
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

const escapeHtml = (value) => String(value == null ? '' : value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');

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

/* ==========================================================================
   Custom Select (dropdown) — substitui o popup nativo do <select>
   --------------------------------------------------------------------------
   Chrome/Edge no Windows não respeitam de forma confiável CSS de :hover/
   :focus aplicado a <option> dentro do popup nativo de um <select> aberto
   (o item sob o mouse é desenhado pelo SO com cores do sistema, ignorando o
   CSS do autor). Para garantir contraste e identidade visual consistentes
   em todo estado (fechado, aberto, hover, selecionado), os <select>
   listados em CUSTOM_SELECT_IDS são "progressivamente aprimorados" em
   tempo de execução por enhanceSelectAsCustomDropdown(): o <select>
   original continua no DOM (escondido) e é mantido sincronizado, então
   todo o restante do app.js que lê/escreve `.value`/`.selectedIndex`
   desses elementos por id continua funcionando sem alteração.
   ========================================================================== */
const CUSTOM_SELECT_IDS = [
  'appt-client-id',
  'appt-procedure',
  'appt-payment-method',
  'appt-status',
  'appt-recurrence-type',
  'appt-bulk-update-mode',
  'appt-payment-status',
  'client-category',
  'client-convenio',
  'client-plano-financeiro',
  'expense-category',
  'pay-method'
];

const CUSTOM_SELECT_CHEVRON_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>';

function cssEscapeId(id) {
  if (window.CSS && typeof window.CSS.escape === 'function') return window.CSS.escape(id);
  return String(id).replace(/([^a-zA-Z0-9_-])/g, '\\$1');
}

function buildCustomSelectOptionsHTML(selectEl) {
  return Array.from(selectEl.options || []).map((opt, idx) => {
    const label = opt.textContent || '';
    return `<li role="option" class="custom-select-option${opt.disabled ? ' is-disabled' : ''}" id="${safeText(selectEl.id)}__opt-${idx}" data-index="${idx}" aria-selected="false">${safeText(label)}</li>`;
  }).join('');
}

function syncCustomSelectDisplay(selectEl) {
  const state = selectEl.__customSelect;
  if (!state) return;
  const opt = selectEl.options[selectEl.selectedIndex] || null;
  const label = opt ? (opt.textContent || '') : '';
  state.valueEl.textContent = label;
  state.valueEl.classList.toggle('is-placeholder', !!opt && !opt.value);
  Array.from(state.list.children).forEach((li, idx) => {
    const isSelected = idx === selectEl.selectedIndex;
    li.classList.toggle('is-selected', isSelected);
    li.setAttribute('aria-selected', isSelected ? 'true' : 'false');
  });
}

function highlightCustomSelectActive(selectEl) {
  const state = selectEl.__customSelect;
  if (!state) return;
  const children = state.list.children;
  Array.from(children).forEach((li, idx) => {
    li.classList.toggle('is-active', idx === state.activeIndex);
  });
  const activeLi = children[state.activeIndex];
  if (activeLi) {
    state.trigger.setAttribute('aria-activedescendant', activeLi.id);
    if (typeof activeLi.scrollIntoView === 'function') activeLi.scrollIntoView({ block: 'nearest' });
  }
}

function rebuildCustomSelectList(selectEl) {
  const state = selectEl.__customSelect;
  if (!state) return;
  state.list.innerHTML = buildCustomSelectOptionsHTML(selectEl);
  state.activeIndex = Math.max(0, selectEl.selectedIndex);
  syncCustomSelectDisplay(selectEl);
}

function positionCustomSelectList(selectEl) {
  const state = selectEl.__customSelect;
  if (!state) return;
  const rect = state.trigger.getBoundingClientRect();
  const list = state.list;
  const viewportH = window.innerHeight || document.documentElement.clientHeight;
  const gap = 6;
  const preferredMax = 280;
  const spaceBelow = viewportH - rect.bottom - gap;
  const spaceAbove = rect.top - gap;

  list.style.left = `${Math.round(rect.left)}px`;
  list.style.width = `${Math.round(rect.width)}px`;

  if (spaceBelow < 140 && spaceAbove > spaceBelow) {
    list.style.top = 'auto';
    list.style.bottom = `${Math.round(viewportH - rect.top + gap)}px`;
    list.style.maxHeight = `${Math.max(120, Math.min(preferredMax, spaceAbove))}px`;
    state.wrapper.classList.add('drop-up');
  } else {
    list.style.bottom = 'auto';
    list.style.top = `${Math.round(rect.bottom + gap)}px`;
    list.style.maxHeight = `${Math.max(120, Math.min(preferredMax, spaceBelow))}px`;
    state.wrapper.classList.remove('drop-up');
  }
}

function closeCustomSelect(selectEl) {
  const state = selectEl && selectEl.__customSelect;
  if (!state || !state.open) return;
  state.open = false;
  state.wrapper.classList.remove('is-open');
  state.list.hidden = true;
  state.trigger.setAttribute('aria-expanded', 'false');
  state.trigger.removeAttribute('aria-activedescendant');
}

function closeAllCustomSelects(exceptSelectEl) {
  document.querySelectorAll('.custom-select.is-open').forEach((wrapper) => {
    const sel = wrapper.__selectRef;
    if (sel && sel !== exceptSelectEl) closeCustomSelect(sel);
  });
}

function openCustomSelect(selectEl) {
  const state = selectEl && selectEl.__customSelect;
  if (!state || state.open || selectEl.disabled) return;
  closeAllCustomSelects(selectEl);
  state.open = true;
  state.activeIndex = selectEl.selectedIndex >= 0 ? selectEl.selectedIndex : 0;
  state.wrapper.classList.add('is-open');
  state.list.hidden = false;
  state.trigger.setAttribute('aria-expanded', 'true');
  positionCustomSelectList(selectEl);
  highlightCustomSelectActive(selectEl);
}

function toggleCustomSelect(selectEl) {
  const state = selectEl && selectEl.__customSelect;
  if (!state) return;
  if (state.open) closeCustomSelect(selectEl); else openCustomSelect(selectEl);
}

function chooseCustomSelectIndex(selectEl, index, options = {}) {
  const state = selectEl.__customSelect;
  if (!state) return;
  const opts = selectEl.options;
  if (!opts || index < 0 || index >= opts.length || opts[index].disabled) return;
  const changed = selectEl.selectedIndex !== index;
  selectEl.selectedIndex = index;
  state.activeIndex = index;
  syncCustomSelectDisplay(selectEl);
  if (changed && !options.silent) {
    selectEl.dispatchEvent(new Event('input', { bubbles: true }));
    selectEl.dispatchEvent(new Event('change', { bubbles: true }));
  }
}

let customSelectTypeaheadBuffer = '';
let customSelectTypeaheadTimer = null;

function customSelectTypeahead(selectEl, char) {
  customSelectTypeaheadBuffer += char.toLowerCase();
  window.clearTimeout(customSelectTypeaheadTimer);
  customSelectTypeaheadTimer = window.setTimeout(() => { customSelectTypeaheadBuffer = ''; }, 700);

  const state = selectEl.__customSelect;
  const opts = Array.from(selectEl.options || []);
  if (!opts.length) return;
  const startFrom = (state.activeIndex + 1) % opts.length;
  let foundIdx = -1;
  for (let i = 0; i < opts.length; i++) {
    const idx = (startFrom + i) % opts.length;
    const text = String(opts[idx].textContent || '').toLowerCase();
    if (!opts[idx].disabled && text.indexOf(customSelectTypeaheadBuffer) === 0) {
      foundIdx = idx;
      break;
    }
  }
  if (foundIdx === -1) return;
  if (state.open) {
    state.activeIndex = foundIdx;
    highlightCustomSelectActive(selectEl);
  } else {
    chooseCustomSelectIndex(selectEl, foundIdx);
  }
}

function moveCustomSelectActive(selectEl, delta) {
  const state = selectEl.__customSelect;
  const count = selectEl.options.length;
  if (!count) return;
  let idx = state.activeIndex;
  for (let i = 0; i < count; i++) {
    idx = (idx + delta + count) % count;
    if (!selectEl.options[idx].disabled) break;
  }
  state.activeIndex = idx;
  highlightCustomSelectActive(selectEl);
}

function handleCustomSelectTriggerKeydown(evt, selectEl) {
  const state = selectEl.__customSelect;
  if (!state) return;
  const key = evt.key;

  if (!state.open) {
    if (key === 'ArrowDown' || key === 'ArrowUp' || key === 'Enter' || key === ' ' || key === 'Spacebar') {
      evt.preventDefault();
      openCustomSelect(selectEl);
      return;
    }
  } else {
    if (key === 'ArrowDown') { evt.preventDefault(); moveCustomSelectActive(selectEl, 1); return; }
    if (key === 'ArrowUp') { evt.preventDefault(); moveCustomSelectActive(selectEl, -1); return; }
    if (key === 'Home') { evt.preventDefault(); selectEl.__customSelect.activeIndex = 0; highlightCustomSelectActive(selectEl); return; }
    if (key === 'End') { evt.preventDefault(); selectEl.__customSelect.activeIndex = selectEl.options.length - 1; highlightCustomSelectActive(selectEl); return; }
    if (key === 'Enter' || key === ' ' || key === 'Spacebar') {
      evt.preventDefault();
      chooseCustomSelectIndex(selectEl, state.activeIndex);
      closeCustomSelect(selectEl);
      return;
    }
    if (key === 'Escape') { evt.preventDefault(); closeCustomSelect(selectEl); return; }
    if (key === 'Tab') { closeCustomSelect(selectEl); return; }
  }

  if (key && key.length === 1 && /[a-z0-9À-ÿ]/i.test(key)) {
    customSelectTypeahead(selectEl, key);
  }
}

function installCustomSelectValueInterceptor(selectEl) {
  const valueDesc = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value');
  const selectedIndexDesc = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'selectedIndex');
  if (valueDesc && valueDesc.configurable) {
    Object.defineProperty(selectEl, 'value', {
      configurable: true,
      enumerable: true,
      get() { return valueDesc.get.call(selectEl); },
      set(v) {
        valueDesc.set.call(selectEl, v);
        syncCustomSelectDisplay(selectEl);
        const state = selectEl.__customSelect;
        if (state) state.activeIndex = Math.max(0, selectEl.selectedIndex);
      }
    });
  }
  if (selectedIndexDesc && selectedIndexDesc.configurable) {
    Object.defineProperty(selectEl, 'selectedIndex', {
      configurable: true,
      enumerable: true,
      get() { return selectedIndexDesc.get.call(selectEl); },
      set(v) {
        selectedIndexDesc.set.call(selectEl, v);
        syncCustomSelectDisplay(selectEl);
        const state = selectEl.__customSelect;
        if (state) state.activeIndex = Math.max(0, selectEl.selectedIndex);
      }
    });
  }
}

function installCustomSelectOptionsObserver(selectEl) {
  const observer = new MutationObserver(() => {
    rebuildCustomSelectList(selectEl);
  });
  observer.observe(selectEl, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['disabled', 'value', 'selected'] });
  selectEl.__customSelect.observer = observer;
}

function enhanceSelectAsCustomDropdown(selectEl) {
  if (!selectEl || selectEl.tagName !== 'SELECT' || selectEl.__customSelect) return;

  const wrapper = document.createElement('div');
  wrapper.className = 'custom-select';
  wrapper.__selectRef = selectEl;

  const trigger = document.createElement('button');
  trigger.type = 'button';
  trigger.className = 'custom-select-trigger form-control';
  trigger.setAttribute('aria-haspopup', 'listbox');
  trigger.setAttribute('aria-expanded', 'false');
  if (selectEl.id) trigger.id = `${selectEl.id}__trigger`;

  const valueEl = document.createElement('span');
  valueEl.className = 'custom-select-value';

  const caret = document.createElement('span');
  caret.className = 'custom-select-caret';
  caret.setAttribute('aria-hidden', 'true');
  caret.innerHTML = CUSTOM_SELECT_CHEVRON_SVG;

  trigger.appendChild(valueEl);
  trigger.appendChild(caret);

  const list = document.createElement('ul');
  list.className = 'custom-select-list';
  list.setAttribute('role', 'listbox');
  list.hidden = true;
  if (selectEl.id) {
    list.id = `${selectEl.id}__listbox`;
    trigger.setAttribute('aria-controls', list.id);
  }

  wrapper.appendChild(trigger);
  selectEl.insertAdjacentElement('afterend', wrapper);
  document.body.appendChild(list);

  selectEl.hidden = true;
  selectEl.setAttribute('aria-hidden', 'true');
  selectEl.tabIndex = -1;

  selectEl.__customSelect = { wrapper, trigger, list, valueEl, open: false, activeIndex: 0 };

  rebuildCustomSelectList(selectEl);
  installCustomSelectValueInterceptor(selectEl);
  installCustomSelectOptionsObserver(selectEl);

  trigger.addEventListener('click', (evt) => {
    evt.preventDefault();
    toggleCustomSelect(selectEl);
  });
  trigger.addEventListener('keydown', (evt) => handleCustomSelectTriggerKeydown(evt, selectEl));

  list.addEventListener('click', (evt) => {
    const li = evt.target.closest('.custom-select-option');
    if (!li || li.classList.contains('is-disabled')) return;
    chooseCustomSelectIndex(selectEl, Number(li.getAttribute('data-index')));
    closeCustomSelect(selectEl);
    trigger.focus();
  });

  list.addEventListener('mousemove', (evt) => {
    const li = evt.target.closest('.custom-select-option');
    if (!li) return;
    const idx = Number(li.getAttribute('data-index'));
    const state = selectEl.__customSelect;
    if (Number.isNaN(idx) || state.activeIndex === idx) return;
    state.activeIndex = idx;
    highlightCustomSelectActive(selectEl);
  });

  if (selectEl.id) {
    const label = document.querySelector(`label[for="${cssEscapeId(selectEl.id)}"]`);
    if (label) {
      label.addEventListener('click', (evt) => {
        evt.preventDefault();
        trigger.focus();
        openCustomSelect(selectEl);
      });
    }
  }
}

function initCustomSelects(ids) {
  (ids || CUSTOM_SELECT_IDS).forEach((id) => {
    const el = document.getElementById(id);
    if (el) enhanceSelectAsCustomDropdown(el);
  });
}

function resyncCustomSelectsWithin(root) {
  if (!root || typeof root.querySelectorAll !== 'function') return;
  root.querySelectorAll('select').forEach((sel) => {
    if (sel.__customSelect) syncCustomSelectDisplay(sel);
  });
}

document.addEventListener('click', (evt) => {
  document.querySelectorAll('.custom-select.is-open').forEach((wrapper) => {
    const sel = wrapper.__selectRef;
    if (!sel) return;
    const state = sel.__customSelect;
    if (!state) return;
    if (wrapper.contains(evt.target) || state.list.contains(evt.target)) return;
    closeCustomSelect(sel);
  });
}, true);

document.addEventListener('scroll', () => {
  document.querySelectorAll('.custom-select.is-open').forEach((wrapper) => {
    const sel = wrapper.__selectRef;
    if (sel) positionCustomSelectList(sel);
  });
}, true);

window.addEventListener('resize', () => {
  document.querySelectorAll('.custom-select.is-open').forEach((wrapper) => {
    const sel = wrapper.__selectRef;
    if (sel) positionCustomSelectList(sel);
  });
});

const DEFAULT_APPOINTMENT_COLOR = '#0ea5e9';
const AGENDA_EVENT_DURATION_MIN = 50;
const AGENDA_CASCADE_STEP_PX = 26;
const AGENDA_HOUR_RANGE_DEFAULT_START = 7;
const AGENDA_HOUR_RANGE_DEFAULT_END = 21;

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
  // Cores claras (amarelo, verde-limão) ficam ilegíveis com texto branco: escolhe o texto pela luminância.
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
  const textColor = luminance > 0.62 ? '#1f2937' : '#ffffff';
  return `background-color: ${color}; border: 1px solid rgba(0, 0, 0, 0.18); color: ${textColor};`;
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

const ensureRequiredLoginUsers = (users) => {
  const normalized = normalizeLoginUsers(users);
  const merged = normalized.slice();

  REQUIRED_LOGIN_USERS.forEach((requiredUser) => {
    const username = String((requiredUser && requiredUser.username) || '').trim();
    const password = String((requiredUser && requiredUser.password) || '');
    if (!username || !password) return;

    const index = merged.findIndex((entry) => String((entry && entry.username) || '').trim().toLowerCase() === username.toLowerCase());
    const today = getTodayStr();

    if (index >= 0) {
      merged[index] = {
        ...merged[index],
        username,
        password,
        updatedAt: today
      };
      return;
    }

    merged.push({
      username,
      password,
      createdAt: today,
      updatedAt: today
    });
  });

  return normalizeLoginUsers(merged);
};

const saveLoginUsers = (users, options = {}) => {
  const normalized = ensureRequiredLoginUsers(users);
  localStorage.setItem(LOGIN_USERS_STORAGE_KEY, JSON.stringify(normalized));
  if (options.syncRemote !== false && typeof window !== 'undefined' && window.app && typeof window.app.syncLoginUsersToFirebase === 'function') {
    void window.app.syncLoginUsersToFirebase(normalized);
  }
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

    users = saveLoginUsers(users, { syncRemote: false });

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
    this.currentTab = 'panil';
    this.localLoginUnlocked = false;
    this.financeViewFilter = 'all';
    this.financeViewMode = 'cliente';
    this.soundEnabled = true;
    this.voiceNarrationEnabled = false;
    this.voiceNarrationRecognition = null;
    this.voiceNarrationActive = false;
    this.reminderMinutes = 15;
    this.reminderIntensity = 'strong';
    this.agendaViewMode = 'calendar';
    this.agendaCalendarStartDate = getWeekStartMondayIso(getTodayStr());
    this.agendaHourRangeStart = AGENDA_HOUR_RANGE_DEFAULT_START;
    this.agendaHourRangeEnd = AGENDA_HOUR_RANGE_DEFAULT_END;
    this.loadAgendaHourRangePreference();
    this.topDateRangeUserSelected = false;
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
      despesas: 'dash-card-despesas',
      clientes: 'dash-card-clientes'
    };
    this.whatsAppConfirmTemplate = DEFAULT_WHATSAPP_CONFIRM_TEMPLATE;
    this.whatsAppBirthdayTemplate = DEFAULT_WHATSAPP_BIRTHDAY_TEMPLATE;
    this.whatsAppConfirmTemplates = [];
    this.whatsAppBirthdayTemplates = [];
    this.whatsAppSelectedConfirmTemplateId = '';
    this.whatsAppSelectedBirthdayTemplateId = '';
    this.paymentReceiptTemplate = DEFAULT_PAYMENT_RECEIPT_TEMPLATE;
    this.paymentReceiptProfile = { ...DEFAULT_PAYMENT_RECEIPT_PROFILE };
    this.paymentReceiptLogoDataUrl = '';
    this.paymentReceiptLogoPromise = null;
    this.lastDashboardCardAction = '';
    this.lastDashboardCardActionAt = 0;
    this.lastAnamneseIndividualCepLookup = '';
    this.selectedClientReportIds = new Set();
    this.clientSortField = 'registrationNumber';
    this.clientSortDirection = 'asc';
    this.financeSortField = 'latestDate';
    this.financeSortDirection = 'desc';
    this.selectedFinanceReportClientIds = new Set();
    this.lastFinanceiroRows = [];
    this.reminderIntervalId = null;
    this.reminderNotifiedKeys = new Set();
    this.lastReminderAlertCount = 0;
    this.pendingNotificationRoute = null;
    this.agendaAttentionAppointmentId = '';
    this.agendaAttentionNeedsFocus = false;
    this.agendaAttentionTimerId = null;
    this.reminderCheckIntervalMs = 30000;
    this.firebaseSyncIntervalId = null;
    this.firebaseSyncIntervalMs = 45 * 1000;
    this.firebaseAutoReconnectLastAttemptAt = 0;
    this.firebaseSyncStatePollIntervalId = null;
    this.firebaseSyncStatePollTickMs = 3000;
    this.firebaseSyncStatePollIntervalMs = 12 * 1000;
    this.firebaseSyncStatePollFastIntervalMs = 3000;
    this.firebaseSyncStatePollFastUntil = 0;
    this.firebaseSyncStatePollLastRunAt = 0;
    this.firebaseSyncRealtimeUnsubscribe = null;
    this.firebaseCollectionRealtimeUnsubscribes = [];
    this.firebaseRealtimeSyncTimerId = null;
    this.firebaseRealtimeSyncDelayMs = 120;
    this.firebaseRealtimeRecoverTimerId = null;
    this.firebaseSettingsApplied = false;
    this.firebasePushInFlight = false;
    this.firebasePushQueued = false;
    this.firebasePushRetryTimerId = null;
    this.firebasePushWatchdogTimerId = null;
    this.firebasePushWatchdogMs = 22000;
    this.firebasePushAttemptSeq = 0;
    this.firebasePushActiveAttemptId = 0;
    this.firebasePushShadowState = this.loadFirebasePushShadowState();
    this.googleCalendarClientId = '';
    this.googleCalendarTokenClient = null;
    this.googleCalendarReady = false;
    this.googleCalendarAuthorized = false;
    this.googleCalendarAccessToken = '';
    this.googleCalendarApiReady = false;
    this.googleCalendarAutoSyncIntervalId = null;
    this.googleCalendarAutoSyncEveryMs = 6 * 60 * 60 * 1000;
    this.googleCalendarAutoSyncInFlight = false;
    this.googleCalendarRateLimitUntil = 0;
    this.syncAuditLogLimit = 18;
    this.syncAuditEvents = [];
    this.deletedAppointmentTombstones = {};
    this.clientCategories = DEFAULT_CLIENT_CATEGORIES.slice();
    this.expenseCategories = DEFAULT_EXPENSE_CATEGORIES.slice();
    this.convenioOptions = CLIENT_MANAGED_LISTS.convenio.defaults.slice();
    this.planoFinanceiroOptions = CLIENT_MANAGED_LISTS.planoFinanceiro.defaults.slice();
    this.clientTagsOptions = CLIENT_MANAGED_LISTS.tags.defaults.slice();
    this.firebaseDeviceId = this.getOrCreateFirebaseDeviceId();
    this.lastRealtimeSyncMillis = 0;
    this.lastRemoteStateSeenMillis = 0;
    this.versionInfo = { dateKey: getTodayStr(), seq: 0, label: 'v00.00/000000' };
    this.updateReady = false;
    this.landscapeSidebarCollapsed = false;
    this.agendaQuickMenuElement = null;
    this.agendaQuickMenuOutsideHandler = null;
    this.agendaQuickMenuEscapeHandler = null;
    this.agendaRowLongPressTimerId = null;
    this.firebaseQuotaNoticeCooldownMs = 45 * 1000;
    this.lastFirebaseQuotaNoticeAt = 0;
    this.loadStore();
    this.loadWhatsAppTemplates();
    this.loadPaymentReceiptTemplate();
    this.loadPaymentReceiptProfile();
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
    } else if (currentTab === 'panil') {
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
      const categories = JSON.parse(localStorage.getItem(CLIENT_CATEGORIES_STORAGE_KEY) || '[]');
      const expenseCategories = JSON.parse(localStorage.getItem(EXPENSE_CATEGORIES_STORAGE_KEY) || '[]');
      const t = JSON.parse(localStorage.getItem(APPOINTMENT_DELETE_TOMBSTONES_STORAGE_KEY) || '{}');
      this.clients = Array.isArray(c) ? c : [];
      this.appointments = this.normalizeAppointmentsCollection(Array.isArray(a) ? a : [], 'local-store');
      this.expenses = Array.isArray(e) ? e : [];
      this.clientCategories = Array.isArray(categories) ? categories.filter((item) => String(item || '').trim()) : [];
      this.expenseCategories = Array.isArray(expenseCategories) ? expenseCategories.filter((item) => String(item || '').trim()) : [];
      this.clientGroups = Array.isArray(g) ? g.filter((item) => String(item || '').trim()) : [];
      this.deletedAppointmentTombstones = (t && typeof t === 'object' && !Array.isArray(t)) ? t : {};
      this.loadManagedListsFromStorage();
      this.clients = this.clients.map((client) => ({
        ...client,
        category: this.normalizeClientCategory(client && client.category)
      }));
      this.pruneDeletedAppointmentTombstones();
      this.applyStableDataOrdering();
      if (!this.clientGroups.length) {
        this.clientGroups = this.collectClientGroupsFromClients();
      }
      if (!this.clientCategories.length) {
        this.clientCategories = this.collectClientCategoriesFromClients();
      }
      this.expenseCategories = this.collectExpenseCategoriesFromExpenses();
      const reconciled = this.reconcileAppointmentsClientLinks();
      if (reconciled) this.saveStore();
    } catch (err) {
      console.log('Falha ao carregar dados locais:', err);
      this.clients = [];
      this.appointments = [];
      this.expenses = [];
      this.clientGroups = [];
      this.clientCategories = DEFAULT_CLIENT_CATEGORIES.slice();
      this.expenseCategories = DEFAULT_EXPENSE_CATEGORIES.slice();
      this.deletedAppointmentTombstones = {};
    }
  }

  async seedStoreFromBackupIfEmpty() {
    try {
      const response = await fetch(LOCAL_BACKUP_DATA_URL, { cache: 'no-store' });
      if (!response.ok) return false;

      const backup = await response.json();
      const backupClients = Array.isArray(backup.clients) ? backup.clients : [];
      const backupAppointments = Array.isArray(backup.appointments) ? backup.appointments : [];
      const backupExpenses = Array.isArray(backup.expenses) ? backup.expenses : [];

      const loadedCollections = [];

      if (!this.clients.length && backupClients.length) {
        this.clients = backupClients;
        loadedCollections.push('clients');
      }

      if (!this.appointments.length && backupAppointments.length) {
        this.appointments = this.normalizeAppointmentsCollection(backupAppointments, 'backup-seed');
        loadedCollections.push('appointments');
      }

      if (!this.expenses.length && backupExpenses.length) {
        this.expenses = backupExpenses;
        loadedCollections.push('expenses');
      }

      if (!loadedCollections.length) return false;

      this.clientGroups = this.collectClientGroupsFromClients();
      this.clientCategories = this.collectClientCategoriesFromClients();
      this.expenseCategories = this.collectExpenseCategoriesFromExpenses();
      this.applyStableDataOrdering();
      this.reconcileAppointmentsClientLinks();

      if (loadedCollections.includes('appointments') && this.appointments.length) {
        const dates = this.appointments
          .map((item) => String(item && item.date || '').trim())
          .filter((date) => /^\d{4}-\d{2}-\d{2}$/.test(date))
          .sort();
        const { start: startDate, end: endDate } = getCurrentMonthRange();
        const topStart = document.getElementById('top-date-start');
        const topEnd = document.getElementById('top-date-end');
        const agendaStart = document.getElementById('agenda-filter-start');
        const agendaEnd = document.getElementById('agenda-filter-end');
        this.agendaCalendarStartDate = getWeekStartMondayIso(startDate);
        if (topStart) topStart.value = this.formatTopDateForInput(startDate);
        if (topEnd) topEnd.value = this.formatTopDateForInput(endDate);
        if (agendaStart) agendaStart.value = this.formatAgendaDateForInput(startDate);
        if (agendaEnd) agendaEnd.value = this.formatAgendaDateForInput(endDate);
      }

      this.saveStore();
      this.rebuildFirebasePushShadowFromCurrentState();
      this.showToast('Backup local carregado para restaurar dados faltantes.', 'success');
      this.logSyncAudit('info', `Backup local aplicado na inicialização para: ${loadedCollections.join(', ')}.`);
      return true;
    } catch (err) {
      console.log('Falha ao carregar backup local:', err);
      return false;
    }
  }

  restoreAgendaFiltersForLoadedAppointments() {
    if (!Array.isArray(this.appointments) || !this.appointments.length) return false;
    if (this.topDateRangeUserSelected) return false;

    const agendaStart = document.getElementById('agenda-filter-start');
    const agendaEnd = document.getElementById('agenda-filter-end');
    const topStart = document.getElementById('top-date-start');
    const topEnd = document.getElementById('top-date-end');

    const currentStart = this.normalizeAgendaDateToIso((agendaStart || {}).value || '');
    const currentEnd = this.normalizeAgendaDateToIso((agendaEnd || {}).value || '');
    if (currentStart && currentEnd) return false;
    const visibleAppointments = this.appointments.filter((item) => {
      const date = String(item && item.date || '').trim();
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
      if (currentStart && date < currentStart) return false;
      if (currentEnd && date > currentEnd) return false;
      return true;
    });

    if (visibleAppointments.length) return false;

    const dates = this.appointments
      .map((item) => String(item && item.date || '').trim())
      .filter((date) => /^\d{4}-\d{2}-\d{2}$/.test(date))
      .sort();

    if (!dates.length) return false;

    const startDate = dates[0];
    const endDate = dates[dates.length - 1];
    this.agendaCalendarStartDate = getWeekStartMondayIso(startDate);
    if (topStart) topStart.value = this.formatTopDateForInput(startDate);
    if (topEnd) topEnd.value = this.formatTopDateForInput(endDate);
    if (agendaStart) agendaStart.value = this.formatAgendaDateForInput(startDate);
    if (agendaEnd) agendaEnd.value = this.formatAgendaDateForInput(endDate);
    return true;
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
    const label = APP_RELEASE_VERSION;

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
      el.setAttribute('title', 'Versão da release do sistema (atualiza somente em novo deploy).');
    }
  }

  setUpdateReady(isReady) {
    this.updateReady = Boolean(isReady);
    this.renderVersionBadge();
  }

  getCurrentLoginUsername() {
    const creds = getLoginCredentials();
    return String((creds && creds.username) || '').trim();
  }

  isMasterConfigUser(username = '') {
    return String(username || '').trim().toLowerCase() === String(MASTER_CONFIG_USERNAME || '').trim().toLowerCase();
  }

  canCurrentUserAccessConfig() {
    return this.isMasterConfigUser(this.getCurrentLoginUsername());
  }

  applyConfigAccessControl() {
    const canAccessConfig = this.canCurrentUserAccessConfig();

    document.querySelectorAll('.sidebar-nav .nav-item[data-tab="config"]').forEach((btn) => {
      btn.style.display = canAccessConfig ? 'inline-flex' : 'none';
      btn.setAttribute('aria-hidden', canAccessConfig ? 'false' : 'true');
      btn.setAttribute('aria-disabled', canAccessConfig ? 'false' : 'true');
    });

    return canAccessConfig;
  }

  shouldForceReleaseRefresh() {
    try {
      return localStorage.getItem(APP_RELEASE_SEEN_STORAGE_KEY) !== APP_RELEASE_VERSION;
    } catch (err) {
      return false;
    }
  }

  markReleaseRefreshSeen() {
    try {
      localStorage.setItem(APP_RELEASE_SEEN_STORAGE_KEY, APP_RELEASE_VERSION);
    } catch (err) {
      console.log('Falha ao registrar release ativa:', err);
    }
  }

  saveStore() {
    localStorage.setItem('consultorio_clients', JSON.stringify(this.clients));
    localStorage.setItem('consultorio_appointments', JSON.stringify(this.appointments));
    localStorage.setItem('consultorio_expenses', JSON.stringify(this.expenses));
    localStorage.setItem(CLIENT_GROUPS_STORAGE_KEY, JSON.stringify(this.clientGroups));
    localStorage.setItem(CLIENT_CATEGORIES_STORAGE_KEY, JSON.stringify(this.clientCategories));
    localStorage.setItem(EXPENSE_CATEGORIES_STORAGE_KEY, JSON.stringify(this.expenseCategories));
    localStorage.setItem(APPOINTMENT_DELETE_TOMBSTONES_STORAGE_KEY, JSON.stringify(this.deletedAppointmentTombstones || {}));
    this.saveManagedListsToStorage();
  }

  pruneDeletedAppointmentTombstones(ttlMs = 6 * 60 * 60 * 1000) {
    const now = Date.now();
    const tombstones = this.deletedAppointmentTombstones && typeof this.deletedAppointmentTombstones === 'object'
      ? this.deletedAppointmentTombstones
      : {};

    let changed = false;
    Object.keys(tombstones).forEach((id) => {
      const at = Number(tombstones[id] || 0);
      if (!at || (now - at) > ttlMs) {
        delete tombstones[id];
        changed = true;
      }
    });

    this.deletedAppointmentTombstones = tombstones;
    return changed;
  }

  registerAppointmentDeletionTombstone(appointmentId) {
    const id = String(appointmentId || '').trim();
    if (!id) return;
    this.pruneDeletedAppointmentTombstones();
    this.deletedAppointmentTombstones[id] = Date.now();
    this.saveStore();
  }

  clearAppointmentDeletionTombstone(appointmentId) {
    const id = String(appointmentId || '').trim();
    if (!id) return;
    if (!this.deletedAppointmentTombstones || typeof this.deletedAppointmentTombstones !== 'object') return;
    if (!this.deletedAppointmentTombstones[id]) return;
    delete this.deletedAppointmentTombstones[id];
    this.saveStore();
  }

  filterRemoteAppointmentsByTombstones(remoteAppointments) {
    const source = Array.isArray(remoteAppointments) ? remoteAppointments : [];
    this.pruneDeletedAppointmentTombstones();
    const tombstones = this.deletedAppointmentTombstones || {};
    const blockedIds = [];

    const filtered = source.filter((item) => {
      const id = String((item && item.id) || '').trim();
      if (!id) return true;
      if (!tombstones[id]) return true;
      blockedIds.push(id);
      return false;
    });

    return { filtered, blockedIds };
  }

  sortAppointmentsStable(items = []) {
    const source = Array.isArray(items) ? items.slice() : [];
    return source.sort((a, b) => {
      const aStamp = `${String((a && a.date) || '')} ${String((a && a.time) || '')}`.trim();
      const bStamp = `${String((b && b.date) || '')} ${String((b && b.time) || '')}`.trim();
      const byStamp = aStamp.localeCompare(bStamp);
      if (byStamp !== 0) return byStamp;
      const aClient = String((a && a.clientName) || '').trim();
      const bClient = String((b && b.clientName) || '').trim();
      const byClient = aClient.localeCompare(bClient);
      if (byClient !== 0) return byClient;
      return String((a && a.id) || '').localeCompare(String((b && b.id) || ''));
    });
  }

  sortClientsStable(items = []) {
    const source = Array.isArray(items) ? items.slice() : [];
    return source.sort((a, b) => {
      const aReg = Number((a && a.registrationNumber) || 0);
      const bReg = Number((b && b.registrationNumber) || 0);
      if (aReg !== bReg) return aReg - bReg;
      const byName = String((a && a.name) || '').localeCompare(String((b && b.name) || ''));
      if (byName !== 0) return byName;
      return String((a && a.id) || '').localeCompare(String((b && b.id) || ''));
    });
  }

  sortExpensesStable(items = []) {
    const source = Array.isArray(items) ? items.slice() : [];
    return source.sort((a, b) => {
      const byDate = String((b && b.date) || '').localeCompare(String((a && a.date) || ''));
      if (byDate !== 0) return byDate;
      return String((a && a.id) || '').localeCompare(String((b && b.id) || ''));
    });
  }

  applyStableDataOrdering() {
    this.clients = this.sortClientsStable(this.clients);
    this.appointments = this.sortAppointmentsStable(this.appointments);
    this.expenses = this.sortExpensesStable(this.expenses);
  }

  async enforceAppointmentDeletesInFirebase(appointmentIds = []) {
    if (!this.firebaseDb) return;
    const ids = Array.from(new Set((Array.isArray(appointmentIds) ? appointmentIds : [])
      .map((id) => String(id || '').trim())
      .filter(Boolean)));
    if (!ids.length) return;

    const batch = this.firebaseDb.batch();
    ids.forEach((id) => {
      const ref = this.firebaseDb.collection('appointments').doc(id);
      batch.delete(ref);
    });

    await batch.commit();
  }

  async deleteAppointmentInFirebaseNow(appointmentId) {
    if (!this.firebaseConnected || !this.firebaseDb) return false;

    const id = String(appointmentId || '').trim();
    if (!id) return false;

    try {
      await this.firebaseDb.collection('appointments').doc(id).delete();
      await this.updateRemoteSyncState();
      this.setLocalLastPushMillis(Date.now());
      this.logSyncAudit('push', `Exclusão remota imediata aplicada para consulta ${id}.`);
      return true;
    } catch (err) {
      this.logSyncAudit('error', `Falha na exclusão remota imediata (${id}): ${String((err && (err.code || err.message)) || 'erro desconhecido')}`);
      return false;
    }
  }

  saveData() {
    this.applyStableDataOrdering();
    this.saveStore();
    this.bumpVersion();
    this.updateCloudSyncMeta();
    this.setFirebaseSyncDirty(true);
    this.boostFirebaseSyncPolling(22000, 'alteracao-local');

    this.requestFirebasePushSync();
  }

  requestFirebasePushSync() {
    if (!this.firebaseConnected || !this.firebaseDb) return;

    if (this.firebasePushRetryTimerId) {
      window.clearTimeout(this.firebasePushRetryTimerId);
      this.firebasePushRetryTimerId = null;
    }

    if (this.firebasePushInFlight) {
      this.firebasePushQueued = true;
      this.logSyncAudit('info', 'Push enfileirado (aguardando envio em andamento).');
      return;
    }

    const attemptId = this.nextFirebasePushAttemptId();
    this.firebasePushActiveAttemptId = attemptId;
    this.firebasePushInFlight = true;
    this.logSyncAudit('push', 'Push iniciado para enviar alterações locais.');
    this.startFirebasePushWatchdog(attemptId);
    void this.pushAllDataToFirebase()
      .then(() => {
        if (attemptId !== this.firebasePushActiveAttemptId) return;
        this.clearFirebasePushWatchdog();
        this.setFirebaseSyncDirty(false);
        this.logSyncAudit('push', 'Push concluído com sucesso.');
        this.boostFirebaseSyncPolling(18000, 'push-concluido');
        this.scheduleFirebaseRealtimePullSync('meta', Date.now());
      })
      .catch((err) => {
        if (attemptId !== this.firebasePushActiveAttemptId) return;
        this.clearFirebasePushWatchdog();
        console.log('Falha ao enviar dados para o Firebase:', err);
        this.setFirebaseSyncDirty(true);
        this.logSyncAudit('error', `Falha no push: ${String((err && (err.code || err.message)) || 'erro desconhecido')}`);
        const quotaPaused = this.notifyFirebaseQuotaPause(err, 'push');
        const retryDelayMs = quotaPaused ? 20000 : 1200;

        // Retry quickly to avoid losing cross-device freshness after transient network issues.
        this.firebasePushRetryTimerId = window.setTimeout(() => {
          this.firebasePushRetryTimerId = null;
          this.logSyncAudit('warning', quotaPaused
            ? 'Repetindo push após espera por cota do Firebase.'
            : 'Repetindo push automático após falha de rede.');
          this.requestFirebasePushSync();
        }, retryDelayMs);
      })
      .finally(() => {
        if (attemptId !== this.firebasePushActiveAttemptId) return;
        this.firebasePushInFlight = false;
        if (this.firebasePushQueued) {
          this.firebasePushQueued = false;
          this.requestFirebasePushSync();
        }
      });
  }

  nextFirebasePushAttemptId() {
    this.firebasePushAttemptSeq = Number(this.firebasePushAttemptSeq || 0) + 1;
    return this.firebasePushAttemptSeq;
  }

  clearFirebasePushWatchdog() {
    if (this.firebasePushWatchdogTimerId) {
      window.clearTimeout(this.firebasePushWatchdogTimerId);
      this.firebasePushWatchdogTimerId = null;
    }
  }

  startFirebasePushWatchdog(attemptId) {
    this.clearFirebasePushWatchdog();
    const timeoutMs = Math.max(8000, Number(this.firebasePushWatchdogMs) || 22000);
    this.firebasePushWatchdogTimerId = window.setTimeout(() => {
      this.firebasePushWatchdogTimerId = null;
      if (attemptId !== this.firebasePushActiveAttemptId) return;
      if (!this.firebasePushInFlight) return;

      this.logSyncAudit('warning', `Push demorou mais de ${Math.round(timeoutMs / 1000)}s; reenviando de forma automática.`);
      this.updateCloudSyncMeta('Push em atraso: tentando reenviar alterações...', 'local', {
        highlight: true
      });

      this.setFirebaseSyncDirty(true);
      this.firebasePushInFlight = false;
      this.firebasePushQueued = false;
      this.firebasePushActiveAttemptId = 0;
      this.requestFirebasePushSync();
    }, timeoutMs);
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

  logSyncAudit(kind, message, extra = {}) {
    const entry = {
      at: Date.now(),
      kind: String(kind || 'info'),
      message: String(message || '').trim() || 'Evento de sincronização',
      extra: extra && typeof extra === 'object' ? extra : {}
    };

    this.syncAuditEvents.unshift(entry);
    if (this.syncAuditEvents.length > this.syncAuditLogLimit) {
      this.syncAuditEvents = this.syncAuditEvents.slice(0, this.syncAuditLogLimit);
    }

    this.renderSyncAuditPanel();
  }

  renderSyncAuditPanel() {
    const panel = document.getElementById('sync-audit-panel');
    if (!panel) return;

    if (!Array.isArray(this.syncAuditEvents) || !this.syncAuditEvents.length) {
      panel.innerHTML = '<p class="sync-audit-empty">Sem eventos ainda. Execute uma ação para registrar push/pull.</p>';
      return;
    }

    const kindLabel = {
      push: 'Push',
      pull: 'Pull',
      realtime: 'Realtime',
      warning: 'Aviso',
      error: 'Erro',
      info: 'Info'
    };

    const rows = this.syncAuditEvents.map((entry) => {
      const when = new Date(Number(entry.at) || Date.now()).toLocaleTimeString('pt-BR');
      const label = kindLabel[entry.kind] || 'Info';
      const css = `sync-audit-kind sync-audit-${safeText(entry.kind)}`;
      const uid = this.firebaseAuthUid ? `uid:${safeText(String(this.firebaseAuthUid).slice(0, 8))}` : 'uid:-';
      const device = this.firebaseDeviceId ? `dev:${safeText(String(this.firebaseDeviceId).slice(-6))}` : 'dev:-';
      return `
        <li class="sync-audit-item">
          <span class="sync-audit-time">${safeText(when)}</span>
          <span class="${css}">${safeText(label)}</span>
          <span class="sync-audit-message">${safeText(entry.message)}</span>
          <span class="sync-audit-meta">${uid} ${device}</span>
        </li>
      `;
    }).join('');

    panel.innerHTML = `<ul class="sync-audit-list">${rows}</ul>`;
  }

  async exportSyncAuditLog() {
    try {
      const now = new Date();
      const remoteState = await this.getRemoteSyncState();
      const lines = [];

      lines.push('CONSULTORIO CONTROL - LOG DE SINCRONIZACAO');
      lines.push(`Gerado em: ${now.toLocaleString('pt-BR')}`);
      lines.push(`Dispositivo: ${this.firebaseDeviceId || '-'}`);
      lines.push(`UID Firebase: ${this.firebaseAuthUid || '-'}`);
      lines.push(`Firebase conectado: ${this.firebaseConnected ? 'sim' : 'nao'}`);
      lines.push(`Dirty local: ${this.isFirebaseSyncDirty() ? 'sim' : 'nao'}`);
      lines.push(`Ultimo push local (ms): ${this.getLocalLastPushMillis()}`);
      lines.push(`Remote updatedAtMillis: ${Number((remoteState && remoteState.updatedAtMillis) || 0)}`);
      lines.push(`Remote updatedByDeviceId: ${String((remoteState && remoteState.updatedByDeviceId) || '-')}`);
      lines.push('');
      lines.push('EVENTOS:');

      if (!Array.isArray(this.syncAuditEvents) || !this.syncAuditEvents.length) {
        lines.push('- Sem eventos registrados.');
      } else {
        this.syncAuditEvents
          .slice()
          .reverse()
          .forEach((entry) => {
            const time = new Date(Number(entry.at) || Date.now()).toLocaleString('pt-BR');
            const kind = String(entry.kind || 'info').toUpperCase();
            const message = String(entry.message || '').trim() || '-';
            lines.push(`[${time}] [${kind}] ${message}`);
          });
      }

      const content = `${lines.join('\n')}\n`;
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const fileName = `sync-audit-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}.txt`;

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      this.showToast('Log de sincronização exportado com sucesso.', 'success');
      this.logSyncAudit('info', 'Log de sincronização exportado.');
    } catch (err) {
      this.showToast('Falha ao exportar o log de sincronização.', 'warning');
      this.logSyncAudit('error', `Falha ao exportar log: ${String((err && (err.code || err.message)) || 'erro desconhecido')}`);
    }
  }

  buildSyncDiagnosticReport() {
    const now = new Date();
    const recentEvents = Array.isArray(this.syncAuditEvents) ? this.syncAuditEvents.slice(0, 20) : [];
    const lines = [];

    lines.push('DIAGNOSTICO DE SINCRONIZACAO - CONSULTORIO CONTROL');
    lines.push(`Gerado em: ${now.toLocaleString('pt-BR')}`);
    lines.push(`Pagina: ${window.location.href}`);
    lines.push(`Firebase conectado: ${this.firebaseConnected ? 'sim' : 'nao'}`);
    lines.push(`UID: ${this.firebaseAuthUid || '-'}`);
    lines.push(`DeviceId: ${this.firebaseDeviceId || '-'}`);
    lines.push(`Dirty local: ${this.isFirebaseSyncDirty() ? 'sim' : 'nao'}`);
    lines.push(`Ultimo erro Firebase (code): ${this.firebaseLastErrorCode || '-'}`);
    lines.push(`Ultimo erro Firebase (message): ${this.firebaseLastErrorMessage || '-'}`);
    lines.push(`Clientes locais: ${Array.isArray(this.clients) ? this.clients.length : 0}`);
    lines.push(`Consultas locais: ${Array.isArray(this.appointments) ? this.appointments.length : 0}`);
    lines.push(`Despesas locais: ${Array.isArray(this.expenses) ? this.expenses.length : 0}`);
    lines.push(`Tombstones de exclusao (consultas): ${Object.keys(this.deletedAppointmentTombstones || {}).length}`);
    lines.push('');
    lines.push('ULTIMOS EVENTOS:');

    if (!recentEvents.length) {
      lines.push('- Sem eventos registrados.');
    } else {
      recentEvents.slice().reverse().forEach((entry) => {
        const at = new Date(Number(entry.at) || Date.now()).toLocaleString('pt-BR');
        const kind = String(entry.kind || 'info').toUpperCase();
        const msg = String(entry.message || '').trim() || '-';
        lines.push(`[${at}] [${kind}] ${msg}`);
      });
    }

    return `${lines.join('\n')}\n`;
  }

  async copySyncDiagnosticReport() {
    try {
      const report = this.buildSyncDiagnosticReport();
      if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        await navigator.clipboard.writeText(report);
      } else {
        const area = document.createElement('textarea');
        area.value = report;
        area.setAttribute('readonly', 'readonly');
        area.style.position = 'fixed';
        area.style.opacity = '0';
        document.body.appendChild(area);
        area.select();
        document.execCommand('copy');
        document.body.removeChild(area);
      }

      this.showToast('Diagnóstico copiado para a área de transferência.', 'success');
      this.logSyncAudit('info', 'Diagnóstico de sincronização copiado para compartilhamento.');
    } catch (err) {
      this.showToast('Falha ao copiar diagnóstico. Use Exportar Log Sync.', 'warning');
      this.logSyncAudit('error', `Falha ao copiar diagnóstico: ${String((err && (err.code || err.message)) || 'erro desconhecido')}`);
    }
  }

  getOrCreateFirebaseDeviceId() {
    try {
      const existing = String(localStorage.getItem(FIREBASE_DEVICE_ID_STORAGE_KEY) || '').trim();
      if (existing) return existing;
      const created = `device-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
      localStorage.setItem(FIREBASE_DEVICE_ID_STORAGE_KEY, created);
      return created;
    } catch (err) {
      return `device-${Date.now()}`;
    }
  }

  getLocalLastPushMillis() {
    try {
      const raw = Number(localStorage.getItem(FIREBASE_LAST_PUSH_MILLIS_STORAGE_KEY) || 0);
      return Number.isFinite(raw) ? Math.max(0, raw) : 0;
    } catch (err) {
      return 0;
    }
  }

  setLocalLastPushMillis(value) {
    try {
      const safe = Number.isFinite(Number(value)) ? Math.max(0, Number(value)) : Date.now();
      localStorage.setItem(FIREBASE_LAST_PUSH_MILLIS_STORAGE_KEY, String(safe));
    } catch (err) {
      console.log('Falha ao salvar o timestamp de push local:', err);
    }
  }

  getLocalSharedSettingsSignature() {
    try {
      return String(localStorage.getItem(SHARED_SETTINGS_SIGNATURE_STORAGE_KEY) || '').trim();
    } catch (err) {
      return '';
    }
  }

  setLocalSharedSettingsSignature(signature) {
    try {
      localStorage.setItem(SHARED_SETTINGS_SIGNATURE_STORAGE_KEY, String(signature || '').trim());
    } catch (err) {
      console.log('Falha ao salvar assinatura das configurações compartilhadas:', err);
    }
  }

  buildSharedSettingsComparable() {
    const firebaseConfig = normalizeFirebaseConfig(this.firebaseConfig || this.loadFirebaseConfig() || null);
    const googleCalendarClientId = this.normalizeGoogleCalendarClientId(this.loadGoogleCalendarClientId());

    return {
      firebaseConfig: firebaseConfig || null,
      googleCalendarClientId,
      soundEnabled: Boolean(this.soundEnabled),
      reminderMinutes: Math.max(1, Number(this.reminderMinutes) || 15),
      reminderIntensity: ['normal', 'strong', 'ultra'].includes(String(this.reminderIntensity || '').toLowerCase())
        ? String(this.reminderIntensity || '').toLowerCase()
        : 'strong'
    };
  }

  computeSharedSettingsSignatureFromComparable(comparable) {
    try {
      return JSON.stringify(this.normalizeValueForSyncSignature(comparable || {}));
    } catch (err) {
      return '';
    }
  }

  buildSharedSettingsSyncPayload() {
    const comparable = this.buildSharedSettingsComparable();
    return {
      ...comparable,
      updatedAt: (window.firebase && window.firebase.firestore && window.firebase.firestore.FieldValue)
        ? window.firebase.firestore.FieldValue.serverTimestamp()
        : new Date().toISOString(),
      updatedAtMillis: Date.now(),
      updatedByDeviceId: this.firebaseDeviceId || this.getOrCreateFirebaseDeviceId(),
      updatedByUid: String(this.firebaseAuthUid || '').trim()
    };
  }

  applySharedSettingsFromRemote(payload = {}) {
    if (!payload || typeof payload !== 'object') return false;

    const comparable = {
      firebaseConfig: normalizeFirebaseConfig(payload.firebaseConfig || null) || null,
      googleCalendarClientId: this.normalizeGoogleCalendarClientId(payload.googleCalendarClientId),
      soundEnabled: payload.soundEnabled == null ? this.soundEnabled : Boolean(payload.soundEnabled),
      reminderMinutes: Math.max(1, Number(payload.reminderMinutes) || 15),
      reminderIntensity: ['normal', 'strong', 'ultra'].includes(String(payload.reminderIntensity || '').toLowerCase())
        ? String(payload.reminderIntensity || '').toLowerCase()
        : 'strong'
    };

    const remoteSignature = this.computeSharedSettingsSignatureFromComparable(comparable);
    if (!remoteSignature) return false;
    if (remoteSignature === this.getLocalSharedSettingsSignature()) return false;

    try {
      if (comparable.firebaseConfig) {
        localStorage.setItem(FIREBASE_CONFIG_STORAGE_KEY, JSON.stringify(comparable.firebaseConfig));
      }

      if (comparable.googleCalendarClientId) {
        localStorage.setItem(GOOGLE_CALENDAR_CLIENT_ID_STORAGE_KEY, comparable.googleCalendarClientId);
      } else {
        localStorage.removeItem(GOOGLE_CALENDAR_CLIENT_ID_STORAGE_KEY);
      }

      this.firebaseConfig = comparable.firebaseConfig;
      this.googleCalendarClientId = comparable.googleCalendarClientId;
      this.soundEnabled = comparable.soundEnabled;
      this.reminderMinutes = comparable.reminderMinutes;
      this.reminderIntensity = comparable.reminderIntensity;
      this.saveSoundSettings({ skipSync: true });

      const firebaseInput = document.getElementById('cfg-firebase-json');
      if (firebaseInput && comparable.firebaseConfig) {
        firebaseInput.value = JSON.stringify(comparable.firebaseConfig, null, 2);
      }

      const googleInput = document.getElementById('cfg-google-calendar-client-id');
      if (googleInput) {
        googleInput.value = comparable.googleCalendarClientId || '';
      }

      this.updateSoundControlsUI();
      this.updateGoogleCalendarStatus(this.googleCalendarAuthorized ? 'ok' : (this.googleCalendarClientId ? 'ready' : 'offline'));
      this.setLocalSharedSettingsSignature(remoteSignature);
      return true;
    } catch (err) {
      console.log('Falha ao aplicar configurações compartilhadas remotas:', err);
      return false;
    }
  }

  markSharedSettingsDirty(reason = 'config-update') {
    this.setFirebaseSyncDirty(true);
    this.boostFirebaseSyncPolling(26000, reason);
    this.requestFirebasePushSync();
  }

  createEmptyFirebasePushShadowState() {
    return {
      [LOGIN_USERS_FIRESTORE_COLLECTION]: {},
      clients: {},
      appointments: {},
      expenses: {}
    };
  }

  loadFirebasePushShadowState() {
    const fallback = this.createEmptyFirebasePushShadowState();
    try {
      const raw = JSON.parse(localStorage.getItem(FIREBASE_PUSH_SHADOW_STORAGE_KEY) || '{}');
      if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return fallback;

      return {
        [LOGIN_USERS_FIRESTORE_COLLECTION]: (raw[LOGIN_USERS_FIRESTORE_COLLECTION] && typeof raw[LOGIN_USERS_FIRESTORE_COLLECTION] === 'object' && !Array.isArray(raw[LOGIN_USERS_FIRESTORE_COLLECTION])) ? raw[LOGIN_USERS_FIRESTORE_COLLECTION] : {},
        clients: (raw.clients && typeof raw.clients === 'object' && !Array.isArray(raw.clients)) ? raw.clients : {},
        appointments: (raw.appointments && typeof raw.appointments === 'object' && !Array.isArray(raw.appointments)) ? raw.appointments : {},
        expenses: (raw.expenses && typeof raw.expenses === 'object' && !Array.isArray(raw.expenses)) ? raw.expenses : {}
      };
    } catch (err) {
      return fallback;
    }
  }

  saveFirebasePushShadowState() {
    try {
      localStorage.setItem(FIREBASE_PUSH_SHADOW_STORAGE_KEY, JSON.stringify(this.firebasePushShadowState || this.createEmptyFirebasePushShadowState()));
    } catch (err) {
      console.log('Falha ao salvar estado incremental do push:', err);
    }
  }

  normalizeValueForSyncSignature(value) {
    if (Array.isArray(value)) {
      return value.map((item) => this.normalizeValueForSyncSignature(item));
    }

    if (value && typeof value === 'object') {
      if (value instanceof Date) return value.toISOString();
      const keys = Object.keys(value).sort();
      const output = {};
      keys.forEach((key) => {
        output[key] = this.normalizeValueForSyncSignature(value[key]);
      });
      return output;
    }

    return value;
  }

  computeSyncDocSignature(docData) {
    try {
      return JSON.stringify(this.normalizeValueForSyncSignature(docData));
    } catch (err) {
      return String(Date.now());
    }
  }

  collectCurrentFirebaseDocsForPush() {
    const map = {
      [LOGIN_USERS_FIRESTORE_COLLECTION]: new Map(),
      clients: new Map(),
      appointments: new Map(),
      expenses: new Map()
    };

    getLoginUsers().forEach((user) => {
      if (!user || !user.username) return;
      const id = this.buildLoginUserDocId(user.username);
      map[LOGIN_USERS_FIRESTORE_COLLECTION].set(id, {
        username: String(user.username || '').trim(),
        password: String(user.password || ''),
        createdAt: user.createdAt || getTodayStr(),
        updatedAt: user.updatedAt || getTodayStr()
      });
    });

    this.clients.forEach((client) => {
      const id = String((client && client.id) || '').trim();
      if (!id) return;
      map.clients.set(id, client);
    });

    this.appointments.forEach((appt) => {
      const id = String((appt && appt.id) || '').trim();
      if (!id) return;
      map.appointments.set(id, appt);
    });

    this.expenses.forEach((expense) => {
      const id = String((expense && expense.id) || '').trim();
      if (!id) return;
      map.expenses.set(id, expense);
    });

    return map;
  }

  rebuildFirebasePushShadowFromCurrentState() {
    const docsByCollection = this.collectCurrentFirebaseDocsForPush();
    const nextState = this.createEmptyFirebasePushShadowState();

    [LOGIN_USERS_FIRESTORE_COLLECTION, 'clients', 'appointments', 'expenses'].forEach((collectionName) => {
      docsByCollection[collectionName].forEach((data, id) => {
        nextState[collectionName][id] = this.computeSyncDocSignature(data);
      });
    });

    this.firebasePushShadowState = nextState;
    this.saveFirebasePushShadowState();
  }

  parseFirebaseTimeToMillis(value) {
    if (!value) return 0;

    if (typeof value === 'string') {
      const normalized = value.trim();
      if (!normalized) return 0;
      const asDate = new Date(normalized);
      return Number.isNaN(asDate.getTime()) ? 0 : asDate.getTime();
    }

    if (value instanceof Date) {
      return Number.isNaN(value.getTime()) ? 0 : value.getTime();
    }

    if (typeof value.toDate === 'function') {
      const dateValue = value.toDate();
      return dateValue instanceof Date && !Number.isNaN(dateValue.getTime()) ? dateValue.getTime() : 0;
    }

    if (typeof value.seconds === 'number') {
      const milliseconds = (Number(value.seconds) * 1000) + Math.floor(Number(value.nanoseconds || 0) / 1e6);
      return Number.isFinite(milliseconds) ? milliseconds : 0;
    }

    return 0;
  }

  async getRemoteSyncState() {
    if (!this.firebaseDb) return null;

    try {
      const doc = await this.firebaseDb.collection('app_meta').doc('sync_state').get();
      if (!doc || !doc.exists) return null;
      const data = doc.data ? doc.data() : {};
      const updatedAtMillis = this.parseFirebaseTimeToMillis(data.updatedAt) || Number(data.updatedAtMillis || 0);

      return {
        updatedAtMillis: Number.isFinite(updatedAtMillis) ? Math.max(0, updatedAtMillis) : 0,
        updatedByDeviceId: String(data.updatedByDeviceId || '').trim(),
        updatedByUid: String(data.updatedByUid || '').trim()
      };
    } catch (err) {
      console.log('Falha ao ler estado de sincronização remota:', err);
      return null;
    }
  }

  async updateRemoteSyncState() {
    if (!this.firebaseDb) return;

    const nowMillis = Date.now();
    const payload = {
      updatedAt: (window.firebase && window.firebase.firestore && window.firebase.firestore.FieldValue)
        ? window.firebase.firestore.FieldValue.serverTimestamp()
        : new Date(nowMillis).toISOString(),
      updatedAtMillis: nowMillis,
      updatedByDeviceId: this.firebaseDeviceId || this.getOrCreateFirebaseDeviceId(),
      updatedByUid: String(this.firebaseAuthUid || '').trim()
    };

    await this.firebaseDb.collection('app_meta').doc('sync_state').set(payload, { merge: true });
    this.lastRemoteStateSeenMillis = Math.max(Number(this.lastRemoteStateSeenMillis || 0), nowMillis);
  }

  startFirebaseRealtimeSyncWatcher() {
    if (!this.firebaseDb || !this.firebaseConnected) return;

    if (this.firebaseSyncRealtimeUnsubscribe) {
      this.firebaseSyncRealtimeUnsubscribe();
      this.firebaseSyncRealtimeUnsubscribe = null;
    }

    this.firebaseSyncRealtimeUnsubscribe = this.firebaseDb
      .collection('app_meta')
      .doc('sync_state')
      .onSnapshot((doc) => {
        if (!doc || !doc.exists) return;

        const data = doc.data ? doc.data() : {};
        const updatedByDeviceId = String(data.updatedByDeviceId || '').trim();
        if (updatedByDeviceId && updatedByDeviceId === this.firebaseDeviceId) return;

        const remoteMillis = this.parseFirebaseTimeToMillis(data.updatedAt) || Number(data.updatedAtMillis || 0);
        if (!remoteMillis || remoteMillis <= this.lastRealtimeSyncMillis) return;

        this.lastRealtimeSyncMillis = remoteMillis;
        this.lastRemoteStateSeenMillis = Math.max(Number(this.lastRemoteStateSeenMillis || 0), remoteMillis);
        this.logSyncAudit('realtime', 'Alteração remota detectada via metadata.');
        this.boostFirebaseSyncPolling(18000, 'realtime-meta');
        this.scheduleFirebaseRealtimePullSync('meta', remoteMillis);
      }, (err) => {
        console.log('Falha no listener de sincronização em tempo real:', err);
        this.logSyncAudit('error', `Falha no listener metadata: ${String((err && (err.code || err.message)) || 'erro desconhecido')}`);
        if (this.isRecoverableFirebaseNetworkError(err)) {
          this.scheduleFirebaseRealtimeRecovery('metadata-listener');
        }
      });
  }

  stopFirebaseCollectionRealtimeWatchers() {
    if (this.firebaseRealtimeSyncTimerId) {
      window.clearTimeout(this.firebaseRealtimeSyncTimerId);
      this.firebaseRealtimeSyncTimerId = null;
    }

    if (!Array.isArray(this.firebaseCollectionRealtimeUnsubscribes)) {
      this.firebaseCollectionRealtimeUnsubscribes = [];
      return;
    }

    this.firebaseCollectionRealtimeUnsubscribes.forEach((unsubscribe) => {
      if (typeof unsubscribe === 'function') unsubscribe();
    });
    this.firebaseCollectionRealtimeUnsubscribes = [];
  }

  scheduleFirebaseRealtimePullSync(source = 'collection', remoteMillis = 0) {
    if (!this.firebaseConnected || !this.firebaseDb) return;

    if (this.firebaseRealtimeSyncTimerId) {
      window.clearTimeout(this.firebaseRealtimeSyncTimerId);
      this.firebaseRealtimeSyncTimerId = null;
    }

    const baseDelay = Number(this.firebaseRealtimeSyncDelayMs) || 120;
    const delay = source === 'meta' ? 0 : Math.max(40, baseDelay);
    this.firebaseRealtimeSyncTimerId = window.setTimeout(() => {
      this.firebaseRealtimeSyncTimerId = null;
      if (!this.firebaseConnected || !this.firebaseDb) return;

      void this.syncDataWithFirebase({ skipDirtyPush: true, silent: true })
        .then((syncResult) => {
          if (syncResult && syncResult.deferred) {
            this.updateCloudSyncMeta('Sincronismo pendente: aguardando envio local', 'local');
            this.logSyncAudit('warning', 'Pull realtime adiado: envio local ainda não efetivado.');
            return;
          }
          if (source === 'meta') {
            this.showRemoteSyncIndicator(remoteMillis || Date.now());
            this.logSyncAudit('pull', 'Pull aplicado por alteração remota (metadata).');
            return;
          }
          this.updateCloudSyncMeta('Dados atualizados em tempo real', 'live');
          this.logSyncAudit('pull', 'Pull aplicado por alteração em coleção remota.');
        })
        .catch((err) => {
          console.log('Falha na sincronização automática em tempo real:', err);
          this.logSyncAudit('error', `Falha no pull automático: ${String((err && (err.code || err.message)) || 'erro desconhecido')}`);
        });
    }, delay);
  }

  startFirebaseCollectionRealtimeWatchers() {
    if (!this.firebaseDb || !this.firebaseConnected) return;

    this.stopFirebaseCollectionRealtimeWatchers();
    const collectionNames = [LOGIN_USERS_FIRESTORE_COLLECTION, 'clients', 'appointments', 'expenses'];
    const initializedCollections = new Set();

    collectionNames.forEach((collectionName) => {
      const unsubscribe = this.firebaseDb.collection(collectionName).onSnapshot((snapshot) => {
        if (!snapshot) return;

        if (!initializedCollections.has(collectionName)) {
          initializedCollections.add(collectionName);
          return;
        }

        if (snapshot.metadata && snapshot.metadata.hasPendingWrites) return;
        const hasRemoteChanges = snapshot.docChanges().some((change) => !(change.doc && change.doc.metadata && change.doc.metadata.hasPendingWrites));
        if (!hasRemoteChanges) return;

        this.logSyncAudit('realtime', `Alteração detectada na coleção ${collectionName}.`);
        this.scheduleFirebaseRealtimePullSync('collection', Date.now());
      }, (err) => {
        console.log(`Falha no listener da coleção ${collectionName}:`, err);
        this.logSyncAudit('error', `Falha no listener da coleção ${collectionName}: ${String((err && (err.code || err.message)) || 'erro desconhecido')}`);
        if (this.isRecoverableFirebaseNetworkError(err)) {
          this.scheduleFirebaseRealtimeRecovery(`collection-${collectionName}`);
        }
      });

      this.firebaseCollectionRealtimeUnsubscribes.push(unsubscribe);
    });
  }

  isRecoverableFirebaseNetworkError(err) {
    const code = String((err && err.code) || '').toLowerCase();
    const message = String((err && err.message) || err || '').toLowerCase();
    return code.includes('unavailable')
      || code.includes('aborted')
      || code.includes('deadline-exceeded')
      || message.includes('err_aborted')
      || message.includes('quic')
      || message.includes('network')
      || message.includes('transport');
  }

  scheduleFirebaseRealtimeRecovery(reason = 'network') {
    if (!this.firebaseConnected || !this.firebaseDb) return;
    if (this.firebaseRealtimeRecoverTimerId) return;

    this.logSyncAudit('warning', `Canal realtime instável (${reason}). Tentando recuperar...`);
    this.firebaseRealtimeRecoverTimerId = window.setTimeout(async () => {
      this.firebaseRealtimeRecoverTimerId = null;
      if (!this.firebaseConnected || !this.firebaseDb) return;

      try {
        await this.syncDataWithFirebase({ skipDirtyPush: true, silent: true });
        this.startFirebaseRealtimeSyncWatcher();
        this.startFirebaseCollectionRealtimeWatchers();
        this.logSyncAudit('realtime', 'Canal realtime recuperado automaticamente.');
      } catch (err) {
        const details = String((err && (err.code || err.message)) || 'erro desconhecido');
        this.logSyncAudit('error', `Falha ao recuperar canal realtime: ${details}`);
      }
    }, 2200);
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

  loadPaymentReceiptTemplate() {
    try {
      const raw = localStorage.getItem(PAYMENT_RECEIPT_TEMPLATE_STORAGE_KEY);
      const template = sanitizePaymentReceiptTemplate(raw || DEFAULT_PAYMENT_RECEIPT_TEMPLATE);
      const normalizeForCompare = (text) => String(text || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
      const isLegacyByCompare = normalizeForCompare(template) === normalizeForCompare(LEGACY_PAYMENT_RECEIPT_TEMPLATE);
      const isLegacyByMarkers = isLegacyPaymentReceiptTemplate(template);

      if (!raw || isLegacyByCompare || isLegacyByMarkers) {
        this.paymentReceiptTemplate = sanitizePaymentReceiptTemplate(DEFAULT_PAYMENT_RECEIPT_TEMPLATE);
        localStorage.setItem(PAYMENT_RECEIPT_TEMPLATE_STORAGE_KEY, this.paymentReceiptTemplate);
        return;
      }
      this.paymentReceiptTemplate = template || sanitizePaymentReceiptTemplate(DEFAULT_PAYMENT_RECEIPT_TEMPLATE);
      localStorage.setItem(PAYMENT_RECEIPT_TEMPLATE_STORAGE_KEY, this.paymentReceiptTemplate);
    } catch (err) {
      this.paymentReceiptTemplate = sanitizePaymentReceiptTemplate(DEFAULT_PAYMENT_RECEIPT_TEMPLATE);
    }
  }

  loadPaymentReceiptProfile() {
    try {
      const raw = JSON.parse(localStorage.getItem(PAYMENT_RECEIPT_PROFILE_STORAGE_KEY) || '{}');
      this.paymentReceiptProfile = {
        ...DEFAULT_PAYMENT_RECEIPT_PROFILE,
        ...(raw && typeof raw === 'object' ? raw : {})
      };
    } catch (err) {
      this.paymentReceiptProfile = { ...DEFAULT_PAYMENT_RECEIPT_PROFILE };
    }
  }

  savePaymentReceiptProfile(profile = {}) {
    this.paymentReceiptProfile = {
      ...DEFAULT_PAYMENT_RECEIPT_PROFILE,
      ...(this.paymentReceiptProfile || {}),
      ...(profile || {})
    };
    try {
      localStorage.setItem(PAYMENT_RECEIPT_PROFILE_STORAGE_KEY, JSON.stringify(this.paymentReceiptProfile));
    } catch (err) {
      console.log('Falha ao salvar perfil do recibo:', err);
    }
  }

  savePaymentReceiptTemplate(templateText) {
    try {
      const next = sanitizePaymentReceiptTemplate(templateText);
      this.paymentReceiptTemplate = next || sanitizePaymentReceiptTemplate(DEFAULT_PAYMENT_RECEIPT_TEMPLATE);
      localStorage.setItem(PAYMENT_RECEIPT_TEMPLATE_STORAGE_KEY, this.paymentReceiptTemplate);
      return true;
    } catch (err) {
      this.showToast('Não foi possível salvar o modelo do recibo.', 'warning');
      return false;
    }
  }

  togglePaymentReceiptTemplateEditor(forceOpen = null) {
    const card = document.getElementById('payment-receipt-template-panel');
    const button = document.getElementById('btn-toggle-payment-receipt-template');
    const nextOpen = forceOpen == null ? !(card && card.classList.contains('is-open')) : Boolean(forceOpen);

    if (card) card.classList.toggle('is-open', nextOpen);
    if (button) button.textContent = nextOpen ? 'Fechar Modelo' : 'Editar Modelo';

    return nextOpen;
  }

  togglePaymentReceiptProfessionalEditor(forceOpen = null) {
    const card = document.getElementById('payment-receipt-professional-panel');
    const button = document.getElementById('btn-toggle-payment-receipt-professional');
    const nextOpen = forceOpen == null ? !(card && card.classList.contains('is-open')) : Boolean(forceOpen);

    if (card) card.classList.toggle('is-open', nextOpen);
    if (button) button.textContent = nextOpen ? 'Fechar Profissional' : 'Editar Profissional';

    return nextOpen;
  }

  toggleFinanceReceiptProfessionalCard(forceOpen = null) {
    const card = document.getElementById('finance-receipt-professional-card');
    const button = document.getElementById('btn-finance-receipt-professional');
    const nextOpen = forceOpen == null ? !(card && card.classList.contains('is-open')) : Boolean(forceOpen);

    if (nextOpen) {
      const profile = this.paymentReceiptProfile || DEFAULT_PAYMENT_RECEIPT_PROFILE;
      const set = (id, value) => {
        const field = document.getElementById(id);
        if (field) field.value = String(value == null ? '' : value);
      };

      set('finance-receipt-professional-name', profile.professionalName || DEFAULT_RECEIPT_PROFESSIONAL_NAME);
      set('finance-receipt-professional-crp', profile.professionalCrp || DEFAULT_RECEIPT_PROFESSIONAL_CRP);
      set('finance-receipt-professional-cpf', this.formatCpfInput(profile.professionalCpf || DEFAULT_RECEIPT_PROFESSIONAL_CPF));
      set('finance-receipt-professional-address', profile.professionalAddress || DEFAULT_RECEIPT_PROFESSIONAL_ADDRESS);
      set('finance-receipt-city-uf', profile.cityUf || DEFAULT_RECEIPT_CITY_UF);
    }

    if (card) card.classList.toggle('is-open', nextOpen);
    if (button) button.textContent = nextOpen ? 'Fechar Profissional Recibo' : 'Editar Profissional Recibo';
    return nextOpen;
  }

  saveFinanceReceiptProfessionalCard() {
    const profile = {
      professionalName: String((document.getElementById('finance-receipt-professional-name') || {}).value || '').trim(),
      professionalCrp: String((document.getElementById('finance-receipt-professional-crp') || {}).value || '').trim(),
      professionalCpf: this.formatCpfInput((document.getElementById('finance-receipt-professional-cpf') || {}).value || ''),
      professionalAddress: String((document.getElementById('finance-receipt-professional-address') || {}).value || '').trim(),
      cityUf: String((document.getElementById('finance-receipt-city-uf') || {}).value || '').trim()
    };

    this.savePaymentReceiptProfile(profile);

    this.setReceiptInputValue('pay-receipt-professional-name', this.paymentReceiptProfile.professionalName || DEFAULT_RECEIPT_PROFESSIONAL_NAME);
    this.setReceiptInputValue('pay-receipt-professional-crp', this.paymentReceiptProfile.professionalCrp || DEFAULT_RECEIPT_PROFESSIONAL_CRP);
    this.setReceiptInputValue('pay-receipt-professional-cpf', this.formatCpfInput(this.paymentReceiptProfile.professionalCpf || DEFAULT_RECEIPT_PROFESSIONAL_CPF));
    this.setReceiptInputValue('pay-receipt-professional-address', this.paymentReceiptProfile.professionalAddress || DEFAULT_RECEIPT_PROFESSIONAL_ADDRESS);
    this.setReceiptInputValue('pay-receipt-city-uf', this.paymentReceiptProfile.cityUf || DEFAULT_RECEIPT_CITY_UF);

    const apptId = String((document.getElementById('pay-appointment-id') || {}).value || '').trim();
    if (apptId) this.generatePaymentReceipt();
    this.showToast('Dados do profissional do recibo salvos.', 'success');
    this.toggleFinanceReceiptProfessionalCard(false);
  }

  getPaymentReceiptTemplate() {
    return String(this.paymentReceiptTemplate || DEFAULT_PAYMENT_RECEIPT_TEMPLATE);
  }

  normalizeIdentityName(value) {
    return String(value || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase();
  }

  normalizeIdentityCpf(value) {
    return String(value || '').replace(/\D/g, '');
  }

  normalizeAppointmentTime(value) {
    const raw = String(value || '').trim();
    if (!raw) return '';

    const hhmmMatch = raw.match(/^(\d{1,2})\s*[:hH]\s*(\d{1,2})$/);
    if (hhmmMatch) {
      const hours = Number(hhmmMatch[1]);
      const minutes = Number(hhmmMatch[2]);
      if (Number.isFinite(hours) && Number.isFinite(minutes) && hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59) {
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
      }
      return '';
    }

    const digits = raw.replace(/\D/g, '');
    if (digits.length === 3 || digits.length === 4) {
      const hours = Number(digits.length === 3 ? digits.slice(0, 1) : digits.slice(0, 2));
      const minutes = Number(digits.slice(-2));
      if (Number.isFinite(hours) && Number.isFinite(minutes) && hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59) {
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
      }
    }

    return '';
  }

  normalizeAppointmentStatus(value) {
    const raw = String(value || '').trim().toLowerCase();
    if (!raw) return 'Agendado';

    // Termos específicos primeiro, para não cair em fallbacks genéricos por engano.
    if (raw.includes('ausente') || raw.includes('faltou') || raw.includes('falta') || raw.includes('no-show') || raw.includes('no show')) {
      return 'Ausente';
    }

    if (raw.includes('confirm')) return 'Confirmado';

    if (raw.includes('cancel')) {
      if (raw.includes('profissional') || raw.includes('clinica') || raw.includes('clínica') || raw.includes('medico') || raw.includes('médico') || raw.includes('terapeuta') || raw.includes('psicolog')) {
        return 'CanceladoProfissional';
      }
      if (raw.includes('cliente') || raw.includes('paciente')) {
        return 'CanceladoCliente';
      }
      // Legado ("Cancelado" puro, sem indicar quem cancelou): não há como recuperar essa
      // informação de dados antigos, então a decisão pragmática é migrar para
      // "CanceladoCliente" por padrão (é o cenário estatisticamente mais comum).
      return 'CanceladoCliente';
    }

    // Legado "Concluido" e variações de comparecimento migram para "Presente".
    if (raw.includes('presente') || raw.includes('concl') || raw.includes('finaliz') || raw.includes('realiz') || raw.includes('atendid') || raw.includes('compareceu')) {
      return 'Presente';
    }

    return 'Agendado';
  }

  getAppointmentStatusMeta(value) {
    const normalized = this.normalizeAppointmentStatus(value);
    const table = {
      Agendado: { label: 'Agendado', badgeClass: 'badge-agendado', chipClass: 'is-info', bucket: 'agendadas' },
      Confirmado: { label: 'Confirmado', badgeClass: 'badge-confirmado', chipClass: 'is-info', bucket: 'confirmadas' },
      Presente: { label: 'Presente', badgeClass: 'badge-presente', chipClass: 'is-success', bucket: 'presentes' },
      Ausente: { label: 'Ausente', badgeClass: 'badge-ausente', chipClass: 'is-warning', bucket: 'ausentes' },
      CanceladoCliente: { label: 'Cancelado pelo Cliente', badgeClass: 'badge-cancelado-cliente', chipClass: 'is-danger', bucket: 'canceladasCliente' },
      CanceladoProfissional: { label: 'Cancelado pelo Profissional', badgeClass: 'badge-cancelado-profissional', chipClass: 'is-danger', bucket: 'canceladasProfissional' }
    };
    return table[normalized] || table.Agendado;
  }

  normalizeAppointmentPaymentStatus(value) {
    const raw = String(value || '').trim().toLowerCase();
    if (raw.includes('pago') || raw.includes('quit')) return 'Pago';
    if (raw.includes('parcial') || raw.includes('partial')) return 'Parcial';
    return 'Pendente';
  }

  normalizeAppointmentRecurrenceType(value) {
    const raw = String(value || '').trim().toLowerCase();
    if (!raw) return 'nao_recorrente';
    if (raw.includes('recorr')) return 'recorrente';
    if (raw === 'sim' || raw === 'yes' || raw === 'true') return 'recorrente';
    return 'nao_recorrente';
  }

  normalizeSingleAppointmentRecord(rawAppointment = {}, source = 'unknown') {
    const raw = rawAppointment && typeof rawAppointment === 'object' ? rawAppointment : {};
    const sourceTag = String(source || '').trim();

    const id = String(
      raw.id || raw.appointmentId || raw.agendamentoId || raw.uid || ''
    ).trim() || `app-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

    const date = this.normalizeAgendaDateToIso(
      raw.date || raw.data || raw.scheduledDate || raw.appointmentDate || raw.dia || ''
    );
    const normalizedTime = this.normalizeAppointmentTime(
      raw.time || raw.hora || raw.scheduledTime || raw.appointmentTime || raw.hour || ''
    );
    const time = normalizedTime || '08:00';

    const incomingClientId = String(
      raw.clientId || raw.clienteId || raw.patientId || ''
    ).trim();

    const incomingClientName = String(
      raw.clientName || raw.clienteNome || raw.nomeCliente || raw.cliente || raw.patientName || raw.nome || ''
    ).trim();

    const incomingClientCpf = this.formatCpfInput(
      raw.clientCpf || raw.clienteCpf || raw.cpfPaciente || ''
    );

    const normalizedNameKey = this.normalizeIdentityName(incomingClientName);
    const resolvedById = incomingClientId
      ? this.clients.find((client) => String((client && client.id) || '').trim() === incomingClientId) || null
      : null;
    const resolvedByName = normalizedNameKey
      ? this.clients.find((client) => this.normalizeIdentityName((client && client.name) || '') === normalizedNameKey) || null
      : null;
    const resolvedClient = resolvedById || resolvedByName;

    const clientId = String((resolvedClient && resolvedClient.id) || incomingClientId || '').trim();
    const clientName = String((resolvedClient && resolvedClient.name) || incomingClientName || '').trim();
    const clientCpf = this.formatCpfInput((resolvedClient && resolvedClient.cpf) || incomingClientCpf || '');

    const normalized = {
      ...raw,
      id,
      clientId,
      clientName: clientName || 'Cliente',
      clientCpf,
      date,
      time,
      procedure: String(raw.procedure || raw.abordagem || raw.reason || raw.motivo || 'Consulta').trim() || 'Consulta',
      price: toNumber(raw.price ?? raw.valor ?? raw.amount ?? raw.sessionValue ?? 0),
      amountPaid: toNumber(raw.amountPaid ?? raw.valorPago ?? raw.paidAmount ?? raw.paid ?? 0),
      paymentMethod: String(raw.paymentMethod || raw.formaPagamento || raw.payment || 'Pix').trim() || 'Pix',
      status: this.normalizeAppointmentStatus(raw.status || raw.appointmentStatus || raw.situacao || 'Agendado'),
      paymentStatus: this.normalizeAppointmentPaymentStatus(raw.paymentStatus || raw.pagamentoStatus || raw.financeStatus || 'Pendente'),
      recurrenceType: this.normalizeAppointmentRecurrenceType(raw.recurrenceType || raw.recorrencia || raw.repeticao || raw.repeatRule || raw.isRecurring),
      notes: String(raw.notes || raw.observacoes || raw.observacao || '').trim(),
      color: normalizeHexColor(raw.color || raw.cor || DEFAULT_APPOINTMENT_COLOR)
    };

    if (!normalized.date || !normalizedTime) {
      this.logSyncAudit('warning', `Consulta ${id} veio com data/hora fora do padrão (${sourceTag || 'sync'}). Hora aplicada automaticamente: ${time}.`);
    }

    return normalized;
  }

  normalizeAppointmentsCollection(rawAppointments = [], source = 'unknown') {
    const sourceList = Array.isArray(rawAppointments) ? rawAppointments : [];
    const seen = new Set();
    const normalized = [];

    sourceList.forEach((item) => {
      const record = this.normalizeSingleAppointmentRecord(item, source);
      if (!record || !record.id) return;
      if (seen.has(record.id)) return;
      seen.add(record.id);
      normalized.push(record);
    });

    return normalized;
  }

  resolveAppointmentClientLink(appointment) {
    if (!appointment) return null;

    const apptId = String(appointment.clientId || '').trim();
    const apptCpf = this.normalizeIdentityCpf(appointment.clientCpf || '');
    const apptName = this.normalizeIdentityName(appointment.clientName || '');

    const byId = apptId
      ? this.clients.find((client) => String((client && client.id) || '') === apptId) || null
      : null;
    const byCpf = apptCpf
      ? this.clients.find((client) => this.normalizeIdentityCpf((client && client.cpf) || '') === apptCpf) || null
      : null;
    const byName = apptName
      ? this.clients.find((client) => this.normalizeIdentityName((client && client.name) || '') === apptName) || null
      : null;

    if (byId) {
      const byIdName = this.normalizeIdentityName(byId.name || '');
      const byIdCpf = this.normalizeIdentityCpf(byId.cpf || '');
      const nameMatches = !apptName || byIdName === apptName;
      const cpfMatches = !apptCpf || (byIdCpf && byIdCpf === apptCpf);
      if (nameMatches && cpfMatches) return byId;
    }

    if (byCpf) {
      const byCpfName = this.normalizeIdentityName(byCpf.name || '');
      if (!apptName || byCpfName === apptName || !byName) return byCpf;
    }

    if (byName) return byName;
    if (byId) return byId;
    return null;
  }

  reconcileAppointmentsClientLinks() {
    if (!Array.isArray(this.appointments) || !this.appointments.length) return false;
    let hasChanges = false;

    this.appointments.forEach((appointment) => {
      if (!appointment || typeof appointment !== 'object') return;

      const resolvedClient = this.resolveAppointmentClientLink(appointment);
      const currentCpf = this.formatCpfInput(appointment.clientCpf || '');

      if (!resolvedClient) {
        if (String(appointment.clientCpf || '') !== currentCpf) {
          appointment.clientCpf = currentCpf;
          hasChanges = true;
        }
        return;
      }

      const nextId = String(resolvedClient.id || '').trim();
      const nextName = String(resolvedClient.name || appointment.clientName || '').trim();
      const nextCpf = this.formatCpfInput(resolvedClient.cpf || appointment.clientCpf || '');

      if (String(appointment.clientId || '').trim() !== nextId) {
        appointment.clientId = nextId;
        hasChanges = true;
      }
      if (String(appointment.clientName || '').trim() !== nextName) {
        appointment.clientName = nextName;
        hasChanges = true;
      }
      if (String(appointment.clientCpf || '') !== nextCpf) {
        appointment.clientCpf = nextCpf;
        hasChanges = true;
      }
    });

    return hasChanges;
  }

  getClientByAppointment(appointment) {
    return this.resolveAppointmentClientLink(appointment);
  }

  formatCpfDisplay(rawCpf, fallback = '[000.000.000-00]') {
    const digits = String(rawCpf || '').replace(/\D/g, '');
    if (digits.length !== 11) return fallback;
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
  }

  formatCpfInput(rawCpf) {
    const digits = String(rawCpf || '').replace(/\D/g, '').slice(0, 11);
    if (!digits) return '';
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
    if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
  }

  formatPhoneInput(rawPhone) {
    const digits = String(rawPhone || '').replace(/\D/g, '').slice(0, 11);
    if (!digits) return '';
    if (digits.length <= 2) return `(${digits}`;

    const ddd = digits.slice(0, 2);
    const body = digits.slice(2);

    if (body.length <= 4) return `(${ddd}) ${body}`;
    if (body.length <= 8) return `(${ddd}) ${body.slice(0, 4)}-${body.slice(4)}`;
    return `(${ddd}) ${body.slice(0, 5)}-${body.slice(5)}`;
  }

  numberToWordsPtBR(value) {
    const units = ['', 'um', 'dois', 'tres', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove'];
    const teens = ['dez', 'onze', 'doze', 'treze', 'quatorze', 'quinze', 'dezesseis', 'dezessete', 'dezoito', 'dezenove'];
    const tens = ['', '', 'vinte', 'trinta', 'quarenta', 'cinquenta', 'sessenta', 'setenta', 'oitenta', 'noventa'];
    const hundreds = ['', 'cento', 'duzentos', 'trezentos', 'quatrocentos', 'quinhentos', 'seiscentos', 'setecentos', 'oitocentos', 'novecentos'];

    const integer = Math.max(0, Math.trunc(Number(value) || 0));
    if (integer === 0) return 'zero';

    const convertUnderThousand = (num) => {
      if (num === 0) return '';
      if (num === 100) return 'cem';

      const c = Math.trunc(num / 100);
      const d = Math.trunc((num % 100) / 10);
      const u = num % 10;
      const parts = [];

      if (c > 0) parts.push(hundreds[c]);
      if (d === 1) parts.push(teens[u]);
      else {
        if (d > 1) parts.push(tens[d]);
        if (u > 0) parts.push(units[u]);
      }

      return parts.join(' e ');
    };

    const thousands = Math.trunc(integer / 1000);
    const remainder = integer % 1000;
    const parts = [];

    if (thousands > 0) {
      if (thousands === 1) parts.push('mil');
      else parts.push(`${convertUnderThousand(thousands)} mil`);
    }

    if (remainder > 0) {
      if (thousands > 0 && remainder < 100) parts.push(`e ${convertUnderThousand(remainder)}`);
      else parts.push(convertUnderThousand(remainder));
    }

    return parts.join(' ').replace(/\s+/g, ' ').trim();
  }

  formatCurrencyExtenso(value) {
    const safe = Math.max(0, Number(value) || 0);
    const inteiro = Math.trunc(safe);
    const centavos = Math.round((safe - inteiro) * 100);
    const partes = [];

    const inteiroTexto = this.numberToWordsPtBR(inteiro);
    const centavosTexto = this.numberToWordsPtBR(centavos);

    if (inteiro > 0) {
      partes.push(`${inteiroTexto} ${inteiro === 1 ? 'real' : 'reais'}`);
    }
    if (centavos > 0) {
      partes.push(`${centavosTexto} ${centavos === 1 ? 'centavo' : 'centavos'}`);
    }

    if (!partes.length) return 'zero real';
    return partes.join(' e ');
  }

  formatLongDatePtBR(sourceDate) {
    const date = sourceDate instanceof Date ? sourceDate : new Date(sourceDate);
    if (Number.isNaN(date.getTime())) return '[Dia] de [Mes] de [Ano]';
    const months = ['janeiro', 'fevereiro', 'marco', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
    return `${date.getDate()} de ${months[date.getMonth()]} de ${date.getFullYear()}`;
  }

  getPaymentReceiptNumberMap() {
    try {
      const parsed = JSON.parse(localStorage.getItem(PAYMENT_RECEIPT_NUMBER_MAP_STORAGE_KEY) || '{}');
      return parsed && typeof parsed === 'object' ? parsed : {};
    } catch (err) {
      return {};
    }
  }

  savePaymentReceiptNumberMap(map) {
    try {
      localStorage.setItem(PAYMENT_RECEIPT_NUMBER_MAP_STORAGE_KEY, JSON.stringify(map || {}));
    } catch (err) {
      console.log('Falha ao salvar mapa de numeracao dos recibos:', err);
    }
  }

  getNextPaymentReceiptNumber() {
    let current = 0;
    try {
      current = Number(localStorage.getItem(PAYMENT_RECEIPT_COUNTER_STORAGE_KEY) || 0);
    } catch (err) {
      current = 0;
    }
    const next = Math.max(0, Number.isFinite(current) ? Math.trunc(current) : 0) + 1;
    try {
      localStorage.setItem(PAYMENT_RECEIPT_COUNTER_STORAGE_KEY, String(next));
    } catch (err) {
      console.log('Falha ao salvar contador de recibos:', err);
    }
    return String(next).padStart(3, '0');
  }

  ensurePaymentReceiptNumber(appointment, paidAfter = 0) {
    const id = String((appointment && appointment.id) || '').trim();
    const amountKey = Math.max(0, Math.round(Number(paidAfter || 0) * 100));
    const entryKey = id ? `${id}|${amountKey}` : '';
    if (!entryKey) return this.getNextPaymentReceiptNumber();

    const map = this.getPaymentReceiptNumberMap();
    const existing = String(map[entryKey] || '').trim();
    if (existing) return existing;

    const next = this.getNextPaymentReceiptNumber();
    map[entryKey] = next;
    this.savePaymentReceiptNumberMap(map);
    return next;
  }

  getReceiptInputValue(id, fallback = '') {
    const field = document.getElementById(id);
    const value = String((field && field.value) || '').trim();
    return value || fallback;
  }

  setReceiptInputValue(id, value = '') {
    const field = document.getElementById(id);
    if (!field) return;
    field.value = String(value == null ? '' : value);
  }

  getReceiptDatesList() {
    const raw = String((document.getElementById('pay-receipt-dates') || {}).value || '').trim();
    if (!raw) return [];
    return raw
      .split(/[\n,;]+/)
      .map((item) => String(item || '').trim())
      .filter(Boolean);
  }

  setReceiptDatesList(items = []) {
    const clean = Array.from(new Set((Array.isArray(items) ? items : [])
      .map((item) => String(item || '').trim())
      .filter(Boolean)));
    this.setReceiptInputValue('pay-receipt-dates', clean.join('\n'));
  }

  addReceiptDateFromPicker() {
    const picker = document.getElementById('pay-receipt-date-picker');
    if (!picker) return;

    const iso = String(picker.value || '').trim();
    if (!iso) {
      this.showToast('Selecione uma data para adicionar.', 'warning');
      return;
    }

    const dateLabel = formatDateBR(iso);
    const items = this.getReceiptDatesList();
    if (!items.includes(dateLabel)) items.push(dateLabel);

    items.sort((a, b) => {
      const aIso = this.normalizeDobToIso(a);
      const bIso = this.normalizeDobToIso(b);
      return String(aIso || '').localeCompare(String(bIso || ''));
    });

    this.setReceiptDatesList(items);
    this.generatePaymentReceipt();
  }

  clearReceiptDatesList() {
    this.setReceiptInputValue('pay-receipt-dates', '');
    this.generatePaymentReceipt();
  }

  formatReceiptDatesForDocument(rawDates, fallbackDate = '') {
    const source = String(rawDates || '').trim() || String(fallbackDate || '').trim();
    if (!source) return '';

    const items = source
      .split(/[\n,;]+/)
      .map((item) => String(item || '').trim())
      .filter(Boolean);

    if (!items.length) return '';
    if (items.length === 1) return items[0];
    return items.map((item, index) => `${index + 1}. ${item}`).join('\n');
  }

  populatePaymentReceiptEditableFields(appointment, amountNow = 0) {
    const client = this.getClientByAppointment(appointment) || {};
    const clientName = String((appointment && appointment.clientName) || 'Cliente').trim() || 'Cliente';
    const resolvedClientName = String((client && client.name) || '').trim();
    const samePatient = !clientName || !resolvedClientName
      ? true
      : clientName.toLowerCase() === resolvedClientName.toLowerCase();
    const procedure = String((appointment && appointment.procedure) || 'Consulta').trim() || 'Consulta';
    const date = formatDateBR((appointment && appointment.date) || '');
    const total = this.getEffectiveAppointmentPrice(appointment);
    const paidBefore = toNumber((appointment && appointment.amountPaid) || 0);
    const paidNow = Math.max(0, toNumber(amountNow || 0));
    const paidAfter = Math.min(total, paidBefore + paidNow);

    const payerName = String((samePatient ? (client && client.name) : '') || (client && client.emergencyName) || clientName || '[Nome completo do Pagador / Responsavel]').trim();
    const payerCpf = this.formatCpfDisplay((samePatient ? (client && client.cpf) : '') || (client && client.emergencyCpf) || '', '[000.000.000-00]');
    const patientName = String(clientName || resolvedClientName || '[Nome completo do Paciente]').trim();
    const patientCpf = this.formatCpfDisplay((appointment && appointment.clientCpf) || (samePatient ? (client && client.cpf) : '') || '', '[000.000.000-00]');
    const city = String((client && client.city) || '').trim();
    const state = String((client && client.state) || '').trim().toUpperCase();
    const cityUf = city && state
      ? `${city} - ${state}`
      : String((this.paymentReceiptProfile && this.paymentReceiptProfile.cityUf) || DEFAULT_RECEIPT_CITY_UF);

    const quantity = Math.max(1, Number((appointment && (appointment.sessionCount || appointment.sessionsCount || appointment.quantity)) || 1));
    const receiptNumber = this.ensurePaymentReceiptNumber(appointment, paidAfter);

    this.setReceiptInputValue('pay-receipt-number', receiptNumber);
    this.setReceiptInputValue('pay-receipt-payer-name', payerName);
    this.setReceiptInputValue('pay-receipt-payer-cpf', payerCpf);
    this.setReceiptInputValue('pay-receipt-patient-name', patientName);
    this.setReceiptInputValue('pay-receipt-patient-cpf', patientCpf);
    this.setReceiptInputValue('pay-receipt-service', procedure);
    this.setReceiptInputValue('pay-receipt-sessions', String(quantity));
    this.setReceiptInputValue('pay-receipt-dates', date);
    this.setReceiptInputValue('pay-receipt-city-uf', cityUf);
    this.setReceiptInputValue('pay-receipt-professional-name', (this.paymentReceiptProfile && this.paymentReceiptProfile.professionalName) || DEFAULT_RECEIPT_PROFESSIONAL_NAME);
    this.setReceiptInputValue('pay-receipt-professional-crp', (this.paymentReceiptProfile && this.paymentReceiptProfile.professionalCrp) || DEFAULT_RECEIPT_PROFESSIONAL_CRP);
    this.setReceiptInputValue('pay-receipt-professional-cpf', (this.paymentReceiptProfile && this.paymentReceiptProfile.professionalCpf) || DEFAULT_RECEIPT_PROFESSIONAL_CPF);
    this.setReceiptInputValue('pay-receipt-professional-address', (this.paymentReceiptProfile && this.paymentReceiptProfile.professionalAddress) || DEFAULT_RECEIPT_PROFESSIONAL_ADDRESS);
  }

  buildPaymentReceiptVars(appointment, amountNow = 0) {
    const client = this.getClientByAppointment(appointment) || {};
    const clientName = String((appointment && appointment.clientName) || 'Cliente').trim() || 'Cliente';
    const resolvedClientName = String((client && client.name) || '').trim();
    const samePatient = !clientName || !resolvedClientName
      ? true
      : clientName.toLowerCase() === resolvedClientName.toLowerCase();
    const procedure = String((appointment && appointment.procedure) || 'Consulta').trim() || 'Consulta';
    const date = formatDateBR((appointment && appointment.date) || '');
    const time = String((appointment && appointment.time) || '--:--').trim() || '--:--';
    const paymentMethod = String((document.getElementById('pay-method') || {}).value || appointment.paymentMethod || 'Pix');
    const total = this.getEffectiveAppointmentPrice(appointment);
    const paidBefore = toNumber((appointment && appointment.amountPaid) || 0);
    const paidNow = Math.max(0, toNumber(amountNow || 0));
    const paidAfter = Math.min(total, paidBefore + paidNow);
    const openAfter = Math.max(0, total - paidAfter);
    const payerName = String((samePatient ? (client && client.name) : '') || (client && client.emergencyName) || clientName || '[Nome completo do Pagador / Responsavel]').trim();
    const payerCpf = this.formatCpfDisplay((samePatient ? (client && client.cpf) : '') || (client && client.emergencyCpf) || '', '[000.000.000-00]');
    const patientName = String(clientName || resolvedClientName || '[Nome completo do Paciente]').trim();
    const patientCpf = this.formatCpfDisplay((appointment && appointment.clientCpf) || (samePatient ? (client && client.cpf) : '') || '', '[000.000.000-00]');
    const city = String((client && client.city) || '').trim();
    const state = String((client && client.state) || '').trim().toUpperCase();
    const cityUfDefault = city && state
      ? `${city} - ${state}`
      : String((this.paymentReceiptProfile && this.paymentReceiptProfile.cityUf) || DEFAULT_RECEIPT_CITY_UF);
    const quantity = Math.max(1, Number((appointment && (appointment.sessionCount || appointment.sessionsCount || appointment.quantity)) || 1));
    const autoReceiptNumber = this.ensurePaymentReceiptNumber(appointment, paidAfter);
    const issuedAt = new Date();
    const receiptNumber = this.getReceiptInputValue('pay-receipt-number', autoReceiptNumber);

    const profileDraft = {
      professionalName: this.getReceiptInputValue('pay-receipt-professional-name', (this.paymentReceiptProfile && this.paymentReceiptProfile.professionalName) || DEFAULT_RECEIPT_PROFESSIONAL_NAME),
      professionalCrp: this.getReceiptInputValue('pay-receipt-professional-crp', (this.paymentReceiptProfile && this.paymentReceiptProfile.professionalCrp) || DEFAULT_RECEIPT_PROFESSIONAL_CRP),
      professionalCpf: this.getReceiptInputValue('pay-receipt-professional-cpf', (this.paymentReceiptProfile && this.paymentReceiptProfile.professionalCpf) || DEFAULT_RECEIPT_PROFESSIONAL_CPF),
      professionalAddress: this.getReceiptInputValue('pay-receipt-professional-address', (this.paymentReceiptProfile && this.paymentReceiptProfile.professionalAddress) || DEFAULT_RECEIPT_PROFESSIONAL_ADDRESS),
      cityUf: this.getReceiptInputValue('pay-receipt-city-uf', cityUfDefault)
    };
    this.savePaymentReceiptProfile(profileDraft);

    const payerNameFinal = this.getReceiptInputValue('pay-receipt-payer-name', payerName);
    const payerCpfFinal = this.formatCpfDisplay(this.getReceiptInputValue('pay-receipt-payer-cpf', payerCpf), '[000.000.000-00]');
    const patientNameFinal = this.getReceiptInputValue('pay-receipt-patient-name', patientName);
    const patientCpfFinal = this.formatCpfDisplay(this.getReceiptInputValue('pay-receipt-patient-cpf', patientCpf), '[000.000.000-00]');
    const serviceFinal = this.getReceiptInputValue('pay-receipt-service', procedure);
    const quantityFinal = Math.max(1, Number(this.getReceiptInputValue('pay-receipt-sessions', String(quantity))) || 1);
    const datesRaw = this.getReceiptInputValue('pay-receipt-dates', date);
    const datesFinal = this.formatReceiptDatesForDocument(datesRaw, date);

    return {
      assinatura: this.getSignatureName(),
      cliente: clientName,
      paciente_nome: patientNameFinal,
      paciente_cpf: patientCpfFinal,
      pagador_nome: payerNameFinal,
      pagador_cpf: payerCpfFinal,
      data: date,
      hora: time,
      datas_atendimento: datesFinal,
      procedimento: procedure,
      servico: serviceFinal,
      quantidade_sessoes: String(quantityFinal),
      forma_pagamento: paymentMethod,
      valor_total: formatCurrency(total),
      valor_pago_antes: formatCurrency(paidBefore),
      valor_pago_agora: formatCurrency(paidNow),
      valor_pago_agora_extenso: this.formatCurrencyExtenso(paidNow),
      total_pago: formatCurrency(paidAfter),
      saldo_aberto: formatCurrency(openAfter),
      emitido_em: issuedAt.toLocaleString('pt-BR'),
      data_emissao_extenso: this.formatLongDatePtBR(issuedAt),
      cidade_uf: profileDraft.cityUf,
      recibo_numero: receiptNumber,
      profissional_nome: profileDraft.professionalName,
      profissional_crp: profileDraft.professionalCrp,
      profissional_cpf: profileDraft.professionalCpf,
      profissional_endereco: profileDraft.professionalAddress
    };
  }

  buildPaymentReceiptDocument(appointment, amountNow = 0) {
    const vars = this.buildPaymentReceiptVars(appointment, amountNow);
    const template = this.getPaymentReceiptTemplate();
    const receipt = this.applyTemplateVars(template, vars).trim();
    const hasPaymentSummary = template.includes('{{total_pago}}') && template.includes('{{saldo_aberto}}');
    if (hasPaymentSummary || toNumber(amountNow) <= 0) return receipt;

    return [
      receipt,
      '',
      'RESUMO DO PAGAMENTO',
      `Valor recebido agora: ${vars.valor_pago_agora}`,
      `Total pago: ${vars.total_pago}`,
      `Saldo em aberto: ${vars.saldo_aberto}`
    ].join('\n');
  }

  fillPaymentAmountFromBalance() {
    const id = (document.getElementById('pay-appointment-id') || {}).value || (document.getElementById('pay-appt-id') || {}).value || '';
    const appointment = this.appointments.find((item) => item.id === id);
    const input = document.getElementById('pay-amount-now');
    if (input && appointment) {
      const total = this.getEffectiveAppointmentPrice(appointment);
      input.value = Math.max(0, total - toNumber(appointment.amountPaid));
    }
    this.generatePaymentReceipt();
  }

  updatePaymentSummaryPreview() {
    const id = (document.getElementById('pay-appointment-id') || {}).value || (document.getElementById('pay-appt-id') || {}).value || '';
    const appointment = this.appointments.find((item) => item.id === id);
    if (!appointment) return;

    const total = this.getEffectiveAppointmentPrice(appointment);
    const paidBefore = Math.min(total, Math.max(0, toNumber(appointment.amountPaid)));
    const balanceBefore = Math.max(0, total - paidBefore);
    const amountNow = Math.min(balanceBefore, Math.max(0, toNumber((document.getElementById('pay-amount-now') || {}).value || 0)));
    const paidAfter = paidBefore + amountNow;
    const paidEl = document.getElementById('pay-paid');
    const balanceEl = document.getElementById('pay-balance');

    if (paidEl) paidEl.textContent = formatCurrency(paidAfter);
    if (balanceEl) balanceEl.textContent = formatCurrency(Math.max(0, total - paidAfter));
  }

  setPaymentEntryMode(mode) {
    const normalizedMode = mode === 'full' ? 'full' : 'partial';
    const partialButton = document.getElementById('btn-pay-partial');
    const fullButton = document.getElementById('btn-pay-quitar');
    const amountInput = document.getElementById('pay-amount-now');

    if (partialButton) partialButton.classList.toggle('is-active', normalizedMode === 'partial');
    if (fullButton) fullButton.classList.toggle('is-active', normalizedMode === 'full');

    if (normalizedMode === 'full') {
      this.fillPaymentAmountFromBalance();
    } else if (amountInput) {
      amountInput.value = '';
      amountInput.focus();
      this.generatePaymentReceipt();
    }
  }

  normalizePaymentReceiptText(rawText) {
    return String(rawText || '')
      .replace(/\r/g, '')
      .split('\n')
      .map((line) => this.sanitizeReceiptPdfLine(line))
      .join('\n')
      .trim();
  }

  sanitizeReceiptPdfLine(value) {
    return String(value || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[º°]/g, 'o')
      .replace(/[ª]/g, 'a')
      .replace(/[“”„«»]/g, '"')
      .replace(/[‘’`´]/g, "'")
      .replace(/[^\x20-\x7E]/g, ' ')
      .replace(/\s+/g, ' ')
      .trimEnd();
  }

  escapePdfText(value) {
    return this.sanitizeReceiptPdfLine(value)
      .replace(/\\/g, '\\\\')
      .replace(/\(/g, '\\(')
      .replace(/\)/g, '\\)');
  }

  async getPaymentReceiptLogoDataUrl() {
    if (this.paymentReceiptLogoDataUrl) return this.paymentReceiptLogoDataUrl;
    const embeddedLogo = [
      '/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAA8KCw0LCQ8NDA0REA8RFiUYFhQUFi0gIhslNS84NzQvNDM7QlVIOz9QPzM0SmRLUFdaX2BfOUdob2dcblVdX1v/',
      '2wBDARARERYTFisYGCtbPTQ9W1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1v/wAARCAAgACADASIAAhEBAxEB/8QA',
      'HwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkK',
      'FhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXG',
      'x8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAEC',
      'AxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOE',
      'hYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDmJpbtry4E',
      'UszbGZjhjwAeTVi1l+6zXgeNo8yiSRlMZz0Ujv3FWY4ZrW/uvIjgmvYpC/lNu3hcZ+XBweDyOtRagI54pIbbbGyYuHiRSA/HJAPII9PrispVeaXKtu/9fgyl',
      'GyuTKk13L5ImdIlhUxXHmFUAzyz+5549RVXUre5ti8kN4ZrYMFDi4Vm+pAPApJiVtLQGWMpBGrrC/PmsxJxj0x3qSys/MSdpYRBHK5RI1j3zMR1VM9AO7HpT',
      'hJxV29P6/wCHBpMt6nqFwbpfJRnjnQhUiyuZB8rbscsRjpnuKr6ffO1xBbyGSZwW80z4OwAHO09Rx7/hVZL1Y7m4hmMnkPIx3RnDxt03L+HBHcVai010sZDp',
      'rpeyTjazoQpjT02k5ye9YThCmnCSt2f/AAfL8Sk23dEELWwt7K8neQeSfK2xqCcqcg5PHQirzXUt1tewtrS7RQI9rIxkQE/xDPQk8kcVVtNKvFjlgu4DFBIM',
      'l2YAIw6N1/D8ailvVtPmieN7vy/KM0Q2qF6fixHGatcspe67/kJ3S10P/9k='
    ].join('');
    this.paymentReceiptLogoDataUrl = `data:image/jpeg;base64,${embeddedLogo}`;
    return this.paymentReceiptLogoDataUrl;
  }

  async buildReceiptPdfBlob(title, content) {
    if (window.jspdf && window.jspdf.jsPDF) {
      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF('p', 'pt', 'a4');
      let logoAdded = false;
      try {
        const logoDataUrl = await this.getPaymentReceiptLogoDataUrl();
        if (logoDataUrl) {
          pdf.addImage(logoDataUrl, 'JPEG', 28, 28, 36, 36, undefined, 'FAST');
          logoAdded = true;
        }
      } catch (err) {
        console.log('Logo ignorada na geração do PDF:', err);
      }
      const headerX = logoAdded ? 76 : 28;
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(15);
      pdf.text(this.sanitizeReceiptPdfLine(title || 'Recibo de Pagamento'), headerX, 43);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9);
      pdf.text(this.sanitizeReceiptPdfLine(`Emitido em: ${new Date().toLocaleString('pt-BR')}`), headerX, 58);
      pdf.setDrawColor(209, 213, 219);
      pdf.line(28, 78, 567, 78);

      pdf.setFontSize(10.5);
      const contentLines = [];
      String(content || '').replace(/\r/g, '').split('\n').forEach((line) => {
        if (!line) {
          contentLines.push('');
          return;
        }
        contentLines.push(...pdf.splitTextToSize(this.sanitizeReceiptPdfLine(line), 539));
      });

      let y = 112;
      contentLines.forEach((line) => {
        if (y > 798) {
          pdf.addPage();
          y = 42;
        }
        if (line) pdf.text(line, 28, y);
        y += 15;
      });
      return pdf.output('blob');
    }

    const pageWidth = 595.28;
    const pageHeight = 841.89;
    const marginLeft = 42;
    const marginTop = 54;
    const fontSize = 11;
    const lineHeight = 15;
    const maxCharsPerLine = 82;
    const logoUrl = new URL('./assets/icons/icon-512.png', window.location.href).href;
    const encoder = new TextEncoder();
    const toBytes = (value) => (value instanceof Uint8Array ? value : encoder.encode(String(value)));

    const loadLogoAsJpegBytes = () => new Promise((resolve) => {
      const img = new Image();
      let settled = false;
      const finish = (value) => {
        if (settled) return;
        settled = true;
        window.clearTimeout(timeoutId);
        resolve(value);
      };
      const timeoutId = window.setTimeout(() => finish(null), 1500);
      if (window.location.protocol !== 'file:') img.crossOrigin = 'anonymous';
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const size = 88;
          canvas.width = size;
          canvas.height = size;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            finish(null);
            return;
          }
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, size, size);
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, size, size);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
          const base64 = String(dataUrl.split(',')[1] || '');
          finish(base64 ? Uint8Array.from(atob(base64), (char) => char.charCodeAt(0)) : null);
        } catch (err) {
          finish(null);
        }
      };
      img.onerror = () => finish(null);
      img.src = logoUrl;
    });

    const logoBytes = await loadLogoAsJpegBytes();

    const lines = [];
    String(content || '').replace(/\r/g, '').split('\n').forEach((line) => {
      const safeLine = String(line || '');
      if (!safeLine) {
        lines.push('');
        return;
      }

      let remaining = safeLine;
      while (remaining.length > maxCharsPerLine) {
        lines.push(remaining.slice(0, maxCharsPerLine));
        remaining = remaining.slice(maxCharsPerLine);
      }
      lines.push(remaining);
    });

    if (!lines.length) lines.push('');

    const textStartX = marginLeft;
    const textStartY = pageHeight - 132;
    const linesPerPage = Math.max(1, Math.floor((textStartY - marginTop) / lineHeight));
    const pages = [];
    for (let index = 0; index < lines.length; index += linesPerPage) {
      pages.push(lines.slice(index, index + linesPerPage));
    }

    const objects = [];
    const addObject = (segments) => {
      objects.push(Array.isArray(segments) ? segments : [segments]);
      return objects.length;
    };

    const fontId = addObject(['<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>']);
    const boldFontId = addObject(['<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>']);
    let imageId = 0;
    if (logoBytes && logoBytes.length) {
      imageId = addObject([
        `<< /Type /XObject /Subtype /Image /Width 88 /Height 88 /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${logoBytes.length} >>\nstream\n`,
        logoBytes,
        '\nendstream'
      ]);
    }

    const contentIds = pages.map((pageLines, pageIndex) => {
      const streamLines = [];
      if (pageIndex === 0 && imageId) {
        streamLines.push('q');
        streamLines.push('40 0 0 40 42 754 cm');
        streamLines.push('/Im1 Do');
        streamLines.push('Q');
      }
      if (pageIndex === 0) {
        const headerTextX = imageId ? 94 : marginLeft;
        streamLines.push('BT');
        streamLines.push('/F2 16 Tf');
        streamLines.push(`${headerTextX} 776 Td`);
        streamLines.push(`(${this.escapePdfText(title || 'Recibo de Pagamento')}) Tj`);
        streamLines.push('ET');
        streamLines.push('BT');
        streamLines.push('/F1 9 Tf');
        streamLines.push(`${headerTextX} 758 Td`);
        streamLines.push(`(${this.escapePdfText(`Emitido em: ${new Date().toLocaleString('pt-BR')}`)}) Tj`);
        streamLines.push('ET');
        streamLines.push('q');
        streamLines.push('0.82 G');
        streamLines.push('0.8 w');
        streamLines.push('42 742 m');
        streamLines.push('553 742 l');
        streamLines.push('S');
        streamLines.push('Q');
      }
      streamLines.push('BT');
      streamLines.push(`/F1 ${fontSize} Tf`);
      streamLines.push(`${lineHeight} TL`);
      streamLines.push(`${textStartX} ${textStartY} Td`);

      pageLines.forEach((line, lineIndex) => {
        const escaped = this.escapePdfText(line);
        if (lineIndex === 0) {
          streamLines.push(`(${escaped}) Tj`);
        } else {
          streamLines.push(`0 -${lineHeight} Td`);
          streamLines.push(`(${escaped}) Tj`);
        }
      });
      streamLines.push('ET');

      const stream = streamLines.join('\n');
      return addObject([
        `<< /Length ${encoder.encode(stream).length} >>\nstream\n`,
        stream,
        '\nendstream'
      ]);
    });

    const pagesObjectIndex = addObject(['']);
    const pageIds = pages.map(() => addObject(['']));
    const catalogId = addObject(['']);

    objects[pagesObjectIndex - 1] = [`<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(' ')}] /Count ${pageIds.length} >>`];
    pageIds.forEach((pageId, index) => {
      const xObjectPart = imageId && index === 0 ? ` /XObject << /Im1 ${imageId} 0 R >>` : '';
      objects[pageId - 1] = [`<< /Type /Page /Parent ${pagesObjectIndex} 0 R /MediaBox [0 0 ${pageWidth.toFixed(2)} ${pageHeight.toFixed(2)}] /Resources << /Font << /F1 ${fontId} 0 R /F2 ${boldFontId} 0 R >>${xObjectPart} >> /Contents ${contentIds[index]} 0 R >>`];
    });
    objects[catalogId - 1] = [`<< /Type /Catalog /Pages ${pagesObjectIndex} 0 R >>`];

    const pdfParts = [encoder.encode('%PDF-1.4\n')];
    const offsets = [0];
    let currentLength = pdfParts[0].length;
    const pushPart = (part) => {
      const bytes = toBytes(part);
      pdfParts.push(bytes);
      currentLength += bytes.length;
    };

    objects.forEach((segments, index) => {
      offsets[index + 1] = currentLength;
      pushPart(`${index + 1} 0 obj\n`);
      segments.forEach((segment) => pushPart(segment));
      pushPart('\nendobj\n');
    });

    const xrefStart = currentLength;
    pushPart(`xref\n0 ${objects.length + 1}\n`);
    pushPart('0000000000 65535 f \n');
    for (let index = 1; index <= objects.length; index += 1) {
      pushPart(`${String(offsets[index]).padStart(10, '0')} 00000 n \n`);
    }
    pushPart(`trailer\n<< /Size ${objects.length + 1} /Root ${catalogId} 0 R >>\nstartxref\n${xrefStart}\n%%EOF`);

    return new Blob(pdfParts, { type: 'application/pdf' });
  }

  async sharePaymentReceiptPdf(appointment, content) {
    const fileName = `recibo-pagamento-${String(appointment && appointment.id ? appointment.id : Date.now())}.pdf`;
    const title = 'Recibo de Pagamento';

    if (window.location.protocol === 'file:' || !window.html2canvas || !window.jspdf || !window.jspdf.jsPDF) {
      const blob = await this.buildReceiptPdfBlob(title, content);
      const file = new File([blob], fileName, { type: 'application/pdf' });

      if (navigator.canShare && navigator.canShare({ files: [file] }) && navigator.share) {
        await navigator.share({ title, text: 'Recibo em PDF', files: [file] });
        return true;
      }

      const fallbackUrl = URL.createObjectURL(blob);
      const fallbackLink = document.createElement('a');
      fallbackLink.href = fallbackUrl;
      fallbackLink.download = fileName;
      document.body.appendChild(fallbackLink);
      fallbackLink.click();
      fallbackLink.remove();
      window.setTimeout(() => URL.revokeObjectURL(fallbackUrl), 1500);
      return false;
    }

    const container = document.createElement('div');
    container.setAttribute('aria-hidden', 'true');
    container.style.position = 'fixed';
    container.style.left = '-10000px';
    container.style.top = '0';
    container.style.width = '794px';
    container.style.background = '#ffffff';
    container.style.zIndex = '-1';
    container.innerHTML = this.buildPaymentReceiptShareHtml(content);
    document.body.appendChild(container);

    try {
      const canvas = await window.html2canvas(container, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
        allowTaint: true
      });

      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF('p', 'pt', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const pxPerPt = canvas.width / pageWidth;
      const sliceHeightPx = Math.max(1, Math.floor(pageHeight * pxPerPt));
      let renderedPages = 0;

      for (let sourceY = 0; sourceY < canvas.height; sourceY += sliceHeightPx) {
        const sliceCanvas = document.createElement('canvas');
        sliceCanvas.width = canvas.width;
        sliceCanvas.height = Math.min(sliceHeightPx, canvas.height - sourceY);
        const sliceCtx = sliceCanvas.getContext('2d');
        if (!sliceCtx) break;

        sliceCtx.fillStyle = '#ffffff';
        sliceCtx.fillRect(0, 0, sliceCanvas.width, sliceCanvas.height);
        sliceCtx.drawImage(
          canvas,
          0,
          sourceY,
          canvas.width,
          sliceCanvas.height,
          0,
          0,
          sliceCanvas.width,
          sliceCanvas.height
        );

        const sliceDataUrl = sliceCanvas.toDataURL('image/png', 1.0);
        const sliceHeightPt = sliceCanvas.height / pxPerPt;

        if (renderedPages > 0) pdf.addPage();
        pdf.addImage(sliceDataUrl, 'PNG', 0, 0, pageWidth, sliceHeightPt);
        renderedPages += 1;
      }

      const blob = pdf.output('blob');
      const file = new File([blob], fileName, { type: 'application/pdf' });

      if (navigator.canShare && navigator.canShare({ files: [file] }) && navigator.share) {
        await navigator.share({ title, text: 'Recibo em PDF', files: [file] });
        return true;
      }

      const fallbackUrl = URL.createObjectURL(blob);
      const fallbackLink = document.createElement('a');
      fallbackLink.href = fallbackUrl;
      fallbackLink.download = fileName;
      document.body.appendChild(fallbackLink);
      fallbackLink.click();
      fallbackLink.remove();
      window.setTimeout(() => URL.revokeObjectURL(fallbackUrl), 1500);
      return false;
    } finally {
      container.remove();
    }
  }

  canSharePaymentReceiptFile() {
    if (typeof navigator.share !== 'function' || typeof navigator.canShare !== 'function' || typeof File !== 'function') return false;
    try {
      const probeFile = new File([new Blob(['PDF'], { type: 'application/pdf' })], 'recibo.pdf', { type: 'application/pdf' });
      return navigator.canShare({ files: [probeFile] });
    } catch (err) {
      return false;
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
      return raw;
    }

    return this.formatDobDisplay(raw);
  }

  formatDobForDisplay(value) {
    const raw = String(value || '').trim();
    const iso = this.normalizeDobToIso(raw);
    if (!iso) return this.formatDobDisplay(raw);
    const [year, month, day] = iso.split('-');
    return `${day}/${month}/${year}`;
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
    return this.formatDobForDisplay(value);
  }

  normalizeTopDateToIso(value) {
    return this.normalizeDobToIso(value);
  }

  formatTopDateForInput(value) {
    const iso = this.normalizeTopDateToIso(value);
    if (!iso) return '';
    return this.formatTopDateDisplay(iso);
  }

  formatAgendaDateDisplay(value) {
    return this.formatDobForDisplay(value);
  }

  normalizeAgendaDateToIso(value) {
    return this.normalizeDobToIso(value);
  }

  formatAgendaDateForInput(value) {
    const iso = this.normalizeAgendaDateToIso(value);
    if (!iso) return '';
    return this.formatAgendaDateDisplay(iso);
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

  collectClientCategoriesFromClients() {
    const seen = new Set();
    const fromStored = Array.isArray(this.clientCategories) ? this.clientCategories : [];
    const fromClients = this.clients
      .map((client) => this.normalizeClientCategory(client && client.category))
      .filter((category) => {
        if (!category) return false;
        const key = this.normalizeClientCategoryKey(category);
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });

    const all = DEFAULT_CLIENT_CATEGORIES.concat(fromStored).concat(fromClients)
      .map((category) => this.normalizeClientCategory(category))
      .filter(Boolean);

    const unique = [];
    const uniqueKeys = new Set();
    all.forEach((category) => {
      const key = this.normalizeClientCategoryKey(category);
      if (uniqueKeys.has(key)) return;
      uniqueKeys.add(key);
      unique.push(category);
    });

    return unique;
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

  rememberClientCategory(categoryName) {
    const normalized = this.normalizeClientCategory(categoryName);
    if (!normalized) return;

    const existingIndex = this.clientCategories.findIndex((item) => this.normalizeClientCategoryKey(item) === this.normalizeClientCategoryKey(normalized));
    if (existingIndex >= 0) this.clientCategories.splice(existingIndex, 1);
    this.clientCategories.unshift(normalized);

    const requiredDefaults = DEFAULT_CLIENT_CATEGORIES.map((item) => this.normalizeClientCategory(item));
    requiredDefaults.reverse().forEach((category) => {
      const key = this.normalizeClientCategoryKey(category);
      if (!this.clientCategories.some((item) => this.normalizeClientCategoryKey(item) === key)) {
        this.clientCategories.unshift(category);
      }
    });

    this.clientCategories = this.clientCategories.slice(0, 60);
    this.populateClientCategoryOptions();
    this.populateClientCategoryFilterOptions();
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

  populateClientCategoryOptions(preferredCategory = '') {
    const select = document.getElementById('client-category');
    if (!select) return;

    const categories = this.clientCategories.slice()
      .sort((firstCategory, secondCategory) => firstCategory.localeCompare(secondCategory, 'pt-BR', { sensitivity: 'base' }));
    const preferred = this.normalizeClientCategory(preferredCategory || select.value);
    const preferredKey = this.normalizeClientCategoryKey(preferred);
    if (preferred && !categories.some((item) => this.normalizeClientCategoryKey(item) === preferredKey)) {
      categories.unshift(preferred);
    }

    select.innerHTML = categories
      .map((category) => `<option value="${safeText(category)}">${safeText(category)}</option>`)
      .join('');
    if (preferred) select.value = preferred;
  }

  populateClientCategoryFilterOptions() {
    const select = document.getElementById('clientes-category-filter');
    if (!select) return;

    const current = String(select.value || 'paciente').trim().toLowerCase() || 'paciente';
    const normalizedCategories = this.collectClientCategoriesFromClients();
    this.clientCategories = normalizedCategories.slice();

    const options = ['<option value="todos">Todas as categorias</option>'];
    normalizedCategories.forEach((category) => {
      const key = this.normalizeClientCategoryKey(category);
      options.push(`<option value="${safeText(key)}">${safeText(category)}</option>`);
    });

    select.innerHTML = options.join('');
    const validValues = ['todos'].concat(normalizedCategories.map((category) => this.normalizeClientCategoryKey(category)));
    select.value = validValues.includes(current) ? current : 'paciente';
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

  askConfirmation(message, options = {}) {
    const text = String(message || '').trim() || 'Confirmar ação?';
    const title = String(options.title || 'Confirmar exclusão');
    const confirmLabel = String(options.confirmLabel || 'Excluir');
    const cancelLabel = String(options.cancelLabel || 'Cancelar');

    return new Promise((resolve) => {
      const existing = document.getElementById('modal-confirm-action');
      if (existing && existing.parentNode) existing.parentNode.removeChild(existing);

      const backdrop = document.createElement('div');
      backdrop.className = 'modal-backdrop active';
      backdrop.id = 'modal-confirm-action';

      backdrop.innerHTML = `
        <div class="modal-card modal-card-sm" role="dialog" aria-modal="true" aria-labelledby="confirm-action-title">
          <div class="modal-header">
            <h3 id="confirm-action-title">${safeText(title)}</h3>
            <button class="btn-close" type="button" data-confirm-close aria-label="Fechar">×</button>
          </div>
          <div class="modal-body">
            <p style="margin:0; color:var(--text-muted);">${safeText(text)}</p>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" type="button" data-confirm-cancel>${safeText(cancelLabel)}</button>
            <button class="btn btn-danger" type="button" data-confirm-ok>${safeText(confirmLabel)}</button>
          </div>
        </div>
      `;

      document.body.appendChild(backdrop);

      const okBtn = backdrop.querySelector('[data-confirm-ok]');
      const cancelBtn = backdrop.querySelector('[data-confirm-cancel]');
      const closeBtn = backdrop.querySelector('[data-confirm-close]');
      const card = backdrop.querySelector('.modal-card');

      const done = (result) => {
        document.removeEventListener('keydown', onKeydown);
        if (backdrop.parentNode) backdrop.parentNode.removeChild(backdrop);
        resolve(Boolean(result));
      };

      const onKeydown = (event) => {
        if (event.key === 'Escape') {
          event.preventDefault();
          done(false);
        }
      };

      document.addEventListener('keydown', onKeydown);

      backdrop.addEventListener('click', (event) => {
        if (event.target === backdrop) done(false);
      });
      if (okBtn) okBtn.addEventListener('click', () => done(true));
      if (cancelBtn) cancelBtn.addEventListener('click', () => done(false));
      if (closeBtn) closeBtn.addEventListener('click', () => done(false));

      if (card) card.addEventListener('click', (event) => event.stopPropagation());
      if (okBtn) okBtn.focus();
    });
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
    return ['Presente', 'CanceladoCliente', 'CanceladoProfissional'].includes(
      this.normalizeAppointmentStatus(appointment && appointment.status)
    );
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

  async ensureNotificationPermission(showFeedback = false, allowPrompt = false) {
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

    if (!allowPrompt) {
      this.updateNotificationPermissionUI();
      return Notification.permission || 'prompt';
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

  getNotificationDiagnostics() {
    const notificationSupported = 'Notification' in window;
    const permission = notificationSupported ? Notification.permission : 'unsupported';
    const swSupported = 'serviceWorker' in navigator;
    const hasController = swSupported && Boolean(navigator.serviceWorker.controller);
    const standalone = Boolean(
      (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches)
      || window.navigator.standalone
    );
    const visibility = document.hidden ? 'em segundo plano/bloqueada' : 'ativa na tela';
    const vibrationSupported = Boolean(navigator.vibrate);

    return {
      notificationSupported,
      permission,
      swSupported,
      hasController,
      standalone,
      visibility,
      vibrationSupported,
      soundEnabled: Boolean(this.soundEnabled),
      reminderIntensity: ['normal', 'strong', 'ultra'].includes(this.reminderIntensity) ? this.reminderIntensity : 'strong'
    };
  }

  showNotificationSoundDiagnostics() {
    const d = this.getNotificationDiagnostics();

    const permissionText = d.permission === 'granted'
      ? 'Permitida'
      : (d.permission === 'denied' ? 'Bloqueada' : (d.permission === 'prompt' ? 'Pendente' : 'Indisponível'));

    const checklist = [
      `Notificação do navegador: ${permissionText}`,
      `Service Worker: ${d.swSupported ? 'Suportado' : 'Não suportado'}`,
      `Service Worker ativo nesta aba: ${d.hasController ? 'Sim' : 'Não'}`,
      `Instalado como app (PWA): ${d.standalone ? 'Sim' : 'Não'}`,
      `Som de lembrete no app: ${d.soundEnabled ? 'Ligado' : 'Desligado'}`,
      `Intensidade do aviso: ${d.reminderIntensity}`,
      `Vibração suportada: ${d.vibrationSupported ? 'Sim' : 'Não'}`,
      `Estado atual da página: ${d.visibility}`,
      '',
      'Para tela bloqueada no celular:',
      '1. Permitir notificações deste site/app no navegador.',
      '2. Manter volume de notificações do sistema ligado (não apenas mídia).',
      '3. Desativar Não Perturbe / modo silencioso para este app.',
      '4. Remover restrição de bateria para o navegador/PWA.',
      '5. Instalar o app na tela inicial melhora entrega em segundo plano.'
    ];

    window.alert(['Diagnóstico de Notificação e Som', '', ...checklist].join('\n'));
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
        url: options.url || './'
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
    const appointmentId = appointment && appointment.id ? String(appointment.id) : '';
    const reminderUrl = `./?open=agenda&focus=reminder${appointmentId ? `&appointmentId=${encodeURIComponent(appointmentId)}` : ''}`;
    this.showToast(body, 'warning');

    const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent || '');
    const isDesktop = !isMobile;
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
      appointmentId,
      url: reminderUrl,
      tag: appointmentId ? `appt-reminder-${appointmentId}` : `appt-reminder-${Date.now()}`,
      requireInteraction: isDesktop && !isManualTest,
      vibrate: vibratePattern
    });

    if (isManualTest) {
      if (sent) this.showToast('Notificação do sistema enviada com sucesso.', 'success');
      else this.showToast('Não foi possível enviar notificação do sistema. Verifique a permissão do navegador.', 'warning');
    }
  }

  checkAppointmentReminders() {
    if (!Array.isArray(this.appointments) || !this.appointments.length) {
      this.updateReminderAlertUI(0);
      return;
    }

    this.pruneReminderNotifiedKeys();

    const pendingAppointments = this.getPendingReminderAppointments();
    this.updateReminderAlertUI(pendingAppointments.length);

    pendingAppointments.forEach((appointment) => {
      if (!appointment || !appointment.id) return;
      const startsAt = this.getAppointmentDateTime(appointment);
      if (!startsAt) return;
      const diffMinutes = (startsAt.getTime() - Date.now()) / 60000;

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
    this.loadLandscapeSidebarPreference();

    const userInput = document.getElementById('login-username');
    const creds = getLoginCredentials();
    if (userInput && !userInput.value) userInput.value = creds.username;

    const startDateInput = document.getElementById('top-date-start');
    const endDateInput = document.getElementById('top-date-end');
    const currentMonth = getCurrentMonthRange();
    if (startDateInput && !startDateInput.value) startDateInput.value = this.formatTopDateForInput(currentMonth.start);
    if (endDateInput && !endDateInput.value) endDateInput.value = this.formatTopDateForInput(currentMonth.end);

    this.syncTopDatesToAgendaFilters();
    this.ensureAppointmentProcedureOptions();
    this.loadSoundSettings();
    this.updateSoundControlsUI();
    this.loadVoiceNarrationPreference();
    this.updateVoiceNarrationToggleUI();
    this.populateClientGroupOptions();
    this.populateClientCategoryOptions();
    this.populateClientCategoryFilterOptions();
    this.populateExpenseCategoryOptions();
    initCustomSelects();
    this.prefillSenhaTabFields();
    this.prefillFirebaseConfig();
    this.prefillGoogleCalendarConfig();
    this.updateCloudSyncMeta('Modo local', 'local');
    this.captureReminderRouteFromCurrentUrl();
    this.startReminderWatcher();
    this.applyLandscapeSidebarState();
  }

  isLandscapeCompactMode() {
    if (!window.matchMedia) return false;
    return window.matchMedia('(max-width: 900px) and (orientation: landscape) and (max-height: 520px)').matches;
  }

  loadLandscapeSidebarPreference() {
    try {
      this.landscapeSidebarCollapsed = localStorage.getItem(LANDSCAPE_SIDEBAR_COLLAPSED_STORAGE_KEY) === '1';
    } catch (err) {
      this.landscapeSidebarCollapsed = false;
    }
  }

  saveLandscapeSidebarPreference() {
    try {
      localStorage.setItem(
        LANDSCAPE_SIDEBAR_COLLAPSED_STORAGE_KEY,
        this.landscapeSidebarCollapsed ? '1' : '0'
      );
    } catch (err) {
      console.log('Falha ao salvar preferência do menu landscape:', err);
    }
  }

  updateLandscapeSidebarToggleUI() {
    const btn = document.getElementById('btn-toggle-landscape-sidebar');
    if (!btn) return;

    const compactMode = this.isLandscapeCompactMode();
    const collapsed = compactMode && this.landscapeSidebarCollapsed;
    btn.style.display = compactMode ? 'inline-flex' : 'none';
    btn.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
    btn.setAttribute('title', collapsed ? 'Expandir menu lateral' : 'Recolher menu lateral');

    const text = btn.querySelector('span');
    if (text) text.textContent = collapsed ? 'Expandir Menu' : 'Recolher Menu';
  }

  applyLandscapeSidebarState() {
    const appShell = document.getElementById('app-shell');
    if (!appShell) return;

    const compactMode = this.isLandscapeCompactMode();
    if (!compactMode) {
      appShell.classList.remove('landscape-sidebar-collapsed');
      this.updateLandscapeSidebarToggleUI();
      return;
    }

    appShell.classList.toggle('landscape-sidebar-collapsed', this.landscapeSidebarCollapsed);
    this.updateLandscapeSidebarToggleUI();
  }

  toggleLandscapeSidebar() {
    if (!this.isLandscapeCompactMode()) return;
    this.landscapeSidebarCollapsed = !this.landscapeSidebarCollapsed;
    this.saveLandscapeSidebarPreference();
    this.applyLandscapeSidebarState();
  }

  bindLandscapeSidebarToggle() {
    const btn = document.getElementById('btn-toggle-landscape-sidebar');
    if (btn) {
      btn.addEventListener('click', () => {
        this.toggleLandscapeSidebar();
      });
    }

    const onViewportChange = () => {
      this.applyLandscapeSidebarState();
    };

    window.addEventListener('resize', onViewportChange);
    window.addEventListener('orientationchange', onViewportChange);

    if (window.matchMedia) {
      const mq = window.matchMedia('(max-width: 900px) and (orientation: landscape) and (max-height: 520px)');
      if (mq && typeof mq.addEventListener === 'function') {
        mq.addEventListener('change', onViewportChange);
      }
    }

    this.applyLandscapeSidebarState();
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

  saveSoundSettings(options = {}) {
    try {
      localStorage.setItem(SOUND_ENABLED_STORAGE_KEY, this.soundEnabled ? '1' : '0');
      localStorage.setItem(REMINDER_MINS_STORAGE_KEY, String(this.reminderMinutes));
      localStorage.setItem(
        REMINDER_INTENSITY_STORAGE_KEY,
        ['normal', 'strong', 'ultra'].includes(this.reminderIntensity) ? this.reminderIntensity : 'strong'
      );
      if (!options || options.skipSync !== true) {
        this.markSharedSettingsDirty('sound-settings');
      }
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
    this.updateReminderAlertUI();
    this.updateNotificationPermissionUI();
  }

  loadVoiceNarrationPreference() {
    try {
      this.voiceNarrationEnabled = localStorage.getItem(VOICE_NARRATION_ENABLED_STORAGE_KEY) === '1';
    } catch (err) {
      this.voiceNarrationEnabled = false;
    }
  }

  saveVoiceNarrationPreference() {
    try {
      localStorage.setItem(VOICE_NARRATION_ENABLED_STORAGE_KEY, this.voiceNarrationEnabled ? '1' : '0');
    } catch (err) {
      console.log('Falha ao salvar preferência de narração por voz:', err);
    }
  }

  updateVoiceNarrationToggleUI() {
    const toggleBtn = document.getElementById('btn-toggle-voice-narration');
    const statusText = document.getElementById('voice-narration-status-text');
    if (toggleBtn) toggleBtn.classList.toggle('is-off', !this.voiceNarrationEnabled);
    if (statusText) statusText.textContent = this.voiceNarrationEnabled ? 'Narração por Voz: ON' : 'Narração por Voz: OFF';

    const controls = document.getElementById('voice-narration-controls');
    if (controls) controls.style.display = this.voiceNarrationEnabled ? 'flex' : 'none';
  }

  toggleVoiceNarrationFlag() {
    this.voiceNarrationEnabled = !this.voiceNarrationEnabled;
    if (!this.voiceNarrationEnabled) this.stopVoiceNarrationRecording();
    this.saveVoiceNarrationPreference();
    this.updateVoiceNarrationToggleUI();
    this.showToast(
      this.voiceNarrationEnabled ? 'Narração por voz ativada.' : 'Narração por voz desativada.',
      'info'
    );
  }

  // Só o texto reconhecido é salvo — nenhum áudio é gravado ou enviado a qualquer lugar.
  toggleVoiceNarrationRecording() {
    if (this.voiceNarrationActive) {
      this.stopVoiceNarrationRecording();
    } else {
      this.startVoiceNarrationRecording();
    }
  }

  startVoiceNarrationRecording() {
    if (this.voiceNarrationActive) return;

    const SpeechRecognitionCtor = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionCtor) {
      this.showToast('Seu navegador não suporta narração por voz. Tente pelo Chrome ou Edge (computador ou Android).', 'warning');
      return;
    }

    const recognition = new SpeechRecognitionCtor();
    recognition.lang = 'pt-BR';
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      const textarea = document.getElementById('appt-session-narrative');
      if (!textarea) return;

      let finalChunk = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) finalChunk += result[0].transcript;
      }

      const trimmedChunk = finalChunk.trim();
      if (!trimmedChunk) return;

      const separator = textarea.value && !/\s$/.test(textarea.value) ? ' ' : '';
      textarea.value = `${textarea.value}${separator}${trimmedChunk} `;
    };

    recognition.onerror = (event) => {
      const errorCode = String((event && event.error) || '').trim();
      let message = 'Falha na narração por voz.';
      if (errorCode === 'not-allowed' || errorCode === 'permission-denied' || errorCode === 'service-not-allowed') {
        message = 'Permissão de microfone negada. Habilite o microfone para este site nas configurações do navegador e tente de novo.';
      } else if (errorCode === 'no-speech') {
        message = 'Nenhuma fala detectada. Toque no microfone para tentar de novo.';
      } else if (errorCode === 'network') {
        message = 'Falha de conexão durante a narração por voz. Verifique sua internet.';
      }
      this.showToast(message, 'warning');
      this.stopVoiceNarrationRecording();
    };

    recognition.onend = () => {
      // Alguns navegadores encerram o reconhecimento sozinhos após um período de silêncio,
      // mesmo em modo contínuo — sincroniza o estado/UI quando isso acontece sem clique do usuário.
      if (this.voiceNarrationActive) this.stopVoiceNarrationRecording();
    };

    try {
      recognition.start();
    } catch (err) {
      this.showToast('Não foi possível iniciar a narração por voz.', 'warning');
      return;
    }

    this.voiceNarrationRecognition = recognition;
    this.voiceNarrationActive = true;
    this.updateVoiceNarrationRecordingUI();
  }

  stopVoiceNarrationRecording() {
    if (this.voiceNarrationRecognition) {
      try {
        this.voiceNarrationRecognition.onend = null;
        this.voiceNarrationRecognition.stop();
      } catch (err) { /* no-op */ }
    }
    this.voiceNarrationRecognition = null;
    this.voiceNarrationActive = false;
    this.updateVoiceNarrationRecordingUI();
  }

  updateVoiceNarrationRecordingUI() {
    const btn = document.getElementById('btn-voice-narration-toggle');
    const label = document.getElementById('voice-narration-mic-label');
    const indicator = document.getElementById('voice-narration-live-indicator');
    if (btn) btn.classList.toggle('is-recording', this.voiceNarrationActive);
    if (label) label.textContent = this.voiceNarrationActive ? 'Parar narração' : 'Narrar por voz';
    if (indicator) indicator.style.display = this.voiceNarrationActive ? 'inline-flex' : 'none';
  }

  printAppointmentSession(appointmentId) {
    const appointment = this.appointments.find((a) => a.id === appointmentId);
    if (!appointment) {
      this.showToast('Consulta não encontrada para impressão.', 'warning');
      return;
    }

    const client = this.clients.find((c) => c.id === appointment.clientId);
    const clientName = String(appointment.clientName || (client && client.name) || 'Paciente').trim() || 'Paciente';
    const narrative = this.getSessionNarrativeDisplay(appointment).text;

    const lines = [
      'SESSÃO INDIVIDUAL',
      '',
      `Paciente: ${clientName}`,
      `Data: ${formatDateBR(appointment.date)}`,
      `Horário: ${appointment.time || '-'}`,
      `Procedimento: ${appointment.procedure || '-'}`,
      `Status: ${appointment.status || '-'}`,
      '',
      'Narrativa da sessão:',
      narrative || '(sem narrativa registrada)'
    ];

    this.openReportWindow(`Sessão - ${clientName} - ${formatDateBR(appointment.date)}`, lines.join('\n'), true);
  }

  showHeaderSyncInlineNotice(message = 'Dados atualizados com sucesso.', type = 'success', timeoutMs = 2600) {
    const normalizedType = String(type || '').toLowerCase();
    const mode = normalizedType === 'warning' ? 'local' : 'live';
    this.updateCloudSyncMeta(String(message || '').trim(), mode, {
      highlight: true
    });
  }

  isFirebaseQuotaExceededError(err) {
    const code = String((err && err.code) || '').trim().toLowerCase();
    const message = String((err && err.message) || '').trim().toLowerCase();
    return (
      code.includes('resource-exhausted')
      || message.includes('resource-exhausted')
      || message.includes('quota exceeded')
      || message.includes('too many requests')
      || message.includes('429')
    );
  }

  notifyFirebaseQuotaPause(err, source = 'sync') {
    if (!this.isFirebaseQuotaExceededError(err)) return false;

    const now = Date.now();
    const cooldownMs = Math.max(15000, Number(this.firebaseQuotaNoticeCooldownMs) || 45000);
    const details = String((err && (err.code || err.message)) || 'resource-exhausted');

    this.updateCloudSyncMeta('Sync pausado: cota do Firebase excedida', 'local');
    this.logSyncAudit('warning', `Sync pausado por cota do Firebase (${source}): ${details}`);

    if ((now - Number(this.lastFirebaseQuotaNoticeAt || 0)) >= cooldownMs) {
      this.showHeaderSyncInlineNotice('Sync pausado por cota do Firebase. Aguarde e tente novamente.', 'warning', 5200);
      this.lastFirebaseQuotaNoticeAt = now;
    }

    return true;
  }

  getPendingReminderAppointments() {
    if (!Array.isArray(this.appointments) || !this.appointments.length) return [];

    const now = new Date();
    const reminderWindow = Number.isFinite(Number(this.reminderMinutes)) ? Math.max(1, Number(this.reminderMinutes)) : 15;

    return this.appointments.filter((appointment) => {
      if (!appointment || !appointment.id) return false;
      if (this.isReminderBlockedByStatus(appointment)) return false;

      const startsAt = this.getAppointmentDateTime(appointment);
      if (!startsAt) return false;

      const diffMinutes = (startsAt.getTime() - now.getTime()) / 60000;
      if (diffMinutes > reminderWindow) return false;
      if (diffMinutes < -2) return false;

      return true;
    });
  }

  updateReminderAlertUI(pendingCountOverride = null) {
    const container = document.querySelector('.reminder-mins-box');
    const badge = document.getElementById('reminder-alert-badge');
    const pendingCount = Number.isFinite(Number(pendingCountOverride))
      ? Math.max(0, Number(pendingCountOverride))
      : this.getPendingReminderAppointments().length;

    this.lastReminderAlertCount = pendingCount;

    if (container) {
      container.classList.toggle('has-pending-alert', pendingCount > 0);
      container.title = pendingCount > 0
        ? `${pendingCount} atendimento(s) no período de aviso.`
        : 'Defina com quantos minutos de antecedência o alarme deve tocar';
    }

    if (badge) {
      if (pendingCount > 0) {
        badge.style.display = 'inline-flex';
        badge.textContent = pendingCount > 99 ? '99+' : String(pendingCount);
      } else {
        badge.style.display = 'none';
        badge.textContent = '0';
      }
    }
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
        pill.title = 'Notificação permitida. Toque para ver diagnóstico de tela bloqueada e som.';
      } else if (permission === 'denied') {
        pill.classList.add('is-denied');
        pill.textContent = 'Notificação: Bloqueada';
        pill.title = 'Notificação bloqueada no navegador. Libere nas permissões do site.';
      } else if (permission === 'prompt') {
        pill.classList.add('is-prompt');
        pill.textContent = 'Notificação: Pendente';
        pill.title = 'Toque em Ativar Notificação para conceder permissão.';
      } else {
        pill.classList.add('is-unsupported');
        pill.textContent = 'Notificação: Indisponível';
        pill.title = 'Este navegador não suporta notificações do sistema.';
      }

      pill.setAttribute('role', 'button');
      pill.setAttribute('tabindex', '0');
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
    const reloadWithCacheBust = () => {
      try {
        const nextUrl = new URL(window.location.href);
        nextUrl.searchParams.set('update', String(Date.now()));
        window.location.replace(nextUrl.toString());
      } catch (err) {
        window.location.reload();
      }
    };

    this.showToast('Forçando atualização completa do aplicativo...', 'info');

    try {
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();

        await Promise.all(registrations.map(async (registration) => {
          try {
            if (typeof registration.unregister === 'function') {
              await registration.unregister();
            }
          } catch (updateErr) {
            console.log('Falha ao remover registration do SW:', updateErr);
          }
        }));
      }

      if ('caches' in window) {
        const names = await caches.keys();
        await Promise.all(names.map((name) => caches.delete(name)));
      }

      this.logSyncAudit('info', 'Atualização forçada executada (cache limpo e reload com cache-bust).');
      window.setTimeout(reloadWithCacheBust, 260);
    } catch (err) {
      console.log('Falha no fluxo de atualização forçada:', err);
      this.logSyncAudit('error', `Falha em atualização forçada: ${String((err && (err.code || err.message)) || 'erro desconhecido')}`);
      this.showToast('Atualização com limpeza parcial. Recarregando página...', 'warning');
      window.setTimeout(reloadWithCacheBust, 260);
    }
  }


  initEvents() {
    const loginForm = document.getElementById('login-form');
    const saveFirebaseBtn = document.getElementById('btn-save-firebase');
    const forceAppUpdateBtn = document.getElementById('btn-force-app-update');
    const versionBadge = document.getElementById('app-version-badge');
    const refreshFirebaseBtns = document.querySelectorAll('[data-action="refresh-firebase"]');
    const fetchLatestFirebaseUpdateBtn = document.getElementById('btn-fetch-latest-firebase-update');
    const validateFirebaseBtn = document.getElementById('btn-validate-firebase');
    const disconnectFirebaseBtn = document.getElementById('btn-disconnect-firebase');
    const saveGoogleCalendarBtn = document.getElementById('btn-save-google-calendar');
    const connectGoogleCalendarBtn = document.getElementById('btn-connect-google-calendar');
    const importGoogleCalendarEventsBtn = document.getElementById('btn-import-google-calendar-events');
    const disconnectGoogleCalendarBtn = document.getElementById('btn-disconnect-google-calendar');
    const resetLocalAppointmentsBtn = document.getElementById('btn-reset-local-appointments-google');
    const exportSyncAuditBtn = document.getElementById('btn-export-sync-audit');
    const copySyncDiagnosticBtn = document.getElementById('btn-copy-sync-diagnostic');
    const firebaseConfigInput = document.getElementById('cfg-firebase-json');
    const googleCalendarClientIdInput = document.getElementById('cfg-google-calendar-client-id');
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
        const enteredPassTrim = enteredPass.trim();
        if (!enteredUser || !enteredPass) {
          this.showLoginScreen('Preencha usuário e senha para entrar.');
          return;
        }

        const users = getLoginUsers();
        const matchedUser = users.find((user) => String(user.username || '').trim().toLowerCase() === enteredUser.toLowerCase());
        const isDefaultUser = enteredUser.toLowerCase() === LOGIN_DEFAULT_USERNAME.toLowerCase();
        const isDefaultRecovery = isDefaultUser
          && enteredPassTrim.toLowerCase() === LOGIN_DEFAULT_PASSWORD.toLowerCase();

        if (!matchedUser && !isDefaultRecovery) {
          this.showLoginScreen('Usuário não encontrado.');
          return;
        }

        const storedPass = String((matchedUser && matchedUser.password) || '');
        const passMatches = enteredPass === storedPass || enteredPassTrim === storedPass;

        if (!isDefaultRecovery && !passMatches) {
          this.showLoginScreen('Senha incorreta.');
          return;
        }

        if (isDefaultRecovery) {
          // Recovery path for cases where local/Firebase user records were overwritten.
          setLoginCredentials(LOGIN_DEFAULT_USERNAME, LOGIN_DEFAULT_PASSWORD);
        }

        setActiveLoginUser(isDefaultRecovery ? LOGIN_DEFAULT_USERNAME : matchedUser.username);
        this.localLoginUnlocked = true;
        this.showAppShell();
        this.restoreAgendaFiltersForLoadedAppointments();
        this.render();
        this.applyPendingReminderRoute();
        this.showToast('Login realizado com sucesso!', 'success');
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

    if (fetchLatestFirebaseUpdateBtn) {
      fetchLatestFirebaseUpdateBtn.addEventListener('click', () => {
        void this.fetchLatestFirebaseUpdate();
      });
    }

    if (disconnectFirebaseBtn) {
      disconnectFirebaseBtn.addEventListener('click', () => {
        this.disconnectFirebase();
      });
    }

    if (saveGoogleCalendarBtn) {
      saveGoogleCalendarBtn.addEventListener('click', () => {
        const clientId = String((googleCalendarClientIdInput && googleCalendarClientIdInput.value) || '').trim();
        if (!clientId) {
          this.updateGoogleCalendarStatus('error', 'Informe o Client ID do Google Calendar para salvar.');
          return;
        }

        this.saveGoogleCalendarClientId(clientId);
        this.updateGoogleCalendarStatus('ready', 'Client ID salvo. Clique em Conectar para autorizar o Google Calendar.');
      });
    }

    if (connectGoogleCalendarBtn) {
      connectGoogleCalendarBtn.addEventListener('click', () => {
        void this.connectGoogleCalendar();
      });
    }

    if (importGoogleCalendarEventsBtn) {
      importGoogleCalendarEventsBtn.addEventListener('click', () => {
        void this.importGoogleCalendarIntoLocalAgenda();
      });
    }

    if (resetLocalAppointmentsBtn) {
      resetLocalAppointmentsBtn.addEventListener('click', () => {
        void this.resetLocalAppointmentsFromGoogleOnly();
      });
    }

    if (disconnectGoogleCalendarBtn) {
      disconnectGoogleCalendarBtn.addEventListener('click', () => {
        this.disconnectGoogleCalendar();
      });
    }

    if (validateFirebaseBtn) {
      validateFirebaseBtn.addEventListener('click', () => {
        void this.runFirebaseValidationChecklist();
      });
    }

    if (exportSyncAuditBtn) {
      exportSyncAuditBtn.addEventListener('click', () => {
        void this.exportSyncAuditLog();
      });
    }

    if (copySyncDiagnosticBtn) {
      copySyncDiagnosticBtn.addEventListener('click', () => {
        void this.copySyncDiagnosticReport();
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

    if (googleCalendarClientIdInput) {
      googleCalendarClientIdInput.addEventListener('input', () => {
        this.googleCalendarClientId = String(googleCalendarClientIdInput.value || '').trim();
        if (!this.googleCalendarClientId) {
          this.updateGoogleCalendarStatus('offline', 'Google Calendar desconectado.');
        } else {
          this.updateGoogleCalendarStatus(this.googleCalendarAuthorized ? 'ok' : 'ready');
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

    this.bindLandscapeSidebarToggle();

    const resolveDashboardTarget = (cardId) => {
      if (!cardId) return null;
      const map = {
        'dash-card-consultas': 'agenda',
        'dash-card-recebido': 'financeiro',
        'dash-card-pendente': 'financeiro',
        'dash-card-resultado': 'financeiro',
        'dash-card-despesas': 'despesas',
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
        this.setPaymentEntryMode('full');
        return;
      }

      const receiptTemplateTrigger = target.closest('#btn-toggle-payment-receipt-template');
      if (receiptTemplateTrigger) {
        event.preventDefault();
        event.stopPropagation();
        this.togglePaymentReceiptTemplateEditor();
        return;
      }

      const receiptGenerateTrigger = target.closest('#btn-generate-payment-receipt');
      if (receiptGenerateTrigger) {
        event.preventDefault();
        event.stopPropagation();
        this.generatePaymentReceipt();
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

      const clientCategoriesOpenTrigger = target.closest('#btn-manage-client-categories');
      if (clientCategoriesOpenTrigger) {
        event.preventDefault();
        event.stopPropagation();
        this.openClientCategoriesModal();
        return;
      }

      const clientGroupsCloseTrigger = target.closest('#btn-close-client-groups, #btn-close-client-groups-footer');
      if (clientGroupsCloseTrigger) {
        event.preventDefault();
        event.stopPropagation();
        this.closeClientGroupsModal();
        return;
      }

      const clientCategoriesCloseTrigger = target.closest('#btn-close-client-categories, #btn-close-client-categories-footer');
      if (clientCategoriesCloseTrigger) {
        event.preventDefault();
        event.stopPropagation();
        this.closeClientCategoriesModal();
        return;
      }

      const appointmentCloseTrigger = target.closest('#btn-cancel-appointment, #btn-close-appointment');
      if (appointmentCloseTrigger) {
        event.preventDefault();
        event.stopPropagation();
        this.closeAppointmentModal();
        return;
      }

      const appointmentDeleteTrigger = target.closest('#btn-delete-appointment');
      if (appointmentDeleteTrigger) {
        event.preventDefault();
        event.stopPropagation();
        const idInput = document.getElementById('appointment-id');
        const appointmentId = idInput ? idInput.value : '';
        if (appointmentId) {
          Promise.resolve(this.deleteAppointment(appointmentId)).then(() => {
            if (!this.appointments.some((a) => a.id === appointmentId)) {
              this.closeAppointmentModal();
            }
          });
        }
        return;
      }

      const printSessionTrigger = target.closest('#btn-print-appointment-session');
      if (printSessionTrigger) {
        event.preventDefault();
        event.stopPropagation();
        const idInput = document.getElementById('appointment-id');
        const appointmentId = idInput ? idInput.value : '';
        if (appointmentId) this.printAppointmentSession(appointmentId);
        return;
      }

      const voiceNarrationToggleTrigger = target.closest('#btn-voice-narration-toggle');
      if (voiceNarrationToggleTrigger) {
        event.preventDefault();
        event.stopPropagation();
        this.toggleVoiceNarrationRecording();
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
        const tab = btn.getAttribute('data-tab') || 'panil';
        if (tab === 'financeiro') this.financeViewFilter = 'all';
        this.switchTab(tab);
      });
    });

    const logoutBtn = document.getElementById('btn-logout-session');
    if (logoutBtn) logoutBtn.addEventListener('click', () => this.logoutSession());

    const btnHeaderBack = document.getElementById('btn-header-back');
    if (btnHeaderBack) {
      btnHeaderBack.addEventListener('click', () => {
        this.switchTab('panil');
      });
    }

    const resetDatesBtn = document.getElementById('btn-reset-top-dates');
    if (resetDatesBtn) {
      resetDatesBtn.addEventListener('click', () => {
        this.topDateRangeUserSelected = true;
        const currentMonth = getCurrentMonthRange();
        const startDateInput = document.getElementById('top-date-start');
        const endDateInput = document.getElementById('top-date-end');
        if (startDateInput) startDateInput.value = this.formatTopDateForInput(currentMonth.start);
        if (endDateInput) endDateInput.value = this.formatTopDateForInput(currentMonth.end);
        this.syncTopDatesToAgendaFilters();
        this.render();
      });
    }

    const topStart = document.getElementById('top-date-start');
    const topEnd = document.getElementById('top-date-end');
    if (window.flatpickr) {
      const topFlatpickrOptions = {
        locale: 'pt',
        allowInput: true,
        dateFormat: 'd/m/Y',
        disableMobile: true,
        onOpen: (_, __, inst) => {
          const selected = inst.selectedDates[0];
          if (selected) inst.jumpToDate(selected);
        }
      };
      if (topStart && !topStart._flatpickr) {
        window.flatpickr(topStart, {
          ...topFlatpickrOptions,
          defaultDate: topStart.value || undefined
        });
      }
      if (topEnd && !topEnd._flatpickr) {
        window.flatpickr(topEnd, {
          ...topFlatpickrOptions,
          defaultDate: topEnd.value || undefined
        });
      }

      ['agenda-filter-start', 'agenda-filter-end', 'appt-date', 'expense-date'].forEach((id) => {
        const input = document.getElementById(id);
        if (!input || input._flatpickr) return;
        window.flatpickr(input, {
          ...topFlatpickrOptions,
          defaultDate: input.value || undefined
        });
      });
    }
    if (topStart) {
      topStart.addEventListener('click', () => {
        topStart.focus();
        if (topStart._flatpickr) topStart._flatpickr.open();
      });
      topStart.addEventListener('input', () => {
        this.topDateRangeUserSelected = true;
        this.syncTopDatesToAgendaFilters();
      });
      topStart.addEventListener('blur', () => {
        this.syncTopDatesToAgendaFilters();
        this.render();
      });
      topStart.addEventListener('change', () => {
        this.syncTopDatesToAgendaFilters();
        this.render();
      });
    }
    if (topEnd) {
      topEnd.addEventListener('click', () => {
        topEnd.focus();
        if (topEnd._flatpickr) topEnd._flatpickr.open();
      });
      topEnd.addEventListener('input', () => {
        this.topDateRangeUserSelected = true;
        this.syncTopDatesToAgendaFilters();
      });
      topEnd.addEventListener('blur', () => {
        this.syncTopDatesToAgendaFilters();
        this.render();
      });
      topEnd.addEventListener('change', () => {
        this.syncTopDatesToAgendaFilters();
        this.render();
      });
    }

    const topStartPickerBtn = document.getElementById('btn-top-date-start-picker');
    if (topStartPickerBtn && topStart) {
      topStartPickerBtn.addEventListener('click', () => {
        topStart.focus();
        if (topStart._flatpickr) topStart._flatpickr.open();
      });
    }

    const topEndPickerBtn = document.getElementById('btn-top-date-end-picker');
    if (topEndPickerBtn && topEnd) {
      topEndPickerBtn.addEventListener('click', () => {
        topEnd.focus();
        if (topEnd._flatpickr) topEnd._flatpickr.open();
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
      if (window.flatpickr) {
        window.flatpickr(clientDobInput, {
          locale: 'pt',
          allowInput: true,
          dateFormat: 'd/m/Y',
          disableMobile: true,
          maxDate: 'today'
        });
      }
      clientDobInput.addEventListener('input', () => {
        clientDobInput.value = this.formatDobDisplay(clientDobInput.value);
      });
      clientDobInput.addEventListener('blur', () => {
        const iso = this.normalizeDobToIso(clientDobInput.value);
        if (iso && clientDobInput._flatpickr) {
          clientDobInput._flatpickr.setDate(iso, false, 'Y-m-d');
        } else if (iso) {
          clientDobInput.value = this.formatDobForDisplay(iso);
        }
      });
    }

    const clientCpfInput = document.getElementById('client-cpf');
    if (clientCpfInput) {
      clientCpfInput.addEventListener('input', () => {
        clientCpfInput.value = this.formatCpfInput(clientCpfInput.value);
      });
      clientCpfInput.addEventListener('blur', () => {
        clientCpfInput.value = this.formatCpfInput(clientCpfInput.value);
      });
    }

    const clientPhoneInput = document.getElementById('client-phone');
    if (clientPhoneInput) {
      clientPhoneInput.addEventListener('input', () => {
        clientPhoneInput.value = this.formatPhoneInput(clientPhoneInput.value);
      });
      clientPhoneInput.addEventListener('blur', () => {
        clientPhoneInput.value = this.formatPhoneInput(clientPhoneInput.value);
      });
    }

    const clientCategoryInput = document.getElementById('client-category');
    if (clientCategoryInput) {
      clientCategoryInput.addEventListener('blur', () => {
        const normalized = this.normalizeClientCategory(clientCategoryInput.value || 'Paciente');
        clientCategoryInput.value = normalized;
        this.rememberClientCategory(normalized);
      });
    }

    const emergencyPhoneInput = document.getElementById('client-emergency-phone');
    if (emergencyPhoneInput) {
      emergencyPhoneInput.addEventListener('input', () => {
        emergencyPhoneInput.value = this.formatPhoneInput(emergencyPhoneInput.value);
      });
      emergencyPhoneInput.addEventListener('blur', () => {
        emergencyPhoneInput.value = this.formatPhoneInput(emergencyPhoneInput.value);
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
      apptDateInput.addEventListener('click', () => {
        if (apptDateInput._flatpickr) {
          apptDateInput._flatpickr.open();
          return;
        }
        if (typeof apptDateInput.showPicker === 'function') apptDateInput.showPicker();
      });
      apptDateInput.addEventListener('blur', () => {
        const iso = this.normalizeDobToIso(apptDateInput.value);
        if (iso && apptDateInput._flatpickr) {
          apptDateInput._flatpickr.setDate(iso, false, 'Y-m-d');
        } else if (iso) {
          apptDateInput.value = this.formatDobForDisplay(iso);
        }
      });
    }

    const expenseDateInput = document.getElementById('expense-date');
    if (expenseDateInput) {
      expenseDateInput.addEventListener('click', () => {
        if (expenseDateInput._flatpickr) {
          expenseDateInput._flatpickr.open();
          return;
        }
        if (typeof expenseDateInput.showPicker === 'function') expenseDateInput.showPicker();
      });
      expenseDateInput.addEventListener('blur', () => {
        const iso = this.normalizeDobToIso(expenseDateInput.value);
        if (iso && expenseDateInput._flatpickr) {
          expenseDateInput._flatpickr.setDate(iso, false, 'Y-m-d');
        } else if (iso) {
          expenseDateInput.value = this.formatDobForDisplay(iso);
        }
      });
    }

    const formExpense = document.getElementById('form-expense');
    if (formExpense) formExpense.addEventListener('submit', (e) => { e.preventDefault(); this.saveExpenseForm(); });

    const manageExpenseCategoriesBtn = document.getElementById('btn-manage-expense-categories');
    if (manageExpenseCategoriesBtn) {
      manageExpenseCategoriesBtn.addEventListener('click', () => this.openExpenseCategoriesModal());
    }

    const closeExpenseCategoriesButtons = ['btn-close-expense-categories', 'btn-close-expense-categories-footer'];
    closeExpenseCategoriesButtons.forEach((id) => {
      const btn = document.getElementById(id);
      if (btn) btn.addEventListener('click', () => this.closeExpenseCategoriesModal());
    });

    const closeClientButtons = ['btn-cancel-client', 'btn-close-client'];
    closeClientButtons.forEach((id) => {
      const btn = document.getElementById(id);
      if (btn) btn.addEventListener('click', () => this.closeClientModal());
    });

    const manageClientGroupsBtn = document.getElementById('btn-manage-client-groups');
    if (manageClientGroupsBtn) {
      manageClientGroupsBtn.addEventListener('click', () => this.openClientGroupsModal());
    }

    const manageClientCategoriesBtn = document.getElementById('btn-manage-client-categories');
    if (manageClientCategoriesBtn) {
      manageClientCategoriesBtn.addEventListener('click', () => this.openClientCategoriesModal());
    }

    const closeClientGroupsButtons = ['btn-close-client-groups', 'btn-close-client-groups-footer'];
    closeClientGroupsButtons.forEach((id) => {
      const btn = document.getElementById(id);
      if (btn) btn.addEventListener('click', () => this.closeClientGroupsModal());
    });

    const closeClientCategoriesButtons = ['btn-close-client-categories', 'btn-close-client-categories-footer'];
    closeClientCategoriesButtons.forEach((id) => {
      const btn = document.getElementById(id);
      if (btn) btn.addEventListener('click', () => this.closeClientCategoriesModal());
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
    const amountNowInput = document.getElementById('pay-amount-now');
    if (amountNowInput) amountNowInput.addEventListener('input', () => this.generatePaymentReceipt());

    const btnGeneratePaymentReceipt = document.getElementById('btn-generate-payment-receipt');
    if (btnGeneratePaymentReceipt) {
      btnGeneratePaymentReceipt.addEventListener('click', () => this.generatePaymentReceipt());
    }

    const receiptDatePicker = document.getElementById('pay-receipt-date-picker');
    if (receiptDatePicker) {
      receiptDatePicker.addEventListener('click', () => {
        if (typeof receiptDatePicker.showPicker === 'function') receiptDatePicker.showPicker();
      });
      receiptDatePicker.addEventListener('change', () => this.addReceiptDateFromPicker());
    }

    const btnAddReceiptDate = document.getElementById('btn-add-receipt-date');
    if (btnAddReceiptDate) {
      btnAddReceiptDate.addEventListener('click', () => this.addReceiptDateFromPicker());
    }

    const btnClearReceiptDates = document.getElementById('btn-clear-receipt-dates');
    if (btnClearReceiptDates) {
      btnClearReceiptDates.addEventListener('click', () => this.clearReceiptDatesList());
    }

    const receiptEditableFieldIds = [
      'pay-receipt-number',
      'pay-receipt-city-uf',
      'pay-receipt-payer-name',
      'pay-receipt-payer-cpf',
      'pay-receipt-patient-name',
      'pay-receipt-patient-cpf',
      'pay-receipt-service',
      'pay-receipt-sessions',
      'pay-receipt-dates',
      'pay-receipt-professional-name',
      'pay-receipt-professional-crp',
      'pay-receipt-professional-cpf',
      'pay-receipt-professional-address'
    ];
    receiptEditableFieldIds.forEach((id) => {
      const field = document.getElementById(id);
      if (!field) return;
      const handler = () => {
        if (id.includes('cpf')) {
          field.value = this.formatCpfInput(field.value);
        }
        this.generatePaymentReceipt();
      };
      field.addEventListener('change', handler);
      field.addEventListener('input', handler);
    });

    const btnTogglePaymentReceiptTemplate = document.getElementById('btn-toggle-payment-receipt-template');
    if (btnTogglePaymentReceiptTemplate) {
      btnTogglePaymentReceiptTemplate.addEventListener('click', () => this.togglePaymentReceiptTemplateEditor());
    }

    const btnTogglePaymentReceiptProfessional = document.getElementById('btn-toggle-payment-receipt-professional');
    if (btnTogglePaymentReceiptProfessional) {
      btnTogglePaymentReceiptProfessional.addEventListener('click', () => this.togglePaymentReceiptProfessionalEditor());
    }

    const btnSavePaymentReceiptTemplate = document.getElementById('btn-save-payment-receipt-template');
    if (btnSavePaymentReceiptTemplate) {
      btnSavePaymentReceiptTemplate.addEventListener('click', () => this.savePaymentReceiptTemplateFromUI());
    }

    const btnResetPaymentReceiptTemplate = document.getElementById('btn-reset-payment-receipt-template');
    if (btnResetPaymentReceiptTemplate) {
      btnResetPaymentReceiptTemplate.addEventListener('click', () => this.resetPaymentReceiptTemplateFromUI());
    }

    const btnPrintPaymentReceipt = document.getElementById('btn-print-payment-receipt');
    if (btnPrintPaymentReceipt) {
      btnPrintPaymentReceipt.addEventListener('click', () => this.printPaymentReceipt());
    }
    const btnDownloadPaymentReceiptPdf = document.getElementById('btn-download-payment-receipt-pdf');
    if (btnDownloadPaymentReceiptPdf) {
      btnDownloadPaymentReceiptPdf.addEventListener('click', () => this.downloadPaymentReceiptPdf());
    }

    const btnNewExpense = document.getElementById('btn-new-expense');
    if (btnNewExpense) btnNewExpense.addEventListener('click', () => this.openExpenseModal());

    const agendaSearch = document.getElementById('agenda-search');
    const agendaStart = document.getElementById('agenda-filter-start');
    const agendaEnd = document.getElementById('agenda-filter-end');
    const agendaStatus = document.getElementById('agenda-filter-status');
    if (agendaSearch) agendaSearch.addEventListener('input', () => this.renderAgendaTable());
    if (agendaStart) {
      agendaStart.addEventListener('click', () => {
        if (agendaStart._flatpickr) {
          agendaStart._flatpickr.open();
          return;
        }
        if (typeof agendaStart.showPicker === 'function') agendaStart.showPicker();
      });
      agendaStart.addEventListener('blur', () => {
        const iso = this.normalizeAgendaDateToIso(agendaStart.value);
        if (iso && agendaStart._flatpickr) {
          agendaStart._flatpickr.setDate(iso, false, 'Y-m-d');
        } else if (iso) {
          agendaStart.value = this.formatAgendaDateDisplay(iso);
        }
        this.renderAgendaTable();
      });
      agendaStart.addEventListener('change', () => {
        const iso = this.normalizeAgendaDateToIso(agendaStart.value);
        if (iso && agendaStart._flatpickr) {
          agendaStart._flatpickr.setDate(iso, false, 'Y-m-d');
        } else if (iso) {
          agendaStart.value = this.formatAgendaDateDisplay(iso);
        }
        this.renderAgendaTable();
      });
    }
    if (agendaEnd) {
      agendaEnd.addEventListener('click', () => {
        if (agendaEnd._flatpickr) {
          agendaEnd._flatpickr.open();
          return;
        }
        if (typeof agendaEnd.showPicker === 'function') agendaEnd.showPicker();
      });
      agendaEnd.addEventListener('blur', () => {
        const iso = this.normalizeAgendaDateToIso(agendaEnd.value);
        if (iso && agendaEnd._flatpickr) {
          agendaEnd._flatpickr.setDate(iso, false, 'Y-m-d');
        } else if (iso) {
          agendaEnd.value = this.formatAgendaDateDisplay(iso);
        }
        this.renderAgendaTable();
      });
      agendaEnd.addEventListener('change', () => {
        const iso = this.normalizeAgendaDateToIso(agendaEnd.value);
        if (iso && agendaEnd._flatpickr) {
          agendaEnd._flatpickr.setDate(iso, false, 'Y-m-d');
        } else if (iso) {
          agendaEnd.value = this.formatAgendaDateDisplay(iso);
        }
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
        this.syncTopDatesToAgendaFilters();
        this.renderAgendaTable();
      });
    }

    if (btnAgendaViewCalendar) {
      btnAgendaViewCalendar.addEventListener('click', () => {
        this.agendaViewMode = 'calendar';
        this.syncTopDatesToAgendaFilters();
        this.renderAgendaTable();
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

    const btnAgendaDayCollapse = document.getElementById('btn-agenda-day-collapse');
    if (btnAgendaDayCollapse) {
      btnAgendaDayCollapse.addEventListener('click', () => this.toggleAgendaDayMiniCalendar());
    }

    const agendaHourRangeStartInput = document.getElementById('agenda-hour-range-start');
    const agendaHourRangeEndInput = document.getElementById('agenda-hour-range-end');
    const btnAgendaHourRangeReset = document.getElementById('btn-agenda-hour-range-reset');
    const applyAgendaHourRangeFromInputs = () => {
      const parseHour = (value) => {
        const match = /^(\d{1,2}):/.exec(String(value || '').trim());
        return match ? Number(match[1]) : NaN;
      };
      const startHour = parseHour(agendaHourRangeStartInput && agendaHourRangeStartInput.value);
      const endHour = parseHour(agendaHourRangeEndInput && agendaHourRangeEndInput.value);
      if (Number.isNaN(startHour) || Number.isNaN(endHour)) return;
      this.setAgendaHourRange(startHour, endHour);
    };
    if (agendaHourRangeStartInput) agendaHourRangeStartInput.addEventListener('change', applyAgendaHourRangeFromInputs);
    if (agendaHourRangeEndInput) agendaHourRangeEndInput.addEventListener('change', applyAgendaHourRangeFromInputs);
    if (btnAgendaHourRangeReset) {
      btnAgendaHourRangeReset.addEventListener('click', () => this.resetAgendaHourRange());
    }
    this.updateAgendaHourRangeInputsUI();

    const clientesSearch = document.getElementById('clientes-search');
    const clientesPhoneFilter = document.getElementById('clientes-phone-filter');
    const clientesCategoryFilter = document.getElementById('clientes-category-filter');
    if (clientesSearch) clientesSearch.addEventListener('input', () => this.renderClientsTable());
    if (clientesPhoneFilter) clientesPhoneFilter.addEventListener('change', () => this.renderClientsTable());
    if (clientesCategoryFilter) clientesCategoryFilter.addEventListener('change', () => this.renderClientsTable());

    Object.keys(CLIENT_MANAGED_LISTS).forEach((type) => {
      const cfg = CLIENT_MANAGED_LISTS[type];

      const filterEl = document.getElementById(cfg.filterId);
      if (filterEl) filterEl.addEventListener('change', () => this.renderClientsTable());

      const manageBtn = document.getElementById(`btn-manage-client-${type === 'planoFinanceiro' ? 'plano-financeiro' : type}`);
      if (manageBtn) manageBtn.addEventListener('click', () => this.openManagedListModal(type));

      const modal = document.getElementById(cfg.modalId);
      if (modal) {
        modal.querySelectorAll('[data-close-managed-modal]').forEach((btn) => {
          btn.addEventListener('click', () => this.closeManagedListModal(type));
        });
      }
    });

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

    const btnToggleVoiceNarration = document.getElementById('btn-toggle-voice-narration');
    if (btnToggleVoiceNarration) {
      btnToggleVoiceNarration.addEventListener('click', () => {
        this.toggleVoiceNarrationFlag();
      });
    }

    const btnTestSound = document.getElementById('btn-test-sound');
    const btnEnableNotifications = document.getElementById('btn-enable-notifications');
    const notificationPermissionPill = document.getElementById('notification-permission-pill');
    if (btnTestSound) {
      btnTestSound.addEventListener('click', async () => {
        await this.ensureNotificationPermission(true, true);
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
        await this.ensureNotificationPermission(true, true);
        this.updateNotificationPermissionUI();
      });
    }

    if (notificationPermissionPill) {
      const openDiagnostics = () => this.showNotificationSoundDiagnostics();
      notificationPermissionPill.addEventListener('click', openDiagnostics);
      notificationPermissionPill.addEventListener('keydown', (event) => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        openDiagnostics();
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
        if (this.firebaseConnected && this.firebaseDb) {
          this.boostFirebaseSyncPolling(26000, 'aba-visivel');
          void this.syncDataWithFirebase({ skipDirtyPush: true, silent: true }).catch((err) => {
            console.log('Falha ao sincronizar ao voltar para a aba:', err);
          });
        }
      }
    });

    window.addEventListener('focus', () => {
      this.checkAppointmentReminders();
      this.updateNotificationPermissionUI();
      if (this.firebaseConnected && this.firebaseDb) {
        this.boostFirebaseSyncPolling(26000, 'janela-em-foco');
        void this.syncDataWithFirebase({ skipDirtyPush: true, silent: true }).catch((err) => {
          console.log('Falha ao sincronizar ao focar a janela:', err);
        });
      }
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
      'dash-card-despesas': 'despesas',
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

    const btnFinanceReceiptProfessional = document.getElementById('btn-finance-receipt-professional');
    if (btnFinanceReceiptProfessional) {
      btnFinanceReceiptProfessional.addEventListener('click', () => this.toggleFinanceReceiptProfessionalCard());
    }

    const btnFinanceReceiptProfessionalSave = document.getElementById('btn-finance-receipt-professional-save');
    if (btnFinanceReceiptProfessionalSave) {
      btnFinanceReceiptProfessionalSave.addEventListener('click', () => this.saveFinanceReceiptProfessionalCard());
    }

    const btnFinanceReceiptProfessionalClose = document.getElementById('btn-finance-receipt-professional-close');
    if (btnFinanceReceiptProfessionalClose) {
      btnFinanceReceiptProfessionalClose.addEventListener('click', () => this.toggleFinanceReceiptProfessionalCard(false));
    }

    const financeReceiptProfessionalCpf = document.getElementById('finance-receipt-professional-cpf');
    if (financeReceiptProfessionalCpf) {
      financeReceiptProfessionalCpf.addEventListener('input', () => {
        financeReceiptProfessionalCpf.value = this.formatCpfInput(financeReceiptProfessionalCpf.value);
      });
      financeReceiptProfessionalCpf.addEventListener('blur', () => {
        financeReceiptProfessionalCpf.value = this.formatCpfInput(financeReceiptProfessionalCpf.value);
      });
    }

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
    const normalizedTabId = tabId === 'dashboard' ? 'panil' : tabId;
    const requestedTab = document.getElementById(`tab-${normalizedTabId}`) ? normalizedTabId : 'panil';
    const canAccessConfig = this.applyConfigAccessControl();
    const targetId = (requestedTab === 'config' && !canAccessConfig) ? 'panil' : requestedTab;
    if (requestedTab === 'config' && !canAccessConfig) {
      this.showToast('Apenas o usuário master pode acessar Configurações.', 'warning');
    }
    this.currentTab = targetId;

    const pageTitle = document.getElementById('page-title');
    const pageSubtitle = document.getElementById('page-subtitle');
    const tabMeta = {
      panil: { title: 'Consultório Control', subtitle: 'Gestão de clientes, agenda e financeiro' },
      agenda: { title: 'Agenda & Consultas', subtitle: 'Gerencie horários, sessões e atendimentos do período' },
      clientes: { title: 'Clientes', subtitle: 'Cadastros, contatos e histórico de pacientes' },
      financeiro: { title: 'Financeiro', subtitle: 'Recebimentos, pendências e relatórios do período' },
      despesas: { title: 'Despesas', subtitle: 'Controle de gastos operacionais do consultório' },
      whatsapp: { title: 'WhatsApp', subtitle: 'Modelos e envios de mensagens para os clientes' },
      senha: { title: 'Senha', subtitle: 'Atualize o acesso com segurança' },
      graficos: { title: 'Gráficos', subtitle: 'Visualizações e indicadores do consultório' },
      config: { title: 'Configurações', subtitle: 'Ajustes gerais e integrações do sistema' }
    };
    const meta = tabMeta[this.currentTab] || tabMeta.panil;
    if (pageTitle) pageTitle.textContent = meta.title;
    if (pageSubtitle) pageSubtitle.textContent = meta.subtitle;

    const btnHeaderBack = document.getElementById('btn-header-back');
    if (btnHeaderBack) {
      const showBack = this.currentTab !== 'panil';
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

    document.body.classList.toggle('agenda-view', this.currentTab === 'agenda');
    document.body.classList.toggle('clientes-view', this.currentTab === 'clientes');
    document.body.classList.toggle('financeiro-view', this.currentTab === 'financeiro');
    document.body.classList.toggle('despesas-view', this.currentTab === 'despesas');
    document.body.classList.toggle('whatsapp-view', this.currentTab === 'whatsapp');
    document.body.classList.toggle('senha-view', this.currentTab === 'senha');
    document.body.classList.toggle('graficos-view', this.currentTab === 'graficos');
    document.body.classList.toggle('config-view', this.currentTab === 'config');
    document.body.classList.toggle('panil-view', this.currentTab === 'panil');

    if (this.currentTab !== 'agenda') this.agendaReturnTab = null;
    const btnAgendaReturn = document.getElementById('btn-agenda-return-clientes');
    if (btnAgendaReturn) btnAgendaReturn.style.display = (this.currentTab === 'agenda' && this.agendaReturnTab === 'clientes') ? 'inline-flex' : 'none';

    if (window.matchMedia && window.matchMedia('(max-width: 900px)').matches) {
      const main = document.querySelector('.main-content');
      if (main && typeof main.scrollIntoView === 'function') {
        main.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }

    this.render();
    if (this.firebaseConnected && this.firebaseDb) {
      void this.syncDataWithFirebase({ skipDirtyPush: true, silent: true }).catch((err) => {
        console.log('Falha ao sincronizar ao trocar de aba:', err);
      });
    }
    this.syncDashboardCardFromTab(this.currentTab, previousTab);
  }

  parseReminderRouteParams(params) {
    if (!params || typeof params.get !== 'function') return null;
    const open = String(params.get('open') || '').toLowerCase();
    const focus = String(params.get('focus') || '').toLowerCase();
    if (open !== 'agenda' || focus !== 'reminder') return null;

    return {
      open: 'agenda',
      focus: 'reminder',
      appointmentId: String(params.get('appointmentId') || '').trim()
    };
  }

  queueReminderRouteFromUrl(targetUrl = '') {
    const raw = String(targetUrl || '').trim();
    if (!raw) return false;

    try {
      const parsed = new URL(raw, window.location.origin);
      const route = this.parseReminderRouteParams(parsed.searchParams);
      if (!route) return false;
      this.pendingNotificationRoute = route;
      return true;
    } catch (err) {
      return false;
    }
  }

  captureReminderRouteFromCurrentUrl() {
    const queued = this.queueReminderRouteFromUrl(window.location.href || './');
    if (!queued) return;

    if (window.history && typeof window.history.replaceState === 'function') {
      const cleanUrl = `${window.location.pathname || './'}${window.location.hash || ''}`;
      window.history.replaceState({}, document.title, cleanUrl || './');
    }
  }

  applyPendingReminderRoute() {
    if (!this.localLoginUnlocked) return false;
    if (!this.pendingNotificationRoute) return false;

    const route = this.pendingNotificationRoute;
    this.pendingNotificationRoute = null;

    if (route.open !== 'agenda') return false;

    const today = getTodayStr();
    const agendaSearch = document.getElementById('agenda-search');
    const agendaStart = document.getElementById('agenda-filter-start');
    const agendaEnd = document.getElementById('agenda-filter-end');
    const agendaStatus = document.getElementById('agenda-filter-status');

    if (agendaSearch) agendaSearch.value = '';
    if (agendaStart) agendaStart.value = this.formatAgendaDateForInput(today);
    if (agendaEnd) agendaEnd.value = this.formatAgendaDateForInput(today);
    if (agendaStatus) {
      const hasAgendado = Array.from(agendaStatus.options || []).some((option) => option.value === 'Agendado');
      agendaStatus.value = hasAgendado ? 'Agendado' : 'todos';
    }

    this.switchTab('agenda');
    this.showToast('Agenda aberta pelo lembrete de atendimento.', 'info');

    if (route.appointmentId) {
      this.activateAgendaReminderFocus(route.appointmentId, 12000);
      window.setTimeout(() => this.openAppointmentModal(route.appointmentId), 140);
    }

    return true;
  }

  handleServiceWorkerMessage(data = {}) {
    if (!data || typeof data !== 'object') return;
    if (String(data.type || '') !== 'OPEN_REMINDER_ROUTE') return;

    const queued = this.queueReminderRouteFromUrl(String(data.url || './'));
    if (queued && this.localLoginUnlocked) {
      this.applyPendingReminderRoute();
    }
  }

  activateAgendaReminderFocus(appointmentId, durationMs = 12000) {
    const id = String(appointmentId || '').trim();
    if (!id) return;

    this.agendaAttentionAppointmentId = id;
    this.agendaAttentionNeedsFocus = true;

    if (this.agendaAttentionTimerId) {
      window.clearTimeout(this.agendaAttentionTimerId);
      this.agendaAttentionTimerId = null;
    }

    this.agendaAttentionTimerId = window.setTimeout(() => {
      this.agendaAttentionAppointmentId = '';
      this.agendaAttentionNeedsFocus = false;
      this.agendaAttentionTimerId = null;
      if (this.currentTab === 'agenda') this.renderAgendaTable();
    }, Math.max(1200, Number(durationMs) || 12000));

    if (this.currentTab === 'agenda') {
      this.renderAgendaTable();
    }
  }

  focusAgendaReminderTarget() {
    const targetId = String(this.agendaAttentionAppointmentId || '').trim();
    if (!targetId) return;

    const targetNodes = Array.from(document.querySelectorAll('[data-appointment-id]'))
      .filter((node) => String(node.getAttribute('data-appointment-id') || '') === targetId);

    if (!targetNodes.length) return;

    const visibleNode = targetNodes.find((node) => {
      if (!node || typeof node.getClientRects !== 'function') return false;
      return node.getClientRects().length > 0;
    }) || targetNodes[0];

    if (this.agendaAttentionNeedsFocus && visibleNode && typeof visibleNode.scrollIntoView === 'function') {
      visibleNode.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
      targetNodes.forEach((node) => node.classList.add('agenda-reminder-target-pulse'));
      window.setTimeout(() => {
        targetNodes.forEach((node) => node.classList.remove('agenda-reminder-target-pulse'));
      }, 1800);
      this.agendaAttentionNeedsFocus = false;
    }
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

    this.applyLandscapeSidebarState();
    void this.tryAutoConnectGoogleCalendar();
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

  saveFirebaseConfig(config, options = {}) {
    try {
      localStorage.setItem(FIREBASE_CONFIG_STORAGE_KEY, JSON.stringify(config));
      this.bumpVersion();
      if (!options || options.skipSync !== true) {
        this.markSharedSettingsDirty('firebase-config');
      }
    } catch (err) {
      console.log('Falha ao salvar configuração do Firebase:', err);
    }
  }

  prefillGoogleCalendarConfig() {
    const input = document.getElementById('cfg-google-calendar-client-id');
    if (!input) return;

    const storedClientId = this.loadGoogleCalendarClientId();
    input.value = storedClientId || '';
    this.googleCalendarClientId = String(storedClientId || '').trim();
    this.updateGoogleCalendarStatus(this.googleCalendarAuthorized ? 'ok' : (storedClientId ? 'ready' : 'offline'));
    this.renderGoogleCalendarSyncTimes();
  }

  renderGoogleCalendarSyncTimes() {
    const importedElement = document.getElementById('google-calendar-last-imported');
    const formatStoredTime = (storageKey, emptyLabel) => {
      try {
        const rawValue = String(localStorage.getItem(storageKey) || '').trim();
        const date = rawValue ? new Date(rawValue) : null;
        return date && !Number.isNaN(date.getTime())
          ? date.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
          : emptyLabel;
      } catch (err) {
        return emptyLabel;
      }
    };

    if (importedElement) importedElement.textContent = formatStoredTime(GOOGLE_CALENDAR_LAST_IMPORTED_STORAGE_KEY, 'Ainda não importado');
  }

  recordGoogleCalendarSyncTime() {
    try {
      localStorage.setItem(GOOGLE_CALENDAR_LAST_IMPORTED_STORAGE_KEY, new Date().toISOString());
    } catch (err) {
      console.log('Falha ao salvar horário da sincronização do Google Calendar:', err);
    }
    this.renderGoogleCalendarSyncTimes();
  }

  normalizeGoogleCalendarClientId(clientId) {
    const raw = String(clientId || '').trim();
    // Keep OAuth stable by using the configured production Client ID.
    return raw === GOOGLE_CALENDAR_REQUIRED_CLIENT_ID
      ? raw
      : GOOGLE_CALENDAR_REQUIRED_CLIENT_ID;
  }

  loadGoogleCalendarClientId() {
    try {
      const raw = String(localStorage.getItem(GOOGLE_CALENDAR_CLIENT_ID_STORAGE_KEY) || '').trim();
      const normalized = this.normalizeGoogleCalendarClientId(raw);
      if (raw !== normalized) {
        localStorage.setItem(GOOGLE_CALENDAR_CLIENT_ID_STORAGE_KEY, normalized);
      }
      return normalized;
    } catch (err) {
      return GOOGLE_CALENDAR_REQUIRED_CLIENT_ID;
    }
  }

  saveGoogleCalendarClientId(clientId, options = {}) {
    const rawClientId = String(clientId || '').trim();
    const safeClientId = this.normalizeGoogleCalendarClientId(rawClientId);
    const looksLikeSecret = /^GOCSPX-/i.test(safeClientId) || /client_secret/i.test(safeClientId);

    if (looksLikeSecret) {
      this.updateGoogleCalendarStatus('error', 'Nao salve segredos no navegador. Use apenas o Client ID do tipo Web.');
      this.showToast('Valor bloqueado. Use apenas o Client ID do Google Calendar.', 'warning');
      return false;
    }

    try {
      if (safeClientId) {
        localStorage.setItem(GOOGLE_CALENDAR_CLIENT_ID_STORAGE_KEY, safeClientId);
      } else {
        localStorage.removeItem(GOOGLE_CALENDAR_CLIENT_ID_STORAGE_KEY);
      }
      this.googleCalendarClientId = safeClientId;
      const input = document.getElementById('cfg-google-calendar-client-id');
      if (input && input.value !== safeClientId) {
        input.value = safeClientId;
      }
      if (rawClientId && rawClientId !== safeClientId) {
        this.showToast('Client ID ajustado para o ID oficial configurado deste app.', 'info');
      }
      this.bumpVersion();
      this.updateGoogleCalendarStatus(safeClientId ? 'ready' : 'offline');
      if (!options || options.skipSync !== true) {
        this.markSharedSettingsDirty('google-calendar-client-id');
      }
      return true;
    } catch (err) {
      console.log('Falha ao salvar Client ID do Google Calendar:', err);
      this.showToast('Falha ao salvar o Client ID do Google Calendar.', 'warning');
      return false;
    }
  }

  updateGoogleCalendarStatus(state = 'offline', message = '') {
    const panel = document.getElementById('google-calendar-status');
    if (!panel) return;

    const summary = panel.querySelector('.firebase-validation-summary') || panel;
    const normalizedState = String(state || 'offline').toLowerCase();
    panel.classList.remove('is-ok', 'is-warning', 'is-error');

    if (normalizedState === 'ok') {
      panel.classList.add('is-ok');
      summary.textContent = message || 'Google Calendar conectado e pronto.';
      return;
    }

    if (normalizedState === 'ready') {
      panel.classList.add('is-warning');
      summary.textContent = message || 'Client ID salvo. Clique em Conectar para autorizar acesso ao calendário.';
      return;
    }

    if (normalizedState === 'pending') {
      panel.classList.add('is-warning');
      summary.textContent = message || 'Autorizando Google Calendar...';
      return;
    }

    if (normalizedState === 'error') {
      panel.classList.add('is-error');
      summary.textContent = message || 'Falha ao conectar Google Calendar.';
      return;
    }

    summary.textContent = message || 'Google Calendar desconectado.';
    this.updateGoogleCalendarOriginHint();
  }

  updateGoogleCalendarOriginHint() {
    const hint = document.getElementById('google-calendar-origin-hint');
    if (!hint) return;

    const origin = window.location && window.location.origin ? window.location.origin : 'origem desconhecida';
    const path = window.location && window.location.pathname ? window.location.pathname : '';
    const isAllowed = GOOGLE_CALENDAR_ALLOWED_ORIGINS.includes(origin);
    const suffix = path ? ` ${path}` : '';
    hint.textContent = isAllowed
      ? `Origem atual autorizada: ${origin}${suffix}`
      : `Atenção: origem não autorizada no Google OAuth. Atual: ${origin}${suffix}`;
    hint.style.color = isAllowed ? '' : '#f97316';
    hint.style.fontWeight = isAllowed ? '' : '700';
  }

  clearGoogleCalendarAutoSyncSchedule() {
    if (this.googleCalendarAutoSyncIntervalId) {
      window.clearInterval(this.googleCalendarAutoSyncIntervalId);
      this.googleCalendarAutoSyncIntervalId = null;
    }
    this.googleCalendarAutoSyncInFlight = false;
  }

  scheduleGoogleCalendarAutoSync() {
    this.clearGoogleCalendarAutoSyncSchedule();

    if (!this.googleCalendarAuthorized) return;
    if (typeof this.importGoogleCalendarIntoLocalAgenda !== 'function') return;

    const runAutoSync = async () => {
      if (!this.googleCalendarAuthorized) return;
      if (this.googleCalendarAutoSyncInFlight) return;
      if (Date.now() < Number(this.googleCalendarRateLimitUntil || 0)) {
        this.logSyncAudit('warning', 'Auto-sync Google Calendar adiado: aguardando fim do cooldown de rate limit.');
        return;
      }

      this.googleCalendarAutoSyncInFlight = true;
      try {
        await this.importGoogleCalendarIntoLocalAgenda({ showToast: false });
        this.updateGoogleCalendarStatus('ok', 'Sincronização automática executada.');
        this.logSyncAudit('info', 'Sincronização automática Google Calendar executada a cada 6h.');
      } catch (err) {
        const message = String((err && err.message) || err || 'erro desconhecido');
        this.logSyncAudit('warning', `Falha na sincronização automática do Google Calendar: ${message}`);
      } finally {
        this.googleCalendarAutoSyncInFlight = false;
      }
    };

    this.googleCalendarAutoSyncIntervalId = window.setInterval(() => {
      void runAutoSync();
    }, this.googleCalendarAutoSyncEveryMs);
  }

  isGoogleCalendarOriginAllowed() {
    const origin = window.location && window.location.origin ? window.location.origin : '';
    return GOOGLE_CALENDAR_ALLOWED_ORIGINS.includes(origin);
  }

  renderGoogleCalendarEventsList(events = []) {
    const panel = document.getElementById('google-calendar-events-panel');
    if (!panel) return;

    const summary = panel.querySelector('.firebase-validation-summary') || panel;
    const items = Array.isArray(events) ? events : [];

    if (!items.length) {
      summary.textContent = 'Nenhum evento futuro encontrado no Google Calendar.';
      panel.dataset.count = '0';
      return;
    }

    const lines = items.slice(0, 8).map((event) => {
      const rawStart = event && event.start ? (event.start.dateTime || event.start.date || '') : '';
      const when = String(rawStart || '').trim();
      const title = String((event && event.summary) || 'Sem título').trim();
      const location = String((event && event.location) || '').trim();
      return `${when || 'Sem data'} · ${title}${location ? ` · ${location}` : ''}`;
    });

    summary.innerHTML = `
      <strong>Próximos eventos (${items.length})</strong>
      <ul style="margin:0.65rem 0 0 1rem; padding:0; display:grid; gap:0.35rem;">
        ${lines.map((line) => `<li>${line}</li>`).join('')}
      </ul>
    `;
    panel.dataset.count = String(items.length);
  }

  async fetchAllGoogleCalendarEvents(params) {
    const events = [];
    let pageToken = '';

    do {
      const requestParams = pageToken ? { ...params, pageToken } : { ...params };
      const response = await window.gapi.client.calendar.events.list(requestParams);
      const items = Array.isArray(response && response.result && response.result.items)
        ? response.result.items
        : [];
      events.push(...items);
      pageToken = String((response && response.result && response.result.nextPageToken) || '').trim();
    } while (pageToken);

    return events;
  }

  parseGoogleCalendarEventToLocalAppointmentRaw(event) {
    const sourceEvent = event && typeof event === 'object' ? event : {};
    const eventId = String(sourceEvent.id || '').trim();
    if (!eventId) return null;

    const start = sourceEvent.start || {};
    const rawDateTime = String(start.dateTime || '').trim();
    const rawDate = String(start.date || '').trim();

    let date = '';
    let time = '08:00';

    if (rawDateTime) {
      const parsed = new Date(rawDateTime);
      if (Number.isNaN(parsed.getTime())) return null;
      date = `${parsed.getFullYear()}-${String(parsed.getMonth() + 1).padStart(2, '0')}-${String(parsed.getDate()).padStart(2, '0')}`;
      time = `${String(parsed.getHours()).padStart(2, '0')}:${String(parsed.getMinutes()).padStart(2, '0')}`;
    } else if (/^\d{4}-\d{2}-\d{2}$/.test(rawDate)) {
      date = rawDate;
    } else {
      return null;
    }

    const summary = String(sourceEvent.summary || '').trim() || 'Cliente';
    const description = String(sourceEvent.description || '').trim();
    const location = String(sourceEvent.location || '').trim();

    const descriptionClientMatch = description.match(/(?:^|\n)\s*Paciente\s*:\s*(.+)\s*(?:\n|$)/i);
    const descriptionProcedureMatch = description.match(/(?:^|\n)\s*Procedimento\s*:\s*(.+)\s*(?:\n|$)/i);

    const summaryParts = summary.split('·').map((part) => String(part || '').trim()).filter(Boolean);
    const clientName = String(
      (descriptionClientMatch && descriptionClientMatch[1])
      || summaryParts[0]
      || summary
      || 'Cliente'
    ).trim() || 'Cliente';
    const procedure = String(
      (descriptionProcedureMatch && descriptionProcedureMatch[1])
      || (summaryParts.length > 1 ? summaryParts.slice(1).join(' · ') : '')
      || 'Consulta'
    ).trim() || 'Consulta';

    const isOwnTemplateDescription = /ID Consulta \(Consultório Control\)\s*:/i.test(description);
    const observacoesMatch = description.match(/(?:^|\n)\s*Observações\s*:\s*([\s\S]*?)(?:\n\s*\n\s*ID Consulta \(Consultório Control\)|$)/i);
    const cleanedDescription = isOwnTemplateDescription
      ? String((observacoesMatch && observacoesMatch[1]) || '').trim()
      : description;

    const notesParts = [];
    if (cleanedDescription) notesParts.push(cleanedDescription);
    if (location) notesParts.push(`Local: ${location}`);
    if (sourceEvent.htmlLink) notesParts.push(`Google: ${sourceEvent.htmlLink}`);

    return {
      id: `gcal-${eventId}`,
      googleEventId: eventId,
      googleCalendarUpdatedAt: String(sourceEvent.updated || '').trim(),
      source: 'google-calendar',
      clientName,
      date,
      time,
      procedure,
      price: 0,
      amountPaid: 0,
      paymentMethod: 'Pix',
      status: 'Agendado',
      paymentStatus: 'Pendente',
      notes: notesParts.join('\n\n').trim(),
      color: DEFAULT_APPOINTMENT_COLOR
    };
  }

  ensureClientForGoogleCalendarName(clientName) {
    const normalizedName = this.normalizeIdentityName(clientName || '');
    if (!normalizedName) return null;

    const existing = this.clients.find((client) => this.normalizeIdentityName((client && client.name) || '') === normalizedName) || null;
    if (existing) return existing;

    const generatedId = `client-gcal-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    const created = {
      id: generatedId,
      name: String(clientName || 'Cliente').trim() || 'Cliente',
      category: 'Paciente',
      phone: '',
      email: '',
      cpf: '',
      rg: '',
      dob: '',
      group: 'Google Calendar',
      cep: '',
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
      notes: 'Criado automaticamente a partir de evento importado do Google Calendar.',
      emergencyName: '',
      emergencyPhone: '',
      emergencyRelation: '',
      referralSource: 'Google Calendar',
      referralNotes: '',
      anamnese: null,
      createdAt: getTodayStr(),
      registrationNumber: this.getNextClientRegistrationNumber()
    };

    this.clients.push(created);
    this.rememberClientGroup('Google Calendar');
    return created;
  }

  // Agendas do Google que não representam compromissos reais do consultório (feriados,
  // aniversários de contatos) e que por padrão aparecem na lista de qualquer conta.
  // Identificadas pelo sufixo do id (não pelo nome exibido, que o usuário pode renomear).
  isNonAppointmentGoogleCalendarId(calendarId) {
    const id = String(calendarId || '').trim().toLowerCase();
    if (!id) return false;
    return /#holiday@group\.v\.calendar\.google\.com$/.test(id)
      || /#contacts@group\.v\.calendar\.google\.com$/.test(id)
      || id === 'addressbook#contacts@group.v.calendar.google.com';
  }

  // Lista todas as agendas do Google às quais o usuário tem acesso (não só "primary"), para que
  // a importação traga compromissos criados em agendas secundárias/compartilhadas (ex.:
  // "CONSULTÓRIO", "PsicoManager", agendas de terceiros). Se a chamada falhar — por exemplo,
  // porque o usuário ainda não reautorizou com o escopo calendar.calendarlist.readonly — cai de
  // volta para ['primary'] silenciosamente, preservando o comportamento anterior em vez de quebrar
  // a importação inteira.
  async listGoogleAppointmentCalendarIds() {
    try {
      const response = await window.gapi.client.calendar.calendarList.list({
        minAccessRole: 'freeBusyReader',
        showHidden: true,
        maxResults: 250
      });
      const items = Array.isArray(response && response.result && response.result.items)
        ? response.result.items
        : [];

      const ids = items
        .filter((cal) => cal && !cal.deleted && !cal.primary)
        .filter((cal) => String((cal && cal.accessRole) || '').trim().toLowerCase() !== 'freebusyreader')
        .map((cal) => String((cal && cal.id) || '').trim())
        .filter((id) => id && !this.isNonAppointmentGoogleCalendarId(id));

      // 'primary' é sempre incluído primeiro: é o alias estável para a agenda principal do
      // usuário (o id "real" dela na resposta é o próprio e-mail, filtrado acima via cal.primary
      // para não buscar a mesma agenda duas vezes sob ids diferentes).
      const uniqueIds = Array.from(new Set(ids));
      uniqueIds.unshift('primary');
      return uniqueIds;
    } catch (err) {
      const message = String((err && err.result && err.result.error && err.result.error.message) || (err && err.message) || err).trim();
      this.logSyncAudit('warning', `Não foi possível listar todas as agendas do Google (usando somente a principal). Reconecte o Google Calendar para conceder acesso à lista de agendas. Detalhe: ${message}`);
      return ['primary'];
    }
  }

  findExistingAppointmentForGoogleEvent(rawRecord = {}) {
    const googleEventId = String(rawRecord.googleEventId || '').trim();
    const idByGoogle = googleEventId ? `gcal-${googleEventId}` : '';
    const date = String(rawRecord.date || '').trim();
    const time = this.normalizeAppointmentTime(rawRecord.time || '') || '08:00';
    const clientNameKey = this.normalizeIdentityName(rawRecord.clientName || '');

    const byGoogleEventId = googleEventId
      ? this.appointments.find((appointment) => String((appointment && appointment.googleEventId) || '').trim() === googleEventId) || null
      : null;
    if (byGoogleEventId) return byGoogleEventId;

    const byId = idByGoogle
      ? this.appointments.find((appointment) => String((appointment && appointment.id) || '').trim() === idByGoogle) || null
      : null;
    if (byId) return byId;

    if (!date || !clientNameKey) return null;

    return this.appointments.find((appointment) => {
      if (!appointment || typeof appointment !== 'object') return false;
      const sameDate = String(appointment.date || '').trim() === date;
      const sameTime = (this.normalizeAppointmentTime(appointment.time || '') || '08:00') === time;
      const sameClient = this.normalizeIdentityName(appointment.clientName || '') === clientNameKey;
      return sameDate && sameTime && sameClient;
    }) || null;
  }

  async importGoogleCalendarEventsToAppointments() {
    const now = new Date();
    const timeMin = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate()).toISOString();
    const timeMax = new Date(now.getFullYear() + 2, now.getMonth(), now.getDate()).toISOString();

    // Antes buscava só a agenda "primary": compromissos criados/movidos para outras agendas do
    // Google (ex.: "CONSULTÓRIO", "PsicoManager", agendas compartilhadas) nunca eram vistos pela
    // importação, mesmo aparecendo normalmente na visão semanal do Google Calendar. Agora percorre
    // todas as agendas relevantes do usuário (ver listGoogleAppointmentCalendarIds).
    const calendarIds = await this.listGoogleAppointmentCalendarIds();

    const seenEventIds = new Set();
    const events = [];
    for (const calendarId of calendarIds) {
      let calendarEvents = [];
      try {
        calendarEvents = await this.fetchAllGoogleCalendarEvents({
          calendarId,
          timeMin,
          timeMax,
          showDeleted: false,
          singleEvents: true,
          maxResults: 2500,
          orderBy: 'startTime'
        });
      } catch (err) {
        const message = String((err && err.result && err.result.error && err.result.error.message) || (err && err.message) || err).trim();
        this.logSyncAudit('warning', `Falha ao ler a agenda "${calendarId}" do Google (pulando esta agenda): ${message}`);
        continue;
      }

      calendarEvents.forEach((event) => {
        // Mesmo evento pode, em tese, ser retornado por mais de uma agenda consultada (ex.: um
        // convite compartilhado entre a agenda principal e uma secundária): mantém só a 1ª ocorrência.
        const eventId = String((event && event.id) || '').trim();
        if (eventId && seenEventIds.has(eventId)) return;
        if (eventId) seenEventIds.add(eventId);
        events.push(event);
      });
    }

    let createdClients = 0;
    let insertedAppointments = 0;
    let updatedAppointments = 0;
    let touched = false;

    events.forEach((event) => {
      const status = String((event && event.status) || '').toLowerCase();
      if (status === 'cancelled') return;

      const raw = this.parseGoogleCalendarEventToLocalAppointmentRaw(event);
      if (!raw) return;

      const existingClientBefore = this.clients.length;
      const client = this.ensureClientForGoogleCalendarName(raw.clientName);
      if (!client) return;
      if (this.clients.length > existingClientBefore) createdClients += 1;

      raw.clientId = String(client.id || '').trim();
      raw.clientName = String(client.name || raw.clientName || 'Cliente').trim() || 'Cliente';

      const existingAppointment = this.findExistingAppointmentForGoogleEvent(raw);
      const normalizedIncoming = this.normalizeSingleAppointmentRecord(raw, 'google-calendar-import');

      if (!existingAppointment) {
        this.appointments.push(normalizedIncoming);
        insertedAppointments += 1;
        touched = true;
        this.logSyncAudit('info', `Google -> Agenda inserido: "${raw.clientName}" em ${raw.date} ${raw.time} (googleEventId=${raw.googleEventId}).`);
        return;
      }

      const existingIsGoogleManaged = String((existingAppointment.source || '')).toLowerCase() === 'google-calendar'
        || String(existingAppointment.id || '').startsWith('gcal-')
        || String(existingAppointment.googleEventId || '').trim() === String(raw.googleEventId || '').trim();

      if (!existingIsGoogleManaged && !String(existingAppointment.googleEventId || '').trim()) {
        existingAppointment.googleEventId = String(raw.googleEventId || '').trim();
        existingAppointment.googleCalendarUpdatedAt = String(raw.googleCalendarUpdatedAt || '').trim();
        existingAppointment.source = existingAppointment.source || 'local';
        updatedAppointments += 1;
        touched = true;
        return;
      }

      // Appointments originally created locally and synced to Google: only sync logistics fields back.
      // Appointments originally imported from Google: sync all non-clinical fields.
      const isLocalOrigin = String(existingAppointment.source || '').toLowerCase() !== 'google-calendar';
      const fieldsToUpdate = isLocalOrigin
        ? ['date', 'time', 'googleEventId', 'googleCalendarUpdatedAt']
        : ['clientId', 'clientName', 'date', 'time', 'procedure', 'notes', 'googleEventId', 'googleCalendarUpdatedAt', 'source'];

      let hasDiff = false;
      fieldsToUpdate.forEach((field) => {
        const nextValue = normalizedIncoming[field];
        if (String(existingAppointment[field] ?? '') === String(nextValue ?? '')) return;
        existingAppointment[field] = nextValue;
        hasDiff = true;
      });

      if (hasDiff) {
        updatedAppointments += 1;
        touched = true;
      }
    });

    if (touched) {
      this.reconcileAppointmentsClientLinks();
      this.saveData();
      this.restoreAgendaFiltersForLoadedAppointments();
      this.render();
    }

    return {
      totalGoogleEvents: events.length,
      createdClients,
      insertedAppointments,
      updatedAppointments
    };
  }

  async importGoogleCalendarIntoLocalAgenda(options = {}) {
    const initialized = await this.initGoogleCalendarClient();
    if (!initialized) return;

    if (!this.googleCalendarAuthorized) {
      this.updateGoogleCalendarStatus('ready', 'Conecte o Google Calendar para importar eventos para a Agenda.');
      return;
    }

    const showToast = options && options.showToast === false ? false : true;
    this.updateGoogleCalendarStatus('pending', 'Importando eventos do Google para a Agenda...');

    try {
      const stats = await this.importGoogleCalendarEventsToAppointments();
      await this.listGoogleCalendarEvents();

      const message = `Importação concluída. Eventos Google: ${stats.totalGoogleEvents} | Novos na Agenda: ${stats.insertedAppointments} | Atualizados na Agenda: ${stats.updatedAppointments} | Clientes criados: ${stats.createdClients}.`;
      this.recordGoogleCalendarSyncTime();
      this.updateGoogleCalendarStatus('ok', message);
      this.logSyncAudit('info', `Google -> Agenda: total=${stats.totalGoogleEvents}, inserted=${stats.insertedAppointments}, updated=${stats.updatedAppointments}, clientsCreated=${stats.createdClients}.`);
      if (showToast) this.showToast(message, 'success');
    } catch (err) {
      const apiError = err && err.result && err.result.error ? err.result.error : null;
      const message = String((apiError && apiError.message) || (err && err.message) || 'Erro desconhecido').trim();
      const projectMatch = message.match(/project\s+(\d+)/);
      if (message.toLowerCase().includes('has not been used') || message.toLowerCase().includes('it is disabled')) {
        const projectId = projectMatch ? projectMatch[1] : null;
        const enableUrl = projectId
          ? `https://console.developers.google.com/apis/api/calendar-json.googleapis.com/overview?project=${projectId}`
          : 'https://console.developers.google.com/apis/library/calendar-json.googleapis.com';
        const hint = `A API do Google Calendar não está ativada. Acesse o Console e ative: ${enableUrl}`;
        this.updateGoogleCalendarStatus('error', hint);
        this.logSyncAudit('error', `Falha Google -> Agenda: ${hint}`);
        if (showToast) this.showToast(hint, 'warning');
        return;
      }
      const lowered = message.toLowerCase();
      if (lowered.includes('insufficient authentication scopes') || lowered.includes('insufficient permissions')
          || lowered.includes('invalid credentials') || (apiError && apiError.code === 401)) {
        this.googleCalendarAuthorized = false;
        this.updateGoogleCalendarStatus('error', 'Sessão expirada ou permissão insuficiente. Clique em Conectar Google Calendar e autorize novamente.');
        if (showToast) this.showToast('Reautorize o Google Calendar e tente importar novamente.', 'warning');
        return;
      }
      if (lowered.includes('rate limit') || lowered.includes('usererrorexceeded') || lowered.includes('ratelimitexceeded') || (apiError && (apiError.code === 429 || apiError.code === 403))) {
        const backoffMs = 120 * 1000;
        this.googleCalendarRateLimitUntil = Date.now() + backoffMs;
        const retryAt = new Date(this.googleCalendarRateLimitUntil).toLocaleTimeString('pt-BR');
        this.updateGoogleCalendarStatus('error', `Rate Limit do Google Calendar. Próxima tentativa após ${retryAt}.`);
        this.logSyncAudit('warning', `Google Calendar rate limit: próxima importação após ${retryAt}.`);
        if (showToast) this.showToast('Limite de requisições do Google Calendar atingido. Aguarde 2 minutos.', 'warning');
        return;
      }
      this.updateGoogleCalendarStatus('error', `Falha ao importar para Agenda: ${message}`);
      this.logSyncAudit('error', `Falha Google -> Agenda: ${message}`);
      if (showToast) this.showToast(`Falha ao importar Google para Agenda: ${message}`, 'warning');
    }
  }

  // Apaga todos os agendamentos locais (sem tocar no Google Calendar) e reimporta tudo do zero
  // diretamente do Google. Útil para eliminar duplicatas/inconsistências acumuladas localmente
  // sem arriscar apagar nada do lado do Google. Faz backup em JSON antes de apagar, já que
  // agendamentos que nunca chegaram a existir no Google (criados só no app) seriam perdidos.
  async resetLocalAppointmentsFromGoogleOnly() {
    const confirmMessage = 'Isso vai APAGAR todos os agendamentos da agenda local deste sistema (o Google Calendar não será alterado) e depois reimportar tudo direto do Google. Um backup em JSON dos agendamentos atuais será baixado antes de apagar. Deseja continuar?';
    const confirmed = typeof this.askConfirmation === 'function'
      ? await this.askConfirmation(confirmMessage, { title: 'Resetar agenda local', confirmLabel: 'Apagar e reimportar' })
      : window.confirm(confirmMessage);
    if (!confirmed) return;

    try {
      const now = new Date();
      const backupPayload = {
        exportedAt: now.toISOString(),
        reason: 'reset-local-appointments-before-google-reimport',
        appointments: this.appointments
      };
      const blob = new Blob([JSON.stringify(backupPayload, null, 2)], { type: 'application/json;charset=utf-8' });
      const fileName = `backup-agendamentos-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}.json`;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      const removedCount = this.appointments.length;
      this.appointments = [];
      this.saveData();
      this.render();
      this.logSyncAudit('info', `Reset local: ${removedCount} agendamento(s) removido(s) da agenda local (backup salvo em ${fileName}). Google Calendar não foi alterado.`);
      this.showToast(`Backup salvo (${fileName}). ${removedCount} agendamento(s) removido(s) localmente. Reimportando do Google...`, 'success');

      await this.importGoogleCalendarIntoLocalAgenda();
    } catch (err) {
      const message = String((err && err.message) || err || 'erro desconhecido');
      this.logSyncAudit('error', `Falha ao resetar agenda local: ${message}`);
      this.showToast(`Falha ao resetar agenda local: ${message}`, 'warning');
    }
  }

  async waitForGoogleCalendarLibraries(timeoutMs = 10000) {
    const deadline = Date.now() + Math.max(1000, Number(timeoutMs) || 10000);
    while (Date.now() < deadline) {
      if (window.gapi && window.google && window.google.accounts && window.google.accounts.oauth2) return true;
      // Yield to the browser while the external scripts finish loading.
      await new Promise((resolve) => window.setTimeout(resolve, 120));
    }
    return Boolean(window.gapi && window.google && window.google.accounts && window.google.accounts.oauth2);
  }

  async initGoogleCalendarClient() {
    if (window.location && String(window.location.protocol || '').toLowerCase() === 'file:') {
      this.updateGoogleCalendarStatus(
        'error',
        'Abra o app em https ou http://localhost. O login OAuth do Google Calendar não funciona corretamente em file://.'
      );
      return false;
    }

    if (!this.isGoogleCalendarOriginAllowed()) {
      const origin = window.location && window.location.origin ? window.location.origin : 'origem desconhecida';
      this.updateGoogleCalendarStatus(
        'error',
        `Origem não autorizada para Google OAuth: ${origin}. Cadastre esta URL no Client ID do Google Cloud.`
      );
      return false;
    }

    const input = document.getElementById('cfg-google-calendar-client-id');
    const clientId = String((input && input.value) || this.loadGoogleCalendarClientId() || '').trim();
    if (!clientId) {
      this.updateGoogleCalendarStatus('error', 'Informe o Client ID do OAuth para usar o Google Calendar.');
      return false;
    }

    this.googleCalendarClientId = clientId;
    this.saveGoogleCalendarClientId(clientId);

    const ready = await this.waitForGoogleCalendarLibraries();
    if (!ready) {
      this.updateGoogleCalendarStatus('error', 'Bibliotecas do Google Calendar ainda não carregaram. Recarregue a página e tente novamente.');
      return false;
    }

    try {
      if (!this.googleCalendarApiReady) {
        await new Promise((resolve, reject) => {
          try {
            window.gapi.load('client', resolve);
          } catch (err) {
            reject(err);
          }
        });

        await window.gapi.client.init({
          discoveryDocs: [GOOGLE_CALENDAR_DISCOVERY_DOC]
        });
        this.googleCalendarApiReady = true;
      }

      if (!this.googleCalendarTokenClient) {
        this.googleCalendarTokenClient = window.google.accounts.oauth2.initTokenClient({
          client_id: clientId,
          scope: GOOGLE_CALENDAR_SCOPES,
          callback: ''
        });
      }

      this.googleCalendarReady = true;
      this.updateGoogleCalendarStatus(this.googleCalendarAuthorized ? 'ok' : 'ready');
      return true;
    } catch (err) {
      const message = err && err.message ? err.message : 'Erro desconhecido';
      console.log('Falha ao inicializar Google Calendar:', err);
      this.updateGoogleCalendarStatus('error', `Falha ao inicializar Google Calendar: ${message}`);
      return false;
    }
  }

  async connectGoogleCalendar() {
    const initialized = await this.initGoogleCalendarClient();
    if (!initialized || !this.googleCalendarTokenClient) return;

    this.updateGoogleCalendarStatus('pending', 'Autorizando Google Calendar...');
    this.googleCalendarTokenClient.callback = async (resp) => {
      if (resp && resp.error) {
        let message = String(resp.error_description || resp.error || 'Falha ao autorizar Google Calendar.');
        const errorCode = String(resp.error || '').trim().toLowerCase();
        if (errorCode === 'invalid_client') {
          const origin = window.location && window.location.origin ? window.location.origin : 'origem desconhecida';
          message = `Erro 401 invalid_client. Cadastre a origem ${origin} no OAuth Client ID do tipo Web no Google Cloud e confirme se o Client ID salvo no app pertence ao mesmo projeto.`;
        }
        this.googleCalendarAuthorized = false;
        this.googleCalendarAccessToken = '';
        this.updateGoogleCalendarStatus('error', message);
        this.showToast(message, 'warning');
        return;
      }

      this.googleCalendarAuthorized = true;
      this.googleCalendarAccessToken = String((resp && resp.access_token) || '').trim();
      if (window.gapi && window.gapi.client) {
        window.gapi.client.setToken({ access_token: this.googleCalendarAccessToken });
      }
      try { localStorage.setItem('googleCalendarAutoConnect', 'true'); } catch (_) {}
      this.updateGoogleCalendarStatus('ok', 'Google Calendar conectado e autorizado.');
      this.showToast('Google Calendar conectado com sucesso.', 'success');
      this.scheduleGoogleCalendarAutoSync();
      void this.importGoogleCalendarIntoLocalAgenda({ showToast: false });
    };

    // Always force account picker so the user can select the intended Google account.
    this.googleCalendarTokenClient.requestAccessToken({ prompt: 'select_account consent' });
  }

  disconnectGoogleCalendar() {
    const token = window.gapi && window.gapi.client && typeof window.gapi.client.getToken === 'function'
      ? window.gapi.client.getToken()
      : null;

    if (token && token.access_token && window.google && window.google.accounts && window.google.accounts.oauth2) {
      try {
        window.google.accounts.oauth2.revoke(token.access_token, () => {});
      } catch (err) {
        console.log('Falha ao revogar token do Google Calendar:', err);
      }
    }

    if (window.gapi && window.gapi.client && typeof window.gapi.client.setToken === 'function') {
      window.gapi.client.setToken(null);
    }

    this.googleCalendarAuthorized = false;
    this.googleCalendarAccessToken = '';
    try { localStorage.removeItem('googleCalendarAutoConnect'); } catch (_) {}
    this.clearGoogleCalendarAutoSyncSchedule();
    this.updateGoogleCalendarStatus(this.googleCalendarClientId ? 'ready' : 'offline', this.googleCalendarClientId
      ? 'Client ID salvo. Clique em Conectar para autorizar acesso ao calendário.'
      : 'Google Calendar desconectado.');
    this.showToast('Google Calendar desconectado.', 'info');
  }

  async tryAutoConnectGoogleCalendar() {
    try {
      const shouldAuto = localStorage.getItem('googleCalendarAutoConnect') === 'true';
      if (!shouldAuto) {
        this.logSyncAudit('info', 'Auto-connect Google Calendar: desativado (conecte manualmente uma vez para ativar).');
        return;
      }
    } catch (_) { return; }

    const initialized = await this.initGoogleCalendarClient();
    if (!initialized || !this.googleCalendarTokenClient) return;

    this.logSyncAudit('info', 'Auto-connect Google Calendar: tentando reconexão silenciosa...');
    this.updateGoogleCalendarStatus('pending', 'Reconectando Google Calendar automaticamente...');

    this.googleCalendarTokenClient.callback = async (resp) => {
      if (resp && resp.error) {
        // Silent auth failed — user needs to interact, do not show error toast.
        this.googleCalendarAuthorized = false;
        this.logSyncAudit('info', `Auto-connect Google Calendar: falhou silenciosamente (${resp.error}). Clique em Conectar.`);
        this.updateGoogleCalendarStatus('ready', 'Sessão Google expirada. Clique em Conectar Google Calendar para reautorizar.');
        return;
      }
      this.googleCalendarAuthorized = true;
      this.googleCalendarAccessToken = String((resp && resp.access_token) || '').trim();
      if (window.gapi && window.gapi.client) {
        window.gapi.client.setToken({ access_token: this.googleCalendarAccessToken });
      }
      this.logSyncAudit('info', 'Auto-connect Google Calendar: reconectado com sucesso. Iniciando sync...');
      this.updateGoogleCalendarStatus('ok', 'Google Calendar reconectado automaticamente. Sincronizando...');
      this.scheduleGoogleCalendarAutoSync();
      void this.importGoogleCalendarIntoLocalAgenda({ showToast: true });
    };

    // prompt: '' attempts silent token refresh — no popup if already authorized.
    this.googleCalendarTokenClient.requestAccessToken({ prompt: '' });
  }

  async listGoogleCalendarEvents() {
    const initialized = await this.initGoogleCalendarClient();
    if (!initialized) return;

    if (!this.googleCalendarAuthorized) {
      this.updateGoogleCalendarStatus('ready', 'Conecte o Google Calendar para atualizar os eventos.');
      return;
    }

    try {
      const response = await window.gapi.client.calendar.events.list({
        calendarId: 'primary',
        timeMin: new Date().toISOString(),
        showDeleted: false,
        singleEvents: true,
        maxResults: 10,
        orderBy: 'startTime'
      });

      const events = Array.isArray(response && response.result && response.result.items)
        ? response.result.items
        : [];

      this.renderGoogleCalendarEventsList(events);

      const nextEvent = events[0];
      const eventLabel = nextEvent
        ? `${String((nextEvent.start && (nextEvent.start.dateTime || nextEvent.start.date)) || '').trim()} - ${String(nextEvent.summary || 'Sem título').trim()}`
        : 'Nenhum evento futuro encontrado.';

      this.updateGoogleCalendarStatus('ok', `Google Calendar sincronizado. Próximo evento: ${eventLabel}`);
      this.logSyncAudit('info', `Google Calendar lido com ${events.length} evento(s) futuros.`);
    } catch (err) {
      const message = err && err.message ? err.message : 'Erro desconhecido';
      console.log('Falha ao listar eventos do Google Calendar:', err);
      this.updateGoogleCalendarStatus('error', `Falha ao buscar eventos: ${message}`);
      this.showToast(`Falha ao buscar eventos do Google Calendar: ${message}`, 'warning');
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

    if (this.firebaseSyncStatePollIntervalId) {
      window.clearInterval(this.firebaseSyncStatePollIntervalId);
      this.firebaseSyncStatePollIntervalId = null;
    }

    if (this.firebaseSyncRealtimeUnsubscribe) {
      this.firebaseSyncRealtimeUnsubscribe();
      this.firebaseSyncRealtimeUnsubscribe = null;
    }

    this.stopFirebaseCollectionRealtimeWatchers();

    if (this.firebaseRealtimeRecoverTimerId) {
      window.clearTimeout(this.firebaseRealtimeRecoverTimerId);
      this.firebaseRealtimeRecoverTimerId = null;
    }

    if (this.firebasePushRetryTimerId) {
      window.clearTimeout(this.firebasePushRetryTimerId);
      this.firebasePushRetryTimerId = null;
    }
    this.clearFirebasePushWatchdog();
    this.firebasePushInFlight = false;
    this.firebasePushQueued = false;
    this.firebasePushActiveAttemptId = 0;

    this.firebaseConnected = false;
    this.firebaseApp = null;
    this.firebaseDb = null;
    this.firebaseAuthUid = '';
    this.logSyncAudit('info', 'Firebase desconectado manualmente.');
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
    this.saveFirebaseConfig(config, { skipSync: true });
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
      try {
        if (FIREBASE_FORCE_LONG_POLLING && !this.firebaseSettingsApplied && this.firebaseDb && typeof this.firebaseDb.settings === 'function') {
          this.firebaseDb.settings({
            experimentalForceLongPolling: true,
            useFetchStreams: false,
            ignoreUndefinedProperties: true,
            merge: true
          });
          this.firebaseSettingsApplied = true;
          this.logSyncAudit('info', 'Firestore em long-polling para maior estabilidade de sync.');
        }
      } catch (settingsErr) {
        console.log('Falha ao aplicar settings do Firestore:', settingsErr);
        const details = String((settingsErr && (settingsErr.code || settingsErr.message)) || '').toLowerCase();
        if (details.includes('already') || details.includes('started') || details.includes('settings')) {
          // Avoid retrying settings repeatedly after Firestore is already initialized.
          this.firebaseSettingsApplied = true;
        }
      }
      this.firebaseConnected = true;
      this.logSyncAudit('info', 'Firebase conectado; iniciando listeners e pull inicial.');
      this.setFirebaseStatus(true, 'Conectado ao Firebase', 'live');
      this.startFirebaseAutoRefresh();
      this.startFirebaseSyncStatePolling();
      this.boostFirebaseSyncPolling(30000, 'conexao-inicial');
      this.startFirebaseRealtimeSyncWatcher();
      this.startFirebaseCollectionRealtimeWatchers();
      this.showToast('Firebase conectado com sucesso.', 'success');

      try {
        await this.syncDataWithFirebase({ skipDirtyPush: false });
      } catch (syncErr) {
        const message = syncErr && syncErr.message ? syncErr.message : 'Erro desconhecido';
        this.setFirebaseLastError(syncErr, message);
        this.logSyncAudit('error', `Falha no pull inicial: ${String((syncErr && (syncErr.code || syncErr.message)) || message)}`);
        if (this.firebaseSyncRealtimeUnsubscribe) {
          this.firebaseSyncRealtimeUnsubscribe();
          this.firebaseSyncRealtimeUnsubscribe = null;
        }
        this.stopFirebaseCollectionRealtimeWatchers();
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
      this.logSyncAudit('error', `Falha ao conectar Firebase: ${String((err && (err.code || err.message)) || message)}`);
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

  async syncDataWithFirebase(options = {}) {
    if (!this.firebaseDb) {
      return { applied: false, deferred: true, reason: 'firebase-unavailable' };
    }

    const skipDirtyPush = Boolean(options.skipDirtyPush);
    const silent = Boolean(options.silent);
    if (!silent) this.logSyncAudit('pull', 'Pull iniciado para atualizar dados locais.');

    if (skipDirtyPush && this.isFirebaseSyncDirty()) {
      // Never replace unsynced local edits/deletions with remote snapshots.
      this.requestFirebasePushSync();
      this.logSyncAudit('warning', 'Pull remoto adiado: há alterações locais pendentes de envio.');
      if (!silent) {
        this.updateCloudSyncMeta('Aguardando envio local para sincronizar com segurança', 'local');
      }
      return { applied: false, deferred: true, reason: 'dirty-local-pending-push' };
    }

    try {
      if (this.isFirebaseSyncDirty() && !skipDirtyPush) {
        const remoteState = await this.getRemoteSyncState();
        const remoteUpdatedMillis = Number((remoteState && remoteState.updatedAtMillis) || 0);
        const localLastPushMillis = this.getLocalLastPushMillis();
        const shouldSkipPushToAvoidOverwrite = remoteUpdatedMillis > localLastPushMillis;

        if (shouldSkipPushToAvoidOverwrite) {
          // Another device has newer committed data; pull first to avoid overriding it.
          if (!silent) {
            this.showToast('Detectei dados mais novos em outro dispositivo. Atualizando sem sobrescrever.', 'info');
          }
          // Local pending flag must be cleared after accepting fresher remote snapshot.
          this.setFirebaseSyncDirty(false);
          if (remoteUpdatedMillis > 0) this.setLocalLastPushMillis(remoteUpdatedMillis);
          this.logSyncAudit('warning', 'Push local bloqueado para não sobrescrever remoção remota mais nova.');
        } else {
          // Local changes (including deletions) can be safely sent first.
          await this.pushAllDataToFirebase();
          this.setFirebaseSyncDirty(false);
        }
      }

      const collections = [
        { name: LOGIN_USERS_FIRESTORE_COLLECTION, data: getLoginUsers() },
        { name: 'clients', data: this.clients },
        { name: 'appointments', data: this.appointments },
        { name: 'expenses', data: this.expenses }
      ];

      const snapshotsByCollection = {};
      await Promise.all(collections.map(async (item) => {
        const snapshot = await this.firebaseDb.collection(item.name).get();
        snapshotsByCollection[item.name] = snapshot;
      }));

      let sharedSettingsDoc = null;
      try {
        sharedSettingsDoc = await this.firebaseDb.collection('app_meta').doc('shared_settings').get();
      } catch (sharedErr) {
        this.logSyncAudit('warning', `Falha ao ler configurações compartilhadas: ${String((sharedErr && (sharedErr.code || sharedErr.message)) || 'erro desconhecido')}`);
      }

      let shouldSeedRemoteFromLocal = false;

      for (const item of collections) {
        const snapshot = snapshotsByCollection[item.name];
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

        if (item.name === LOGIN_USERS_FIRESTORE_COLLECTION) {
          if (!snapshot.empty) {
            saveLoginUsers(remoteData.map((entry) => ({
              username: String(entry.username || '').trim(),
              password: String(entry.password || ''),
              createdAt: String(entry.createdAt || getTodayStr()),
              updatedAt: String(entry.updatedAt || getTodayStr())
            })), { syncRemote: false });
          } else if (Array.isArray(item.data) && item.data.length) {
            shouldSeedRemoteFromLocal = true;
          }
          continue;
        }

        if (item.name === 'clients') this.clients = remoteData;
        if (item.name === 'appointments') {
          const normalizedRemoteAppointments = this.normalizeAppointmentsCollection(remoteData, 'firebase-pull');
          const filteredResult = this.filterRemoteAppointmentsByTombstones(normalizedRemoteAppointments);
          this.appointments = filteredResult.filtered;
          if (filteredResult.blockedIds.length) {
            this.logSyncAudit('warning', `Consultas bloqueadas no pull por tombstone local: ${filteredResult.blockedIds.join(', ')}.`);
            try {
              await this.enforceAppointmentDeletesInFirebase(filteredResult.blockedIds);
              this.logSyncAudit('push', `Reexclusão remota aplicada para consultas: ${filteredResult.blockedIds.join(', ')}.`);
            } catch (deleteErr) {
              this.logSyncAudit('error', `Falha na reexclusão remota: ${String((deleteErr && (deleteErr.code || deleteErr.message)) || 'erro desconhecido')}`);
            }
          }
        }
        if (item.name === 'expenses') this.expenses = remoteData;
      }

      if (shouldSeedRemoteFromLocal) {
        await this.pushAllDataToFirebase();
        this.logSyncAudit('push', 'Remote vazio detectado; base local enviada para semear dados.');
      }

      if (sharedSettingsDoc && sharedSettingsDoc.exists) {
        const appliedSharedSettings = this.applySharedSettingsFromRemote(sharedSettingsDoc.data ? sharedSettingsDoc.data() : {});
        if (appliedSharedSettings) {
          this.logSyncAudit('pull', 'Configurações compartilhadas aplicadas do Firebase.');
        }
      }

      this.applyStableDataOrdering();
      this.saveStore();
      this.restoreAgendaFiltersForLoadedAppointments();
      this.render();
      this.rebuildFirebasePushShadowFromCurrentState();
      if (!silent) {
        const pullDetail = `consultas:${this.appointments.length}, clientes:${this.clients.length}, despesas:${this.expenses.length}`;
        this.logSyncAudit('pull', `Pull concluído — recebidos ${pullDetail}`);
      }
      return { applied: true, deferred: false, reason: 'ok' };
    } catch (err) {
      const message = err && err.message ? err.message : 'Erro desconhecido';
      console.log('Falha ao sincronizar com Firestore:', message);
      this.logSyncAudit('error', `Falha no pull: ${String((err && (err.code || err.message)) || message)}`);
      this.notifyFirebaseQuotaPause(err, silent ? 'pull-silencioso' : 'pull');
      throw err;
    }
  }

  async pushAllDataToFirebase() {
    if (!this.firebaseDb) return;
    try {
      const collectionNames = [LOGIN_USERS_FIRESTORE_COLLECTION, 'clients', 'appointments', 'expenses'];
      const docsByCollection = this.collectCurrentFirebaseDocsForPush();
      const previousState = this.firebasePushShadowState || this.createEmptyFirebasePushShadowState();
      const nextState = this.createEmptyFirebasePushShadowState();
      const operations = [];
      const operationKeys = new Set();

      const addOperation = (operation) => {
        const key = `${operation.type}|${operation.collection}|${operation.id}`;
        if (operationKeys.has(key)) return;
        operationKeys.add(key);
        operations.push(operation);
      };

      collectionNames.forEach((collectionName) => {
        const currentDocs = docsByCollection[collectionName];
        const previousCollectionState = (previousState[collectionName] && typeof previousState[collectionName] === 'object' && !Array.isArray(previousState[collectionName]))
          ? previousState[collectionName]
          : {};

        currentDocs.forEach((data, id) => {
          const signature = this.computeSyncDocSignature(data);
          nextState[collectionName][id] = signature;
          if (previousCollectionState[id] !== signature) {
            addOperation({ type: 'set', collection: collectionName, id, data });
          }
        });

        Object.keys(previousCollectionState).forEach((id) => {
          if (currentDocs.has(id)) return;
          addOperation({ type: 'delete', collection: collectionName, id });
        });
      });

      Object.keys(this.deletedAppointmentTombstones || {}).forEach((id) => {
        const normalizedId = String(id || '').trim();
        if (!normalizedId) return;
        delete nextState.appointments[normalizedId];
        addOperation({ type: 'delete', collection: 'appointments', id: normalizedId });
      });

      const sharedComparable = this.buildSharedSettingsComparable();
      const nextSharedSettingsSignature = this.computeSharedSettingsSignatureFromComparable(sharedComparable);
      const currentSharedSettingsSignature = this.getLocalSharedSettingsSignature();
      const shouldPushSharedSettings = Boolean(nextSharedSettingsSignature) && nextSharedSettingsSignature !== currentSharedSettingsSignature;

      if (!operations.length && !shouldPushSharedSettings) {
        this.firebasePushShadowState = nextState;
        this.saveFirebasePushShadowState();
        this.setLocalLastPushMillis(Date.now());
        this.firebasePushQueued = false;
        if (this.firebasePushRetryTimerId) {
          window.clearTimeout(this.firebasePushRetryTimerId);
          this.firebasePushRetryTimerId = null;
        }
        this.logSyncAudit('info', 'Push incremental sem alterações pendentes (no-op).');
        return;
      }

      const pushCounts = {};
      operations.forEach((op) => {
        const label = op.type === 'delete' ? `${op.collection}(excluído)` : op.collection;
        pushCounts[label] = (pushCounts[label] || 0) + 1;
      });
      const pushDetail = Object.entries(pushCounts).map(([k, v]) => `${k}:${v}`).join(', ');
      this.logSyncAudit('push', `Enviando ${operations.length} doc(s) — ${pushDetail}`);

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

      if (shouldPushSharedSettings) {
        const sharedPayload = this.buildSharedSettingsSyncPayload();
        await this.firebaseDb.collection('app_meta').doc('shared_settings').set(sharedPayload, { merge: true });
      }

      try {
        await this.updateRemoteSyncState();
      } catch (metaErr) {
        const details = String((metaErr && (metaErr.code || metaErr.message)) || 'erro desconhecido');
        this.logSyncAudit('warning', `Dados enviados, mas metadata de sync não foi atualizada: ${details}`);
      }
      this.firebasePushShadowState = nextState;
      this.saveFirebasePushShadowState();
      this.setLocalLastPushMillis(Date.now());
      if (shouldPushSharedSettings) {
        this.setLocalSharedSettingsSignature(nextSharedSettingsSignature);
      }
      this.firebasePushQueued = false;
      if (this.firebasePushRetryTimerId) {
        window.clearTimeout(this.firebasePushRetryTimerId);
        this.firebasePushRetryTimerId = null;
      }
    } catch (err) {
      console.log('Falha ao enviar dados para o Firestore:', err);
      throw err;
    }
  }

  buildLoginUserDocId(username) {
    return String(username || '')
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '') || `user_${Date.now()}`;
  }

  async syncLoginUsersToFirebase(users = null) {
    if (!this.firebaseDb || !this.firebaseConnected) return false;

    const normalizedUsers = normalizeLoginUsers(Array.isArray(users) ? users : getLoginUsers());
    try {
      const collection = this.firebaseDb.collection(LOGIN_USERS_FIRESTORE_COLLECTION);
      const snapshot = await collection.get();
      const localIds = new Set();
      const batch = this.firebaseDb.batch();

      normalizedUsers.forEach((user) => {
        if (!user.username) return;
        const id = this.buildLoginUserDocId(user.username);
        localIds.add(id);
        batch.set(collection.doc(id), {
          username: user.username,
          password: user.password,
          createdAt: user.createdAt || getTodayStr(),
          updatedAt: user.updatedAt || getTodayStr()
        });
      });

      snapshot.docs.forEach((doc) => {
        if (localIds.has(doc.id)) return;
        batch.delete(collection.doc(doc.id));
      });

      await batch.commit();
      return true;
    } catch (err) {
      console.log('Falha ao sincronizar usuários com Firebase:', err);
      return false;
    }
  }

  async refreshFirebaseDataNow() {
    this.updateCloudSyncMeta('Atualizando dados do Firebase...', 'live');

    if (!this.firebaseConnected || !this.firebaseDb) {
      const connected = await this.initFirebase();
      if (!connected || !this.firebaseDb) return;
    }

    try {
      const syncResult = await this.syncDataWithFirebase({ skipDirtyPush: true });
      if (syncResult && syncResult.deferred) {
        this.updateCloudSyncMeta('Sincronismo pendente: envio local ainda não efetivado', 'local', {
          highlight: true
        });
        this.showHeaderSyncInlineNotice('Envio local pendente. Vou reenviar automaticamente.', 'warning', 4200);
        return;
      }

      this.updateCloudSyncMeta('Dados atualizados do Firebase', 'live');
      this.showHeaderSyncInlineNotice('Dados atualizados com sucesso.', 'success', 2600);
    } catch (err) {
      const message = err && err.message ? err.message : 'Erro desconhecido';
      const quotaPaused = this.notifyFirebaseQuotaPause(err, 'atualizacao-manual');
      if (!quotaPaused) {
        this.updateCloudSyncMeta('Falha ao atualizar dados do Firebase', 'local');
        this.showHeaderSyncInlineNotice(`Falha ao atualizar dados: ${message}`, 'warning', 3600);
      }
    }
  }

  async fetchLatestFirebaseUpdate() {
    this.updateCloudSyncMeta('Buscando última atualização no Firebase...', 'live');

    if (!this.firebaseConnected || !this.firebaseDb) {
      const connected = await this.initFirebase();
      if (!connected || !this.firebaseDb) return;
    }

    const parseUpdateMillis = (value) => {
      if (!value) return 0;

      if (typeof value === 'string') {
        const normalized = value.trim();
        if (!normalized) return 0;

        if (/^\d{4}-\d{2}-\d{2}$/.test(normalized)) {
          const [year, month, day] = normalized.split('-').map((part) => Number(part));
          const dateValue = new Date(year, month - 1, day);
          return Number.isNaN(dateValue.getTime()) ? 0 : dateValue.getTime();
        }

        const dateValue = new Date(normalized);
        return Number.isNaN(dateValue.getTime()) ? 0 : dateValue.getTime();
      }

      if (typeof value.toDate === 'function') {
        const dateValue = value.toDate();
        return dateValue instanceof Date && !Number.isNaN(dateValue.getTime()) ? dateValue.getTime() : 0;
      }

      if (value instanceof Date) {
        return Number.isNaN(value.getTime()) ? 0 : value.getTime();
      }

      if (typeof value.seconds === 'number') {
        const milliseconds = (Number(value.seconds) * 1000) + Math.floor(Number(value.nanoseconds || 0) / 1e6);
        return Number.isFinite(milliseconds) ? milliseconds : 0;
      }

      return 0;
    };

    const formatUpdateLabel = (value) => {
      if (!value) return '';

      if (typeof value === 'string') {
        const normalized = value.trim();
        if (!normalized) return '';

        const asDate = new Date(normalized);
        if (!Number.isNaN(asDate.getTime())) {
          return asDate.toLocaleString('pt-BR');
        }

        return normalized;
      }

      if (typeof value.toDate === 'function') {
        const dateValue = value.toDate();
        return dateValue instanceof Date && !Number.isNaN(dateValue.getTime())
          ? dateValue.toLocaleString('pt-BR')
          : '';
      }

      if (value instanceof Date) {
        return Number.isNaN(value.getTime()) ? '' : value.toLocaleString('pt-BR');
      }

      if (typeof value.seconds === 'number') {
        const dateValue = new Date((Number(value.seconds) * 1000) + Math.floor(Number(value.nanoseconds || 0) / 1e6));
        return Number.isNaN(dateValue.getTime()) ? '' : dateValue.toLocaleString('pt-BR');
      }

      return String(value);
    };

    try {
      const collections = [
        { name: 'clients', label: 'Clientes' },
        { name: 'appointments', label: 'Agenda' },
        { name: 'expenses', label: 'Financeiro' }
      ];
      let latest = null;

      for (const collection of collections) {
        const snapshot = await this.firebaseDb.collection(collection.name).get();

        snapshot.docs.forEach((doc) => {
          const data = doc.data ? doc.data() : {};
          const candidates = [data.updatedAt, doc.updateTime, doc.createTime];

          candidates.forEach((candidate) => {
            const millis = parseUpdateMillis(candidate);
            if (!millis) return;

            if (!latest || millis > latest.millis) {
              latest = {
                millis,
                label: formatUpdateLabel(candidate),
                collection: collection.label
              };
            }
          });
        });
      }

      if (!latest) {
        this.updateCloudSyncMeta('Nenhuma atualização remota encontrada', 'local');
        this.showToast('Não encontrei registros remotos com data de atualização.', 'info');
        return;
      }

      this.updateCloudSyncMeta(`Última atualização remota: ${latest.label} (${latest.collection})`, 'live');
      this.showToast(`Última atualização encontrada em ${latest.label}.`, 'success');
    } catch (err) {
      const message = err && err.message ? err.message : 'Erro desconhecido';
      const quotaPaused = this.notifyFirebaseQuotaPause(err, 'busca-ultima-atualizacao');
      if (!quotaPaused) {
        this.updateCloudSyncMeta('Falha ao buscar última atualização remota', 'local');
        this.showToast(`Não foi possível buscar a última atualização: ${message}`, 'warning');
      }
    }
  }

  startFirebaseAutoRefresh() {
    if (this.firebaseSyncIntervalId) {
      window.clearInterval(this.firebaseSyncIntervalId);
      this.firebaseSyncIntervalId = null;
    }

    this.firebaseSyncIntervalId = window.setInterval(() => {
      if (!this.firebaseConnected || !this.firebaseDb) {
        const now = Date.now();
        const cooldownMs = 90 * 1000;
        if ((now - Number(this.firebaseAutoReconnectLastAttemptAt || 0)) < cooldownMs) return;
        this.firebaseAutoReconnectLastAttemptAt = now;
        this.logSyncAudit('info', 'Reconexão automática ao Firebase iniciada...');
        void this.initFirebase();
        return;
      }

      void this.syncDataWithFirebase({ skipDirtyPush: true, silent: true })
        .then((syncResult) => {
          if (syncResult && syncResult.deferred) {
            this.updateCloudSyncMeta('Sincronismo pendente: aguardando envio local', 'local');
            return;
          }
          this.updateCloudSyncMeta('Dados atualizados do Firebase', 'live');
        })
        .catch((err) => {
          console.log('Falha ao atualizar dados automaticamente do Firebase:', err);
        });
    }, this.firebaseSyncIntervalMs);
  }

  startFirebaseSyncStatePolling() {
    if (this.firebaseSyncStatePollIntervalId) {
      window.clearInterval(this.firebaseSyncStatePollIntervalId);
      this.firebaseSyncStatePollIntervalId = null;
    }

    this.firebaseSyncStatePollIntervalId = window.setInterval(async () => {
      if (!this.firebaseConnected || !this.firebaseDb) return;

      const now = Date.now();
      const isFastWindow = now < Number(this.firebaseSyncStatePollFastUntil || 0);
      const cadenceMs = isFastWindow
        ? Math.max(1200, Number(this.firebaseSyncStatePollFastIntervalMs) || 3000)
        : Math.max(3000, Number(this.firebaseSyncStatePollIntervalMs) || 12000);

      if ((now - Number(this.firebaseSyncStatePollLastRunAt || 0)) < cadenceMs) return;
      this.firebaseSyncStatePollLastRunAt = now;

      // Back off reads while Firebase quota is exhausted.
      if ((now - Number(this.lastFirebaseQuotaNoticeAt || 0)) < Math.max(15000, Number(this.firebaseQuotaNoticeCooldownMs) || 45000)) {
        return;
      }

      try {
        const remoteState = await this.getRemoteSyncState();
        if (!remoteState) return;

        const remoteMillis = Number(remoteState.updatedAtMillis || 0);
        if (!remoteMillis) return;

        const updatedByDeviceId = String(remoteState.updatedByDeviceId || '').trim();
        if (updatedByDeviceId && updatedByDeviceId === this.firebaseDeviceId) {
          this.lastRemoteStateSeenMillis = Math.max(Number(this.lastRemoteStateSeenMillis || 0), remoteMillis);
          return;
        }

        const knownMillis = Math.max(
          Number(this.lastRealtimeSyncMillis || 0),
          Number(this.lastRemoteStateSeenMillis || 0),
          Number(this.getLocalLastPushMillis() || 0)
        );

        if (remoteMillis <= knownMillis) return;

        this.lastRemoteStateSeenMillis = remoteMillis;
        this.logSyncAudit('realtime', 'Mudança remota detectada via polling de metadata.');

        const syncResult = await this.syncDataWithFirebase({ skipDirtyPush: true, silent: true });
        if (syncResult && syncResult.deferred) {
          this.updateCloudSyncMeta('Sincronismo pendente: aguardando envio local', 'local');
          return;
        }
        this.showRemoteSyncIndicator(remoteMillis);
        this.logSyncAudit('pull', 'Pull aplicado por polling de metadata remota.');
      } catch (err) {
        const details = String((err && (err.code || err.message)) || 'erro desconhecido');
        this.logSyncAudit('error', `Falha no polling de metadata: ${details}`);
      }
    }, Math.max(1000, Number(this.firebaseSyncStatePollTickMs) || 3000));
  }

  boostFirebaseSyncPolling(durationMs = 22000, reason = 'manual') {
    const now = Date.now();
    const safeDuration = Math.max(4000, Number(durationMs) || 22000);
    const nextUntil = now + safeDuration;
    this.firebaseSyncStatePollFastUntil = Math.max(Number(this.firebaseSyncStatePollFastUntil || 0), nextUntil);
    this.logSyncAudit('info', `Modo turbo de sincronização ativado (${reason}) por ${Math.round(safeDuration / 1000)}s.`);
  }

  showRemoteSyncIndicator(remoteMillis = 0) {
    const dateValue = Number(remoteMillis) > 0 ? new Date(Number(remoteMillis)) : new Date();
    const timeLabel = Number.isNaN(dateValue.getTime())
      ? new Date().toLocaleTimeString('pt-BR')
      : dateValue.toLocaleTimeString('pt-BR');

    this.updateCloudSyncMeta(`Sincronizado de outro dispositivo às ${timeLabel}`, 'remote', {
      highlight: true
    });
  }

  updateCloudSyncMeta(customText = '', mode = 'local', options = {}) {
    const info = document.getElementById('cloud-sync-last');
    const panel = document.getElementById('header-sync-panel');
    const panelText = document.getElementById('header-sync-note-text');
    if (!info) return;

    this.updateFirebaseOriginHint();

    const shouldBlink = Boolean((options && options.highlight) || mode === 'live' || mode === 'remote');
    info.classList.remove('live', 'local', 'remote', 'cloud-sync-meta-pulse', 'cloud-sync-dot-blink');
    if (mode === 'live') info.classList.add('live');
    else if (mode === 'remote') info.classList.add('remote');
    else info.classList.add('local');

    if (panel) {
      panel.classList.remove('live', 'local', 'remote');
      if (mode === 'live') panel.classList.add('live');
      else if (mode === 'remote') panel.classList.add('remote');
      else panel.classList.add('local');
    }

    if (customText) {
      const fullText = String(customText || '').trim();
      info.textContent = '';
      info.title = fullText;
      info.setAttribute('aria-label', fullText);
      if (panelText) panelText.textContent = fullText;
      if (panel) panel.title = fullText;
      if (shouldBlink) {
        // Retrigger dot blink when realtime/pull sync state changes.
        void info.offsetWidth;
        info.classList.add('cloud-sync-dot-blink');
      }
      return;
    }

    const now = new Date();
    const defaultText = `Atualizado ${now.toLocaleTimeString('pt-BR')}`;
    info.textContent = '';
    info.title = defaultText;
    info.setAttribute('aria-label', defaultText);
    if (panelText) panelText.textContent = defaultText;
    if (panel) panel.title = defaultText;
    if (shouldBlink) {
      void info.offsetWidth;
      info.classList.add('cloud-sync-dot-blink');
    }
  }

  updateFirebaseOriginHint() {
    const hint = document.getElementById('firebase-origin-hint');
    if (!hint) return;

    const origin = window.location && window.location.origin ? window.location.origin : 'origem desconhecida';
    const path = window.location && window.location.pathname ? window.location.pathname : '';
    hint.textContent = `Origem atual: ${origin}${path ? ` ${path}` : ''}`;
  }

  syncTopDatesToAgendaFilters() {
    const topStart = document.getElementById('top-date-start');
    const topEnd = document.getElementById('top-date-end');
    const agendaStart = document.getElementById('agenda-filter-start');
    const agendaEnd = document.getElementById('agenda-filter-end');
    const topStartIso = this.normalizeTopDateToIso((topStart || {}).value || '');
    const topEndIso = this.normalizeTopDateToIso((topEnd || {}).value || '');
    if (agendaStart && agendaStart._flatpickr) {
      if (topStartIso) agendaStart._flatpickr.setDate(topStartIso, false, 'Y-m-d');
      else agendaStart._flatpickr.clear();
    } else if (agendaStart) {
      agendaStart.value = this.formatAgendaDateForInput(topStartIso);
    }
    if (agendaEnd && agendaEnd._flatpickr) {
      if (topEndIso) agendaEnd._flatpickr.setDate(topEndIso, false, 'Y-m-d');
      else agendaEnd._flatpickr.clear();
    } else if (agendaEnd) {
      agendaEnd.value = this.formatAgendaDateForInput(topEndIso);
    }
  }

  getNextClientRegistrationNumber() {
    const usedNumbers = new Set((this.clients || [])
      .map((client) => Number(client.registrationNumber))
      .filter((number) => Number.isInteger(number) && number > 0));

    let nextNumber = 1;
    while (usedNumbers.has(nextNumber)) nextNumber += 1;
    return nextNumber;
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

  buildPaymentReceiptText(appointment, amountNow = 0) {
    return this.buildPaymentReceiptDocument(appointment, amountNow);
  }

  generatePaymentReceipt() {
    const id = (document.getElementById('pay-appointment-id') || {}).value || (document.getElementById('pay-appt-id') || {}).value || '';
    const appt = this.appointments.find((a) => a.id === id);
    if (!appt) {
      this.showToast('Consulta não encontrada para gerar recibo.', 'warning');
      return;
    }

    const amountNow = toNumber((document.getElementById('pay-amount-now') || {}).value || 0);
    this.updatePaymentSummaryPreview();
    const receiptText = this.buildPaymentReceiptText(appt, amountNow);
    const receiptEl = document.getElementById('pay-receipt-text');
    if (receiptEl) receiptEl.value = receiptText;

    const templateEl = document.getElementById('pay-receipt-template');
    if (templateEl && !String(templateEl.value || '').trim()) {
      templateEl.value = this.getPaymentReceiptTemplate();
    }
  }

  getPaymentReceiptSendContent(appointment, amountNow = 0) {
    const source = String((document.getElementById('pay-receipt-send-source') || {}).value || 'edited');
    const receiptEl = document.getElementById('pay-receipt-text');
    const manualText = String((receiptEl && receiptEl.value) || '').trim();

    if (source === 'generated') {
      return this.normalizePaymentReceiptText(this.buildPaymentReceiptText(appointment, amountNow));
    }

    return this.normalizePaymentReceiptText(manualText || this.buildPaymentReceiptText(appointment, amountNow));
  }

  buildPaymentReceiptShareHtml(content) {
    const logoUrl = new URL('./assets/icons/icon-512.png', window.location.href).href;
    const safeContent = safeText(String(content || '')).replace(/\n/g, '<br>');

    return `
      <div class="receipt-share-page" style="background:#ffffff;color:#0f172a;font-family:Arial,sans-serif;padding:32px 24px;box-sizing:border-box;width:794px;min-height:1123px;">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:18px;border-bottom:2px solid #d1d5db;padding-bottom:10px;">
          <img src="${logoUrl}" alt="Logo" style="width:46px;height:46px;border-radius:10px;object-fit:cover;border:1px solid #cbd5e1;">
          <div style="display:flex;flex-direction:column;gap:2px;">
            <h1 style="font-size:20px;margin:0;line-height:1.1;">Recibo de Pagamento</h1>
            <div style="font-size:12px;color:#334155;">Emitido em: ${new Date().toLocaleString('pt-BR')}</div>
          </div>
        </div>
        <div style="font-size:14px;line-height:1.5;white-space:normal;">${safeContent}</div>
      </div>
    `;
  }

  savePaymentReceiptTemplateFromUI() {
    const templateEl = document.getElementById('pay-receipt-template');
    if (!templateEl) return;

    const saved = this.savePaymentReceiptTemplate(templateEl.value);
    if (saved) {
      this.showToast('Modelo do recibo salvo.', 'success');
      this.generatePaymentReceipt();
    }
  }

  resetPaymentReceiptTemplateFromUI() {
    const templateEl = document.getElementById('pay-receipt-template');
    if (templateEl) templateEl.value = DEFAULT_PAYMENT_RECEIPT_TEMPLATE;
    this.savePaymentReceiptTemplate(DEFAULT_PAYMENT_RECEIPT_TEMPLATE);
    this.showToast('Modelo do recibo restaurado.', 'info');
    this.generatePaymentReceipt();
  }

  printPaymentReceipt() {
    const id = (document.getElementById('pay-appointment-id') || {}).value || (document.getElementById('pay-appt-id') || {}).value || '';
    const appt = this.appointments.find((a) => a.id === id);
    if (!appt) {
      this.showToast('Consulta não encontrada para impressão.', 'warning');
      return;
    }

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      this.showToast('Permita pop-ups para imprimir o recibo.', 'warning');
      return;
    }

    const content = this.getPaymentReceiptSendContent(appt, toNumber((document.getElementById('pay-amount-now') || {}).value || 0));
    this.openReportWindow('Recibo de Pagamento', content, true, '', printWindow);
  }

  async downloadPaymentReceiptPdf() {
    const id = (document.getElementById('pay-appointment-id') || {}).value || (document.getElementById('pay-appt-id') || {}).value || '';
    const appt = this.appointments.find((item) => item.id === id);
    if (!appt) {
      this.showToast('Consulta não encontrada para gerar o PDF.', 'warning');
      return;
    }

    const client = this.getClientByAppointment(appt);
    const phone = this.normalizeWhatsAppPhone((client && client.phone) || '');
    const useNativeShare = this.canSharePaymentReceiptFile();
    if (!useNativeShare && !phone) {
      this.showToast('Cliente sem telefone válido para abrir o WhatsApp Web.', 'warning');
      return;
    }

    const whatsappWindow = useNativeShare ? null : window.open(`https://wa.me/${phone}`, '_blank', 'noopener');
    const button = document.getElementById('btn-download-payment-receipt-pdf');
    if (button) button.disabled = true;

    try {
      const content = this.getPaymentReceiptSendContent(appt, toNumber((document.getElementById('pay-amount-now') || {}).value || 0));
      const blob = await this.buildReceiptPdfBlob('Recibo de Pagamento', content);
      const receiptNumber = String((document.getElementById('pay-receipt-number') || {}).value || 'recibo').replace(/[^a-zA-Z0-9_-]/g, '-');
      const generatedAt = new Date().toISOString().replace(/[-:]/g, '').replace(/\..+$/, '');
      const fileName = `recibo-${receiptNumber}-${generatedAt}.pdf`;

      if (useNativeShare) {
        const file = new File([blob], fileName, { type: 'application/pdf' });
        await navigator.share({
          title: 'Recibo de Pagamento',
          files: [file]
        });
        this.showToast('Escolha o WhatsApp para enviar o PDF anexado.', 'success');
        return;
      }

      const downloadUrl = URL.createObjectURL(blob);
      const downloadLink = document.createElement('a');
      downloadLink.href = downloadUrl;
      downloadLink.download = fileName;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      downloadLink.remove();
      window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 3000);
      const popupMessage = whatsappWindow ? '' : ' Permita pop-ups para abrir o WhatsApp.';
      this.showToast(`PDF baixado. No WhatsApp, anexe ${fileName} como Documento.${popupMessage}`, whatsappWindow ? 'success' : 'warning');
    } catch (err) {
      if (err && err.name === 'AbortError') {
        this.showToast('Compartilhamento cancelado.', 'info');
        return;
      }
      console.log('Falha ao baixar PDF do recibo:', err);
      const errorMessage = err && err.message ? ` ${err.message}` : '';
      this.showToast(`Não foi possível baixar o PDF.${errorMessage}`, 'warning');
    } finally {
      if (button) button.disabled = false;
    }
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
    if (status === 'todos_cancelados') {
      filtered = filtered.filter((a) => this.normalizeAppointmentStatus(a.status).startsWith('Cancelado'));
    } else if (status !== 'todos') {
      filtered = filtered.filter((a) => this.normalizeAppointmentStatus(a.status) === status);
    }

    return filtered.sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));
  }

  renderDashboard() {
    const today = getTodayStr();
    const todayApps = this.appointments.filter((a) => a.date === today);
    const doneToday = todayApps.filter((a) => this.normalizeAppointmentStatus(a.status) === 'Presente').length;

    const periodAppointments = this.filterItemsByTopRange(this.appointments, 'date');
    const periodExpenses = this.filterItemsByTopRange(this.expenses, 'date');
    const periodPendingAppointments = periodAppointments.filter((appointment) => this.getEffectiveAppointmentPrice(appointment) - toNumber(appointment.amountPaid) > 0);
    const periodPendingClients = new Set(periodPendingAppointments.map((appointment) => this.getFinanceGroupingKey(appointment))).size;
    const pending = periodPendingAppointments.reduce((sum, appointment) => sum + Math.max(0, this.getEffectiveAppointmentPrice(appointment) - toNumber(appointment.amountPaid)), 0);
    const periodReceived = periodAppointments.reduce((sum, appointment) => sum + toNumber(appointment.amountPaid), 0);
    const periodExpensesTotal = periodExpenses.reduce((sum, expense) => sum + toNumber(expense.amount), 0);
    const result = periodReceived - periodExpensesTotal;

    const setText = (id, value) => {
      const el = document.getElementById(id);
      if (el) el.textContent = String(value);
    };

    const currentUserName = this.getSignatureName();

    const resultCard = document.getElementById('dash-card-resultado');
    if (resultCard) {
      resultCard.classList.remove('result-positive', 'result-negative', 'result-neutral');
      if (result > 0) resultCard.classList.add('result-positive');
      else if (result < 0) resultCard.classList.add('result-negative');
      else resultCard.classList.add('result-neutral');
    }

    setText('dash-consultas-hoje', todayApps.length);
    setText('dash-consultas-hoje-sub', `${doneToday} concluídas`);
    setText('dash-received-month', formatCurrency(periodReceived));
    setText('dash-pending-total', formatCurrency(pending));
    setText('dash-pending-count', `${periodPendingAppointments.length} cobranças pendentes`);
    setText('dash-expenses-total', formatCurrency(periodExpensesTotal));
    setText('dash-expenses-count', `${periodExpenses.length} despesas no período`);
    setText('dash-result-total', formatCurrency(result));
    setText('dash-result-sub', `Recebido ${formatCurrency(periodReceived)} / Despesas ${formatCurrency(periodExpensesTotal)}`);
    setText('header-total-clients', this.getPatientClients().length);
    setText('header-current-user-name', `Usuário: ${currentUserName}`);
    setText('nav-pending-badge', periodPendingClients);

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
            <span class="dash-status-chip ${this.getAppointmentStatusMeta(a.status).chipClass}">${safeText(this.getAppointmentStatusMeta(a.status).label)}</span>
          </div>
        `).join('');
      }
    }

    const dashPending = document.getElementById('dash-pending-list');
    if (dashPending) {
      const pend = periodPendingAppointments.slice(0, 6);
      if (!pend.length) {
        dashPending.innerHTML = '<div class="empty-state"><p>Sem cobranças pendentes.</p></div>';
      } else {
        dashPending.innerHTML = pend.map((a) => `
          <div class="dash-bubble-item is-pending" role="button" tabindex="0" data-action="open-appointment" data-appointment-id="${safeText(a.id || '')}" aria-label="Abrir cobrança pendente de ${safeText(a.clientName || '-')}">
            <div class="dash-bubble-content">
              <strong>${safeText(a.clientName || '-')}</strong>
              <p>${formatDateBR(a.date)} - Em aberto</p>
            </div>
            <span class="dash-amount-chip">${formatCurrency(Math.max(0, this.getEffectiveAppointmentPrice(a) - toNumber(a.amountPaid)))}</span>
          </div>
        `).join('');
      }
    }
  }

  switchAgendaSubtab(mode) {
    const normalized = mode === 'por-dia' ? 'por-dia' : 'geral';
    this.agendaSubtab = normalized;

    const btnGeral = document.getElementById('btn-agenda-subtab-geral');
    const btnPorDia = document.getElementById('btn-agenda-subtab-por-dia');
    const panelGeral = document.getElementById('agenda-subtab-geral');
    const panelPorDia = document.getElementById('agenda-subtab-por-dia');

    if (btnGeral) btnGeral.classList.toggle('active', normalized === 'geral');
    if (btnPorDia) btnPorDia.classList.toggle('active', normalized === 'por-dia');
    if (panelGeral) panelGeral.style.display = normalized === 'geral' ? '' : 'none';
    if (panelPorDia) panelPorDia.style.display = normalized === 'por-dia' ? '' : 'none';

    if (normalized === 'por-dia') {
      this.initAgendaDayMiniCalendar();
      this.renderAgendaDayList();
    }
  }

  toggleAgendaDayMiniCalendar() {
    const view = document.querySelector('.agenda-day-view');
    if (view) view.classList.toggle('is-collapsed');
  }

  initAgendaDayMiniCalendar() {
    const el = document.getElementById('agenda-day-mini-calendar');
    if (!el || typeof window.flatpickr !== 'function') return;

    if (this.agendaDayMiniPicker) {
      this.refreshAgendaDayMiniCalendarMarks();
      return;
    }

    const selected = this.agendaDaySelectedDate || getTodayStr();
    this.agendaDaySelectedDate = selected;

    this.agendaDayMiniPicker = window.flatpickr(el, {
      inline: true,
      appendTo: el,
      locale: 'pt',
      defaultDate: selected,
      onChange: (selectedDates, dateStr) => {
        this.agendaDaySelectedDate = dateStr;
        this.agendaConfirmSelectedIds.clear();
        this.agendaConfirmPendingQueue = [];
        this.renderAgendaDayList();
      },
      onDayCreate: (selectedDates, dateStr, fp, dayElem) => {
        this.markAgendaDayCell(dayElem);
      },
      onMonthChange: () => window.setTimeout(() => this.refreshAgendaDayMiniCalendarMarks(), 0),
      onYearChange: () => window.setTimeout(() => this.refreshAgendaDayMiniCalendarMarks(), 0)
    });
  }

  refreshAgendaDayMiniCalendarMarks() {
    const el = document.getElementById('agenda-day-mini-calendar');
    if (!el) return;
    el.querySelectorAll('.flatpickr-day').forEach((dayElem) => this.markAgendaDayCell(dayElem));
  }

  markAgendaDayCell(dayElem) {
    if (!dayElem) return;
    const dateObj = dayElem.dateObj;
    if (!(dateObj instanceof Date) || Number.isNaN(dateObj.getTime())) return;
    const iso = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;
    const hasSession = this.appointments.some((a) => a.date === iso);
    dayElem.classList.toggle('has-session', hasSession);
  }

  getClientInitials(name) {
    const parts = String(name || '').trim().split(/\s+/).filter(Boolean);
    if (!parts.length) return '?';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  getAppointmentConfirmationBadge(appointment) {
    const status = String((appointment && appointment.confirmationStatus) || '').trim();
    if (status === 'confirmado') return { label: 'Confirmado', className: 'is-confirmado' };
    if (status === 'nao_confirmado') return { label: 'Não confirmado', className: 'is-nao-confirmado' };
    if (status === 'pendente') return { label: 'Aguardando resposta', className: 'is-pendente-confirmacao' };
    return null;
  }

  renderAgendaDayList() {
    const listBody = document.getElementById('agenda-day-list-body');
    const titleEl = document.getElementById('agenda-day-list-title');
    if (!listBody) return;

    const selected = this.agendaDaySelectedDate || getTodayStr();
    if (titleEl) {
      titleEl.textContent = `Sessões do dia ${formatDateBR(selected)} (${weekdayLongPt(selected)})`;
    }

    const dayAppointments = this.appointments
      .filter((a) => a.date === selected)
      .sort((a, b) => String(a.time || '').localeCompare(String(b.time || '')));

    if (!dayAppointments.length) {
      listBody.innerHTML = '<div class="agenda-day-list-empty">Nenhuma sessão agendada para este dia.</div>';
    } else {
      listBody.innerHTML = dayAppointments.map((a) => {
        const initials = this.getClientInitials(a.clientName || '-');
        const paymentStatus = String(a.paymentStatus || '').toLowerCase();
        const metaClass = paymentStatus.includes('pago') ? 'is-pago' : (paymentStatus.includes('parcial') ? 'is-parcial' : 'is-pendente');
        const metaLabel = a.paymentStatus || 'Pendente';
        const confirmBadge = this.getAppointmentConfirmationBadge(a);
        const confirmChip = confirmBadge
          ? `<span class="agenda-confirm-badge ${confirmBadge.className} is-editable" title="Clique para alterar (ex.: cliente desistiu)" onclick="event.stopPropagation();app.cycleAgendaConfirmationStatus('${a.id}')">${safeText(confirmBadge.label)}</span>`
          : '';
        return `
          <div class="agenda-day-session-row" data-appointment-id="${safeText(a.id || '')}" onclick="app.openAppointmentModal('${a.id}')">
            <span class="agenda-day-session-time"><i data-lucide="clock"></i>${safeText(a.time || '--:--')}</span>
            <span class="agenda-day-avatar" style="background:${safeText(normalizeHexColor(a.color || DEFAULT_APPOINTMENT_COLOR))};">${safeText(initials)}</span>
            <span class="agenda-day-session-name">${safeText(a.clientName || '-')}</span>
            <span class="agenda-day-session-meta ${metaClass}">${safeText(metaLabel)}</span>
            ${confirmChip}
          </div>
        `;
      }).join('');
    }

    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }

    this.renderAgendaDayConfirmPanel(dayAppointments);
  }

  toggleAgendaConfirmSelection(appointmentId, checked) {
    if (!this.agendaConfirmSelectedIds) this.agendaConfirmSelectedIds = new Set();
    if (checked) {
      this.agendaConfirmSelectedIds.add(appointmentId);
    } else {
      this.agendaConfirmSelectedIds.delete(appointmentId);
    }
    this.updateAgendaConfirmSendButtonState();
  }

  toggleAgendaConfirmSelectAll(checked) {
    if (!this.agendaConfirmSelectedIds) this.agendaConfirmSelectedIds = new Set();
    document.querySelectorAll('.agenda-confirm-row-checkbox:not(:disabled)').forEach((checkbox) => {
      checkbox.checked = checked;
      const appointmentId = checkbox.getAttribute('data-appointment-id');
      if (!appointmentId) return;
      if (checked) {
        this.agendaConfirmSelectedIds.add(appointmentId);
      } else {
        this.agendaConfirmSelectedIds.delete(appointmentId);
      }
    });
    this.updateAgendaConfirmSendButtonState();
  }

  updateAgendaConfirmSendButtonState() {
    const btn = document.getElementById('btn-send-agenda-confirmations');
    if (!btn) return;
    const count = this.agendaConfirmSelectedIds ? this.agendaConfirmSelectedIds.size : 0;
    btn.disabled = count === 0;
    btn.innerHTML = count > 0
      ? `<i data-lucide="message-circle"></i> Enviar confirmação (${count})`
      : '<i data-lucide="message-circle"></i> Enviar confirmação';
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  }

  resendAgendaConfirmation(appointmentId) {
    if (window.agendaModule && typeof window.agendaModule.sendAppointmentConfirmationWhatsApp === 'function') {
      window.agendaModule.sendAppointmentConfirmationWhatsApp(this, appointmentId);
    }
  }

  clearAgendaConfirmationStatus(appointmentId) {
    if (window.agendaModule && typeof window.agendaModule.clearAppointmentConfirmationStatus === 'function') {
      window.agendaModule.clearAppointmentConfirmationStatus(this, appointmentId);
    }
  }

  cycleAgendaConfirmationStatus(appointmentId) {
    if (window.agendaModule && typeof window.agendaModule.cycleAppointmentConfirmationStatus === 'function') {
      window.agendaModule.cycleAppointmentConfirmationStatus(this, appointmentId);
    }
  }

  sendSelectedAgendaConfirmations() {
    if (window.agendaModule && typeof window.agendaModule.sendSelectedAppointmentConfirmations === 'function') {
      window.agendaModule.sendSelectedAppointmentConfirmations(this, this.agendaConfirmSelectedIds);
    }
  }

  renderAgendaDayConfirmPanel(dayAppointments) {
    const listEl = document.getElementById('agenda-day-confirm-list');
    if (!listEl) return;
    if (!this.agendaConfirmSelectedIds) this.agendaConfirmSelectedIds = new Set();

    const validIds = new Set((dayAppointments || []).map((a) => a.id));
    this.agendaConfirmSelectedIds.forEach((id) => {
      if (!validIds.has(id)) this.agendaConfirmSelectedIds.delete(id);
    });

    if (Array.isArray(this.agendaConfirmPendingQueue)) {
      this.agendaConfirmPendingQueue = this.agendaConfirmPendingQueue.filter((id) => validIds.has(id));
    }
    const nextQueuedId = Array.isArray(this.agendaConfirmPendingQueue) && this.agendaConfirmPendingQueue.length
      ? this.agendaConfirmPendingQueue[0]
      : null;

    if (!dayAppointments || !dayAppointments.length) {
      listEl.innerHTML = '<div class="agenda-day-list-empty">Nenhuma sessão agendada para este dia.</div>';
      this.updateAgendaConfirmSendButtonState();
      return;
    }

    listEl.innerHTML = dayAppointments.map((a) => {
      const client = this.clients.find((c) => c.id === a.clientId);
      const hasPhone = Boolean(this.normalizeWhatsAppPhone((client && client.phone) || ''));
      const confirmBadge = this.getAppointmentConfirmationBadge(a);
      const badgeHtml = confirmBadge
        ? `<span class="agenda-confirm-badge ${confirmBadge.className} is-editable" title="Clique para alterar (ex.: cliente desistiu)" onclick="event.stopPropagation();app.cycleAgendaConfirmationStatus('${a.id}')">${safeText(confirmBadge.label)}</span>`
        : '<span class="agenda-confirm-badge is-nunca-enviado">Não enviado</span>';
      const isStuckPending = String(a.confirmationStatus || '').trim() === 'pendente';
      const clearBtnHtml = isStuckPending
        ? `<button type="button" class="agenda-confirm-clear-btn" title="Limpar status travado (voltar para não enviado)" onclick="app.clearAgendaConfirmationStatus('${a.id}')">
             <i data-lucide="x"></i>
           </button>`
        : '';
      const checked = this.agendaConfirmSelectedIds.has(a.id) ? 'checked' : '';
      const disabled = hasPhone ? '' : 'disabled';
      const rowTitle = hasPhone ? '' : 'title="Cliente sem telefone válido para WhatsApp"';
      const isNextQueued = nextQueuedId === a.id;
      const sendBtnTitle = isNextQueued ? 'Clique para continuar o envio em sequência' : 'Enviar confirmação';

      return `
        <div class="agenda-day-confirm-row ${hasPhone ? '' : 'is-disabled'} ${isNextQueued ? 'is-next-queued' : ''}" ${rowTitle}>
          <div class="agenda-day-confirm-row-main">
            <input type="checkbox" class="agenda-confirm-row-checkbox" data-appointment-id="${safeText(a.id || '')}" ${checked} ${disabled} onchange="app.toggleAgendaConfirmSelection('${a.id}', this.checked)">
            <span class="agenda-day-confirm-time">${safeText(a.time || '--:--')}</span>
            <span class="agenda-day-confirm-name">${safeText(a.clientName || '-')}</span>
          </div>
          <div class="agenda-day-confirm-row-meta">
            ${badgeHtml}
            ${clearBtnHtml}
            ${isNextQueued ? '<span class="agenda-confirm-badge is-next-queued-badge">Próximo</span>' : ''}
            <button type="button" class="agenda-confirm-resend-btn ${isNextQueued ? 'is-pulsing' : ''}" title="${sendBtnTitle}" onclick="app.resendAgendaConfirmation('${a.id}')" ${hasPhone ? '' : 'disabled'}>
              <i data-lucide="send"></i>
            </button>
          </div>
        </div>
      `;
    }).join('');

    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }

    this.updateAgendaConfirmSendButtonState();
  }

  layoutAgendaDayEvents(dayAppointments) {
    const withMinutes = dayAppointments
      .map((a) => {
        const match = /^(\d{1,2}):(\d{2})$/.exec(String(a.time || '').trim());
        if (!match) return null;
        const startMin = (Number(match[1]) * 60) + Number(match[2]);
        return { ...a, startMin, endMin: startMin + AGENDA_EVENT_DURATION_MIN };
      })
      .filter(Boolean)
      .sort((a, b) => a.startMin - b.startMin || a.endMin - b.endMin);

    const positioned = [];
    let cluster = [];
    let clusterEnd = -Infinity;

    const flushCluster = () => {
      cluster.forEach((ev, i) => positioned.push({ ...ev, stackIndex: i, stackSize: cluster.length }));
      cluster = [];
    };

    withMinutes.forEach((ev) => {
      if (cluster.length && ev.startMin < clusterEnd) {
        cluster.push(ev);
        clusterEnd = Math.max(clusterEnd, ev.endMin);
      } else {
        flushCluster();
        cluster = [ev];
        clusterEnd = ev.endMin;
      }
    });
    flushCluster();

    return positioned;
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
      const start = agendaStartInput ? (this.normalizeAgendaDateToIso(agendaStartInput.value) || this.agendaCalendarStartDate) : this.agendaCalendarStartDate;
      const days = Array.from({ length: 7 }, (_, idx) => addDaysIso(start, idx));
      const todayIso = getTodayStr();

      const rangeStartHour = Math.max(0, Math.min(23, Number.isInteger(this.agendaHourRangeStart) ? this.agendaHourRangeStart : AGENDA_HOUR_RANGE_DEFAULT_START));
      const rangeEndHour = Math.max(rangeStartHour + 1, Math.min(23, Number.isInteger(this.agendaHourRangeEnd) ? this.agendaHourRangeEnd : AGENDA_HOUR_RANGE_DEFAULT_END));
      this.agendaHourRangeStart = rangeStartHour;
      this.agendaHourRangeEnd = rangeEndHour;
      this.updateAgendaHourRangeInputsUI();

      const hours = Array.from({ length: (rangeEndHour - rangeStartHour) + 1 }, (_, idx) => rangeStartHour + idx);
      const visibleStartMin = rangeStartHour * 60;
      const visibleEndMin = (rangeEndHour + 1) * 60;

      calendarGrid.style.gridTemplateRows = `auto repeat(${hours.length}, 60px)`;

      const headerHtml = `<div class="agenda-header blank" style="grid-column:1; grid-row:1;"></div>`
        + days.map((date, dayIdx) => `
          <div class="agenda-header ${date === todayIso ? 'agenda-header-today' : ''}" style="grid-column:${dayIdx + 2}; grid-row:1;">
            <div>${safeText(weekdayShortPt(date))}</div>
            <div class="agenda-header-date">${formatDateBR(date)}</div>
          </div>
        `).join('');

      const gridHtml = hours.map((hour, hourIdx) => {
        const hourLabel = `${String(hour).padStart(2, '0')}:00`;
        const rowLine = hourIdx + 2;
        const timeAxis = `<div class="agenda-time-axis" style="grid-column:1; grid-row:${rowLine};">${hourLabel}</div>`;
        const rowCells = days.map((date, dayIdx) => `<div class="agenda-cell ${date === todayIso ? 'agenda-cell-today' : ''}" style="grid-column:${dayIdx + 2}; grid-row:${rowLine};"></div>`).join('');
        return timeAxis + rowCells;
      }).join('');

      const dayEndRowLine = 2 + hours.length;

      let outOfRangeCount = 0;

      const eventsHtml = days.map((date, dayIdx) => {
        const dayAppointments = filtered.filter((a) => a.date === date);
        const positioned = this.layoutAgendaDayEvents(dayAppointments);

        return positioned.map((a) => {
          const inRange = a.startMin < visibleEndMin && a.endMin > visibleStartMin;
          if (!inRange) {
            outOfRangeCount += 1;
            return '';
          }

          const isReminderTarget = String(this.agendaAttentionAppointmentId || '') === String(a.id || '');
          const statusClass = String(a.paymentStatus || '').toLowerCase().includes('pago')
            ? 'agenda-event-pago'
            : (String(a.paymentStatus || '').toLowerCase().includes('parcial') ? 'agenda-event-parcial' : 'agenda-event-pendente');
          const cascadeLeft = -10 + (a.stackIndex * AGENDA_CASCADE_STEP_PX);
          const clippedStartMin = Math.max(a.startMin, visibleStartMin);
          const relativeStartMin = clippedStartMin - visibleStartMin;
          const cardHeight = Math.max(34, a.endMin - clippedStartMin);
          const positionStyle = `grid-column:${dayIdx + 2}; grid-row:2 / ${dayEndRowLine}; margin-top:${relativeStartMin}px; margin-left:${cascadeLeft}px; height:${cardHeight}px; z-index:${15 + a.stackIndex};`;
          return `
            <div class="agenda-event ${statusClass} ${isReminderTarget ? 'agenda-reminder-target' : ''} ${a.stackSize > 1 ? 'agenda-event-cascade' : ''}" style="${agendaEventInlineStyle(a.color || DEFAULT_APPOINTMENT_COLOR)} ${positionStyle}" role="button" tabindex="0" data-appointment-id="${safeText(a.id || '')}" onclick="app.openAppointmentModal('${a.id}')" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();app.openAppointmentModal('${a.id}');}">
              <div class="agenda-event-header">
                <span class="agenda-event-time">${safeText(a.time || '--:--')}</span>
                <button class="agenda-event-whatsapp" type="button" title="Enviar confirmação no WhatsApp" onclick="event.stopPropagation();app.sendAppointmentWhatsApp('${a.id}')">
                  <i data-lucide="message-circle"></i>
                </button>
              </div>
              <div class="agenda-event-title">${safeText(a.clientName || '-')}</div>
              <div class="agenda-event-meta">${safeText(a.procedure || 'Consulta')}</div>
            </div>
          `;
        }).join('');
      }).join('');

      calendarGrid.innerHTML = headerHtml + gridHtml + eventsHtml;

      const hourRangeNote = document.getElementById('agenda-hour-range-note');
      if (hourRangeNote) {
        if (outOfRangeCount > 0) {
          const plural = outOfRangeCount > 1 ? 's' : '';
          hourRangeNote.innerHTML = `<i data-lucide="alert-triangle"></i> ${outOfRangeCount} consulta${plural} fora do horário exibido. <button type="button" id="btn-agenda-hour-range-show-all">Ver tudo</button>`;
          hourRangeNote.style.display = 'inline-flex';
          const showAllBtn = document.getElementById('btn-agenda-hour-range-show-all');
          if (showAllBtn) showAllBtn.addEventListener('click', () => this.resetAgendaHourRange());
          if (window.lucide && typeof window.lucide.createIcons === 'function') window.lucide.createIcons();
        } else {
          hourRangeNote.style.display = 'none';
          hourRangeNote.innerHTML = '';
        }
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
      const isReminderTarget = String(this.agendaAttentionAppointmentId || '') === String(a.id || '');
      const payment = String(a.paymentStatus || 'Pendente');
      const meta = this.getAppointmentStatusMeta(a.status);
      const isCancelledStatus = meta.bucket === 'canceladasCliente' || meta.bucket === 'canceladasProfissional';
      const effectivePrice = this.getEffectiveAppointmentPrice(a);
      const pendingBalance = Math.max(0, effectivePrice - toNumber(a.amountPaid));
      const paymentAction = pendingBalance > 0
        ? `app.openPaymentModal('${a.id}')`
        : `app.openAppointmentModal('${a.id}')`;
      const paymentTitle = pendingBalance > 0
        ? 'Clique para dar baixa'
        : 'Pagamento quitado';
      const paymentClass = String(payment).toLowerCase().includes('pago')
        ? 'badge-pago'
        : (String(payment).toLowerCase().includes('parcial') ? 'badge-parcial' : 'badge-pendente');
      return `
        <tr data-appointment-id="${safeText(a.id || '')}" class="${isReminderTarget ? 'agenda-reminder-target-row' : ''}" oncontextmenu="app.openAgendaQuickActions(event, '${a.id}')" onpointerdown="app.startAgendaRowLongPress(event, '${a.id}')" onpointerup="app.clearAgendaRowLongPress()" onpointerleave="app.clearAgendaRowLongPress()" onpointercancel="app.clearAgendaRowLongPress()">
          <td><strong>${formatDateBR(a.date)}</strong><br><span style="color:var(--text-muted);font-size:0.82rem;">${safeText(a.time || '--:--')} hs</span></td>
          <td>${safeText(a.clientName || '-')}</td>
          <td>${safeText(a.procedure || '-')}</td>
          <td><strong>${formatCurrency(effectivePrice)}</strong></td>
          <td>${isCancelledStatus
            ? `<span class="badge ${meta.badgeClass}" title="Abra o agendamento para alterar o status">${safeText(meta.label)}</span>`
            : `<button type="button" class="badge ${meta.badgeClass}" onclick="app.cycleAppointmentStatus('${a.id}')" title="Clique para alterar status">${safeText(meta.label)}</button>`
          }</td>
          <td><button type="button" class="badge ${paymentClass}" onclick="${paymentAction}" title="${paymentTitle}">${safeText(payment)}</button></td>
          <td class="agenda-actions-cell">
            <button class="btn btn-sm btn-secondary" type="button" onclick="app.openAppointmentModal('${a.id}')"><i data-lucide="pencil"></i> Editar</button>
            <button class="btn btn-sm btn-secondary" type="button" onclick="app.sendAppointmentWhatsApp('${a.id}')"><i data-lucide="message-circle"></i> WhatsApp</button>
            <button class="btn btn-sm btn-ghost agenda-delete-btn" type="button" style="color:var(--danger);" onclick="app.deleteAppointment('${a.id}')"><i data-lucide="trash-2"></i></button>
          </td>
        </tr>
      `;
    }).join('');

    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }

    this.focusAgendaReminderTarget();

    if (this.agendaSubtab === 'por-dia') {
      this.refreshAgendaDayMiniCalendarMarks();
      this.renderAgendaDayList();
    }
  }

  startAgendaRowLongPress(event, appointmentId) {
    if (!event || event.pointerType !== 'touch') return;
    this.clearAgendaRowLongPress();

    const x = Number(event.clientX || 0);
    const y = Number(event.clientY || 0);
    const id = String(appointmentId || '').trim();
    if (!id) return;

    this.agendaRowLongPressTimerId = window.setTimeout(() => {
      this.agendaRowLongPressTimerId = null;
      this.openAgendaQuickActions({ clientX: x, clientY: y, preventDefault() {}, stopPropagation() {} }, id);
    }, 520);
  }

  clearAgendaRowLongPress() {
    if (!this.agendaRowLongPressTimerId) return;
    window.clearTimeout(this.agendaRowLongPressTimerId);
    this.agendaRowLongPressTimerId = null;
  }

  closeAgendaQuickActions() {
    if (this.agendaQuickMenuOutsideHandler) {
      document.removeEventListener('pointerdown', this.agendaQuickMenuOutsideHandler, true);
      window.removeEventListener('scroll', this.agendaQuickMenuOutsideHandler, true);
      window.removeEventListener('resize', this.agendaQuickMenuOutsideHandler, true);
      this.agendaQuickMenuOutsideHandler = null;
    }

    if (this.agendaQuickMenuEscapeHandler) {
      document.removeEventListener('keydown', this.agendaQuickMenuEscapeHandler, true);
      this.agendaQuickMenuEscapeHandler = null;
    }

    if (this.agendaQuickMenuElement && this.agendaQuickMenuElement.parentNode) {
      this.agendaQuickMenuElement.parentNode.removeChild(this.agendaQuickMenuElement);
    }
    this.agendaQuickMenuElement = null;
  }

  openAgendaQuickActions(event, appointmentId) {
    const id = String(appointmentId || '').trim();
    if (!id) return;

    const appointment = this.appointments.find((item) => String((item && item.id) || '') === id);
    if (!appointment) return;

    if (event && typeof event.preventDefault === 'function') event.preventDefault();
    if (event && typeof event.stopPropagation === 'function') event.stopPropagation();
    this.clearAgendaRowLongPress();
    this.closeAgendaQuickActions();

    const menu = document.createElement('div');
    menu.className = 'agenda-quick-actions-menu';
    menu.setAttribute('role', 'menu');
    menu.setAttribute('aria-label', `Ações da consulta ${String(appointment.clientName || 'paciente')}`);

    const buildActionButton = (label, icon, onClick, tone = 'secondary') => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `btn btn-sm ${tone === 'danger' ? 'btn-ghost agenda-quick-action-danger' : 'btn-secondary'} agenda-quick-action-btn`;
      button.innerHTML = `<i data-lucide="${icon}"></i><span>${safeText(label)}</span>`;
      button.addEventListener('click', () => {
        this.closeAgendaQuickActions();
        onClick();
      });
      return button;
    };

    menu.appendChild(buildActionButton('Editar', 'pencil', () => this.openAppointmentModal(id)));
    menu.appendChild(buildActionButton('WhatsApp', 'message-circle', () => this.sendAppointmentWhatsApp(id)));
    menu.appendChild(buildActionButton('Excluir', 'trash-2', () => this.deleteAppointment(id), 'danger'));

    document.body.appendChild(menu);
    this.agendaQuickMenuElement = menu;

    const margin = 10;
    const viewportWidth = window.innerWidth || document.documentElement.clientWidth || 1280;
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 720;
    const rect = menu.getBoundingClientRect();
    const anchorX = Number((event && event.clientX) || 0);
    const anchorY = Number((event && event.clientY) || 0);
    let left = anchorX + 6;
    let top = anchorY + 6;

    if ((left + rect.width) > (viewportWidth - margin)) {
      left = viewportWidth - rect.width - margin;
    }
    if ((top + rect.height) > (viewportHeight - margin)) {
      top = viewportHeight - rect.height - margin;
    }

    menu.style.left = `${Math.max(margin, Math.round(left))}px`;
    menu.style.top = `${Math.max(margin, Math.round(top))}px`;

    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }

    this.agendaQuickMenuOutsideHandler = (evt) => {
      if (!this.agendaQuickMenuElement) return;
      if (evt && evt.target && this.agendaQuickMenuElement.contains(evt.target)) return;
      this.closeAgendaQuickActions();
    };
    this.agendaQuickMenuEscapeHandler = (evt) => {
      if (!evt || evt.key !== 'Escape') return;
      this.closeAgendaQuickActions();
    };

    // Delay pointerdown binding so the same opening pointer event doesn't instantly close the menu.
    window.setTimeout(() => {
      if (!this.agendaQuickMenuElement) return;
      document.addEventListener('pointerdown', this.agendaQuickMenuOutsideHandler, true);
      window.addEventListener('scroll', this.agendaQuickMenuOutsideHandler, true);
      window.addEventListener('resize', this.agendaQuickMenuOutsideHandler, true);
      document.addEventListener('keydown', this.agendaQuickMenuEscapeHandler, true);
    }, 0);
  }

  cycleAppointmentStatus(id) {
    const appt = this.appointments.find((a) => a.id === id);
    if (!appt) return;
    // Cicla só entre os 4 estados operacionais. Os 2 estados de cancelamento exigem
    // contexto (quem cancelou) e só devem ser escolhidos pelo modal de agendamento.
    const cycle = ['Agendado', 'Confirmado', 'Presente', 'Ausente'];
    const currentIndex = cycle.indexOf(this.normalizeAppointmentStatus(appt.status));
    // Se o status atual não está no ciclo (ex.: um dos 2 cancelamentos, chamado por
    // segurança fora do fluxo normal da badge), recomeça do início em vez de quebrar.
    const next = cycle[currentIndex === -1 ? 0 : (currentIndex + 1) % cycle.length];
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

  loadAgendaHourRangePreference() {
    try {
      const raw = localStorage.getItem(AGENDA_HOUR_RANGE_STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      const start = Number(parsed && parsed.start);
      const end = Number(parsed && parsed.end);
      if (Number.isInteger(start) && Number.isInteger(end) && start >= 0 && end <= 23 && start < end) {
        this.agendaHourRangeStart = start;
        this.agendaHourRangeEnd = end;
      }
    } catch (_) {
      /* ignore malformed preference */
    }
  }

  saveAgendaHourRangePreference() {
    try {
      localStorage.setItem(AGENDA_HOUR_RANGE_STORAGE_KEY, JSON.stringify({
        start: this.agendaHourRangeStart,
        end: this.agendaHourRangeEnd
      }));
    } catch (_) {
      /* ignore storage errors (private mode, quota, etc.) */
    }
  }

  setAgendaHourRange(startHour, endHour) {
    const start = Math.max(0, Math.min(23, Math.round(Number(startHour))));
    const end = Math.max(0, Math.min(23, Math.round(Number(endHour))));
    if (!Number.isFinite(start) || !Number.isFinite(end) || start >= end) {
      this.showToast('Horário inicial deve ser menor que o horário final.', 'warning');
      this.updateAgendaHourRangeInputsUI();
      return;
    }
    this.agendaHourRangeStart = start;
    this.agendaHourRangeEnd = end;
    this.saveAgendaHourRangePreference();
    this.renderAgendaTable();
  }

  resetAgendaHourRange() {
    this.agendaHourRangeStart = 0;
    this.agendaHourRangeEnd = 23;
    this.saveAgendaHourRangePreference();
    this.renderAgendaTable();
  }

  updateAgendaHourRangeInputsUI() {
    const startInput = document.getElementById('agenda-hour-range-start');
    const endInput = document.getElementById('agenda-hour-range-end');
    if (startInput) startInput.value = `${String(this.agendaHourRangeStart).padStart(2, '0')}:00`;
    if (endInput) endInput.value = `${String(this.agendaHourRangeEnd).padStart(2, '0')}:00`;
  }

  setClientSort(field) {
    const allowedFields = ['registrationNumber', 'name', 'category', 'createdAt', 'dob'];
    if (!allowedFields.includes(field)) return;

    if (this.clientSortField === field) {
      this.clientSortDirection = this.clientSortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.clientSortField = field;
      this.clientSortDirection = 'asc';
    }

    this.renderClientsTable();
  }

  sortClientRows(clients) {
    const direction = this.clientSortDirection === 'desc' ? -1 : 1;
    const field = this.clientSortField;

    return clients.sort((firstClient, secondClient) => {
      let comparison = 0;
      if (field === 'registrationNumber') {
        comparison = Number(firstClient.registrationNumber || 0) - Number(secondClient.registrationNumber || 0);
      } else if (field === 'createdAt') {
        comparison = String(firstClient.createdAt || '').localeCompare(String(secondClient.createdAt || ''));
      } else {
        const firstValue = field === 'category'
          ? this.normalizeClientCategory(firstClient.category)
          : String(firstClient[field] || '');
        const secondValue = field === 'category'
          ? this.normalizeClientCategory(secondClient.category)
          : String(secondClient[field] || '');
        comparison = firstValue.localeCompare(secondValue, 'pt-BR', { sensitivity: 'base', numeric: true });
      }

      if (comparison === 0) {
        comparison = Number(firstClient.registrationNumber || 0) - Number(secondClient.registrationNumber || 0);
      }
      return comparison * direction;
    });
  }

  updateClientSortHeaders() {
    document.querySelectorAll('[data-client-sort]').forEach((button) => {
      const field = button.getAttribute('data-client-sort');
      const isActive = field === this.clientSortField;
      const icon = isActive && this.clientSortDirection === 'desc' ? 'arrow-down' : 'arrow-up';
      const header = button.closest('th');

      button.classList.toggle('is-active', isActive);
      button.innerHTML = `<span>${safeText(button.getAttribute('data-sort-label') || '')}</span><i data-lucide="${icon}"></i>`;
      if (header) header.setAttribute('aria-sort', isActive ? (this.clientSortDirection === 'asc' ? 'ascending' : 'descending') : 'none');
    });
  }

  renderClientsReportSummaryCard() {
    const grid = document.getElementById('clients-report-summary-grid');
    if (!grid) return;

    const scoped = this.filterItemsByTopRange(this.appointments || [], 'date');
    const counts = { agendadas: 0, confirmadas: 0, presentes: 0, ausentes: 0, canceladasCliente: 0, canceladasProfissional: 0 };
    scoped.forEach((a) => {
      const bucket = this.getAppointmentStatusMeta(a.status).bucket;
      if (counts[bucket] !== undefined) counts[bucket] += 1;
    });

    const cards = [
      { key: 'agendadas', label: 'Sessões Agendadas', icon: 'calendar', color: 'card-blue' },
      { key: 'confirmadas', label: 'Sessões Confirmadas', icon: 'badge-check', color: 'card-cyan' },
      { key: 'presentes', label: 'Presentes', icon: 'check-circle-2', color: 'card-green' },
      { key: 'ausentes', label: 'Ausentes', icon: 'alert-triangle', color: 'card-amber' },
      { key: 'canceladasCliente', label: 'Cliente Cancelou', icon: 'x-circle', color: 'card-red' },
      { key: 'canceladasProfissional', label: 'Profissional Cancelou', icon: 'x-octagon', color: 'card-purple' }
    ];

    grid.innerHTML = cards.map((c) => `
      <div class="stat-card ${c.color}" data-bucket="${c.key}" tabindex="0" role="button"
        onclick="app.openClientsReportBucket('${c.key}')" title="Ver estes agendamentos na Agenda"
        onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();app.openClientsReportBucket('${c.key}');}">
        <button type="button" class="stat-card-narrative-btn" title="Ver narrativas das sessões" onclick="event.stopPropagation();app.openPeriodNarrativesReport('${c.key}')">
          <i data-lucide="file-text"></i>
        </button>
        <div class="stat-icon"><i data-lucide="${c.icon}"></i></div>
        <div class="stat-info">
          <span class="stat-label">${c.label}</span>
          <h3 class="stat-value">${counts[c.key]}</h3>
        </div>
      </div>
    `).join('');

    const rangeLabel = document.getElementById('clients-report-range-label');
    if (rangeLabel) {
      const { start, end } = this.getTopRange();
      rangeLabel.textContent = (start || end) ? `Período: ${start ? formatDateBR(start) : '...'} até ${end ? formatDateBR(end) : '...'}` : 'Todo o período';
    }

    if (window.lucide && typeof window.lucide.createIcons === 'function') window.lucide.createIcons();
  }

  openClientsReportBucket(bucket) {
    const bucketToStatus = {
      agendadas: 'Agendado',
      confirmadas: 'Confirmado',
      presentes: 'Presente',
      ausentes: 'Ausente',
      canceladasCliente: 'CanceladoCliente',
      canceladasProfissional: 'CanceladoProfissional'
    };
    const status = bucketToStatus[bucket];
    if (!status) return;

    const { start, end } = this.getTopRange();
    const agendaSearch = document.getElementById('agenda-search');
    const agendaStart = document.getElementById('agenda-filter-start');
    const agendaEnd = document.getElementById('agenda-filter-end');
    const agendaStatus = document.getElementById('agenda-filter-status');

    if (agendaSearch) agendaSearch.value = '';
    if (agendaStart) agendaStart.value = start || '';
    if (agendaEnd) agendaEnd.value = end || '';
    if (agendaStatus) agendaStatus.value = status;

    this.agendaReturnTab = 'clientes';
    this.switchAgendaSubtab('geral');
    this.switchTab('agenda');
    this.renderAgendaTable();
  }

  returnToClientsFromAgenda() {
    this.switchTab('clientes');
  }

  // Segundo caminho de acesso à narrativa: a partir dos cards de "Relatório de Sessões do
  // Período" (agregado de todos os pacientes), sem substituir o clique principal do card
  // (que continua levando à Agenda filtrada). Abre um modal inline (não um popup/print)
  // listando a narrativa ditada de cada sessão daquele status no período selecionado.
  openPeriodNarrativesReport(bucket) {
    const bucketLabels = {
      agendadas: 'Sessões Agendadas',
      confirmadas: 'Sessões Confirmadas',
      presentes: 'Presentes',
      ausentes: 'Ausentes',
      canceladasCliente: 'Cliente Cancelou',
      canceladasProfissional: 'Profissional Cancelou'
    };
    const bucketLabel = bucketLabels[bucket] || bucket;

    const scoped = this.filterItemsByTopRange(this.appointments || [], 'date')
      .filter((a) => this.getAppointmentStatusMeta(a.status).bucket === bucket);

    this.renderPeriodNarrativesModal(scoped, bucketLabel);
  }

  // Botão "Ver Narrativas" no cabeçalho de "Relatório de Sessões do Período" — traz, num
  // único lugar bem visível, todas as sessões do período selecionado (de todos os status)
  // que têm narrativa efetivamente registrada.
  openAllPeriodNarrativesModal() {
    const scoped = this.filterItemsByTopRange(this.appointments || [], 'date')
      .filter((a) => Boolean(this.getSessionNarrativeDisplay(a).text));

    this.renderPeriodNarrativesModal(scoped, 'Todas as sessões com narrativa');
  }

  renderPeriodNarrativesModal(appointmentsList, headingLabel) {
    const modal = document.getElementById('modal-period-narratives');
    const list = document.getElementById('period-narratives-list');
    const titleEl = document.getElementById('period-narratives-title');
    if (!modal || !list) return;

    const scoped = (appointmentsList || [])
      .slice()
      .sort((a, b) => `${b.date} ${b.time}`.localeCompare(`${a.date} ${a.time}`));

    if (titleEl) {
      const { start, end } = this.getTopRange();
      const rangeLabel = (start || end) ? `${start ? formatDateBR(start) : '...'} até ${end ? formatDateBR(end) : '...'}` : 'todo o período';
      titleEl.textContent = `Narrativas — ${headingLabel} (${rangeLabel})`;
    }

    if (!scoped.length) {
      list.innerHTML = '<p class="text-muted" style="font-size:0.85rem;margin:0;">Nenhuma sessão com narrativa encontrada para este filtro no período selecionado.</p>';
    } else {
      list.innerHTML = scoped.map((a) => {
        const clientName = String(a.clientName || (this.clients.find((c) => c.id === a.clientId) || {}).name || 'Cliente').trim() || 'Cliente';
        const { text: narrative, migrated } = this.getSessionNarrativeDisplay(a);
        const hasNarrative = Boolean(narrative);
        const migratedHint = (hasNarrative && migrated) ? ' <em class="client-session-narrative-migrated-hint">(migrado de Observações)</em>' : '';
        return `
          <div class="client-session-narrative-item">
            <div class="client-session-narrative-header">
              <div class="client-session-narrative-meta">
                <strong>${escapeHtml(clientName)}</strong>
                <span class="client-session-narrative-procedure">${escapeHtml(formatDateBR(a.date))}${a.time ? ` às ${escapeHtml(a.time)}` : ''} · ${escapeHtml(a.procedure || 'Procedimento não informado')}</span>
              </div>
              <button type="button" class="btn btn-secondary btn-sm" onclick="app.printAppointmentSession('${a.id}')">
                <i data-lucide="printer"></i> Imprimir sessão
              </button>
            </div>
            <p class="client-session-narrative-text${hasNarrative ? '' : ' is-empty'}">${hasNarrative ? `${escapeHtml(narrative).replace(/\n/g, '<br>')}${migratedHint}` : 'Nenhuma narrativa registrada nesta sessão.'}</p>
          </div>
        `;
      }).join('');
    }

    modal.classList.add('active');
    if (window.lucide && typeof window.lucide.createIcons === 'function') window.lucide.createIcons();
  }

  closePeriodNarrativesModal() {
    const modal = document.getElementById('modal-period-narratives');
    if (modal) modal.classList.remove('active');
  }

  renderClientsTable() {
    this.renderClientsReportSummaryCard();
    const tbody = document.getElementById('clientes-table-body');
    if (!tbody) return;

    const existingClientIds = new Set(this.clients.map((c) => c.id));
    this.selectedClientReportIds.forEach((id) => {
      if (!existingClientIds.has(id)) this.selectedClientReportIds.delete(id);
    });

    this.populateClientCategoryFilterOptions();
    this.populateAllManagedSelectsAndFilters();

    const search = String((document.getElementById('clientes-search') || {}).value || '').toLowerCase().trim();
    const phoneFilter = (document.getElementById('clientes-phone-filter') || {}).value || 'todos';
    const categoryFilter = String((document.getElementById('clientes-category-filter') || {}).value || 'paciente').trim().toLowerCase();
    const convenioFilter = String((document.getElementById('clientes-convenio-filter') || {}).value || 'todos');
    const planoFinanceiroFilter = String((document.getElementById('clientes-plano-financeiro-filter') || {}).value || 'todos');
    const tagsFilter = String((document.getElementById('clientes-tags-filter') || {}).value || 'todos');

    let filtered = this.clients.slice();
    if (categoryFilter !== 'todos') {
      filtered = filtered.filter((client) => this.normalizeClientCategoryKey(client.category) === categoryFilter);
    }
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

    if (convenioFilter !== 'todos') {
      const key = this.normalizeManagedOptionKey(convenioFilter);
      filtered = filtered.filter((c) => this.normalizeManagedOptionKey(c.convenio) === key);
    }
    if (planoFinanceiroFilter !== 'todos') {
      const key = this.normalizeManagedOptionKey(planoFinanceiroFilter);
      filtered = filtered.filter((c) => this.normalizeManagedOptionKey(c.planoFinanceiro) === key);
    }
    if (tagsFilter !== 'todos') {
      const key = this.normalizeManagedOptionKey(tagsFilter);
      filtered = filtered.filter((c) => this.parseClientTags(c.tags).some((tag) => this.normalizeManagedOptionKey(tag) === key));
    }

    this.sortClientRows(filtered);
    this.updateClientSortHeaders();

    if (!filtered.length) {
      tbody.innerHTML = `
        <tr>
          <td colspan="8">
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
        <td>${safeText(this.normalizeClientCategory(c.category))}</td>
        <td>${safeText(c.phone || '-')}</td>
        <td>${formatDateBR(c.dob || '')}</td>
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

  getFinanceGroupingKey(appointment) {
    const cpfDigits = String((appointment && (appointment.clientCpf || appointment.cpf)) || '').replace(/\D/g, '');
    if (cpfDigits) return `cpf:${cpfDigits}`;

    const name = String((appointment && appointment.clientName) || '').normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase();

    if (name) return `name:${name}`;

    return `appt:${String((appointment && appointment.id) || '').trim() || 'sem-cliente'}`;
  }

  getEffectiveAppointmentPrice(appointment) {
    const storedPrice = toNumber((appointment && appointment.price) || 0);
    if (storedPrice > 0) return storedPrice;

    const financeKey = this.getFinanceGroupingKey(appointment);
    const knownAppointment = (this.appointments || [])
      .filter((item) => item !== appointment && this.getFinanceGroupingKey(item) === financeKey && toNumber(item.price) > 0)
      .sort((firstItem, secondItem) => `${String(secondItem.date || '')} ${String(secondItem.time || '')}`.localeCompare(`${String(firstItem.date || '')} ${String(firstItem.time || '')}`))[0];

    return knownAppointment ? toNumber(knownAppointment.price) : storedPrice;
  }

  getFinanceScopeAppointments() {
    return this.filterItemsByTopRange(this.appointments || [], 'date');
  }

  setFinanceSort(field) {
    const allowedFields = ['total', 'pending', 'paid', 'status'];
    if (!allowedFields.includes(field)) return;

    if (this.financeSortField === field) {
      this.financeSortDirection = this.financeSortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.financeSortField = field;
      this.financeSortDirection = 'asc';
    }

    this.renderFinanceiroTable();
  }

  sortFinanceRows(rows) {
    const direction = this.financeSortDirection === 'desc' ? -1 : 1;
    const field = this.financeSortField;

    return rows.sort((firstRow, secondRow) => {
      let comparison = 0;
      if (['total', 'pending', 'paid'].includes(field)) {
        comparison = toNumber(firstRow[field]) - toNumber(secondRow[field]);
      } else if (field === 'status') {
        const firstStatus = firstRow.pending > 0 ? (firstRow.paid > 0 ? 'Parcial' : 'Pendente') : 'Pago';
        const secondStatus = secondRow.pending > 0 ? (secondRow.paid > 0 ? 'Parcial' : 'Pendente') : 'Pago';
        comparison = firstStatus.localeCompare(secondStatus, 'pt-BR', { sensitivity: 'base' });
      } else {
        const firstLatest = `${String(firstRow.latestDate || '')} ${String(firstRow.latestTime || '')}`;
        const secondLatest = `${String(secondRow.latestDate || '')} ${String(secondRow.latestTime || '')}`;
        comparison = firstLatest.localeCompare(secondLatest);
      }

      if (comparison === 0) {
        comparison = String(firstRow.clientName || '').localeCompare(String(secondRow.clientName || ''), 'pt-BR', { sensitivity: 'base', numeric: true });
      }
      return comparison * direction;
    });
  }

  updateFinanceSortHeaders() {
    document.querySelectorAll('[data-finance-sort]').forEach((button) => {
      const field = button.getAttribute('data-finance-sort');
      const isActive = field === this.financeSortField;
      const icon = isActive && this.financeSortDirection === 'desc' ? 'arrow-down' : 'arrow-up';
      const header = button.closest('th');

      button.classList.toggle('is-active', isActive);
      button.innerHTML = `<span>${safeText(button.getAttribute('data-sort-label') || '')}</span><i data-lucide="${icon}"></i>`;
      if (header) header.setAttribute('aria-sort', isActive ? (this.financeSortDirection === 'asc' ? 'ascending' : 'descending') : 'none');
    });
  }

  updateFinancePendingClientsCard() {
    this.updateHeaderFinanceKpiPills();
  }

  updateHeaderFinanceKpiPills() {
    const periodAppointments = this.getFinanceScopeAppointments();
    const periodExpenses = this.filterItemsByTopRange(this.expenses, 'date');

    const pendingAppointments = periodAppointments.filter((a) => this.getEffectiveAppointmentPrice(a) - toNumber(a.amountPaid) > 0);
    const pendingClientsCount = new Set(pendingAppointments.map((a) => this.getFinanceGroupingKey(a))).size;
    const pendingTotal = pendingAppointments.reduce((sum, a) => sum + Math.max(0, this.getEffectiveAppointmentPrice(a) - toNumber(a.amountPaid)), 0);

    const pendingCountEl = document.getElementById('header-finance-pending-count');
    const pendingAmountEl = document.getElementById('header-finance-pending-amount');
    if (pendingCountEl) pendingCountEl.textContent = String(pendingClientsCount);
    if (pendingAmountEl) pendingAmountEl.textContent = formatCurrency(pendingTotal);

    const expensesCount = periodExpenses.length;
    const expensesTotal = periodExpenses.reduce((sum, e) => sum + toNumber(e.amount), 0);
    const expensesCountEl = document.getElementById('header-despesas-count');
    const expensesAmountEl = document.getElementById('header-despesas-amount');
    if (expensesCountEl) expensesCountEl.textContent = String(expensesCount);
    if (expensesAmountEl) expensesAmountEl.textContent = formatCurrency(expensesTotal);

    const periodReceived = periodAppointments.reduce((sum, a) => sum + toNumber(a.amountPaid), 0);
    const result = periodReceived - expensesTotal;
    const resultAmountEl = document.getElementById('header-resultado-amount');
    const resultPillEl = document.getElementById('header-resultado-pill');
    if (resultAmountEl) resultAmountEl.textContent = formatCurrency(result);
    if (resultPillEl) {
      resultPillEl.classList.remove('is-positive', 'is-negative');
      resultPillEl.classList.add(result < 0 ? 'is-negative' : 'is-positive');
    }
  }

  openFinancePendingGroup() {
    this.switchTab('financeiro');
    this.financeViewFilter = 'pending';
    this.renderFinanceiroTable();
  }

  openDespesasGroup() {
    this.switchTab('despesas');
  }

  openResultadoGroup() {
    this.switchTab('financeiro');
    this.financeViewFilter = 'all';
    this.renderFinanceiroTable();
  }

  renderFinanceiroTable() {
    const tbody = document.getElementById('financeiro-table-body');
    if (!tbody) return;
    const recentContainer = document.getElementById('finance-recent-appointments');
    this.updateFinanceViewModeUI();
    this.updateFinancePendingClientsCard();

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
    const financeAppointments = this.getFinanceScopeAppointments();
    const recentItems = financeAppointments.slice().sort((a, b) => `${String(b.date || '')} ${String(b.time || '')}`.localeCompare(`${String(a.date || '')} ${String(a.time || '')}`));

    if (recentContainer) {
      const visibleRecent = recentItems
        .filter((a) => !search || String(a.clientName || '').toLowerCase().includes(search) || String(a.procedure || '').toLowerCase().includes(search))
        .filter((a) => {
          if (this.financeViewFilter === 'pending') return Math.max(0, this.getEffectiveAppointmentPrice(a) - toNumber(a.amountPaid)) > 0;
          if (this.financeViewFilter === 'paid') return toNumber(a.amountPaid) > 0;
          return true;
        })
        .slice(0, this.financeViewMode === 'consulta' ? recentItems.length : 6);

      recentContainer.innerHTML = visibleRecent.length ? visibleRecent.map((appt) => {
        const effectivePrice = this.getEffectiveAppointmentPrice(appt);
        const pending = Math.max(0, effectivePrice - toNumber(appt.amountPaid));
        const paymentStatus = String(appt.paymentStatus || (pending > 0 ? (toNumber(appt.amountPaid) > 0 ? 'Parcial' : 'Pendente') : 'Pago'));
        const action = pending > 0 ? `app.openPaymentModal('${safeText(appt.id || '')}')` : `app.openAppointmentModal('${safeText(appt.id || '')}')`;
        return `
          <button type="button" class="finance-recent-item" onclick="${action}">
            <div class="finance-recent-main">
              <strong>${safeText(appt.clientName || '-')}</strong>
              <span>${safeText(appt.procedure || '-')}</span>
            </div>
            <div class="finance-recent-meta">
              <span>${safeText(formatDateBR(appt.date || ''))} ${safeText(appt.time || '--:--')}</span>
              <span>${safeText(formatCurrency(effectivePrice))}</span>
              <span>${safeText(paymentStatus)}</span>
            </div>
          </button>
        `;
      }).join('') : '<div class="empty-state"><p>Nenhum agendamento recente encontrado.</p></div>';
    }

    financeAppointments.forEach((a) => {
      const key = this.getFinanceGroupingKey(a);
      grouped[key] = grouped[key] || {
        clientId: key,
        financeKey: key,
        clientName: a.clientName || 'Sem cliente',
        clientCpf: String(a.clientCpf || '').trim(),
        qty: 0,
        total: 0,
        paid: 0,
        pending: 0,
        latestDate: '',
        latestTime: ''
      };
      const row = grouped[key];
      const currentStamp = `${String(a.date || '')} ${String(a.time || '')}`;
      const latestStamp = `${String(row.latestDate || '')} ${String(row.latestTime || '')}`;
      if (currentStamp > latestStamp) {
        row.latestDate = String(a.date || '');
        row.latestTime = String(a.time || '');
        row.clientName = a.clientName || row.clientName;
        row.clientCpf = String(a.clientCpf || row.clientCpf || '').trim();
      }
      const effectivePrice = this.getEffectiveAppointmentPrice(a);
      grouped[key].qty += 1;
      grouped[key].total += effectivePrice;
      grouped[key].paid += toNumber(a.amountPaid);
      grouped[key].pending += Math.max(0, effectivePrice - toNumber(a.amountPaid));
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

    this.sortFinanceRows(rows);
    this.updateFinanceSortHeaders();
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
            <div style="font-size:0.75rem;color:var(--text-muted);margin-top:0.2rem;">Último: ${safeText(formatDateBR(r.latestDate || ''))}${r.latestTime ? ` ${safeText(r.latestTime)}` : ''}</div>
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
    const selectedCount = rows.filter((row) => this.selectedFinanceReportClientIds.has(String(row.clientId || row.financeKey || ''))).length;

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

  setFinanceViewMode(mode) {
    this.financeViewMode = ['consulta', 'ambos'].includes(mode) ? mode : 'cliente';
    this.updateFinanceViewModeUI();
    this.renderFinanceiroTable();
  }

  updateFinanceViewModeUI() {
    const groupedCard = document.getElementById('finance-grouped-card');
    const recentCard = document.getElementById('finance-recent-card');
    const groupedBtn = document.querySelector('[data-finance-mode="cliente"]');
    const recentBtn = document.querySelector('[data-finance-mode="consulta"]');
    const bothBtn = document.querySelector('[data-finance-mode="ambos"]');

    const isConsulta = this.financeViewMode === 'consulta';
    const isAmbos = this.financeViewMode === 'ambos';
    if (groupedCard) groupedCard.style.display = isConsulta && !isAmbos ? 'none' : 'block';
    if (recentCard) recentCard.style.display = isConsulta && !isAmbos ? 'block' : (isAmbos ? 'block' : 'none');
    if (recentCard) recentCard.classList.toggle('is-compact', isConsulta && !isAmbos);

    if (groupedBtn) groupedBtn.classList.toggle('active', !isConsulta && !isAmbos);
    if (recentBtn) recentBtn.classList.toggle('active', isConsulta);
    if (bothBtn) bothBtn.classList.toggle('active', isAmbos);
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

      const appointmentDetails = this.getFinanceScopeAppointments()
        .filter((appt) => this.getFinanceGroupingKey(appt) === String(row.clientId || ''))
        .sort((a, b) => `${a.date || ''} ${a.time || ''}`.localeCompare(`${b.date || ''} ${b.time || ''}`));

      appointmentDetails.forEach((appt) => {
        const price = this.getEffectiveAppointmentPrice(appt);
        const paid = toNumber(appt.amountPaid);
        const open = Math.max(0, price - paid);
        lines.push(`  • ${formatDateBR(appt.date)} ${appt.time || ''} | ${appt.procedure || '-'} | Total: ${formatCurrency(price)} | Pago: ${formatCurrency(paid)} | Aberto: ${formatCurrency(open)} | ${appt.status || '-'}`);
      });

      lines.push('');
    });

    return lines;
  }

  printSelectedFinanceiroReports() {
    const rows = (this.lastFinanceiroRows || []).filter((row) => this.selectedFinanceReportClientIds.has(String(row.clientId || row.financeKey || '')));
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

    const matches = this.getFinanceScopeAppointments()
      .filter((a) => this.getFinanceGroupingKey(a) === key)
      .sort((a, b) => `${b.date || ''} ${b.time || ''}`.localeCompare(`${a.date || ''} ${a.time || ''}`));

    if (!matches.length) {
      this.showToast('Nenhuma consulta encontrada para este cliente.', 'warning');
      return;
    }

    this.openAppointmentModal(matches[0].id);
  }

  openPendingAppointmentByClient(clientId) {
    const key = String(clientId || '').trim();
    if (!key) {
      this.showToast('Cliente inválido para baixa.', 'warning');
      return;
    }

    const pendingMatches = this.getFinanceScopeAppointments()
      .filter((a) => this.getFinanceGroupingKey(a) === key)
      .filter((a) => Math.max(0, this.getEffectiveAppointmentPrice(a) - toNumber(a.amountPaid)) > 0)
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
    this.updateHeaderFinanceKpiPills();
    if (!tbody) return;

    const periodExpenses = this.filterItemsByTopRange(this.expenses, 'date');

    if (!periodExpenses.length) {
      const emptyMessage = this.expenses.length
        ? 'Nenhuma despesa cadastrada no período selecionado.'
        : 'Nenhuma despesa cadastrada.';
      tbody.innerHTML = `
        <tr>
          <td colspan="5"><div class="empty-state"><p>${emptyMessage}</p></div></td>
        </tr>
      `;
      return;
    }

    const sorted = periodExpenses.slice().sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')));
    tbody.innerHTML = sorted.map((e) => `
      <tr>
        <td>${safeText(e.description || '-')}</td>
        <td>${safeText(e.category || '-')}</td>
        <td><span class="money-pill money-pill-expense">${formatCurrency(e.amount || 0)}</span></td>
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
    resyncCustomSelectsWithin(form);

    const idInput = document.getElementById('expense-id');
    const title = document.getElementById('modal-expense-title');
    if (idInput) idInput.value = '';
    if (title) title.textContent = 'Nova Despesa';

    this.populateExpenseCategoryOptions('Outros');

    const dateInput = document.getElementById('expense-date');
    if (dateInput && dateInput._flatpickr) {
      dateInput._flatpickr.setDate(getTodayStr(), false, 'Y-m-d');
    } else if (dateInput && !dateInput.value) {
      dateInput.value = this.formatDobForDisplay(getTodayStr());
    }

    if (expenseId) {
      const expense = this.expenses.find((e) => e.id === expenseId);
      if (expense) {
        if (idInput) idInput.value = expense.id;
        const set = (id, val) => {
          const el = document.getElementById(id);
          if (el) el.value = val == null ? '' : val;
        };
        set('expense-description', expense.description || '');
        this.populateExpenseCategoryOptions(this.normalizeExpenseCategory(expense.category || 'Outros'));
        set('expense-amount', toNumber(expense.amount));
        if (dateInput && dateInput._flatpickr && expense.date) {
          dateInput._flatpickr.setDate(expense.date, false, 'Y-m-d');
        } else {
          set('expense-date', this.formatDobForDisplay(expense.date || getTodayStr()));
        }
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
    const dateRaw = String((document.getElementById('expense-date') || {}).value || '').trim();
    const date = this.normalizeDobToIso(dateRaw);

    if (dateRaw && !date) {
      this.showToast('Data inválida. Use o formato dd/mm/aaaa.', 'warning');
      return;
    }

    const payload = { id, description, category, amount, date };
    if (window.financeiroModule && typeof window.financeiroModule.saveExpense === 'function') {
      window.financeiroModule.saveExpense(this, payload, id || '');
    } else {
      this.showToast('Módulo financeiro não carregado.', 'warning');
    }
  }

  normalizeExpenseCategory(value) {
    const normalized = String(value || '').replace(/\s+/g, ' ').trim();
    if (!normalized) return 'Outros';
    return normalized
      .split(' ')
      .map((part) => part ? (part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()) : '')
      .join(' ');
  }

  normalizeExpenseCategoryKey(value) {
    const label = this.normalizeExpenseCategory(value)
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '');
    return String(label || '')
      .toLowerCase()
      .replace(/\s+/g, '-');
  }

  collectExpenseCategoriesFromExpenses() {
    const seen = new Set();
    const fromStored = Array.isArray(this.expenseCategories) ? this.expenseCategories : [];
    const fromExpenses = (this.expenses || [])
      .map((expense) => this.normalizeExpenseCategory(expense && expense.category))
      .filter((category) => {
        if (!category) return false;
        const key = this.normalizeExpenseCategoryKey(category);
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });

    const all = DEFAULT_EXPENSE_CATEGORIES.concat(fromStored).concat(fromExpenses)
      .map((category) => this.normalizeExpenseCategory(category))
      .filter(Boolean);

    const unique = [];
    const uniqueKeys = new Set();
    all.forEach((category) => {
      const key = this.normalizeExpenseCategoryKey(category);
      if (uniqueKeys.has(key)) return;
      uniqueKeys.add(key);
      unique.push(category);
    });

    return unique;
  }

  rememberExpenseCategory(categoryName) {
    const normalized = this.normalizeExpenseCategory(categoryName);
    if (!normalized) return;

    const existingIndex = this.expenseCategories.findIndex((item) => this.normalizeExpenseCategoryKey(item) === this.normalizeExpenseCategoryKey(normalized));
    if (existingIndex >= 0) this.expenseCategories.splice(existingIndex, 1);
    this.expenseCategories.unshift(normalized);

    const requiredDefaults = DEFAULT_EXPENSE_CATEGORIES.map((item) => this.normalizeExpenseCategory(item));
    requiredDefaults.reverse().forEach((category) => {
      const key = this.normalizeExpenseCategoryKey(category);
      if (!this.expenseCategories.some((item) => this.normalizeExpenseCategoryKey(item) === key)) {
        this.expenseCategories.unshift(category);
      }
    });

    this.expenseCategories = this.expenseCategories.slice(0, 60);
    this.populateExpenseCategoryOptions();
  }

  populateExpenseCategoryOptions(preferredCategory = '') {
    const select = document.getElementById('expense-category');
    if (!select) return;

    const categories = this.expenseCategories.slice()
      .sort((a, b) => a.localeCompare(b, 'pt-BR', { sensitivity: 'base' }));
    const preferred = this.normalizeExpenseCategory(preferredCategory || select.value);
    const preferredKey = this.normalizeExpenseCategoryKey(preferred);
    if (preferred && !categories.some((item) => this.normalizeExpenseCategoryKey(item) === preferredKey)) {
      categories.unshift(preferred);
    }

    select.innerHTML = categories
      .map((category) => `<option value="${safeText(category)}">${safeText(category)}</option>`)
      .join('');
    if (preferred) select.value = preferred;
  }

  openExpenseCategoriesModal() {
    const modal = document.getElementById('modal-expense-categories');
    if (!modal) return;
    this.renderExpenseCategoriesManager();
    modal.classList.add('active');
  }

  closeExpenseCategoriesModal() {
    const modal = document.getElementById('modal-expense-categories');
    if (modal) modal.classList.remove('active');
  }

  renderExpenseCategoriesManager() {
    const container = document.getElementById('expense-categories-list');
    if (!container) return;

    const addBtn = document.getElementById('btn-add-expense-category');
    const addInput = document.getElementById('new-expense-category-input');
    if (addBtn) {
      addBtn.onclick = () => {
        const name = this.normalizeExpenseCategory((addInput || {}).value || '');
        if (!name) { this.showToast('Informe um nome para a categoria.', 'warning'); return; }
        if (this.expenseCategories.some((category) => this.normalizeExpenseCategoryKey(category) === this.normalizeExpenseCategoryKey(name))) {
          this.showToast('Categoria já existe.', 'warning'); return;
        }

        this.rememberExpenseCategory(name);
        this.saveStore();
        if (addInput) addInput.value = '';
        this.renderExpenseCategoriesManager();
        this.populateExpenseCategoryOptions(name);
        this.showToast(`Categoria "${name}" criada.`, 'success');
      };
    }
    if (addInput) {
      addInput.onkeydown = (e) => { if (e.key === 'Enter') { e.preventDefault(); if (addBtn) addBtn.click(); } };
    }

    if (!this.expenseCategories.length) {
      container.innerHTML = '<div class="empty-state"><p>Nenhuma categoria salva ainda.</p></div>';
      return;
    }

    const categories = this.expenseCategories.slice().sort((a, b) => a.localeCompare(b, 'pt-BR'));
    container.innerHTML = categories.map((category) => `
      <div class="group-manager-card" data-expense-category-row="${safeText(category)}">
        <i data-lucide="tag"></i>
        <input type="text" class="form-control group-manager-input" value="${safeText(category)}" data-expense-category-edit aria-label="Nome da categoria">
        <div class="group-manager-actions">
          <button type="button" class="btn btn-sm btn-secondary" data-expense-category-action="rename" data-expense-category="${safeText(category)}"><i data-lucide="check"></i> Salvar</button>
          <button type="button" class="btn btn-sm btn-ghost group-manager-delete" data-expense-category-action="delete" data-expense-category="${safeText(category)}"><i data-lucide="trash-2"></i></button>
        </div>
      </div>
    `).join('');

    container.querySelectorAll('[data-expense-category-action]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const action = String(btn.getAttribute('data-expense-category-action') || '');
        const categoryName = this.normalizeExpenseCategory(btn.getAttribute('data-expense-category') || '');
        if (!categoryName) return;

        if (action === 'rename') {
          const row = btn.closest('[data-expense-category-row]');
          const input = row ? row.querySelector('[data-expense-category-edit]') : null;
          const nextName = input ? String(input.value || '') : '';
          this.renameExpenseCategory(categoryName, nextName);
          return;
        }

        if (action === 'delete') {
          this.deleteExpenseCategory(categoryName);
        }
      });
    });

    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  }

  renameExpenseCategory(oldCategory, newCategory) {
    const oldNormalized = this.normalizeExpenseCategory(oldCategory);
    const newNormalized = this.normalizeExpenseCategory(newCategory);
    const oldKey = this.normalizeExpenseCategoryKey(oldNormalized);
    const newKey = this.normalizeExpenseCategoryKey(newNormalized);

    if (!oldNormalized) return;
    if (!newNormalized) {
      this.showToast('Informe um nome válido para a categoria.', 'warning');
      return;
    }
    if (oldKey === newKey) return;

    let updatedExpenses = 0;
    this.expenses = this.expenses.map((expense) => {
      const currentKey = this.normalizeExpenseCategoryKey(expense.category);
      if (currentKey !== oldKey) return expense;
      updatedExpenses += 1;
      return { ...expense, category: newNormalized };
    });

    this.expenseCategories = this.expenseCategories.filter((category) => this.normalizeExpenseCategoryKey(category) !== oldKey);
    this.rememberExpenseCategory(newNormalized);

    const categoryInput = document.getElementById('expense-category');
    if (categoryInput && this.normalizeExpenseCategoryKey(categoryInput.value) === oldKey) {
      categoryInput.value = newNormalized;
    }

    this.populateExpenseCategoryOptions(newNormalized);
    this.saveStore();
    this.renderExpenseCategoriesManager();
    this.renderDespesasTable();
    this.showToast(`Categoria atualizada. ${updatedExpenses} despesa(s) ajustada(s).`, 'success');
  }

  deleteExpenseCategory(categoryName) {
    const normalized = this.normalizeExpenseCategory(categoryName);
    const targetKey = this.normalizeExpenseCategoryKey(normalized);
    if (!targetKey) return;
    if (targetKey === 'outros') {
      this.showToast('A categoria Outros não pode ser removida.', 'warning');
      return;
    }

    let affectedExpenses = 0;
    this.expenses = this.expenses.map((expense) => {
      const currentKey = this.normalizeExpenseCategoryKey(expense.category);
      if (currentKey !== targetKey) return expense;
      affectedExpenses += 1;
      return { ...expense, category: 'Outros' };
    });

    this.expenseCategories = this.expenseCategories.filter((category) => this.normalizeExpenseCategoryKey(category) !== targetKey);
    this.rememberExpenseCategory('Outros');

    const categoryInput = document.getElementById('expense-category');
    if (categoryInput && this.normalizeExpenseCategoryKey(categoryInput.value) === targetKey) {
      categoryInput.value = 'Outros';
    }

    this.populateExpenseCategoryOptions('Outros');
    this.saveStore();
    this.renderExpenseCategoriesManager();
    this.renderDespesasTable();
    this.showToast(`Categoria removida. ${affectedExpenses} despesa(s) voltaram para Outros.`, 'success');
  }

  normalizeClientCategory(value) {
    const normalized = String(value || '').replace(/\s+/g, ' ').trim();
    if (!normalized) return 'Paciente';
    return normalized
      .split(' ')
      .map((part) => part ? (part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()) : '')
      .join(' ');
  }

  normalizeClientCategoryKey(value) {
    const label = this.normalizeClientCategory(value)
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
    return String(label || '')
      .toLowerCase()
      .replace(/\s+/g, '-');
  }

  isPatientClient(client) {
    if (!client || typeof client !== 'object') return false;
    return this.normalizeClientCategoryKey(client.category) === 'paciente';
  }

  getPatientClients() {
    return (this.clients || []).filter((client) => this.isPatientClient(client));
  }

  populateClientSelectOptions(selectedId = '', selectedName = '') {
    const select = document.getElementById('appt-client-id');
    if (!select) return '';

    const normalizedSelectedName = String(selectedName || '').normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim()
      .toLowerCase();
    const selectedClient = this.clients.find((client) => String(client.id || '') === String(selectedId || ''))
      || this.clients.find((client) => String(client.name || '').normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim()
        .toLowerCase() === normalizedSelectedName);
    const availableClients = this.getPatientClients().slice();
    if (selectedClient && !availableClients.some((client) => client.id === selectedClient.id)) {
      availableClients.push(selectedClient);
    }

    const current = (selectedClient && selectedClient.id) || selectedId || select.value;
    const options = ['<option value="">Selecione um cliente...</option>']
      .concat(availableClients
        .sort((a, b) => String(a.name || '').localeCompare(String(b.name || '')))
        .map((c) => `<option value="${safeText(c.id)}">${safeText(c.name)}${c.phone ? ` - ${safeText(c.phone)}` : ''}</option>`));

    select.innerHTML = options.join('');
    if (current) select.value = current;
    return select.value;
  }

  openClientModal(clientId = '') {
    const modal = document.getElementById('modal-client');
    if (!modal) return;

    const form = document.getElementById('form-client');
    if (form) form.reset();
    resyncCustomSelectsWithin(form);
    const clientDobInput = document.getElementById('client-dob');
    if (clientDobInput && clientDobInput._flatpickr) clientDobInput._flatpickr.clear();

    const idInput = document.getElementById('client-id');
    const title = document.getElementById('modal-client-title');
    if (idInput) idInput.value = '';
    if (title) title.textContent = 'Cadastrar Novo Paciente';
    this.populateClientGroupOptions();
    this.populateClientCategoryOptions();
    this.populateAllManagedSelectsAndFilters();
    const categoryInput = document.getElementById('client-category');
    if (categoryInput) categoryInput.value = 'Paciente';

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
        set('client-phone', this.formatPhoneInput(c.phone));
        set('client-email', c.email);
        set('client-category', this.normalizeClientCategory(c.category));
        set('client-cpf', this.formatCpfInput(c.cpf));
        set('client-rg', c.rg);
        if (clientDobInput && clientDobInput._flatpickr && c.dob) {
          clientDobInput._flatpickr.setDate(c.dob, false, 'Y-m-d');
        } else {
          set('client-dob', this.formatDobForDisplay(c.dob));
        }
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
        set('client-emergency-phone', this.formatPhoneInput(c.emergencyPhone));
        set('client-emergency-relation', c.emergencyRelation);
        set('client-referral-source', c.referralSource);
        set('client-referral-notes', c.referralNotes);
        set('client-tags', c.tags);
        this.populateClientGroupOptions(c.group);
        this.populateClientCategoryOptions(this.normalizeClientCategory(c.category));
        this.populateManagedSelect('convenio', c.convenio);
        this.populateManagedSelect('planoFinanceiro', c.planoFinanceiro);
        this.populateManagedSelect('tags');
        if (title) title.textContent = 'Editar Dados do Paciente';
      }
    }

    this.loadAnamneseData(_anamneseData);
    this.clientNarrativeFilterBucket = null;
    this.renderClientReportCard(clientId);
    this.renderClientSessionsNarrative(clientId);
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

  loadManagedListsFromStorage() {
    Object.keys(CLIENT_MANAGED_LISTS).forEach((type) => {
      const cfg = CLIENT_MANAGED_LISTS[type];
      let stored = [];
      try {
        stored = JSON.parse(localStorage.getItem(cfg.storageKey) || '[]');
      } catch (err) {
        stored = [];
      }
      this[cfg.stateKey] = Array.isArray(stored) ? stored.filter((item) => String(item || '').trim()) : [];
      if (!this[cfg.stateKey].length) this[cfg.stateKey] = cfg.defaults.slice();
    });
  }

  saveManagedListsToStorage() {
    Object.keys(CLIENT_MANAGED_LISTS).forEach((type) => {
      const cfg = CLIENT_MANAGED_LISTS[type];
      localStorage.setItem(cfg.storageKey, JSON.stringify(this[cfg.stateKey] || []));
    });
  }

  normalizeManagedOptionValue(value) {
    return String(value || '').trim();
  }

  normalizeManagedOptionKey(value) {
    return this.normalizeManagedOptionValue(value).toLowerCase();
  }

  parseClientTags(value) {
    return String(value || '').split(',').map((t) => t.trim()).filter(Boolean);
  }

  rememberManagedOption(type, value) {
    const cfg = CLIENT_MANAGED_LISTS[type];
    if (!cfg) return;
    const normalized = this.normalizeManagedOptionValue(value);
    if (!normalized) return;
    const key = this.normalizeManagedOptionKey(normalized);
    this[cfg.stateKey] = (this[cfg.stateKey] || []).filter((item) => this.normalizeManagedOptionKey(item) !== key);
    this[cfg.stateKey].unshift(normalized);
    this[cfg.stateKey] = this[cfg.stateKey].slice(0, 60);
    this.populateManagedSelect(type);
    this.populateManagedFilterSelect(type);
  }

  renameManagedOption(type, oldValue, newValue) {
    const cfg = CLIENT_MANAGED_LISTS[type];
    if (!cfg) return;
    const oldNorm = this.normalizeManagedOptionValue(oldValue);
    const newNorm = this.normalizeManagedOptionValue(newValue);
    const oldKey = this.normalizeManagedOptionKey(oldNorm);
    const newKey = this.normalizeManagedOptionKey(newNorm);
    if (!oldNorm) return;
    if (!newNorm) {
      this.showToast(`Informe um nome válido para ${cfg.label}.`, 'warning');
      return;
    }
    if (oldKey === newKey) return;

    let updated = 0;
    this.clients = this.clients.map((client) => {
      if (cfg.multi) {
        const tagsList = this.parseClientTags(client[cfg.clientField]);
        if (!tagsList.some((t) => this.normalizeManagedOptionKey(t) === oldKey)) return client;
        updated += 1;
        const nextTags = tagsList.map((t) => (this.normalizeManagedOptionKey(t) === oldKey ? newNorm : t));
        return { ...client, [cfg.clientField]: nextTags.join(', ') };
      }
      const currentKey = this.normalizeManagedOptionKey(client[cfg.clientField]);
      if (currentKey !== oldKey) return client;
      updated += 1;
      return { ...client, [cfg.clientField]: newNorm };
    });

    this[cfg.stateKey] = (this[cfg.stateKey] || []).filter((item) => this.normalizeManagedOptionKey(item) !== oldKey);
    this.rememberManagedOption(type, newNorm);
    this.saveManagedListsToStorage();
    this.saveStore();
    this.renderManagedListManager(type);
    this.render();
    this.showToast(`${cfg.label} atualizado. ${updated} cadastro(s) ajustado(s).`, 'success');
  }

  deleteManagedOption(type, value) {
    const cfg = CLIENT_MANAGED_LISTS[type];
    if (!cfg) return;
    const normalized = this.normalizeManagedOptionValue(value);
    const key = this.normalizeManagedOptionKey(normalized);
    if (!key) return;

    let affected = 0;
    this.clients = this.clients.map((client) => {
      if (cfg.multi) {
        const tagsList = this.parseClientTags(client[cfg.clientField]);
        if (!tagsList.some((t) => this.normalizeManagedOptionKey(t) === key)) return client;
        affected += 1;
        const nextTags = tagsList.filter((t) => this.normalizeManagedOptionKey(t) !== key);
        return { ...client, [cfg.clientField]: nextTags.join(', ') };
      }
      const currentKey = this.normalizeManagedOptionKey(client[cfg.clientField]);
      if (currentKey !== key) return client;
      affected += 1;
      return { ...client, [cfg.clientField]: cfg.fallback };
    });

    this[cfg.stateKey] = (this[cfg.stateKey] || []).filter((item) => this.normalizeManagedOptionKey(item) !== key);
    this.saveManagedListsToStorage();
    this.saveStore();
    this.populateManagedSelect(type);
    this.populateManagedFilterSelect(type);
    this.renderManagedListManager(type);
    this.render();
    this.showToast(`${cfg.label} removido. ${affected} cadastro(s) ajustado(s).`, 'success');
  }

  populateManagedSelect(type, preferredValue) {
    const cfg = CLIENT_MANAGED_LISTS[type];
    if (!cfg) return;

    if (cfg.multi) {
      const datalist = document.getElementById('client-tags-options');
      if (!datalist) return;
      datalist.innerHTML = (this[cfg.stateKey] || [])
        .map((item) => `<option value="${safeText(item)}"></option>`)
        .join('');
      return;
    }

    const select = document.getElementById(cfg.selectId);
    if (!select) return;
    const options = (this[cfg.stateKey] || []).slice().sort((a, b) => a.localeCompare(b, 'pt-BR', { sensitivity: 'base' }));
    const preferred = this.normalizeManagedOptionValue(preferredValue !== undefined ? preferredValue : select.value);
    const preferredKey = this.normalizeManagedOptionKey(preferred);
    if (preferred && !options.some((item) => this.normalizeManagedOptionKey(item) === preferredKey)) {
      options.unshift(preferred);
    }
    select.innerHTML = '<option value="">Selecione</option>'
      + options.map((item) => `<option value="${safeText(item)}">${safeText(item)}</option>`).join('');
    select.value = preferred || '';
  }

  populateManagedFilterSelect(type) {
    const cfg = CLIENT_MANAGED_LISTS[type];
    if (!cfg) return;
    const select = document.getElementById(cfg.filterId);
    if (!select) return;
    const currentValue = select.value;
    const options = (this[cfg.stateKey] || []).slice().sort((a, b) => a.localeCompare(b, 'pt-BR', { sensitivity: 'base' }));
    select.innerHTML = `<option value="todos">${safeText(cfg.label)}: Selecione</option>`
      + options.map((item) => `<option value="${safeText(item)}">${safeText(item)}</option>`).join('');
    if (currentValue && options.some((item) => item === currentValue)) select.value = currentValue;
  }

  populateAllManagedSelectsAndFilters() {
    Object.keys(CLIENT_MANAGED_LISTS).forEach((type) => {
      this.populateManagedSelect(type);
      this.populateManagedFilterSelect(type);
    });
  }

  renderManagedListManager(type) {
    const cfg = CLIENT_MANAGED_LISTS[type];
    if (!cfg) return;
    const container = document.getElementById(cfg.listId);
    if (!container) return;

    const addBtn = document.getElementById(cfg.addBtnId);
    const addInput = document.getElementById(cfg.addInputId);
    if (addBtn) {
      addBtn.onclick = () => {
        const name = this.normalizeManagedOptionValue((addInput || {}).value || '');
        if (!name) { this.showToast(`Informe um nome para ${cfg.label}.`, 'warning'); return; }
        if ((this[cfg.stateKey] || []).some((item) => this.normalizeManagedOptionKey(item) === this.normalizeManagedOptionKey(name))) {
          this.showToast(`"${name}" já existe em ${cfg.label}.`, 'warning'); return;
        }
        this.rememberManagedOption(type, name);
        this.saveManagedListsToStorage();
        if (addInput) addInput.value = '';
        this.renderManagedListManager(type);
        this.showToast(`"${name}" adicionado em ${cfg.label}.`, 'success');
      };
    }
    if (addInput) {
      addInput.onkeydown = (e) => { if (e.key === 'Enter') { e.preventDefault(); if (addBtn) addBtn.click(); } };
    }

    const items = (this[cfg.stateKey] || []).slice().sort((a, b) => a.localeCompare(b, 'pt-BR'));
    if (!items.length) {
      container.innerHTML = '<div class="empty-state"><p>Nenhuma opção salva ainda.</p></div>';
      return;
    }

    container.innerHTML = items.map((item) => `
      <div class="group-manager-card" data-managed-row="${safeText(item)}">
        <i data-lucide="tag"></i>
        <input type="text" class="form-control group-manager-input" value="${safeText(item)}" data-managed-edit aria-label="Nome">
        <div class="group-manager-actions">
          <button type="button" class="btn btn-sm btn-secondary" data-managed-action="rename" data-managed-value="${safeText(item)}"><i data-lucide="check"></i> Salvar</button>
          <button type="button" class="btn btn-sm btn-ghost group-manager-delete" data-managed-action="delete" data-managed-value="${safeText(item)}"><i data-lucide="trash-2"></i></button>
        </div>
      </div>
    `).join('');

    container.querySelectorAll('[data-managed-action]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const action = String(btn.getAttribute('data-managed-action') || '');
        const value = this.normalizeManagedOptionValue(btn.getAttribute('data-managed-value') || '');
        if (!value) return;
        if (action === 'rename') {
          const row = btn.closest('[data-managed-row]');
          const input = row ? row.querySelector('[data-managed-edit]') : null;
          const nextValue = input ? String(input.value || '') : '';
          this.renameManagedOption(type, value, nextValue);
          return;
        }
        if (action === 'delete') {
          this.deleteManagedOption(type, value);
        }
      });
    });

    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  }

  openManagedListModal(type) {
    const cfg = CLIENT_MANAGED_LISTS[type];
    if (!cfg) return;
    const modal = document.getElementById(cfg.modalId);
    if (!modal) return;
    this.renderManagedListManager(type);
    modal.classList.add('active');
  }

  closeManagedListModal(type) {
    const cfg = CLIENT_MANAGED_LISTS[type];
    if (!cfg) return;
    const modal = document.getElementById(cfg.modalId);
    if (modal) modal.classList.remove('active');
  }

  openClientCategoriesModal() {
    const modal = document.getElementById('modal-client-categories');
    if (!modal) return;
    this.renderClientCategoriesManager();
    modal.classList.add('active');
  }

  closeClientCategoriesModal() {
    const modal = document.getElementById('modal-client-categories');
    if (modal) modal.classList.remove('active');
  }

  renderClientCategoriesManager() {
    const container = document.getElementById('client-categories-list');
    if (!container) return;

    const addBtn = document.getElementById('btn-add-category');
    const addInput = document.getElementById('new-category-input');
    if (addBtn) {
      addBtn.onclick = () => {
        const name = this.normalizeClientCategory((addInput || {}).value || '');
        if (!name) { this.showToast('Informe um nome para a categoria.', 'warning'); return; }
        if (this.clientCategories.some((category) => this.normalizeClientCategoryKey(category) === this.normalizeClientCategoryKey(name))) {
          this.showToast('Categoria já existe.', 'warning'); return;
        }

        this.rememberClientCategory(name);
        this.saveStore();
        if (addInput) addInput.value = '';
        this.renderClientCategoriesManager();
        this.showToast(`Categoria "${name}" criada.`, 'success');
      };
    }
    if (addInput) {
      addInput.onkeydown = (e) => { if (e.key === 'Enter') { e.preventDefault(); if (addBtn) addBtn.click(); } };
    }

    if (!this.clientCategories.length) {
      container.innerHTML = '<div class="empty-state"><p>Nenhuma categoria salva ainda.</p></div>';
      return;
    }

    const categories = this.clientCategories.slice().sort((a, b) => a.localeCompare(b, 'pt-BR'));
    container.innerHTML = categories.map((category) => `
      <div class="group-manager-card" data-category-row="${safeText(category)}">
        <i data-lucide="tag"></i>
        <input type="text" class="form-control group-manager-input" value="${safeText(category)}" data-category-edit aria-label="Nome da categoria">
        <div class="group-manager-actions">
          <button type="button" class="btn btn-sm btn-secondary" data-category-action="rename" data-category="${safeText(category)}"><i data-lucide="check"></i> Salvar</button>
          <button type="button" class="btn btn-sm btn-ghost group-manager-delete" data-category-action="delete" data-category="${safeText(category)}"><i data-lucide="trash-2"></i></button>
        </div>
      </div>
    `).join('');

    container.querySelectorAll('[data-category-action]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const action = String(btn.getAttribute('data-category-action') || '');
        const categoryName = this.normalizeClientCategory(btn.getAttribute('data-category') || '');
        if (!categoryName) return;

        if (action === 'rename') {
          const row = btn.closest('[data-category-row]');
          const input = row ? row.querySelector('[data-category-edit]') : null;
          const nextName = input ? String(input.value || '') : '';
          this.renameClientCategory(categoryName, nextName);
          return;
        }

        if (action === 'delete') {
          this.deleteClientCategory(categoryName);
        }
      });
    });

    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
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

  renameClientCategory(oldCategory, newCategory) {
    const oldNormalized = this.normalizeClientCategory(oldCategory);
    const newNormalized = this.normalizeClientCategory(newCategory);
    const oldKey = this.normalizeClientCategoryKey(oldNormalized);
    const newKey = this.normalizeClientCategoryKey(newNormalized);

    if (!oldNormalized) return;
    if (!newNormalized) {
      this.showToast('Informe um nome válido para a categoria.', 'warning');
      return;
    }
    if (oldKey === newKey) return;

    let updatedClients = 0;
    this.clients = this.clients.map((client) => {
      const currentKey = this.normalizeClientCategoryKey(client.category);
      if (currentKey !== oldKey) return client;
      updatedClients += 1;
      return { ...client, category: newNormalized };
    });

    this.clientCategories = this.clientCategories.filter((category) => this.normalizeClientCategoryKey(category) !== oldKey);
    this.rememberClientCategory(newNormalized);

    const categoryInput = document.getElementById('client-category');
    if (categoryInput && this.normalizeClientCategoryKey(categoryInput.value) === oldKey) {
      categoryInput.value = newNormalized;
    }

    this.populateClientCategoryOptions(newNormalized);
    this.populateClientCategoryFilterOptions();
    this.saveStore();
    this.renderClientCategoriesManager();
    this.render();
    this.showToast(`Categoria atualizada. ${updatedClients} cadastro(s) ajustado(s).`, 'success');
  }

  deleteClientCategory(categoryName) {
    const normalized = this.normalizeClientCategory(categoryName);
    const targetKey = this.normalizeClientCategoryKey(normalized);
    if (!targetKey) return;
    if (targetKey === 'paciente') {
      this.showToast('A categoria Paciente não pode ser removida.', 'warning');
      return;
    }

    let affectedClients = 0;
    this.clients = this.clients.map((client) => {
      const currentKey = this.normalizeClientCategoryKey(client.category);
      if (currentKey !== targetKey) return client;
      affectedClients += 1;
      return { ...client, category: 'Paciente' };
    });

    this.clientCategories = this.clientCategories.filter((category) => this.normalizeClientCategoryKey(category) !== targetKey);
    this.rememberClientCategory('Paciente');

    const categoryInput = document.getElementById('client-category');
    if (categoryInput && this.normalizeClientCategoryKey(categoryInput.value) === targetKey) {
      categoryInput.value = 'Paciente';
    }

    this.populateClientCategoryOptions('Paciente');
    this.populateClientCategoryFilterOptions();
    this.saveStore();
    this.renderClientCategoriesManager();
    this.render();
    this.showToast(`Categoria removida. ${affectedClients} cadastro(s) voltaram para Paciente.`, 'success');
  }

  saveClientForm() {
    const id = (document.getElementById('client-id') || {}).value || '';
    const name = String((document.getElementById('client-name') || {}).value || '').trim();
    const phone = this.formatPhoneInput((document.getElementById('client-phone') || {}).value || '');
    const email = String((document.getElementById('client-email') || {}).value || '').trim();
    const category = this.normalizeClientCategory((document.getElementById('client-category') || {}).value || 'Paciente');

    const group = this.normalizeClientGroupName((document.getElementById('client-group') || {}).value || '');
    const dobRaw = String((document.getElementById('client-dob') || {}).value || '').trim();
    const dobIso = this.normalizeDobToIso(dobRaw);

    if (dobRaw && !dobIso) {
      this.showToast('Data de nascimento inválida. Use o formato dd/mm/aaaa.', 'warning');
      return;
    }

    const payload = {
      id,
      name,
      phone,
      email,
      category,
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
      emergencyPhone: this.formatPhoneInput((document.getElementById('client-emergency-phone') || {}).value || ''),
      emergencyRelation: String((document.getElementById('client-emergency-relation') || {}).value || '').trim(),
      referralSource: String((document.getElementById('client-referral-source') || {}).value || '').trim(),
      referralNotes: String((document.getElementById('client-referral-notes') || {}).value || '').trim(),
      convenio: this.normalizeManagedOptionValue((document.getElementById('client-convenio') || {}).value || ''),
      planoFinanceiro: this.normalizeManagedOptionValue((document.getElementById('client-plano-financeiro') || {}).value || ''),
      tags: this.parseClientTags((document.getElementById('client-tags') || {}).value || '').join(', '),
      anamnese: this.getAnamneseData()
    };

    this.rememberClientCategory(category);
    if (payload.convenio) this.rememberManagedOption('convenio', payload.convenio);
    if (payload.planoFinanceiro) this.rememberManagedOption('planoFinanceiro', payload.planoFinanceiro);
    this.parseClientTags(payload.tags).forEach((tag) => this.rememberManagedOption('tags', tag));
    this.saveManagedListsToStorage();

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
    resyncCustomSelectsWithin(form);

    this.populateClientSelectOptions();

    const idInput = document.getElementById('appointment-id');
    const title = document.getElementById('modal-appointment-title');
    const colorInput = document.getElementById('appt-color');
    const recurrenceSelect = document.getElementById('appt-recurrence-type');
    const bulkUpdateModeSelect = document.getElementById('appt-bulk-update-mode');
    const deleteBtn = document.getElementById('btn-delete-appointment');
    if (deleteBtn) deleteBtn.style.display = 'none';
    const printSessionBtn = document.getElementById('btn-print-appointment-session');
    if (printSessionBtn) printSessionBtn.style.display = 'none';
    this.stopVoiceNarrationRecording();
    if (idInput) idInput.value = '';
    if (title) title.textContent = 'Agendar Consulta';
    if (colorInput) colorInput.value = DEFAULT_APPOINTMENT_COLOR;
    if (recurrenceSelect) recurrenceSelect.value = 'nao_recorrente';
    if (bulkUpdateModeSelect) bulkUpdateModeSelect.value = 'nao_aplicar';
    this.selectAppointmentColor(DEFAULT_APPOINTMENT_COLOR);

    const dateInput = document.getElementById('appt-date');
    if (dateInput && dateInput._flatpickr) {
      dateInput._flatpickr.setDate(getTodayStr(), false, 'Y-m-d');
    } else if (dateInput && !dateInput.value) {
      dateInput.value = this.formatDobForDisplay(getTodayStr());
    }

    if (appointmentId) {
      const a = this.appointments.find((x) => x.id === appointmentId);
      if (a) {
        if (idInput) idInput.value = a.id;
        const resolvedClientId = this.populateClientSelectOptions(a.clientId, a.clientName);
        const set = (id, val) => {
          const el = document.getElementById(id);
          if (el) el.value = val == null ? '' : val;
        };
        set('appt-client-id', resolvedClientId);
        if (dateInput && dateInput._flatpickr && a.date) {
          dateInput._flatpickr.setDate(a.date, false, 'Y-m-d');
        } else {
          set('appt-date', this.formatDobForDisplay(a.date));
        }
        set('appt-time', a.time);
        set('appt-procedure', a.procedure);
        set('appt-price', this.getEffectiveAppointmentPrice(a));
        set('appt-payment-method', a.paymentMethod || 'Pix');
        set('appt-status', a.status || 'Agendado');
        set('appt-payment-status', a.paymentStatus || 'Pendente');
        set('appt-amount-paid', a.amountPaid || 0);
        set('appt-recurrence-type', this.normalizeAppointmentRecurrenceType(a.recurrenceType));
        set('appt-notes', a.notes || '');
        set('appt-session-narrative', a.sessionNarrative || '');
        this.selectAppointmentColor(a.color || DEFAULT_APPOINTMENT_COLOR);
        if (title) title.textContent = 'Editar Consulta/Financeiro';
        if (deleteBtn) deleteBtn.style.display = 'inline-flex';
        if (printSessionBtn) printSessionBtn.style.display = 'inline-flex';
      }
    }

    modal.classList.add('active');
  }

  closeAppointmentModal() {
    const modal = document.getElementById('modal-appointment');
    if (modal) modal.classList.remove('active');
    this.stopVoiceNarrationRecording();
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

    const total = this.getEffectiveAppointmentPrice(appt);
    const paid = toNumber(appt.amountPaid);
    const balance = Math.max(0, total - paid);
    setText('pay-total', formatCurrency(total));
    setText('pay-paid', formatCurrency(paid));
    setText('pay-balance', formatCurrency(balance));
    setValue('pay-total-display', formatCurrency(total));

    const methodEl = document.getElementById('pay-method');
    if (methodEl) methodEl.value = appt.paymentMethod || 'Pix';
    const amountNowEl = document.getElementById('pay-amount-now');
    if (amountNowEl) amountNowEl.value = '';
    const amountInputLegacy = document.getElementById('pay-amount-input');
    if (amountInputLegacy) amountInputLegacy.value = paid;

    const statusSelect = document.getElementById('pay-status-select');
    if (statusSelect) {
      statusSelect.value = balance <= 0 ? 'Pago' : (paid > 0 ? 'Parcial' : 'Pendente');
    }

    const previewAmount = 0;
    this.populatePaymentReceiptEditableFields(appt, previewAmount);
    const receiptDatePicker = document.getElementById('pay-receipt-date-picker');
    if (receiptDatePicker) receiptDatePicker.value = String(appt.date || '');
    this.generatePaymentReceipt();

    const templateEl = document.getElementById('pay-receipt-template');
    if (templateEl) {
      templateEl.value = this.getPaymentReceiptTemplate();
    }

    this.togglePaymentReceiptProfessionalEditor(false);
    this.setPaymentEntryMode('partial');

    modal.classList.add('active');
    void this.getPaymentReceiptLogoDataUrl();
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
    const total = this.getEffectiveAppointmentPrice(appt);
    if (toNumber(appt.price) <= 0 && total > 0) appt.price = total;
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
    this.generatePaymentReceipt();
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
      this.showToast('Data inválida. Use o formato dd/mm/aaaa.', 'warning');
      return;
    }

    const isEditing = Boolean(id);
    if (!clientId || !date || !time || !procedure || price < 0 || (!isEditing && price <= 0)) {
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
      clientCpf: this.formatCpfInput(client.cpf || ''),
      date,
      time,
      procedure,
      price,
      color: normalizeHexColor((document.getElementById('appt-color') || {}).value || DEFAULT_APPOINTMENT_COLOR),
      paymentMethod: String((document.getElementById('appt-payment-method') || {}).value || 'Pix'),
      status: String((document.getElementById('appt-status') || {}).value || 'Agendado'),
      paymentStatus: String((document.getElementById('appt-payment-status') || {}).value || 'Pendente'),
      amountPaid: toNumber((document.getElementById('appt-amount-paid') || {}).value || 0),
      recurrenceType: this.normalizeAppointmentRecurrenceType((document.getElementById('appt-recurrence-type') || {}).value || ''),
      bulkUpdateMode: String((document.getElementById('appt-bulk-update-mode') || {}).value || 'nao_aplicar'),
      notes: String((document.getElementById('appt-notes') || {}).value || '').trim(),
      sessionNarrative: String((document.getElementById('appt-session-narrative') || {}).value || '').trim()
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
      return window.agendaModule.deleteAppointment(this, appointmentId);
    }
    this.showToast('Módulo de agenda não carregado.', 'warning');
    return Promise.resolve();
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

  openReportWindow(title, content, autoPrint = false, embeddedLogoUrl = '', reservedWindow = null) {
    const popup = reservedWindow || window.open('', '_blank');
    if (!popup) {
      this.showToast('Permita pop-ups para gerar o PDF do relatório.', 'warning');
      return;
    }

    const logoUrl = embeddedLogoUrl || new URL('./assets/icons/icon-512.png', window.location.href).href;

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

      const reportLogo = popup.document.querySelector('.report-logo');
      if (reportLogo && !reportLogo.complete) {
        reportLogo.addEventListener('load', () => setTimeout(triggerPrint, 120), { once: true });
        reportLogo.addEventListener('error', () => setTimeout(triggerPrint, 120), { once: true });
      } else {
        setTimeout(triggerPrint, 120);
      }
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
    const total = rangeAppointments.reduce((sum, a) => sum + this.getEffectiveAppointmentPrice(a), 0);
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
      const effectivePrice = this.getEffectiveAppointmentPrice(a);
      grouped[key].total += effectivePrice;
      grouped[key].paid += toNumber(a.amountPaid);
      grouped[key].pending += Math.max(0, effectivePrice - toNumber(a.amountPaid));
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

  renderClientReportCard(clientId) {
    const wrapper = document.getElementById('client-report-card-wrapper');
    const grid = document.getElementById('client-report-summary-grid');
    if (!wrapper || !grid) return;

    if (!clientId) {
      wrapper.style.display = 'none';
      return;
    }
    wrapper.style.display = '';

    const scoped = this.filterItemsByTopRange(this.getPatientAppointments(clientId), 'date');
    const counts = { agendadas: 0, confirmadas: 0, presentes: 0, ausentes: 0, canceladasCliente: 0, canceladasProfissional: 0 };
    scoped.forEach((a) => {
      const bucket = this.getAppointmentStatusMeta(a.status).bucket;
      if (counts[bucket] !== undefined) counts[bucket] += 1;
    });

    const total = scoped.length;
    const clientName = (this.clients.find((c) => c.id === clientId) || {}).name || 'Cliente';

    const cards = [
      { key: 'total', label: `${clientName} possui`, value: `${total} agendamento${total === 1 ? '' : 's'}`, icon: 'calendar-days', color: 'card-blue' },
      { key: 'presentes', label: 'Presentes', value: counts.presentes, icon: 'check-circle-2', color: 'card-green' },
      { key: 'ausentes', label: 'Ausentes', value: counts.ausentes, icon: 'alert-triangle', color: 'card-amber' },
      { key: 'canceladasCliente', label: 'Cliente Cancelou', value: counts.canceladasCliente, icon: 'x-circle', color: 'card-red' },
      { key: 'canceladasProfissional', label: 'Profissional Cancelou', value: counts.canceladasProfissional, icon: 'x-octagon', color: 'card-purple' },
      { key: 'confirmadas', label: 'Confirmadas', value: counts.confirmadas, icon: 'badge-check', color: 'card-cyan' }
    ];

    const activeBucket = this.clientNarrativeFilterBucket;
    grid.innerHTML = cards.map((c) => `
      <div class="stat-card ${c.color}${activeBucket === c.key ? ' active' : ''}" data-bucket="${c.key}" tabindex="0" role="button"
        onclick="app.toggleClientNarrativeFilter('${c.key}', '${clientId}')"
        onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();app.toggleClientNarrativeFilter('${c.key}', '${clientId}');}">
        <div class="stat-icon"><i data-lucide="${c.icon}"></i></div>
        <div class="stat-info">
          <span class="stat-label">${c.label}</span>
          <h3 class="stat-value">${c.value}</h3>
        </div>
      </div>
    `).join('');

    if (window.lucide && typeof window.lucide.createIcons === 'function') window.lucide.createIcons();
  }

  // Deriva o texto de narrativa a ser exibido para uma sessão. Prioriza o campo dedicado
  // appointment.sessionNarrative (nunca tocado pela sincronização do Google). Quando esse
  // campo está vazio (sessões antigas, antes da separação de campos), cai para um fallback
  // somente de exibição: reaproveita appointment.notes removendo as linhas de metadados de
  // sincronização ("Google:"/"Local:") — nunca grava esse fallback de volta nos dados.
  getSessionNarrativeDisplay(appointment) {
    const a = appointment || {};
    const dedicated = String(a.sessionNarrative || '').trim();
    if (dedicated) return { text: dedicated, migrated: false };

    const rawNotes = String(a.notes || '');
    const filtered = rawNotes
      .split('\n')
      .filter((line) => !/^\s*(Google|Local)\s*:/i.test(line))
      .join('\n')
      .trim();

    if (filtered) return { text: filtered, migrated: true };
    return { text: '', migrated: false };
  }

  // Mostra a narrativa (transcrição por voz) de cada sessão do cliente, organizada
  // individualmente por atendimento — cada agendamento guarda sua própria narrativa em
  // appointment.sessionNarrative, então aqui apenas listamos essas notas por sessão dentro
  // do cadastro. Respeita o filtro de status opcional em this.clientNarrativeFilterBucket.
  renderClientSessionsNarrative(clientId) {
    const wrapper = document.getElementById('client-sessions-narrative-wrapper');
    const list = document.getElementById('client-sessions-narrative-list');
    if (!wrapper || !list) return;

    if (!clientId) {
      wrapper.style.display = 'none';
      list.innerHTML = '';
      return;
    }
    wrapper.style.display = '';

    let sessions = this.getPatientAppointments(clientId).slice().reverse();

    const activeBucket = this.clientNarrativeFilterBucket;
    if (activeBucket && activeBucket !== 'total') {
      sessions = sessions.filter((a) => this.getAppointmentStatusMeta(a.status).bucket === activeBucket);
    }

    if (!sessions.length) {
      list.innerHTML = activeBucket && activeBucket !== 'total'
        ? '<p class="text-muted" style="font-size:0.85rem;margin:0;">Nenhuma sessão encontrada para o filtro selecionado.</p>'
        : '<p class="text-muted" style="font-size:0.85rem;margin:0;">Nenhuma sessão registrada para este paciente ainda.</p>';
      return;
    }

    list.innerHTML = sessions.map((a) => {
      const { text: narrative, migrated } = this.getSessionNarrativeDisplay(a);
      const hasNarrative = Boolean(narrative);
      const migratedHint = (hasNarrative && migrated) ? ' <em class="client-session-narrative-migrated-hint">(migrado de Observações)</em>' : '';
      return `
        <div class="client-session-narrative-item">
          <div class="client-session-narrative-header">
            <div class="client-session-narrative-meta">
              <strong>${escapeHtml(formatDateBR(a.date))}${a.time ? ` às ${escapeHtml(a.time)}` : ''}</strong>
              <span class="client-session-narrative-procedure">${escapeHtml(a.procedure || 'Procedimento não informado')}</span>
              <span class="client-session-narrative-status">${escapeHtml(a.status || '-')}</span>
            </div>
            <button type="button" class="btn btn-secondary btn-sm" onclick="app.printAppointmentSession('${a.id}')">
              <i data-lucide="printer"></i> Imprimir sessão
            </button>
          </div>
          <p class="client-session-narrative-text${hasNarrative ? '' : ' is-empty'}">${hasNarrative ? `${escapeHtml(narrative).replace(/\n/g, '<br>')}${migratedHint}` : 'Nenhuma narrativa registrada nesta sessão.'}</p>
        </div>
      `;
    }).join('');

    if (window.lucide && typeof window.lucide.createIcons === 'function') window.lucide.createIcons();
  }

  // Clica num card de status em "Relatório de Sessões do Cliente" para filtrar a lista
  // de Narrativa abaixo por aquele bucket; clicar de novo no mesmo card (ou no card "Total")
  // limpa o filtro.
  toggleClientNarrativeFilter(bucket, clientId) {
    const key = String(bucket || '').trim();
    this.clientNarrativeFilterBucket = (!key || key === 'total' || this.clientNarrativeFilterBucket === key)
      ? null
      : key;
    this.renderClientReportCard(clientId);
    this.renderClientSessionsNarrative(clientId);
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

  getSelectedClients() {
    return this.clients.filter((client) => this.selectedClientReportIds.has(client.id));
  }

  editSelectedClient() {
    const selectedClients = this.getSelectedClients();
    if (selectedClients.length !== 1) {
      this.showToast('Selecione apenas um paciente para editar.', 'warning');
      return;
    }

    this.openClientModal(selectedClients[0].id);
  }

  deleteSelectedClients() {
    const selectedClientIds = this.getSelectedClients().map((client) => client.id);
    if (!selectedClientIds.length) {
      this.showToast('Selecione ao menos um paciente para excluir.', 'warning');
      return;
    }

    if (window.clientModule && typeof window.clientModule.deleteClients === 'function') {
      window.clientModule.deleteClients(this, selectedClientIds);
    } else {
      this.showToast('Módulo de clientes não carregado.', 'warning');
    }
  }

  updateClientPrintSelectionUI() {
    const selectedCount = this.getSelectedClients().length;

    const btnPrintSelected = document.getElementById('btn-print-selected-clients');
    if (btnPrintSelected) {
      btnPrintSelected.disabled = selectedCount === 0;
      btnPrintSelected.innerHTML = `<i data-lucide="printer"></i> Imprimir Selecionados (${selectedCount})`;
    }

    const selectedActions = document.getElementById('client-selected-actions');
    if (selectedActions) {
      selectedActions.classList.toggle('is-visible', selectedCount > 0);
      selectedActions.setAttribute('aria-hidden', selectedCount > 0 ? 'false' : 'true');
    }

    const selectedCountLabel = document.getElementById('client-selected-count');
    if (selectedCountLabel) {
      selectedCountLabel.textContent = `${selectedCount} ${selectedCount === 1 ? 'paciente selecionado' : 'pacientes selecionados'}`;
    }

    const btnEditSelected = document.getElementById('btn-edit-selected-client');
    if (btnEditSelected) btnEditSelected.disabled = selectedCount !== 1;

    const btnDeleteSelected = document.getElementById('btn-delete-selected-clients');
    if (btnDeleteSelected) btnDeleteSelected.disabled = selectedCount === 0;

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

      if (this.normalizeAppointmentStatus(appt.status) !== 'Presente') return;
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
    this.applyConfigAccessControl();
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
    this.updateReminderAlertUI();
    this.renderSyncAuditPanel();

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
        window.loadPartial('src/components/partials/main-shell.html?v=20260809-4', 'app-root')
      ]);
    }
  } catch (err) {
    console.log('Falha ao carregar partials:', err);
  }

  if (window.app && typeof window.app.shouldForceReleaseRefresh === 'function' && window.app.shouldForceReleaseRefresh()) {
    window.app.markReleaseRefreshSeen();
    await window.app.forceAppUpdate();
    return;
  }

  window.app.initDOM();
  await window.app.seedStoreFromBackupIfEmpty();
  window.app.restoreAgendaFiltersForLoadedAppointments();
  window.app.updateFirebaseAuthStatus('offline', 'Auth Firebase: Desconectado');
  window.app.initEvents();
  window.app.render();
  window.app.showLoginScreen();
  await window.app.initFirebase();

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('message', (event) => {
      window.app.handleServiceWorkerMessage(event && event.data ? event.data : {});
    });

    navigator.serviceWorker.register('./sw.js?v=20260808-1')
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
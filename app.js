/**
 * Consultório Control - Aplicação Principal JS
 * Gerenciamento de Clientes, Agenda de Consultas, Controle Financeiro (Total/Parcial),
 * Filtro Global de Período, Avisos Sonoros e Sincronização em Tempo Real na Nuvem (Firebase)
 */

const APP_BRAND_NAME = 'Patrícia Psicoterapeuta';
const APP_BRAND_SUBTITLE = 'Consultório de Psicoterapia';
const DEFAULT_WHATSAPP_TEMPLATE = `Ola, {{cliente}}! Tudo bem?

Passando para confirmar seu agendamento:
Data: {{data}}
Horario: {{hora}}
Procedimento: {{procedimento}}
Valor: {{valor}}
Status: {{status}}

Se precisar reagendar, me avise por aqui.
{{assinatura}}`;
const LOGIN_DEFAULT_USERNAME = 'Patricia';
const LOGIN_DEFAULT_PASSWORD = 'Flora1658';
const LOGIN_USER_STORAGE_KEY = 'consultorio_login_user';
const LOGIN_PASSWORD_STORAGE_KEY = 'consultorio_login_password';
const GOOGLE_CALENDAR_STORAGE_KEY = 'consultorio_google_calendar_settings';
const GOOGLE_CALENDAR_SCOPE = 'https://www.googleapis.com/auth/calendar.events';
const FIREBASE_DEFAULT_CONFIG = {
  apiKey: 'AIzaSyCKFg8ypyYLRbD8PoeP9NqO2KHBrmN70uk',
  authDomain: 'consultorio-a07c8.firebaseapp.com',
  projectId: 'consultorio-a07c8',
  storageBucket: 'consultorio-a07c8.firebasestorage.app',
  messagingSenderId: '399470846657',
  appId: '1:399470846657:web:dc9ac3d7af7c348100aa40',
  measurementId: 'G-68H2HBV9MB'
};
const BIRTHDAY_REMINDER_LAST_DATE_KEY = 'consultorio_birthday_reminder_last_date';
const BIRTHDAY_REMINDER_DAYS_KEY = 'consultorio_birthday_reminder_days_ahead';
const BIRTHDAY_FILTER_START_DATE_KEY = 'consultorio_birthday_filter_start_date';
const BIRTHDAY_FILTER_END_DATE_KEY = 'consultorio_birthday_filter_end_date';
const APPOINTMENT_APPROACHES_STORAGE_KEY = 'consultorio_appointment_approaches';
const ANAMNESIS_TEMPLATE_STORAGE_KEY = 'consultorio_anamnesis_template';
const ANAMNESIS_TEMPLATE_VERSION_STORAGE_KEY = 'consultorio_anamnesis_template_version';
const ANAMNESIS_TEMPLATE_CURRENT_VERSION = '2026-07-26-v4';
const LEGACY_DEFAULT_CLIENT_ANAMNESIS_TEMPLATE = `Anamnese Terapia de Casal - Abordagem Sistemica

1) Identificacao do casal
- Nome do parceiro(a) 1:
- Nome do parceiro(a) 2:
- Tempo de relacionamento:
- Estado civil:

2) Queixa principal
- Motivo da busca por terapia:
- Quando os conflitos comecaram:

3) Dinamica relacional
- Como ocorrem os conflitos:
- Como o casal costuma se reconciliar:
- Como esta a comunicacao atualmente:

4) Historia familiar e contexto
- Filhos (idades):
- Com quem moram:
- Apoio familiar/rede de apoio:

5) Objetivos com a terapia
- O que cada um espera melhorar:
- Metas do casal para os proximos meses:

6) Observacoes do terapeuta
- Hipoteses iniciais:
- Pontos de atencao:
- Proximos passos:`;

const DEFAULT_CLIENT_ANAMNESIS_TEMPLATE = `Anamnese Inicial - Terapia de Casal

Abordagem:
Psicoterapia Transpessoal - Sistemica - Experiencia Somatica - Constelacao Familiar

1. Identificacao

Parceiro(a) 1:

Data de nascimento / Profissao:

Parceiro(a) 2:

Data de nascimento / Profissao:

Tempo de relacionamento:

Casados? Uniao estavel? Filhos?

2. O que trouxe voces ate aqui?

Se esta sessao fosse um sucesso, o que precisaria acontecer para cada um sair dizendo: 'valeu a pena vir hoje'?

3. Historia do relacionamento

Como voces se conheceram?

O que fez um escolher o outro?

Quais foram os melhores momentos da relacao?

Quando perceberam que algo comecou a mudar?

4. Visao individual

Parceiro(a) 1 - Qual e a sua principal dor nesta relacao?

Parceiro(a) 2 - Qual e a sua principal dor nesta relacao?

O que cada um acredita que mantem esse problema acontecendo?

5. Comunicacao e conflitos

Como costumam discutir?

Como fazem as pazes?

Ha criticas, silencio, ironia, explosoes ou afastamento?

Como demonstram carinho e admiracao?

6. Areas do relacionamento

Vida sexual (se desejarem abordar):

Financas:

Parentalidade:

Tempo de qualidade:

Projetos e sonhos em comum:

7. Olhar sistemico

Como era o relacionamento dos pais de cada um?

Existe historico de separacoes, traicoes, violencia, perdas importantes, adocoes, abortos, dependencia quimica ou doencas marcantes?

Ha lealdades familiares ou padroes que voces percebem repetir?

8. Recursos

O que ainda funciona entre voces?

O que fez voces permanecerem juntos ate hoje?

Quais qualidades voces enxergam um no outro?

9. Objetivos terapeuticos

O que cada um espera construir ao longo do processo?

10. Observacoes da terapeuta

Hipoteses sistemicas iniciais:

Recursos do casal:

Plano inicial de intervencao:

Roteiro da Primeira Sessao (uso da terapeuta)

1. Explicar que o objetivo nao e descobrir quem esta certo, mas compreender a dinamica do casal.
2. Estabelecer regras: respeito, sem interrupcoes e sem agressoes.
3. Ouvir cada um separadamente por alguns minutos.
4. Identificar o ciclo do conflito (gatilho -> reacao -> resposta -> afastamento).
5. Buscar recursos existentes antes de focar apenas nos problemas.
6. Definir um objetivo terapeutico compartilhado.
7. Encerrar com uma tarefa simples para a semana.`;

const ensureLoginCredentials = () => {
  try {
    const savedUser = localStorage.getItem(LOGIN_USER_STORAGE_KEY);
    const savedPassword = localStorage.getItem(LOGIN_PASSWORD_STORAGE_KEY);

    if (!savedUser) {
      localStorage.setItem(LOGIN_USER_STORAGE_KEY, LOGIN_DEFAULT_USERNAME);
    }
    if (!savedPassword) {
      localStorage.setItem(LOGIN_PASSWORD_STORAGE_KEY, LOGIN_DEFAULT_PASSWORD);
    }
  } catch (err) {
    console.log('Login storage indisponivel, usando credenciais padrao em memoria.');
  }
};

const getLoginCredentials = () => {
  ensureLoginCredentials();
  let username = LOGIN_DEFAULT_USERNAME;
  let password = LOGIN_DEFAULT_PASSWORD;

  try {
    username = localStorage.getItem(LOGIN_USER_STORAGE_KEY) || LOGIN_DEFAULT_USERNAME;
    password = localStorage.getItem(LOGIN_PASSWORD_STORAGE_KEY) || LOGIN_DEFAULT_PASSWORD;
  } catch (err) {
    console.log('Falha ao ler login storage, usando padrao em memoria.');
  }
  return {
    username,
    password
  };
};

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

const normalizeTime24h = (timeStr) => {
  if (!timeStr) return '';
  let normalized = String(timeStr).trim();
  const ampm = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec(normalized);
  if (ampm) {
    let hour = parseInt(ampm[1], 10);
    const minute = ampm[2];
    const period = ampm[3].toUpperCase();
    if (period === 'PM' && hour < 12) hour += 12;
    if (period === 'AM' && hour === 12) hour = 0;
    return `${String(hour).padStart(2, '0')}:${minute}`;
  }

  const cleaned = /^(\d{1,2}):(\d{2})$/.exec(normalized);
  if (cleaned) {
    return `${String(cleaned[1]).padStart(2, '0')}:${cleaned[2]}`;
  }

  return normalized;
};

const createLocalDateFromISO = (isoDateStr) => {
  if (!isoDateStr) return null;
  const [year, month, day] = String(isoDateStr).split('-').map(part => parseInt(part, 10));
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
};

const getContrastTextColor = (hexColor) => {
  if (!hexColor) return '#0f172a';
  const hex = String(hexColor).replace('#', '');
  if (hex.length !== 6 && hex.length !== 3) return '#0f172a';
  const normalized = hex.length === 3 ? hex.split('').map(ch => ch + ch).join('') : hex;
  const r = parseInt(normalized.slice(0, 2), 16);
  const g = parseInt(normalized.slice(2, 4), 16);
  const b = parseInt(normalized.slice(4, 6), 16);
  return ((r * 299 + g * 587 + b * 114) / 1000) > 186 ? '#0f172a' : '#fff';
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

const formatISODate = (dateObj) => {
  if (!(dateObj instanceof Date) || Number.isNaN(dateObj.getTime())) return '';
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const formatCompactDateBR = (dateObj) => {
  if (!(dateObj instanceof Date) || Number.isNaN(dateObj.getTime())) return '';
  const day = String(dateObj.getDate()).padStart(2, '0');
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  return `${day}/${month}`;
};

const normalizeText = (value) => {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
};

const escapeHtml = (value) => {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
};

const toHtmlWithLineBreaks = (value) => {
  const safe = escapeHtml(value);
  return safe ? safe.replace(/\n/g, '<br>') : '';
};

const toHtmlWithAnamnesisFormatting = (value) => {
  const safe = escapeHtml(value);
  if (!safe) return '';

  return safe
    .split('\n')
    .map(line => {
      const trimmed = line.trim();
      if (!trimmed) return '';

      const isHeading =
        /^\d{1,2}\.\s+/.test(trimmed) ||
        /^Abordagem:/i.test(trimmed) ||
        /^Roteiro da Primeira Sessao/i.test(trimmed);

      return isHeading
        ? `<span class="anamnesis-heading-line">${trimmed}</span>`
        : trimmed;
    })
    .join('<br>');
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
    this.tabHistory = [];
    this.finFilter = 'todos';
    this.agendaView = 'calendar';
    this.agendaCalendarOffset = 0;
    this.soundEnabled = true;
    this.notifiedApptIds = new Set();
    this.analyticsFocusMode = false;
    this.analyticsFocusGraph = null;
    this.whatsAppTemplates = [{ id: 'tpl-default', name: 'Padrao', text: DEFAULT_WHATSAPP_TEMPLATE }];
    this.whatsAppSelectedTemplateId = 'tpl-default';
    this.whatsAppQueue = [];
    this.whatsAppInvalidCount = 0;
    this.whatsAppInvalidNames = [];
    this.whatsAppInvalidClients = [];
    this.whatsAppInvalidCursor = 0;
    this.appointmentApproaches = [];

    // Estado da Nuvem (Firebase)
    this.auth = null;
    this.db = null;
    this.authUnsub = null;
    this.unsubClients = null;
    this.unsubAppointments = null;
    this.unsubExpenses = null;
    this.currentUser = null;
    this.localLoginUnlocked = false;
    this.lastCloudSyncAt = null;
    this.autoCloudAuthTried = false;
    this.autoCloudAuthInProgress = false;

    // Filtro Global de Período de Datas
    this.startDate = getFirstDayOfMonthStr();
    this.endDate = getLastDayOfMonthStr();

    // Minutos de antecedência do aviso sonoro
    this.reminderMinutes = parseInt(localStorage.getItem('consultorio_reminder_minutes')) || 15;

    // Integração Google Agenda
    this.googleCalendar = {
      clientId: '',
      calendarId: 'primary',
      accessToken: '',
      tokenExpiresAt: 0,
      tokenClient: null
    };

    this.initStore();
    this.initFirebase();
    this.initDOM();
    this.initEvents();
    this.initAudioAndReminders();
    this.render();
    this.notifyBirthdaysToday();
  }

  getAnalyticsRange() {
    const start = createLocalDateFromISO(this.startDate) || createLocalDateFromISO(getFirstDayOfMonthStr());
    const end = createLocalDateFromISO(this.endDate) || createLocalDateFromISO(getLastDayOfMonthStr());

    if (!start || !end) return null;

    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    if (end < start) return null;

    return { start, end };
  }

  buildAnalyticsSeries(items, valueGetter, maxBuckets = 7) {
    const range = this.getAnalyticsRange();
    if (!range) return [];

    const totalDays = Math.max(1, Math.floor((range.end - range.start) / 86400000) + 1);
    const bucketCount = Math.min(maxBuckets, totalDays);
    const series = [];

    for (let index = 0; index < bucketCount; index += 1) {
      const startIndex = Math.floor((index * totalDays) / bucketCount);
      const endIndex = index === bucketCount - 1
        ? totalDays - 1
        : Math.max(startIndex, Math.floor(((index + 1) * totalDays) / bucketCount) - 1);

      const bucketStart = new Date(range.start);
      bucketStart.setDate(range.start.getDate() + startIndex);
      const bucketEnd = new Date(range.start);
      bucketEnd.setDate(range.start.getDate() + endIndex);

      const bucketStartISO = formatISODate(bucketStart);
      const bucketEndISO = formatISODate(bucketEnd);
      const total = items.reduce((sum, item) => {
        const itemDate = item.occurrenceDate || item.date;
        if (!itemDate || itemDate < bucketStartISO || itemDate > bucketEndISO) return sum;
        return sum + (Number(valueGetter(item)) || 0);
      }, 0);

      series.push({
        label: bucketStartISO === bucketEndISO
          ? formatCompactDateBR(bucketStart)
          : `${formatCompactDateBR(bucketStart)}-${formatCompactDateBR(bucketEnd)}`,
        total
      });
    }

    return series;
  }

  buildUniqueClientSeries(items, maxBuckets = 7) {
    const range = this.getAnalyticsRange();
    if (!range) return [];

    const totalDays = Math.max(1, Math.floor((range.end - range.start) / 86400000) + 1);
    const bucketCount = Math.min(maxBuckets, totalDays);
    const series = [];

    for (let index = 0; index < bucketCount; index += 1) {
      const startIndex = Math.floor((index * totalDays) / bucketCount);
      const endIndex = index === bucketCount - 1
        ? totalDays - 1
        : Math.max(startIndex, Math.floor(((index + 1) * totalDays) / bucketCount) - 1);

      const bucketStart = new Date(range.start);
      bucketStart.setDate(range.start.getDate() + startIndex);
      const bucketEnd = new Date(range.start);
      bucketEnd.setDate(range.start.getDate() + endIndex);

      const bucketStartISO = formatISODate(bucketStart);
      const bucketEndISO = formatISODate(bucketEnd);
      const uniqueClients = new Set();

      items.forEach(item => {
        const itemDate = item.occurrenceDate || item.date;
        if (!itemDate || itemDate < bucketStartISO || itemDate > bucketEndISO) return;

        const clientKey = item.clientId || normalizeText(item.clientName) || `${item.clientName || 'cliente'}-${itemDate}`;
        uniqueClients.add(clientKey);
      });

      series.push({
        label: bucketStartISO === bucketEndISO
          ? formatCompactDateBR(bucketStart)
          : `${formatCompactDateBR(bucketStart)}-${formatCompactDateBR(bucketEnd)}`,
        total: uniqueClients.size
      });
    }

    return series;
  }

  isAttendedAppointment(app) {
    const status = normalizeText(app?.status);

    if (status.includes('cancel')) {
      return false;
    }

    if (status.includes('agend') || status.includes('conclu') || status.includes('atend') || status.includes('finaliz')) {
      return true;
    }

    return false;
  }

  getPaidFinanceAppointments(appointmentsList) {
    return appointmentsList.filter(app => (parseFloat(app?.amountPaid || 0) || 0) > 0);
  }

  buildBarChartMarkup(series, { color, valueFormatter, emptyIcon, emptyTitle, emptyText }) {
    if (!series.length) {
      return `
        <div class="empty-state analytics-empty-state">
          <i data-lucide="${emptyIcon}"></i>
          <h4>${emptyTitle}</h4>
          <p>${emptyText}</p>
        </div>
      `;
    }

    const width = 640;
    const height = 240;
    const padding = { top: 18, right: 16, bottom: 44, left: 16 };
    const plotWidth = width - padding.left - padding.right;
    const plotHeight = height - padding.top - padding.bottom;
    const maxValue = Math.max(...series.map(item => item.total), 1);
    const slotWidth = plotWidth / series.length;
    const barWidth = Math.max(22, Math.min(54, slotWidth - 14));
    const axisLines = [0, 0.33, 0.66, 1];

    return `
      <div class="analytics-chart-shell" style="--chart-columns:${series.length};">
        <svg class="analytics-chart-svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="Gráfico do período">
          ${axisLines.map(ratio => {
            const y = padding.top + (plotHeight * (1 - ratio));
            return `<line class="chart-grid-line" x1="${padding.left}" x2="${width - padding.right}" y1="${y}" y2="${y}" />`;
          }).join('')}
          ${series.map((item, index) => {
            const barHeight = item.total > 0 ? (item.total / maxValue) * plotHeight : 6;
            const x = padding.left + (index * slotWidth) + ((slotWidth - barWidth) / 2);
            const y = padding.top + plotHeight - barHeight;
            const labelY = item.total > 0
              ? padding.top + 12
              : height - padding.bottom + 14;
            return `
              <g>
                <title>${item.label}: ${valueFormatter(item.total)}</title>
                <rect class="chart-bar" x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" rx="12" style="fill:${color};" />
                <text class="chart-value-label" x="${x + (barWidth / 2)}" y="${labelY}">${valueFormatter(item.total)}</text>
              </g>
            `;
          }).join('')}
        </svg>
        <div class="chart-axis-labels">
          ${series.map(item => `<span>${item.label}</span>`).join('')}
        </div>
      </div>
    `;
  }

  buildGroupedBarChartMarkup(series, { primaryColor, secondaryColor, primaryLabel, secondaryLabel, primaryFormatter, secondaryFormatter, emptyIcon, emptyTitle, emptyText }) {
    if (!series.length) {
      return `
        <div class="empty-state analytics-empty-state">
          <i data-lucide="${emptyIcon}"></i>
          <h4>${emptyTitle}</h4>
          <p>${emptyText}</p>
        </div>
      `;
    }

    const width = 640;
    const height = 250;
    const padding = { top: 18, right: 16, bottom: 44, left: 16 };
    const plotWidth = width - padding.left - padding.right;
    const plotHeight = height - padding.top - padding.bottom;
    const maxValue = Math.max(...series.flatMap(item => [item.primary, item.secondary]), 1);
    const slotWidth = plotWidth / series.length;
    const barWidth = Math.max(14, Math.min(22, (slotWidth - 16) / 2));
    const axisLines = [0, 0.33, 0.66, 1];

    return `
      <div class="analytics-chart-shell analytics-chart-shell-grouped" style="--chart-columns:${series.length};">
        <div class="analytics-legend">
          <span><i style="background:${primaryColor};"></i>${primaryLabel}</span>
          <span><i style="background:${secondaryColor};"></i>${secondaryLabel}</span>
        </div>
        <svg class="analytics-chart-svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="Gráfico financeiro comparativo">
          ${axisLines.map(ratio => {
            const y = padding.top + (plotHeight * (1 - ratio));
            return `<line class="chart-grid-line" x1="${padding.left}" x2="${width - padding.right}" y1="${y}" y2="${y}" />`;
          }).join('')}
          ${series.map((item, index) => {
            const x = padding.left + (index * slotWidth);
            const revenueHeight = item.primary > 0 ? (item.primary / maxValue) * plotHeight : 6;
            const expenseHeight = item.secondary > 0 ? (item.secondary / maxValue) * plotHeight : 6;
            const revenueX = x + (slotWidth / 2) - barWidth - 4;
            const expenseX = x + (slotWidth / 2) + 4;
            const revenueY = padding.top + plotHeight - revenueHeight;
            const expenseY = padding.top + plotHeight - expenseHeight;
            const revenueLabelY = Math.max(padding.top + 8, revenueY - 18);
            const expenseLabelY = Math.min(height - padding.bottom + 16, expenseY + expenseHeight + 16);
            return `
              <g>
                <title>${item.label}: ${primaryLabel} ${primaryFormatter(item.primary)} | ${secondaryLabel} ${secondaryFormatter(item.secondary)}</title>
                <rect class="chart-bar" x="${revenueX}" y="${revenueY}" width="${barWidth}" height="${revenueHeight}" rx="10" style="fill:${primaryColor};" />
                <rect class="chart-bar" x="${expenseX}" y="${expenseY}" width="${barWidth}" height="${expenseHeight}" rx="10" style="fill:${secondaryColor};" />
                <text class="chart-value-label chart-value-label-left" x="${revenueX + (barWidth / 2)}" y="${revenueLabelY}">${primaryFormatter(item.primary)}</text>
                <text class="chart-value-label chart-value-label-right" x="${expenseX + (barWidth / 2)}" y="${expenseLabelY}">${secondaryFormatter(item.secondary)}</text>
              </g>
            `;
          }).join('')}
        </svg>
        <div class="chart-axis-labels chart-axis-labels-grouped">
          ${series.map(item => `<span>${item.label}</span>`).join('')}
        </div>
      </div>
    `;
  }

  renderAnalyticsTab() {
    const rangeApps = this.filterByTopDateRange(this.appointments);
    const visibleExpenses = this.expenses.flatMap(exp => this.getExpenseOccurrences(exp, this.startDate, this.endDate));
    const agendaAttendedApps = rangeApps.filter(app => this.isAttendedAppointment(app));
    const attendanceSeries = this.buildUniqueClientSeries(agendaAttendedApps, 7);
    const revenueSeries = this.buildAnalyticsSeries(rangeApps, app => parseFloat(app.amountPaid) || 0, 7);
    const expenseSeries = this.buildAnalyticsSeries(visibleExpenses, expense => parseFloat(expense.amount) || 0, 7);
    const financeSeries = revenueSeries.map((revenueItem, index) => ({
      label: revenueItem.label,
      primary: revenueItem.total,
      secondary: expenseSeries[index]?.total || 0
    }));

    const attendanceChartEl = document.getElementById('analytics-attendance-chart');
    const financeChartEl = document.getElementById('analytics-finance-chart');

    if (attendanceChartEl) {
      attendanceChartEl.innerHTML = this.buildBarChartMarkup(attendanceSeries, {
        color: 'rgba(14, 165, 233, 0.95)',
        valueFormatter: value => `${Math.round(value)} cliente(s)`,
        emptyIcon: 'users',
        emptyTitle: 'Sem atendimentos no mês',
        emptyText: 'Não há clientes com consulta atendida ou paga registrada na agenda dentro do período selecionado.'
      });
    }

    if (financeChartEl) {
      financeChartEl.innerHTML = this.buildGroupedBarChartMarkup(financeSeries, {
        primaryColor: 'rgba(16, 185, 129, 0.95)',
        secondaryColor: 'rgba(245, 158, 11, 0.95)',
        primaryLabel: 'Receita',
        secondaryLabel: 'Despesa',
        primaryFormatter: value => formatCurrency(value),
        secondaryFormatter: value => formatCurrency(value),
        emptyIcon: 'wallet',
        emptyTitle: 'Sem movimentação financeira',
        emptyText: 'Não há receitas nem despesas dentro do intervalo selecionado.'
      });
    }

    this.applyAnalyticsFocusMode();
  }

  applyAnalyticsFocusMode() {
    document.body.classList.toggle('analytics-focus-mode', this.analyticsFocusMode);
    document.body.classList.remove('analytics-focus-attendance', 'analytics-focus-finance');

    if (this.analyticsFocusMode && this.analyticsFocusGraph) {
      document.body.classList.add(`analytics-focus-${this.analyticsFocusGraph}`);
    }

    const toggleButton = document.getElementById('btn-toggle-analytics-focus');
    if (toggleButton) {
      toggleButton.innerHTML = this.analyticsFocusMode
        ? '<i data-lucide="arrow-left"></i><span>Voltar aos gráficos</span>'
        : '<i data-lucide="maximize-2"></i><span>Tela limpa</span>';
    }
  }

  toggleAnalyticsFocusMode() {
    if (this.analyticsFocusMode) {
      this.analyticsFocusMode = false;
      this.analyticsFocusGraph = null;
    } else {
      this.analyticsFocusMode = true;
      this.analyticsFocusGraph = this.analyticsFocusGraph || 'finance';
    }
    this.render();
  }

  focusAnalyticsGraph(graphId) {
    this.analyticsFocusMode = true;
    this.analyticsFocusGraph = graphId;
    this.render();
  }

  sanitizeAnamnesisTemplate(templateText) {
    const lines = String(templateText || '').split('\n');
    const cleaned = lines
      // Remove linhas compostas apenas por marcadores visuais longos
      .filter(line => !/^\s*[_-]{10,}\s*$/.test(line))
      .join('\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();

    return cleaned;
  }

  formatAnamnesisText(templateText) {
    const sanitized = this.sanitizeAnamnesisTemplate(templateText);
    if (!sanitized) return '';

    const canonicalSections = [
      '1. Identificacao',
      '2. O que trouxe voces ate aqui?',
      '3. Historia do relacionamento',
      '4. Visao individual',
      '5. Comunicacao e conflitos',
      '6. Areas do relacionamento',
      '7. Olhar sistemico',
      '8. Recursos',
      '9. Objetivos terapeuticos',
      '10. Observacoes da terapeuta'
    ];

    const lines = sanitized.split('\n').map(line => String(line || '').replace(/\s+$/g, ''));
    const normalizedSections = canonicalSections.map(title => ({
      title,
      key: normalizeText(title.replace(/^\d+\.\s*/, ''))
    }));

    const fixed = lines.map(line => {
      const trimmed = line.trim();
      if (!trimmed) return line;

      const withoutNumber = trimmed.replace(/^\d{1,2}\s*[\.)\-:]?\s*/, '');
      const normalized = normalizeText(withoutNumber);
      const matched = normalizedSections.find(section => normalized === section.key);

      if (matched) return matched.title;
      return line;
    });

    return fixed.join('\n').replace(/\n{3,}/g, '\n\n').trim();
  }

  getAnamnesisQuestionnaireSchema() {
    return [
      {
        section: '1. Identificacao',
        questions: [
          'Parceiro(a) 1:',
          'Data de nascimento / Profissao:',
          'Parceiro(a) 2:',
          'Data de nascimento / Profissao:',
          'Tempo de relacionamento:',
          'Casados? Uniao estavel? Filhos?'
        ]
      },
      {
        section: '2. O que trouxe voces ate aqui?',
        questions: [
          "Se esta sessao fosse um sucesso, o que precisaria acontecer para cada um sair dizendo: 'valeu a pena vir hoje'?"
        ]
      },
      {
        section: '3. Historia do relacionamento',
        questions: [
          'Como voces se conheceram?',
          'O que fez um escolher o outro?',
          'Quais foram os melhores momentos da relacao?',
          'Quando perceberam que algo comecou a mudar?'
        ]
      },
      {
        section: '4. Visao individual',
        questions: [
          'Parceiro(a) 1 - Qual e a sua principal dor nesta relacao?',
          'Parceiro(a) 2 - Qual e a sua principal dor nesta relacao?',
          'O que cada um acredita que mantem esse problema acontecendo?'
        ]
      },
      {
        section: '5. Comunicacao e conflitos',
        questions: [
          'Como costumam discutir?',
          'Como fazem as pazes?',
          'Ha criticas, silencio, ironia, explosoes ou afastamento?',
          'Como demonstram carinho e admiracao?'
        ]
      },
      {
        section: '6. Areas do relacionamento',
        questions: [
          'Vida sexual (se desejarem abordar):',
          'Financas:',
          'Parentalidade:',
          'Tempo de qualidade:',
          'Projetos e sonhos em comum:'
        ]
      },
      {
        section: '7. Olhar sistemico',
        questions: [
          'Como era o relacionamento dos pais de cada um?',
          'Existe historico de separacoes, traicoes, violencia, perdas importantes, adocoes, abortos, dependencia quimica ou doencas marcantes?',
          'Ha lealdades familiares ou padroes que voces percebem repetir?'
        ]
      },
      {
        section: '8. Recursos',
        questions: [
          'O que ainda funciona entre voces?',
          'O que fez voces permanecerem juntos ate hoje?',
          'Quais qualidades voces enxergam um no outro?'
        ]
      },
      {
        section: '9. Objetivos terapeuticos',
        questions: [
          'O que cada um espera construir ao longo do processo?'
        ]
      },
      {
        section: '10. Observacoes da terapeuta',
        questions: [
          'Hipoteses sistemicas iniciais:',
          'Recursos do casal:',
          'Plano inicial de intervencao:'
        ]
      },
      {
        section: 'Roteiro da Primeira Sessao (uso da terapeuta)',
        questions: [
          '1. Explicar que o objetivo nao e descobrir quem esta certo, mas compreender a dinamica do casal.',
          '2. Estabelecer regras: respeito, sem interrupcoes e sem agressoes.',
          '3. Ouvir cada um separadamente por alguns minutos.',
          '4. Identificar o ciclo do conflito (gatilho -> reacao -> resposta -> afastamento).',
          '5. Buscar recursos existentes antes de focar apenas nos problemas.',
          '6. Definir um objetivo terapeutico compartilhado.',
          '7. Encerrar com uma tarefa simples para a semana.'
        ]
      }
    ];
  }

  getAnamnesisQuestionKey(sectionTitle, questionText, questionIndex) {
    return `${normalizeText(sectionTitle)}__${questionIndex}__${normalizeText(questionText)}`;
  }

  parseAnamnesisResponsesFromText(textValue) {
    const text = this.formatAnamnesisText(textValue || '');
    const schema = this.getAnamnesisQuestionnaireSchema();
    const responses = {};

    schema.forEach(group => {
      group.questions.forEach((q, idx) => {
        const key = this.getAnamnesisQuestionKey(group.section, q, idx);
        responses[key] = '';
      });
    });

    if (!text) return responses;

    const lines = text.split('\n').map(line => line.trim());
    const questionLookup = new Map();
    const headingLookup = new Set();

    schema.forEach(group => {
      headingLookup.add(normalizeText(group.section));
      group.questions.forEach((q, idx) => {
        const key = this.getAnamnesisQuestionKey(group.section, q, idx);
        questionLookup.set(normalizeText(q), key);
      });
    });

    let activeKey = null;
    lines.forEach(line => {
      const cleanedLine = line.replace(/^[-*•\u2022]\s*/, '').trim();
      const normalizedLine = normalizeText(cleanedLine);
      if (!normalizedLine) return;

      if (headingLookup.has(normalizedLine)) {
        activeKey = null;
        return;
      }

      const nextKey = questionLookup.get(normalizedLine);
      if (nextKey) {
        activeKey = nextKey;
        return;
      }

      const colonIndex = cleanedLine.indexOf(':');
      if (colonIndex > 0) {
        const questionPart = normalizeText(cleanedLine.slice(0, colonIndex));
        const answerPart = cleanedLine.slice(colonIndex + 1).trim();
        const colonKey = questionLookup.get(questionPart);
        if (colonKey) {
          responses[colonKey] = answerPart;
          activeKey = colonKey;
          return;
        }
      }

      if (!activeKey) return;

      responses[activeKey] = responses[activeKey]
        ? `${responses[activeKey]}\n${line}`
        : line;
    });

    return responses;
  }

  buildAnamnesisTextFromResponses(responses) {
    const schema = this.getAnamnesisQuestionnaireSchema();
    const lines = [
      'Anamnese Inicial - Terapia de Casal',
      '',
      'Abordagem:',
      'Psicoterapia Transpessoal - Sistemica - Experiencia Somatica - Constelacao Familiar',
      ''
    ];

    schema.forEach(group => {
      lines.push(group.section, '');

      group.questions.forEach((q, idx) => {
        const key = this.getAnamnesisQuestionKey(group.section, q, idx);
        const answer = String(responses[key] || '').trim();

        lines.push(q);
        if (answer) {
          answer.split('\n').forEach(part => lines.push(part));
        }
        lines.push('');
      });
    });

    return this.formatAnamnesisText(lines.join('\n'));
  }

  renderClientAnamnesisBubbles(textValue, options = {}) {
    const container = document.getElementById('client-anamnesis-bubbles');
    const hiddenTextarea = document.getElementById('client-anamnesis');
    if (!container || !hiddenTextarea) return;

    const schema = this.getAnamnesisQuestionnaireSchema();
    const responses = this.parseAnamnesisResponsesFromText(textValue);
    const forceOpen = Boolean(options?.allOpen);

    container.innerHTML = schema.map(group => {
      const questionCards = group.questions.map((q, idx) => {
        const key = this.getAnamnesisQuestionKey(group.section, q, idx);
        const value = escapeHtml(responses[key] || '');
        const isOpen = forceOpen || idx === 0;

        return `
          <details class="anamnesis-question-bubble"${isOpen ? ' open' : ''}>
            <summary>${escapeHtml(q)}</summary>
            <div class="anamnesis-question-body">
              <textarea class="form-control anamnesis-answer-input" data-anamnesis-key="${escapeHtml(key)}" rows="3" placeholder="Digite a resposta...">${value}</textarea>
            </div>
          </details>
        `;
      }).join('');

      return `
        <div class="anamnesis-section-block">
          <h5 class="anamnesis-section-title">${escapeHtml(group.section)}</h5>
          <div class="anamnesis-question-list">
            ${questionCards}
          </div>
        </div>
      `;
    }).join('');

    const syncHiddenField = () => {
      const currentResponses = {};
      container.querySelectorAll('.anamnesis-answer-input').forEach(input => {
        currentResponses[input.getAttribute('data-anamnesis-key')] = input.value;
      });
      const hasAnyCurrentResponse = Object.values(currentResponses).some(value => String(value || '').trim());
      hiddenTextarea.value = hasAnyCurrentResponse
        ? this.buildAnamnesisTextFromResponses(currentResponses)
        : this.formatAnamnesisText(textValue || this.getAnamnesisTemplate());
    };

    container.querySelectorAll('.anamnesis-answer-input').forEach(input => {
      input.disabled = false;
      input.readOnly = false;
      input.style.pointerEvents = 'auto';
      input.addEventListener('input', syncHiddenField);
    });

    syncHiddenField();
  }

  renderClientAnamnesisReadOnlyBubbles(textValue, options = {}) {
    const schema = this.getAnamnesisQuestionnaireSchema();
    const responses = this.parseAnamnesisResponsesFromText(textValue);
    const forceOpen = Boolean(options?.allOpen);

    return schema.map(group => {
      const questionCards = group.questions.map((q, idx) => {
        const key = this.getAnamnesisQuestionKey(group.section, q, idx);
        const answer = String(responses[key] || '').trim();
        const renderedAnswer = answer
          ? toHtmlWithLineBreaks(answer)
          : '<span class="anamnesis-answer-empty">Sem resposta informada.</span>';
        const isOpen = forceOpen || idx === 0;

        return `
          <div class="anamnesis-question-bubble anamnesis-question-bubble-readonly" data-anamnesis-card>
            <div class="anamnesis-question-header">
              <span class="anamnesis-question-title">${escapeHtml(q)}</span>
              <button type="button" class="btn btn-sm btn-secondary anamnesis-toggle-answer" data-anamnesis-toggle>${isOpen ? 'Ocultar resposta' : 'Ver resposta'}</button>
            </div>
            <div class="anamnesis-question-body${isOpen ? '' : ' anamnesis-question-body-hidden'}" data-anamnesis-answer>
              <p class="anamnesis-answer-readonly">${renderedAnswer}</p>
            </div>
          </div>
        `;
      }).join('');

      return `
        <div class="anamnesis-section-block">
          <h5 class="anamnesis-section-title">${escapeHtml(group.section)}</h5>
          <div class="anamnesis-question-list">
            ${questionCards}
          </div>
        </div>
      `;
    }).join('');
  }

  getAnamnesisTemplate() {
    const savedTemplate = localStorage.getItem(ANAMNESIS_TEMPLATE_STORAGE_KEY);
    const baseTemplate = savedTemplate && savedTemplate.trim()
      ? savedTemplate
      : DEFAULT_CLIENT_ANAMNESIS_TEMPLATE;

    return this.formatAnamnesisText(baseTemplate);
  }

  isAnamnesisTemplateComplete(templateText) {
    const normalized = String(templateText || '').trim();
    if (!normalized) return false;

    return [
      '7. Olhar sistemico',
      '8. Recursos',
      '9. Objetivos terapeuticos',
      '10. Observacoes da terapeuta'
    ].every(sectionTitle => normalized.includes(sectionTitle));
  }

  getAnamnesisTemplateSections(templateText) {
    const cleanedTemplate = this.formatAnamnesisText(templateText || DEFAULT_CLIENT_ANAMNESIS_TEMPLATE);
    const chunks = cleanedTemplate.split(/\n(?=\d{1,2}\.\s)/g).map(chunk => chunk.trim()).filter(Boolean);
    const sectionChunks = chunks.filter(chunk => /^\d{1,2}\.\s/.test(chunk));

    return sectionChunks.map(chunk => {
      const heading = chunk.split('\n')[0].trim();
      return { heading, chunk };
    });
  }

  completeClientAnamnesis(clientAnamnesis) {
    const cleanedClientText = this.formatAnamnesisText(clientAnamnesis);
    if (!cleanedClientText) return this.getAnamnesisTemplate();

    const sectionBlocks = this.getAnamnesisTemplateSections(this.getAnamnesisTemplate());
    const normalizedClientText = normalizeText(cleanedClientText);
    const missingBlocks = sectionBlocks
      .filter(section => !normalizedClientText.includes(normalizeText(section.heading)))
      .map(section => section.chunk);

    if (missingBlocks.length === 0) {
      return cleanedClientText;
    }

    return this.formatAnamnesisText(`${cleanedClientText}\n\n${missingBlocks.join('\n\n')}`);
  }

  migrateSavedClientsAnamnesis() {
    if (!Array.isArray(this.clients) || this.clients.length === 0) return;

    let changed = false;
    this.clients = this.clients.map(client => {
      if (!client) return client;

      const currentAnamnesis = String(client.anamnesis || '').trim();
      const completedAnamnesis = this.completeClientAnamnesis(currentAnamnesis);

      if (completedAnamnesis !== currentAnamnesis) {
        changed = true;
        return { ...client, anamnesis: completedAnamnesis };
      }

      return client;
    });

    if (changed) {
      this.saveStore();
    }
  }

  getNextClientRegistrationNumber() {
    const maxNumber = this.clients.reduce((max, client) => {
      const value = Number(client?.registrationNumber);
      return Number.isInteger(value) && value > max ? value : max;
    }, 0);

    return maxNumber + 1;
  }

  migrateClientRegistrationNumbers() {
    if (!Array.isArray(this.clients) || this.clients.length === 0) return;

    const clientsWithValidNumber = this.clients.filter(c => Number.isInteger(Number(c?.registrationNumber)) && Number(c.registrationNumber) > 0);
    const hasAnyRegistrationNumber = clientsWithValidNumber.length > 0;

    let changed = false;

    if (!hasAnyRegistrationNumber) {
      const sorted = [...this.clients].sort((a, b) => {
        const aDate = parseDateBR(a?.createdAt || '') || a?.createdAt || '';
        const bDate = parseDateBR(b?.createdAt || '') || b?.createdAt || '';
        if (aDate !== bDate) return String(aDate).localeCompare(String(bDate));
        return String(a?.name || '').localeCompare(String(b?.name || ''));
      });

      const idToNumber = new Map(sorted.map((client, index) => [client.id, index + 1]));
      this.clients = this.clients.map(client => {
        const registrationNumber = idToNumber.get(client.id) || this.getNextClientRegistrationNumber();
        changed = true;
        return { ...client, registrationNumber };
      });
    } else {
      const used = new Set();
      this.clients = this.clients.map(client => {
        const value = Number(client?.registrationNumber);
        const valid = Number.isInteger(value) && value > 0 && !used.has(value);
        if (valid) {
          used.add(value);
          return client;
        }

        let next = 1;
        while (used.has(next)) next += 1;
        used.add(next);
        changed = true;
        return { ...client, registrationNumber: next };
      });
    }

    if (changed) {
      this.saveStore();
    }
  }

  migrateAnamnesisTemplate() {
    const savedTemplate = (localStorage.getItem(ANAMNESIS_TEMPLATE_STORAGE_KEY) || '').trim();
    const savedVersion = localStorage.getItem(ANAMNESIS_TEMPLATE_VERSION_STORAGE_KEY) || '';
    const sanitizedSavedTemplate = this.formatAnamnesisText(savedTemplate);
    const sanitizedDefaultTemplate = this.formatAnamnesisText(DEFAULT_CLIENT_ANAMNESIS_TEMPLATE);

    const shouldReplaceWithNewDefault =
      !sanitizedSavedTemplate ||
      savedTemplate === LEGACY_DEFAULT_CLIENT_ANAMNESIS_TEMPLATE.trim() ||
      !this.isAnamnesisTemplateComplete(sanitizedSavedTemplate);

    if (shouldReplaceWithNewDefault) {
      localStorage.setItem(ANAMNESIS_TEMPLATE_STORAGE_KEY, sanitizedDefaultTemplate);
    } else if (savedTemplate !== sanitizedSavedTemplate) {
      // Corrige templates antigos que ainda tinham linhas tracejadas
      localStorage.setItem(ANAMNESIS_TEMPLATE_STORAGE_KEY, sanitizedSavedTemplate);
    }

    if (savedVersion !== ANAMNESIS_TEMPLATE_CURRENT_VERSION) {
      localStorage.setItem(ANAMNESIS_TEMPLATE_VERSION_STORAGE_KEY, ANAMNESIS_TEMPLATE_CURRENT_VERSION);
    }
  }

  saveAnamnesisTemplate(templateText) {
    const normalized = this.formatAnamnesisText(templateText);
    localStorage.setItem(
      ANAMNESIS_TEMPLATE_STORAGE_KEY,
      normalized || this.formatAnamnesisText(DEFAULT_CLIENT_ANAMNESIS_TEMPLATE)
    );
    localStorage.setItem(ANAMNESIS_TEMPLATE_VERSION_STORAGE_KEY, ANAMNESIS_TEMPLATE_CURRENT_VERSION);
  }

  // Inicializa a persistência no LocalStorage
  initStore() {
    this.migrateAnamnesisTemplate();

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

    this.migrateClientRegistrationNumbers();
    this.migrateSavedClientsAnamnesis();
    this.loadAppointmentApproaches();

    const savedWhatsTemplatesStr = localStorage.getItem('consultorio_whatsapp_templates');
    const savedWhatsSelectedId = localStorage.getItem('consultorio_whatsapp_template_selected');
    if (savedWhatsTemplatesStr) {
      try {
        const parsed = JSON.parse(savedWhatsTemplatesStr);
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.whatsAppTemplates = parsed.filter(t => t && t.id && t.name && t.text);
        }
      } catch (e) {
        console.log('Erro ao ler templates WhatsApp:', e);
      }
    }

    // Migration from old single-template storage
    const legacyTemplate = localStorage.getItem('consultorio_whatsapp_template');
    if (legacyTemplate && legacyTemplate.trim()) {
      const alreadyHasLegacy = this.whatsAppTemplates.some(t => t.name === 'Modelo Antigo');
      if (!alreadyHasLegacy) {
        this.whatsAppTemplates.push({
          id: `tpl-legacy-${Date.now()}`,
          name: 'Modelo Antigo',
          text: legacyTemplate
        });
      }
    }

    if (savedWhatsSelectedId && this.whatsAppTemplates.some(t => t.id === savedWhatsSelectedId)) {
      this.whatsAppSelectedTemplateId = savedWhatsSelectedId;
    } else {
      this.whatsAppSelectedTemplateId = this.whatsAppTemplates[0].id;
    }

    const googleSettingsRaw = localStorage.getItem(GOOGLE_CALENDAR_STORAGE_KEY);
    if (googleSettingsRaw) {
      try {
        const parsed = JSON.parse(googleSettingsRaw);
        this.googleCalendar.clientId = parsed.clientId || '';
        this.googleCalendar.calendarId = parsed.calendarId || 'primary';
      } catch (e) {
        console.log('Erro ao ler configuração Google Agenda:', e);
      }
    }
  }

  saveStore() {
    localStorage.setItem('consultorio_clients', JSON.stringify(this.clients));
    localStorage.setItem('consultorio_appointments', JSON.stringify(this.appointments));
    localStorage.setItem('consultorio_expenses', JSON.stringify(this.expenses));
    localStorage.setItem('consultorio_whatsapp_templates', JSON.stringify(this.whatsAppTemplates));
    localStorage.setItem('consultorio_whatsapp_template_selected', this.whatsAppSelectedTemplateId || '');
    localStorage.setItem(APPOINTMENT_APPROACHES_STORAGE_KEY, JSON.stringify(this.appointmentApproaches));
    localStorage.setItem(GOOGLE_CALENDAR_STORAGE_KEY, JSON.stringify({
      clientId: this.googleCalendar.clientId || '',
      calendarId: this.googleCalendar.calendarId || 'primary'
    }));
  }

  getDefaultAppointmentApproaches() {
    return [
      { id: 'abordagem-avaliacao', name: 'Avaliação Inicial', price: 300 },
      { id: 'abordagem-casal', name: 'Psicoterapia de Casal', price: 250 },
      { id: 'abordagem-retorno', name: 'Retorno', price: 180 },
      { id: 'abordagem-individual', name: 'Sessão Individual', price: 200 },
      { id: 'abordagem-sistemica', name: 'Sessão Sistêmica / Familiar', price: 280 }
    ];
  }

  loadAppointmentApproaches() {
    const savedApproaches = localStorage.getItem(APPOINTMENT_APPROACHES_STORAGE_KEY);
    if (savedApproaches) {
      try {
        const parsed = JSON.parse(savedApproaches);
        if (Array.isArray(parsed) && parsed.length) {
          this.appointmentApproaches = parsed
            .filter(item => item && item.name)
            .map((item, index) => ({
              id: item.id || `abordagem-${index + 1}`,
              name: String(item.name).trim(),
              price: Number(item.price) || 0
            }));
          return;
        }
      } catch (err) {
        console.log('Erro ao ler abordagens do agendamento:', err);
      }
    }

    this.appointmentApproaches = this.getDefaultAppointmentApproaches();
    localStorage.setItem(APPOINTMENT_APPROACHES_STORAGE_KEY, JSON.stringify(this.appointmentApproaches));
  }

  populateAppointmentApproachOptions(selectedName = '', selectedPrice = '') {
    const select = document.getElementById('appt-procedure');
    if (!select) return;

    if (!this.appointmentApproaches.length) {
      this.loadAppointmentApproaches();
    }

    const options = [...this.appointmentApproaches];
    if (selectedName && !options.some(option => option.name === selectedName)) {
      options.unshift({ id: 'abordagem-atual', name: selectedName, price: Number(selectedPrice) || 0 });
    }

    select.innerHTML = [
      '<option value="">Selecione uma abordagem</option>',
      ...options.map(option => {
        const priceLabel = Number(option.price) > 0 ? ` - ${formatCurrency(option.price)}` : '';
        return `<option value="${escapeHtml(option.name)}" data-price="${Number(option.price) || 0}">${escapeHtml(option.name)}${escapeHtml(priceLabel)}</option>`;
      })
    ].join('');

    if (selectedName) {
      select.value = selectedName;
    }
  }

  syncAppointmentPriceFromApproach() {
    const select = document.getElementById('appt-procedure');
    const priceInput = document.getElementById('appt-price');
    if (!select || !priceInput) return;

    const selectedOption = select.selectedOptions?.[0];
    if (!selectedOption) return;

    const suggestedPrice = parseFloat(selectedOption.getAttribute('data-price') || '0');
    if (!Number.isNaN(suggestedPrice) && suggestedPrice > 0) {
      priceInput.value = suggestedPrice.toFixed(2);
    }
  }

  promptAppointmentApproach(existingApproach = null) {
    const currentName = existingApproach?.name || '';
    const currentPrice = existingApproach?.price ?? '';
    const name = prompt('Nome da abordagem:', currentName)?.trim();
    if (!name) return;

    const priceInput = prompt('Valor sugerido da consulta:', String(currentPrice));
    if (priceInput === null) return;

    const parsedPrice = parseFloat(String(priceInput).replace(',', '.'));
    const price = Number.isNaN(parsedPrice) ? 0 : parsedPrice;

    if (existingApproach) {
      existingApproach.name = name;
      existingApproach.price = price;
    } else {
      this.appointmentApproaches.push({
        id: `abordagem-${Date.now()}`,
        name,
        price
      });
    }

    localStorage.setItem(APPOINTMENT_APPROACHES_STORAGE_KEY, JSON.stringify(this.appointmentApproaches));
    const currentValue = document.getElementById('appt-procedure')?.value || name;
    const currentPriceValue = document.getElementById('appt-price')?.value || '';
    this.populateAppointmentApproachOptions(currentValue, currentPriceValue);
    const select = document.getElementById('appt-procedure');
    if (select) select.value = name;
    this.syncAppointmentPriceFromApproach();
    this.showToast('Abordagem atualizada com sucesso.', 'success');
  }

  saveGoogleCalendarSettingsFromUI() {
    const clientInput = document.getElementById('cfg-google-client-id');
    const calendarInput = document.getElementById('cfg-google-calendar-id');

    this.googleCalendar.clientId = (clientInput?.value || '').trim();
    this.googleCalendar.calendarId = (calendarInput?.value || '').trim() || 'primary';
    this.saveStore();
    this.updateGoogleCalendarStatus();
  }

  updateGoogleCalendarStatus() {
    const statusEl = document.getElementById('google-calendar-status-text');
    if (!statusEl) return;

    if (!this.googleCalendar.clientId) {
      statusEl.textContent = 'Desconectado (informe o Client ID).';
      return;
    }

    if (this.isGoogleCalendarConnected()) {
      statusEl.textContent = `Conectado com sucesso na agenda ${this.googleCalendar.calendarId || 'primary'}.`;
      return;
    }

    statusEl.textContent = `Pronto para conectar na agenda ${this.googleCalendar.calendarId || 'primary'}.`;
  }

  isGoogleCalendarConnected() {
    return Boolean(this.googleCalendar.accessToken) && Date.now() < (this.googleCalendar.tokenExpiresAt - 30000);
  }

  ensureGoogleCalendarToken(interactive = true) {
    return new Promise((resolve, reject) => {
      if (this.isGoogleCalendarConnected()) {
        resolve(this.googleCalendar.accessToken);
        return;
      }

      if (!this.googleCalendar.clientId) {
        reject(new Error('Google Client ID não configurado.'));
        return;
      }

      if (!window.google || !window.google.accounts || !window.google.accounts.oauth2) {
        reject(new Error('Biblioteca de login Google não carregada.'));
        return;
      }

      if (!this.googleCalendar.tokenClient || this.googleCalendar.tokenClient.client_id !== this.googleCalendar.clientId) {
        this.googleCalendar.tokenClient = window.google.accounts.oauth2.initTokenClient({
          client_id: this.googleCalendar.clientId,
          scope: GOOGLE_CALENDAR_SCOPE,
          callback: () => {}
        });
        this.googleCalendar.tokenClient.client_id = this.googleCalendar.clientId;
      }

      this.googleCalendar.tokenClient.callback = (response) => {
        if (!response || response.error) {
          reject(new Error(response?.error || 'Falha na autenticação Google.'));
          return;
        }

        this.googleCalendar.accessToken = response.access_token;
        const expiresIn = Number(response.expires_in || 3600);
        this.googleCalendar.tokenExpiresAt = Date.now() + (expiresIn * 1000);
        this.updateGoogleCalendarStatus();
        resolve(this.googleCalendar.accessToken);
      };

      this.googleCalendar.tokenClient.requestAccessToken({ prompt: interactive ? 'consent' : '' });
    });
  }

  async googleCalendarRequest(path, options = {}, interactive = false) {
    const token = await this.ensureGoogleCalendarToken(interactive);
    const url = `https://www.googleapis.com/calendar/v3${path}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        ...(options.headers || {})
      }
    });

    if (response.status === 401 && !interactive) {
      this.googleCalendar.accessToken = '';
      return this.googleCalendarRequest(path, options, true);
    }

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Google Calendar API ${response.status}: ${errorText}`);
    }

    if (response.status === 204) return null;
    return response.json();
  }

  buildGoogleEventFromAppointment(appt) {
    const startDateTime = `${appt.date}T${appt.time || '09:00'}:00`;
    const endDateObj = new Date(startDateTime);
    const durationMinutes = Math.max(15, parseInt(appt.durationMinutes, 10) || 50);
    endDateObj.setMinutes(endDateObj.getMinutes() + durationMinutes);
    const endDateTime = `${formatISODate(endDateObj)}T${String(endDateObj.getHours()).padStart(2, '0')}:${String(endDateObj.getMinutes()).padStart(2, '0')}:00`;

    return {
      summary: `${appt.clientName || 'Cliente'} - ${appt.procedure || 'Consulta'}`,
      description: [
        `Status: ${appt.status || 'Agendado'}`,
        `Pagamento: ${appt.paymentStatus || 'Pendente'}`,
        `Valor: ${formatCurrency(appt.price || 0)}`,
        appt.notes ? `Observações: ${appt.notes}` : '',
        `ID interno: ${appt.id}`
      ].filter(Boolean).join('\n'),
      start: {
        dateTime: startDateTime,
        timeZone: 'America/Sao_Paulo'
      },
      end: {
        dateTime: endDateTime,
        timeZone: 'America/Sao_Paulo'
      },
      extendedProperties: {
        private: {
          consultorioAppointmentId: appt.id
        }
      }
    };
  }

  async upsertGoogleEventForAppointment(appt, { interactive = false } = {}) {
    if (!appt || !this.googleCalendar.clientId) return;
    if (!interactive && !this.isGoogleCalendarConnected()) return;

    const calendarId = encodeURIComponent(this.googleCalendar.calendarId || 'primary');
    const payload = this.buildGoogleEventFromAppointment(appt);

    const data = appt.googleEventId
      ? await this.googleCalendarRequest(`/calendars/${calendarId}/events/${encodeURIComponent(appt.googleEventId)}`, {
          method: 'PATCH',
          body: JSON.stringify(payload)
        }, interactive)
      : await this.googleCalendarRequest(`/calendars/${calendarId}/events`, {
          method: 'POST',
          body: JSON.stringify(payload)
        }, interactive);

    if (data?.id) {
      appt.googleEventId = data.id;
      this.saveStore();
      if (this.db) this.syncAppointmentToCloud(appt);
    }
  }

  async deleteGoogleEventForAppointment(appt, { interactive = false } = {}) {
    if (!appt || !appt.googleEventId || !this.googleCalendar.clientId) return;
    if (!interactive && !this.isGoogleCalendarConnected()) return;

    const calendarId = encodeURIComponent(this.googleCalendar.calendarId || 'primary');
    await this.googleCalendarRequest(`/calendars/${calendarId}/events/${encodeURIComponent(appt.googleEventId)}`, {
      method: 'DELETE'
    }, interactive);
  }

  async importGoogleCalendarEventsForTopRange() {
    this.saveGoogleCalendarSettingsFromUI();

    const rangeStart = this.startDate || getFirstDayOfMonthStr();
    const rangeEnd = this.endDate || getLastDayOfMonthStr();
    const endExclusive = this.addDays(rangeEnd, 1);

    const calendarId = encodeURIComponent(this.googleCalendar.calendarId || 'primary');
    const params = new URLSearchParams({
      singleEvents: 'true',
      orderBy: 'startTime',
      maxResults: '250',
      timeMin: `${rangeStart}T00:00:00-03:00`,
      timeMax: `${endExclusive}T00:00:00-03:00`
    });

    const payload = await this.googleCalendarRequest(`/calendars/${calendarId}/events?${params.toString()}`, {}, true);
    const items = payload?.items || [];

    let imported = 0;

    items.forEach(event => {
      if (!event?.id) return;
      if (!event.start?.dateTime) return;
      if (this.appointments.some(a => a.googleEventId === event.id)) return;

      const start = new Date(event.start.dateTime);
      if (Number.isNaN(start.getTime())) return;

      const date = formatISODate(start);
      const time = `${String(start.getHours()).padStart(2, '0')}:${String(start.getMinutes()).padStart(2, '0')}`;
      const summary = (event.summary || 'Consulta Google').trim();
      const [namePart, ...restParts] = summary.split(' - ');
      const procedure = restParts.join(' - ') || 'Consulta (Google Agenda)';

      this.appointments.push({
        id: `app-gcal-${event.id}`,
        clientId: '',
        clientName: namePart || 'Cliente Google',
        date,
        time,
        procedure,
        price: 0,
        amountPaid: 0,
        paymentMethod: 'Pix',
        status: 'Agendado',
        paymentStatus: 'Pendente',
        notes: event.description || 'Importado do Google Agenda.',
        color: '#38bdf8',
        googleEventId: event.id
      });
      imported += 1;
    });

    this.saveStore();
    this.render();
    this.showToast(`${imported} evento(s) importado(s) do Google Agenda.`, 'success');
  }

  async syncTopRangeAppointmentsToGoogle() {
    this.saveGoogleCalendarSettingsFromUI();
    const rangeAppointments = this.filterByTopDateRange(this.appointments)
      .filter(appt => normalizeText(appt.status) !== 'cancelado');

    if (rangeAppointments.length === 0) {
      this.showToast('Nenhuma consulta no período para sincronizar.', 'info');
      return;
    }

    let synced = 0;
    for (const appt of rangeAppointments) {
      await this.upsertGoogleEventForAppointment(appt, { interactive: synced === 0 });
      synced += 1;
    }

    this.saveStore();
    this.render();
    this.showToast(`${synced} consulta(s) enviada(s) para o Google Agenda.`, 'success');
  }

  // Sincronização em Tempo Real via Firebase
  initFirebase() {
    const cfgStr = localStorage.getItem('consultorio_firebase_config') || JSON.stringify(FIREBASE_DEFAULT_CONFIG);
    const badge = document.getElementById('cloud-sync-status');
    const text = document.getElementById('cloud-status-text');

    if (typeof firebase === 'undefined') {
      if (badge) badge.className = 'cloud-status-badge offline';
      if (text) text.textContent = 'Modo Local';
      this.updateCloudSyncMeta('Modo local', 'local');
      return;
    }

    try {
      const config = JSON.parse(cfgStr);
      if (!firebase.apps.length) {
        firebase.initializeApp(config);
      }

      this.auth = firebase.auth();
      this.db = firebase.firestore();

      if (this.unsubClients) this.unsubClients();
      if (this.unsubAppointments) this.unsubAppointments();
      if (this.unsubExpenses) this.unsubExpenses();
      if (this.authUnsub) this.authUnsub();

      this.authUnsub = this.auth.onAuthStateChanged(async (user) => {
        if (!user) {
          if (this.localLoginUnlocked) {
            this.showAppShell();
            if (!this.autoCloudAuthTried && !this.autoCloudAuthInProgress) {
              if (badge) badge.className = 'cloud-status-badge offline';
              if (text) text.textContent = 'Conectando Nuvem...';
              this.updateCloudSyncMeta('Tentando conexão automática...', 'local');
              this.tryAutoCloudAuth();
              return;
            }
            if (badge) badge.className = 'cloud-status-badge offline';
            if (text) text.textContent = 'Modo Local';
            this.updateCloudSyncMeta('Modo local', 'local');
            return;
          }

          this.currentUser = null;
          if (this.unsubClients) {
            this.unsubClients();
            this.unsubClients = null;
          }
          if (this.unsubAppointments) {
            this.unsubAppointments();
            this.unsubAppointments = null;
          }
          if (this.unsubExpenses) {
            this.unsubExpenses();
            this.unsubExpenses = null;
          }
          if (badge) badge.className = 'cloud-status-badge offline';
          if (text) text.textContent = 'Aguardando Login';
          this.updateCloudSyncMeta('Aguardando login', 'local');
          this.showLoginScreen();
          return;
        }

        this.currentUser = user;
        this.autoCloudAuthTried = false;
        if (badge) badge.className = 'cloud-status-badge online';
        if (text) text.textContent = 'Nuvem Conectada (Tempo Real)';
        console.log('Usuário autenticado no Firebase:', user.uid);

        try {
          const userDoc = await this.db.collection('usuarios').doc(user.uid).get();
          console.log('Dados do banco:', userDoc.exists ? userDoc.data() : null);
        } catch (err) {
          console.log('Falha ao ler usuarios/{uid}:', err);
        }

        this.showAppShell();

        // Listener em Tempo Real para Clientes
        this.unsubClients = this.db.collection('clients').onSnapshot(snapshot => {
          const cloudClients = snapshot.docs.map(doc => {
            const data = doc.data() || {};
            return { ...data, id: data.id || doc.id };
          });
          this.clients = cloudClients;
          this.saveStore();
          this.render();
          this.updateCloudSyncMeta();
        }, err => console.log('Erro listener clientes:', err));

        // Listener em Tempo Real para Consultas
        this.unsubAppointments = this.db.collection('appointments').onSnapshot(snapshot => {
          const cloudAppointments = snapshot.docs.map(doc => {
            const data = doc.data() || {};
            return { ...data, id: data.id || doc.id };
          });
          this.appointments = cloudAppointments;
          this.saveStore();
          this.render();
          this.updateCloudSyncMeta();
        }, err => console.log('Erro listener consultas:', err));

        // Listener em Tempo Real para Despesas
        this.unsubExpenses = this.db.collection('expenses').onSnapshot(snapshot => {
          const cloudExpenses = snapshot.docs.map(doc => {
            const data = doc.data() || {};
            return { ...data, id: data.id || doc.id };
          });
          this.expenses = cloudExpenses;
          this.saveStore();
          this.render();
          this.updateCloudSyncMeta();
        }, err => console.log('Erro listener despesas:', err));

        this.render();
        this.updateCloudSyncMeta('Conectado, aguardando mudanças...', 'live');
      });

    } catch (e) {
      console.log('Falha ao conectar Firebase:', e);
      if (badge) badge.className = 'cloud-status-badge offline';
      if (text) text.textContent = 'Erro de Conexão Nuvem';
      this.updateCloudSyncMeta('Erro de conexão', 'local');
    }
  }

  async tryAutoCloudAuth() {
    if (!this.auth || typeof this.auth.signInAnonymously !== 'function') {
      this.autoCloudAuthTried = true;
      return false;
    }
    if (this.autoCloudAuthInProgress) return false;

    this.autoCloudAuthInProgress = true;
    try {
      await this.auth.signInAnonymously();
      this.autoCloudAuthTried = false;
      return true;
    } catch (err) {
      console.log('Falha na conexão automática da nuvem:', err);
      this.autoCloudAuthTried = true;
      this.updateCloudSyncMeta('Modo local (nuvem indisponível)', 'local');
      const text = document.getElementById('cloud-status-text');
      const badge = document.getElementById('cloud-sync-status');
      if (badge) badge.className = 'cloud-status-badge offline';
      if (text) text.textContent = 'Modo Local';
      return false;
    } finally {
      this.autoCloudAuthInProgress = false;
    }
  }

  updateCloudSyncMeta(customText = '', mode = 'live') {
    const el = document.getElementById('cloud-sync-last');
    if (!el) return;

    el.classList.remove('live', 'local');
    el.classList.add(mode === 'live' ? 'live' : 'local');

    if (customText) {
      el.textContent = customText;
      return;
    }

    const now = new Date();
    this.lastCloudSyncAt = now.toISOString();
    const time = now.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    el.textContent = `Atualizado ${time}`;
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

  syncExpenseToCloud(expense) {
    if (this.db) {
      this.db.collection('expenses').doc(expense.id).set(expense).catch(err => console.log('Erro cloud expense:', err));
    }
  }

  deleteExpenseFromCloud(expenseId) {
    if (this.db) {
      this.db.collection('expenses').doc(expenseId).delete().catch(err => console.log('Erro delete expense cloud:', err));
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
      this.expenses.forEach(e => this.syncExpenseToCloud(e));
    }

    this.render();
    this.showToast('Dados de demonstração restaurados com sucesso!', 'success');
  }

  // Preenche os campos do topo com as datas e minutos
  initDOM() {
    const startInput = document.getElementById('top-date-start');
    const endInput = document.getElementById('top-date-end');
    const agendaStartInput = document.getElementById('agenda-filter-start');
    const agendaEndInput = document.getElementById('agenda-filter-end');
    const minsInput = document.getElementById('top-reminder-mins');
    const firebaseJsonInput = document.getElementById('cfg-firebase-json');
    const googleClientIdInput = document.getElementById('cfg-google-client-id');
    const googleCalendarIdInput = document.getElementById('cfg-google-calendar-id');

    if (startInput) startInput.value = this.startDate;
    if (endInput) endInput.value = this.endDate;
    if (agendaStartInput) agendaStartInput.value = this.startDate;
    if (agendaEndInput) agendaEndInput.value = this.endDate;
    if (minsInput) minsInput.value = this.reminderMinutes;

    const savedCfg = localStorage.getItem('consultorio_firebase_config');
    const defaultCfgJson = JSON.stringify(FIREBASE_DEFAULT_CONFIG, null, 2);
    if (firebaseJsonInput) {
      firebaseJsonInput.value = savedCfg || defaultCfgJson;
    }
    if (!savedCfg) {
      localStorage.setItem('consultorio_firebase_config', defaultCfgJson);
    }

    if (googleClientIdInput) googleClientIdInput.value = this.googleCalendar.clientId || '';
    if (googleCalendarIdInput) googleCalendarIdInput.value = this.googleCalendar.calendarId || 'primary';
    this.updateGoogleCalendarStatus();

    const anamnesisTemplateInput = document.getElementById('analytics-anamnesis-template');
    if (anamnesisTemplateInput) {
      anamnesisTemplateInput.value = this.getAnamnesisTemplate();
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
            this.expenses.forEach(e => this.syncExpenseToCloud(e));
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
        if (this.unsubExpenses) this.unsubExpenses();
        this.db = null;

        const badge = document.getElementById('cloud-sync-status');
        const text = document.getElementById('cloud-status-text');
        if (badge) badge.className = 'cloud-status-badge offline';
        if (text) text.textContent = 'Modo Local';
        this.updateCloudSyncMeta('Modo local', 'local');

        document.getElementById('cfg-firebase-json').value = '';
        this.showToast('Desconectado da nuvem. O aplicativo voltará ao modo local.', 'info');
      });
    }

    const googleClientIdInput = document.getElementById('cfg-google-client-id');
    const googleCalendarIdInput = document.getElementById('cfg-google-calendar-id');
    const btnGoogleConnect = document.getElementById('btn-google-connect');
    const btnGoogleDisconnect = document.getElementById('btn-google-disconnect');
    const btnGoogleImport = document.getElementById('btn-google-import');
    const btnGoogleSyncRange = document.getElementById('btn-google-sync-range');
    const anamnesisTemplateInput = document.getElementById('analytics-anamnesis-template');
    const btnApplyAnamnesisTemplate = document.getElementById('btn-apply-anamnesis-template');
    const loginForm = document.getElementById('login-form');
    const loginUsernameInput = document.getElementById('login-username');
    const loginPasswordInput = document.getElementById('login-password');
    const loginShowPasswordInput = document.getElementById('login-show-password');

    if (loginShowPasswordInput && loginPasswordInput) {
      loginShowPasswordInput.addEventListener('change', (e) => {
        loginPasswordInput.type = e.target.checked ? 'text' : 'password';
      });
    }

    if (loginForm) {
      loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const errorEl = document.getElementById('login-error');
        const username = (loginUsernameInput?.value || '').trim();
        const password = loginPasswordInput?.value || '';
        const localCreds = getLoginCredentials();

        if (!username || !password) {
          if (errorEl) {
            errorEl.textContent = 'Preencha usuário e senha.';
            errorEl.style.display = 'block';
          }
          return;
        }

        if (username === localCreds.username && password === localCreds.password) {
          this.localLoginUnlocked = true;
          this.currentUser = { uid: 'local-login', displayName: username, email: '' };
          this.showAppShell();
          this.autoCloudAuthTried = false;
          this.tryAutoCloudAuth();
          this.showToast('Acesso liberado com sucesso.', 'success');
          this.render();
          if (errorEl) {
            errorEl.textContent = '';
            errorEl.style.display = 'none';
          }
          return;
        }

        if (!this.auth || typeof this.auth.signInWithEmailAndPassword !== 'function') {
          if (errorEl) {
            errorEl.textContent = 'Usuário ou senha incorretos.';
            errorEl.style.display = 'block';
          }
          return;
        }

        try {
          await this.auth.signInWithEmailAndPassword(username, password);
          if (errorEl) {
            errorEl.textContent = '';
            errorEl.style.display = 'none';
          }
        } catch (err) {
          if (errorEl) {
            errorEl.textContent = err?.message || 'Falha ao entrar.';
            errorEl.style.display = 'block';
          }
        }
      });
    }

    if (anamnesisTemplateInput) {
      anamnesisTemplateInput.addEventListener('change', (e) => {
        this.saveAnamnesisTemplate(e.target.value);
        this.showToast('Modelo de anamnese atualizado.', 'success');
      });
    }

    if (btnApplyAnamnesisTemplate) {
      btnApplyAnamnesisTemplate.addEventListener('click', () => {
        if (!anamnesisTemplateInput) return;
        const templateText = anamnesisTemplateInput.value;
        this.saveAnamnesisTemplate(templateText);

        const clientAnamnesis = document.getElementById('client-anamnesis');
        if (clientAnamnesis) {
          clientAnamnesis.value = templateText;
        }

        this.openClientModal();
        this.showToast('Modelo carregado no cadastro de cliente.', 'success');
      });
    }

    if (googleClientIdInput) {
      googleClientIdInput.addEventListener('change', () => this.saveGoogleCalendarSettingsFromUI());
    }

    if (googleCalendarIdInput) {
      googleCalendarIdInput.addEventListener('change', () => this.saveGoogleCalendarSettingsFromUI());
    }

    if (btnGoogleConnect) {
      btnGoogleConnect.addEventListener('click', async () => {
        try {
          this.saveGoogleCalendarSettingsFromUI();
          await this.ensureGoogleCalendarToken(true);
          this.showToast('Conta Google vinculada com sucesso!', 'success');
          this.updateGoogleCalendarStatus();
        } catch (err) {
          this.showToast(`Falha ao conectar Google Agenda: ${err.message || err}`, 'danger');
        }
      });
    }

    if (btnGoogleDisconnect) {
      btnGoogleDisconnect.addEventListener('click', () => {
        const token = this.googleCalendar.accessToken;
        this.googleCalendar.accessToken = '';
        this.googleCalendar.tokenExpiresAt = 0;
        this.googleCalendar.tokenClient = null;
        if (token && window.google && window.google.accounts && window.google.accounts.oauth2 && window.google.accounts.oauth2.revoke) {
          window.google.accounts.oauth2.revoke(token, () => {});
        }
        this.updateGoogleCalendarStatus();
        this.showToast('Conta Google desconectada.', 'info');
      });
    }

    if (btnGoogleImport) {
      btnGoogleImport.addEventListener('click', async () => {
        try {
          await this.importGoogleCalendarEventsForTopRange();
        } catch (err) {
          this.showToast(`Erro ao importar eventos Google: ${err.message || err}`, 'danger');
        }
      });
    }

    if (btnGoogleSyncRange) {
      btnGoogleSyncRange.addEventListener('click', async () => {
        try {
          await this.syncTopRangeAppointmentsToGoogle();
        } catch (err) {
          this.showToast(`Erro ao enviar consultas para Google: ${err.message || err}`, 'danger');
        }
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
      this.startDate = e.target.value;
      this.render();
      this.showToast(`Filtro atualizado: a partir de ${formatDateBR(this.startDate)}`, 'info');
    });

    document.getElementById('top-date-end').addEventListener('change', (e) => {
      this.endDate = e.target.value;
      this.render();
      this.showToast(`Filtro atualizado: até ${formatDateBR(this.endDate)}`, 'info');
    });

    document.getElementById('btn-reset-top-dates').addEventListener('click', () => {
      this.startDate = getFirstDayOfMonthStr();
      this.endDate = getLastDayOfMonthStr();
      document.getElementById('top-date-start').value = this.startDate;
      document.getElementById('top-date-end').value = this.endDate;
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

    const backButton = document.getElementById('btn-tab-back');
    if (backButton) {
      backButton.addEventListener('click', () => this.goBackTab());
    }

    // Quick Actions Header & Sidebar
    document.getElementById('btn-quick-appointment').addEventListener('click', () => this.openAppointmentModal());
    document.getElementById('btn-header-new-appointment').addEventListener('click', () => this.openAppointmentModal());
    document.getElementById('btn-new-appointment-agenda').addEventListener('click', () => this.openAppointmentModal());
    document.getElementById('btn-logout-session').addEventListener('click', () => this.logoutSession());
    
    document.getElementById('btn-header-new-client').addEventListener('click', () => this.openClientModal());
    document.getElementById('btn-new-client').addEventListener('click', () => this.openClientModal());
    document.getElementById('btn-open-birthdays').addEventListener('click', () => this.openBirthdaysModal());
    document.getElementById('btn-new-expense').addEventListener('click', () => this.openExpenseModal());

    const agendaCompleteButton = document.getElementById('btn-view-agenda-completa');
    if (agendaCompleteButton) {
      agendaCompleteButton.addEventListener('click', () => this.switchTab('agenda'));
    }

    const financeiroAllButton = document.getElementById('btn-view-financeiro-tudo');
    if (financeiroAllButton) {
      financeiroAllButton.addEventListener('click', () => {
        this.switchTab('financeiro');
        this.finFilter = 'todos';
        document.querySelectorAll('[data-fin-filter]').forEach(b => b.classList.remove('active'));
        const button = document.querySelector('[data-fin-filter="todos"]');
        if (button) button.classList.add('active');
        this.renderFinanceiroTable();
      });
    }

    const setActiveDashboardCard = (activeCard) => {
      document.querySelectorAll('.stat-card').forEach(card => card.classList.remove('active'));
      if (activeCard) activeCard.classList.add('active');
    };

    const finCardTotal = document.getElementById('fin-stat-total');
    if (finCardTotal) {
      finCardTotal.closest('.fin-card').addEventListener('click', () => {
        this.switchTab('financeiro');
        this.finFilter = 'todos';
        document.querySelectorAll('[data-fin-filter]').forEach(b => b.classList.remove('active'));
        const button = document.querySelector('[data-fin-filter="todos"]');
        if (button) button.classList.add('active');
        this.renderFinanceiroTable();
      });
    }

    const finCardReceived = document.getElementById('fin-stat-received');
    if (finCardReceived) {
      finCardReceived.closest('.fin-card').addEventListener('click', () => {
        this.switchTab('financeiro');
        this.finFilter = 'pago';
        document.querySelectorAll('[data-fin-filter]').forEach(b => b.classList.remove('active'));
        const button = document.querySelector('[data-fin-filter="pago"]');
        if (button) button.classList.add('active');
        this.renderFinanceiroTable();
      });
    }

    const finCardPending = document.getElementById('fin-stat-pending');
    if (finCardPending) {
      finCardPending.closest('.fin-card').addEventListener('click', () => {
        this.switchTab('financeiro');
        this.finFilter = 'pendente';
        document.querySelectorAll('[data-fin-filter]').forEach(b => b.classList.remove('active'));
        const button = document.querySelector('[data-fin-filter="pendente"]');
        if (button) button.classList.add('active');
        this.renderFinanceiroTable();
      });
    }

    const dashConsultasCard = document.getElementById('dash-card-consultas');
    if (dashConsultasCard) {
      dashConsultasCard.addEventListener('click', () => {
        setActiveDashboardCard(dashConsultasCard);
        this.switchTab('agenda');
      });
      dashConsultasCard.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setActiveDashboardCard(dashConsultasCard);
          this.switchTab('agenda');
        }
      });
    }

    const dashRecebidoCard = document.getElementById('dash-card-recebido');
    if (dashRecebidoCard) {
      const setReceivedFilter = () => {
        setActiveDashboardCard(dashRecebidoCard);
        this.switchTab('financeiro');
        this.finFilter = 'pago';
        document.querySelectorAll('[data-fin-filter]').forEach(b => b.classList.remove('active'));
        const button = document.querySelector('[data-fin-filter="pago"]');
        if (button) button.classList.add('active');
        this.renderFinanceiroTable();
      };

      dashRecebidoCard.addEventListener('click', setReceivedFilter);
      dashRecebidoCard.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setReceivedFilter();
        }
      });
    }

    const dashPendenteCard = document.getElementById('dash-card-pendente');
    if (dashPendenteCard) {
      const setPendenteFilter = () => {
        setActiveDashboardCard(dashPendenteCard);
        this.switchTab('financeiro');
        this.finFilter = 'pendente';
        document.querySelectorAll('[data-fin-filter]').forEach(b => b.classList.remove('active'));
        const button = document.querySelector('[data-fin-filter="pendente"]');
        if (button) button.classList.add('active');
        this.renderFinanceiroTable();
      };

      dashPendenteCard.addEventListener('click', setPendenteFilter);
      dashPendenteCard.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setPendenteFilter();
        }
      });
    }

    const dashResultadoCard = document.getElementById('dash-card-resultado');
    if (dashResultadoCard) {
      const goFinanceiro = () => {
        setActiveDashboardCard(dashResultadoCard);
        this.switchTab('financeiro');
      };

      dashResultadoCard.addEventListener('click', goFinanceiro);
      dashResultadoCard.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          goFinanceiro();
        }
      });
    }

    const dashClientesCard = document.getElementById('dash-card-clientes');
    if (dashClientesCard) {
      dashClientesCard.addEventListener('click', () => {
        this.switchTab('clientes');
      });
      dashClientesCard.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.switchTab('clientes');
        }
      });
    }

    // Client Form Submit
    document.getElementById('form-client').addEventListener('submit', (e) => {
      e.preventDefault();
      this.saveClientForm();
    });

    document.getElementById('btn-cancel-client').addEventListener('click', () => this.closeClientModal());
    document.getElementById('btn-close-client').addEventListener('click', () => this.closeClientModal());
    document.getElementById('btn-close-birthdays').addEventListener('click', () => this.closeBirthdaysModal());
    document.getElementById('btn-close-birthdays-footer').addEventListener('click', () => this.closeBirthdaysModal());
    document.getElementById('btn-birthdays-apply-filter').addEventListener('click', () => {
      const startInput = document.getElementById('birthdays-start-date');
      const endInput = document.getElementById('birthdays-end-date');
      const advanceInput = document.getElementById('birthdays-advance-days');
      this.saveBirthdayReminderDaysAhead(advanceInput?.value ?? 0);
      this.saveBirthdayRangeFilter(startInput?.value || '', endInput?.value || '');
      this.renderBirthdaysModalTable();
    });
    document.getElementById('btn-birthdays-clear-filter').addEventListener('click', () => {
      const startInput = document.getElementById('birthdays-start-date');
      const endInput = document.getElementById('birthdays-end-date');
      const advanceInput = document.getElementById('birthdays-advance-days');
      if (startInput) startInput.value = '';
      if (endInput) endInput.value = '';
      if (advanceInput) {
        advanceInput.value = '0';
        this.saveBirthdayReminderDaysAhead(0);
      }
      this.saveBirthdayRangeFilter('', '');
      this.renderBirthdaysModalTable();
    });
    document.getElementById('btn-birthdays-send-all').addEventListener('click', () => this.sendSelectedBirthdayMessages());
    document.getElementById('btn-birthdays-send-all-whatsapp').addEventListener('click', () => this.sendBirthdayMessagesForAllToday());
    const birthdaysAdvanceInput = document.getElementById('birthdays-advance-days');
    if (birthdaysAdvanceInput) {
      birthdaysAdvanceInput.value = String(this.getBirthdayReminderDaysAhead());
      birthdaysAdvanceInput.addEventListener('input', (e) => {
        this.saveBirthdayReminderDaysAhead(e.target.value);
        this.renderBirthdaysModalTable();
      });
      birthdaysAdvanceInput.addEventListener('change', (e) => {
        this.saveBirthdayReminderDaysAhead(e.target.value);
      });
      birthdaysAdvanceInput.addEventListener('blur', (e) => {
        this.saveBirthdayReminderDaysAhead(e.target.value);
      });
    }

    const cepInput = document.getElementById('client-cep');
    if (cepInput) {
      cepInput.addEventListener('blur', () => this.applyClientAddressFromCep());
    }

    const birthPlaceInput = document.getElementById('client-birth-place');
    if (birthPlaceInput) {
      birthPlaceInput.addEventListener('change', (e) => {
        this.populateBirthCityOptions(e.target.value || '', '');
      });
    }

    const cpfInput = document.getElementById('client-cpf');
    if (cpfInput) {
      cpfInput.addEventListener('input', (e) => {
        e.target.value = this.formatCpfMask(e.target.value);
      });
    }

    const phoneInput = document.getElementById('client-phone');
    if (phoneInput) {
      phoneInput.addEventListener('input', (e) => {
        e.target.value = this.formatPhoneMask(e.target.value);
      });
    }

    const guardianPhoneInput = document.getElementById('client-guardian-phone');
    if (guardianPhoneInput) {
      guardianPhoneInput.addEventListener('input', (e) => {
        e.target.value = this.formatPhoneMask(e.target.value);
      });
    }

    const rgInput = document.getElementById('client-rg');
    if (rgInput) {
      rgInput.addEventListener('input', (e) => {
        e.target.value = this.formatRgMask(e.target.value);
      });
    }

    const guardianRgInput = document.getElementById('client-guardian-rg');
    if (guardianRgInput) {
      guardianRgInput.addEventListener('input', (e) => {
        e.target.value = this.formatRgMask(e.target.value);
      });
    }

    const guardianCpfInput = document.getElementById('client-guardian-cpf');
    if (guardianCpfInput) {
      guardianCpfInput.addEventListener('input', (e) => {
        e.target.value = this.formatCpfMask(e.target.value);
      });
    }

    const appointmentApproachSelect = document.getElementById('appt-procedure');
    if (appointmentApproachSelect) {
      appointmentApproachSelect.addEventListener('change', () => this.syncAppointmentPriceFromApproach());
    }

    const btnAddApproach = document.getElementById('btn-add-approach');
    if (btnAddApproach) {
      btnAddApproach.addEventListener('click', () => this.promptAppointmentApproach());
    }

    const btnManageApproaches = document.getElementById('btn-manage-approaches');
    if (btnManageApproaches) {
      btnManageApproaches.addEventListener('click', () => {
        const select = document.getElementById('appt-procedure');
        const currentName = select?.value || '';
        const currentApproach = this.appointmentApproaches.find(option => option.name === currentName) || null;
        if (!currentApproach) {
          this.showToast('Selecione uma abordagem para editar.', 'info');
          return;
        }
        this.promptAppointmentApproach(currentApproach);
      });
    }

    if (cepInput) {
      cepInput.addEventListener('input', (e) => {
        e.target.value = this.formatCepMask(e.target.value);
        const cepDigits = String(e.target.value || '').replace(/\D/g, '');
        if (cepDigits.length < 8) {
          this.lastCepLookup = '';
          return;
        }
        if (this.lastCepLookup === cepDigits) return;
        this.lastCepLookup = cepDigits;
        this.applyClientAddressFromCep();
      });
    }

    const clientDetailInfo = document.getElementById('client-detail-info-box');
    if (clientDetailInfo) {
      clientDetailInfo.addEventListener('click', (event) => {
        const toggleBtn = event.target.closest('[data-anamnesis-toggle]');
        if (!toggleBtn) return;

        const card = toggleBtn.closest('[data-anamnesis-card]');
        if (!card) return;

        const answerBox = card.querySelector('[data-anamnesis-answer]');
        if (!answerBox) return;

        const willOpen = answerBox.classList.contains('anamnesis-question-body-hidden');
        answerBox.classList.toggle('anamnesis-question-body-hidden', !willOpen);
        toggleBtn.textContent = willOpen ? 'Ocultar resposta' : 'Ver resposta';
      });
    }

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

    document.addEventListener('click', (e) => {
      const menuWrap = document.getElementById('session-status-wrap');
      if (menuWrap && !menuWrap.contains(e.target)) {
        this.closeSessionStatusMenu();
      }
    });

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
    document.getElementById('agenda-filter-start').addEventListener('change', () => {
      this.agendaCalendarOffset = 0;
      this.renderAgendaTable();
    });
    document.getElementById('agenda-filter-end').addEventListener('change', () => {
      this.agendaCalendarOffset = 0;
      this.renderAgendaTable();
    });
    document.getElementById('agenda-filter-status').addEventListener('change', () => this.renderAgendaTable());
    document.getElementById('btn-agenda-view-calendar').addEventListener('click', () => {
      this.agendaView = 'calendar';
      document.getElementById('btn-agenda-view-calendar').classList.add('active');
      document.getElementById('btn-agenda-view-list').classList.remove('active');
      this.renderAgendaTable();
    });
    document.getElementById('btn-agenda-view-list').addEventListener('click', () => {
      this.agendaView = 'list';
      document.getElementById('btn-agenda-view-list').classList.add('active');
      document.getElementById('btn-agenda-view-calendar').classList.remove('active');
      this.renderAgendaTable();
    });

    const btnAgendaPrev = document.getElementById('btn-agenda-prev');
    if (btnAgendaPrev) {
      btnAgendaPrev.addEventListener('click', () => {
        this.shiftAgendaCalendarWindow(-7);
      });
    }

    const btnAgendaNext = document.getElementById('btn-agenda-next');
    if (btnAgendaNext) {
      btnAgendaNext.addEventListener('click', () => {
        this.shiftAgendaCalendarWindow(7);
      });
    }

    document.getElementById('clientes-search').addEventListener('input', () => this.renderClientsTable());
    document.getElementById('clientes-phone-filter').addEventListener('change', () => this.renderClientsTable());
    // Combobox (searchable client selector) interactions inside appointment modal
    const apptCombobox = document.getElementById('appt-client-combobox');
    const apptList = document.getElementById('appt-client-list');
    const apptWrap = document.getElementById('appt-client-combobox-wrap');
    if (apptCombobox && apptList) {
      const updateVisibleAndSelectFirst = () => {
        const q = (apptCombobox.value || '').toLowerCase();
        apptList.style.display = 'block';
        const children = Array.from(apptList.children);
        children.forEach(item => {
          const txt = item.textContent.toLowerCase();
          item.style.display = txt.includes(q) ? '' : 'none';
          item.classList.remove('active');
        });
        const visible = children.filter(i => i.style.display !== 'none');
        if (visible.length > 0) {
          visible[0].classList.add('active');
          apptList._activeIndex = 0;
          visible[0].scrollIntoView({ block: 'nearest' });
        } else {
          apptList._activeIndex = -1;
        }
      };

      apptCombobox.addEventListener('input', updateVisibleAndSelectFirst);

      apptCombobox.addEventListener('focus', () => {
        updateVisibleAndSelectFirst();
      });

      apptCombobox.addEventListener('keydown', (e) => {
        const visible = Array.from(apptList.children).filter(i => i.style.display !== 'none');
        let idx = typeof apptList._activeIndex === 'number' ? apptList._activeIndex : -1;

        const setActive = (newIdx) => {
          visible.forEach((it, i) => it.classList.toggle('active', i === newIdx));
          apptList._activeIndex = newIdx;
          if (visible[newIdx]) visible[newIdx].scrollIntoView({ block: 'nearest' });
        };

        if (e.key === 'Escape') {
          apptList.style.display = 'none';
          apptList._activeIndex = -1;
          visible.forEach(it => it.classList.remove('active'));
          return;
        }

        if (e.key === 'ArrowDown') {
          e.preventDefault();
          if (visible.length === 0) return;
          idx = Math.min(idx + 1, visible.length - 1);
          setActive(idx);
          return;
        }

        if (e.key === 'ArrowUp') {
          e.preventDefault();
          if (visible.length === 0) return;
          idx = Math.max(idx - 1, 0);
          setActive(idx);
          return;
        }

        if (e.key === 'Enter') {
          if (idx >= 0 && visible[idx]) {
            visible[idx].click();
            e.preventDefault();
          }
        }
      });

      document.addEventListener('click', (e) => {
        if (apptWrap && !apptWrap.contains(e.target)) {
          apptList.style.display = 'none';
        }
      });
    }

    const financeSearchInput = document.getElementById('financeiro-search');
    if (financeSearchInput) {
      const triggerFinanceSearch = () => this.renderFinanceiroTable();
      financeSearchInput.addEventListener('input', triggerFinanceSearch);
      financeSearchInput.addEventListener('keyup', triggerFinanceSearch);

      const financeSearchIcon = document.querySelector('#tab-financeiro .input-icon i');
      if (financeSearchIcon) {
        financeSearchIcon.style.cursor = 'pointer';
        financeSearchIcon.addEventListener('click', () => {
          financeSearchInput.focus();
          this.renderFinanceiroTable();
        });
      }
    }

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
    document.getElementById('btn-print-client-anamnesis').addEventListener('click', () => this.printCurrentClientAnamnesis());
    document.getElementById('btn-report-paciente').addEventListener('click', () => this.generateReport('paciente'));
    document.getElementById('btn-report-receitas').addEventListener('click', () => this.generateReport('receitas'));
    document.getElementById('btn-report-financeiro').addEventListener('click', () => this.generateReport('financeiro'));
    document.getElementById('btn-report-despesas').addEventListener('click', () => this.generateReport('despesas'));
    const reportPatientIndividualBtn = document.getElementById('btn-report-patient-individual');
    if (reportPatientIndividualBtn) {
      reportPatientIndividualBtn.addEventListener('click', () => this.generateIndividualPatientReportFromSearch());
    }

    const printPatientIndividualBtn = document.getElementById('btn-print-patient-individual');
    if (printPatientIndividualBtn) {
      printPatientIndividualBtn.addEventListener('click', () => this.printIndividualPatientReportFromSearch());
    }

    const reportPatientSearchInput = document.getElementById('report-patient-search');
    if (reportPatientSearchInput) {
      reportPatientSearchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          this.generateIndividualPatientReportFromSearch();
        }
      });
    }

    const reportBirthdaysButton = document.getElementById('btn-report-aniversarios');
    if (reportBirthdaysButton) {
      reportBirthdaysButton.addEventListener('click', () => this.generateReport('aniversarios'));
    }
    document.getElementById('btn-copy-report').addEventListener('click', () => this.copyReport());
    document.getElementById('btn-print-report').addEventListener('click', () => this.printReport());
    document.getElementById('whatsapp-template-select').addEventListener('change', (e) => this.selectWhatsAppTemplate(e.target.value));
    document.getElementById('btn-whatsapp-template-new').addEventListener('click', () => this.newWhatsAppTemplateDraft());
    document.getElementById('btn-save-whatsapp-template').addEventListener('click', () => this.saveWhatsAppTemplate());
    document.getElementById('btn-update-whatsapp-template').addEventListener('click', () => this.updateWhatsAppTemplate());
    document.getElementById('btn-duplicate-whatsapp-template').addEventListener('click', () => this.duplicateWhatsAppTemplate());
    document.getElementById('btn-delete-whatsapp-template').addEventListener('click', () => this.deleteWhatsAppTemplate());
    document.getElementById('btn-reset-whatsapp-template').addEventListener('click', () => this.resetWhatsAppTemplate());
    document.getElementById('btn-close-whatsapp-send').addEventListener('click', () => this.closeWhatsAppSendModal());
    document.getElementById('btn-cancel-whatsapp-send').addEventListener('click', () => this.closeWhatsAppSendModal());
    document.getElementById('btn-confirm-whatsapp-send').addEventListener('click', () => this.confirmWhatsAppSendModal());
    document.getElementById('ws-send-template-search').addEventListener('input', () => this.filterWhatsAppSendTemplates());
    document.getElementById('ws-send-template-select').addEventListener('change', () => this.updateWhatsAppSendPreview());
    document.getElementById('form-change-password').addEventListener('submit', (e) => {
      e.preventDefault();
      this.changeLoginPassword();
    });
    document.getElementById('btn-clear-password-form').addEventListener('click', () => {
      const form = document.getElementById('form-change-password');
      if (form) form.reset();
    });
    document.getElementById('btn-reset-demo').addEventListener('click', () => {
      if (confirm('Tem certeza que deseja restaurar os dados originais de demonstração? Seus registros atuais serão substituídos.')) {
        this.resetDemoData();
      }
    });

    document.addEventListener('change', (e) => {
      if (e.target && e.target.matches('.birthday-row-select')) {
        this.syncBirthdaySelectAllCheckbox();
      }
      if (e.target && e.target.id === 'birthdays-select-all') {
        const checked = e.target.checked;
        document.querySelectorAll('.birthday-row-select').forEach(input => {
          input.checked = checked;
        });
        this.syncBirthdaySelectAllCheckbox();
      }
    });
  }

  formatCpfMask(value) {
    const digits = String(value || '').replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
    if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
  }

  formatPhoneMask(value) {
    const digits = String(value || '').replace(/\D/g, '').slice(0, 11);
    if (!digits) return '';

    if (digits.length <= 2) {
      return `(${digits}`;
    }

    if (digits.length <= 6) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    }

    if (digits.length <= 10) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    }

    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }

  formatRgMask(value) {
    const digits = String(value || '').replace(/\D/g, '').slice(0, 10);
    if (digits.length <= 2) return digits;
    if (digits.length <= 5) return `${digits.slice(0, 2)}.${digits.slice(2)}`;
    if (digits.length <= 8) return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5)}`;
    return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}-${digits.slice(8)}`;
  }

  formatCepMask(value) {
    const digits = String(value || '').replace(/\D/g, '').slice(0, 8);
    if (digits.length <= 5) return digits;
    return `${digits.slice(0, 5)}-${digits.slice(5)}`;
  }

  async applyClientAddressFromCep() {
    const cepInput = document.getElementById('client-cep');
    if (!cepInput) return;

    const rawCep = String(cepInput.value || '');
    const cep = rawCep.replace(/\D/g, '');
    if (cep.length !== 8) return;

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      if (!response.ok) return;

      const data = await response.json();
      if (!data || data.erro) {
        this.showToast('CEP nao encontrado.', 'warning');
        return;
      }

      const cityInput = document.getElementById('client-city');
      const stateInput = document.getElementById('client-state');
      const countryInput = document.getElementById('client-country');
      const addressInput = document.getElementById('client-address');
      const neighborhoodInput = document.getElementById('client-neighborhood');
      const complementInput = document.getElementById('client-address-complement');

      if (cityInput) cityInput.value = data.localidade || cityInput.value;
      if (stateInput) stateInput.value = data.uf || stateInput.value;
      if (countryInput) countryInput.value = 'Brasil';
      if (addressInput) addressInput.value = data.logradouro || addressInput.value;
      if (neighborhoodInput) neighborhoodInput.value = data.bairro || neighborhoodInput.value;
      if (complementInput) complementInput.value = data.complemento || complementInput.value;

      this.showToast('Endereco preenchido automaticamente pelo CEP.', 'success');
    } catch (err) {
      this.showToast('Nao foi possivel consultar o CEP agora.', 'warning');
    }
  }

  async populateBirthCityOptions(stateCode, selectedCity = '') {
    const citySelect = document.getElementById('client-birth-city');
    if (!citySelect) return;

    const normalizedState = String(stateCode || '').trim().toUpperCase();
    const safeSelectedCity = String(selectedCity || '').trim();

    if (!normalizedState) {
      citySelect.innerHTML = '<option value="">Selecione o estado primeiro</option>';
      citySelect.value = '';
      citySelect.disabled = true;
      return;
    }

    if (normalizedState === 'EX') {
      citySelect.disabled = false;
      citySelect.innerHTML = '<option value="">Selecione</option><option value="Exterior">Exterior</option>';
      citySelect.value = safeSelectedCity || 'Exterior';
      return;
    }

    this.birthCitiesByStateCache = this.birthCitiesByStateCache || {};

    const renderOptions = (cities) => {
      citySelect.innerHTML = '<option value="">Selecione a cidade</option>';
      cities.forEach((cityName) => {
        const option = document.createElement('option');
        option.value = cityName;
        option.textContent = cityName;
        citySelect.appendChild(option);
      });
      if (safeSelectedCity && !cities.includes(safeSelectedCity)) {
        const customOption = document.createElement('option');
        customOption.value = safeSelectedCity;
        customOption.textContent = safeSelectedCity;
        citySelect.appendChild(customOption);
      }
      citySelect.value = safeSelectedCity;
      citySelect.disabled = false;
    };

    if (Array.isArray(this.birthCitiesByStateCache[normalizedState])) {
      renderOptions(this.birthCitiesByStateCache[normalizedState]);
      return;
    }

    citySelect.disabled = true;
    citySelect.innerHTML = '<option value="">Carregando cidades...</option>';

    try {
      const response = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${normalizedState}/municipios`);
      if (!response.ok) {
        throw new Error('Falha ao buscar cidades');
      }

      const data = await response.json();
      const cities = Array.isArray(data)
        ? data
            .map((item) => String(item?.nome || '').trim())
            .filter(Boolean)
            .sort((a, b) => a.localeCompare(b, 'pt-BR'))
        : [];

      this.birthCitiesByStateCache[normalizedState] = cities;
      renderOptions(cities);
    } catch (err) {
      citySelect.disabled = false;
      citySelect.innerHTML = '<option value="">Nao foi possivel carregar cidades</option>';
      citySelect.value = '';
      this.showToast('Nao foi possivel carregar as cidades deste estado.', 'warning');
    }
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
  switchTab(tabId, { skipHistory = false } = {}) {
    if (tabId === this.activeTab) return;

    if (tabId !== 'graficos' && this.analyticsFocusMode) {
      this.analyticsFocusMode = false;
    }

    if (!skipHistory && this.activeTab) {
      this.tabHistory.push(this.activeTab);
    }

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
      whatsapp: { title: 'WhatsApp', sub: 'Personalize o texto de envio para os clientes' },
      senha: { title: 'Senha', sub: 'Altere a senha de acesso ao sistema' },
      graficos: { title: 'Gráficos', sub: 'Visualize atendimentos, receitas e despesas no período' },
      config: { title: 'Configurações', sub: 'Backup, nuvem e preferências do sistema' }
    };

    if (titles[tabId]) {
      document.getElementById('page-title').textContent = titles[tabId].title;
      document.getElementById('page-subtitle').textContent = titles[tabId].sub;
    }

    const backButton = document.getElementById('btn-tab-back');
    if (backButton) {
      backButton.style.display = this.tabHistory.length > 0 ? 'inline-flex' : 'none';
    }

    this.render();
  }

  goBackTab() {
    if (this.tabHistory.length === 0) return;
    const previousTab = this.tabHistory.pop();
    this.switchTab(previousTab, { skipHistory: true });
  }

  // Renderização Geral
  render() {
    this.updateBadges();
    this.updateBirthdaysNotificationBadge();
    this.renderDashboard();
    this.renderAgendaTable();
    this.renderClientsTable();
    this.renderFinanceiroTable();
    this.renderDespesasTable();
    this.renderPasswordTab();
    this.renderAnalyticsTab();
    this.populateClientSelectOptions();
    this.renderWhatsAppTemplateEditor();
    this.populateReportPatientSearchOptions();

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  populateReportPatientSearchOptions() {
    const datalist = document.getElementById('report-patient-options');
    if (!datalist) return;

    const sorted = [...this.clients].sort((a, b) => String(a.name || '').localeCompare(String(b.name || '')));
    datalist.innerHTML = sorted.map(cli => {
      const number = cli.registrationNumber ? `ID ${cli.registrationNumber}` : 'Sem ID';
      const phone = cli.phone || '-';
      return `<option value="${escapeHtml(cli.name || '')}" label="${escapeHtml(`${number} | ${phone}`)}"></option>`;
    }).join('');
  }

  findClientByReportSearchTerm(rawTerm) {
    const term = String(rawTerm || '').trim();
    if (!term) return null;

    const normalizedTerm = normalizeText(term);
    const digitsTerm = term.replace(/\D/g, '');

    const exactName = this.clients.find(cli => normalizeText(cli.name || '') === normalizedTerm);
    if (exactName) return exactName;

    const byRegistration = this.clients.find(cli => String(cli.registrationNumber || '') === term || String(cli.registrationNumber || '') === digitsTerm);
    if (byRegistration) return byRegistration;

    const byPhoneOrCpf = this.clients.find(cli => {
      const phoneDigits = String(cli.phone || '').replace(/\D/g, '');
      const cpfDigits = String(cli.cpf || '').replace(/\D/g, '');
      return Boolean(digitsTerm) && (phoneDigits.includes(digitsTerm) || cpfDigits.includes(digitsTerm));
    });
    if (byPhoneOrCpf) return byPhoneOrCpf;

    return this.clients.find(cli => normalizeText(cli.name || '').includes(normalizedTerm)) || null;
  }

  generateIndividualPatientReportFromSearch() {
    const input = document.getElementById('report-patient-search');
    const output = document.getElementById('report-output');
    if (!input || !output) return;

    const cli = this.findClientByReportSearchTerm(input.value);
    if (!cli) {
      this.showToast('Paciente não encontrado. Informe nome, telefone ou ID.', 'warning');
      return;
    }

    const report = this.buildIndividualPatientReportText(cli);
    output.value = report;
    this.showToast(`Relatório individual gerado para ${cli.name}.`, 'success');
  }

  buildIndividualPatientReportText(cli) {
    const rangeApps = this.filterByTopDateRange(this.appointments);
    const clientAppts = rangeApps
      .filter(a => a.clientId === cli.id)
      .sort((a, b) => b.date.localeCompare(a.date) || String(b.time || '').localeCompare(String(a.time || '')));

    const totalReceived = clientAppts.reduce((sum, a) => sum + (parseFloat(a.amountPaid) || 0), 0);
    const totalDue = clientAppts.reduce((sum, a) => sum + Math.max(0, (parseFloat(a.price) || 0) - (parseFloat(a.amountPaid) || 0)), 0);

    let report = `RELATÓRIO INDIVIDUAL: ${cli.name}\n`;
    report += `Período: ${formatDateBR(this.startDate)} a ${formatDateBR(this.endDate)}\n`;
    report += `ID: ${cli.registrationNumber || '-'} | Telefone: ${cli.phone || '-'} | E-mail: ${cli.email || '-'}\n`;
    report += `CPF: ${cli.cpf || '-'} | Data de nascimento: ${cli.dob ? formatDateBR(cli.dob) : '-'}\n\n`;

    if (!clientAppts.length) {
      report += 'Nenhuma consulta registrada para este paciente no período selecionado.';
    } else {
      report += 'Consultas no período:\n';
      report += clientAppts.map(a => {
        return `${formatDateBR(a.date)} ${a.time} | ${a.procedure} | Valor: ${formatCurrency(a.price)} | Pago: ${formatCurrency(a.amountPaid)} | Status: ${a.paymentStatus}`;
      }).join('\n');
      report += `\n\nTotal recebido: ${formatCurrency(totalReceived)}\nTotal em aberto: ${formatCurrency(totalDue)}`;
    }

    return report;
  }

  printIndividualPatientReportFromSearch() {
    const input = document.getElementById('report-patient-search');
    if (!input) return;

    const cli = this.findClientByReportSearchTerm(input.value);
    if (!cli) {
      this.showToast('Paciente não encontrado. Informe nome, telefone ou ID.', 'warning');
      return;
    }

    const report = this.buildIndividualPatientReportText(cli);
    this._printTextWindow(`Relatório - ${cli.name}`, report);
    this.showToast(`Impressão individual preparada para ${cli.name}.`, 'success');
  }

  renderPasswordTab() {
    const userEl = document.getElementById('senha-current-user');
    if (!userEl) return;
    const creds = getLoginCredentials();
    userEl.textContent = creds.username || LOGIN_DEFAULT_USERNAME;
  }

  showLoginScreen(message = '') {
    const loginScreen = document.getElementById('login-screen');
    const appShell = document.getElementById('app-shell');
    const errorEl = document.getElementById('login-error');
    const passwordInput = document.getElementById('login-password');
    const showPasswordInput = document.getElementById('login-show-password');

    if (loginScreen) loginScreen.classList.remove('app-hidden');
    if (appShell) appShell.classList.add('app-hidden');
    if (passwordInput) passwordInput.value = '';
    if (passwordInput) passwordInput.type = 'password';
    if (showPasswordInput) showPasswordInput.checked = false;
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
    if (errorEl) {
      errorEl.textContent = '';
      errorEl.style.display = 'none';
    }
  }

  changeLoginPassword() {
    const currentInput = document.getElementById('senha-current');
    const newInput = document.getElementById('senha-new');
    const confirmInput = document.getElementById('senha-confirm');
    const form = document.getElementById('form-change-password');

    if (!currentInput || !newInput || !confirmInput) return;

    const currentPassword = currentInput.value || '';
    const newPassword = newInput.value || '';
    const confirmPassword = confirmInput.value || '';
    const creds = getLoginCredentials();

    if (currentPassword !== creds.password) {
      this.showToast('Senha atual incorreta.', 'warning');
      return;
    }

    if (newPassword.length < 6) {
      this.showToast('A nova senha deve ter pelo menos 6 caracteres.', 'warning');
      return;
    }

    if (newPassword !== confirmPassword) {
      this.showToast('A confirmação da nova senha não confere.', 'warning');
      return;
    }

    if (newPassword === currentPassword) {
      this.showToast('A nova senha precisa ser diferente da senha atual.', 'warning');
      return;
    }

    localStorage.setItem(LOGIN_PASSWORD_STORAGE_KEY, newPassword);
    if (!localStorage.getItem(LOGIN_USER_STORAGE_KEY)) {
      localStorage.setItem(LOGIN_USER_STORAGE_KEY, creds.username || LOGIN_DEFAULT_USERNAME);
    }

    if (form) form.reset();
    this.showToast('Senha alterada com sucesso!', 'success');
  }

  logoutSession() {
    if (this.auth && typeof this.auth.signOut === 'function') {
      this.auth.signOut().catch(err => {
        console.log('Erro ao sair do Firebase Auth:', err);
      });
    }
    this.currentUser = null;
    this.localLoginUnlocked = false;
    this.showLoginScreen('Sessão encerrada. Faça login novamente para continuar.');
    this.showToast('Você saiu da sessão.', 'info');
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
    const visibleExpenses = this.expenses.flatMap(exp => this.getExpenseOccurrences(exp, this.startDate, this.endDate));

    const completedInPeriod = new Set(
      this.getPaidFinanceAppointments(rangeApps).map(a => a.clientId || normalizeText(a.clientName))
    ).size;
    document.getElementById('dash-appointments-today').textContent = rangeApps.length;
    document.getElementById('dash-appointments-sub').textContent = `${completedInPeriod} cliente(s) atendido(s) no período`;

    const totalReceived = rangeApps.reduce((sum, a) => sum + (parseFloat(a.amountPaid) || 0), 0);
    const totalExpenses = visibleExpenses.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);
    const netResult = totalReceived - totalExpenses;
    document.getElementById('dash-received-month').textContent = formatCurrency(totalReceived);

    const pendingApps = rangeApps.filter(a => (parseFloat(a.price || 0) - parseFloat(a.amountPaid || 0)) > 0);
    const totalPending = pendingApps.reduce((sum, a) => sum + Math.max(0, (parseFloat(a.price || 0) - parseFloat(a.amountPaid || 0))), 0);
    
    document.getElementById('dash-pending-total').textContent = formatCurrency(totalPending);
    document.getElementById('dash-pending-count').textContent = `${pendingApps.length} cobrança(s) pendente(s) no período`;

    const resultTotalEl = document.getElementById('dash-result-total');
    const resultSubEl = document.getElementById('dash-result-sub');
    const resultCardEl = document.getElementById('dash-card-resultado');
    if (resultTotalEl) resultTotalEl.textContent = formatCurrency(netResult);
    if (resultCardEl) {
      resultCardEl.classList.remove('result-positive', 'result-negative', 'result-neutral');
      if (netResult > 0) {
        resultCardEl.classList.add('result-positive');
      } else if (netResult < 0) {
        resultCardEl.classList.add('result-negative');
      } else {
        resultCardEl.classList.add('result-neutral');
      }
    }
    if (resultSubEl) {
      if (netResult > 0) {
        resultSubEl.textContent = `Superávit de ${formatCurrency(netResult)} no período`;
      } else if (netResult < 0) {
        resultSubEl.textContent = `Déficit de ${formatCurrency(Math.abs(netResult))} no período`;
      } else {
        resultSubEl.textContent = 'Equilíbrio entre receitas e despesas';
      }
    }

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

  // Renderiza a Tabela de Agenda ou Calendário
  renderAgendaTable() {
    const search = document.getElementById('agenda-search').value.toLowerCase();
    const filterStartInput = document.getElementById('agenda-filter-start');
    const filterEndInput = document.getElementById('agenda-filter-end');
    if (filterStartInput && !filterStartInput.value) filterStartInput.value = this.startDate;
    if (filterEndInput && !filterEndInput.value) filterEndInput.value = this.endDate;

    const filterStart = parseDateBR(filterStartInput?.value || this.startDate);
    const filterEnd = parseDateBR(filterEndInput?.value || this.endDate);
    const filterStatus = document.getElementById('agenda-filter-status').value;

    const filtered = this.getFilteredAgendaAppointments(search, filterStart, filterEnd, filterStatus);
    const calendarCard = document.getElementById('agenda-calendar-card');
    const tableCard = document.getElementById('agenda-table-card');

    if (this.agendaView === 'calendar') {
      calendarCard.style.display = 'block';
      tableCard.style.display = 'none';
      this.renderAgendaCalendar(filtered);
    } else {
      calendarCard.style.display = 'none';
      tableCard.style.display = 'block';
      this.renderAgendaList(filtered);
    }
  }

  getFilteredAgendaAppointments(search, filterStart, filterEnd, filterStatus) {
    let filtered = this.filterByTopDateRange(this.appointments);

    if (search) {
      filtered = filtered.filter(a =>
        a.clientName.toLowerCase().includes(search) ||
        a.procedure.toLowerCase().includes(search)
      );
    }

    if (filterStart && filterEnd) {
      filtered = filtered.filter(a => a.date >= filterStart && a.date <= filterEnd);
    } else if (filterStart) {
      filtered = filtered.filter(a => a.date >= filterStart);
    } else if (filterEnd) {
      filtered = filtered.filter(a => a.date <= filterEnd);
    }

    if (filterStatus && filterStatus !== 'todos') {
      filtered = filtered.filter(a => a.status === filterStatus);
    }

    return filtered.sort((a, b) => {
      const dateA = `${a.date} ${a.time}`;
      const dateB = `${b.date} ${b.time}`;
      return dateA.localeCompare(dateB);
    });
  }

  renderAgendaList(filtered) {
    const tbody = document.getElementById('agenda-table-body');

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
      const sessionStatusLabel = app.sessionStatus ? this.getSessionStatusLabel(app.sessionStatus) : '';
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
            ${sessionStatusLabel ? `<div style="margin-top:0.35rem;"><span class="badge badge-session-status">Sessao: ${sessionStatusLabel}</span></div>` : ''}
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

  renderAgendaCalendar(filtered) {
    const grid = document.getElementById('agenda-calendar-grid');
    const rangeLabel = document.getElementById('agenda-calendar-range');
    const filterStartInput = document.getElementById('agenda-filter-start');
    const filterEndInput = document.getElementById('agenda-filter-end');
    const filterStart = parseDateBR(filterStartInput?.value || this.startDate);
    const filterEnd = parseDateBR(filterEndInput?.value || this.endDate);
    let start = filterStart || this.startDate || getTodayStr();
    let end = filterEnd || this.endDate || start;

    if (filterStart && !filterEnd) {
      end = this.addDays(start, 6);
    } else if (!filterStart && filterEnd) {
      start = this.addDays(end, -6);
    }

    const visibleRange = this.getVisibleDaysBetween(start, end);
    const maxOffset = Math.max(0, visibleRange.length - 7);
    this.agendaCalendarOffset = Math.min(Math.max(0, this.agendaCalendarOffset), maxOffset);
    const visibleDays = visibleRange.slice(this.agendaCalendarOffset, this.agendaCalendarOffset + 7);

    if (rangeLabel) {
      if (visibleDays.length > 0) {
        rangeLabel.textContent = `${formatDateBR(visibleDays[0])} até ${formatDateBR(visibleDays[visibleDays.length - 1])}`;
      } else {
        rangeLabel.textContent = 'Sem datas para exibir';
      }
    }

    if (visibleDays.length === 0) {
      grid.style.gridTemplateColumns = '1fr';
      grid.innerHTML = `
        <div class="empty-state">
          <i data-lucide="calendar"></i>
          <h4>Nenhum agendamento encontrado no período</h4>
          <p>Altere o filtro de datas no topo ou realize um novo agendamento.</p>
        </div>
      `;
      return;
    }

    const hours = Array.from({ length: 14 }, (_, idx) => 7 + idx);
    const appointmentMap = {};

    filtered.forEach(app => {
      const hour = parseInt(app.time.split(':')[0], 10);
      const key = `${app.date}-${hour}`;
      appointmentMap[key] = appointmentMap[key] || [];
      appointmentMap[key].push(app);
    });

    const headerCells = visibleDays.map(day => {
      const date = createLocalDateFromISO(day);
      const dayName = date ? date.toLocaleDateString('pt-BR', { weekday: 'short' }) : '';
      return `
        <div class="agenda-header">
          <div>${dayName}</div>
          <div class="agenda-header-date">${formatDateBR(day)}</div>
        </div>
      `;
    }).join('');

    const rows = hours.map(hour => {
      const timeCell = `<div class="agenda-time-axis">${String(hour).padStart(2, '0')}:00</div>`;
      const dayCells = visibleDays.map(day => {
        const key = `${day}-${hour}`;
        const items = appointmentMap[key] || [];
        const content = items.map(app => {
          const color = app.color || '#38bdf8';
          const statusClass = app.paymentStatus.toLowerCase();
          const textColor = getContrastTextColor(color);
          const borderColor = color.length === 7 ? `${color}80` : color;
          const sessionStatusLabel = app.sessionStatus ? this.getSessionStatusLabel(app.sessionStatus) : '';
          return `
            <div class="agenda-event agenda-event-${statusClass}" style="background: ${color}; border-color: ${borderColor}; color: ${textColor};" onclick="app.editAppointment('${app.id}')" title="Editar ${app.clientName} às ${app.time}">
              <button type="button" class="agenda-event-delete" onclick="event.stopPropagation(); app.deleteAppointment('${app.id}')" title="Excluir agendamento">
                &times;
              </button>
              <div class="agenda-event-time">${app.time}</div>
              <div class="agenda-event-title-row">
                <div class="agenda-event-title">${app.clientName}</div>
                <button type="button" class="agenda-event-whatsapp" onclick="event.stopPropagation(); app.sendAppointmentToWhatsApp('${app.id}')" title="Enviar por WhatsApp">
                  <i data-lucide="message-circle"></i>
                </button>
              </div>
              <div class="agenda-event-procedure">${app.procedure}</div>
              <div class="agenda-event-payment">Pagamento: ${app.paymentStatus === 'Pago' ? 'Concluído' : app.paymentStatus === 'Parcial' ? `Parcial (${formatCurrency(app.amountPaid)})` : 'Pendente'}</div>
              ${sessionStatusLabel ? `<div class="agenda-event-session">Sessao: ${sessionStatusLabel}</div>` : ''}
            </div>
          `;
        }).join('');
        return `<div class="agenda-cell">${content}</div>`;
      }).join('');
      return `${timeCell}${dayCells}`;
    }).join('');

    grid.style.gridTemplateColumns = `80px repeat(${visibleDays.length}, minmax(0, 1fr))`;
    grid.innerHTML = `<div class="agenda-header blank"></div>${headerCells}${rows}`;

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div class="agenda-header blank"></div>
        <div class="empty-state" style="grid-column: 1 / -1;">
          <i data-lucide="calendar"></i>
          <h4>Nenhum agendamento encontrado no período</h4>
          <p>Altere o filtro de datas no topo ou realize um novo agendamento.</p>
        </div>
      `;
    }

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  shiftAgendaCalendarWindow(deltaDays) {
    const startInput = document.getElementById('agenda-filter-start');
    const endInput = document.getElementById('agenda-filter-end');
    if (!startInput || !endInput) return;

    const currentStart = parseDateBR(startInput.value || this.startDate);
    const currentEnd = parseDateBR(endInput.value || this.endDate);
    if (!currentStart || !currentEnd) return;

    const visibleRange = this.getVisibleDaysBetween(currentStart, currentEnd);
    const maxOffset = Math.max(0, visibleRange.length - 7);
    const nextOffset = Math.min(Math.max(0, this.agendaCalendarOffset + deltaDays), maxOffset);
    this.agendaCalendarOffset = nextOffset;
    this.renderAgendaTable();
  }

  getVisibleDaysBetween(start, end) {
    const days = [];
    const startDate = createLocalDateFromISO(start);
    const endDate = createLocalDateFromISO(end);
    if (!startDate || !endDate) return days;
    for (let dt = new Date(startDate); dt <= endDate; dt.setDate(dt.getDate() + 1)) {
      const year = dt.getFullYear();
      const month = String(dt.getMonth() + 1).padStart(2, '0');
      const day = String(dt.getDate()).padStart(2, '0');
      days.push(`${year}-${month}-${day}`);
    }
    return days;
  }

  addDays(dateStr, count) {
    const date = createLocalDateFromISO(dateStr);
    if (!date) return dateStr;
    date.setDate(date.getDate() + count);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  isBirthdayToday(dob) {
    if (!dob) return false;
    const iso = String(dob).trim();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return false;
    const today = new Date();
    const [, month, day] = iso.split('-').map(Number);
    return today.getMonth() + 1 === month && today.getDate() === day;
  }

  getTodayBirthdayClients() {
    return this.clients.filter(client => this.isBirthdayToday(client?.dob));
  }

  getBirthdayReminderDaysAhead() {
    const input = document.getElementById('birthdays-advance-days');
    const modal = document.getElementById('modal-birthdays');
    const modalIsActive = Boolean(modal?.classList.contains('active'));
    const storedValue = localStorage.getItem(BIRTHDAY_REMINDER_DAYS_KEY);
    const rawValue = modalIsActive
      ? (input?.value ?? storedValue ?? '0')
      : (storedValue ?? input?.value ?? '0');
    const parsed = parseInt(rawValue, 10);
    return Number.isNaN(parsed) || parsed < 0 ? 0 : Math.min(parsed, 365);
  }

  saveBirthdayReminderDaysAhead(daysAhead) {
    const normalized = Math.max(0, Math.min(parseInt(daysAhead, 10) || 0, 365));
    localStorage.setItem(BIRTHDAY_REMINDER_DAYS_KEY, String(normalized));
    const input = document.getElementById('birthdays-advance-days');
    if (input) input.value = String(normalized);
    return normalized;
  }

  getUpcomingBirthdayClients(daysAhead = 0) {
    const limitDays = Math.max(0, Math.min(parseInt(daysAhead, 10) || 0, 365));
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return this.clients.filter(client => {
      const dob = String(client?.dob || '').trim();
      if (!/^\d{4}-\d{2}-\d{2}$/.test(dob)) return false;

      const [, monthStr, dayStr] = dob.split('-');
      const month = parseInt(monthStr, 10);
      const day = parseInt(dayStr, 10);
      if (!month || !day) return false;

      const nextBirthday = new Date(today);
      nextBirthday.setMonth(month - 1, day);
      if (nextBirthday < today) {
        nextBirthday.setFullYear(today.getFullYear() + 1);
      }

      const diffDays = Math.floor((nextBirthday.getTime() - today.getTime()) / 86400000);
      return diffDays >= 0 && diffDays <= limitDays;
    });
  }

  getNextBirthdayDate(dob) {
    const iso = String(dob || '').trim();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [, monthStr, dayStr] = iso.split('-');
    const month = parseInt(monthStr, 10);
    const day = parseInt(dayStr, 10);
    if (!month || !day) return null;

    const nextBirthday = new Date(today);
    nextBirthday.setMonth(month - 1, day);
    if (nextBirthday < today) {
      nextBirthday.setFullYear(today.getFullYear() + 1);
    }

    return nextBirthday;
  }

  getCurrentBirthdaysFilterRange() {
    const startInput = document.getElementById('birthdays-start-date');
    const endInput = document.getElementById('birthdays-end-date');
    const startDate = startInput?.value || '';
    const endDate = endInput?.value || '';
    return { startDate, endDate };
  }

  getSavedBirthdayRangeFilter() {
    const startDate = localStorage.getItem(BIRTHDAY_FILTER_START_DATE_KEY) || '';
    const endDate = localStorage.getItem(BIRTHDAY_FILTER_END_DATE_KEY) || '';
    return { startDate, endDate };
  }

  saveBirthdayRangeFilter(startDate = '', endDate = '') {
    const normalizedStart = String(startDate || '').trim();
    const normalizedEnd = String(endDate || '').trim();
    localStorage.setItem(BIRTHDAY_FILTER_START_DATE_KEY, normalizedStart);
    localStorage.setItem(BIRTHDAY_FILTER_END_DATE_KEY, normalizedEnd);
    return { startDate: normalizedStart, endDate: normalizedEnd };
  }

  getBirthdayClientsForSavedWarningFilter() {
    const { startDate, endDate } = this.getSavedBirthdayRangeFilter();
    if (startDate || endDate) {
      return this.clients.filter(client => this.birthdayFallsInRange(client?.dob, startDate, endDate));
    }
    return this.getBirthdayReminderClients();
  }

  birthdayFallsInRange(dob, startDate, endDate) {
    if (!dob) return false;
    const iso = String(dob).trim();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return false;

    if (!startDate && !endDate) return true;

    const birth = new Date(iso);
    if (Number.isNaN(birth.getTime())) return false;

    const start = startDate ? new Date(startDate) : new Date(`${birth.getFullYear()}-01-01`);
    const end = endDate ? new Date(endDate) : new Date(`${birth.getFullYear()}-12-31`);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return false;

    const compareYear = 2000;
    const normalizedBirth = new Date(compareYear, birth.getMonth(), birth.getDate());
    const normalizedStart = new Date(compareYear, start.getMonth(), start.getDate());
    const normalizedEnd = new Date(compareYear, end.getMonth(), end.getDate());

    if (normalizedStart <= normalizedEnd) {
      return normalizedBirth >= normalizedStart && normalizedBirth <= normalizedEnd;
    }

    return normalizedBirth >= normalizedStart || normalizedBirth <= normalizedEnd;
  }

  getBirthdayClientsForCurrentFilter() {
    const { startDate, endDate } = this.getCurrentBirthdaysFilterRange();
    if (startDate || endDate) {
      return this.clients.filter(client => this.birthdayFallsInRange(client?.dob, startDate, endDate));
    }

    const reminderDays = this.getBirthdayReminderDaysAhead();
    if (reminderDays > 0) {
      return this.getUpcomingBirthdayClients(reminderDays);
    }

    return this.getTodayBirthdayClients();
  }

  getBirthdayTargetPhone(client) {
    return this.normalizeWhatsAppPhone(client?.phone || client?.guardianPhone || '');
  }

  buildBirthdayMessage(client) {
    const name = client?.name || 'Cliente';
    return `Ola, ${name}!\n\nParabens pelo seu aniversario!\nDesejamos um dia muito especial, com saude, paz e muitas alegrias.\n\nCom carinho,\n${APP_BRAND_NAME}`;
  }

  sendBirthdayMessageToWhatsApp(client) {
    const phone = this.getBirthdayTargetPhone(client);
    if (!phone) {
      this.showToast(`Nao foi possivel enviar para ${client?.name || 'cliente'}: telefone invalido.`, 'warning');
      return false;
    }

    const message = this.buildBirthdayMessage(client);
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener');
    this.showToast(`Mensagem de aniversario pronta para ${client?.name || 'cliente'}.`, 'success');
    return true;
  }

  renderBirthdaysModalTable() {
    const tbody = document.getElementById('birthdays-table-body');
    if (!tbody) return;

    const birthdayClients = this.getBirthdayClientsForCurrentFilter();
    this.updateBirthdaysNotificationBadge();
    if (!birthdayClients.length) {
      tbody.innerHTML = `
        <tr>
          <td colspan="5">
            <div class="empty-state">
              <i data-lucide="cake"></i>
              <h4>Nenhum aniversariante no período</h4>
              <p>Use o filtro de datas para localizar os aniversários cadastrados.</p>
            </div>
          </td>
        </tr>
      `;
      if (window.lucide) window.lucide.createIcons();
      return;
    }

    tbody.innerHTML = birthdayClients.map(client => {
      const phone = this.getBirthdayTargetPhone(client);
      const phoneDisplay = phone ? client.phone || client.guardianPhone || '-' : 'Nao informado';
      return `
        <tr>
          <td style="text-align:center;">
            <input type="checkbox" class="birthday-row-select" data-birthday-id="${escapeHtml(client.id)}" checked>
          </td>
          <td><strong>${escapeHtml(client.name || '-')}</strong></td>
          <td>${client.dob ? formatDateBR(client.dob) : '-'}</td>
          <td>${escapeHtml(phoneDisplay)}</td>
          <td style="text-align: right;">
            <button class="btn btn-sm btn-secondary" onclick="app.sendBirthdayMessageByClientId('${client.id}')">
              <i data-lucide="message-circle"></i> Enviar WhatsApp
            </button>
            <button class="btn btn-sm btn-secondary" onclick="app.editClient('${client.id}')" style="margin-left:0.35rem;">
              <i data-lucide="edit-3"></i> Abrir Cadastro
            </button>
          </td>
        </tr>
      `;
    }).join('');

    if (window.lucide) window.lucide.createIcons();
    this.syncBirthdaySelectAllCheckbox();
  }

  openBirthdaysModal() {
    const startInput = document.getElementById('birthdays-start-date');
    const endInput = document.getElementById('birthdays-end-date');
    const advanceInput = document.getElementById('birthdays-advance-days');
    const savedRange = this.getSavedBirthdayRangeFilter();
    const reminderDays = this.getBirthdayReminderDaysAhead();
    if (advanceInput) advanceInput.value = String(reminderDays);
    if (startInput && savedRange.startDate) startInput.value = savedRange.startDate;
    if (endInput && savedRange.endDate) endInput.value = savedRange.endDate;
    if (reminderDays === 0) {
      const today = getTodayStr();
      const firstDay = `${today.slice(0, 8)}01`;
      const lastDay = `${today.slice(0, 8)}31`;
      if (startInput && !startInput.value) startInput.value = firstDay;
      if (endInput && !endInput.value) endInput.value = lastDay;
    }
    this.renderBirthdaysModalTable();
    const modal = document.getElementById('modal-birthdays');
    if (modal) modal.classList.add('active');
  }

  closeBirthdaysModal() {
    const modal = document.getElementById('modal-birthdays');
    if (modal?.classList.contains('active')) {
      const advanceInput = document.getElementById('birthdays-advance-days');
      this.saveBirthdayReminderDaysAhead(advanceInput?.value ?? 0);
    }
    if (modal) modal.classList.remove('active');
  }

  sendBirthdayMessageByClientId(clientId) {
    const client = this.clients.find(c => c.id === clientId);
    if (!client) {
      this.showToast('Cliente nao encontrado.', 'warning');
      return;
    }
    this.sendBirthdayMessageToWhatsApp(client);
  }

  syncBirthdaySelectAllCheckbox() {
    const master = document.getElementById('birthdays-select-all');
    const rows = Array.from(document.querySelectorAll('.birthday-row-select'));
    if (!master) return;
    if (!rows.length) {
      master.checked = false;
      master.indeterminate = false;
      return;
    }

    const checkedCount = rows.filter(row => row.checked).length;
    master.checked = checkedCount === rows.length;
    master.indeterminate = checkedCount > 0 && checkedCount < rows.length;
  }

  getSelectedBirthdayClients() {
    const selectedIds = Array.from(document.querySelectorAll('.birthday-row-select:checked')).map(input => input.getAttribute('data-birthday-id'));
    return this.clients.filter(client => selectedIds.includes(client.id));
  }

  sendSelectedBirthdayMessages() {
    const selected = this.getSelectedBirthdayClients();
    if (!selected.length) {
      this.showToast('Selecione ao menos um aniversariante.', 'warning');
      return;
    }

    const confirmed = confirm(`Enviar mensagem para ${selected.length} aniversariante(s) selecionado(s)?`);
    if (!confirmed) return;

    let successCount = 0;
    selected.forEach(client => {
      if (this.sendBirthdayMessageToWhatsApp(client)) successCount += 1;
    });
    this.showToast(`Envio iniciado para ${successCount} aniversariante(s) selecionado(s).`, successCount > 0 ? 'success' : 'warning');
  }

  sendBirthdayMessagesForAllToday() {
    const birthdayClients = this.getBirthdayClientsForCurrentFilter();
    if (!birthdayClients.length) {
      this.showToast('Nao ha aniversariantes no periodo.', 'info');
      return;
    }

    const confirmed = confirm(`Enviar mensagem de felicitacao para ${birthdayClients.length} aniversariante(s)?`);
    if (!confirmed) return;

    let successCount = 0;
    birthdayClients.forEach(client => {
      if (this.sendBirthdayMessageToWhatsApp(client)) {
        successCount += 1;
      }
    });

    this.showToast(`Envio iniciado para ${successCount} aniversariante(s).`, successCount > 0 ? 'success' : 'warning');
  }

  notifyBirthdaysToday() {
    const todayKey = getTodayStr();
    const birthdayClients = this.getBirthdayReminderClients();
    this.updateBirthdaysNotificationBadge(birthdayClients.length);
    if (localStorage.getItem(BIRTHDAY_REMINDER_LAST_DATE_KEY) === todayKey) return;

    localStorage.setItem(BIRTHDAY_REMINDER_LAST_DATE_KEY, todayKey);

    if (!birthdayClients.length) return;

    const namesPreview = birthdayClients.slice(0, 3).map(c => c.name).join(', ');
    const moreText = birthdayClients.length > 3 ? ` e mais ${birthdayClients.length - 3}` : '';
    const reminderDays = this.getBirthdayReminderDaysAhead();
    const prefix = reminderDays > 0 ? `Aniversariantes próximos (${reminderDays} dia(s)): ` : 'Aniversariantes de hoje: ';
    this.showToast(`${prefix}${namesPreview}${moreText}. Abra o balão de aniversários para enviar as mensagens.`, 'info');
    this.openBirthdaysModal();
  }

  getBirthdayReminderClients() {
    const reminderDays = this.getBirthdayReminderDaysAhead();
    if (reminderDays > 0) {
      return this.getUpcomingBirthdayClients(reminderDays);
    }
    return this.getTodayBirthdayClients();
  }

  updateBirthdaysNotificationBadge(countOverride = null) {
    const badge = document.getElementById('birthdays-notification-badge');
    if (!badge) return;

    const count = Number.isInteger(countOverride) && countOverride >= 0
      ? countOverride
      : this.getBirthdayClientsForSavedWarningFilter().length;

    const savedRange = this.getSavedBirthdayRangeFilter();
    const hasSavedRange = Boolean(savedRange.startDate || savedRange.endDate);

    const reminderDays = this.getBirthdayReminderDaysAhead();
    const unifiedText = hasSavedRange
      ? `Período: ${count}`
      : (reminderDays > 0 ? `${reminderDays}d: ${count}` : `Hoje: ${count}`);

    badge.textContent = unifiedText;
    badge.classList.remove('is-hidden');
    badge.title = hasSavedRange
      ? `Filtro salvo: ${savedRange.startDate ? formatDateBR(savedRange.startDate) : 'início livre'} até ${savedRange.endDate ? formatDateBR(savedRange.endDate) : 'fim livre'}`
      : (reminderDays > 0
        ? `Lembrete com ${reminderDays} dia(s) de antecedência`
        : 'Lembrete de aniversariantes de hoje');
    badge.setAttribute('aria-label', badge.title);
  }

  // Renderiza Tabela de Clientes
  renderClientsTable() {
    const tbody = document.getElementById('clientes-table-body');
    const search = document.getElementById('clientes-search').value.toLowerCase();
    const phoneFilter = document.getElementById('clientes-phone-filter')?.value || 'todos';

    let filtered = [...this.clients];

    if (search) {
      filtered = filtered.filter(c => 
        c.name.toLowerCase().includes(search) || 
        c.phone.includes(search) || 
        (c.email && c.email.toLowerCase().includes(search)) ||
        (c.cpf && c.cpf.includes(search))
      );
    }

    if (phoneFilter === 'validos') {
      filtered = filtered.filter(c => Boolean(this.normalizeWhatsAppPhone(c.phone || '')));
    } else if (phoneFilter === 'invalidos') {
      filtered = filtered.filter(c => !this.normalizeWhatsAppPhone(c.phone || ''));
    }

    filtered.sort((a, b) => {
      const aNum = Number(a.registrationNumber || Number.MAX_SAFE_INTEGER);
      const bNum = Number(b.registrationNumber || Number.MAX_SAFE_INTEGER);
      if (aNum !== bNum) return aNum - bNum;
      return String(a.name || '').localeCompare(String(b.name || ''));
    });

    if (filtered.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7">
            <div class="empty-state">
              <i data-lucide="users"></i>
              <h4>Nenhum cliente encontrado</h4>
              <p>Revise os filtros de busca/telefone ou cadastre novos clientes.</p>
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
          <td><strong>${cli.registrationNumber || '-'}</strong></td>
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
  groupFinanceAppointments(appointments) {
    const groups = new Map();

    appointments.forEach(app => {
      const key = app.clientId || app.clientName || app.id;
      if (!groups.has(key)) {
        groups.set(key, {
          clientId: app.clientId || '',
          clientName: app.clientName || 'Cliente',
          appointments: []
        });
      }
      groups.get(key).appointments.push(app);
    });

    return Array.from(groups.values()).map(group => {
      group.appointments.sort((a, b) => b.date.localeCompare(a.date) || String(b.time || '').localeCompare(String(a.time || '')));
      group.total = group.appointments.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0);
      group.paid = group.appointments.reduce((sum, item) => sum + (parseFloat(item.amountPaid) || 0), 0);
      group.pending = Math.max(0, group.total - group.paid);
      group.paidCount = group.appointments.filter(item => item.paymentStatus === 'Pago').length;
      group.pendingCount = group.appointments.filter(item => item.paymentStatus !== 'Pago').length;
      group.latestDate = group.appointments[0]?.date || '';
      group.latestPending = group.appointments.find(item => item.paymentStatus !== 'Pago') || null;
      group.latestAppointment = group.appointments[0] || null;
      group.status = group.pending > 0 ? (group.paid > 0 ? 'Parcial' : 'Pendente') : 'Pago';
      return group;
    });
  }

  getFinanceGroupMatchesSearch(group, search) {
    if (!search) return true;
    const normalized = normalizeText(String(search || '').trim());
    return Boolean(
      (group.clientName && normalizeText(group.clientName).includes(normalized)) ||
      group.appointments.some(app =>
        normalizeText(String(app.procedure || '')).includes(normalized) ||
        normalizeText(String(app.paymentMethod || '')).includes(normalized) ||
        normalizeText(String(app.paymentStatus || '')).includes(normalized)
      )
    );
  }

  getFinanceGroupFilter(groups, filter) {
    if (filter === 'pago') {
      return groups.filter(group => group.paid > 0 && group.pending === 0);
    }
    if (filter === 'pendente') {
      return groups.filter(group => group.pending > 0);
    }
    return groups;
  }

  getFinanceGroupAppointmentsByFilter(group, filter) {
    const appointments = Array.isArray(group?.appointments) ? group.appointments : [];

    if (filter === 'pago') {
      return appointments.filter(item => {
        const price = parseFloat(item.price || 0) || 0;
        const paid = parseFloat(item.amountPaid || 0) || 0;
        return price > 0 && paid >= price;
      });
    }

    if (filter === 'pendente') {
      return appointments.filter(item => {
        const price = parseFloat(item.price || 0) || 0;
        const paid = parseFloat(item.amountPaid || 0) || 0;
        return price - paid > 0;
      });
    }

    return appointments;
  }

  buildFinanceDisplayGroup(group, filter) {
    const appointments = this.getFinanceGroupAppointmentsByFilter(group, filter);
    if (!appointments.length) return null;

    const total = appointments.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0);
    const paid = appointments.reduce((sum, item) => sum + (parseFloat(item.amountPaid) || 0), 0);
    const pending = Math.max(0, total - paid);
    const paidCount = appointments.filter(item => (parseFloat(item.amountPaid || 0) || 0) > 0).length;
    const pendingCount = appointments.filter(item => {
      const price = parseFloat(item.price || 0) || 0;
      const itemPaid = parseFloat(item.amountPaid || 0) || 0;
      return price - itemPaid > 0;
    }).length;

    const sortedAppointments = [...appointments].sort((a, b) => {
      return b.date.localeCompare(a.date) || String(b.time || '').localeCompare(String(a.time || ''));
    });

    const latestAppointment = sortedAppointments[0] || null;
    const latestPending = sortedAppointments.find(item => {
      const price = parseFloat(item.price || 0) || 0;
      const itemPaid = parseFloat(item.amountPaid || 0) || 0;
      return price - itemPaid > 0;
    }) || null;

    const status = pending > 0 ? (paid > 0 ? 'Parcial' : 'Pendente') : 'Pago';

    return {
      ...group,
      appointments: sortedAppointments,
      total,
      paid,
      pending,
      paidCount,
      pendingCount,
      latestAppointment,
      latestPending,
      latestDate: latestAppointment?.date || '',
      status
    };
  }

  renderFinanceiroTable() {
    const tbody = document.getElementById('financeiro-table-body');
    const search = document.getElementById('financeiro-search').value;

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

    let grouped = this.groupFinanceAppointments(rangeApps)
      .map(group => this.buildFinanceDisplayGroup(group, this.finFilter))
      .filter(Boolean);

    grouped = this.getFinanceGroupFilter(grouped, this.finFilter);
    grouped = grouped.filter(group => this.getFinanceGroupMatchesSearch(group, search));
    grouped.sort((a, b) => b.latestDate.localeCompare(a.latestDate) || a.clientName.localeCompare(b.clientName));

    if (grouped.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="8">
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

    tbody.innerHTML = grouped.map(group => {
      const pendingApp = group.latestPending || group.latestAppointment;
      const pendingAppId = pendingApp?.id || '';
      const statusClass = group.pending > 0 ? (group.paid > 0 ? 'parcial' : 'pendente') : 'pago';

      const appointmentsHtml = group.appointments.map(item => {
        const itemPrice = parseFloat(item.price || 0);
        const itemPaid = parseFloat(item.amountPaid || 0);
        const itemPending = Math.max(0, itemPrice - itemPaid);
        const itemStatusClass = String(item.paymentStatus || 'Pendente').toLowerCase();
        return `
          <div class="finance-group-entry finance-group-entry-${itemStatusClass}">
            <div class="finance-group-entry-main">
              <strong>${formatDateBR(item.date)}</strong>
              <span>${item.procedure}</span>
            </div>
            <div class="finance-group-entry-meta">
              <span>${formatCurrency(itemPrice)}</span>
              <span class="badge badge-${itemStatusClass}">${item.paymentStatus === 'Parcial' ? 'Parcial' : item.paymentStatus}</span>
              ${itemPending > 0 ? `<small>A receber: ${formatCurrency(itemPending)}</small>` : '<small>Quitado</small>'}
            </div>
          </div>
        `;
      }).join('');

      const latestLabel = group.latestAppointment
        ? `${formatDateBR(group.latestAppointment.date)} ${group.latestAppointment.time}`
        : '-';

      return `
        <tr>
          <td>
            <strong>${group.clientName}</strong>
            <div class="finance-group-summary">${group.appointments.length} lançamento(s) no período</div>
            <div class="finance-group-appointments">${appointmentsHtml}</div>
          </td>
          <td><strong>${group.appointments.length}</strong><br><span class="finance-group-summary">${group.paidCount} pago(s) / ${group.pendingCount} em aberto</span></td>
          <td><strong>${formatCurrency(group.total)}</strong></td>
          <td><span class="badge badge-success">${formatCurrency(group.paid)}</span></td>
          <td><span class="badge badge-${group.pending > 0 ? 'warning' : 'success'}">${formatCurrency(group.pending)}</span></td>
          <td><span class="badge badge-${statusClass}">${group.status === 'Parcial' ? 'Misto' : group.status}</span></td>
          <td>
            <div class="finance-group-summary">Último: ${latestLabel}</div>
            <div class="finance-group-summary">${group.latestAppointment ? group.latestAppointment.procedure : '-'}</div>
            <div style="margin-top: 0.45rem; display: flex; gap: 0.35rem; flex-wrap: wrap;">
              <button class="btn btn-sm btn-secondary" onclick="app.viewClientDetails('${group.clientId}')">
                <i data-lucide="eye"></i> Detalhes
              </button>
              ${pendingAppId ? `<button class="btn btn-sm btn-secondary" onclick="app.openQuickPayModal('${pendingAppId}')"><i data-lucide="credit-card"></i> Pagar</button>` : ''}
              ${group.latestAppointment ? `<button class="btn btn-sm btn-secondary" onclick="app.editAppointment('${group.latestAppointment.id}')"><i data-lucide="edit-3"></i> Editar</button>` : ''}
            </div>
          </td>
        </tr>
      `;
    }).join('');

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  // Preenche seletor de clientes
  populateClientSelectOptions() {
    const select = document.getElementById('appt-client-id');
    const currentValue = select.value;

    // Populate hidden select (used by form) and the searchable combobox list
    select.innerHTML = '<option value="">Selecione um cliente...</option>';
    const comboboxList = document.getElementById('appt-client-list');
    if (comboboxList) comboboxList.innerHTML = '';

    const sorted = this.clients.sort((a, b) => a.name.localeCompare(b.name));
    sorted.forEach(cli => {
      const opt = document.createElement('option');
      opt.value = cli.id;
      opt.textContent = `${cli.name} ${cli.phone ? '(' + cli.phone + ')' : ''}`;
      select.appendChild(opt);

      if (comboboxList) {
        const item = document.createElement('div');
        item.className = 'combobox-item';
        item.setAttribute('data-id', cli.id);
        // show name • phone • email • cpf when available
        const parts = [cli.name];
        if (cli.phone) parts.push(cli.phone);
        if (cli.email) parts.push(cli.email);
        if (cli.cpf) parts.push(cli.cpf);
        item.textContent = parts.join(' • ');
        comboboxList.appendChild(item);
      }
    });

    // Attach click handlers for combobox items
    if (comboboxList) {
      Array.from(comboboxList.children).forEach(item => {
        item.addEventListener('click', (e) => {
          const id = item.getAttribute('data-id');
          const input = document.getElementById('appt-client-combobox');
          select.value = id;
          if (input) input.value = item.textContent.trim();
          comboboxList.style.display = 'none';
          select.dispatchEvent(new Event('change'));
        });
      });
    }

    select.value = currentValue;
  }

  // Modal de Cliente
  openClientModal(clientId = null) {
    document.getElementById('form-client').reset();
    document.getElementById('client-id').value = '';
    document.getElementById('modal-client-title').textContent = 'Cadastrar Novo Paciente';
    const anamnesisSection = document.getElementById('client-anamnesis-collapsible');
    if (anamnesisSection) anamnesisSection.open = !clientId;

    if (clientId) {
      const cli = this.clients.find(c => c.id === clientId);
      if (cli) {
        document.getElementById('client-id').value = cli.id;
        document.getElementById('client-name').value = cli.name;
        document.getElementById('client-phone').value = this.formatPhoneMask(cli.phone || '');
        document.getElementById('client-email').value = cli.email || '';
        document.getElementById('client-cpf').value = this.formatCpfMask(cli.cpf || '');
        document.getElementById('client-rg').value = this.formatRgMask(cli.rg || '');
        document.getElementById('client-dob').value = cli.dob || '';
        document.getElementById('client-group').value = cli.group || '';
        document.getElementById('client-gender').value = cli.gender || '';
        document.getElementById('client-financial-info').value = cli.financialInfo || '';
        document.getElementById('client-financial-plan').value = cli.financialPlan || '';
        document.getElementById('client-session-value').value = cli.sessionValue ?? '';
        document.getElementById('client-cep').value = this.formatCepMask(cli.cep || '');
        document.getElementById('client-city').value = cli.city || '';
        document.getElementById('client-state').value = cli.state || '';
        document.getElementById('client-country').value = cli.country || '';
        document.getElementById('client-address').value = cli.address || '';
        document.getElementById('client-address-complement').value = cli.addressComplement || '';
        document.getElementById('client-address-number').value = cli.addressNumber || '';
        document.getElementById('client-neighborhood').value = cli.neighborhood || '';
        document.getElementById('client-birth-place').value = cli.birthPlace || '';
        this.populateBirthCityOptions(cli.birthPlace || '', cli.birthCity || '');
        document.getElementById('client-education').value = cli.education || '';
        document.getElementById('client-race').value = cli.race || '';
        document.getElementById('client-profession').value = cli.profession || '';
        document.getElementById('client-guardian-name').value = cli.guardianName || '';
        document.getElementById('client-guardian-email').value = cli.guardianEmail || '';
        document.getElementById('client-guardian-phone').value = this.formatPhoneMask(cli.guardianPhone || '');
        document.getElementById('client-guardian-cpf').value = this.formatCpfMask(cli.guardianCpf || '');
        document.getElementById('client-guardian-rg').value = this.formatRgMask(cli.guardianRg || '');
        document.getElementById('client-guardian-dob').value = cli.guardianDob || '';
        document.getElementById('client-guardian-consent-billing').value = cli.guardianConsentBilling || '';
        document.getElementById('client-guardian-consent-reminders').value = cli.guardianConsentReminders || '';
        document.getElementById('client-notes').value = cli.notes || '';
        this.renderClientAnamnesisBubbles(cli.anamnesis || this.getAnamnesisTemplate(), { allOpen: true });
        document.querySelectorAll('#client-anamnesis-bubbles .anamnesis-answer-input').forEach(input => {
          input.disabled = false;
          input.readOnly = false;
          input.style.pointerEvents = 'auto';
        });
        document.getElementById('modal-client-title').textContent = 'Editar Dados do Cliente';
        if (anamnesisSection) anamnesisSection.open = true;
      }
    } else {
      this.populateBirthCityOptions('', '');
      this.renderClientAnamnesisBubbles(this.getAnamnesisTemplate());
      document.querySelectorAll('#client-anamnesis-bubbles .anamnesis-answer-input').forEach(input => {
        input.disabled = false;
        input.readOnly = false;
        input.style.pointerEvents = 'auto';
      });
      if (anamnesisSection) anamnesisSection.open = true;
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
    const rg = document.getElementById('client-rg').value.trim();
    const dob = document.getElementById('client-dob').value;
    const group = document.getElementById('client-group').value;
    const gender = document.getElementById('client-gender').value;
    const financialInfo = document.getElementById('client-financial-info').value.trim();
    const financialPlan = document.getElementById('client-financial-plan').value;
    const sessionValueRaw = document.getElementById('client-session-value').value;
    const sessionValue = sessionValueRaw === '' ? null : parseFloat(sessionValueRaw);
    const cep = document.getElementById('client-cep').value.trim();
    const city = document.getElementById('client-city').value.trim();
    const state = document.getElementById('client-state').value.trim();
    const country = document.getElementById('client-country').value.trim();
    const address = document.getElementById('client-address').value.trim();
    const addressComplement = document.getElementById('client-address-complement').value.trim();
    const addressNumber = document.getElementById('client-address-number').value.trim();
    const neighborhood = document.getElementById('client-neighborhood').value.trim();
    const birthPlace = document.getElementById('client-birth-place').value.trim();
    const birthCityInput = document.getElementById('client-birth-city');
    const birthCity = birthCityInput ? birthCityInput.value.trim() : '';
    const education = document.getElementById('client-education').value.trim();
    const race = document.getElementById('client-race').value.trim();
    const profession = document.getElementById('client-profession').value.trim();
    const guardianName = document.getElementById('client-guardian-name').value.trim();
    const guardianEmail = document.getElementById('client-guardian-email').value.trim();
    const guardianPhone = document.getElementById('client-guardian-phone').value.trim();
    const guardianCpf = document.getElementById('client-guardian-cpf').value.trim();
    const guardianRg = document.getElementById('client-guardian-rg').value.trim();
    const guardianDob = document.getElementById('client-guardian-dob').value;
    const guardianConsentBilling = document.getElementById('client-guardian-consent-billing').value;
    const guardianConsentReminders = document.getElementById('client-guardian-consent-reminders').value;
    const notes = document.getElementById('client-notes').value.trim();
    const anamnesis = this.formatAnamnesisText(document.getElementById('client-anamnesis').value);

    if (!name || !phone) {
      this.showToast('Por favor, preencha o Nome e Telefone.', 'warning');
      return;
    }

    let savedClient = null;

    if (id) {
      const idx = this.clients.findIndex(c => c.id === id);
      if (idx !== -1) {
        this.clients[idx] = {
          ...this.clients[idx],
          name,
          phone,
          email,
          cpf,
          rg,
          dob,
          group,
          gender,
          financialInfo,
          financialPlan,
          sessionValue,
          cep,
          city,
          state,
          country,
          address,
          addressComplement,
          addressNumber,
          neighborhood,
          birthPlace,
          birthCity,
          education,
          race,
          profession,
          guardianName,
          guardianEmail,
          guardianPhone,
          guardianCpf,
          guardianRg,
          guardianDob,
          guardianConsentBilling,
          guardianConsentReminders,
          notes,
          anamnesis
        };
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
        registrationNumber: this.getNextClientRegistrationNumber(),
        name,
        phone,
        email,
        cpf,
        rg,
        dob,
        group,
        gender,
        financialInfo,
        financialPlan,
        sessionValue,
        cep,
        city,
        state,
        country,
        address,
        addressComplement,
        addressNumber,
        neighborhood,
        birthPlace,
        birthCity,
        education,
        race,
        profession,
        guardianName,
        guardianEmail,
        guardianPhone,
        guardianCpf,
        guardianRg,
        guardianDob,
        guardianConsentBilling,
        guardianConsentReminders,
        notes,
        anamnesis,
        createdAt: getTodayStr()
      };
      this.clients.push(savedClient);
      this.showToast('Cliente cadastrado com sucesso!', 'success');
    }

    this.saveStore();
    if (savedClient) this.syncClientToCloud(savedClient);
    if (savedClient) this.markClientAsWhatsAppFixed(savedClient.id);
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
        <label>RG</label>
        <p>${cli.rg || '-'}</p>
      </div>
      <div class="client-detail-item">
        <label>Data de Nascimento</label>
        <p>${cli.dob ? formatDateBR(cli.dob) : '-'}</p>
      </div>
      <div class="client-detail-item">
        <label>Grupo</label>
        <p>${cli.group || '-'}</p>
      </div>
      <div class="client-detail-item">
        <label>Genero</label>
        <p>${cli.gender || '-'}</p>
      </div>
      <div class="client-detail-item">
        <label>Plano Financeiro</label>
        <p>${cli.financialPlan || '-'}</p>
      </div>
      <div class="client-detail-item">
        <label>Valor da Sessao</label>
        <p>${cli.sessionValue !== null && cli.sessionValue !== undefined && cli.sessionValue !== '' ? formatCurrency(cli.sessionValue) : '-'}</p>
      </div>
      <div class="client-detail-item client-detail-item-wide">
        <label>Informacao Financeira</label>
        <p>${cli.financialInfo || '-'}</p>
      </div>
      <div class="client-detail-item client-detail-item-wide">
        <label>Endereco</label>
        <p>${[cli.address, cli.addressComplement, cli.addressNumber, cli.neighborhood, cli.city, cli.state, cli.cep].filter(Boolean).join(' - ') || '-'}</p>
      </div>
      <div class="client-detail-item">
        <label>Naturalidade</label>
        <p>${cli.birthPlace || '-'}</p>
      </div>
      <div class="client-detail-item">
        <label>Escolaridade</label>
        <p>${cli.education || '-'}</p>
      </div>
      <div class="client-detail-item">
        <label>Raca</label>
        <p>${cli.race || '-'}</p>
      </div>
      <div class="client-detail-item">
        <label>Profissao</label>
        <p>${cli.profession || '-'}</p>
      </div>
      <div class="client-detail-item client-detail-item-wide">
        <details class="client-detail-collapsible">
          <summary>Observações / Histórico Médico</summary>
          <div class="client-detail-paragraph">${cli.notes ? toHtmlWithLineBreaks(cli.notes) : 'Sem observações cadastradas.'}</div>
        </details>
      </div>
      <div class="client-detail-item client-detail-item-wide">
        <details class="client-detail-collapsible" open>
          <summary>Anamnese (Terapia de Casal)</summary>
          <div class="client-detail-anamnesis">${cli.anamnesis ? this.renderClientAnamnesisReadOnlyBubbles(cli.anamnesis, { allOpen: true }) : 'Sem anamnese cadastrada.'}</div>
        </details>
      </div>
    `;

    const tbody = document.getElementById('client-history-tbody');
    const clientAppts = this.appointments
      .filter(a => a.clientId === clientId)
      .sort((a, b) => b.date.localeCompare(a.date));

    if (clientAppts.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:1.5rem; color:var(--text-muted);">Nenhuma consulta registrada para este cliente.</td></tr>`;
    } else {
      tbody.innerHTML = clientAppts.map(app => `
        <tr>
          <td>${formatDateBR(app.date)} às ${app.time}</td>
          <td>${app.procedure}</td>
          <td>${formatCurrency(app.price)} ${app.amountPaid < app.price ? `(Pago: ${formatCurrency(app.amountPaid)})` : ''}</td>
          <td><span class="badge badge-${app.status.toLowerCase()}">${app.status}</span></td>
          <td><span class="badge badge-${app.paymentStatus.toLowerCase()}">${app.paymentStatus === 'Parcial' ? 'Pago Parcial' : app.paymentStatus}</span></td>
          <td>${app.notes ? app.notes.replace(/</g, '&lt;').replace(/>/g, '&gt;') : '-'}</td>
          <td>
            <button type="button" class="btn btn-sm btn-primary" onclick="app.editAppointment('${app.id}')">Ver</button>
          </td>
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
    document.getElementById('appt-date').value = getTodayStr();
    document.getElementById('appt-time').value = '10:00';
    document.getElementById('appt-duration').value = '50';
    document.getElementById('appt-color').value = '#38bdf8';
    this.updateAppointmentColorSwatches('#38bdf8');
    this.selectSessionStatus('');
    document.getElementById('group-amount-paid').style.display = 'none';

    this.populateClientSelectOptions();
    this.populateAppointmentApproachOptions();

    const approachSelect = document.getElementById('appt-procedure');
    if (approachSelect && approachSelect.options.length > 1) {
      approachSelect.selectedIndex = 1;
      this.syncAppointmentPriceFromApproach();
    }

    if (appId) {
      const app = this.appointments.find(a => a.id === appId);
      if (app) {
        document.getElementById('appointment-id').value = app.id;
        document.getElementById('appt-client-id').value = app.clientId;
        document.getElementById('appt-date').value = app.date;
        document.getElementById('appt-time').value = app.time;
        document.getElementById('appt-duration').value = String(app.durationMinutes || 50);
        document.getElementById('appt-price').value = app.price;
        document.getElementById('appt-payment-method').value = app.paymentMethod || 'Pix';
        document.getElementById('appt-status').value = app.status;
        document.getElementById('appt-color').value = app.color || '#38bdf8';
        this.updateAppointmentColorSwatches(app.color || '#38bdf8');
        document.getElementById('appt-payment-status').value = app.paymentStatus;
        document.getElementById('appt-amount-paid').value = app.amountPaid || 0;
        document.getElementById('appt-notes').value = app.notes || '';
        this.selectSessionStatus(app.sessionStatus || '');
        this.populateAppointmentApproachOptions(app.procedure || '', app.price || 0);
        document.getElementById('appt-procedure').value = app.procedure || '';
        document.getElementById('modal-appointment-title').textContent = 'Editar Consulta & Data';

        if (app.paymentStatus !== 'Pendente') {
          document.getElementById('group-amount-paid').style.display = 'flex';
        }
      }
    }

    document.getElementById('modal-appointment').classList.add('active');
  }

  closeAppointmentModal() {
    this.closeSessionStatusMenu();
    document.getElementById('modal-appointment').classList.remove('active');
  }

  toggleSessionStatusMenu() {
    const menu = document.getElementById('session-status-menu');
    if (!menu) return;
    menu.classList.toggle('active');
  }

  closeSessionStatusMenu() {
    const menu = document.getElementById('session-status-menu');
    if (!menu) return;
    menu.classList.remove('active');
  }

  getSessionStatusLabel(value) {
    const labels = {
      cancelada_cliente: 'Cancelada cliente',
      transferida_cliente: 'Transferida cliente',
      cancelada_profissional: 'Cancelada profissional',
      transferida_profissional: 'Transferida profissional'
    };
    return labels[value] || 'Selecionar';
  }

  selectSessionStatus(value) {
    const input = document.getElementById('appt-session-status');
    const button = document.getElementById('btn-session-status');
    if (input) input.value = value || '';
    if (button) button.textContent = this.getSessionStatusLabel(value);

    const mappedStatus = (value === 'cancelada_cliente' || value === 'cancelada_profissional') ? 'Cancelado' : null;
    if (mappedStatus) {
      const statusSelect = document.getElementById('appt-status');
      if (statusSelect) statusSelect.value = mappedStatus;
    }

    this.closeSessionStatusMenu();
  }

  saveAppointmentForm() {
    const id = document.getElementById('appointment-id').value;
    const clientId = document.getElementById('appt-client-id').value;
    const date = parseDateBR(document.getElementById('appt-date').value);
    const time = normalizeTime24h(document.getElementById('appt-time').value);
    const durationMinutes = parseInt(document.getElementById('appt-duration').value, 10) || 50;
    const procedure = document.getElementById('appt-procedure').value.trim();
    const price = parseFloat(document.getElementById('appt-price').value);
    const paymentMethod = document.getElementById('appt-payment-method').value;
    const status = document.getElementById('appt-status').value;
    const color = document.getElementById('appt-color').value || '#38bdf8';
    const sessionStatus = document.getElementById('appt-session-status').value || '';
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
          durationMinutes,
          procedure,
          price,
          amountPaid,
          paymentMethod,
          status,
          sessionStatus,
          paymentStatus,
          notes,
          color
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
        durationMinutes,
        procedure,
        price,
        amountPaid,
        paymentMethod,
        status,
        sessionStatus,
        paymentStatus,
        notes,
        color
      };
      this.appointments.push(savedAppt);
      this.showToast('Consulta agendada com sucesso!', 'success');
    }

    this.saveStore();
    if (savedAppt) this.syncAppointmentToCloud(savedAppt);
    if (savedAppt) {
      this.upsertGoogleEventForAppointment(savedAppt).catch(err => {
        console.log('Falha ao sincronizar consulta com Google Agenda:', err);
      });
    }

    // Send via WhatsApp only when creating a new appointment
    if (!id && savedAppt) {
      const shouldSend = confirm('Deseja enviar este agendamento para o cliente via WhatsApp agora?');
      if (shouldSend) {
        this.sendAppointmentToWhatsApp(savedAppt.id);
      }
    }

    this.closeAppointmentModal();
    this.render();
  }

  editAppointment(id) {
    this.openAppointmentModal(id);
  }

  selectAppointmentColor(color) {
    const input = document.getElementById('appt-color');
    if (!input) return;
    input.value = color;
    this.updateAppointmentColorSwatches(color);
  }

  updateAppointmentColorSwatches(selectedColor) {
    const palette = document.getElementById('appt-color-palette');
    if (!palette) return;
    palette.querySelectorAll('.color-swatch').forEach(swatch => {
      swatch.classList.toggle('selected', swatch.dataset.color === selectedColor);
    });
  }

  deleteAppointment(id) {
    const removedAppt = this.appointments.find(a => a.id === id);
    if (confirm('Tem certeza que deseja excluir esta consulta do sistema?')) {
      this.appointments = this.appointments.filter(a => a.id !== id);
      this.saveStore();
      this.deleteAppointmentFromCloud(id);
      if (removedAppt) {
        this.deleteGoogleEventForAppointment(removedAppt).catch(err => {
          console.log('Falha ao excluir evento do Google Agenda:', err);
        });
      }
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

  normalizeWhatsAppPhone(rawPhone) {
    if (!rawPhone) return '';
    const digits = String(rawPhone).replace(/\D/g, '');
    if (!digits) return '';

    if ((digits.length === 10 || digits.length === 11) && !digits.startsWith('55')) {
      return `55${digits}`;
    }

    if (digits.startsWith('55') && (digits.length === 12 || digits.length === 13)) {
      return digits;
    }

    if (digits.length >= 10 && digits.length <= 15) {
      return digits;
    }

    return '';
  }

  buildAppointmentWhatsAppMessage(appointment, client, templateId = null) {
    const dateText = formatDateBR(appointment.date);
    const timeText = appointment.time || '--:--';
    const valueText = formatCurrency(appointment.price || 0);
    const statusText = appointment.status || 'Agendado';
    const clientName = client?.name || appointment.clientName || 'Cliente';

    const replacements = {
      cliente: clientName,
      data: dateText,
      hora: timeText,
      procedimento: appointment.procedure || '-',
      valor: valueText,
      status: statusText,
      assinatura: APP_BRAND_NAME
    };

    const targetTemplateId = templateId || this.whatsAppSelectedTemplateId;
    const selectedTpl = this.whatsAppTemplates.find(t => t.id === targetTemplateId) || this.whatsAppTemplates[0];
    let message = (selectedTpl?.text || DEFAULT_WHATSAPP_TEMPLATE).replace(/\r\n/g, '\n');
    Object.entries(replacements).forEach(([key, value]) => {
      const rgx = new RegExp(`{{\\s*${key}\\s*}}`, 'gi');
      message = message.replace(rgx, value);
    });

    return message;
  }

  renderWhatsAppTemplateEditor() {
    const select = document.getElementById('whatsapp-template-select');
    const nameInput = document.getElementById('whatsapp-template-name');
    const input = document.getElementById('whatsapp-message-template');
    if (!select || !nameInput || !input) return;

    select.innerHTML = this.whatsAppTemplates
      .map(t => `<option value="${t.id}" ${t.id === this.whatsAppSelectedTemplateId ? 'selected' : ''}>${t.name}</option>`)
      .join('');

    const selectedTpl = this.whatsAppTemplates.find(t => t.id === this.whatsAppSelectedTemplateId) || this.whatsAppTemplates[0];
    nameInput.value = selectedTpl?.name || '';
    input.value = selectedTpl?.text || DEFAULT_WHATSAPP_TEMPLATE;
  }

  selectWhatsAppTemplate(templateId) {
    if (!this.whatsAppTemplates.some(t => t.id === templateId)) return;
    this.whatsAppSelectedTemplateId = templateId;
    this.saveStore();
    this.renderWhatsAppTemplateEditor();
  }

  newWhatsAppTemplateDraft() {
    const nameInput = document.getElementById('whatsapp-template-name');
    const textInput = document.getElementById('whatsapp-message-template');
    if (!nameInput || !textInput) return;
    nameInput.value = '';
    textInput.value = DEFAULT_WHATSAPP_TEMPLATE;
    nameInput.focus();
  }

  saveWhatsAppTemplate() {
    const nameInput = document.getElementById('whatsapp-template-name');
    const input = document.getElementById('whatsapp-message-template');
    if (!nameInput || !input) return;

    const name = (nameInput.value || '').trim();
    const value = (input.value || '').trim();
    if (!name) {
      this.showToast('Informe um nome para o modelo.', 'warning');
      return;
    }

    if (!value) {
      this.showToast('Digite uma mensagem antes de salvar.', 'warning');
      return;
    }

    const existsName = this.whatsAppTemplates.some(t => t.name.toLowerCase() === name.toLowerCase());
    if (existsName) {
      this.showToast('Ja existe um modelo com esse nome. Use Atualizar ou outro nome.', 'warning');
      return;
    }

    const id = `tpl-${Date.now()}`;
    this.whatsAppTemplates.push({ id, name, text: value });
    this.whatsAppSelectedTemplateId = id;
    this.saveStore();
    this.renderWhatsAppTemplateEditor();
    this.showToast('Novo modelo de mensagem salvo com sucesso!', 'success');
  }

  updateWhatsAppTemplate() {
    const nameInput = document.getElementById('whatsapp-template-name');
    const textInput = document.getElementById('whatsapp-message-template');
    if (!nameInput || !textInput) return;

    const name = (nameInput.value || '').trim();
    const text = (textInput.value || '').trim();
    if (!name || !text) {
      this.showToast('Preencha nome e mensagem para atualizar.', 'warning');
      return;
    }

    const idx = this.whatsAppTemplates.findIndex(t => t.id === this.whatsAppSelectedTemplateId);
    if (idx === -1) {
      this.showToast('Selecione um modelo para atualizar.', 'warning');
      return;
    }

    const duplicateName = this.whatsAppTemplates.some(t => t.id !== this.whatsAppSelectedTemplateId && t.name.toLowerCase() === name.toLowerCase());
    if (duplicateName) {
      this.showToast('Ja existe outro modelo com esse nome.', 'warning');
      return;
    }

    this.whatsAppTemplates[idx] = { ...this.whatsAppTemplates[idx], name, text };
    this.saveStore();
    this.renderWhatsAppTemplateEditor();
    this.showToast('Modelo atualizado com sucesso!', 'success');
  }

  duplicateWhatsAppTemplate() {
    const current = this.whatsAppTemplates.find(t => t.id === this.whatsAppSelectedTemplateId);
    if (!current) {
      this.showToast('Selecione um modelo para duplicar.', 'warning');
      return;
    }

    let baseName = `${current.name} Copia`;
    let nextName = baseName;
    let counter = 2;
    while (this.whatsAppTemplates.some(t => t.name.toLowerCase() === nextName.toLowerCase())) {
      nextName = `${baseName} ${counter}`;
      counter += 1;
    }

    const cloned = {
      id: `tpl-${Date.now()}`,
      name: nextName,
      text: current.text
    };

    this.whatsAppTemplates.push(cloned);
    this.whatsAppSelectedTemplateId = cloned.id;
    this.saveStore();
    this.renderWhatsAppTemplateEditor();
    this.showToast('Modelo duplicado com sucesso!', 'success');
  }

  deleteWhatsAppTemplate() {
    if (this.whatsAppTemplates.length <= 1) {
      this.showToast('Mantenha ao menos 1 modelo salvo.', 'warning');
      return;
    }

    const current = this.whatsAppTemplates.find(t => t.id === this.whatsAppSelectedTemplateId);
    if (!current) return;
    const confirmed = confirm(`Excluir o modelo "${current.name}"?`);
    if (!confirmed) return;

    this.whatsAppTemplates = this.whatsAppTemplates.filter(t => t.id !== this.whatsAppSelectedTemplateId);
    this.whatsAppSelectedTemplateId = this.whatsAppTemplates[0].id;
    this.saveStore();
    this.renderWhatsAppTemplateEditor();
    this.showToast('Modelo excluido com sucesso.', 'info');
  }

  resetWhatsAppTemplate() {
    const confirmed = confirm('Deseja restaurar o texto padrao no editor?');
    if (!confirmed) return;

    const input = document.getElementById('whatsapp-message-template');
    if (input) input.value = DEFAULT_WHATSAPP_TEMPLATE;
    this.showToast('Texto padrao aplicado no editor.', 'info');
  }

  buildWhatsAppUrl(appointment, client, templateId = null) {
    const phone = this.normalizeWhatsAppPhone(client?.phone || '');
    if (!phone) return '';
    const message = this.buildAppointmentWhatsAppMessage(appointment, client, templateId);
    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  }

  populateWhatsAppSendTemplateSelect(searchTerm = '') {
    const tplSelect = document.getElementById('ws-send-template-select');
    if (!tplSelect) return;

    const term = String(searchTerm || '').trim().toLowerCase();
    const filtered = term
      ? this.whatsAppTemplates.filter(t => t.name.toLowerCase().includes(term))
      : [...this.whatsAppTemplates];

    tplSelect.innerHTML = filtered
      .map(t => `<option value="${t.id}">${t.name}</option>`)
      .join('');

    if (filtered.length === 0) {
      tplSelect.innerHTML = '<option value="">Nenhum modelo encontrado</option>';
      tplSelect.value = '';
      return;
    }

    if (filtered.some(t => t.id === this.whatsAppSelectedTemplateId)) {
      tplSelect.value = this.whatsAppSelectedTemplateId;
    } else {
      tplSelect.value = filtered[0].id;
    }
  }

  filterWhatsAppSendTemplates() {
    const searchInput = document.getElementById('ws-send-template-search');
    this.populateWhatsAppSendTemplateSelect(searchInput?.value || '');
    this.updateWhatsAppSendPreview();
  }

  openWhatsAppSendModal(appointmentId) {
    const appointment = this.appointments.find(a => a.id === appointmentId);
    if (!appointment) {
      this.showToast('Agendamento nao encontrado.', 'warning');
      return;
    }

    const client = this.clients.find(c => c.id === appointment.clientId);
    if (!client || !client.phone) {
      this.showToast('Cliente sem telefone cadastrado para WhatsApp.', 'warning');
      return;
    }

    const phone = this.normalizeWhatsAppPhone(client.phone);
    if (!phone) {
      this.showToast('Telefone do cliente invalido para WhatsApp.', 'warning');
      return;
    }

    const apptInput = document.getElementById('ws-send-appt-id');
    const searchInput = document.getElementById('ws-send-template-search');
    if (!apptInput) return;

    apptInput.value = appointmentId;
    if (searchInput) searchInput.value = '';
    this.populateWhatsAppSendTemplateSelect('');
    this.updateWhatsAppSendPreview();
    document.getElementById('modal-whatsapp-send').classList.add('active');

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  closeWhatsAppSendModal() {
    const modal = document.getElementById('modal-whatsapp-send');
    if (modal) modal.classList.remove('active');
  }

  updateWhatsAppSendPreview() {
    const apptId = document.getElementById('ws-send-appt-id')?.value;
    const tplId = document.getElementById('ws-send-template-select')?.value;
    const preview = document.getElementById('ws-send-preview');
    if (!apptId || !preview) return;

    const appointment = this.appointments.find(a => a.id === apptId);
    if (!appointment) return;
    const client = this.clients.find(c => c.id === appointment.clientId);
    if (!client) return;

    if (!tplId) {
      preview.value = 'Nenhum modelo encontrado para a busca atual.';
      return;
    }

    preview.value = this.buildAppointmentWhatsAppMessage(appointment, client, tplId);
  }

  confirmWhatsAppSendModal() {
    const apptId = document.getElementById('ws-send-appt-id')?.value;
    const tplId = document.getElementById('ws-send-template-select')?.value;
    if (!apptId || !tplId) {
      this.showToast('Selecione um modelo para envio.', 'warning');
      return;
    }

    const appointment = this.appointments.find(a => a.id === apptId);
    if (!appointment) {
      this.showToast('Agendamento nao encontrado.', 'warning');
      return;
    }

    const client = this.clients.find(c => c.id === appointment.clientId);
    if (!client) {
      this.showToast('Cliente nao encontrado.', 'warning');
      return;
    }

    const url = this.buildWhatsAppUrl(appointment, client, tplId);
    if (!url) {
      this.showToast('Telefone do cliente invalido para WhatsApp.', 'warning');
      return;
    }

    this.whatsAppSelectedTemplateId = tplId;
    this.saveStore();
    this.closeWhatsAppSendModal();
    window.open(url, '_blank', 'noopener');
    this.showToast(`Mensagem pronta para ${client.name} no WhatsApp.`, 'success');
  }

  updateWhatsAppBulkButton() {
    const btn = document.getElementById('btn-send-whatsapp-bulk');
    const cancelBtn = document.getElementById('btn-cancel-whatsapp-queue');
    const nextInvalidBtn = document.getElementById('btn-next-invalid-whatsapp');
    if (!btn) return;

    if (this.whatsAppQueue.length > 0) {
      const restText = this.whatsAppQueue.length === 1 ? 'restante' : 'restantes';
      btn.classList.remove('btn-secondary');
      btn.classList.add('btn-success');
      btn.innerHTML = `<i data-lucide="message-circle"></i> Enviar Proximo (${this.whatsAppQueue.length} ${restText})`;
      if (cancelBtn) cancelBtn.style.display = 'inline-flex';
    } else {
      btn.classList.remove('btn-success');
      btn.classList.add('btn-secondary');
      btn.innerHTML = '<i data-lucide="message-circle"></i> Envio Individual WhatsApp';
      if (cancelBtn) cancelBtn.style.display = 'none';
    }

    if (nextInvalidBtn) {
      if (this.whatsAppInvalidClients.length > 0) {
        nextInvalidBtn.style.display = 'inline-flex';
        nextInvalidBtn.innerHTML = `<i data-lucide="user-cog"></i> Proximo Invalido (${this.whatsAppInvalidClients.length})`;
      } else {
        nextInvalidBtn.style.display = 'none';
        nextInvalidBtn.innerHTML = '<i data-lucide="user-cog"></i> Proximo Invalido';
      }
    }

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  sendNextWhatsAppFromQueue() {
    if (!this.whatsAppQueue.length) return false;

    const next = this.whatsAppQueue.shift();
    window.open(next.url, '_blank', 'noopener');

    if (this.whatsAppQueue.length > 0) {
      this.showToast(`Mensagem aberta para ${next.name}. Clique novamente para o proximo envio.`, 'info');
    } else if (this.whatsAppInvalidCount > 0) {
      this.showToast(`Fila concluida. ${this.whatsAppInvalidCount} contato(s) sem telefone valido.`, 'warning');
      const invalidPreview = this.whatsAppInvalidNames.slice(0, 12).join('\n- ');
      const extraCount = Math.max(0, this.whatsAppInvalidNames.length - 12);
      alert(`Contatos sem telefone valido para WhatsApp:\n- ${invalidPreview}${extraCount > 0 ? `\n...e mais ${extraCount}` : ''}`);
      const openFixer = confirm('Deseja abrir agora o cadastro do primeiro contato invalido para corrigir o telefone?');
      if (openFixer) {
        this.openFirstInvalidWhatsAppClientForEdit();
      }
      this.whatsAppInvalidCount = 0;
    } else {
      this.showToast('Fila de envios concluida.', 'success');
    }

    this.updateWhatsAppBulkButton();
    return true;
  }

  sendAppointmentToWhatsApp(appointmentId) {
    this.openWhatsAppSendModal(appointmentId);
  }

  sendAgendaRemindersBulk() {
    // Keep this action linked to Agenda tab/list context
    if (this.activeTab !== 'agenda') {
      this.switchTab('agenda');
    }
    if (this.agendaView !== 'list') {
      this.agendaView = 'list';
      const btnCal = document.getElementById('btn-agenda-view-calendar');
      const btnList = document.getElementById('btn-agenda-view-list');
      if (btnCal) btnCal.classList.remove('active');
      if (btnList) btnList.classList.add('active');
      this.renderAgendaTable();
    }

    // Manual queue mode: one send per click to avoid popup blockers
    if (this.whatsAppQueue.length > 0) {
      this.sendNextWhatsAppFromQueue();
      return;
    }

    const search = document.getElementById('agenda-search').value.toLowerCase();
    const filterStart = parseDateBR(document.getElementById('agenda-filter-start').value);
    const filterEnd = parseDateBR(document.getElementById('agenda-filter-end').value);
    const filterStatus = document.getElementById('agenda-filter-status').value;
    const filtered = this.getFilteredAgendaAppointments(search, filterStart, filterEnd, filterStatus);

    if (!filtered.length) {
      this.showToast('Nao ha agendamentos no filtro atual para enviar.', 'warning');
      return;
    }

    const queue = [];
    const invalidNames = [];
    const invalidClients = [];
    const invalidIds = new Set();

    filtered.forEach(appt => {
      const client = this.clients.find(c => c.id === appt.clientId);
      if (!client || !client.phone) {
        const fallbackName = appt.clientName || 'Cliente sem nome';
        if (appt.clientId && !invalidIds.has(appt.clientId)) {
          invalidIds.add(appt.clientId);
          invalidNames.push(fallbackName);
          invalidClients.push({ id: appt.clientId, name: fallbackName });
        }
        return;
      }

      const url = this.buildWhatsAppUrl(appt, client);
      if (!url) {
        const fallbackName = client.name || appt.clientName || 'Telefone invalido';
        if (client.id && !invalidIds.has(client.id)) {
          invalidIds.add(client.id);
          invalidNames.push(fallbackName);
          invalidClients.push({ id: client.id, name: fallbackName });
        }
        return;
      }

      queue.push({ name: client.name, url });
    });

    if (!queue.length) {
      this.showToast('Nenhum contato valido para envio no WhatsApp.', 'warning');
      return;
    }

    const confirmed = confirm(`Criar fila de lembretes para ${queue.length} cliente(s) no WhatsApp?\n(1 envio por clique para evitar bloqueio do navegador)`);
    if (!confirmed) return;

    this.whatsAppQueue = queue;
    this.whatsAppInvalidCount = invalidNames.length;
    this.whatsAppInvalidNames = invalidNames;
    this.whatsAppInvalidClients = invalidClients;
    this.whatsAppInvalidCursor = 0;
    this.updateWhatsAppBulkButton();
    this.sendNextWhatsAppFromQueue();
  }

  openFirstInvalidWhatsAppClientForEdit() {
    this.whatsAppInvalidCursor = 0;
    this.openNextInvalidWhatsAppClientForEdit();
  }

  openNextInvalidWhatsAppClientForEdit() {
    if (!this.whatsAppInvalidClients.length) {
      this.showToast('Nao ha contatos invalidos para corrigir.', 'info');
      return;
    }

    let attempts = 0;
    while (attempts < this.whatsAppInvalidClients.length) {
      const index = this.whatsAppInvalidCursor % this.whatsAppInvalidClients.length;
      const target = this.whatsAppInvalidClients[index];
      this.whatsAppInvalidCursor = index + 1;
      attempts += 1;

      if (target && target.id && this.clients.some(c => c.id === target.id)) {
        this.switchTab('clientes');
        this.editClient(target.id);
        this.showToast(`Corrija o telefone de ${target.name} e salve o cadastro.`, 'info');
        this.updateWhatsAppBulkButton();
        return;
      }
    }

    this.showToast('Nao foi possivel localizar os cadastros invalidos.', 'warning');
  }

  markClientAsWhatsAppFixed(clientId) {
    if (!clientId) return;
    const client = this.clients.find(c => c.id === clientId);
    if (!client) return;

    const normalized = this.normalizeWhatsAppPhone(client.phone || '');
    if (!normalized) return;

    const before = this.whatsAppInvalidClients.length;
    this.whatsAppInvalidClients = this.whatsAppInvalidClients.filter(item => item.id !== clientId);
    if (this.whatsAppInvalidClients.length === before) return;

    this.whatsAppInvalidNames = this.whatsAppInvalidClients.map(item => item.name);
    this.whatsAppInvalidCount = this.whatsAppInvalidClients.length;
    this.whatsAppInvalidCursor = 0;
    this.updateWhatsAppBulkButton();
    this.showToast(`Telefone de ${client.name} atualizado e removido da lista de invalidos.`, 'success');
  }

  cancelWhatsAppQueue() {
    const pending = this.whatsAppQueue.length;
    if (!pending) return;

    const confirmed = confirm(`Cancelar fila de WhatsApp com ${pending} envio(s) pendente(s)?`);
    if (!confirmed) return;

    this.whatsAppQueue = [];
    this.whatsAppInvalidCount = 0;
    this.whatsAppInvalidNames = [];
    this.whatsAppInvalidClients = [];
    this.whatsAppInvalidCursor = 0;
    this.updateWhatsAppBulkButton();
    this.showToast('Fila de WhatsApp cancelada.', 'info');
  }

  // Modal de Despesas
  openExpenseModal(expenseId = null) {
    document.getElementById('form-expense').reset();
    document.getElementById('expense-id').value = '';
    document.getElementById('expense-date').value = getTodayStr();
    document.getElementById('modal-expense-title').textContent = 'Registrar Despesa';

    if (expenseId) {
      const expense = this.expenses.find(e => e.id === expenseId);
      if (expense) {
        document.getElementById('expense-id').value = expense.id;
        document.getElementById('expense-description').value = expense.description;
        document.getElementById('expense-category').value = expense.category || 'Outros';
        document.getElementById('expense-amount').value = expense.amount;
        document.getElementById('expense-date').value = expense.date;
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
        this.syncExpenseToCloud(this.expenses[idx]);
        this.showToast('Despesa atualizada com sucesso!', 'success');
      }
    } else {
      const newExpense = { id: 'exp-' + Date.now(), description, category, amount, date, recurring, notes };
      this.expenses.push(newExpense);
      this.syncExpenseToCloud(newExpense);
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
      this.deleteExpenseFromCloud(id);
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
    } else if (type === 'aniversarios') {
      const reminderDays = this.getBirthdayReminderDaysAhead();
      const birthdayClients = reminderDays > 0 ? this.getUpcomingBirthdayClients(reminderDays) : this.getTodayBirthdayClients();
      report = ['RELATÓRIO DE ANIVERSÁRIOS', '', reminderDays > 0 ? `Antecedência: ${reminderDays} dia(s)` : 'Antecedência: hoje', ''].join('\n');

      if (birthdayClients.length === 0) {
        report += 'Nenhum aniversariante encontrado na janela configurada.';
      } else {
        report += birthdayClients.map(client => {
          const nextBirthday = this.getNextBirthdayDate(client.dob);
          const nextLabel = nextBirthday ? formatDateBR(formatISODate(nextBirthday)) : (client.dob ? formatDateBR(client.dob) : '-');
          return `${client.name} | Próximo aniversário: ${nextLabel} | Telefone: ${client.phone || client.guardianPhone || '-'}`;
        }).join('\n');
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
    const safeTitle = escapeHtml(title);
    const safeText = escapeHtml(text);
    const html = `
      <html>
        <head>
          <title>${safeTitle}</title>
          <style>
            body { font-family: Arial, Helvetica, sans-serif; padding: 20px; color: #111; }
            .report-header { display: flex; align-items: center; gap: 16px; margin-bottom: 20px; }
            .report-logo-wrap {
              width: 64px;
              height: 64px;
              border-radius: 18px;
              border: 1px solid #dbe4ef;
              background: #f8fafc;
              display: grid;
              place-items: center;
              overflow: hidden;
              flex: 0 0 auto;
            }
            .report-logo {
              width: 100%;
              height: 100%;
              padding: 0;
              object-fit: cover;
              object-position: left center;
            }
            .report-title { margin: 0; font-size: 1.4rem; }
            .report-subtitle { margin: 4px 0 0; color: #555; }
            pre { white-space: pre-wrap; font-family: Consolas, monospace; font-size: 0.95rem; line-height: 1.4; }
            hr { margin: 20px 0; border: none; border-top: 1px solid #ccc; }
          </style>
        </head>
        <body>
          <div class="report-header">
            <div class="report-logo-wrap">
              <img src="Patricia.avif" class="report-logo" alt="Logo">
            </div>
            <div>
              <h1 class="report-title">${APP_BRAND_NAME}</h1>
              <p class="report-subtitle">${APP_BRAND_SUBTITLE}</p>
            </div>
          </div>
          <hr>
          <h2>${safeTitle}</h2>
          <pre>${safeText}</pre>
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
    text += `Telefone: ${cli.phone} | E-mail: ${cli.email || '-'} | CPF: ${cli.cpf || '-'}\n`;
    text += `Data de nascimento: ${cli.dob ? formatDateBR(cli.dob) : '-'}\n\n`;

    text += 'ANAMNESE:\n';
    text += `${cli.anamnesis || 'Sem anamnese cadastrada.'}\n\n`;

    if (clientAppts.length === 0) {
      text += 'Nenhuma consulta registrada para este paciente.';
    } else {
      text += 'Consultas:\n';
      text += clientAppts.map(a => `${formatDateBR(a.date)} ${a.time} | ${a.procedure} | Valor: ${formatCurrency(a.price)} | Pago: ${formatCurrency(a.amountPaid)} | Status: ${a.paymentStatus} | Observações: ${a.notes || '-'} `).join('\n');
      text += `\n\nTotal recebido pelo paciente: ${formatCurrency(totalReceived)}\nTotal a receber: ${formatCurrency(totalDue)}`;
    }

    this._printTextWindow(`Relatório - ${cli.name}`, text);
  }

  printCurrentClientAnamnesis() {
    const modal = document.getElementById('modal-client-details');
    const clientId = modal ? modal.getAttribute('data-client-id') : null;
    if (!clientId) {
      this.showToast('Abra o detalhe do cliente antes de imprimir a anamnese.', 'warning');
      return;
    }

    const cli = this.clients.find(c => c.id === clientId);
    if (!cli) return;

    let text = `ANAMNESE DO CLIENTE: ${cli.name}\n`;
    text += `Telefone: ${cli.phone || '-'}\n`;
    text += `E-mail: ${cli.email || '-'}\n`;
    text += `CPF: ${cli.cpf || '-'}\n`;
    text += `Data de nascimento: ${cli.dob ? formatDateBR(cli.dob) : '-'}\n\n`;
    text += `${cli.anamnesis || 'Sem anamnese cadastrada.'}`;

    this._printTextWindow(`Anamnese - ${cli.name}`, text);
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

// Instanciar a aplicação e aguardar o Auth decidir a visibilidade
document.addEventListener('DOMContentLoaded', () => {
  if (!window.app) {
    window.app = new ConsultorioApp();
  }

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js')
      .then(reg => console.log('[PWA] Service Worker registrado:', reg.scope))
      .catch(err => console.log('[PWA] Falha Service Worker:', err));
  }
});

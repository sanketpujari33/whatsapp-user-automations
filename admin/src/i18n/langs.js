// ── Language Configuration ──────────────────────────────────────────────
// Maps spoken languages → supported countries, flags, RTL, and locale data.
// Fallback chain: selected language → en (for missing keys)
// ──────────────────────────────────────────────────────────────────────────

const LANG_COUNTRIES = {
  en: ["us","gb","au","ca","in","ie","nz","sg","za","ph","my","hk","pk","lk","ng","gh","ke","ug","tz","zm","zw","er","et","lr","mw","sl","ss","sd","gm","gy","bb","jm","tt","bs","bz","dm","gd","lc","vc","ag","kn"],
  hi: ["in"],
  ar: ["sa","ae","eg","iq","jo","kw","lb","ly","ma","om","qa","sd","sy","tn","ye","ps","bh","dz","mr","so","ss","td","dj","er","km"],
  bn: ["bd","in"],
  pt: ["pt","br","ao","mz","cv","gw","st","tl"],
  es: ["es","mx","ar","co","pe","ve","cl","ec","gt","cu","bo","do","hn","py","sv","ni","cr","pa","uy","gq","pr"],
  fr: ["fr","ca","be","ch","lu","mc","ci","ne","bf","sn","ml","mg","bj","tn","dz","ma","ht","cd","cg","ga","gn","tg","bj","rw","bi","km","sc","mu","mr","cf","gq","dj","bl","mf","gp","mq","gf","pf","nc","wf","yt","re"],
  ru: ["ru","by","kg","kz","az","am","ge","md","ua"],
  de: ["de","at","ch","lu","li","be"],
  ja: ["jp"],
  zh: ["cn","tw","sg","hk","mo"],
  ko: ["kr","kp"],
  it: ["it","ch","sm","va"],
  tr: ["tr","cy"],
  vi: ["vn"],
  th: ["th"],
  nl: ["nl","be","sr"],
  pl: ["pl"],
  ro: ["ro","md"],
  sv: ["se","fi"],
  cs: ["cz"],
  da: ["dk"],
  fi: ["fi"],
  el: ["gr","cy"],
  he: ["il"],
  hu: ["hu"],
  id: ["id"],
  ms: ["my","bn","sg"],
  no: ["no"],
  sk: ["sk"],
  uk: ["ua"],
  fa: ["ir","af"],
  ta: ["in","lk","sg","my"],
  te: ["in"],
  mr: ["in"],
  gu: ["in"],
  kn: ["in"],
  ml: ["in"],
  pa: ["in","pk"],
  ur: ["pk","in"],
  sw: ["tz","ke","ug","cd"],
  ha: ["ng","ne"],
  yo: ["ng","bj"],
  ig: ["ng"],
  am: ["et"],
  km: ["kh"],
  lo: ["la"],
  my: ["mm"],
  ne: ["np"],
  si: ["lk"],
};

const DAYJS_MAP = {
  en: () => import('dayjs/locale/en'),
  hi: () => import('dayjs/locale/hi'),
  ar: () => import('dayjs/locale/ar'),
  bn: () => import('dayjs/locale/bn'),
  pt: () => import('dayjs/locale/pt'),
  es: () => import('dayjs/locale/es'),
  fr: () => import('dayjs/locale/fr'),
  ru: () => import('dayjs/locale/ru'),
  de: () => import('dayjs/locale/de'),
  ja: () => import('dayjs/locale/ja'),
  zh: () => import('dayjs/locale/zh-cn'),
  ko: () => import('dayjs/locale/ko'),
  it: () => import('dayjs/locale/it'),
  tr: () => import('dayjs/locale/tr'),
  vi: () => import('dayjs/locale/vi'),
  th: () => import('dayjs/locale/th'),
  nl: () => import('dayjs/locale/nl'),
  pl: () => import('dayjs/locale/pl'),
  ro: () => import('dayjs/locale/ro'),
  sv: () => import('dayjs/locale/sv'),
  cs: () => import('dayjs/locale/cs'),
  da: () => import('dayjs/locale/da'),
  fi: () => import('dayjs/locale/fi'),
  el: () => import('dayjs/locale/el'),
  he: () => import('dayjs/locale/he'),
  hu: () => import('dayjs/locale/hu'),
  id: () => import('dayjs/locale/id'),
  ms: () => import('dayjs/locale/ms'),
  no: () => import('dayjs/locale/nb'),
  sk: () => import('dayjs/locale/sk'),
  uk: () => import('dayjs/locale/uk'),
  fa: () => import('dayjs/locale/fa'),
  ta: () => import('dayjs/locale/ta'),
  te: () => import('dayjs/locale/te'),
  mr: () => import('dayjs/locale/mr'),
  gu: () => import('dayjs/locale/gu'),
  kn: () => import('dayjs/locale/kn'),
  ml: () => import('dayjs/locale/ml'),
  pa: () => import('dayjs/locale/pa-in'),
  ur: () => import('dayjs/locale/ur'),
  sw: () => import('dayjs/locale/sw'),
  am: () => import('dayjs/locale/am'),
  km: () => import('dayjs/locale/km'),
  lo: () => import('dayjs/locale/lo'),
  my: () => import('dayjs/locale/my'),
  ne: () => import('dayjs/locale/ne'),
  si: () => import('dayjs/locale/si'),
  ha: () => import('dayjs/locale/en'), // fallback
  yo: () => import('dayjs/locale/en'),
  ig: () => import('dayjs/locale/en'),
};

const FLATPKR_MAP = {
  ar: () => import("flatpickr/dist/l10n/ar").then(m => m.Arabic),
  zh: () => import("flatpickr/dist/l10n/zh").then(m => m.Mandarin),
  de: () => import("flatpickr/dist/l10n/de").then(m => m.German),
  es: () => import("flatpickr/dist/l10n/es").then(m => m.Spanish),
  fr: () => import("flatpickr/dist/l10n/fr").then(m => m.French),
  it: () => import("flatpickr/dist/l10n/it").then(m => m.Italian),
  ja: () => import("flatpickr/dist/l10n/ja").then(m => m.Japanese),
  ko: () => import("flatpickr/dist/l10n/ko").then(m => m.Korean),
  nl: () => import("flatpickr/dist/l10n/nl").then(m => m.Dutch),
  pl: () => import("flatpickr/dist/l10n/pl").then(m => m.Polish),
  pt: () => import("flatpickr/dist/l10n/pt").then(m => m.Portuguese),
  ro: () => import("flatpickr/dist/l10n/ro").then(m => m.Romanian),
  ru: () => import("flatpickr/dist/l10n/ru").then(m => m.Russian),
  sv: () => import("flatpickr/dist/l10n/sv").then(m => m.Swedish),
  tr: () => import("flatpickr/dist/l10n/tr").then(m => m.Turkish),
  vi: () => import("flatpickr/dist/l10n/vn").then(m => m.Vietnamese),
  th: () => import("flatpickr/dist/l10n/th").then(m => m.Thai),
};

const FLAGS = {
  en: 'united-kingdom', hi: 'india', ar: 'saudi', bn: 'bangladesh',
  pt: 'portugal', es: 'spain', fr: 'france', ru: 'russia',
  de: 'germany', ja: 'japan', zh: 'china', ko: 'south-korea',
  it: 'italy', tr: 'turkey', vi: 'vietnam', th: 'thailand',
  nl: 'netherlands', pl: 'poland', ro: 'romania', sv: 'sweden',
  cs: 'czech-republic', da: 'denmark', fi: 'finland', el: 'greece',
  he: 'israel', hu: 'hungary', id: 'indonesia', ms: 'malaysia',
  no: 'norway', sk: 'slovakia', uk: 'ukraine', fa: 'iran',
  ta: 'india', te: 'india', mr: 'india', gu: 'india',
  kn: 'india', ml: 'india', pa: 'india', ur: 'pakistan',
  sw: 'tanzania', ha: 'nigeria', yo: 'nigeria', ig: 'nigeria',
  am: 'ethiopia', km: 'cambodia', lo: 'laos', my: 'myanmar',
  ne: 'nepal', si: 'sri-lanka',
};

const RTL_LANGS = ['ar', 'he', 'fa', 'ur'];

/** Build the locales map dynamically */
function buildLocales() {
  const locales = {};
  for (const [code, countries] of Object.entries(LANG_COUNTRIES)) {
    locales[code] = {
      label: getLabel(code),
      countries,
      dayjs: DAYJS_MAP[code] || (() => import('dayjs/locale/en')),
      flatpickr: FLATPKR_MAP[code] || null,
      i18n: () => import(`./locales/${code}/translations.json`),
      flag: FLAGS[code] || code,
      rtl: RTL_LANGS.includes(code),
    };
  }
  return locales;
}

function getLabel(code) {
  const LABELS = {
    en: 'English', hi: 'हिन्दी', ar: 'العربية', bn: 'বাংলা',
    pt: 'Português', es: 'Español', fr: 'Français', ru: 'Русский',
    de: 'Deutsch', ja: '日本語', zh: '中文', ko: '한국어',
    it: 'Italiano', tr: 'Türkçe', vi: 'Tiếng Việt', th: 'ไทย',
    nl: 'Nederlands', pl: 'Polski', ro: 'Română', sv: 'Svenska',
    cs: 'Čeština', da: 'Dansk', fi: 'Suomi', el: 'Ελληνικά',
    he: 'עברית', hu: 'Magyar', id: 'Bahasa Indonesia', ms: 'Bahasa Melayu',
    no: 'Norsk', sk: 'Slovenčina', uk: 'Українська', fa: 'فارسی',
    ta: 'தமிழ்', te: 'తెలుగు', mr: 'मराठी', gu: 'ગુજરાતી',
    kn: 'ಕನ್ನಡ', ml: 'മലയാളം', pa: 'ਪੰਜਾਬੀ', ur: 'اردو',
    sw: 'Kiswahili', ha: 'Hausa', yo: 'Yorùbá', ig: 'Igbo',
    am: 'አማርኛ', km: 'ភាសាខ្មែរ', lo: 'ລາວ', my: 'မြန်မာဘာသာ',
    ne: 'नेपाली', si: 'සිංහල',
  };
  return LABELS[code] || code;
}

export const locales = buildLocales();

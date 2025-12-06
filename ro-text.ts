/**
 * Romanian Text Constants
 * All user-facing text for the Viața Ortodoxă application
 */

export const RO_TEXT = {
  // Application
  app: {
    name: "Viața Ortodoxă",
    tagline: "Îndrumare. Rugăciune. Pace.",
  },

  // Buttons & Actions
  btn: {
    continue: "Continuă",
    start: "Începe Călătoria",
    back: "Înapoi",
    next: "Următorul",
    save: "Salvează",
    cancel: "Anulează",
    listen: "Ascultă",
    read: "Citește Articol",
    reset: "Resetare (Debug)",
    restart_onboarding: "Reia Configurarea",
  },

  // Navigation Tabs
  tab: {
    today: "Astăzi",
    calendar: "Calendar",
    prayers: "Rugăciuni",
    ai: "Întreabă AI",
    more: "Meniu",
  },

  // Onboarding
  onboarding: {
    welcome: {
      title: "Bun venit la Viața Ortodoxă",
      subtitle: "Companionul tău zilnic pentru rugăciune și pace.",
      desc: "Descoperă calendarul, ține postul și găsește pacea în rugăciune.",
    },
    select_tradition: "Alege Tradiția",
    features: {
      title: "Cum te ajută Viața Ortodoxă",
      subtitle: "Trusa ta spirituală.",
    },
    feat: {
      calendar: {
        title: "Calendar și Posturi",
        desc: "Urmărește sărbătorile și regulile de post.",
      },
      prayers: {
        title: "Bibliotecă de Rugăciuni",
        desc: "Dimineața, seara și nevoi speciale.",
      },
      guide: {
        title: "Ghid Practic",
        desc: "Explicații simple pentru viață.",
      },
      ai: {
        title: "Întreabă AI",
        desc: "Răspunsuri respectuoase din tradiție.",
      },
    },
  },

  // Today Page
  today: {
    loading: "Se încarcă...",
    quote: "Citatul Zilei",
    prayer_suggestion: "Rugăciune pentru azi",
    fast: {
      strict: "Post Negru/Strict",
      fish: "Dezlegare la Pește",
      oil: "Dezlegare la Ulei",
      dairy: "Dezlegare la Brânză",
      none: "Harți (Fără Post)",
      no_oil: "Post (Fără Ulei)",
    },
  },

  // Calendar
  calendar: {
    legend: "Legendă",
    legend_major: "Sărbătoare Mare",
    legend_strict: "Post Strict",
    legend_fish: "Pește",
    legend_oil: "Ulei și Vin",
    saints: "Sfinți",
    readings: "Evanghelia și Apostolul",
  },

  // Prayers
  prayers: {
    library: "Bibliotecă",
    generator: "Generator AI",
    search: "Caută rugăciuni...",
    cat: {
      all: "Toate",
      morning: "Dimineața",
      evening: "Seara",
      meal: "Masa",
      communion: "Împărtășanie",
      children: "Copii",
      health: "Sănătate",
      travel: "Călătorie",
      repentance: "Pocăință",
      psalms: "Psalmi",
    },
    gen: {
      title: "Creează o Rugăciune Personală",
      desc: "Descrie povara sau bucuria ta, iar noi vom scrie o rugăciune.",
      topic: "Subiect (ex. Anxietate, Mulțumire)",
      details: "Detalii (Opțional)",
      btn: "Generează Rugăciunea",
      writing: "Se scrie...",
      result: "Rugăciunea Ta",
    },
  },

  // AI Helper
  ai: {
    title: "Întreabă AI",
    subtitle: "Primește un sfat blând și folositor atunci când ai nevoie.",
    disclaimer: "Sunt un asistent AI. Răspunsurile mele se bazează pe învățături ortodoxe. Pentru sfaturi duhovnicești, discută cu preotul.",
    placeholder: "Pune o întrebare...",
    consulting: "Se consultă...",
    empty: "Cere și ți se va da; caută și vei afla.",
  },

  // Menu & Settings
  menu: {
    guide: "Ghid",
    audio: "Audio",
    settings: "Setări",
    about: "Despre",
  },

  settings: {
    appearance: "Aspect",
    tradition: "Tradiție",
    actions: "Acțiuni",
  },

  // Audio
  audio: {
    available: "Audio Disponibil",
    listen: "Ascultă",
  },

  // Guide
  guide: {
    read_time: "min citire",
  },

  // Traditions
  traditions: {
    RO: "România",
    RU: "Rusia",
    GR: "Grecia",
    SRB: "Serbia",
    USA: "Generic",
  },
} as const;

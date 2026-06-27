export type LocaleType = 'en' | 'es';

export interface Translations {
  wizard: {
    title: string;
    step: string;
    next: string;
    prev: string;
    launch: string;
    orgTitle: string;
    orgDesc: string;
    orgLabel: string;
    orgPlaceholder: string;
    wsTitle: string;
    wsDesc: string;
    wsLabel: string;
    wsPlaceholder: string;
    wsSlugLabel: string;
    wsSlugPlaceholder: string;
    busTitle: string;
    busDesc: string;
    busLabel: string;
    busPlaceholder: string;
    busCatLabel: string;
    socialTitle: string;
    socialDesc: string;
    socialConnectId: string;
    socialPlaceholder: string;
    socialConnectBtn: string;
    autoTitle: string;
    autoDesc: string;
    autoSelect: string;
    launchTitle: string;
    launchDesc: string;
    launchBtn: string;
  };
  navigation: {
    home: string;
    social: string;
    businesses: string;
    automation: string;
    content: string;
    calendar: string;
    media: string;
    analytics: string;
    assistant: string;
    marketplace: string;
    reports: string;
    settings: string;
    activeWorkspace: string;
    role: string;
  };
  dashboard: {
    title: string;
    subtitle: string;
    postsPublished: string;
    successRate: string;
    registeredBus: string;
    roi: string;
    timeSaved: string;
    connectedCount: string;
    activeStatus: string;
    runningStatus: string;
    recentActivity: string;
    recentActivityDesc: string;
    aiSuggestions: string;
    aiSuggestionsDesc: string;
    viewAll: string;
  };
  commandPalette: {
    placeholder: string;
    noResults: string;
    shortcuts: string;
  };
  settings: {
    title: string;
    themeLabel: string;
    langLabel: string;
    colorLabel: string;
  };
  business: {
    tabs: {
      dashboard: string;
      channels: string;
      campaigns: string;
      media: string;
      team: string;
      settings: string;
      health: string;
      notifications: string;
    };
    kpis: {
      followers: string;
      reach: string;
      engagement: string;
      posts: string;
      campaigns: string;
      automations: string;
      leads: string;
      timeSaved: string;
    };
    roles: {
      owner: string;
      manager: string;
      marketing: string;
      creator: string;
      sales: string;
      support: string;
      analyst: string;
      viewer: string;
      guest: string;
    };
    health: {
      score: string;
      channels: string;
      automations: string;
      team: string;
      branding: string;
    };
  };
}

export const translations: Record<LocaleType, Translations> = {
  en: {
    wizard: {
      title: "Workspace Onboarding",
      step: "Step",
      next: "Next Step",
      prev: "Back",
      launch: "Launch Portal",
      orgTitle: "Let's build your Organization",
      orgDesc: "Set up the top-level parent tenant structure for your business groups and billing.",
      orgLabel: "Organization Name",
      orgPlaceholder: "e.g., Acme Corporation",
      wsTitle: "Create your Workspace",
      wsDesc: "Workspaces isolate campaigns, credentials, configurations, and custom domains.",
      wsLabel: "Workspace Name",
      wsPlaceholder: "e.g., Enterprise Workspace",
      wsSlugLabel: "Workspace Slug (URL-friendly)",
      wsSlugPlaceholder: "e.g., enterprise-workspace",
      busTitle: "Register First Business Unit",
      busDesc: "Businesses partitions assets, team roles, and social channels locally.",
      busLabel: "Business Name",
      busPlaceholder: "e.g., Acme Sales Team",
      busCatLabel: "Business Category",
      socialTitle: "Connect Social Networks",
      socialDesc: "Linked profiles will be isolated dynamically using SOCKS5 residential proxies.",
      socialConnectId: "Connection Identifier / Username",
      socialPlaceholder: "e.g., acme_sales_ig",
      socialConnectBtn: "Connect with OAuth",
      autoTitle: "Choose First Automation",
      autoDesc: "Select an automated content pipeline template to boot your workspace.",
      autoSelect: "Select Template",
      launchTitle: "Deploy Workspace Operating System",
      launchDesc: "Ready to launch! The engine will finalize capacity reservations and boot your workbench.",
      launchBtn: "Launch Workspace Portal"
    },
    navigation: {
      home: "Workspace Home",
      social: "Social Accounts",
      businesses: "Businesses",
      automation: "Automation Studio",
      content: "Content Library",
      calendar: "Content Calendar",
      media: "Media Center",
      analytics: "Customer Analytics",
      assistant: "AI Assistant",
      marketplace: "Marketplace Hub",
      reports: "Reports Manager",
      settings: "Workspace Settings",
      activeWorkspace: "Active Workspace",
      role: "Client Operator"
    },
    dashboard: {
      title: "Workspace Operations Overview",
      subtitle: "Monitor active marketing channels, secure credential environments, and automated pipelines.",
      postsPublished: "Posts Published",
      successRate: "Automation Success",
      registeredBus: "Registered Businesses",
      roi: "Estimated ROI",
      timeSaved: "Time Saved",
      connectedCount: "Connected Channels",
      activeStatus: "Active",
      runningStatus: "Running",
      recentActivity: "Recent Activity Timeline",
      recentActivityDesc: "Historical sequence of sync events, worker runs, and publications.",
      aiSuggestions: "AI Recommendations",
      aiSuggestionsDesc: "Actionable prompts built on current workspace context and metrics.",
      viewAll: "View All"
    },
    commandPalette: {
      placeholder: "Type a command or module name (e.g. settings)...",
      noResults: "No matching commands found.",
      shortcuts: "Shortcuts: Ctrl+K to open, Esc to close, Arrow keys to navigate"
    },
    settings: {
      title: "Workspace Branding & Configurations",
      themeLabel: "Theme Mode",
      langLabel: "Language",
      colorLabel: "Brand Primary Color"
    },
    business: {
      tabs: {
        dashboard: "Dashboard",
        channels: "Channels",
        campaigns: "Campaigns",
        media: "Media Center",
        team: "Team",
        settings: "Settings",
        health: "Health",
        notifications: "Notifications"
      },
      kpis: {
        followers: "Followers",
        reach: "Reach",
        engagement: "Engagement",
        posts: "Posts",
        campaigns: "Campaigns",
        automations: "Automations",
        leads: "Leads",
        timeSaved: "Time Saved"
      },
      roles: {
        owner: "Owner",
        manager: "Manager",
        marketing: "Marketing",
        creator: "Content Creator",
        sales: "Sales",
        support: "Support",
        analyst: "Analyst",
        viewer: "Viewer",
        guest: "Guest"
      },
      health: {
        score: "Health Score",
        channels: "Connected Channels",
        automations: "Active Automations",
        team: "Team Members",
        branding: "Custom Branding"
      }
    }
  },
  es: {
    wizard: {
      title: "Onboarding del Espacio de Trabajo",
      step: "Paso",
      next: "Siguiente Paso",
      prev: "Atrás",
      launch: "Iniciar Portal",
      orgTitle: "Construyamos tu Organización",
      orgDesc: "Configura la estructura organizativa superior para tus marcas y facturación.",
      orgLabel: "Nombre de la Organización",
      orgPlaceholder: "ej., Corporación Acme",
      wsTitle: "Crea tu Espacio de Trabajo",
      wsDesc: "Los espacios de trabajo aíslan campañas, credenciales, configuraciones y dominios.",
      wsLabel: "Nombre del Espacio de Trabajo",
      wsPlaceholder: "ej., Espacio Empresarial",
      wsSlugLabel: "Slug del Espacio (amigable para URL)",
      wsSlugPlaceholder: "ej., espacio-empresarial",
      busTitle: "Registrar Primera Unidad de Negocio",
      busDesc: "Las empresas dividen localmente recursos, roles de equipo y canales.",
      busLabel: "Nombre de la Empresa",
      busPlaceholder: "ej., Equipo de Ventas Acme",
      busCatLabel: "Categoría de la Empresa",
      socialTitle: "Conectar Redes Sociales",
      socialDesc: "Los perfiles vinculados se aislarán mediante proxies residenciales SOCKS5.",
      socialConnectId: "Identificador de Conexión / Usuario",
      socialPlaceholder: "ej., acme_ventas_ig",
      socialConnectBtn: "Conectar con OAuth",
      autoTitle: "Elige la Primera Automatización",
      autoDesc: "Selecciona una plantilla de flujo de contenido automatizado para iniciar.",
      autoSelect: "Seleccionar Plantilla",
      launchTitle: "Desplegar Sistema Operativo del Espacio",
      launchDesc: "¡Listo para iniciar! El motor reservará la capacidad y activará tu mesa de trabajo.",
      launchBtn: "Iniciar Portal del Espacio de Trabajo"
    },
    navigation: {
      home: "Inicio del Espacio",
      social: "Cuentas Sociales",
      businesses: "Empresas",
      automation: "Estudio de Automatización",
      content: "Biblioteca de Contenidos",
      calendar: "Calendario de Contenidos",
      media: "Centro de Medios",
      analytics: "Analítica de Clientes",
      assistant: "Asistente de IA",
      marketplace: "Portal de Plugins",
      reports: "Gestor de Reportes",
      settings: "Ajustes del Espacio",
      activeWorkspace: "Espacio Activo",
      role: "Operador de Cliente"
    },
    dashboard: {
      title: "Resumen de Operaciones del Espacio",
      subtitle: "Supervisa tus canales activos, entornos de credenciales seguros y flujos automatizados.",
      postsPublished: "Posts Publicados",
      successRate: "Éxito de Automatización",
      registeredBus: "Empresas Registradas",
      roi: "ROI Estimado",
      timeSaved: "Tiempo Ahorrado",
      connectedCount: "Canales Conectados",
      activeStatus: "Activo",
      runningStatus: "En Ejecución",
      recentActivity: "Línea de Actividad Reciente",
      recentActivityDesc: "Secuencia histórica de eventos de sincronización, ejecuciones y publicaciones.",
      aiSuggestions: "Recomendaciones de IA",
      aiSuggestionsDesc: "Sugerencias prácticas basadas en el contexto y analíticas de tu espacio.",
      viewAll: "Ver Todo"
    },
    commandPalette: {
      placeholder: "Escribe un comando o nombre de módulo (ej. ajustes)...",
      noResults: "No se encontraron comandos coincidentes.",
      shortcuts: "Atajos: Ctrl+K para abrir, Esc para cerrar, Flechas para navegar"
    },
    settings: {
      title: "Configuración y Marca del Espacio de Trabajo",
      themeLabel: "Modo de Tema",
      langLabel: "Idioma",
      colorLabel: "Color Primario de Marca"
    },
    business: {
      tabs: {
        dashboard: "Panel",
        channels: "Canales",
        campaigns: "Campañas",
        media: "Centro de Medios",
        team: "Equipo",
        settings: "Ajustes",
        health: "Salud",
        notifications: "Notificaciones"
      },
      kpis: {
        followers: "Seguidores",
        reach: "Alcance",
        engagement: "Interacción",
        posts: "Publicaciones",
        campaigns: "Campañas",
        automations: "Automatizaciones",
        leads: "Clientes Potenciales",
        timeSaved: "Tiempo Ahorrado"
      },
      roles: {
        owner: "Propietario",
        manager: "Gerente",
        marketing: "Marketing",
        creator: "Creador de Contenido",
        sales: "Ventas",
        support: "Soporte",
        analyst: "Analista",
        viewer: "Espectador",
        guest: "Invitado"
      },
      health: {
        score: "Puntuación de Salud",
        channels: "Canales Conectados",
        automations: "Automatizaciones Activas",
        team: "Miembros del Equipo",
        branding: "Marca Personalizada"
      }
    }
  }
};

module.exports = {
  OWNER_IDS: [""], // IDs dos proprietários do bot
  SUPPORT_SERVER: "", // Seu servidor de suporte para o bot
  PREFIX_COMMANDS: {
    ENABLED: true, // Ativar/Desativar comandos de prefixo
    DEFAULT_PREFIX: "!", // Prefixo padrão para o bot
  },
  INTERACTIONS: {
    SLASH: true, // Habilitar interações do tipo slash
    CONTEXT: true, // Habilitar contextos
    GLOBAL: true, // Registrar interações globalmente
    TEST_GUILD_ID: "xxxxxxxxxxx", // ID do servidor onde as interações devem ser registradas. [** Teste seus comandos aqui primeiro **]
  },
  EMBED_COLORS: {
    BOT_EMBED: "#068ADD",
    TRANSPARENT: "#36393F",
    SUCCESS: "#00A56A",
    ERROR: "#D61A3C",
    WARNING: "#F7E919",
  },
  CACHE_SIZE: {
    GUILDS: 100,
    USERS: 10000,
    MEMBERS: 10000,
  },
  MESSAGES: {
    API_ERROR: "Erro inesperado no backend! Tente novamente mais tarde ou entre em contato com o servidor de suporte",
  },

  // PLUGINS

  AUTOMOD: {
    ENABLED: true,
    LOG_EMBED: "#36393F",
    DM_EMBED: "#36393F",
  },

  DASHBOARD: {
    enabled: true, // Habilitar ou desabilitar o painel
    baseURL: "http://localhost:8080", // URL base
    failureURL: "http://localhost:8080", // URL de redirecionamento em caso de falha
    port: "8080", // Porta para executar o bot
  },

  ECONOMY: {
    ENABLED: true,
    CURRENCY: "₪",
    DAILY_COINS: 100, // Moedas a serem recebidas pelo comando diário
    MIN_BEG_AMOUNT: 100, // Quantidade mínima de moedas a ser recebida no comando beg
    MAX_BEG_AMOUNT: 2500, // Quantidade máxima de moedas a ser recebida no comando beg
  },

  MUSIC: {
    ENABLED: true,
    IDLE_TIME: 60, // Tempo em segundos antes do bot se desconectar de um canal de voz ocioso
    MAX_SEARCH_RESULTS: 5,
    DEFAULT_SOURCE: "SC", // YT = Youtube, YTM = Youtube Music, SC = SoundCloud
    // Adicione qualquer número de nós do Lavalink aqui
    // Consulte https://github.com/freyacodes/Lavalink para hospedar seu próprio servidor Lavalink
    LAVALINK_NODES: [
      {
        host: "localhost",
        port: 2333,
        password: "youshallnotpass",
        id: "Local Node",
        secure: true,
      },
    ],
  },

  GIVEAWAYS: {
    ENABLED: true,
    REACTION: "🎁",
    START_EMBED: "#FF468A",
    END_EMBED: "#FF468A",
  },

  IMAGE: {
    ENABLED: true,
    BASE_API: "https://strangeapi.hostz.me/api",
  },

  INVITE: {
    ENABLED: true,
  },

  MODERATION: {
    ENABLED: true,
    EMBED_COLORS: {
      TIMEOUT: "#102027",
      UNTIMEOUT: "#4B636E",
      KICK: "#FF7961",
      SOFTBAN: "#AF4448",
      BAN: "#D32F2F",
      UNBAN: "#00C853",
      VMUTE: "#102027",
      VUNMUTE: "#4B636E",
      DEAFEN: "#102027",
      UNDEAFEN: "#4B636E",
      DISCONNECT: "RANDOM",
      MOVE: "RANDOM",
    },
  },

  PRESENCE: {
    ENABLED: true, // Se o bot deve ou não atualizar seu status
    STATUS: "online", // O status do bot [online, idle, dnd, invisible]
    TYPE: "WATCHING", // Tipo de status para o bot [PLAYING | LISTENING | WATCHING | COMPETING]
    MESSAGE: "{members} membros em {servers} servidores", // Mensagem de status do bot
  },

  STATS: {
    ENABLED: true,
    XP_COOLDOWN: 5, // Tempo de cooldown em segundos entre mensagens
    DEFAULT_LVL_UP_MSG: "{member:tag}, Você acabou de avançar para o **Nível {level}**",
  },

  SUGGESTIONS: {
    ENABLED: true, // Se o sistema de sugestões deve ser habilitado
    EMOJI: {
      UP_VOTE: "⬆️",
      DOWN_VOTE: "⬇️",
    },
    DEFAULT_EMBED: "#4F545C",
    APPROVED_EMBED: "#43B581",
    DENIED_EMBED: "#F04747",
  },

  TICKET: {
    ENABLED: true,
    CREATE_EMBED: "#068ADD",
    CLOSE_EMBED: "#068ADD",
  },

  SHOP: {
    ENABLED: true,
    CURRENCY: "💰",
    TAX_RATE: 0.1,
    MAX_PRODUCTS_PER_USER: 10,
    PRODUCT_CATEGORIES: [],
    FEATURED_PRODUCTS: [], // Inicialmente vazio, pois será preenchido automaticamente
    // Adicione outras configurações conforme necessário
  },
  
};

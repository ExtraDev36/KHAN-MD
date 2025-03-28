const fs = require('fs');
const { getConfigSafe } = require('./data/ConfigDB');

// Load environment variables
if (fs.existsSync('.env')) {
  require('dotenv').config();
} else if (fs.existsSync('config.env')) {
  require('dotenv').config({ path: './config.env' });
} else {
  console.warn('⚠️ No .env file found! Using defaults');
}

// Helper function
const bool = (val, def = false) => {
  if (val === undefined) return def;
  return val === 'true' || val === true;
};

// Default configuration
const defaults = {
  // Core Settings
  SESSION_ID: "",
  PREFIX: ".",
  BOT_NAME: "KHAN-MD",
  MODE: "public",
  
  // Features
  AUTO_STATUS_SEEN: true,
  AUTO_STATUS_REACT: true,
  AUTO_STATUS_REPLY: false,
  READ_MESSAGE: false,
  AUTO_REACT: false,
  ANTI_BAD: false,
  ANTI_LINK: true,
  ANTI_VV: true,
  CUSTOM_REACT: false,
  DELETE_LINKS: false,
  AUTO_VOICE: false,
  AUTO_STICKER: false,
  AUTO_REPLY: false,
  ALWAYS_ONLINE: false,
  PUBLIC_MODE: true,
  AUTO_TYPING: false,
  READ_CMD: false,
  AUTO_RECORDING: false,

  // Content
  STICKER_NAME: "KHAN-MD",
  OWNER_NUMBER: "92342758XXXX",
  OWNER_NAME: "Jᴀᴡᴀᴅ TᴇᴄʜX",
  DESCRIPTION: "*© ᴘᴏᴡᴇʀᴇᴅ ʙʏ Jᴀᴡᴀᴅ TᴇᴄʜX*",
  ALIVE_IMG: "https://files.catbox.moe/149k8x.jpg",
  LIVE_MSG: "> Zinda Hun Yar *KHAN-MD*⚡",
  AUTO_STATUS_MSG: "*SEEN YOUR STATUS BY KHAN-MD 🤍*",
  CUSTOM_REACT_EMOJIS: "💝,💖,💗,❤️‍🩹,❤️,🧡,💛,💚,💙,💜,🤎,🖤,🤍",
  ANTI_DEL_PATH: "log",
  DEV: "923427582273"
};

class Config {
  constructor() {
    this.data = { ...defaults };
    this.load();
  }

  async load() {
    try {
      // 1. Load from database
      const dbConfig = await getConfigSafe() || {};
      
      // 2. Merge with environment variables
      this.data = {
        ...defaults,
        ...dbConfig,
        SESSION_ID: process.env.SESSION_ID || "",
        PREFIX: process.env.PREFIX || defaults.PREFIX,
        BOT_NAME: process.env.BOT_NAME || defaults.BOT_NAME,
        MODE: process.env.MODE || defaults.MODE,
        AUTO_STATUS_SEEN: process.env.AUTO_STATUS_SEEN !== undefined ? bool(process.env.AUTO_STATUS_SEEN) : defaults.AUTO_STATUS_SEEN,
        AUTO_STATUS_REACT: process.env.AUTO_STATUS_REACT !== undefined ? bool(process.env.AUTO_STATUS_REACT) : defaults.AUTO_STATUS_REACT,
        AUTO_STATUS_REPLY: process.env.AUTO_STATUS_REPLY !== undefined ? bool(process.env.AUTO_STATUS_REPLY) : defaults.AUTO_STATUS_REPLY,
        READ_MESSAGE: process.env.READ_MESSAGE !== undefined ? bool(process.env.READ_MESSAGE) : defaults.READ_MESSAGE,
        AUTO_REACT: process.env.AUTO_REACT !== undefined ? bool(process.env.AUTO_REACT) : defaults.AUTO_REACT,
        ANTI_BAD: process.env.ANTI_BAD !== undefined ? bool(process.env.ANTI_BAD) : defaults.ANTI_BAD,
        ANTI_LINK: process.env.ANTI_LINK !== undefined ? bool(process.env.ANTI_LINK) : defaults.ANTI_LINK,
        ANTI_VV: process.env.ANTI_VV !== undefined ? bool(process.env.ANTI_VV) : defaults.ANTI_VV,
        CUSTOM_REACT: process.env.CUSTOM_REACT !== undefined ? bool(process.env.CUSTOM_REACT) : defaults.CUSTOM_REACT,
        DELETE_LINKS: process.env.DELETE_LINKS !== undefined ? bool(process.env.DELETE_LINKS) : defaults.DELETE_LINKS,
        AUTO_VOICE: process.env.AUTO_VOICE !== undefined ? bool(process.env.AUTO_VOICE) : defaults.AUTO_VOICE,
        AUTO_STICKER: process.env.AUTO_STICKER !== undefined ? bool(process.env.AUTO_STICKER) : defaults.AUTO_STICKER,
        AUTO_REPLY: process.env.AUTO_REPLY !== undefined ? bool(process.env.AUTO_REPLY) : defaults.AUTO_REPLY,
        ALWAYS_ONLINE: process.env.ALWAYS_ONLINE !== undefined ? bool(process.env.ALWAYS_ONLINE) : defaults.ALWAYS_ONLINE,
        PUBLIC_MODE: process.env.PUBLIC_MODE !== undefined ? bool(process.env.PUBLIC_MODE) : defaults.PUBLIC_MODE,
        AUTO_TYPING: process.env.AUTO_TYPING !== undefined ? bool(process.env.AUTO_TYPING) : defaults.AUTO_TYPING,
        READ_CMD: process.env.READ_CMD !== undefined ? bool(process.env.READ_CMD) : defaults.READ_CMD,
        AUTO_RECORDING: process.env.AUTO_RECORDING !== undefined ? bool(process.env.AUTO_RECORDING) : defaults.AUTO_RECORDING,
        STICKER_NAME: process.env.STICKER_NAME || defaults.STICKER_NAME,
        OWNER_NUMBER: process.env.OWNER_NUMBER || defaults.OWNER_NUMBER,
        OWNER_NAME: process.env.OWNER_NAME || defaults.OWNER_NAME,
        DESCRIPTION: process.env.DESCRIPTION || defaults.DESCRIPTION,
        ALIVE_IMG: process.env.ALIVE_IMG || defaults.ALIVE_IMG,
        LIVE_MSG: process.env.LIVE_MSG || defaults.LIVE_MSG,
        AUTO_STATUS_MSG: process.env.AUTO_STATUS_MSG || defaults.AUTO_STATUS_MSG,
        CUSTOM_REACT_EMOJIS: process.env.CUSTOM_REACT_EMOJIS || defaults.CUSTOM_REACT_EMOJIS,
        ANTI_DEL_PATH: process.env.ANTI_DEL_PATH || defaults.ANTI_DEL_PATH,
        DEV: process.env.DEV || defaults.DEV
      };

      // 3. Validate
      if (!this.data.SESSION_ID) {
        throw new Error("❌ SESSION_ID is required in .env file!");
      }

      console.log('✅ Config loaded successfully');
    } catch (error) {
      console.error('Config Error:', error.message);
      process.exit(1);
    }
  }

  get(key) {
    return this.data[key];
  }

  getAll() {
    return { ...this.data };
  }
}

module.exports = new Config();

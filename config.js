const fs = require('fs');
const path = require('path');
const { getConfigSafe } = require('./data/ConfigDB');

// ==============================================
// ENVIRONMENT LOADER (Foolproof)
// ==============================================
const ENV_PATH = path.resolve(__dirname, '.env');
if (fs.existsSync(ENV_PATH)) {
  // Clear Node's environment cache
  Object.keys(process.env)
    .filter(key => key.startsWith('SESSION_') || Object.keys(DEFAULTS).includes(key))
    .forEach(key => delete process.env[key]);

  require('dotenv').config({ path: ENV_PATH, override: true });
  console.log(`✅ Environment loaded from: ${ENV_PATH}`);
} else {
  console.warn(`⚠️ No .env file found at: ${ENV_PATH}`);
}

// ==============================================
// COMPLETE DEFAULTS (All Variables)
// ==============================================
const DEFAULTS = {
  // REQUIRED (must come from environment)
  SESSION_ID: "",

  // CORE SETTINGS
  PREFIX: ".",
  BOT_NAME: "KHAN-MD",
  STICKER_NAME: "KHAN-MD",
  MODE: "public",
  DEV: "923427582273",
  ANTI_DEL_PATH: "log",

  // FEATURE TOGGLES (Booleans)
  AUTO_STATUS_SEEN: true,
  AUTO_STATUS_REACT: true,
  AUTO_STATUS_REPLY: false,
  CUSTOM_REACT: false,
  DELETE_LINKS: false,
  READ_MESSAGE: false,
  AUTO_REACT: false,
  ANTI_BAD: false,
  ANTI_LINK: true,
  AUTO_VOICE: false,
  AUTO_STICKER: false,
  AUTO_REPLY: false,
  ALWAYS_ONLINE: false,
  PUBLIC_MODE: true,
  AUTO_TYPING: false,
  READ_CMD: false,
  ANTI_VV: true,
  AUTO_RECORDING: false,

  // CONTENT (Strings/Arrays)
  OWNER_NUMBER: "92342758XXXX",
  OWNER_NAME: "Jᴀᴡᴀᴅ TᴇᴄʜX",
  DESCRIPTION: "*© ᴘᴏᴡᴇʀᴇᴅ ʙʏ Jᴀᴡᴀᴅ TᴇᴄʜX*",
  ALIVE_IMG: "https://files.catbox.moe/149k8x.jpg",
  LIVE_MSG: "> Zinda Hun Yar *KHAN-MD*⚡",
  AUTO_STATUS_MSG: "*SEEN YOUR STATUS BY KHAN-MD 🤍*",
  CUSTOM_REACT_EMOJIS: "💝,💖,💗,❤️‍🩹,❤️,🧡,💛,💚,💙,💜,🤎,🖤,🤍"
};

// ==============================================
// CONFIG MANAGER (Final Version)
// ==============================================
class Config {
  constructor() {
    this.data = { ...DEFAULTS };
    this.initialize().catch(err => {
      console.error('⛔ FATAL CONFIG ERROR:', err.message);
      process.exit(1);
    });
  }

  async initialize() {
    try {
      // 1. Load from all sources
      const [dbConfig, envConfig] = await Promise.all([
        this.loadDatabaseConfig(),
        this.loadEnvConfig()
      ]);

      // 2. Merge with priority: ENV > DB > DEFAULTS
      this.data = {
        ...DEFAULTS,
        ...dbConfig,
        ...envConfig
      };

      // 3. Final validation
      this.validate();

      console.log('✅ Config fully loaded');
      this.logConfigSummary();

    } catch (error) {
      throw new Error(`Config failed: ${error.message}`);
    }
  }

  async loadDatabaseConfig() {
    try {
      const dbConfig = await getConfigSafe() || {};
      console.log(`💾 Loaded ${Object.keys(dbConfig).length} DB settings`);
      return dbConfig;
    } catch (error) {
      console.error('⚠️ DB Config Error:', error.message);
      return {};
    }
  }

  loadEnvConfig() {
    const envConfig = {};
    
    // Process ALL possible environment variables
    for (const [key, defaultValue] of Object.entries(DEFAULTS)) {
      if (process.env[key] !== undefined) {
        envConfig[key] = this.parseEnvValue(process.env[key], defaultValue);
      }
    }

    console.log(`🌐 Loaded ${Object.keys(envConfig).length} env variables`);
    return envConfig;
  }

  parseEnvValue(value, defaultValue) {
    // Handle booleans
    if (typeof defaultValue === 'boolean') {
      return value.toLowerCase() === 'true';
    }
    // Handle arrays (like emojis)
    if (Array.isArray(defaultValue)) {
      return value.split(',').map(item => item.trim());
    }
    // All other values as strings
    return String(value);
  }

  validate() {
    const errors = [];
    
    if (!this.data.SESSION_ID) {
      errors.push('SESSION_ID is REQUIRED in .env file');
    }

    if (errors.length > 0) {
      throw new Error(`Configuration invalid:\n${errors.join('\n')}`);
    }
  }

  logConfigSummary() {
    console.log('🔧 Active Configuration:');
    console.log('- Mode:', this.data.MODE);
    console.log('- Prefix:', this.data.PREFIX);
    console.log('- Owner:', this.data.OWNER_NAME);
    console.log('- Features:', {
      ANTI_LINK: this.data.ANTI_LINK,
      AUTO_REACT: this.data.AUTO_REACT,
      ANTI_VV: this.data.ANTI_VV
    });
  }

  get(key) {
    const value = this.data[key];
    if (value === undefined) {
      console.warn(`⚠️ Unknown config key: ${key}`);
    }
    return value;
  }

  getAll() {
    return { ...this.data };
  }
}

// ==============================================
// SINGLETON EXPORT
// ==============================================
module.exports = new Config();

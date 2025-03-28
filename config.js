const fs = require('fs');
const path = require('path');
const { getConfigSafe } = require('./data/ConfigDB');

// ==============================================
// ENVIRONMENT LOADER (Fixed ReferenceError)
// ==============================================
const loadEnvironment = () => {
  const envPath = path.join(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    require('dotenv').config({ path: envPath });
    console.log(`✅ Environment loaded from: ${envPath}`);
    return true;
  }
  console.warn('⚠️ No .env file found at:', envPath);
  return false;
};

// Initialize environment first
loadEnvironment();

// ==============================================
// COMPLETE CONFIGURATION DEFAULTS
// ==============================================
const DEFAULTS = {
  // REQUIRED
  SESSION_ID: "", // Must come from environment
  
  // CORE SETTINGS
  PREFIX: ".",
  BOT_NAME: "KHAN-MD",
  STICKER_NAME: "KHAN-MD",
  MODE: "public",
  DEV: "923427582273",
  ANTI_DEL_PATH: "log",
  
  // FEATURE TOGGLES
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

  // CONTENT
  OWNER_NUMBER: "92342758XXXX",
  OWNER_NAME: "Jᴀᴡᴀᴅ TᴇᴄʜX",
  DESCRIPTION: "*© ᴘᴏᴡᴇʀᴇᴅ ʙʏ Jᴀᴡᴀᴅ TᴇᴄʜX*",
  ALIVE_IMG: "https://files.catbox.moe/149k8x.jpg",
  LIVE_MSG: "> Zinda Hun Yar *KHAN-MD*⚡",
  AUTO_STATUS_MSG: "*SEEN YOUR STATUS BY KHAN-MD 🤍*",
  CUSTOM_REACT_EMOJIS: "💝,💖,💗,❤️‍🩹,❤️,🧡,💛,💚,💙,💜,🤎,🖤,🤍"
};

// ==============================================
// CONFIGURATION MANAGER (Fixed)
// ==============================================
class Config {
  constructor() {
    this.data = { ...DEFAULTS };
    this.initialize().catch(err => {
      console.error('⛔ Config Error:', err.message);
      process.exit(1);
    });
  }

  async initialize() {
    try {
      // 1. Load from SQL Database
      const dbConfig = await this.loadDatabaseConfig();
      
      // 2. Load environment variables
      const envConfig = this.loadEnvConfig();
      
      // 3. Merge (ENV > DB > DEFAULTS)
      this.data = {
        ...DEFAULTS,
        ...dbConfig,
        ...envConfig
      };

      // 4. Validate
      this.validate();

      console.log('✅ Config loaded successfully');
      console.log('🔧 Active Mode:', this.data.MODE);
      console.log('⚙️ Features:', {
        ANTI_LINK: this.data.ANTI_LINK,
        AUTO_REACT: this.data.AUTO_REACT
      });

    } catch (error) {
      throw new Error(`Initialization failed: ${error.message}`);
    }
  }

  async loadDatabaseConfig() {
    try {
      const config = await getConfigSafe();
      return config || {};
    } catch (error) {
      console.error('⚠️ DB Error:', error.message);
      return {};
    }
  }

  loadEnvConfig() {
    const envConfig = {};
    
    // Process all possible environment variables
    for (const [key, defaultValue] of Object.entries(DEFAULTS)) {
      if (process.env[key] !== undefined) {
        envConfig[key] = this.parseValue(process.env[key], defaultValue);
      }
    }
    
    return envConfig;
  }

  parseValue(value, defaultValue) {
    // Handle boolean values
    if (typeof defaultValue === 'boolean') {
      return value.toLowerCase() === 'true';
    }
    // Handle arrays
    if (Array.isArray(defaultValue)) {
      return value.split(',').map(item => item.trim());
    }
    // Everything else as string
    return String(value);
  }

  validate() {
    if (!this.data.SESSION_ID) {
      throw new Error(`
        SESSION_ID is required!
        Add to .env file:
        SESSION_ID="your_session_key_here"
      `);
    }
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
// EXPORT INITIALIZED CONFIG
// ==============================================
module.exports = new Config();

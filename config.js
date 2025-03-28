const fs = require('fs');
const path = require('path');
const { getConfigSafe } = require('./data/ConfigDB');

// ==============================================
// ENVIRONMENT LOADER
// ==============================================
const loadEnvironment = () => {
  const envPaths = [
    path.join(__dirname, '.env'),
    path.join(process.cwd(), '.env')
  ];

  for (const envPath of envPaths) {
    if (fs.existsSync(envPath)) {
      require('dotenv').config({ path: envPath });
      console.log(`✅ Loaded environment from: ${envPath}`);
      return true;
    }
  }
  
  console.warn('⚠️ No .env file found in:', envPaths);
  return false;
};

loadEnvironment();

// ==============================================
// CONFIGURATION DEFAULTS
// ==============================================
const DEFAULTS = {
  // REQUIRED (must come from environment)
  SESSION_ID: "",
  
  // CORE SETTINGS
  PREFIX: ".",
  BOT_NAME: "KHAN-MD",
  MODE: "public",
  DEV: "923427582273",
  
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
  STICKER_NAME: "KHAN-MD",
  OWNER_NUMBER: "92342758XXXX",
  OWNER_NAME: "Jᴀᴡᴀᴅ TᴇᴄʜX",
  DESCRIPTION: "*© ᴘᴏᴡᴇʀᴇᴅ ʙʏ Jᴀᴡᴀᴅ TᴇᴄʜX*",
  ALIVE_IMG: "https://files.catbox.moe/149k8x.jpg",
  LIVE_MSG: "> Zinda Hun Yar *KHAN-MD*⚡",
  AUTO_STATUS_MSG: "*SEEN YOUR STATUS BY KHAN-MD 🤍*",
  CUSTOM_REACT_EMOJIS: "💝,💖,💗,❤️‍🩹,❤️,🧡,💛,💚,💙,💜,🤎,🖤,🤍",
  ANTI_DEL_PATH: "log"
};

// ==============================================
// CONFIGURATION MANAGER
// ==============================================
class Config {
  constructor() {
    this.data = { ...DEFAULTS };
    this.initialize();
  }

  async initialize() {
    try {
      // 1. Load from SQL Database
      const dbConfig = await this.loadDatabaseConfig();
      
      // 2. Load from Environment
      const envConfig = this.loadEnvConfig();
      
      // 3. Merge configurations (ENV > DB > DEFAULTS)
      this.data = {
        ...DEFAULTS,
        ...dbConfig,
        ...envConfig
      };

      // 4. Validate
      this.validate();

      console.log('✅ Configuration loaded successfully');
      this.logConfigStatus();

    } catch (error) {
      console.error('⛔ Config initialization failed:', error.message);
      process.exit(1);
    }
  }

  async loadDatabaseConfig() {
    try {
      const dbConfig = await getConfigSafe() || {};
      console.log(`💾 Loaded ${Object.keys(dbConfig).length} settings from database`);
      return dbConfig;
    } catch (error) {
      console.error('⚠️ Database config load failed:', error.message);
      return {};
    }
  }

  loadEnvConfig() {
    const envConfig = {};
    
    // Process all possible environment variables
    for (const [key, defaultValue] of Object.entries(DEFAULTS)) {
      if (process.env[key] !== undefined) {
        // Handle boolean values
        if (typeof defaultValue === 'boolean') {
          envConfig[key] = process.env[key].toLowerCase() === 'true';
        } 
        // Handle string values
        else {
          envConfig[key] = process.env[key];
        }
      }
    }
    
    return envConfig;
  }

  validate() {
    const errors = [];
    
    if (!this.data.SESSION_ID) {
      errors.push('SESSION_ID is required in .env file');
    }
    
    if (this.data.SESSION_ID === DEFAULTS.SESSION_ID) {
      console.warn('⚠️ Using empty SESSION_ID! Bot will not connect');
    }
    
    if (errors.length > 0) {
      throw new Error(`Configuration errors:\n${errors.join('\n')}`);
    }
  }

  logConfigStatus() {
    console.log('🔧 Active configuration:');
    console.log('- Mode:', this.data.MODE);
    console.log('- Prefix:', this.data.PREFIX);
    console.log('- Features:', {
      ANTI_LINK: this.data.ANTI_LINK,
      AUTO_REACT: this.data.AUTO_REACT,
      ANTI_VV: this.data.ANTI_VV
    });
  }

  get(key) {
    if (!(key in this.data)) {
      console.warn(`⚠️ Unknown config key: ${key}`);
      return undefined;
    }
    return this.data[key];
  }

  getAll() {
    return { ...this.data };
  }
}

// ==============================================
// EXPORT SINGLETON INSTANCE
// ==============================================
module.exports = new Config();

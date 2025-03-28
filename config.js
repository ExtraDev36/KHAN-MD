const fs = require('fs');
const path = require('path');
const { getConfigSafe } = require('./data/ConfigDB');

// ==============================================
// ENVIRONMENT LOADER (Debugging Enhanced)
// ==============================================
const ENV_PATH = path.resolve(__dirname, '.env');
console.log(`🔍 Looking for .env at: ${ENV_PATH}`);

if (fs.existsSync(ENV_PATH)) {
  // DEBUG: Show raw file content
  console.log('📄 .env content:', fs.readFileSync(ENV_PATH, 'utf8'));
  
  // Clear Node's env cache
  Object.keys(process.env).forEach(key => {
    if (key.startsWith('SESSION_') || key === 'PREFIX') {
      delete process.env[key];
    }
  });

  require('dotenv').config({ path: ENV_PATH, override: true });
  console.log('✅ Environment loaded - SESSION_ID exists?', !!process.env.SESSION_ID);
} else {
  console.error('❌ CRITICAL: No .env file found at:', ENV_PATH);
}

// ==============================================
// CONFIGURATION DEFAULTS
// ==============================================
const DEFAULTS = {
  SESSION_ID: "", // MUST come from environment
  // ... [keep all other defaults unchanged] ...
};

// ==============================================
// CONFIG MANAGER (Final Working Version)
// ==============================================
class Config {
  constructor() {
    this.data = { ...DEFAULTS };
    this.initialize().catch(err => {
      console.error('⛔ FATAL:', err.message);
      process.exit(1);
    });
  }

  async initialize() {
    console.log('🔧 Initializing config...');
    console.log('Process.env.SESSION_ID:', process.env.SESSION_ID ? '*****' : 'MISSING');

    // 1. Load from SQL
    const dbConfig = await this.loadDatabaseConfig();
    
    // 2. Load from Environment
    const envConfig = this.loadEnvConfig();
    
    // 3. Merge configurations
    this.data = {
      ...DEFAULTS,
      ...dbConfig,
      ...envConfig
    };

    // 4. Validate
    this.validate();

    console.log('✅ Config ready. SESSION_ID:', this.data.SESSION_ID ? '*****' : 'MISSING!');
  }

  loadEnvConfig() {
    const envConfig = {};
    const envVars = Object.keys(DEFAULTS)
      .filter(key => process.env[key] !== undefined);

    console.log('🌐 Found env vars:', envVars);

    envVars.forEach(key => {
      envConfig[key] = this.parseValue(process.env[key], DEFAULTS[key]);
    });

    return envConfig;
  }

  // ... [keep other methods unchanged] ...
}

module.exports = new Config();

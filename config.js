const fs = require('fs');
const { getConfigSafe } = require('./data/ConfigDB');

// Load environment variables first
if (fs.existsSync('config.env')) {
    require('dotenv').config({ path: './config.env' });
} else {
    console.warn('config.env file not found! Using process.env');
}

function convertToBool(text, fault = 'true') {
    return text === fault ? true : false;
}

async function loadConfig() {
    try {
        const config = await getConfigSafe();
        
        return {
            // SECURITY WARNING: Hardcoded session ID is not recommended
            // This is only for demonstration - use environment variables in production
            SESSION_ID: process.env.SESSION_ID || "KHAN-MD~Pqx0iR4R#OnrW33yTuVE4pRxVBFyRVxJZI16Tk9CNOghF097aPTw",
            
            // Boolean settings with fallback
            AUTO_STATUS_SEEN: config.AUTO_STATUS_SEEN ?? convertToBool(process.env.AUTO_STATUS_SEEN || "true"),
            AUTO_STATUS_REPLY: config.AUTO_STATUS_REPLY ?? convertToBool(process.env.AUTO_STATUS_REPLY || "false"),
            AUTO_STATUS_REACT: config.AUTO_STATUS_REACT ?? convertToBool(process.env.AUTO_STATUS_REACT || "true"),
            CUSTOM_REACT: config.CUSTOM_REACT ?? convertToBool(process.env.CUSTOM_REACT || "false"),
            DELETE_LINKS: config.DELETE_LINKS ?? convertToBool(process.env.DELETE_LINKS || "false"),
            READ_MESSAGE: config.READ_MESSAGE ?? convertToBool(process.env.READ_MESSAGE || "false"),
            AUTO_REACT: config.AUTO_REACT ?? convertToBool(process.env.AUTO_REACT || "false"),
            ANTI_BAD: config.ANTI_BAD ?? convertToBool(process.env.ANTI_BAD || "false"),
            ANTI_LINK: config.ANTI_LINK ?? convertToBool(process.env.ANTI_LINK || "true"),
            AUTO_VOICE: config.AUTO_VOICE ?? convertToBool(process.env.AUTO_VOICE || "false"),
            AUTO_STICKER: config.AUTO_STICKER ?? convertToBool(process.env.AUTO_STICKER || "false"),
            AUTO_REPLY: config.AUTO_REPLY ?? convertToBool(process.env.AUTO_REPLY || "false"),
            ALWAYS_ONLINE: config.ALWAYS_ONLINE ?? convertToBool(process.env.ALWAYS_ONLINE || "false"),
            PUBLIC_MODE: config.PUBLIC_MODE ?? convertToBool(process.env.PUBLIC_MODE || "true"),
            AUTO_TYPING: config.AUTO_TYPING ?? convertToBool(process.env.AUTO_TYPING || "false"),
            READ_CMD: config.READ_CMD ?? convertToBool(process.env.READ_CMD || "false"),
            ANTI_VV: config.ANTI_VV ?? convertToBool(process.env.ANTI_VV || "true"),
            AUTO_RECORDING: config.AUTO_RECORDING ?? convertToBool(process.env.AUTO_RECORDING || "false"),
            
            // String settings with fallback
            AUTO_STATUS_MSG: config.AUTO_STATUS_MSG || process.env.AUTO_STATUS_MSG || "*SEEN YOUR STATUS BY KHAN-MD 🤍*",
            PREFIX: config.PREFIX || process.env.PREFIX || ".",
            BOT_NAME: config.BOT_NAME || process.env.BOT_NAME || "KHAN-MD",
            STICKER_NAME: config.STICKER_NAME || process.env.STICKER_NAME || "KHAN-MD",
            CUSTOM_REACT_EMOJIS: config.CUSTOM_REACT_EMOJIS || process.env.CUSTOM_REACT_EMOJIS || "💝,💖,💗,❤️‍🩹,❤️,🧡,💛,💚,💙,💜,🤎,🖤,🤍",
            OWNER_NUMBER: config.OWNER_NUMBER || process.env.OWNER_NUMBER || "92342758XXXX",
            OWNER_NAME: config.OWNER_NAME || process.env.OWNER_NAME || "Jᴀᴡᴀᴅ TᴇᴄʜX",
            DESCRIPTION: config.DESCRIPTION || process.env.DESCRIPTION || "*© ᴘᴏᴡᴇʀᴇᴅ ʙʏ Jᴀᴡᴀᴅ TᴇᴄʜX*",
            ALIVE_IMG: config.ALIVE_IMG || process.env.ALIVE_IMG || "https://files.catbox.moe/149k8x.jpg",
            LIVE_MSG: config.LIVE_MSG || process.env.LIVE_MSG || "> Zinda Hun Yar *KHAN-MD*⚡",
            MODE: config.MODE || process.env.MODE || "public",
            ANTI_DEL_PATH: config.ANTI_DEL_PATH || process.env.ANTI_DEL_PATH || "log",
            DEV: config.DEV || process.env.DEV || "923427582273"
        };
    } catch (error) {
        console.error('Critical error loading config, using environment defaults only:', error);
        return getEnvDefaults();
    }
}

function getEnvDefaults() {
    return {
        // SECURITY WARNING: Hardcoded session ID is not recommended
        SESSION_ID: process.env.SESSION_ID || "KHAN-MD~Pqx0iR4R#OnrW33yTuVE4pRxVBFyRVxJZI16Tk9CNOghF097aPTw",
        AUTO_STATUS_SEEN: convertToBool(process.env.AUTO_STATUS_SEEN || "true"),
        AUTO_STATUS_REPLY: convertToBool(process.env.AUTO_STATUS_REPLY || "false"),
        AUTO_STATUS_REACT: convertToBool(process.env.AUTO_STATUS_REACT || "true"),
        AUTO_STATUS_MSG: process.env.AUTO_STATUS_MSG || "*SEEN YOUR STATUS BY KHAN-MD 🤍*",
        PREFIX: process.env.PREFIX || ".",
        BOT_NAME: process.env.BOT_NAME || "KHAN-MD",
        STICKER_NAME: process.env.STICKER_NAME || "KHAN-MD",
        CUSTOM_REACT: convertToBool(process.env.CUSTOM_REACT || "false"),
        CUSTOM_REACT_EMOJIS: process.env.CUSTOM_REACT_EMOJIS || "💝,💖,💗,❤️‍🩹,❤️,🧡,💛,💚,💙,💜,🤎,🖤,🤍",
        DELETE_LINKS: convertToBool(process.env.DELETE_LINKS || "false"),
        OWNER_NUMBER: process.env.OWNER_NUMBER || "92342758XXXX",
        OWNER_NAME: process.env.OWNER_NAME || "Jᴀᴡᴀᴅ TᴇᴄʜX",
        DESCRIPTION: process.env.DESCRIPTION || "*© ᴘᴏᴡᴇʀᴇᴅ ʙʏ Jᴀᴡᴀᴅ TᴇᴄʜX*",
        ALIVE_IMG: process.env.ALIVE_IMG || "https://files.catbox.moe/149k8x.jpg",
        LIVE_MSG: process.env.LIVE_MSG || "> Zinda Hun Yar *KHAN-MD*⚡",
        READ_MESSAGE: convertToBool(process.env.READ_MESSAGE || "false"),
        AUTO_REACT: convertToBool(process.env.AUTO_REACT || "false"),
        ANTI_BAD: convertToBool(process.env.ANTI_BAD || "false"),
        MODE: process.env.MODE || "public",
        ANTI_LINK: convertToBool(process.env.ANTI_LINK || "true"),
        AUTO_VOICE: convertToBool(process.env.AUTO_VOICE || "false"),
        AUTO_STICKER: convertToBool(process.env.AUTO_STICKER || "false"),
        AUTO_REPLY: convertToBool(process.env.AUTO_REPLY || "false"),
        ALWAYS_ONLINE: convertToBool(process.env.ALWAYS_ONLINE || "false"),
        PUBLIC_MODE: convertToBool(process.env.PUBLIC_MODE || "true"),
        AUTO_TYPING: convertToBool(process.env.AUTO_TYPING || "false"),
        READ_CMD: convertToBool(process.env.READ_CMD || "false"),
        DEV: process.env.DEV || "923427582273",
        ANTI_VV: convertToBool(process.env.ANTI_VV || "true"),
        ANTI_DEL_PATH: process.env.ANTI_DEL_PATH || "log",
        AUTO_RECORDING: convertToBool(process.env.AUTO_RECORDING || "false")
    };
}

// Initialize config immediately
let ready = false;
let configPromise = loadConfig().then(c => {
    ready = true;
    if (!c.SESSION_ID) {
        console.error('WARNING: No SESSION_ID configured!');
    }
    return c;
});

// Export a proxy that handles async loading
module.exports = new Proxy({}, {
    get(target, prop) {
        if (ready) {
            return configPromise.then(c => c[prop]);
        }
        // Fallback to env defaults if not loaded yet
        const defaults = getEnvDefaults();
        if (prop in defaults) {
            return Promise.resolve(defaults[prop]);
        }
        return undefined;
    }
});

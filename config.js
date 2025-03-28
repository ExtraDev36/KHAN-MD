// config.js
const fs = require('fs');
const { getConfig } = require('./data/ConfigDB');

// Initialize config (you might want to call this at app startup)
async function loadConfig() {
    // Always load SESSION_ID from environment
    if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env' });
    
    try {
        const config = await getConfig();
        return {
            SESSION_ID: process.env.SESSION_ID || "", // Always from env
            AUTO_STATUS_SEEN: config.AUTO_STATUS_SEEN,
            AUTO_STATUS_REPLY: config.AUTO_STATUS_REPLY,
            AUTO_STATUS_REACT: config.AUTO_STATUS_REACT,
            AUTO_STATUS_MSG: config.AUTO_STATUS_MSG,
            PREFIX: config.PREFIX,
            BOT_NAME: config.BOT_NAME,
            STICKER_NAME: config.STICKER_NAME,
            CUSTOM_REACT: config.CUSTOM_REACT,
            CUSTOM_REACT_EMOJIS: config.CUSTOM_REACT_EMOJIS,
            DELETE_LINKS: config.DELETE_LINKS,
            OWNER_NUMBER: config.OWNER_NUMBER,
            OWNER_NAME: config.OWNER_NAME,
            DESCRIPTION: config.DESCRIPTION,
            ALIVE_IMG: config.ALIVE_IMG,
            LIVE_MSG: config.LIVE_MSG,
            READ_MESSAGE: config.READ_MESSAGE,
            AUTO_REACT: config.AUTO_REACT,
            ANTI_BAD: config.ANTI_BAD,
            MODE: config.MODE,
            ANTI_LINK: config.ANTI_LINK,
            AUTO_VOICE: config.AUTO_VOICE,
            AUTO_STICKER: config.AUTO_STICKER,
            AUTO_REPLY: config.AUTO_REPLY,
            ALWAYS_ONLINE: config.ALWAYS_ONLINE,
            PUBLIC_MODE: config.PUBLIC_MODE,
            AUTO_TYPING: config.AUTO_TYPING,
            READ_CMD: config.READ_CMD,
            DEV: config.DEV,
            ANTI_VV: config.ANTI_VV,
            ANTI_DEL_PATH: config.ANTI_DEL_PATH,
            AUTO_RECORDING: config.AUTO_RECORDING
        };
    } catch (error) {
        console.error('Error loading config from DB, using defaults:', error);
        // Fallback to environment variables if DB fails
        function convertToBool(text, fault = 'true') {
            return text === fault ? true : false;
        }
        
        return {
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
}

module.exports = loadConfig();

const { DATABASE } = require('../lib/database');
const { DataTypes } = require('sequelize');

const BotConfigDB = DATABASE.define('BotConfigs', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    key: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    value: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    tableName: 'bot_configs',
    timestamps: false,
});

async function initializeBotConfig() {
    try {
        await BotConfigDB.sync();

        // List of all configuration variables to initialize
        const defaultConfigs = [
            { key: 'SESSION_ID', value: process.env.SESSION_ID || '' },
            { key: 'AUTO_STATUS_SEEN', value: process.env.AUTO_STATUS_SEEN || 'true' },
            { key: 'AUTO_STATUS_REPLY', value: process.env.AUTO_STATUS_REPLY || 'false' },
            { key: 'AUTO_STATUS_REACT', value: process.env.AUTO_STATUS_REACT || 'true' },
            { key: 'AUTO_STATUS_MSG', value: process.env.AUTO_STATUS_MSG || 'SEEN YOUR STATUS BY KHAN-MD 🤍' },
            { key: 'PREFIX', value: process.env.PREFIX || '.' },
            { key: 'BOT_NAME', value: process.env.BOT_NAME || 'KHAN-MD' },
            { key: 'STICKER_NAME', value: process.env.STICKER_NAME || 'KHAN-MD' },
            { key: 'CUSTOM_REACT', value: process.env.CUSTOM_REACT || 'false' },
            { key: 'CUSTOM_REACT_EMOJIS', value: process.env.CUSTOM_REACT_EMOJIS || '💝,💖,💗,❤️‍🩹,❤️,🧡,💛,💚,💙,💜,🤎,🖤,🤍' },
            { key: 'DELETE_LINKS', value: process.env.DELETE_LINKS || 'false' },
            { key: 'OWNER_NUMBER', value: process.env.OWNER_NUMBER || '92342758XXXX' },
            { key: 'OWNER_NAME', value: process.env.OWNER_NAME || 'Jᴀᴡᴀᴅ TᴇᴄʜX' },
            { key: 'DESCRIPTION', value: process.env.DESCRIPTION || '© ᴘᴏᴡᴇʀᴇᴅ ʙʏ Jᴀᴡᴀᴅ TᴇᴄʜX' },
            { key: 'ALIVE_IMG', value: process.env.ALIVE_IMG || 'https://files.catbox.moe/149k8x.jpg' },
            { key: 'LIVE_MSG', value: process.env.LIVE_MSG || '> Zinda Hun Yar KHAN-MD⚡' },
            { key: 'READ_MESSAGE', value: process.env.READ_MESSAGE || 'false' },
            { key: 'AUTO_REACT', value: process.env.AUTO_REACT || 'false' },
            { key: 'ANTI_BAD', value: process.env.ANTI_BAD || 'false' },
            { key: 'MODE', value: process.env.MODE || 'public' },
            { key: 'ANTI_LINK', value: process.env.ANTI_LINK || 'true' },
            { key: 'AUTO_VOICE', value: process.env.AUTO_VOICE || 'false' },
            { key: 'AUTO_STICKER', value: process.env.AUTO_STICKER || 'false' },
            { key: 'AUTO_REPLY', value: process.env.AUTO_REPLY || 'false' },
            { key: 'ALWAYS_ONLINE', value: process.env.ALWAYS_ONLINE || 'false' },
            { key: 'PUBLIC_MODE', value: process.env.PUBLIC_MODE || 'true' },
            { key: 'AUTO_TYPING', value: process.env.AUTO_TYPING || 'false' },
            { key: 'READ_CMD', value: process.env.READ_CMD || 'false' },
            { key: 'DEV', value: process.env.DEV || '923427582273' },
            { key: 'ANTI_VV', value: process.env.ANTI_VV || 'true' },
            { key: 'ANTI_DEL_PATH', value: process.env.ANTI_DEL_PATH || 'log' },
            { key: 'AUTO_RECORDING', value: process.env.AUTO_RECORDING || 'false' },
        ];

        for (const config of defaultConfigs) {
            await BotConfigDB.findOrCreate({ where: { key: config.key }, defaults: config });
        }

        console.log("Bot configurations initialized.");
    } catch (error) {
        console.error("Error initializing bot configurations:", error);
    }
}

async function updateBotConfig(key, value) {
    try {
        await BotConfigDB.upsert({ key, value });
        return true;
    } catch (error) {
        console.error("Error updating bot configuration:", error);
        return false;
    }
}

async function getBotConfig(key) {
    try {
        const config = await BotConfigDB.findOne({ where: { key } });
        return config ? config.value : null;
    } catch (error) {
        console.error("Error retrieving bot configuration:", error);
        return null;
    }
}

async function getAllBotConfig() {
    try {
        const configs = await BotConfigDB.findAll();
        return configs.map(config => ({ key: config.key, value: config.value }));
    } catch (error) {
        console.error("Error retrieving all bot configurations:", error);
        return [];
    }
}

module.exports = {
    initializeBotConfig,
    updateBotConfig,
    getBotConfig,
    getAllBotConfig,
};

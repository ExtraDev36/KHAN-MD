const { DATABASE } = require('../lib/database');
const { DataTypes } = require('sequelize');

// Define the BotConfig model
const BotConfig = DATABASE.define('BotConfig', {
    key: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
    },
    value: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    tableName: 'BotConfigs',
    timestamps: false,
});

// Initialize the BotConfigs table
async function initializeBotConfig() {
    try {
        // Sync the model
        await BotConfig.sync();
        console.log('BotConfigs table synchronized successfully.');

        // Define default configurations
        const defaultConfigs = [
            { key: 'SESSION_ID', value: process.env.SESSION_ID || "" },
            { key: 'AUTO_STATUS_SEEN', value: process.env.AUTO_STATUS_SEEN || "true" },
            { key: 'AUTO_STATUS_REPLY', value: process.env.AUTO_STATUS_REPLY || "false" },
            { key: 'AUTO_STATUS_REACT', value: process.env.AUTO_STATUS_REACT || "true" },
            { key: 'AUTO_STATUS_MSG', value: process.env.AUTO_STATUS_MSG || "*SEEN YOUR STATUS BY KHAN-MD 🤍*" },
            { key: 'PREFIX', value: process.env.PREFIX || "." },
            { key: 'BOT_NAME', value: process.env.BOT_NAME || "KHAN-MD" },
            { key: 'STICKER_NAME', value: process.env.STICKER_NAME || "KHAN-MD" },
            { key: 'CUSTOM_REACT', value: process.env.CUSTOM_REACT || "false" },
            { key: 'CUSTOM_REACT_EMOJIS', value: process.env.CUSTOM_REACT_EMOJIS || "💝,💖,💗,❤️‍🩹,❤️,🧡,💛,💚,💙,💜,🤎,🖤,🤍" },
            { key: 'DELETE_LINKS', value: process.env.DELETE_LINKS || "false" },
            { key: 'OWNER_NUMBER', value: process.env.OWNER_NUMBER || "92342758XXXX" },
            { key: 'OWNER_NAME', value: process.env.OWNER_NAME || "Jᴀᴡᴀᴅ TᴇᴄʜX" },
            { key: 'DESCRIPTION', value: process.env.DESCRIPTION || "*© ᴘᴏᴡᴇʀᴇᴅ ʙʏ Jᴀᴡᴀᴅ TᴇᴄʜX*" },
            { key: 'ALIVE_IMG', value: process.env.ALIVE_IMG || "https://files.catbox.moe/149k8x.jpg" },
            { key: 'LIVE_MSG', value: process.env.LIVE_MSG || "> Zinda Hun Yar *KHAN-MD*⚡" },
            { key: 'READ_MESSAGE', value: process.env.READ_MESSAGE || "false" },
            { key: 'AUTO_REACT', value: process.env.AUTO_REACT || "false" },
            { key: 'ANTI_BAD', value: process.env.ANTI_BAD || "false" },
            { key: 'MODE', value: process.env.MODE || "public" },
            { key: 'ANTI_LINK', value: process.env.ANTI_LINK || "true" },
            { key: 'AUTO_VOICE', value: process.env.AUTO_VOICE || "false" },
            { key: 'AUTO_STICKER', value: process.env.AUTO_STICKER || "false" },
            { key: 'AUTO_REPLY', value: process.env.AUTO_REPLY || "false" },
            { key: 'ALWAYS_ONLINE', value: process.env.ALWAYS_ONLINE || "false" },
            { key: 'PUBLIC_MODE', value: process.env.PUBLIC_MODE || "true" },
            { key: 'AUTO_TYPING', value: process.env.AUTO_TYPING || "false" },
            { key: 'READ_CMD', value: process.env.READ_CMD || "false" },
            { key: 'DEV', value: process.env.DEV || "923427582273" },
            { key: 'ANTI_VV', value: process.env.ANTI_VV || "true" },
            { key: 'ANTI_DEL_PATH', value: process.env.ANTI_DEL_PATH || "log" },
            { key: 'AUTO_RECORDING', value: process.env.AUTO_RECORDING || "false" }
        ];

        // Upsert default configurations
        for (const config of defaultConfigs) {
            await BotConfig.upsert(config);
        }

        console.log('Bot configurations initialized successfully.');
    } catch (error) {
        console.error('Error initializing bot configurations:', error);
    }
}

// Get a configuration value by key
async function getConfig(key) {
    try {
        const config = await BotConfig.findOne({ where: { key } });
        return config ? config.value : null;
    } catch (error) {
        console.error('Error fetching configuration:', error);
        return null;
    }
}

// Set or update a configuration value by key
async function setConfig(key, value) {
    try {
        await BotConfig.upsert({ key, value });
        console.log(`Configuration ${key} updated successfully.`);
    } catch (error) {
        console.error('Error updating configuration:', error);
    }
}

module.exports = { initializeBotConfig, getConfig, setConfig };

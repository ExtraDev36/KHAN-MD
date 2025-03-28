// data/ConfigDB.js
const { DATABASE } = require('../lib/database');
const { DataTypes } = require('sequelize');

const ConfigDB = DATABASE.define('Config', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: false,
        defaultValue: 1,
    },
    AUTO_STATUS_SEEN: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    AUTO_STATUS_REPLY: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    AUTO_STATUS_REACT: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    CUSTOM_REACT: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    DELETE_LINKS: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    READ_MESSAGE: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    AUTO_REACT: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    ANTI_BAD: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    ANTI_LINK: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    AUTO_VOICE: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    AUTO_STICKER: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    AUTO_REPLY: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    ALWAYS_ONLINE: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    PUBLIC_MODE: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    AUTO_TYPING: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    READ_CMD: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    ANTI_VV: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    AUTO_RECORDING: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    // String values
    AUTO_STATUS_MSG: {
        type: DataTypes.STRING,
        defaultValue: "*SEEN YOUR STATUS BY KHAN-MD 🤍*",
    },
    PREFIX: {
        type: DataTypes.STRING,
        defaultValue: ".",
    },
    BOT_NAME: {
        type: DataTypes.STRING,
        defaultValue: "KHAN-MD",
    },
    STICKER_NAME: {
        type: DataTypes.STRING,
        defaultValue: "KHAN-MD",
    },
    CUSTOM_REACT_EMOJIS: {
        type: DataTypes.STRING,
        defaultValue: "💝,💖,💗,❤️‍🩹,❤️,🧡,💛,💚,💙,💜,🤎,🖤,🤍",
    },
    OWNER_NUMBER: {
        type: DataTypes.STRING,
        defaultValue: "92342758XXXX",
    },
    OWNER_NAME: {
        type: DataTypes.STRING,
        defaultValue: "Jᴀᴡᴀᴅ TᴇᴄʜX",
    },
    DESCRIPTION: {
        type: DataTypes.STRING,
        defaultValue: "*© ᴘᴏᴡᴇʀᴇᴅ ʙʏ Jᴀᴡᴀᴅ TᴇᴄʜX*",
    },
    ALIVE_IMG: {
        type: DataTypes.STRING,
        defaultValue: "https://files.catbox.moe/149k8x.jpg",
    },
    LIVE_MSG: {
        type: DataTypes.STRING,
        defaultValue: "> Zinda Hun Yar *KHAN-MD*⚡",
    },
    MODE: {
        type: DataTypes.STRING,
        defaultValue: "public",
    },
    ANTI_DEL_PATH: {
        type: DataTypes.STRING,
        defaultValue: "log",
    },
    DEV: {
        type: DataTypes.STRING,
        defaultValue: "923427582273",
    }
}, {
    tableName: 'config',
    timestamps: false,
    hooks: {
        beforeCreate: record => { record.id = 1; },
        beforeBulkCreate: records => { records.forEach(record => { record.id = 1; }); },
    },
});

let isInitialized = false;

async function initializeConfig() {
    if (isInitialized) return;
    try {
        await ConfigDB.sync();
        await ConfigDB.findOrCreate({
            where: { id: 1 },
            defaults: {}, // Defaults are already set in the model definition
        });
        isInitialized = true;
    } catch (error) {
        console.error('Error initializing config:', error);
    }
}

async function setConfig(key, value) {
    try {
        await initializeConfig();
        const record = await ConfigDB.findByPk(1);
        
        // Convert string 'on'/'off' to boolean if needed
        if (typeof record[key] === 'boolean') {
            value = value.toString().toLowerCase() === 'on';
        }
        
        record[key] = value;
        await record.save();
        return true;
    } catch (error) {
        console.error('Error setting config:', error);
        return false;
    }
}

async function getConfig(key) {
    try {
        await initializeConfig();
        const record = await ConfigDB.findByPk(1);
        return record[key];
    } catch (error) {
        console.error('Error getting config:', error);
        return null;
    }
}

async function getAllConfig() {
    try {
        await initializeConfig();
        const record = await ConfigDB.findByPk(1);
        return record;
    } catch (error) {
        console.error('Error getting all config:', error);
        return null;
    }
}

module.exports = {
    ConfigDB,
    initializeConfig,
    setConfig,
    getConfig,
    getAllConfig,
};

// Created BY JawadTechX Don't Remove Credits !

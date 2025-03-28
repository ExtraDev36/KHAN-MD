//plugins/config.js

const { cmd } = require('../command');
const { setConfig, getConfig, getAllConfig } = require('../data/ConfigDB');

cmd({
    pattern: "config",
    alias: ['env', 'set'],
    desc: "Manage bot configuration",
    category: "misc",
    filename: __filename
},
async (conn, mek, m, { from, reply, q, text, isCreator, fromMe }) => {
    if (!isCreator) return reply('This command is only for the bot owner');
    
    try {
        if (!q) {
            // Show all config if no query specified
            const config = await getAllConfig();
            if (!config) return reply('Failed to load configuration.');
            
            let configText = '*⚙️ Bot Configuration:*\n\n';
            for (const [k, v] of Object.entries(config.dataValues)) {
                if (k !== 'id') {
                    configText += `*${k}:* ${typeof v === 'boolean' ? (v ? 'ON' : 'OFF') : v}\n`;
                }
            }
            return reply(configText);
        }

        const parts = q.split(' ');
        const key = parts[0].toUpperCase();
        const value = parts.slice(1).join(' ').toUpperCase();

        if (!value) {
            // Get single config value
            const configValue = await getConfig(key);
            if (configValue !== null) {
                return reply(`*${key}:* ${typeof configValue === 'boolean' ? (configValue ? 'ON' : 'OFF') : configValue}`);
            } else {
                return reply(`❌ Config key "${key}" not found.`);
            }
        } else {
            // Set config value
            const success = await setConfig(key, value);
            if (success) {
                const newValue = await getConfig(key);
                return reply(`✅ *${key}* set to ${typeof newValue === 'boolean' ? (newValue ? 'ON' : 'OFF') : newValue}`);
            } else {
                return reply('❌ Failed to update configuration.');
            }
        }
    } catch (e) {
        console.error("Error in config command:", e);
        return reply("An error occurred while processing your request.");
    }
});

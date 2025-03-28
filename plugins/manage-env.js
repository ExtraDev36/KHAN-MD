const { cmd } = require('../command');
const { getBotConfig, updateBotConfig, getAllBotConfig } = require('../data/envsql');

cmd({
    pattern: "config",
    alias: ['env', 'set'],
    desc: "Manage bot environment variables.",
    category: "owner",
    filename: __filename,
    owner: true,
},
async (conn, mek, m, { from, reply, q, text, isCreator }) => {
    if (!isCreator) return reply('This command is only for the bot owner.');

    try {
        const args = q.split(' ');

        // Display all configurations if no argument is passed
        if (args.length === 0 || !args[0]) {
            const configs = await getAllBotConfig();
            let message = "*🔧 Bot Environment Variables:*\n\n";
            configs.forEach(cfg => {
                message += `🔑 *${cfg.key}:* ${cfg.value}\n`;
            });
            return reply(message);
        }

        const key = args[0].toUpperCase();
        const newValue = args.slice(1).join(' ');

        if (!newValue) {
            const currentValue = await getBotConfig(key);
            return currentValue ? 
                reply(`🔍 *${key}:* ${currentValue}`) : 
                reply(`❌ Variable not found: ${key}`);
        }

        const updateStatus = await updateBotConfig(key, newValue);
        return updateStatus ? 
            reply(`✅ *${key}* updated to: *${newValue}*`) : 
            reply(`❌ Failed to update: ${key}`);

    } catch (error) {
        console.error("Error in env command:", error);
        reply("❌ Error managing environment variables.");
    }
});

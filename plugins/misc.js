const axios = require('axios');
const config = require('../config');
const { cmd, commands } = require('../command');
const util = require("util");
const { getAnti, setAnti, initializeAntiDeleteSettings } = require('../data/antidel');

initializeAntiDeleteSettings();

cmd({
    pattern: "antidelete",
    alias: ['antidel', 'ad'],
    desc: "Sets up the Antidelete",
    category: "misc",
    filename: __filename
},
async (conn, mek, m, { from, reply, q, text, isCreator, fromMe }) => {
    if (!isCreator) return reply('This command is only for the bot owner');
    try {
        const command = q?.toLowerCase();

        switch (command) {
            case 'on':
                await setAnti('gc', false);
                await setAnti('dm', false);
                return reply('_AntiDelete is now off for Group Chats and Direct Messages._');

            case 'off gc':
                await setAnti('gc', false);
                return reply('_AntiDelete for Group Chats is now disabled._');

            case 'off dm':
                await setAnti('dm', false);
                return reply('_AntiDelete for Direct Messages is now disabled._');

            case 'set gc':
                const gcStatus = await getAnti('gc');
                await setAnti('gc', !gcStatus);
                return reply(`_AntiDelete for Group Chats ${!gcStatus ? 'enabled' : 'disabled'}._`);

            case 'set dm':
                const dmStatus = await getAnti('dm');
                await setAnti('dm', !dmStatus);
                return reply(`_AntiDelete for Direct Messages ${!dmStatus ? 'enabled' : 'disabled'}._`);

            case 'set all':
                await setAnti('gc', true);
                await setAnti('dm', true);
                return reply('_AntiDelete set for all chats._');

            case 'status':
                const currentDmStatus = await getAnti('dm');
                const currentGcStatus = await getAnti('gc');
                return reply(`_AntiDelete Status_\n\n*DM AntiDelete:* ${currentDmStatus ? 'Enabled' : 'Disabled'}\n*Group Chat AntiDelete:* ${currentGcStatus ? 'Enabled' : 'Disabled'}`);

            default:
                const helpMessage = `-- *AntiDelete Command Guide: --*
                • \`\`.antidelete on\`\` - Reset AntiDelete for all chats (disabled by default)
                • \`\`.antidelete off gc\`\` - Disable AntiDelete for Group Chats
                • \`\`.antidelete off dm\`\` - Disable AntiDelete for Direct Messages
                • \`\`.antidelete set gc\`\` - Toggle AntiDelete for Group Chats
                • \`\`.antidelete set dm\`\` - Toggle AntiDelete for Direct Messages
                • \`\`.antidelete set all\`\` - Enable AntiDelete for all chats
                • \`\`.antidelete status\`\` - Check current AntiDelete status`;

                return reply(helpMessage);
        }
    } catch (e) {
        console.error("Error in antidelete command:", e);
        return reply("An error occurred while processing your request.");
    }
});


cmd({
    pattern: "vv",
    alias: ['retrive', '🔥'],
    desc: "Fetch and resend a ViewOnce message content (image/video/audio).",
    category: "misc",
    use: '<query>',
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {
        // Check both possible ViewOnce message formats
        const quoted = m.quoted ? m.quoted : mek.msg.contextInfo?.quotedMessage;
        
        if (!quoted) {
            return reply("Please reply to a ViewOnce message.");
        }

        // Check for ViewOnce message in different formats
        const viewOnceMessage = quoted.viewOnceMessageV2 || 
                               quoted.viewOnceMessage || 
                               (quoted.message && quoted.message.viewOnceMessageV2) || 
                               (quoted.message && quoted.message.viewOnceMessage);

        if (!viewOnceMessage) {
            return reply("This is not a ViewOnce message.");
        }

        // Get the actual message content
        const messageContent = viewOnceMessage.message || viewOnceMessage;

        // Handle image message
        if (messageContent.imageMessage) {
            const cap = messageContent.imageMessage.caption || "";
            const anu = await conn.downloadAndSaveMediaMessage(messageContent.imageMessage);
            return conn.sendMessage(from, { image: { url: anu }, caption: cap }, { quoted: mek });
        }
        // Handle video message
        else if (messageContent.videoMessage) {
            const cap = messageContent.videoMessage.caption || "";
            const anu = await conn.downloadAndSaveMediaMessage(messageContent.videoMessage);
            return conn.sendMessage(from, { video: { url: anu }, caption: cap }, { quoted: mek });
        }
        // Handle audio message
        else if (messageContent.audioMessage) {
            const anu = await conn.downloadAndSaveMediaMessage(messageContent.audioMessage);
            return conn.sendMessage(from, { audio: { url: anu } }, { quoted: mek });
        }
        // Handle document message
        else if (messageContent.documentMessage) {
            const anu = await conn.downloadAndSaveMediaMessage(messageContent.documentMessage);
            return conn.sendMessage(from, { document: { url: anu } }, { quoted: mek });
        }
        else {
            return reply("Unsupported ViewOnce message type.");
        }

    } catch (e) {
        console.error("Error in vv command:", e);
        return reply("An error occurred while processing the ViewOnce message.");
    }
});

// if you want use the codes give me credit on your channel and repo in this file and my all files 

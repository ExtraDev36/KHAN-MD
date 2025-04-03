const config = require('../config')
const { cmd, commands } = require('../command')
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson} = require('../lib/functions')

cmd({
    pattern: "getpp",
    react: "🖼️",
    alias: ["profilepic", "getdp"],
    desc: "Get profile picture of user/group",
    category: "utility",
    use: '.getpp [@tag/reply] (or use in group for group DP)',
    filename: __filename
},
async (conn, mek, m, { from, sender, isGroup, reply, quoted }) => {
    try {
        // Determine target JID
        let targetJid;
        let identifier;

        // Check if a reply is made
        if (quoted) {
            targetJid = quoted.sender;
            identifier = "User";
        } 
        // Check if a mention is made
        else if (mek.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length) {
            targetJid = mek.message.extendedTextMessage.contextInfo.mentionedJid[0];
            identifier = "User";
        } 
        // Check if in a group and no mention/reply
        else if (isGroup) {
            targetJid = from;
            identifier = "Group";
        } 
        // Fallback to sender
        else {
            targetJid = sender;
            identifier = "User";
        }

        // Get profile picture with fallback
        let ppUrl;
        try {
            ppUrl = await conn.profilePictureUrl(targetJid, 'image');
        } catch {
            ppUrl = 'https://i.ibb.co/KhYC4FY/1221bc0bdd2354b42b293317ff2adbcf-icon.png';
        }

        // Get name/identifier
        let name;
        if (identifier === "Group") {
            const groupInfo = await conn.groupMetadata(targetJid);
            name = groupInfo.subject || "Unknown Group";
        } else {
            try {
                const contact = await conn.contactDB?.get(targetJid);
                name = contact?.name || targetJid.split('@')[0];
            } catch {
                name = targetJid.split('@')[0];
            }
        }

        // Format caption
        const caption = `*${identifier} Profile Picture*\n\n▢ Name: ${name}\n▢ JID: ${targetJid.replace(/@.+/, '')}`;

        // Send image with info
        await conn.sendMessage(from, {
            image: { url: ppUrl },
            caption: caption,
            mentions: [targetJid]
        }, { quoted: mek });

    } catch (e) {
        console.error("GetPP error:", e);
        reply(`❌ Failed to fetch profile picture: ${e.message}`);
    }
});

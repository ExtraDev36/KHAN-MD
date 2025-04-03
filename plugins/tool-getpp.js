const { cmd } = require("../command");

cmd(
    {
        pattern: "getpp",
        desc: "Get profile picture of user",
        category: "utility",
        react: "🖼️",
        filename: __filename,
        use: "[@tag/reply]",
    },
    async (conn, mek, m, { reply, isGroup, sender }) => {
        try {
            // 1. Determine target user (fixed reply/mention handling)
            let targetUser = sender; // Default to sender
            
            // Check for quoted/replied message first
            if (mek.message?.extendedTextMessage?.contextInfo?.participant) {
                targetUser = mek.message.extendedTextMessage.contextInfo.participant;
            }
            // Check for mentions
            else if (mek.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length > 0) {
                targetUser = mek.message.extendedTextMessage.contextInfo.mentionedJid[0];
            }

            // 2. Get profile picture with proper fallback
            let ppUrl;
            try {
                ppUrl = await conn.profilePictureUrl(targetUser, 'image');
            } catch {
                ppUrl = 'https://i.ibb.co/KhYC4FY/1221bc0bdd2354b42b293317ff2adbcf-icon.png';
            }

            // 3. Create smart caption
            let username = targetUser.split('@')[0];
            try {
                const contact = await conn.contactDB?.get(targetUser);
                if (contact?.name) username = contact.name;
            } catch {}
            
            let caption = isGroup 
                ? `🖼️ Profile picture of @${username}`
                : "🖼️ Here's the profile picture";

            // 4. Send the image
            await conn.sendMessage(
                m.chat,
                { 
                    image: { url: ppUrl },
                    caption: caption,
                    mentions: isGroup ? [targetUser] : []
                },
                { quoted: mek }
            );

        } catch (error) {
            console.error("getpp error:", error);
            reply(`❌ Error: ${error.message || "Failed to fetch profile picture"}`);
        }
    }
); 

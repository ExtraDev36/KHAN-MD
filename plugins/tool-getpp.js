const { cmd } = require("../command");
const axios = require("axios");

cmd(
    {
        pattern: "getpp",
        desc: "Get profile picture of user",
        category: "utility",
        react: "🖼️",
        filename: __filename,
        use: "@tag or reply (optional)",
    },
    async (conn, mek, m, { reply, quoted, isGroup, sender }) => {
        try {
            // Determine target user (reply > mention > sender)
            let targetUser = quoted?.sender || 
                          m.mentionedJid?.[0] || 
                          sender;

            // Get profile picture with same fallback as .person command
            let ppUrl;
            try {
                ppUrl = await conn.profilePictureUrl(targetUser, 'image');
            } catch {
                ppUrl = 'https://i.ibb.co/KhYC4FY/1221bc0bdd2354b42b293317ff2adbcf-icon.png';
            }

            // Create caption with mention handling
            let caption;
            if (isGroup) {
                if (targetUser !== sender) {
                    caption = `🖼️ Profile picture of @${targetUser.split('@')[0]}`;
                } else {
                    caption = `🖼️ ${m.pushName || 'Your'} profile picture`;
                }
            } else {
                caption = "🖼️ Here's your profile picture";
            }

            // Send the image (using URL directly like .person command)
            await conn.sendMessage(
                mek.chat,
                { 
                    image: { url: ppUrl },
                    caption: caption,
                    mentions: targetUser !== sender ? [targetUser] : []
                },
                { quoted: mek }
            );

        } catch (error) {
            console.error("❌ Error in .getpp command:", error);
            reply(`❌ Failed to get profile picture: ${error.message}`);
        }
    }
);

const { cmd } = require('../command');
const yts = require('yt-search');
const { yt, ytv } = require('@vioo/apis');

cmd({
    pattern: "playx",
    react: "🎵",
    alias: ["song", "music"],
    desc: "Search and play music from YouTube",
    category: "downloader",
    use: '.play <song name>',
    filename: __filename
},
async (conn, mek, m, { from, reply, args, prefix, command }) => {
    try {
        if (!args[0]) return reply(`Please provide a song name.\nExample: ${prefix}${command} Moye Moye`);
        
        const query = args.join(' ');
        let waitMsg;

        try {
            // Show searching message - store the whole message object
            waitMsg = await conn.sendMessage(from, { text: `🔍 Searching for "${query}"...` }, { quoted: mek });
            
            // Search YouTube
            const search = await yts(query);
            const videos = search.videos;
            
            if (!videos || !videos.length) {
                if (waitMsg?.key) await conn.sendMessage(from, { delete: waitMsg.key });
                return reply('❌ No results found.');
            }

            const video = videos[0];
            if (!video.url) {
                if (waitMsg?.key) await conn.sendMessage(from, { delete: waitMsg.key });
                return reply('❌ Invalid video URL.');
            }

            // Update to downloading status
            if (waitMsg?.key) {
                await conn.sendMessage(from, { 
                    text: `⬇️ Downloading: ${video.title}\n\n⏳ Please wait...`, 
                    edit: waitMsg.key 
                });
            }

            // Download audio
            const result = await yt(video.url, {
                quality: '360p',
                format: 'mp3'
            }).catch(async (e) => {
                console.error('YT Error:', e);
                return await ytv(video.url, {
                    quality: '360p',
                    format: 'mp3'
                });
            });

            if (!result) {
                if (waitMsg?.key) await conn.sendMessage(from, { delete: waitMsg.key });
                return reply('❌ Download failed.');
            }

            // Send audio
            await conn.sendMessage(from, {
                audio: result,
                mimetype: 'audio/mpeg',
                contextInfo: {
                    externalAdReply: {
                        title: String(video.title || 'YouTube Audio').substring(0, 55),
                        body: String(video.author?.name || 'Unknown Artist').substring(0, 40),
                        thumbnailUrl: video.thumbnail,
                        mediaType: 1,
                        mediaUrl: video.url,
                        sourceUrl: video.url
                    }
                }
            }, { quoted: mek });

        } finally {
            // Clean up wait message if it exists
            if (waitMsg?.key) {
                try {
                    await conn.sendMessage(from, { delete: waitMsg.key });
                } catch (e) {
                    console.error('Failed to delete wait message:', e);
                }
            }
        }

    } catch (e) {
        console.error('Play Error:', e);
        reply(`❌ Error: ${e.message || 'Processing failed'}`);
    }
});

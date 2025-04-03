const { cmd } = require('../command');
const yts = require('yt-search');
const { yt, ytv } = require('@vioo/apis'); // Corrected imports

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
            // Show searching message
            waitMsg = await reply(`🔍 Searching for "${query}"...`);
            
            // Search YouTube
            const search = await yts(query);
            const videos = search.videos;
            
            if (!videos || !videos.length) {
                return reply('❌ No results found.');
            }

            const video = videos[0];
            if (!video.url) {
                return reply('❌ Invalid video URL.');
            }

            // Update to downloading status
            await conn.sendMessage(from, { 
                text: `⬇️ Downloading: ${video.title}\n\n⏳ Please wait...`, 
                edit: waitMsg.key 
            });

            // Download audio using @vioo/apis
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

            if (!result) return reply('❌ Download failed.');

            // Send audio
            await conn.sendMessage(from, {
                audio: result, // Directly use the buffer
                mimetype: 'audio/mpeg',
                contextInfo: {
                    externalAdReply: {
                        title: video.title.substring(0, 55) || 'YouTube Audio',
                        body: video.author?.name.substring(0, 40) || 'Unknown Artist',
                        thumbnailUrl: video.thumbnail,
                        mediaType: 1,
                        mediaUrl: video.url,
                        sourceUrl: video.url
                    }
                }
            }, { quoted: mek });

        } finally {
            if (waitMsg?.key) {
                await conn.sendMessage(from, { delete: waitMsg.key });
            }
        }

    } catch (e) {
        console.error('Play Error:', e);
        reply(`❌ Error: ${e.message || 'Processing failed'}`);
    }
});

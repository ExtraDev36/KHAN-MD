const { cmd } = require('../command');
const yts = require('yt-search');
const { ytdlv2, ytdlv1 } = require('@vioo/apis');

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
            
            // Search YouTube using yt-search
            const search = await yts(query);
            const videos = search.videos;
            
            if (!videos || videos.length === 0) {
                if (waitMsg) await conn.sendMessage(from, { delete: waitMsg.key });
                return reply('❌ No results found for your search.');
            }

            const video = videos[0];
            if (!video.url) {
                if (waitMsg) await conn.sendMessage(from, { delete: waitMsg.key });
                return reply('❌ Could not get video URL from search results.');
            }

            // Update message to downloading status
            if (waitMsg) {
                await conn.sendMessage(from, { 
                    text: `⬇️ Downloading: ${video.title}\n\n⏳ Please wait...`, 
                    edit: waitMsg.key 
                });
            }

            // Download audio using @vioo/apis
            const result = await ytdlv2(video.url, { 
                quality: 'highestaudio',
                filter: 'audioonly',
                format: 'mp3'
            }).catch(async (e) => {
                console.error('YTDLv2 Error:', e);
                return await ytdlv1(video.url, {
                    quality: 'highestaudio',
                    filter: 'audioonly',
                    format: 'mp3'
                });
            });

            if (!result || !result.url) {
                if (waitMsg) await conn.sendMessage(from, { delete: waitMsg.key });
                return reply('❌ Failed to download audio. The video might be too long or restricted.');
            }

            // Send audio with metadata
            await conn.sendMessage(from, {
                audio: { url: result.url },
                mimetype: 'audio/mpeg',
                contextInfo: {
                    externalAdReply: {
                        title: video.title || 'YouTube Audio',
                        body: video.author?.name || 'Unknown Artist',
                        thumbnailUrl: video.thumbnail || '',
                        mediaType: 1,
                        mediaUrl: video.url,
                        sourceUrl: video.url,
                        showAdAttribution: true
                    }
                }
            }, { quoted: mek });

        } catch (e) {
            console.error('Error in play command:', e);
            throw e;
        } finally {
            // Delete wait message if it exists
            if (waitMsg?.key) {
                try {
                    await conn.sendMessage(from, { delete: waitMsg.key });
                } catch (deleteError) {
                    console.error('Failed to delete wait message:', deleteError);
                }
            }
        }

    } catch (e) {
        console.error('Play Command Error:', e);
        reply(`❌ Error: ${e.message || 'Failed to process your request'}`);
    }
});

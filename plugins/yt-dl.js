const { cmd } = require('../command');
const axios = require('axios');
const { youtubeSearch, ytdlv2, ytdlv1 } = require('@vioo/apis');

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
        
        // Show searching message
        const waitMsg = await reply(`🔍 Searching for "${query}"...`);

        // Search YouTube
        const searchResults = await youtubeSearch(query, { limit: 1 });
        
        if (!searchResults || searchResults.length === 0) {
            await conn.sendMessage(from, { delete: waitMsg.key });
            return reply('❌ No results found for your search.');
        }

        const video = searchResults[0];
        if (!video.url) {
            await conn.sendMessage(from, { delete: waitMsg.key });
            return reply('❌ Could not get video URL from search results.');
        }

        // Update message to downloading status
        await conn.sendMessage(from, { 
            text: `⬇️ Downloading: ${video.title}\n\n⏳ Please wait...`, 
            edit: waitMsg.key 
        });

        // Download audio
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
            await conn.sendMessage(from, { delete: waitMsg.key });
            return reply('❌ Failed to download audio. The video might be too long or restricted.');
        }

        // Send audio with metadata
        await conn.sendMessage(from, {
            audio: { url: result.url },
            mimetype: 'audio/mpeg',
            contextInfo: {
                externalAdReply: {
                    title: video.title || 'YouTube Audio',
                    body: video.channel || 'Unknown Artist',
                    thumbnailUrl: video.thumbnail || '',
                    mediaType: 1,
                    mediaUrl: video.url,
                    sourceUrl: video.url,
                    showAdAttribution: true
                }
            }
        }, { quoted: mek });

        // Delete wait message
        await conn.sendMessage(from, { delete: waitMsg.key });

    } catch (e) {
        console.error('Play Command Error:', e);
        reply(`❌ Error: ${e.message || 'Failed to process your request'}`);
    }
});

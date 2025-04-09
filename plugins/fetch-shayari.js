const { cmd, commands } = require("../command");
const axios = require('axios');
const translate = require('@vitalets/google-translate-api');

cmd({
    pattern: "shayari",
    desc: "Get a random Hindi shayari and translate it to Roman Urdu",
    category: "fun",
    react: "📝",
    filename: __filename,
    use: ".shayari"
},
async (conn, m, { reply }) => {
    try {
        // Fetch shayari from Farzi Vichar API
        const res = await axios.get('https://farzi-vichar-api.vercel.app/language/hindi/random');
        const original = res.data.content;

        // Translate to Roman Urdu
        const translation = await translate(original, { to: 'ur', from: 'hi' });

        await reply(`📝 *Shayari*:\n\n${translation.text}`);
    } catch (e) {
        console.error(e);
        reply("❌ Couldn't fetch or translate shayari.");
    }
});

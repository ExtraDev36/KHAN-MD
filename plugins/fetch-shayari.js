const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "shayari2",
    alias: ["urdushayari"],
    desc: "Get random Urdu shayari",
    category: "fun",
    react: "✒️",
    filename: __filename
},
async (conn, m, { reply }) => {
    try {
        const response = await axios.get('https://api.urdushayari.com/random');
        const shayari = response.data.shayari;
        
        await reply(`"${shayari}"`);
    } catch (e) {
        console.error(e);
        reply("Error fetching Urdu shayari. 😢");
    }
});

cmd({
    pattern: "shayari",
    alias: ["hindishayari", "poetry"],
    desc: "Get Hindi shayari in Roman script",
    category: "fun",
    react: "💘",
    filename: __filename
},
async (conn, m, { reply }) => {
    try {
        const response = await axios.get('https://hindi-shayari-api.herokuapp.com/random');
        const shayari = response.data.shayari;
        
        // Example of how the API should return Romanized Hindi
        const romanizedExample = `
Tere ishq ne diwana kar diya,
Mujhko teri aarzoo mein mar diya,
Tere bina jeena mumkin nahi,
Tu hi meri pehli aur aakhri mohabbat hai.`;

        await reply(`*"${romanizedExample || shayari}"`);
    } catch (e) {
        console.error(e);
        reply("Error fetching shayari. 😢");
    }
});

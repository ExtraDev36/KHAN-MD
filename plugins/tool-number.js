const { cmd } = require("../command");
const axios = require("axios");

cmd({
    pattern: "tempnum",
    alias: ["fakenum", "tempnumber"],
    desc: "Get temporary numbers & OTP instructions",
    category: "tools",
    react: "📱",
    use: "<country-code>"
},
async (conn, mek, m, { from, args, reply, prefix }) => {
    try {
        // Mandatory country code check
        if (!args || args.length < 1) {
            return reply(`❌ *Usage:* .tempnum <country-code>\nExample: .tempnum us\n\n📦 Use .otpinbox <number>* to check OTPs`);
        }

        const countryCode = args[0].toLowerCase();
        
        // API call with validation
        const { data } = await axios.get(
            `https://api.vreden.my.id/api/tools/fakenumber/listnumber?id=${countryCode}`,
            { 
                timeout: 10000,
                validateStatus: status => status === 200
            }
        );

        // Fixed syntax error here - added missing parenthesis
        if (!data?.result || !Array.isArray(data.result)) {
            console.error("Invalid API structure:", data);
            return reply(`⚠ Invalid API response format\nTry .tempnum us`);
        }

        if (data.result.length === 0) {
            return reply(`📭 No numbers available for *${countryCode.toUpperCase()}*\nTry another country code!\n\nUse .otpinbox <number> after selection`);
        }

        // Process numbers
        const numbers = data.result.slice(0, 25);
        const numberList = numbers.map((num, i) => 
            `${String(i+1).padStart(2, ' ')}. ${num.number}`
        ).join("\n");

        // Final message with OTP instructions
        await reply(
            `╭──「 📱 TEMPORARY NUMBERS 」\n` +
            `│\n` +
            `│ Country: ${countryCode.toUpperCase()}\n` +
            `│ Numbers Found: ${numbers.length}\n` +
            `│\n` +
            `${numberList}\n\n` +
            `╰──「 📦 USE: .otpinbox <number> 」\n` +
            `_Example: .otpinbox +1234567890_`
        );

    } catch (err) {
        console.error("API Error:", err);
        const errorMessage = err.code === "ECONNABORTED" ? 
            `⏳ *Timeout*: API took too long\nTry smaller country codes like 'us', 'gb'` :
            `⚠ *Error*: ${err.message}\nUse format: .tempnum <country-code>`;
            
        reply(`${errorMessage}\n\n🔑 Remember: ${prefix}otpinbox <number>`);
    }
});

cmd({
    pattern: "templist",
    alias: ["tempnumberlist", "tempnlist", "listnumbers"],
    desc: "Show list of countries with temp numbers",
    category: "tools",
    react: "🌍",
    filename: __filename,
    use: ".templist"
},
async (conn, m, { reply }) => {
    try {
        const { data } = await axios.get("https://api.vreden.my.id/api/tools/fakenumber/country");

        if (!data || !data.result) return reply("❌ Couldn't fetch country list.");

        const countries = data.result.map((c, i) => `*${i + 1}.* ${c.title} \`(${c.id})\``).join("\n");

        await reply(`🌍 *Total Available Countries:* ${data.result.length}\n\n${countries}`);
    } catch (e) {
        console.error("TEMP LIST ERROR:", e);
        reply("❌ Failed to fetch temporary number country list.");
    }
});

cmd({
    pattern: "otpbox",
    alias: ["otp", "getnum", "tempotp"],
    desc: "Check inbox of a temp number",
    category: "tools",
    react: "📨",
    filename: __filename,
    use: ".otpbox <number>"
},
async (conn, m, { args, reply }) => {
    const number = args[0];
    if (!number) return reply("❌ Please provide a number.\n\nExample: `.otpbox +16600887591`");

    try {
        const response = await axios.get(`https://api.vreden.my.id/api/tools/fakenumber/message?nomor=${encodeURIComponent(number)}`);
        const messages = response.data?.result;

        if (!messages || messages.length === 0) {
            return reply("❌ No messages found for this number.");
        }

        let text = `╭─「 *OTP Inbox* 」\n│ *Number:* ${number}\n│ *Total Messages:* ${messages.length}\n│\n`;

        for (let i = 0; i < Math.min(10, messages.length); i++) {
            const msg = messages[i];
            text += `│ ${i + 1}. *From:* ${msg.from}\n`;
            text += `│     *Time:* ${msg.time_wib}\n`;
            text += `│     *Message:* ${msg.content}\n│\n`;
        }

        text += `╰─ Powered by *KHAN MD*`;

        await reply(text);
    } catch (e) {
        console.error("OTPBOX ERROR:", e);
        reply("❌ Failed to fetch messages. Make sure the number is correct.");
    }
});

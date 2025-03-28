const config = require('../config');
const { cmd } = require('../command');

cmd({
    pattern: "privacymenu",
    alias: ["wasetting", "waprivacy", "getprivacy"],
    desc: "Display privacy settings menu",
    category: "menu",
    react: "🔒",
    filename: __filename
}, 
async (conn, mek, m, { from, reply }) => {
    try {
        let menuText = `╭━━〔 *Privacy Settings* 〕━━┈⊷
┃🔹 *Last Seen:*   .lastseen <all/contacts/contact_blacklist/none>
┃🔹 *About:*       .about <all/contacts/contact_blacklist/none>
┃🔹 *Profile Pic:* .profilepic <all/contacts/contact_blacklist/none>
┃🔹 *Blue Tick:*   .bluetick <on/off>
┃🔹 *Group Add:*   .groupadd <all/contacts/contact_blacklist>
┃🔹 *Status:*      .status <all/contacts/contact_blacklist/none>
┃🔹 *Blocklist:*   .getblocklist
┃🔹 *Msg Timer:*   .defaulttimer <0/24/72/168>
┃🔹 *Live Loc:*    .livelocation <all/contacts/contact_blacklist/none>
┃🔹 *Unknown Call:* .unknowncall <all/known>
╰━━━━━━━━━━━━━━━┈⊷
> ${config.DESCRIPTION}`;

        await conn.sendMessage(
            from,
            {
                image: { url: `https://files.catbox.moe/7zfdcq.jpg` },
                caption: menuText,
                contextInfo: {
                    mentionedJid: [m.sender],
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363354023106228@newsletter',
                        newsletterName: 'JawadTechX',
                        serverMessageId: 143
                    }
                }
            },
            { quoted: mek }
        );

    } catch (e) {
        console.log(e);
        reply(`${e}`);
    }
});


cmd({
    pattern: "lastseen",
    description: "Update Last Seen Privacy",
    category: "privacy",
    filename: __filename
},    
async (conn, mek, m, { args, isOwner, reply }) => {
    if (!isOwner) return reply("*📛 Only the bot owner can use this command!*");

    const options = ["all", "contacts", "contact_blacklist", "none"];
    const choice = args[0]?.toLowerCase();
    if (!options.includes(choice)) return reply("*Example: .lastseen contacts*");

    await conn.updatePrivacySettings("last_seen", choice);
    return reply(`✅ Last Seen privacy updated to *${choice}*.`);
});

cmd({
    pattern: "about",
    description: "Update About Privacy",
    category: "privacy",
    filename: __filename
},    
async (conn, mek, m, { args, isOwner, reply }) => {
    if (!isOwner) return reply("*📛 Only the bot owner can use this command!*");

    const options = ["all", "contacts", "contact_blacklist", "none"];
    const choice = args[0]?.toLowerCase();
    if (!options.includes(choice)) return reply("*Example: .about none*");

    await conn.updatePrivacySettings("about", choice);
    return reply(`✅ About privacy updated to *${choice}*.`);
});

cmd({
    pattern: "profilepic",
    description: "Update Profile Picture Privacy",
    category: "privacy",
    filename: __filename
},    
async (conn, mek, m, { args, isOwner, reply }) => {
    if (!isOwner) return reply("*📛 Only the bot owner can use this command!*");

    const options = ["all", "contacts", "contact_blacklist", "none"];
    const choice = args[0]?.toLowerCase();
    if (!options.includes(choice)) return reply("*Example: .profilepic contacts*");

    await conn.updatePrivacySettings("profile_photo", choice);
    return reply(`✅ Profile picture privacy updated to *${choice}*.`);
});

cmd({
    pattern: "bluetick",
    description: "Enable or Disable Read Receipts",
    category: "privacy",
    filename: __filename
},    
async (conn, mek, m, { args, isOwner, reply }) => {
    if (!isOwner) return reply("*📛 Only the bot owner can use this command!*");

    const choice = args[0]?.toLowerCase();
    if (!["on", "off"].includes(choice)) return reply("*Example: .bluetick off*");

    await conn.updatePrivacySettings("read_receipts", choice === "on" ? "all" : "none");
    return reply(`✅ Read receipts turned *${choice}*.`);
});

cmd({
    pattern: "groupadd",
    description: "Update Group Add Privacy",
    category: "privacy",
    filename: __filename
},    
async (conn, mek, m, { args, isOwner, reply }) => {
    if (!isOwner) return reply("*📛 Only the bot owner can use this command!*");

    const options = ["all", "contacts", "contact_blacklist"];
    const choice = args[0]?.toLowerCase();
    if (!options.includes(choice)) return reply("*Example: .groupadd contacts*");

    await conn.updatePrivacySettings("group_add", choice);
    return reply(`✅ Group add privacy updated to *${choice}*.`);
});

cmd({
    pattern: "status",
    description: "Update Status Privacy",
    category: "privacy",
    filename: __filename
},    
async (conn, mek, m, { args, isOwner, reply }) => {
    if (!isOwner) return reply("*📛 Only the bot owner can use this command!*");

    const options = ["all", "contacts", "contact_blacklist", "none"];
    const choice = args[0]?.toLowerCase();
    if (!options.includes(choice)) return reply("*Example: .status none*");

    await conn.updatePrivacySettings("status", choice);
    return reply(`✅ Status privacy updated to *${choice}*.`);
});

cmd({
    pattern: "getblocklist",
    description: "View Blocked Contacts",
    category: "privacy",
    filename: __filename
},    
async (conn, mek, m, { isOwner, reply }) => {
    if (!isOwner) return reply("*📛 Only the bot owner can use this command!*");

    const blocklist = await conn.fetchBlocklist();
    if (!blocklist.length) return reply("✅ No blocked contacts found!");

    let message = "🚫 *Blocked Contacts:*\n\n";
    blocklist.forEach((user, index) => {
        message += `🔹 ${index + 1}. wa.me/${user.split("@")[0]}\n`;
    });

    return reply(message);
});

cmd({
    pattern: "defaulttimer",
    description: "Set Default Message Timer",
    category: "privacy",
    filename: __filename
},    
async (conn, mek, m, { args, isOwner, reply }) => {
    if (!isOwner) return reply("*📛 Only the bot owner can use this command!*");

    const options = ["0", "24", "72", "168"];
    const choice = args[0];
    if (!options.includes(choice)) return reply("*Example: .defaulttimer 24*");

    await conn.updateDisappearingMessages(choice);
    return reply(`✅ Default message timer set to *${choice} hours*.`);
});

cmd({
    pattern: "livelocation",
    description: "Update Live Location Privacy",
    category: "privacy",
    filename: __filename
},    
async (conn, mek, m, { args, isOwner, reply }) => {
    if (!isOwner) return reply("*📛 Only the bot owner can use this command!*");

    const options = ["all", "contacts", "contact_blacklist", "none"];
    const choice = args[0]?.toLowerCase();
    if (!options.includes(choice)) return reply("*Example: .livelocation contacts*");

    await conn.updatePrivacySettings("live_location", choice);
    return reply(`✅ Live location privacy updated to *${choice}*.`);
});

cmd({
    pattern: "unknowncall",
    description: "Update Unknown Call Privacy",
    category: "privacy",
    filename: __filename
},    
async (conn, mek, m, { args, isOwner, reply }) => {
    if (!isOwner) return reply("*📛 Only the bot owner can use this command!*");

    const choice = args[0]?.toLowerCase();
    if (!["all", "known"].includes(choice)) return reply("*Example: .unknowncall known*");

    await conn.updatePrivacySettings("call", choice);
    return reply(`✅ Unknown call privacy updated to allow *${choice}* users.`);
});

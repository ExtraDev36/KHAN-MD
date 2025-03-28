const config = require('../config');
const { cmd } = require('../command');

const ownerCheck = (conn, senderNumber, reply) => {
    const botOwner = conn.user.id.split(":")[0]; 
    if (senderNumber !== botOwner) return reply("📛 *Only the bot owner can use this command!*");
    return true;
};

cmd({
    pattern: "lastseen",
    description: "Update Last Seen Privacy",
    category: "privacy",
    filename: __filename
}, async (conn, mek, m, { args, senderNumber, reply }) => {
    if (!ownerCheck(conn, senderNumber, reply)) return;

    const options = ["all", "contacts", "contact_blacklist", "none"];
    if (!options.includes(args[0])) return reply(`🫠 *Usage:* .lastseen ${options.join(" | ")}`);

    await conn.updateLastSeenPrivacy(args[0]);
    reply(`✅ *Last Seen Privacy updated to:* ${args[0]}`);
});

cmd({
    pattern: "about",
    description: "Update About Privacy",
    category: "privacy",
    filename: __filename
}, async (conn, mek, m, { args, senderNumber, reply }) => {
    if (!ownerCheck(conn, senderNumber, reply)) return;

    const options = ["all", "contacts", "contact_blacklist", "none"];
    if (!options.includes(args[0])) return reply(`🫠 *Usage:* .about ${options.join(" | ")}`);

    await conn.updateAboutPrivacy(args[0]);
    reply(`✅ *About Privacy updated to:* ${args[0]}`);
});

cmd({
    pattern: "profilepic",
    description: "Update Profile Picture Privacy",
    category: "privacy",
    filename: __filename
}, async (conn, mek, m, { args, senderNumber, reply }) => {
    if (!ownerCheck(conn, senderNumber, reply)) return;

    const options = ["all", "contacts", "contact_blacklist", "none"];
    if (!options.includes(args[0])) return reply(`🫠 *Usage:* .profilepic ${options.join(" | ")}`);

    await conn.updateProfilePicPrivacy(args[0]);
    reply(`✅ *Profile Picture Privacy updated to:* ${args[0]}`);
});

cmd({
    pattern: "bluetick",
    description: "Enable or disable blue tick (Read receipts)",
    category: "privacy",
    filename: __filename
}, async (conn, mek, m, { args, senderNumber, reply }) => {
    if (!ownerCheck(conn, senderNumber, reply)) return;

    if (!["on", "off"].includes(args[0])) return reply("🫠 *Usage:* .bluetick on | off");

    await conn.updateReadReceiptsPrivacy(args[0] === "on" ? "all" : "none");
    reply(`✅ *Blue Ticks are now ${args[0]}.*`);
});

cmd({
    pattern: "groupadd",
    description: "Update Group Add Privacy",
    category: "privacy",
    filename: __filename
}, async (conn, mek, m, { args, senderNumber, reply }) => {
    if (!ownerCheck(conn, senderNumber, reply)) return;

    const options = ["all", "contacts", "contact_blacklist"];
    if (!options.includes(args[0])) return reply(`🫠 *Usage:* .groupadd ${options.join(" | ")}`);

    await conn.updateGroupsAddPrivacy(args[0]);
    reply(`✅ *Updated Group Add Privacy to:* ${args[0]}`);
});

cmd({
    pattern: "status",
    description: "Update Status Privacy",
    category: "privacy",
    filename: __filename
}, async (conn, mek, m, { args, senderNumber, reply }) => {
    if (!ownerCheck(conn, senderNumber, reply)) return;

    const options = ["all", "contacts", "contact_blacklist", "none"];
    if (!options.includes(args[0])) return reply(`🫠 *Usage:* .status ${options.join(" | ")}`);

    await conn.updateStatusPrivacy(args[0]);
    reply(`✅ *Status Privacy updated to:* ${args[0]}`);
});

cmd({
    pattern: "getblocklist",
    description: "Show the list of blocked contacts",
    category: "privacy",
    filename: __filename
}, async (conn, mek, m, { reply }) => {
    const blocklist = await conn.fetchBlocklist();
    if (!blocklist || blocklist.length === 0) return reply("_You have no blocked contacts._");

    let msg = "┏━━━〔 *Blocked Contacts* 〕━━━\n";
    blocklist.forEach((user, index) => {
        msg += `┃ ${index + 1}️⃣ ${user.split('@')[0]}\n`;
    });
    msg += "┗━━━━━━━━━━━━━━━━━";

    reply(msg);
});

cmd({
    pattern: "defaulttimer",
    description: "Set disappearing messages timer",
    category: "privacy",
    filename: __filename
}, async (conn, mek, m, { args, senderNumber, reply }) => {
    if (!ownerCheck(conn, senderNumber, reply)) return;

    const options = ["0", "24", "72", "168"];
    if (!options.includes(args[0])) return reply(`🫠 *Usage:* .defaulttimer ${options.join(" | ")}`);

    await conn.updateDefaultMessageTimer(parseInt(args[0]));
    reply(`✅ *Message Timer set to:* ${args[0]} hours`);
});

cmd({
    pattern: "livelocation",
    description: "Update Live Location Privacy",
    category: "privacy",
    filename: __filename
}, async (conn, mek, m, { args, senderNumber, reply }) => {
    if (!ownerCheck(conn, senderNumber, reply)) return;

    const options = ["all", "contacts", "contact_blacklist", "none"];
    if (!options.includes(args[0])) return reply(`🫠 *Usage:* .livelocation ${options.join(" | ")}`);

    await conn.updateLiveLocationPrivacy(args[0]);
    reply(`✅ *Live Location Privacy updated to:* ${args[0]}`);
});

cmd({
    pattern: "unknowncall",
    description: "Enable or disable unknown call blocking",
    category: "privacy",
    filename: __filename
}, async (conn, mek, m, { args, senderNumber, reply }) => {
    if (!ownerCheck(conn, senderNumber, reply)) return;

    if (!["on", "off"].includes(args[0])) return reply("🫠 *Usage:* .unknowncall on | off");

    await conn.updateUnknownCallPrivacy(args[0] === "on");
    reply(`✅ *Unknown call blocking is now ${args[0]}.*`);
});

cmd({
    pattern: "setname",
    description: "Update Bot Profile Name",
    category: "privacy",
    filename: __filename
}, async (conn, mek, m, { args, senderNumber, reply }) => {
    if (!ownerCheck(conn, senderNumber, reply)) return;

    if (!args[0]) return reply("🫠 *Usage:* .setname <new name>");

    await conn.updateProfileName(args.join(" "));
    reply(`✅ *Profile Name Updated to:* ${args.join(" ")}`);
});

cmd({
    pattern: "setabout",
    description: "Update Bot Profile About (Status)",
    category: "privacy",
    filename: __filename
}, async (conn, mek, m, { args, senderNumber, reply }) => {
    if (!ownerCheck(conn, senderNumber, reply)) return;

    if (!args[0]) return reply("🫠 *Usage:* .setabout <new status>");

    await conn.updateProfileStatus(args.join(" "));
    reply(`✅ *Profile Status Updated to:* ${args.join(" ")}`);
});

cmd({
    pattern: "privacymenu",
    alias: ["wasetting", "waprivacy", "getprivacy"],
    desc: "Show the command usage menu",
    category: "menu",
    react: "📜",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    try {
        let usageMenu = `╭━━━〔 *Privacy Settings* 〕━━━┈⊷
┃🔹 *Last Seen:*   .lastseen <all/contacts/contact_blacklist/none>
┃🔹 *About:*       .about <all/contacts/contact_blacklist/none>
┃🔹 *Profile Pic:* .profilepic <all/contacts/contact_blacklist/none>
┃🔹 *Blue Tick:*   .bluetick <on/off>
┃🔹 *Group Add:*   .groupadd <all/contacts/contact_blacklist>
┃🔹 *Status:*      .status <all/contacts/contact_blacklist/none>
┃🔹 *Blocklist:*   .getblocklist
┃🔹 *Msg Timer:*   .defaulttimer <0/24/72/168>
┃🔹 *Live Loc:*    .livelocation <all/contacts/contact_blacklist/none>
┃🔹 *Unknown Call:* .unknowncall <on/off>
┃🔹 *Set Name:*    .setname <new name>
┃🔹 *Set About:*   .setabout <new status>
┃🔹 *Repository:* .repo to get repo
┃🔹 *Menu:* .menu to get menu
╰━━━━━━━━━━━━━━━━━`;

        await conn.sendMessage(
            from,
            {
                text: usageMenu,
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
        console.error(e);
        reply(`⚠️ Error: ${e.message}`);
    }
});

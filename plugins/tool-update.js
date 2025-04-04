const { cmd } = require("../command");

cmd({
  pattern: "statusup",
  alias: ["uploadstatus", "poststatus"],
  react: '📢',
  desc: "Upload replied audio to WhatsApp status (as voice note)",
  category: "owner",
  filename: __filename
}, async (client, message, match, { from, isOwner }) => {
  try {
    if (!isOwner) {
      return await client.sendMessage(from, {
        text: "*📛 This is an owner command.*"
      }, { quoted: message });
    }

    if (!match.quoted) {
      return await client.sendMessage(from, {
        text: "*🍁 Please reply to an audio message!*"
      }, { quoted: message });
    }

    const buffer = await match.quoted.download();
    const mtype = match.quoted.mtype;

    // Only allow audio messages (voice notes)
    if (mtype !== "audioMessage") {
      return await client.sendMessage(from, {
        text: "*❌ Only audio messages can be uploaded to status as voice notes.*"
      }, { quoted: message });
    }

    // Upload to WhatsApp status (Baileys method)
    await client.updateProfileStatus(buffer, {
      type: 'audio',
      isVoiceNote: true, // Forces it as a voice note
    });

    await client.sendMessage(from, {
      text: "✅ Audio successfully uploaded to your status as a voice note!"
    }, { quoted: message });

  } catch (error) {
    console.error("Status Upload Error:", error);
    await client.sendMessage(from, {
      text: "❌ Error uploading to status:\n" + error.message
    }, { quoted: message });
  }
});

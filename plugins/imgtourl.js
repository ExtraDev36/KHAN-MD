const { cmd } = require("../command");
const axios = require("axios");
const FormData = require("form-data");
const { fileTypeFromBuffer } = require("file-type");

const MAX_FILE_SIZE_MB = 200;

async function uploadMedia(buffer) {
  try {
    const { ext } = await fileTypeFromBuffer(buffer);
    const bodyForm = new FormData();
    bodyForm.append("fileToUpload", buffer, "file." + ext);
    bodyForm.append("reqtype", "fileupload");

    const res = await axios.post("https://catbox.moe/user/api.php", bodyForm, {
      headers: bodyForm.getHeaders(),
    });

    return res.data;
  } catch (error) {
    console.error("Error during media upload:", error);
    throw new Error("Failed to upload media.");
  }
}

cmd({
  pattern: "tourl",
  react: "🌐",
  desc: "Upload media and get a direct URL.",
  category: "tools",
  filename: __filename,
}, async (conn, m, msg, { from, quoted, reply }) => {
  if (!quoted || !["imageMessage", "videoMessage", "audioMessage"].includes(quoted.mtype)) {
    return reply("Send or reply to an image, video, or audio to upload.");
  }

  try {
    reply("⏳ Uploading media, please wait...");

    const media = await quoted.download();
    if (!media) return reply("❌ Failed to download media.");

    const fileSizeMB = media.length / (1024 * 1024);
    if (fileSizeMB > MAX_FILE_SIZE_MB) {
      return reply(`❌ File size exceeds the limit of ${MAX_FILE_SIZE_MB}MB.`);
    }

    const mediaUrl = await uploadMedia(media);
    reply(`✅ Here is your media URL:\n${mediaUrl}`);
  } catch (error) {
    console.error("Error processing media:", error);
    reply("❌ Error processing media.");
  }
});

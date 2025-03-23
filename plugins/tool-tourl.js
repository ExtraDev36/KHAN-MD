
const config = require('../config');
const { cmd, commands } = require('../command');
const axios = require('axios'); // HTTP requests
const FormData = require('form-data'); // File uploads
const fs = require('fs'); // File handling
const path = require('path'); // File paths
const { fileTypeFromBuffer } = require('file-type'); // Detect file types

const MAX_FILE_SIZE_MB = 200;

async function uploadMedia(buffer, fileType) {
    try {
        const bodyForm = new FormData();
        bodyForm.append("fileToUpload", buffer, { filename: `file.${fileType}` });
        bodyForm.append("reqtype", "fileupload");

        const res = await axios.post("https://catbox.moe/user/api.php", bodyForm, {
            headers: bodyForm.getHeaders(),
        });

        return res.data;
    } catch (error) {
        console.error("❌ Error during media upload:", error);
        throw new Error("Failed to upload media.");
    }
}

cmd({
    pattern: 'url',
    react: '🌐',
    desc: 'Upload media (images/videos/audio) to Catbox and get a URL',
    category: 'utility',
    filename: __filename
}, async (conn, mek, m, {
    body,
    from,
    quoted,
    isCmd,
    command,
    args,
    q,
    isGroup,
    sender,
    senderNumber,
    botNumber2,
    botNumber,
    pushname,
    isMe,
    isOwner,
    groupMetadata,
    groupName,
    participants,
    groupAdmins,
    isBotAdmins,
    isAdmins,
    reply
}) => {
    if (!quoted || !quoted.mimetype) {
        return reply(`❌ Reply to an image, video, or audio to upload it.`);
    }

    try {
        // Download the media
        const media = await quoted.download();
        if (!media) return reply("❌ Failed to download media.");

        // Check file size
        const fileSizeMB = media.length / (1024 * 1024);
        if (fileSizeMB > MAX_FILE_SIZE_MB) {
            return reply(`❌ File size exceeds the limit of ${MAX_FILE_SIZE_MB}MB.`);
        }

        // Detect file type
        const fileType = await fileTypeFromBuffer(media);
        if (!fileType) return reply("❌ Could not determine file type.");

        // Save media temporarily
        const tempFilePath = path.join(__dirname, `temp_media.${fileType.ext}`);
        fs.writeFileSync(tempFilePath, media);

        // Upload media
        const fileUrl = await uploadMedia(media, fileType.ext);

        // Delete the temporary file
        fs.unlinkSync(tempFilePath);

        // Send the file URL back to the user
        await reply(`✅ *Media Uploaded Successfully!*\n\n🔗 *URL:* ${fileUrl}`);

    } catch (error) {
        console.error("❌ Error in tourl command:", error);
        reply(`❌ Error: ${error.message}`);
    }
});

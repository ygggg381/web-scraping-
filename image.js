import fs from "fs";
import path from "path";
import { google } from "googleapis";

async function uploadToDrive(auth, filePath) {
  try {
    var drive = google.drive({ version: "v3", auth });
  } catch (err) {
    console.log("Driver Authorization failed:", err);
    return;
  }

  let res;
  try {
    res = await drive.files.create({
      requestBody: {
        name: "blogger_image.png",
        mimeType: "image/png",
      },
      media: {
        mimeType: "image/png",
        body: fs.createReadStream(filePath),
      },
      fields: "id, webViewLink, webContentLink",
    });
  } catch (err) {
    console.log("Image can't be saved in Drive:", err);
    return;
  }

  let fileId;
  try {
    fileId = res.data.id;
  } catch (err) {
    console.log("Can't define file id:", err);
    return;
  }

  try {
     drive.permissions.create({
      fileId,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    });
  } catch (err) {
    console.log("Can't make it public:", err);
    return;
  }

  const publicUrl = `https://drive.google.com/thumbnail?id=${fileId}&sz=w1280`;
  return publicUrl;
}

async function MakeiMG(page, text) {
  let filePath;
  try {
    await page.goto(`file://${path.resolve("textToImage.html")}`);
    await page.fill("#text", text);
    await page.click("#generate");
    await page.waitForTimeout(500);
    const dataUrl = await page.inputValue("#dataUrl");
    const base64Data = dataUrl.replace(/^data:image\/png;base64,/, "");

    const saveDir = path.resolve("./output");
    filePath = path.join(saveDir, "image.png");

    if (!fs.existsSync(saveDir)) {
      fs.mkdirSync(saveDir, { recursive: true });
    }

    fs.writeFileSync(filePath, base64Data, "base64");
  } catch (err) {
    console.log("IMG creation failed:", err);
    return;
  }

  return filePath;
}

async function downloadImage(page, text, authorize) {
  
  try {
    var auth = await authorize();
  } catch (err) {
    console.log("Authorization error:", err);
    return ;
  }

  const filePath = await MakeiMG(page, text);
  if (!filePath) return null;

  const publicUrl = await uploadToDrive(auth, filePath);
  if (!publicUrl) return null;

  const IMG_Tag = `
<div class="separator" style="clear: both;">
  <a href="${publicUrl}" style="display: block; padding: 1em 0px; text-align: center;">
    <img
      alt="${text}"
      border="0"
      data-original-height="720"
      data-original-width="1280"
      src="${publicUrl}"
      title="${text}"
    />
  </a>
</div>`;

  return IMG_Tag;
}

export default downloadImage;

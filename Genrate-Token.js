import fs from "fs";
import path from "path";
import readline from "readline";
import { google } from "googleapis";
import { fileURLToPath } from "url";
import { dirname } from "path";

// تعريف __dirname و __filename
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const CREDENTIALS_PATH = path.join(__dirname, "credentials.json");
const TOKEN_PATH = path.join(__dirname, "token.json");

// قراءة بيانات الاعتماد
const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, "utf-8"));
const { client_secret, client_id, redirect_uris } = credentials.installed;
const oAuth2Client = new google.auth.OAuth2(
  client_id,
  client_secret,
  redirect_uris[0]
);

// طلب توكن جديد
const SCOPES = [
  "https://www.googleapis.com/auth/blogger",
  "https://www.googleapis.com/auth/drive.file",
];

function getAccessToken() {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });
  console.log(`url:\n${authUrl}`);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question("copy code here ➡️  ", async (code) => {
    rl.close();
    try {
      const { tokens } = await oAuth2Client.getToken(code);
      oAuth2Client.setCredentials(tokens);

      // حفظ التوكن
      fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens, null, 2));
      console.log("✅ Done - token saved");
    } catch (err) {
      console.log("❌ Error retrieving access token:", err);
    }
  });
}

getAccessToken();

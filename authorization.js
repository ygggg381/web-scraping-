import fs from "fs";
import { google } from "googleapis";
import { fileURLToPath } from "url";
import path,{ dirname } from "path";  


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const CREDENTIALS_PATH = path.join(__dirname, "credentials.json");
const TOKEN_PATH = path.join(__dirname, "token.json");

export async function authorize() {
  const { client_secret, client_id, redirect_uris } =
    JSON.parse(fs.readFileSync(CREDENTIALS_PATH, "utf8")).installed;

  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  if (fs.existsSync(TOKEN_PATH)) {
    oAuth2Client.setCredentials(JSON.parse(fs.readFileSync(TOKEN_PATH, "utf8")));
    return oAuth2Client;
  }

  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
scope: [
  "https://www.googleapis.com/auth/drive.file",
  "https://www.googleapis.com/auth/blogger"
],
  });

  console.log("Authorize this app by visiting this url:", authUrl);
  throw new Error("Run this script separately to save token.json first!");
}


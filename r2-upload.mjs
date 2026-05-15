import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";
import path from "path";

/**
 * GOTHAM ASSET MIGRATION SCRIPT
 * ----------------------------
 * This script bulk uploads your image sequences to Cloudflare R2.
 */

// --- CONFIGURATION (FILL THESE IN) ---
const REGION = "auto";
const BUCKET_NAME = "gotham-assets";
const ACCOUNT_ID = "38ee70951b8db0072ca23ed81875200c";
const ACCESS_KEY_ID = "5057229676f51337d6fcf7865e884313";
const SECRET_ACCESS_KEY = "ee98e666ecb792c38f572c81162946104c7e00592bf6bc00ddbf4cbf3291795f";

// The folders we want to upload from /public
const FOLDERS_TO_UPLOAD = [
  "bat_sequence",
  "cowl_sequence",
  "joker_sequence_webp",
  "neural_sequence",
  "symbol_sequence",
  "sequences",
  "vigil_sequence_webp",
  "music"
];

const s3 = new S3Client({
  region: REGION,
  endpoint: `https://${ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: ACCESS_KEY_ID,
    secretAccessKey: SECRET_ACCESS_KEY,
  },
});

async function uploadFile(filePath, bucketPath) {
  const fileContent = fs.readFileSync(filePath);
  const ext = path.extname(filePath).toLowerCase();

  let contentType = "application/octet-stream";
  if (ext === ".webp") contentType = "image/webp";
  else if (ext === ".mp4") contentType = "video/mp4";
  else if (ext === ".mp3") contentType = "audio/mpeg";
  else if (ext === ".png") contentType = "image/png";
  else if (ext === ".jpg" || ext === ".jpeg") contentType = "image/jpeg";

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: bucketPath,
    Body: fileContent,
    ContentType: contentType,
  });

  try {
    await s3.send(command);
    console.log(`✅ ${bucketPath}`);
  } catch (err) {
    console.error(`❌ ${bucketPath}`, err.message);
  }
}

async function walkDir(dir, baseDir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      await walkDir(filePath, baseDir);
    } else {
      // Create a clean bucket path (using forward slashes for URL compatibility)
      const bucketPath = path.relative(baseDir, filePath).replace(/\\/g, "/");
      await uploadFile(filePath, bucketPath);
    }
  }
}

async function main() {
  if (ACCOUNT_ID.includes("PASTE_YOUR")) {
    console.error("❌ ERROR: Please edit r2-upload.mjs and add your Cloudflare credentials!");
    process.exit(1);
  }

  console.log("🦇 GOTHAM ASSET MIGRATION: R2 INITIATED");
  console.log("---------------------------------------");

  for (const folder of FOLDERS_TO_UPLOAD) {
    const localPath = path.join(process.cwd(), "public", folder);
    if (fs.existsSync(localPath)) {
      console.log(`\n📂 SYNCING: ${folder}`);
      await walkDir(localPath, path.join(process.cwd(), "public"));
    } else {
      console.warn(`\n⚠️ SKIPPING: Folder not found: ${folder}`);
    }
  }

  console.log("\n✨ MIGRATION COMPLETE: YOUR ASSETS ARE NOW CINEMATICALLY HOSTED!");
}

main();

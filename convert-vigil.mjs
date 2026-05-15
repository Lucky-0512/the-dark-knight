import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputDir = path.join(__dirname, 'public', 'vigil_sequence');
const outputDir = path.join(__dirname, 'public', 'vigil_sequence_webp');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const files = fs.readdirSync(inputDir).filter(file => file.endsWith('.png'));

console.log(`Found ${files.length} PNG files. Converting to WebP...`);

async function processFiles() {
  for (const file of files) {
    const inputPath = path.join(inputDir, file);
    const outputPath = path.join(outputDir, file.replace('.png', '.webp'));
    try {
      await sharp(inputPath)
        .webp({ quality: 80 })
        .toFile(outputPath);
      process.stdout.write('.');
    } catch (err) {
      console.error(`Error converting ${file}:`, err);
    }
  }
  console.log('\nConversion complete.');
}

processFiles();

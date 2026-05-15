import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

const PUBLIC_DIR = './public';
const SEQUENCES = [
  'bat_sequence',
  'cowl_sequence',
  'symbol_sequence',
  'sequences/cave'
];

async function optimize() {
  console.log('🚀 INITIALIZING BAT-OPTIMIZER...');

  for (const seq of SEQUENCES) {
    const dirPath = path.join(PUBLIC_DIR, seq);
    try {
      const files = await fs.readdir(dirPath);
      const pngFiles = files.filter(f => f.endsWith('.png'));
      
      console.log(`\n📁 Processing: ${seq} (${pngFiles.length} frames)`);

      for (const file of pngFiles) {
        const inputPath = path.join(dirPath, file);
        const outputPath = inputPath.replace('.png', '.webp');

        await sharp(inputPath)
          .webp({ quality: 85 }) // High quality, small size
          .toFile(outputPath);

        // Optional: Remove original PNG to save space
        await fs.unlink(inputPath);
        process.stdout.write('.');
      }
      console.log(`\n✅ ${seq} COMPLETED.`);
    } catch (err) {
      console.error(`\n❌ Error processing ${seq}:`, err.message);
    }
  }

  console.log('\n\n✨ ALL ASSETS OPTIMIZED FOR GOTHAM.');
}

optimize();

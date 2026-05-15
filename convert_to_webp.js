const webp = require('webp-converter');
const fs = require('fs');
const path = require('path');

const dir = 'public/neural_sequence';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.png'));

async function convert() {
    for (const file of files) {
        const input = path.join(dir, file);
        const output = path.join(dir, file.replace('.png', '.webp'));
        console.log(`Converting ${file}...`);
        try {
            await webp.cwebp(input, output, "-q 80");
            fs.unlinkSync(input);
        } catch (e) {
            console.error(`Failed to convert ${file}`, e);
        }
    }
    console.log('Conversion complete.');
}

convert();

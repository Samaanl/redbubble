const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const outputDir = path.join(__dirname, 'public', 'images', 'drooling-cat');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const mappings = [
  {
    file: 'Screenshot 2026-06-15 202739.png',
    crops: [
      { name: 'hoodie.png', pos: 'tl' },
      { name: 'tshirt.png', pos: 'tr' },
      { name: 'mousepad.png', pos: 'bl' },
      { name: 'buckethat.png', pos: 'br' }
    ]
  },
  {
    file: 'Screenshot 2026-06-15 202752.png',
    crops: [
      { name: 'boxy-tshirt.png', pos: 'tl' },
      { name: 'relaxed-tshirt.png', pos: 'tr' },
      { name: 'dadhat.png', pos: 'bl' },
      { name: 'deskmat.png', pos: 'br' }
    ]
  },
  {
    file: 'Screenshot 2026-06-15 202808.png',
    crops: [
      { name: 'clock.png', pos: 'tl' },
      { name: 'coasters.png', pos: 'tr' },
      { name: 'throwpillow.png', pos: 'bl' },
      { name: 'tote.png', pos: 'br' }
    ]
  },
  {
    file: 'Screenshot 2026-06-15 202817.png',
    crops: [
      { name: 'duvet.png', pos: 'tl' },
      { name: 'showercurtain.png', pos: 'tr' },
      { name: 'mug.png', pos: 'bl' },
      { name: 'cottontote.png', pos: 'br' }
    ]
  },
  {
    file: 'Screenshot 2026-06-15 202828.png',
    crops: [
      { name: 'pin.png', pos: 'tl' },
      { name: 'scarf.png', pos: 'tr' },
      { name: 'greetingcard.png', pos: 'bl' },
      { name: 'journal.png', pos: 'br' }
    ]
  },
  {
    file: 'Screenshot 2026-06-15 202836.png',
    crops: [
      { name: 'tallmug.png', pos: 'tl' },
      { name: 'zipperpouch.png', pos: 'tr' },
      { name: 'puzzle.png', pos: 'bl' },
      { name: 'apron.png', pos: 'br' }
    ]
  }
];

async function processAll() {
  for (const item of mappings) {
    const filePath = path.join(__dirname, item.file);
    if (!fs.existsSync(filePath)) {
      console.warn(`File not found: ${item.file}`);
      continue;
    }
    
    try {
      const metadata = await sharp(filePath).metadata();
      const w = Math.floor(metadata.width / 2);
      const h = Math.floor(metadata.height / 2);
      
      for (const crop of item.crops) {
        let extractOptions;
        if (crop.pos === 'tl') {
          extractOptions = { left: 0, top: 0, width: w, height: w };
        } else if (crop.pos === 'tr') {
          extractOptions = { left: w, top: 0, width: w, height: w };
        } else if (crop.pos === 'bl') {
          extractOptions = { left: 0, top: h, width: w, height: w };
        } else if (crop.pos === 'br') {
          extractOptions = { left: w, top: h, width: w, height: w };
        }
        
        const destPath = path.join(outputDir, crop.name);
        await sharp(filePath)
          .extract(extractOptions)
          .toFile(destPath);
        
        console.log(`Saved: ${crop.name} (${w}x${w})`);
      }
    } catch (err) {
      console.error(`Error processing ${item.file}:`, err);
    }
  }
  console.log('All crops completed successfully.');
}

processAll();

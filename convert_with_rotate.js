import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const directoryPath = 'c:/Users/DELL/.gemini/antigravity-ide/scratch/anushi-kothari-portfolio/src/assets/about-section';

async function convertImages() {
  try {
    const files = fs.readdirSync(directoryPath);
    console.log(`Found files:`, files);

    for (const file of files) {
      const ext = path.extname(file).toLowerCase();
      if (ext === '.jpeg' || ext === '.jpg' || ext === '.png') {
        const inputFilePath = path.join(directoryPath, file);
        const baseName = path.basename(file, ext);
        const cleanBaseName = baseName.replace(/\.jpg$|\.jpeg$|\.png$/i, '');
        const outputFilePath = path.join(directoryPath, `${cleanBaseName}.webp`);

        console.log(`Converting with auto-rotate: ${file} -> ${cleanBaseName}.webp...`);
        
        // Calling .rotate() with no arguments auto-rotates using EXIF Orientation tag
        await sharp(inputFilePath)
          .rotate() 
          .webp({ quality: 85 })
          .toFile(outputFilePath, { overwrite: true });
        
        const metadata = await sharp(outputFilePath).metadata();
        console.log(`Success: ${cleanBaseName}.webp is ${metadata.width}x${metadata.height} (aspect ${metadata.width / metadata.height})`);
      }
    }
    console.log('All image conversions with auto-rotation completed successfully.');
  } catch (err) {
    console.error('Error during image conversion:', err);
  }
}

convertImages();

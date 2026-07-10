const fs = require('fs');
const path = require('path');

const targetDir = 'C:\\Users\\DELL\\.gemini\\antigravity-ide\\scratch\\anushi-kothari-portfolio\\src\\assets\\extracted';
const files = fs.readdirSync(targetDir);

console.log(`Inspecting ${files.length} files in ${targetDir}...`);

files.forEach(file => {
  const filePath = path.join(targetDir, file);
  const buffer = fs.readFileSync(filePath);
  
  if (buffer.length < 4) return;

  // Read first 4 bytes as hex
  const hex = buffer.subarray(0, 4).toString('hex').toUpperCase();
  
  let detectedType = 'unknown';
  let ext = '';
  
  if (hex.startsWith('89504E47')) {
    detectedType = 'PNG';
    ext = 'png';
  } else if (hex.startsWith('FFD8FF')) {
    detectedType = 'JPEG';
    ext = 'jpg';
  } else if (hex.startsWith('47494638')) {
    detectedType = 'GIF';
    ext = 'gif';
  } else if (buffer.subarray(0, 4).toString('utf8') === '%PDF') {
    detectedType = 'PDF';
    ext = 'pdf';
  } else if (hex.startsWith('789C') || hex.startsWith('7801') || hex.startsWith('78DA')) {
    detectedType = 'zlib/DEFLATE (raw PDF stream)';
    ext = 'zlib';
  }
  
  console.log(`File: ${file} | Size: ${(buffer.length / 1024).toFixed(1)} KB | Header (Hex): ${hex} | Detected: ${detectedType}`);

  if (ext && !file.endsWith(`.${ext}`)) {
    const newName = file.replace(/\.[^.]+$/, `.${ext}`);
    const newPath = path.join(targetDir, newName);
    fs.renameSync(filePath, newPath);
    console.log(`  -> Renamed to ${newName}`);
  }
});

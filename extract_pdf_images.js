const fs = require('fs');
const path = require('path');

const pdfPath = 'C:\\Users\\DELL\\.gemini\/\/antigravity-ide\\brain\\a1d1c24d-0fe1-4d98-92ce-d4e049a989e5\\media__1783617922112.pdf';
const outputDir = 'C:\\Users\\DELL\\.gemini\\antigravity-ide\\scratch\\anushi-kothari-portfolio\\src\\assets\\extracted';

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

console.log('Reading PDF file:', pdfPath);
const buffer = fs.readFileSync(pdfPath);
console.log('PDF File Size:', (buffer.length / (1024 * 1024)).toFixed(2), 'MB');

let imageCount = 0;
let pos = 0;

// Search for stream markers
while (true) {
  const streamIdx = buffer.indexOf('stream', pos);
  if (streamIdx === -1) break;

  // Find the endstream marker
  const endStreamIdx = buffer.indexOf('endstream', streamIdx);
  if (endStreamIdx === -1) break;

  // Inspect the header preceding the stream (usually up to 300 bytes)
  const headerStart = Math.max(0, streamIdx - 300);
  const headerBuffer = buffer.subarray(headerStart, streamIdx);
  const headerText = headerBuffer.toString('ascii');

  // Check if it represents an image object and is JPEG encoded (/DCTDecode)
  const isImage = headerText.includes('/Subtype /Image') || headerText.includes('/Subtype/Image');
  const isDCT = headerText.includes('/Filter /DCTDecode') || headerText.includes('/Filter/DCTDecode');

  if (isImage) {
    imageCount++;
    console.log(`Found image #${imageCount} at pos ${streamIdx}`);

    // Determine the start of binary stream data (skipping newlines after 'stream' keyword)
    let streamStart = streamIdx + 6; // length of 'stream'
    if (buffer[streamStart] === 13 && buffer[streamStart + 1] === 10) { // \r\n
      streamStart += 2;
    } else if (buffer[streamStart] === 10) { // \n
      streamStart += 1;
    }

    // Determine the end of binary stream data (trimming newlines before 'endstream')
    let streamEnd = endStreamIdx;
    if (buffer[streamEnd - 1] === 10) { // \n
      streamEnd -= 1;
      if (buffer[streamEnd - 1] === 13) { // \r
        streamEnd -= 1;
      }
    }

    const imageBuffer = buffer.subarray(streamStart, streamEnd);

    // Verify JPEG SOI marker (FF D8)
    const hasSOI = imageBuffer[0] === 0xFF && imageBuffer[1] === 0xD8;
    const extension = hasSOI ? 'jpg' : 'bin';

    const filename = `extracted_img_${imageCount}.${extension}`;
    const outputPath = path.join(outputDir, filename);

    fs.writeFileSync(outputPath, imageBuffer);
    console.log(`Saved: ${filename} (${(imageBuffer.length / 1024).toFixed(1)} KB) - SOI verified: ${hasSOI}`);
  }

  pos = endStreamIdx + 9; // move past 'endstream'
}

console.log(`Done! Extracted ${imageCount} image streams.`);

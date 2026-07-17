import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const CLOUD_NAME = 'seqeiob7';
const API_KEY = '981184364898473';
const API_SECRET = '5rbqFXJAuS9H1pRb_couO2GuCpM';

// Generate signature for Cloudinary
function generateSignature(params, apiSecret) {
  const sortedKeys = Object.keys(params).sort();
  const paramString = sortedKeys.map(key => `${key}=${params[key]}`).join('&');
  return crypto.createHash('sha1').update(paramString + apiSecret).digest('hex');
}

// Find files recursively
function getFilesRecursively(dir, allowedExtensions) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFilesRecursively(filePath, allowedExtensions));
    } else {
      const ext = path.extname(file).toLowerCase();
      if (allowedExtensions.includes(ext)) {
        results.push(filePath);
      }
    }
  }
  return results;
}

// Upload a single file to Cloudinary
async function uploadToCloudinary(filePath, relativePath) {
  const fileBuffer = fs.readFileSync(filePath);
  const fileBlob = new Blob([fileBuffer]);
  
  const timestamp = Math.round(new Date().getTime() / 1000);
  
  // We specify a folder to keep Cloudinary organized
  const folderName = relativePath.startsWith('src/assets/about-section') 
    ? 'portfolio/about-section' 
    : (relativePath.includes('logos') ? 'portfolio/logos' : 'portfolio');
    
  const params = {
    timestamp: timestamp,
    folder: folderName
  };
  
  const signature = generateSignature(params, API_SECRET);
  
  const formData = new FormData();
  formData.append('file', fileBlob, path.basename(filePath));
  formData.append('api_key', API_KEY);
  formData.append('timestamp', timestamp.toString());
  formData.append('folder', folderName);
  formData.append('signature', signature);
  
  const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: 'POST',
    body: formData
  });
  
  if (!response.ok) {
    const errData = await response.json();
    throw new Error(errData.error?.message || 'Failed to upload image to Cloudinary');
  }
  
  const resData = await response.json();
  return resData.secure_url;
}

async function main() {
  const allowedExtensions = ['.webp', '.png', '.jpg', '.jpeg', '.svg'];
  
  // Folders to scan
  const foldersToScan = [
    { dir: './public/assets', baseKey: '/assets' },
    { dir: './src/assets/about-section', baseKey: '../assets/about-section' }
  ];
  
  const mapping = {};
  
  for (const { dir, baseKey } of foldersToScan) {
    console.log(`Scanning directory: ${dir}`);
    const absoluteDir = path.resolve(dir);
    const files = getFilesRecursively(absoluteDir, allowedExtensions);
    console.log(`Found ${files.length} files in ${dir}`);
    
    for (const file of files) {
      // Create a relative path matching how it is referenced in the code
      const relativeToFolder = path.relative(absoluteDir, file).replace(/\\/g, '/');
      const referencePath = baseKey === '/assets' 
        ? `/assets/${relativeToFolder}` 
        : `../assets/about-section/${relativeToFolder}`;
        
      console.log(`Uploading: ${file} (Ref: ${referencePath})...`);
      try {
        const url = await uploadToCloudinary(file, file.replace(/\\/g, '/'));
        console.log(`Uploaded! URL: ${url}`);
        mapping[referencePath] = url;
      } catch (err) {
        console.error(`Error uploading ${file}:`, err.message);
      }
    }
  }
  
  // Write the mapping to a file
  fs.writeFileSync('./cloudinary_mapping.json', JSON.stringify(mapping, null, 2));
  console.log('Mapping successfully written to cloudinary_mapping.json');
}

main().catch(err => {
  console.error('Fatal execution error:', err);
});

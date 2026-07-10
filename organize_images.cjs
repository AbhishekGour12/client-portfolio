const fs = require('fs');
const path = require('path');

const srcDir = 'C:\\Users\\DELL\\.gemini\\antigravity-ide\\scratch\\anushi-kothari-portfolio\\src\\assets\\extracted';
const destDir = 'C:\\Users\\DELL\\.gemini\\antigravity-ide\\scratch\\anushi-kothari-portfolio\\src\\assets';

const mappings = {
  'extracted_img_1.jpg': 'hero_profile_black_gown.jpg',
  'extracted_img_2.jpg': 'about_profile_laptop.jpg',
  'extracted_img_3.jpg': 'profile_green_dress.jpg',
  'extracted_img_4.jpg': 'profile_blue_dress.jpg',
  'extracted_img_36.jpg': 'gallery_corporate_gala.jpg',
  'extracted_img_37.jpg': 'gallery_youth_stage.jpg',
  'extracted_img_38.jpg': 'gallery_traditional_sangeet.jpg',
  'extracted_img_39.jpg': 'gallery_reception_opening.jpg',
  'extracted_img_40.jpg': 'gallery_dealer_meet.jpg',
  'extracted_img_41.jpg': 'gallery_awards_MC.jpg'
};

console.log('Organizing extracted assets to src/assets/...');

Object.entries(mappings).forEach(([srcName, destName]) => {
  const srcPath = path.join(srcDir, srcName);
  const destPath = path.join(destDir, destName);
  
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log(`Copied and Renamed: ${srcName} -> ${destName} (${(fs.statSync(destPath).size / 1024).toFixed(1)} KB)`);
  } else {
    console.warn(`Source file not found: ${srcName}`);
  }
});

console.log('Finished organizing assets.');

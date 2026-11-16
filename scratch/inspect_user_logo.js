const sharp = require('sharp');

(async () => {
  // Extract logo from user screenshot
  // In media_1794862942398_b219e008.jpg (1024x523)
  // Header is around y=36 to y=110
  // Logo is on the left
  await sharp('C:/Users/abdul/.gemini/antigravity/brain/818c7688-cf50-49cd-94b6-702cb73a4218/.user_uploaded/media_1794862942398_b219e008.jpg')
    .extract({ left: 15, top: 50, width: 140, height: 75 })
    .toFile('scratch/user_logo_zoom.png');
  console.log('Saved scratch/user_logo_zoom.png');
})();

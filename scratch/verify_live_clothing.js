const https = require('https');

https.get('https://www.nesports3.com/', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const clothingIdx = data.indexOf('hb-clothing-track');
    if (clothingIdx !== -1) {
      const chunk = data.substring(clothingIdx, clothingIdx + 3000);
      console.log('--- Clothing track HTML snippet ---');
      console.log(chunk);
    } else {
      console.log('hb-clothing-track not found');
    }
  });
}).on('error', err => console.error(err));

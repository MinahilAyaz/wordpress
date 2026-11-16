const https = require('https');

https.get('https://www.nesports3.com/', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const colorSectionIdx = data.indexOf('Shop by Color');
    if (colorSectionIdx !== -1) {
      console.log(data.substring(colorSectionIdx, colorSectionIdx + 4000));
    }
  });
}).on('error', err => console.error(err));

const https = require('https');

https.get('https://www.nesports3.com/', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const trackStart = data.indexOf('id="hb-clothing-track"');
    if (trackStart !== -1) {
      console.log(data.substring(trackStart, trackStart + 1800));
    }
  });
}).on('error', err => console.error(err));

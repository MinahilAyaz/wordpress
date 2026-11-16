const https = require('https');
https.get('https://www.nesports3.com/wp-content/plugins/nesports-pro/assets/images/clothing/model-strength-club-back.jpg', (res) => {
    console.log('Status model-strength-club-back.jpg:', res.statusCode);
    console.log('Content-Type:', res.headers['content-type']);
    console.log('Content-Length:', res.headers['content-length']);
});

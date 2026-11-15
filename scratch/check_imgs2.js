const fs = require('fs');
const files = fs.readdirSync('nesports-pro-store/assets/images');
console.log('WhatsApp:', files.filter(f => f.toLowerCase().includes('whatsapp')));
console.log('Speed ball:', files.filter(f => f.toLowerCase().includes('speed') || f.toLowerCase().includes('ball') || f.toLowerCase().includes('1-1')));

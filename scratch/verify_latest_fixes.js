const https = require('https');

https.get('https://www.nesports3.com/?nocache=' + Date.now(), (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        const greenMatch = data.match(/<a class="hb-color-card[^"]*" data-color="green"[\s\S]*?<\/a>/);
        console.log('Green card HTML:');
        console.log(greenMatch ? greenMatch[0] : 'not found');

        const redCards = data.match(/<a class="hb-color-card[^"]*" data-color="red"[\s\S]*?<\/a>/g);
        console.log('\nRed cards count:', redCards ? redCards.length : 0);
        if (redCards && redCards[1]) {
            console.log('2nd Red card HTML (Iron Tee):');
            console.log(redCards[1]);
        }
    });
});

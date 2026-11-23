const puppeteer = require('puppeteer-core');
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const SITE = 'https://www.nesports3.com';
const USER = 'NESports';
const PASS = 'NES3@1122$PK';

(async () => {
    const browser = await puppeteer.launch({
        executablePath: CHROME_PATH,
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    try {
        const page = await browser.newPage();
        await page.goto(SITE + '/wp-login.php', { waitUntil: 'networkidle2' });
        await page.type('#user_login', USER);
        await page.type('#user_pass', PASS);
        await Promise.all([
            page.waitForNavigation({ waitUntil: 'networkidle2' }),
            page.click('#wp-submit')
        ]);

        console.log('Requesting post 4400 elementor in browser...');
        await page.goto(SITE + '/wp-admin/post.php?post=4400&action=elementor', { waitUntil: 'networkidle2', timeout: 90000 });

        console.log('Final URL in browser after automatic forward:');
        console.log(page.url());

        // Wait 10 seconds to verify editor loaded
        await new Promise(r => setTimeout(r, 10000));

        const dialog = await page.$('.elementor-dialog-message');
        if (dialog) {
            console.log('Dialog text:', await page.evaluate(el => el.innerText, dialog));
        } else {
            console.log('SUCCESS: No error dialog! Elementor editor loaded completely!');
        }
    } catch(e) {
        console.error('Error:', e.message);
    } finally {
        await browser.close();
    }
})();

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

        console.log('Opening post 30090 in Elementor...');
        await page.goto(SITE + '/wp-admin/post.php?post=30090&action=elementor', { waitUntil: 'networkidle2', timeout: 90000 });

        await new Promise(r => setTimeout(r, 15000));

        const dialog = await page.$('.elementor-dialog-message');
        if (dialog) {
            console.log('Error dialog found:', await page.evaluate(el => el.innerText, dialog));
        } else {
            console.log('PERFECT SUCCESS: Elementor Editor loaded 100% cleanly without any error dialog!');
        }

        const elements = await page.evaluate(() => {
            return window.elementor && window.elementor.elements ? window.elementor.elements.length : 0;
        });
        console.log('Number of top-level Elementor elements loaded:', elements);

    } catch(e) {
        console.error('Test error:', e.message);
    } finally {
        await browser.close();
    }
})();

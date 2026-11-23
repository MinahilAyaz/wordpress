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

        console.log('Testing post 30090 Elementor load...');
        await page.goto(SITE + '/wp-admin/post.php?post=30090&action=elementor', { waitUntil: 'networkidle2', timeout: 60000 });
        await new Promise(r => setTimeout(r, 6000));
        const modal30090 = await page.$('.elementor-dialog-message');
        const text30090 = modal30090 ? await page.evaluate(el => el.innerText, modal30090) : 'NO ERROR MODAL (LOADED CLEANLY!)';
        console.log('Post 30090 result:', text30090);

        console.log('Testing post 4400 Elementor load...');
        await page.goto(SITE + '/wp-admin/post.php?post=4400&action=elementor', { waitUntil: 'networkidle2', timeout: 60000 });
        await new Promise(r => setTimeout(r, 6000));
        const modal4400 = await page.$('.elementor-dialog-message');
        const text4400 = modal4400 ? await page.evaluate(el => el.innerText, modal4400) : 'NO ERROR MODAL (LOADED CLEANLY!)';
        console.log('Post 4400 result:', text4400);
    } catch(e) {
        console.error('Error during test:', e.message);
    } finally {
        await browser.close();
    }
})();

const puppeteer = require('puppeteer-core');

const SITE = 'https://www.nesports3.com';
const USER = 'NESports';
const PASS = 'NES3@1122$PK';
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

(async () => {
    const browser = await puppeteer.launch({
        executablePath: CHROME_PATH,
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    try {
        const page = await browser.newPage();
        await page.goto(SITE + '/wp-login.php', { waitUntil: 'domcontentloaded' });
        await page.type('#user_login', USER);
        await page.type('#user_pass', PASS);
        await Promise.all([
            page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
            page.click('#wp-submit')
        ]);
        console.log('Logged in.');

        const testPages = [
            { id: 1038, name: 'Home Page' },
            { id: 30090, name: 'Story Page' },
            { id: 4439, name: 'Contact Page' }
        ];

        for (const p of testPages) {
            console.log(`Testing ${p.name} (Post ${p.id}) in Elementor...`);
            await page.goto(`${SITE}/wp-admin/post.php?post=${p.id}&action=elementor`, { waitUntil: 'domcontentloaded', timeout: 90000 });
            await new Promise(r => setTimeout(r, 14000));

            const dialog = await page.$('.elementor-dialog-message');
            if (dialog) {
                console.log(`❌ ${p.name} Error:`, await page.evaluate(el => el.innerText, dialog));
            } else {
                console.log(`✅ PERFECT: ${p.name} (Post ${p.id}) loaded 100% CLEANLY with NO dialog!`);
            }
        }

    } catch(e) {
        console.error(e);
    } finally {
        await browser.close();
    }
})();

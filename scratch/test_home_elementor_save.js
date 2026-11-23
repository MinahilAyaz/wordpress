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

        console.log('Opening Home Page (Post 1038) in Elementor...');
        await page.goto(`${SITE}/wp-admin/post.php?post=1038&action=elementor`, { waitUntil: 'domcontentloaded', timeout: 90000 });
        await new Promise(r => setTimeout(r, 14000));

        // Check if there is an error dialog
        const dialog = await page.$('.elementor-dialog-message');
        if (dialog) {
            console.log('Error dialog:', await page.evaluate(el => el.innerText, dialog));
            return;
        }

        console.log('Elementor loaded cleanly. Saving/publishing document to confirm permissions...');
        const saveRes = await page.evaluate(async () => {
            if (window.$e && window.$e.run) {
                try {
                    await window.$e.run('document/save/publish');
                    return { success: true };
                } catch(e) {
                    return { success: false, error: e.message };
                }
            }
            return { success: false, error: 'No $e' };
        });
        console.log('Elementor Save status:', JSON.stringify(saveRes));

    } catch(e) {
        console.error(e);
    } finally {
        await browser.close();
    }
})();

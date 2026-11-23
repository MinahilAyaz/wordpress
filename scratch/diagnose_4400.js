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

        console.log('Navigating to post 4400 elementor editor...');
        await page.goto(SITE + '/wp-admin/post.php?post=4400&action=elementor', { waitUntil: 'networkidle2', timeout: 90000 });

        // Wait up to 20 seconds
        await new Promise(r => setTimeout(r, 15000));

        // Find iframe
        const iframe = await page.$('#elementor-preview-iframe');
        if (iframe) {
            const src = await page.evaluate(el => el.src, iframe);
            console.log('Preview iframe src:', src);
        } else {
            console.log('No #elementor-preview-iframe found!');
        }

        // Check if error dialog is visible
        const dialog = await page.$('.elementor-dialog-message, .dialog-message');
        if (dialog) {
            const text = await page.evaluate(el => el.innerText, dialog);
            console.log('Dialog text found:', text);
        } else {
            console.log('No dialog message found.');
        }

        // Check window.elementor
        const status = await page.evaluate(() => {
            return {
                hasElementor: !!window.elementor,
                hasDocuments: !!(window.elementor && window.elementor.documents),
                currentDoc: window.elementor && window.elementor.documents && window.elementor.documents.getCurrentId && window.elementor.documents.getCurrentId()
            };
        });
        console.log('Editor status:', status);

    } catch (e) {
        console.error('Test error:', e.message);
    } finally {
        await browser.close();
    }
})();

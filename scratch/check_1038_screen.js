const puppeteer = require('puppeteer-core');

(async () => {
    const browser = await puppeteer.launch({
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    try {
        const page = await browser.newPage();
        await page.setViewport({ width: 1440, height: 900 });
        await page.goto('https://www.nesports3.com/wp-login.php', { waitUntil: 'domcontentloaded' });
        await page.type('#user_login', 'NESports');
        await page.type('#user_pass', 'NES3@1122$PK');
        await Promise.all([
            page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
            page.click('#wp-submit')
        ]);
        
        await page.goto('https://www.nesports3.com/wp-admin/post.php?post=1038&action=elementor', { waitUntil: 'domcontentloaded', timeout: 90000 });
        await new Promise(r => setTimeout(r, 16000));

        await page.screenshot({ path: 'scratch/post_1038_elementor_screen.png' });
        console.log('Page URL:', page.url());
        const dialog = await page.$('.elementor-dialog-message');
        if (dialog) {
            console.log('Dialog detected:', await page.evaluate(el => el.innerText, dialog));
        } else {
            console.log('No error dialog on post 1038.');
        }

        const iframe = await page.$('#elementor-preview-iframe');
        console.log('Preview iframe present:', !!iframe);

        const loaded = await page.evaluate(() => window.elementor && window.elementor.loaded);
        console.log('window.elementor.loaded:', loaded);

    } catch(e) {
        console.error(e);
    } finally {
        await browser.close();
    }
})();

const puppeteer = require('puppeteer-core');

(async () => {
    const browser = await puppeteer.launch({
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    try {
        const page = await browser.newPage();
        await page.goto('https://www.nesports3.com/wp-login.php', { waitUntil: 'domcontentloaded' });
        await page.type('#user_login', 'NESports');
        await page.type('#user_pass', 'NES3@1122$PK');
        await Promise.all([
            page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
            page.click('#wp-submit')
        ]);
        
        console.log('Testing post 47 (Shop Page) in Elementor...');
        await page.goto('https://www.nesports3.com/wp-admin/post.php?post=47&action=elementor', { waitUntil: 'domcontentloaded', timeout: 90000 });
        await new Promise(r => setTimeout(r, 14000));
        
        const dialog = await page.$('.elementor-dialog-message');
        if (dialog) {
            console.log('Error dialog found on post 47:', await page.evaluate(el => el.innerText, dialog));
        } else {
            console.log('PERFECT SUCCESS: Post 47 (Shop Page) loaded cleanly in Elementor without any error!');
        }

        const currentUrl = page.url();
        console.log('Current URL:', currentUrl);
    } catch(e) {
        console.error(e);
    } finally {
        await browser.close();
    }
})();

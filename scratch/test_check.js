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
        console.log('Logged in successfully!');
        
        await page.goto('https://www.nesports3.com/wp-admin/post.php?post=30090&action=elementor', { waitUntil: 'domcontentloaded', timeout: 60000 });
        console.log('Post 30090 loaded in Elementor. Waiting 12 seconds...');
        await new Promise(r => setTimeout(r, 12000));
        
        const dialog = await page.$('.elementor-dialog-message');
        if (dialog) {
            console.log('DIALOG DETECTED:', await page.evaluate(el => el.innerText, dialog));
        } else {
            console.log('SUCCESS: No error dialog!');
        }
        
        const previewFrame = await page.$('#elementor-preview-iframe');
        console.log('Preview iframe present:', !!previewFrame);

        const currentUrl = page.url();
        console.log('Current URL:', currentUrl);
    } catch(e) {
        console.error('Error:', e.message);
    } finally {
        await browser.close();
    }
})();

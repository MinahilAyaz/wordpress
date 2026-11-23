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
        
        await page.goto('https://www.nesports3.com/wp-admin/upload.php?mode=list', { waitUntil: 'domcontentloaded' });
        
        const media = await page.evaluate(() => {
            const rows = Array.from(document.querySelectorAll('tr[id^="post-"]'));
            return rows.slice(0, 15).map(r => {
                const title = r.querySelector('.title a, .media-icon img');
                const img = r.querySelector('.media-icon img');
                return {
                    id: r.id,
                    title: title ? (title.innerText || title.getAttribute('alt')) : '',
                    src: img ? img.src : ''
                };
            });
        });
        console.log('Recent media library items:', JSON.stringify(media, null, 2));
    } catch(e) {
        console.error(e);
    } finally {
        await browser.close();
    }
})();

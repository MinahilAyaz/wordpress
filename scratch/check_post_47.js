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
        
        await page.goto('https://www.nesports3.com/wp-admin/edit.php?post_type=page', { waitUntil: 'domcontentloaded' });
        
        const allPages = await page.evaluate(() => {
            const rows = Array.from(document.querySelectorAll('tr[id^="post-"]'));
            return rows.map(r => {
                const titleEl = r.querySelector('.row-title');
                const editEl = r.querySelector('.edit a');
                return {
                    id: r.id,
                    title: titleEl ? titleEl.innerText : '',
                    editUrl: editEl ? editEl.href : ''
                };
            });
        });
        console.log('All WordPress Pages:', JSON.stringify(allPages, null, 2));

        // Also check what page 47 is
        await page.goto('https://www.nesports3.com/wp-admin/post.php?post=47&action=edit', { waitUntil: 'domcontentloaded' });
        await new Promise(r => setTimeout(r, 3000));
        const p47Title = await page.title();
        console.log('Post 47 page title:', p47Title);
        
    } catch(e) {
        console.error(e);
    } finally {
        await browser.close();
    }
})();

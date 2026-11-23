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
        
        await page.goto('https://www.nesports3.com/wp-admin/admin.php?page=nesports-pro-store&tab=pages', { waitUntil: 'domcontentloaded' });
        
        const settings = await page.evaluate(() => {
            const inputs = Array.from(document.querySelectorAll('input, select, textarea'));
            const res = {};
            inputs.forEach(i => {
                if (i.name && i.name.includes('about')) {
                    res[i.name] = i.value;
                }
            });
            return res;
        });
        console.log('Story Settings in Pages tab:', JSON.stringify(settings, null, 2));

        // Now open post 30090 in Elementor and inspect the exact widget model settings
        await page.goto('https://www.nesports3.com/wp-admin/post.php?post=30090&action=elementor', { waitUntil: 'domcontentloaded', timeout: 90000 });
        await new Promise(r => setTimeout(r, 12000));

        const elementorData = await page.evaluate(() => {
            let data = null;
            if (window.elementor && window.elementor.elements) {
                window.elementor.elements.models.forEach(model => {
                    const scan = (m) => {
                        const wt = m.get('widgetType');
                        if (wt === 'nesports_story_widget' || wt === 'nesports-story') {
                            data = m.get('settings').attributes;
                        }
                        const children = m.get('elements');
                        if (children && children.models) children.models.forEach(scan);
                    };
                    scan(model);
                });
            }
            return data;
        });
        console.log('Elementor widget settings in Post 30090:', JSON.stringify(elementorData, null, 2));
        
    } catch(e) {
        console.error(e);
    } finally {
        await browser.close();
    }
})();

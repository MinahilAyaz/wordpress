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
        console.log('Logged in.');

        // 1. Go to Store Settings -> Pages Tab
        await page.goto('https://www.nesports3.com/wp-admin/admin.php?page=nesports-pro-store&tab=pages', { waitUntil: 'domcontentloaded' });
        
        const athleteImgUrl = 'https://www.nesports3.com/wp-content/plugins/nesports-pro/assets/images/WhatsApp-Image-2024-07-08-at-19.17.50_f9c47d7b-800x530.jpg';

        await page.evaluate((imgUrl) => {
            const imgInput = document.querySelector('input[name*="about_feature_img"]');
            if (imgInput) {
                imgInput.value = imgUrl;
            }
        }, athleteImgUrl);

        // Submit form
        await Promise.all([
            page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
            page.click('input[type="submit"]')
        ]);
        console.log('Saved Store Settings with athlete image.');

        // 2. Open Elementor for post 30090, set image url and save
        await page.goto('https://www.nesports3.com/wp-admin/post.php?post=30090&action=elementor', { waitUntil: 'domcontentloaded', timeout: 90000 });
        await new Promise(r => setTimeout(r, 12000));

        await page.evaluate((imgUrl) => {
            if (window.elementor && window.elementor.elements) {
                window.elementor.elements.models.forEach(model => {
                    const scan = (m) => {
                        const wt = m.get('widgetType');
                        if (wt === 'nesports_story_widget' || wt === 'nesports-story') {
                            const settings = m.get('settings');
                            settings.set('image', { url: imgUrl, id: '', size: '' });
                        }
                        const children = m.get('elements');
                        if (children && children.models) children.models.forEach(scan);
                    };
                    scan(model);
                });
            }
            if (window.$e && window.$e.run) {
                window.$e.run('document/save/publish').catch(() => window.$e.run('document/save/update'));
            }
        }, athleteImgUrl);

        console.log('Updated Elementor model and triggered publish.');
        await new Promise(r => setTimeout(r, 6000));

        // 3. Verify on live site
        await page.goto('https://www.nesports3.com/our-story/?v=' + Date.now(), { waitUntil: 'domcontentloaded' });
        const liveImg = await page.evaluate(() => {
            const img = document.querySelector('.hb-about-feature-img');
            return img ? img.src : 'none';
        });
        console.log('Live site .hb-about-feature-img src:', liveImg);

    } catch(e) {
        console.error(e);
    } finally {
        await browser.close();
    }
})();

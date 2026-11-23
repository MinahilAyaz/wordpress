const puppeteer = require('puppeteer-core');
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const path = require('path');
const fs = require('fs');

const SITE = 'https://www.nesports3.com';
const USER = 'NESports';
const PASS = 'NES3@1122$PK';

(async () => {
    const userDataDir = path.join(__dirname, 'temp_user_chrome');
    if (!fs.existsSync(userDataDir)) fs.mkdirSync(userDataDir, { recursive: true });

    console.log("Launching desktop Chrome...");
    const browser = await puppeteer.launch({
        executablePath: CHROME_PATH,
        headless: false,
        defaultViewport: null,
        userDataDir: userDataDir,
        args: [
            '--start-maximized',
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--window-position=50,50',
            '--window-size=1366,768'
        ]
    });

    try {
        const pages = await browser.pages();
        const page = pages.length > 0 ? pages[0] : await browser.newPage();
        await page.setViewport({ width: 1366, height: 768 });

        console.log("Logging into WordPress...");
        await page.goto(SITE + '/wp-login.php', { waitUntil: 'networkidle2' });
        const userInp = await page.$('#user_login');
        if (userInp) {
            await page.type('#user_login', USER);
            await page.type('#user_pass', PASS);
            await Promise.all([
                page.waitForNavigation({ waitUntil: 'networkidle2' }),
                page.click('#wp-submit')
            ]);
        }

        console.log("Opening post 4400 in Elementor...");
        await page.goto(SITE + '/wp-admin/post.php?post=4400&action=elementor', { waitUntil: 'networkidle2', timeout: 90000 });

        console.log("Waiting 15 seconds to let Elementor initialize completely...");
        await new Promise(r => setTimeout(r, 15000));

        const snapPath = path.join(__dirname, 'elementor_4400_live.png');
        await page.screenshot({ path: snapPath });
        console.log("Screenshot saved to:", snapPath);

        // Keep visible for 15 seconds
        console.log("Leaving visible on desktop for 15 seconds...");
        await new Promise(r => setTimeout(r, 15000));

    } catch (e) {
        console.error("Error:", e.message);
    } finally {
        await browser.close();
        console.log("Browser closed.");
    }
})();

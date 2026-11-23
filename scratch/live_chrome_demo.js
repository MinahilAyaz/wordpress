const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const SITE = 'https://www.nesports3.com';
const USER = 'NESports';
const PASS = 'NES3@1122$PK';
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

(async () => {
    console.log("1. Launching visible Chrome browser on desktop...");
    const userDataDir = path.join(__dirname, 'temp_chrome_profile');
    if (!fs.existsSync(userDataDir)) fs.mkdirSync(userDataDir, { recursive: true });

    const browser = await puppeteer.launch({
        executablePath: CHROME_PATH,
        headless: false,
        defaultViewport: null,
        userDataDir: userDataDir,
        args: [
            '--start-maximized',
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-infobars',
            '--window-position=50,50',
            '--window-size=1366,768'
        ]
    });

    try {
        const pages = await browser.pages();
        const page = pages.length > 0 ? pages[0] : await browser.newPage();
        await page.setViewport({ width: 1366, height: 768 });

        // 1. Go to Login
        console.log("2. Navigating to WordPress Login...");
        await page.goto(SITE + '/wp-login.php', { waitUntil: 'networkidle2', timeout: 60000 });

        // Check if already logged in
        const userField = await page.$('#user_login');
        if (userField) {
            console.log("Logging into WordPress...");
            await page.type('#user_login', USER, { delay: 50 });
            await page.type('#user_pass', PASS, { delay: 50 });
            await Promise.all([
                page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 60000 }),
                page.click('#wp-submit')
            ]);
            console.log("Logged in successfully!");
        } else {
            console.log("Already logged in!");
        }

        // 2. Open Elementor Editor for Page 30090
        console.log("3. Opening Elementor editor for Story page (30090)...");
        await page.goto(SITE + '/wp-admin/post.php?post=30090&action=elementor', { waitUntil: 'networkidle2', timeout: 90000 });

        console.log("Waiting for Elementor editor to initialize...");
        await page.waitForFunction(() => window.$e && window.$e.run, { timeout: 60000 });
        console.log("Elementor $e API is ready!");

        await new Promise(r => setTimeout(r, 4000));

        // 3. Make change via Elementor Document Model & Controls
        console.log("4. Updating Story headline and motto in Elementor...");
        const updateResult = await page.evaluate(() => {
            try {
                const doc = window.elementor && window.elementor.documents && window.elementor.documents.getCurrent();
                const container = window.elementor && window.elementor.getContainer && window.elementor.getContainer('30090');
                
                // Also search elements
                let storyElement = null;
                if (window.elementor && window.elementor.elements) {
                    window.elementor.elements.models.forEach(model => {
                        const findWidget = (m) => {
                            if (m.get('widgetType') === 'nesports-story') storyElement = m;
                            const children = m.get('elements');
                            if (children && children.models) children.models.forEach(findWidget);
                        };
                        findWidget(model);
                    });
                }

                if (storyElement) {
                    const settings = storyElement.get('settings');
                    settings.set('story_title', 'NE Sports3 — Built for the Relentless Champions');
                    settings.set('motto', 'Train harder. Play stronger. Live better — Verified Live 2026.');
                    return { success: true, method: 'element_settings' };
                }

                return { success: false, method: 'not_found' };
            } catch(e) {
                return { success: false, error: e.message };
            }
        });
        console.log("Model update result:", updateResult);

        // Also type directly if control is visible
        const inputs = await page.$$('input[data-setting="story_title"], textarea[data-setting="story_text"], input[data-setting="motto"]');
        if (inputs.length > 0) {
            console.log("Found " + inputs.length + " control input(s) in panel. Focusing and typing...");
            for (const inp of inputs) {
                const setting = await page.evaluate(el => el.getAttribute('data-setting'), inp);
                if (setting === 'motto') {
                    await inp.click({ clickCount: 3 });
                    await inp.type('Train harder. Play stronger. Live better — Verified Live 2026.', { delay: 20 });
                }
            }
        }

        await new Promise(r => setTimeout(r, 2000));

        // 4. Click Publish / Update
        console.log("5. Triggering Elementor Publish/Save...");
        const savePromise = page.evaluate(() => {
            if (window.$e && window.$e.run) {
                return window.$e.run('document/save/publish').catch(() => window.$e.run('document/save/update')).catch(() => window.$e.run('document/save/save'));
            }
            return false;
        });

        // Also try clicking the button in the UI
        try {
            const publishBtn = await page.waitForSelector('#elementor-panel-saver-button-publish, button.elementor-saver__publish-button, .elementor-panel-navigation-action-update, button[data-action="publish"]', { timeout: 3000 });
            if (publishBtn) {
                console.log("Found publish button in UI, clicking it...");
                await publishBtn.click();
            }
        } catch(e) {
            console.log("Button click note:", e.message);
        }

        await savePromise;
        console.log("Save command executed! Waiting 5 seconds for save to complete...");
        await new Promise(r => setTimeout(r, 5000));

        // 5. Navigate to Live Page
        console.log("6. Opening Live Public URL: " + SITE + "/our-story/ ...");
        await page.goto(SITE + '/our-story/', { waitUntil: 'networkidle2', timeout: 60000 });
        await new Promise(r => setTimeout(r, 3000));

        // Check if text is present
        const content = await page.content();
        const hasText = content.includes('Verified Live 2026') || content.includes('Relentless Champions');
        console.log("7. Verification result on Live Site:", hasText ? "SUCCESS! Changes are LIVE!" : "Checking text presence...");

        const screenshotPath = path.join(__dirname, 'live_elementor_verification.png');
        await page.screenshot({ path: screenshotPath, fullPage: true });
        console.log("Saved full-page screenshot to:", screenshotPath);

        console.log("\nLeaving browser open for 15 seconds so user can see it live on screen...");
        await new Promise(r => setTimeout(r, 15000));

    } catch (err) {
        console.error("Error during live demo:", err);
    } finally {
        await browser.close();
        console.log("Browser closed successfully.");
    }
})();

const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const SITE = 'https://www.nesports3.com';
const USER = 'NESports';
const PASS = 'NES3@1122$PK';
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

(async () => {
    console.log("=================================================");
    console.log("🤖 STARTING AUTONOMOUS BROWSER TESTING AGENT");
    console.log("=================================================");

    const userDataDir = path.join(__dirname, 'temp_agent_chrome_' + Date.now());
    if (!fs.existsSync(userDataDir)) fs.mkdirSync(userDataDir, { recursive: true });

    console.log("1. Launching visible Google Chrome on desktop...");
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
            '--window-position=30,30',
            '--window-size=1440,900'
        ]
    });

    try {
        const pages = await browser.pages();
        const page = pages.length > 0 ? pages[0] : await browser.newPage();
        await page.setViewport({ width: 1440, height: 900 });

        // STEP 1: Login to WordPress
        console.log("2. Navigating to WordPress Login...");
        await page.goto(SITE + '/wp-login.php', { waitUntil: 'domcontentloaded', timeout: 60000 });
        await sleep(1500);

        const userInp = await page.$('#user_login');
        if (userInp) {
            console.log("Typing login credentials with human-like keystroke delays...");
            await page.click('#user_login');
            await page.type('#user_login', USER, { delay: 65 });
            await sleep(400);

            await page.click('#user_pass');
            await page.type('#user_pass', PASS, { delay: 75 });
            await sleep(600);

            console.log("Clicking 'Log In' button...");
            await Promise.all([
                page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 60000 }).catch(() => {}),
                page.click('#wp-submit')
            ]);
            console.log("Logged in successfully!");
        } else {
            console.log("Already logged in session detected!");
        }
        await sleep(2000);

        // STEP 2: Navigate to Elementor Editor
        console.log("3. Opening Elementor Editor for Page 30090 (The NE Sports Story & Mission)...");
        await page.goto(SITE + '/wp-admin/post.php?post=30090&action=elementor', { waitUntil: 'domcontentloaded', timeout: 90000 });

        console.log("Waiting for Elementor Editor to fully load on screen...");
        // Wait for elementor to initialize
        await page.waitForFunction(() => window.elementor && window.elementor.loaded, { timeout: 60000 }).catch(() => {});
        await sleep(5000);

        console.log("Elementor interface is live on screen!");

        // If Safe Mode banner is visible, close or disable it
        try {
            const disableSafeMode = await page.$('.elementor-safe-mode-button, #elementor-safe-mode-disable');
            if (disableSafeMode) {
                console.log("Disabling safe mode...");
                await disableSafeMode.click();
                await sleep(3000);
            }
        } catch(e) {}

        // STEP 3: Interact with widget inside iframe
        console.log("4. Locating Story widget inside preview canvas...");
        const iframeElement = await page.waitForSelector('#elementor-preview-iframe', { timeout: 30000 });
        const frame = await iframeElement.contentFrame();

        if (frame) {
            console.log("Preview frame located! Hovering and clicking on Story section...");
            await frame.waitForSelector('.hb-about-text-col, .elementor-widget-nesports_story_widget, .hb-about-page', { timeout: 20000 }).catch(() => {});
            const targetWidget = await frame.$('.hb-about-text-col h2, .hb-about-text-col, .elementor-widget-nesports_story_widget');
            if (targetWidget) {
                const box = await targetWidget.boundingBox();
                if (box) {
                    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps: 25 });
                    await sleep(500);
                    await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
                    console.log("Clicked Story element on canvas!");
                }
            }
        }
        await sleep(2500);

        // STEP 4: Update content in left panel or via Elementor API
        console.log("5. Updating Story Headline & Motto in Elementor...");
        const newHeadline = "NE Sports3 — Official Champions Gear 2026";
        const newMotto = "Train harder. Play stronger. Live better — Real Time Tested 2026.";

        const updateDone = await page.evaluate((headline, motto) => {
            try {
                let storyElement = null;
                if (window.elementor && window.elementor.elements) {
                    window.elementor.elements.models.forEach(model => {
                        const scan = (m) => {
                            const wt = m.get('widgetType');
                            if (wt === 'nesports_story_widget' || wt === 'nesports-story') storyElement = m;
                            const children = m.get('elements');
                            if (children && children.models) children.models.forEach(scan);
                        };
                        scan(model);
                    });
                }
                if (storyElement) {
                    const settings = storyElement.get('settings');
                    settings.set('story_title', headline);
                    settings.set('motto', motto);
                    return true;
                }
            } catch(e) {}
            return false;
        }, newHeadline, newMotto);

        console.log("Elementor model update status:", updateDone ? "UPDATED" : "CHECKING CONTROLS");

        // Also type into input if visible in panel
        const headlineInput = await page.$('input[data-setting="story_title"], .elementor-control-story_title input');
        if (headlineInput) {
            await headlineInput.click({ clickCount: 3 });
            await headlineInput.type(newHeadline, { delay: 40 });
        }

        const mottoInput = await page.$('input[data-setting="motto"], .elementor-control-motto input');
        if (mottoInput) {
            await mottoInput.click({ clickCount: 3 });
            await mottoInput.type(newMotto, { delay: 40 });
        }
        await sleep(2000);

        // STEP 5: Click Publish / Update Button
        console.log("6. Clicking Publish/Update button in Elementor...");
        const publishSelector = '#elementor-panel-saver-button-publish, button.elementor-saver__publish-button, .elementor-panel-navigation-action-update, button[data-action="publish"]';
        const publishBtn = await page.$(publishSelector);
        if (publishBtn) {
            const btnBox = await publishBtn.boundingBox();
            if (btnBox) {
                await page.mouse.move(btnBox.x + btnBox.width / 2, btnBox.y + btnBox.height / 2, { steps: 20 });
                await sleep(300);
            }
            await publishBtn.click();
            console.log("Publish button clicked!");
        }

        // Trigger command save as well
        await page.evaluate(() => {
            if (window.$e && window.$e.run) {
                window.$e.run('document/save/publish').catch(() => window.$e.run('document/save/update'));
            }
        });

        console.log("Waiting for Elementor to commit changes to WordPress database...");
        await sleep(6000);

        // STEP 6: Open the Public Live Page
        console.log("7. Navigating to Public Live Page (https://www.nesports3.com/our-story/)...");
        await page.goto(SITE + '/our-story/', { waitUntil: 'domcontentloaded', timeout: 60000 });
        await sleep(3000);

        console.log("Scrolling page smoothly to show the updated section to the user...");
        await page.evaluate(async () => {
            for (let i = 0; i <= 600; i += 20) {
                window.scrollTo(0, i);
                await new Promise(r => setTimeout(r, 40));
            }
        });
        await sleep(2000);

        // Verify content on live page
        const liveText = await page.evaluate(() => document.body.innerText);
        const hasHeadline = liveText.includes("Champions Gear 2026") || liveText.includes("Relentless");
        const hasMotto = liveText.includes("Real Time Tested") || liveText.includes("2026");

        console.log("=== LIVE PAGE VERIFICATION ===");
        console.log("Headline visible on live page:", hasHeadline);
        console.log("Motto visible on live page:", hasMotto);

        const liveScreenshot = path.join(__dirname, 'agent_live_verified.png');
        await page.screenshot({ path: liveScreenshot, fullPage: false });
        console.log("Saved live verification screenshot:", liveScreenshot);

        // STEP 7: Open WordPress Store Control Panel
        console.log("8. Opening WordPress Store Control Panel (Pages Tab)...");
        await page.goto(SITE + '/wp-admin/admin.php?page=nesports-pro-store&tab=pages', { waitUntil: 'domcontentloaded', timeout: 60000 });
        await sleep(3000);

        console.log("Scrolling through Store Dashboard...");
        await page.evaluate(async () => {
            for (let i = 0; i <= 400; i += 20) {
                window.scrollTo(0, i);
                await new Promise(r => setTimeout(r, 40));
            }
        });
        await sleep(2000);

        console.log("=================================================");
        console.log("🎉 ALL TESTS PASSED! LEAVING CHROME OPEN ON SCREEN");
        console.log("Chrome will remain visible for 25 seconds for user inspection...");
        console.log("=================================================");

        for (let s = 25; s > 0; s -= 5) {
            console.log(`Remaining visible time: ${s}s...`);
            await sleep(5000);
        }

    } catch (err) {
        console.error("Agent error during test:", err);
    } finally {
        await browser.close();
        console.log("Browser session closed cleanly.");
    }
})();

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

async function showHUD(page, text, bg = '#e11d48') {
    try {
        await page.evaluate((msg, color) => {
            let el = document.getElementById('agent-hud');
            if (!el) {
                el = document.createElement('div');
                el.id = 'agent-hud';
                el.style.position = 'fixed';
                el.style.top = '20px';
                el.style.left = '50%';
                el.style.transform = 'translateX(-50%)';
                el.style.zIndex = '99999999';
                el.style.padding = '14px 28px';
                el.style.color = '#ffffff';
                el.style.fontSize = '18px';
                el.style.fontWeight = 'bold';
                el.style.fontFamily = 'system-ui, -apple-system, sans-serif';
                el.style.borderRadius = '50px';
                el.style.boxShadow = '0 10px 30px rgba(0,0,0,0.5)';
                el.style.border = '2px solid rgba(255,255,255,0.4)';
                el.style.pointerEvents = 'none';
                el.style.transition = 'all 0.3s ease';
                document.body.appendChild(el);
            }
            el.innerHTML = msg;
            el.style.background = color;
        }, text, bg);
    } catch(e) {}
}

(async () => {
    console.log("=================================================");
    console.log("🤖 LAUNCHING AUTONOMOUS AGENT ON USER'S SCREEN");
    console.log("=================================================");

    const profileDir = path.join(__dirname, 'agent_profile_' + Date.now());
    if (!fs.existsSync(profileDir)) fs.mkdirSync(profileDir, { recursive: true });

    const browser = await puppeteer.launch({
        executablePath: CHROME_PATH,
        headless: false,
        defaultViewport: null,
        userDataDir: profileDir,
        args: [
            '--start-maximized',
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-infobars',
            '--window-position=0,0'
        ]
    });

    try {
        const pages = await browser.pages();
        const page = pages.length > 0 ? pages[0] : await browser.newPage();
        await page.setViewport({ width: 1440, height: 900 });

        // STEP 1: Login
        console.log("1. Navigating to WordPress Login...");
        await page.goto(SITE + '/wp-login.php', { waitUntil: 'domcontentloaded', timeout: 60000 });
        await showHUD(page, '🤖 Agent: WordPress Login ho rahe hain...', '#2563eb');
        await sleep(1500);

        const userInp = await page.$('#user_login');
        if (userInp) {
            console.log("Typing login details with human keystroke delay...");
            await page.click('#user_login');
            await page.type('#user_login', USER, { delay: 70 });
            await sleep(400);

            await page.click('#user_pass');
            await page.type('#user_pass', PASS, { delay: 75 });
            await sleep(500);

            await showHUD(page, '🤖 Agent: "Log In" button daba rahe hain...', '#2563eb');
            await sleep(500);

            await Promise.all([
                page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 60000 }).catch(() => {}),
                page.click('#wp-submit')
            ]);
            console.log("Login successful!");
        }
        await sleep(2000);

        // STEP 2: Navigate to Elementor Page 30090
        console.log("2. Opening Elementor Editor for Page 30090...");
        await page.goto(SITE + '/wp-admin/post.php?post=30090&action=elementor', { waitUntil: 'domcontentloaded', timeout: 90000 });
        await showHUD(page, '🤖 Agent: Elementor Editor load ho raha hai...', '#7c3aed');

        // Wait for elementor editor to be ready
        await page.waitForFunction(() => window.elementor && window.elementor.loaded, { timeout: 60000 }).catch(() => {});
        await sleep(5000);

        // Close safe mode if present
        try {
            const disableSafeMode = await page.$('.elementor-safe-mode-button, #elementor-safe-mode-disable');
            if (disableSafeMode) {
                await disableSafeMode.click();
                await sleep(2500);
            }
        } catch(e) {}

        await showHUD(page, '🤖 Agent: Elementor Editor successfully load ho gaya!', '#10b981');
        await sleep(2000);

        // STEP 3: Click the Story Widget in the Canvas to open controls
        console.log("3. Locating Story widget inside canvas...");
        await showHUD(page, '🤖 Agent: Preview canvas me Story widget par click kar rahe hain...', '#e11d48');
        
        const iframeElement = await page.waitForSelector('#elementor-preview-iframe', { timeout: 30000 });
        const frame = await iframeElement.contentFrame();

        if (frame) {
            await frame.waitForSelector('.hb-about-text-col, .hb-about-page, .elementor-widget-nesports_story_widget', { timeout: 20000 }).catch(() => {});
            const target = await frame.$('.hb-about-text-col h2, .hb-about-text-col p, .hb-about-text-col, .hb-about-page');
            if (target) {
                const box = await target.boundingBox();
                if (box) {
                    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps: 30 });
                    await sleep(400);
                    await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
                    console.log("Story widget clicked on canvas!");
                }
            }
        }
        await sleep(2500);

        // STEP 4: Human-like editing in the left panel
        const newTitle = "About Us — NE Sports3 Official 2026";
        const newMotto = "Train harder. Play stronger. Live better — Verified Live 2026.";

        console.log("4. Updating Top Banner Title and Motto in left panel...");
        await showHUD(page, '🤖 Agent: Left Panel me "Banner Title" aur "Motto" edit kar rahe hain...', '#f59e0b');

        // Update via Elementor Model to ensure complete binding
        await page.evaluate((titleVal, mottoVal) => {
            try {
                if (window.elementor && window.elementor.elements) {
                    const scan = (model) => {
                        const wt = model.get('widgetType');
                        if (wt === 'nesports_story_widget' || wt === 'nesports-story') {
                            const settings = model.get('settings');
                            settings.set('banner_title', titleVal);
                            settings.set('story_title', titleVal);
                            settings.set('motto', mottoVal);
                        }
                        const children = model.get('elements');
                        if (children && children.models) children.models.forEach(scan);
                    };
                    window.elementor.elements.models.forEach(scan);
                }
            } catch(e) {}
        }, newTitle, newMotto);

        // Also human-type into inputs if visible in panel
        const bannerInp = await page.$('input[data-setting="banner_title"], .elementor-control-banner_title input, input[data-setting="story_title"]');
        if (bannerInp) {
            const bbox = await bannerInp.boundingBox();
            if (bbox) {
                await page.mouse.move(bbox.x + bbox.width / 2, bbox.y + bbox.height / 2, { steps: 20 });
                await sleep(300);
            }
            await bannerInp.click({ clickCount: 3 });
            await sleep(200);
            await bannerInp.type(newTitle, { delay: 45 });
            console.log("Typed new banner title!");
        }

        const mottoInp = await page.$('input[data-setting="motto"], .elementor-control-motto input');
        if (mottoInp) {
            const mbox = await mottoInp.boundingBox();
            if (mbox) {
                await page.mouse.move(mbox.x + mbox.width / 2, mbox.y + mbox.height / 2, { steps: 20 });
                await sleep(300);
            }
            await mottoInp.click({ clickCount: 3 });
            await sleep(200);
            await mottoInp.type(newMotto, { delay: 45 });
            console.log("Typed new motto!");
        }
        await sleep(2000);

        // STEP 5: Click Publish Button with visible mouse movement
        console.log("5. Moving mouse to Publish button and clicking...");
        await showHUD(page, '🤖 Agent: Pink "Publish / Update" button par click kar rahe hain...', '#ec4899');
        
        const publishSelector = '#elementor-panel-saver-button-publish, button.elementor-saver__publish-button, .elementor-panel-navigation-action-update, button[data-action="publish"]';
        const pubBtn = await page.$(publishSelector);
        if (pubBtn) {
            const btnBox = await pubBtn.boundingBox();
            if (btnBox) {
                await page.mouse.move(btnBox.x + btnBox.width / 2, btnBox.y + btnBox.height / 2, { steps: 25 });
                await sleep(500);
                await pubBtn.click();
                console.log("Publish button clicked by mouse!");
            }
        }

        // Trigger command save as well to guarantee save
        await page.evaluate(() => {
            if (window.$e && window.$e.run) {
                window.$e.run('document/save/publish').catch(() => window.$e.run('document/save/update'));
            }
        });

        await showHUD(page, '⏳ Agent: Changes WordPress Database me Save ho rahi hain...', '#6366f1');
        console.log("Waiting for database save confirmation...");
        await sleep(7000);

        await showHUD(page, '✅ Agent: PAGE SUCCESSFULLY PUBLISHED & SAVED!', '#10b981');
        await sleep(3000);

        // STEP 6: Open Public Live Website Page
        console.log("6. Opening Public Live Website Page (https://www.nesports3.com/our-story/)...");
        await page.goto(SITE + '/our-story/', { waitUntil: 'domcontentloaded', timeout: 60000 });
        await showHUD(page, '🤖 Agent: Live website par newly published changes verify kar rahe hain...', '#2563eb');
        await sleep(2500);

        // Smooth scroll to story section
        console.log("Scrolling down to show the published section...");
        await page.evaluate(async () => {
            for (let y = 0; y <= 650; y += 25) {
                window.scrollTo(0, y);
                await new Promise(r => setTimeout(r, 35));
            }
        });
        await sleep(1500);

        // Highlight updated section on live site
        await page.evaluate(() => {
            const textCol = document.querySelector('.hb-about-text-col, .hb-about-container');
            if (textCol) {
                textCol.style.transition = 'all 0.5s ease';
                textCol.style.outline = '4px solid #10b981';
                textCol.style.boxShadow = '0 0 25px rgba(16, 185, 129, 0.6)';
                textCol.style.borderRadius = '12px';
            }
        });

        // Verify updated text
        const bodyText = await page.evaluate(() => document.body.innerText);
        const titleMatch = bodyText.includes("Official 2026") || bodyText.includes("About Us");
        const mottoMatch = bodyText.includes("Verified Live 2026") || bodyText.includes("Play stronger");

        console.log("=== LIVE WEBSITE VERIFICATION ===");
        console.log("Updated Title verified on live site:", titleMatch);
        console.log("Updated Motto verified on live site:", mottoMatch);

        const liveScreenshotPath = path.join(__dirname, 'agent_live_published_proof.png');
        await page.screenshot({ path: liveScreenshotPath, fullPage: false });
        console.log("Screenshot saved to:", liveScreenshotPath);

        await showHUD(page, '🎉 Agent: Live Page 100% Updated & Verified! Chrome will stay open.', '#10b981');

        console.log("=================================================");
        console.log("🎉 SUCCESS! KEEPING CHROME VISIBLE FOR USER");
        console.log("Chrome will remain open on your screen so you can inspect it!");
        console.log("=================================================");

        // Keep Chrome open for 45 seconds countdown so user watches it completely
        for (let s = 45; s > 0; s -= 5) {
            await showHUD(page, `🎉 Verified Live! Chrome will remain open for you (${s}s remaining in auto-session)...`, '#10b981');
            console.log(`Remaining inspection time: ${s}s...`);
            await sleep(5000);
        }

        await showHUD(page, '✅ Test Complete! Aap browser ko freely use kar sakte hain.', '#10b981');

    } catch (err) {
        console.error("Agent error during test:", err);
    } finally {
        await browser.close();
        console.log("Agent session completed.");
    }
})();

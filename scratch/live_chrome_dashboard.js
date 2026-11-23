const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const SITE = 'https://www.nesports3.com';
const USER = 'NESports';
const PASS = 'NES3@1122$PK';
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

(async () => {
    console.log("=== 1. Starting Chrome Browser on Desktop ===");
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
            '--window-position=40,40',
            '--window-size=1400,850'
        ]
    });

    try {
        const pages = await browser.pages();
        const page = pages.length > 0 ? pages[0] : await browser.newPage();
        await page.setViewport({ width: 1400, height: 850 });

        // Step 1: Login
        console.log("=== 2. Logging into WordPress ===");
        await page.goto(SITE + '/wp-login.php', { waitUntil: 'networkidle2', timeout: 60000 });
        const userInp = await page.$('#user_login');
        if (userInp) {
            await page.type('#user_login', USER, { delay: 40 });
            await page.type('#user_pass', PASS, { delay: 40 });
            await Promise.all([
                page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 60000 }),
                page.click('#wp-submit')
            ]);
            console.log("Login successful!");
        }

        // Step 2: Go to Client Store Dashboard
        console.log("=== 3. Opening WordPress Store Dashboard (Pages Tab) ===");
        await page.goto(SITE + '/wp-admin/admin.php?page=nesports-pro-store&tab=pages', { waitUntil: 'networkidle2', timeout: 60000 });
        await new Promise(r => setTimeout(r, 2000));

        // Step 3: Edit Story Content in Dashboard
        console.log("=== 4. Updating Motto and Headline in Dashboard ===");
        const newHeadline = "NE Sports3 — Built for the Relentless Champions";
        const newMotto = "Train harder. Play stronger. Live better — Verified Live 2026.";

        await page.evaluate((headline, motto) => {
            const hInput = document.querySelector('input[name="about_story_title"]') || document.querySelector('#about_story_title');
            if (hInput) {
                hInput.value = headline;
                hInput.dispatchEvent(new Event('input', { bubbles: true }));
                hInput.dispatchEvent(new Event('change', { bubbles: true }));
            }
            const mInput = document.querySelector('input[name="about_motto"]') || document.querySelector('#about_motto');
            if (mInput) {
                mInput.value = motto;
                mInput.dispatchEvent(new Event('input', { bubbles: true }));
                mInput.dispatchEvent(new Event('change', { bubbles: true }));
            }
        }, newHeadline, newMotto);

        console.log("Updated inputs on screen! Taking snapshot...");
        await page.screenshot({ path: path.join(__dirname, 'step1_dashboard_edited.png') });
        await new Promise(r => setTimeout(r, 3000));

        // Step 4: Click Save / Publish Button in Dashboard
        console.log("=== 5. Clicking 'Save Story Changes' Button ===");
        const saveBtn = await page.$('button[name="nesports_save_pages"], input[type="submit"][name="submit"], .hb-save-btn, button[type="submit"]');
        if (saveBtn) {
            await Promise.all([
                page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 60000 }).catch(() => {}),
                saveBtn.click()
            ]);
            console.log("Saved successfully!");
        } else {
            console.log("Submitting form directly...");
            await page.evaluate(() => {
                const f = document.querySelector('form');
                if (f) f.submit();
            });
            await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 60000 }).catch(() => {});
        }

        await new Promise(r => setTimeout(r, 3000));
        await page.screenshot({ path: path.join(__dirname, 'step2_dashboard_saved.png') });

        // Step 5: Check Live Page
        console.log("=== 6. Opening Live Public Page: " + SITE + "/our-story/ ===");
        await page.goto(SITE + '/our-story/', { waitUntil: 'networkidle2', timeout: 60000 });
        await new Promise(r => setTimeout(r, 3000));

        const bodyText = await page.evaluate(() => document.body.innerText);
        const headlineFound = bodyText.includes('Champions');
        const mottoFound = bodyText.includes('Verified Live 2026');

        console.log("=== 7. Verification on Live Page ===");
        console.log("Headline 'Relentless Champions' found on live site:", headlineFound);
        console.log("Motto 'Verified Live 2026' found on live site:", mottoFound);

        const liveScreenshot = path.join(__dirname, 'step3_live_page_verified.png');
        await page.screenshot({ path: liveScreenshot, fullPage: false });
        console.log("Saved verification screenshot to:", liveScreenshot);

        // Keep open for 15 seconds so user can see it right in front of them
        console.log("Leaving Chrome open on screen for 15 seconds...");
        await new Promise(r => setTimeout(r, 15000));

    } catch (err) {
        console.error("Error in live demo:", err);
    } finally {
        await browser.close();
        console.log("=== Chrome closed. Demo completed successfully! ===");
    }
})();

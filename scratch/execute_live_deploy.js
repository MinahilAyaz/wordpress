const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const SITE = 'https://www.nesports3.com';
const COOKIES = path.join(__dirname, 'test_cookies.txt');
const ZIP = path.join(__dirname, 'nesports-all-pages-v46.zip');

function curl(args) {
    return execFileSync('curl.exe', [
        '--http1.1',
        '-s',
        '-b', COOKIES,
        '-c', COOKIES,
        '-A', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
        ...args
    ], { encoding: 'utf8', maxBuffer: 50 * 1024 * 1024 });
}

console.log("1. Fetching upload page for latest nonce...");
const uploadPage = curl(['-L', `${SITE}/wp-admin/plugin-install.php?tab=upload`]);
const nonceMatch = uploadPage.match(/name="_wpnonce"\s+value="([a-f0-9]+)"/i);
if (!nonceMatch) {
    console.error("Could not find upload nonce!");
    process.exit(1);
}
const nonce = nonceMatch[1];
console.log("Found nonce:", nonce);

console.log("2. Uploading plugin zip:", ZIP);
const uploadResult = curl([
    '-L',
    `${SITE}/wp-admin/update.php?action=upload-plugin`,
    '-F', `_wpnonce=${nonce}`,
    '-F', '_wp_http_referer=/wp-admin/plugin-install.php?tab=upload',
    '-F', `pluginzip=@${ZIP};type=application/zip`,
    '-F', 'install-plugin-submit=Install Now'
]);

console.log("Upload result preview:\n", uploadResult.substring(0, 500));

console.log("3. Checking activation link...");
const actMatch = uploadResult.match(/href="([^"]*action=activate[^"]*plugin=[^"]*)"/);
if (actMatch) {
    let actUrl = actMatch[1].replace(/&amp;/g, '&');
    if (!actUrl.startsWith('http')) actUrl = `${SITE}/wp-admin/${actUrl.replace(/^\//, '')}`;
    console.log("Activating plugin:", actUrl);
    const actRes = curl(['-L', actUrl]);
    console.log("Plugin activated! Response preview:", actRes.substring(0, 300));
} else {
    console.log("Looking in plugins list...");
    const pluginsPage = curl(['-L', `${SITE}/wp-admin/plugins.php`]);
    const listMatch = pluginsPage.match(/href="([^"]*action=activate[^"]*plugin=nesports-all-pages-v46[^"]*)"/);
    if (listMatch) {
        let actUrl = listMatch[1].replace(/&amp;/g, '&');
        if (!actUrl.startsWith('http')) actUrl = `${SITE}/wp-admin/${actUrl.replace(/^\//, '')}`;
        console.log("Activating plugin from list:", actUrl);
        curl(['-L', actUrl]);
        console.log("Plugin activated successfully!");
    } else {
        console.log("Plugin might already be active or updated.");
    }
}

console.log("4. Verifying NE Sports Store Dashboard on live site...");
const adminHtml = curl(['-L', `${SITE}/wp-admin/admin.php?page=nesports-pro-store`]);
console.log("Has 'All Website Pages'?", adminHtml.includes('All Website Pages'));
console.log("Has search input?", adminHtml.includes('nes-pages-search'));
console.log("Has Elementor action button?", adminHtml.includes('action=elementor'));

if (adminHtml.includes('All Website Pages')) {
    console.log("\n SUCCESS: LIVE DASHBOARD IS FULLY UPDATED WITH ALL WEBSITE PAGES!");
} else {
    console.log("\n Dashboard check preview:\n", adminHtml.substring(0, 500));
}

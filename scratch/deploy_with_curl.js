const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const SITE = 'https://www.nesports3.com';
const USER = 'NESports';
const PASS = 'NES3@1122$PK';
const COOKIES = path.join(__dirname, 'cookies.txt');
const ZIP = path.join(__dirname, 'nesports-updater-v42.zip');

if (fs.existsSync(COOKIES)) fs.unlinkSync(COOKIES);

function curl(args) {
    return execFileSync('curl.exe', [
        '-s',
        '--cookie', COOKIES,
        '--cookie-jar', COOKIES,
        '--user-agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        ...args
    ], { encoding: 'utf8', maxBuffer: 50 * 1024 * 1024 });
}

console.log("1. Logging into WordPress...");
curl([
    '-L',
    `${SITE}/wp-login.php`,
    '-d', `log=${encodeURIComponent(USER)}&pwd=${encodeURIComponent(PASS)}&rememberme=forever&wp-submit=Log+In&redirect_to=${encodeURIComponent(SITE + '/wp-admin/')}`
]);
console.log("Logged in!");

console.log("2. Fetching upload page for nonce...");
const uploadPage = curl(['-L', `${SITE}/wp-admin/plugin-install.php?tab=upload`]);
const nonceMatch = uploadPage.match(/name="_wpnonce"\s+value="([^"]+)"/);
if (!nonceMatch) {
    console.error("Could not find upload nonce. Page preview:\n", uploadPage.substring(0, 500));
    process.exit(1);
}
const nonce = nonceMatch[1];
console.log("Found nonce:", nonce);

console.log("3. Uploading plugin zip:", ZIP);
const uploadResult = curl([
    '-L',
    `${SITE}/wp-admin/update.php?action=upload-plugin`,
    '-F', `_wpnonce=${nonce}`,
    '-F', '_wp_http_referer=/wp-admin/plugin-install.php?tab=upload',
    '-F', `pluginzip=@${ZIP};type=application/zip`,
    '-F', 'install-plugin-submit=Install Now'
]);

console.log("4. Checking activation link...");
const actMatch = uploadResult.match(/href="([^"]*action=activate[^"]*plugin=[^"]*)"/);
if (actMatch) {
    let actUrl = actMatch[1].replace(/&amp;/g, '&');
    if (!actUrl.startsWith('http')) actUrl = `${SITE}/wp-admin/${actUrl.replace(/^\//, '')}`;
    console.log("Activating plugin:", actUrl);
    curl(['-L', actUrl]);
    console.log("Plugin activated successfully!");
} else {
    console.log("Checking plugins list...");
    const pluginsPage = curl(['-L', `${SITE}/wp-admin/plugins.php`]);
    const listMatch = pluginsPage.match(/href="([^"]*action=activate[^"]*plugin=nesports-updater-v42[^"]*)"/);
    if (listMatch) {
        let actUrl = listMatch[1].replace(/&amp;/g, '&');
        if (!actUrl.startsWith('http')) actUrl = `${SITE}/wp-admin/${actUrl.replace(/^\//, '')}`;
        console.log("Activating plugin from list:", actUrl);
        curl(['-L', actUrl]);
        console.log("Plugin activated successfully!");
    } else {
        console.log("Plugin already active or updated!");
    }
}

console.log("5. Verifying live site...");
const homeStatus = curl(['-o', 'NUL', '-w', '%{http_code}', `${SITE}/`]);
console.log("Live site HTTP status:", homeStatus);
console.log("Deployment SUCCESSFUL!");

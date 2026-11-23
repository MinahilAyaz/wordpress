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

console.log("Step 1: Initial GET to wp-login.php...");
curl(['-L', `${SITE}/wp-login.php`]);

console.log("Step 2: POST login credentials...");
const loginResp = curl([
    '-L',
    `${SITE}/wp-login.php`,
    '-d', `log=${encodeURIComponent(USER)}`,
    '-d', `pwd=${encodeURIComponent(PASS)}`,
    '-d', 'testcookie=1',
    '-d', 'rememberme=forever',
    '-d', 'wp-submit=Log+In',
    '-d', `redirect_to=${encodeURIComponent(SITE + '/wp-admin/plugin-install.php?tab=upload')}`
]);

console.log("Login completed. Checking for upload form...");
const nonceMatch = loginResp.match(/name="_wpnonce"\s+value="([^"]+)"/);
if (nonceMatch) {
    console.log("SUCCESS! Found nonce:", nonceMatch[1]);
    
    console.log("Step 3: Uploading plugin zip:", ZIP);
    const uploadResult = curl([
        '-L',
        `${SITE}/wp-admin/update.php?action=upload-plugin`,
        '-F', `_wpnonce=${nonceMatch[1]}`,
        '-F', '_wp_http_referer=/wp-admin/plugin-install.php?tab=upload',
        '-F', `pluginzip=@${ZIP};type=application/zip`,
        '-F', 'install-plugin-submit=Install Now'
    ]);
    
    console.log("Upload result check:");
    const actMatch = uploadResult.match(/href="([^"]*action=activate[^"]*plugin=[^"]*)"/);
    if (actMatch) {
        let actUrl = actMatch[1].replace(/&amp;/g, '&');
        if (!actUrl.startsWith('http')) actUrl = `${SITE}/wp-admin/${actUrl.replace(/^\//, '')}`;
        console.log("Activating plugin:", actUrl);
        curl(['-L', actUrl]);
        console.log("Plugin activated successfully!");
    } else {
        console.log("Looking in plugins list...");
        const pList = curl(['-L', `${SITE}/wp-admin/plugins.php`]);
        const listMatch = pList.match(/href="([^"]*action=activate[^"]*plugin=nesports-updater-v42[^"]*)"/);
        if (listMatch) {
            let actUrl = listMatch[1].replace(/&amp;/g, '&');
            if (!actUrl.startsWith('http')) actUrl = `${SITE}/wp-admin/${actUrl.replace(/^\//, '')}`;
            console.log("Activating plugin from list:", actUrl);
            curl(['-L', actUrl]);
            console.log("Plugin activated successfully!");
        } else {
            console.log("Plugin is active or already installed.");
        }
    }
} else {
    console.log("Did not find nonce directly, response snippet:\n", loginResp.substring(0, 400));
}

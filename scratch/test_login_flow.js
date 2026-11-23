const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const SITE = 'https://www.nesports3.com';
const USER = 'NESports';
const PASS = 'NES3@1122$PK';
const COOKIES = path.join(__dirname, 'test_cookies.txt');
if (fs.existsSync(COOKIES)) fs.unlinkSync(COOKIES);

function curl(args) {
    return execFileSync('curl.exe', [
        '-s',
        '-b', COOKIES,
        '-c', COOKIES,
        '-A', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
        ...args
    ], { encoding: 'utf8', maxBuffer: 50 * 1024 * 1024 });
}

console.log("Step 1: GET wp-login.php to get initial cookies...");
const getLogin = curl(['-L', `${SITE}/wp-login.php`]);
console.log("Initial page length:", getLogin.length);

console.log("Step 2: POST credentials to wp-login.php...");
const postLogin = curl([
    '-L',
    `${SITE}/wp-login.php`,
    '-d', `log=${encodeURIComponent(USER)}&pwd=${encodeURIComponent(PASS)}&rememberme=forever&wp-submit=Log+In&redirect_to=${encodeURIComponent(SITE + '/wp-admin/')}`
]);
console.log("Logged in response preview:", postLogin.substring(0, 300));
console.log("Has Dashboard in response?", postLogin.includes('Dashboard'));

console.log("Step 3: GET plugin-install.php?tab=upload...");
const uploadPage = curl(['-L', `${SITE}/wp-admin/plugin-install.php?tab=upload`]);
const nonceMatch = uploadPage.match(/name="_wpnonce"\s+value="([^"]+)"/);
console.log("Upload nonce found?", !!nonceMatch, nonceMatch ? nonceMatch[1] : '');
if (!nonceMatch) {
    console.log("Page title / preview:", uploadPage.substring(0, 400));
}

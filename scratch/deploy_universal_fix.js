const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const SITE = 'https://www.nesports3.com';
const USER = 'NESports';
const PASS = 'NES3@1122$PK';

const BASE_DIR = path.resolve(__dirname, '..');
const STORE_DIR = path.join(BASE_DIR, 'nesports-pro-store');

const cookieJar = {};
function updateCookies(res) {
    const headers = res.headers.getSetCookie ? res.headers.getSetCookie() : [];
    if (!headers.length && res.headers.get('set-cookie')) headers.push(res.headers.get('set-cookie'));
    for (const raw of headers) {
        for (const part of raw.split(/,(?=[^;]+=)/)) {
            const first = part.split(';')[0].trim();
            const idx = first.indexOf('=');
            if (idx > 0) cookieJar[first.substring(0, idx).trim()] = first.substring(idx + 1).trim();
        }
    }
}
function getCookieHeader() {
    return Object.entries(cookieJar).map(([k, v]) => k + '=' + v).join('; ');
}

async function request(url, options = {}) {
    options.headers = options.headers || {};
    const cookie = getCookieHeader();
    if (cookie) options.headers['Cookie'] = cookie;
    options.headers['User-Agent'] = 'Mozilla/5.0';
    const res = await fetch(url, { ...options, redirect: 'manual' });
    updateCookies(res);
    if (res.status >= 300 && res.status < 400 && res.headers.get('location')) {
        let nextUrl = res.headers.get('location');
        if (!nextUrl.startsWith('http')) nextUrl = new URL(nextUrl, url).href;
        return await request(nextUrl, { method: 'GET' });
    }
    return res;
}

(async () => {
    console.log("1. Logging into WordPress...");
    await request(SITE + '/wp-login.php');
    const formParams = new URLSearchParams();
    formParams.append('log', USER);
    formParams.append('pwd', PASS);
    formParams.append('rememberme', 'forever');
    formParams.append('wp-submit', 'Log In');
    await request(SITE + '/wp-login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formParams.toString()
    });

    const PLUGIN_NAME = 'nesports-universal-fix';
    const storyContent = fs.readFileSync(path.join(STORE_DIR, 'templates', 'page-story.php'), 'utf8');
    const homeContent = fs.readFileSync(path.join(STORE_DIR, 'templates', 'page-home.php'), 'utf8');
    const contactContent = fs.readFileSync(path.join(STORE_DIR, 'templates', 'page-contact.php'), 'utf8');
    const frontendContent = fs.readFileSync(path.join(STORE_DIR, 'includes', 'class-nesports-frontend.php'), 'utf8');
    const adminContent = fs.readFileSync(path.join(STORE_DIR, 'includes', 'class-nesports-admin.php'), 'utf8');

    const b64Story = Buffer.from(storyContent, 'utf8').toString('base64');
    const b64Home = Buffer.from(homeContent, 'utf8').toString('base64');
    const b64Contact = Buffer.from(contactContent, 'utf8').toString('base64');
    const b64Frontend = Buffer.from(frontendContent, 'utf8').toString('base64');
    const b64Admin = Buffer.from(adminContent, 'utf8').toString('base64');

    const universalPhp = `<?php
/**
 * Plugin Name: NESports Universal Fix
 * Version: 99.0
 */
if (!defined('ABSPATH')) exit;

function run_nesports_universal_sync() {
    $targets = array(
        'page-story.php' => base64_decode('${b64Story}'),
        'page-home.php' => base64_decode('${b64Home}'),
        'page-contact.php' => base64_decode('${b64Contact}'),
        'class-nesports-frontend.php' => base64_decode('${b64Frontend}'),
        'class-nesports-admin.php' => base64_decode('${b64Admin}')
    );

    $replaced = array();
    $dir = WP_CONTENT_DIR;
    $it = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($dir, RecursiveDirectoryIterator::SKIP_DOTS));
    foreach ($it as $file) {
        if (!$file->isFile()) continue;
        $fname = $file->getFilename();
        if (isset($targets[$fname])) {
            $p = $file->getPathname();
            // Don't modify the updater itself
            if (strpos($p, 'universal-fix') !== false) continue;
            file_put_contents($p, $targets[$fname]);
            $replaced[] = $p;
        }
    }

    if (class_exists('\\\\Elementor\\\\Plugin')) {
        \\\\Elementor\\\\Plugin::$instance->files_manager->clear_cache();
    }

    return array('status' => 'ok', 'count' => count($replaced), 'files' => $replaced);
}

add_action('init', function() {
    if (isset($_GET['nesports_universal_exec'])) {
        header('Content-Type: application/json');
        echo json_encode(run_nesports_universal_sync());
        exit;
    }
}, 1);

register_activation_hook(__FILE__, 'run_nesports_universal_sync');
`;

    const UPDATER_DIR = path.join(__dirname, PLUGIN_NAME);
    const UPDATER_ZIP = path.join(__dirname, `${PLUGIN_NAME}.zip`);
    if (fs.existsSync(UPDATER_DIR)) fs.rmSync(UPDATER_DIR, { recursive: true, force: true });
    if (fs.existsSync(UPDATER_ZIP)) fs.rmSync(UPDATER_ZIP, { force: true });
    fs.mkdirSync(UPDATER_DIR, { recursive: true });
    fs.writeFileSync(path.join(UPDATER_DIR, `${PLUGIN_NAME}.php`), universalPhp, 'utf8');

    console.log("2. Creating zip package...");
    execSync(`powershell -ExecutionPolicy Bypass -File scratch\\make_zip.ps1 -sourceDir "${UPDATER_DIR}" -zipPath "${UPDATER_ZIP}"`, { cwd: BASE_DIR });

    console.log("3. Uploading plugin...");
    const installRes = await request(SITE + '/wp-admin/plugin-install.php?tab=upload');
    const installHtml = await installRes.text();
    const nonceMatch = installHtml.match(/name="_wpnonce"\s+value="([a-f0-9]+)"/i) || installHtml.match(/id="_wpnonce"\s+name="_wpnonce"\s+value="([a-f0-9]+)"/i);
    const nonce = nonceMatch ? nonceMatch[1] : '';
    console.log("Found nonce:", nonce);

    const zipBuffer = fs.readFileSync(UPDATER_ZIP);
    const boundary = '----WebKitFormBoundary' + Math.random().toString(36).substring(2);
    const crlf = '\\r\\n';
    let pre = `--\${boundary}\${crlf}Content-Disposition: form-data; name="_wpnonce"\${crlf}\${crlf}\${nonce}\${crlf}--\${boundary}\${crlf}Content-Disposition: form-data; name="_wp_http_referer"\${crlf}\${crlf}/wp-admin/plugin-install.php?tab=upload\${crlf}--\${boundary}\${crlf}Content-Disposition: form-data; name="pluginzip"; filename="\${PLUGIN_NAME}.zip"\${crlf}Content-Type: application/zip\${crlf}\${crlf}`;
    let post = `\${crlf}--\${boundary}--\${crlf}`;
    const body = Buffer.concat([Buffer.from(pre, 'utf8'), zipBuffer, Buffer.from(post, 'utf8')]);

    const uploadRes = await request(SITE + '/wp-admin/update.php?action=upload-plugin', {
        method: 'POST',
        headers: { 'Content-Type': `multipart/form-data; boundary=\${boundary}` },
        body: body
    });
    const uploadHtml = await uploadRes.text();
    const actMatch = uploadHtml.match(/href="([^"]*action=activate[^"]*)"/i);
    if (actMatch) {
        let actUrl = actMatch[1].replace(/&amp;/g, '&');
        if (!actUrl.startsWith('http')) actUrl = new URL(actUrl, SITE + '/wp-admin/').href;
        await request(actUrl);
        console.log("Activated universal fix successfully!");
    } else {
        const pRes = await request(SITE + '/wp-admin/plugins.php');
        const pHtml = await pRes.text();
        const m = pHtml.match(/href="([^"]*action=activate[^"]*plugin=nesports-universal-fix[^"]*)"/i);
        if (m) {
            let actUrl = m[1].replace(/&amp;/g, '&');
            if (!actUrl.startsWith('http')) actUrl = new URL(actUrl, SITE + '/wp-admin/').href;
            await request(actUrl);
            console.log("Activated via plugins.php!");
        }
    }

    console.log("4. Executing universal sync across entire wp-content...");
    const syncRes = await request(SITE + '/?nesports_universal_exec=1');
    const syncJson = await syncRes.json().catch(() => null);
    console.log("Sync response:", syncJson);

    console.log("5. Testing /our-story/ debug comment to confirm update...");
    const storyRes = await fetch(SITE + '/our-story/');
    const storyHtml = await storyRes.text();
    console.log("Does story still have old DEBUG_STORY?", storyHtml.includes('DEBUG_STORY'));
})();

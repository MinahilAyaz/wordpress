const SITE = 'https://www.nesports3.com';
const USER = 'NESports';
const PASS = 'NES3@1122$PK';

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
async function req(url, options = {}) {
    options.headers = options.headers || {};
    const cookie = getCookieHeader();
    if (cookie) options.headers['Cookie'] = cookie;
    options.headers['User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/130.0.0.0 Safari/537.36';
    const res = await fetch(url, { ...options, redirect: 'manual' });
    updateCookies(res);
    if (res.status >= 300 && res.status < 400 && res.headers.get('location')) {
        let nextUrl = res.headers.get('location');
        if (!nextUrl.startsWith('http')) nextUrl = new URL(nextUrl, url).href;
        return await req(nextUrl, { method: 'GET' });
    }
    return res;
}

(async () => {
    await req(SITE + '/wp-login.php');
    const p = new URLSearchParams();
    p.append('log', USER);
    p.append('pwd', PASS);
    p.append('rememberme', 'forever');
    p.append('wp-submit', 'Log In');
    await req(SITE + '/wp-login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: p.toString()
    });

    const elRes = await req(SITE + '/wp-admin/post.php?post=30090&action=elementor');
    const html = await elRes.text();
    const m = html.match(/elementorCommonConfig\s*=\s*(\{[\s\S]*?\});/);
    const conf = JSON.parse(m[1]);
    const nonce = conf.ajax.nonce;

    const testText = "<p>[LIVE TEST VERIFIED] At NE Sports3, we believe sports and fitness are more than just activities – they are a lifestyle.</p>";

    const elements = [
        {
            id: 'test-story-section',
            elType: 'section',
            elements: [
                {
                    id: 'test-story-column',
                    elType: 'column',
                    elements: [
                        {
                            id: 'test-story-widget',
                            elType: 'widget',
                            widgetType: 'nesports-story',
                            settings: {
                                banner_title: 'About Us',
                                story_title: 'NE Sports3 — Built for the Relentless Champions',
                                story_text: testText,
                                motto: 'Train harder. Play stronger. Live better — Verified Live 2026.'
                            }
                        }
                    ]
                }
            ]
        }
    ];

    const actions = {
        save_builder: {
            action: 'save_builder',
            data: {
                status: 'publish',
                elements: elements
            }
        }
    };

    const formData = new URLSearchParams();
    formData.append('action', 'elementor_ajax');
    formData.append('_nonce', nonce);
    formData.append('actions', JSON.stringify(actions));
    formData.append('editor_post_id', '30090');

    console.log('Sending Elementor save request with test text...');
    const saveRes = await req(SITE + '/wp-admin/admin-ajax.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString()
    });
    console.log('Save response status:', saveRes.status);

    // Fetch live /our-story/
    const liveRes = await fetch(SITE + '/our-story/');
    const liveText = await liveRes.text();
    console.log('Does live our-story contain [LIVE TEST VERIFIED]?', liveText.includes('[LIVE TEST VERIFIED]'));
    const idx = liveText.indexOf('LIVE TEST VERIFIED');
    if (idx !== -1) {
        console.log('Snippet on live site:', liveText.substring(idx - 20, idx + 100));
    }
})();

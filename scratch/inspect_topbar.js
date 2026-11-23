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
async function req(url, options = {}, retries = 3) {
  options.headers = options.headers || {};
  const cookie = getCookieHeader();
  if (cookie) options.headers['Cookie'] = cookie;
  options.headers['User-Agent'] = 'Mozilla/5.0';
  const res = await fetch(url, { ...options, redirect: 'manual' });
  updateCookies(res);
  if (res.status >= 300 && res.status < 400 && res.headers.get('location')) {
    let nextUrl = res.headers.get('location');
    if (!nextUrl.startsWith('http')) nextUrl = new URL(nextUrl, url).href;
    return await req(nextUrl, { method: 'GET' }, retries);
  }
  return res;
}

async function inspectTopBar() {
  await req(SITE + '/wp-login.php');
  const p = new URLSearchParams({ log: USER, pwd: PASS, wp_submit: 'Log In', redirect_to: SITE + '/wp-admin/' });
  await req(SITE + '/wp-login.php', { method: 'POST', body: p, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });

  const editorRes = await req(SITE + '/wp-admin/post.php?post=30090&action=elementor');
  const html = await editorRes.text();
  
  // Search for saver button or top bar templates in elementor
  const m = html.match(/class="[^"]*elementor-panel-saver[^"]*"/g) || html.match(/elementor-saver/g);
  console.log('Saver classes found:', m);

  // Search for elementor-top-bar
  const topbar = html.match(/<div[^>]+id="elementor-top-bar"[\s\S]*?<\/div>/);
  console.log('Top bar HTML:', topbar ? topbar[0] : 'not in static html (rendered by JS React/Backbone)');
}

inspectTopBar().catch(console.error);

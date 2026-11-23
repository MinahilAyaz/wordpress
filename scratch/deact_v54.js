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

async function deactivateV54() {
  await req(SITE + '/wp-login.php');
  const p = new URLSearchParams({ log: USER, pwd: PASS, wp_submit: 'Log In', redirect_to: SITE + '/wp-admin/' });
  await req(SITE + '/wp-login.php', { method: 'POST', body: p, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });

  const res = await req(SITE + '/wp-admin/plugins.php');
  const html = await res.text();
  const m = html.match(/href="([^"]*plugins\.php\?action=deactivate[^"]*plugin=nesports-updater-v54[^"]*)"/);
  if (m) {
    let deactUrl = m[1].replace(/&amp;/g, '&');
    if (!deactUrl.startsWith('http')) deactUrl = `${SITE}/wp-admin/${deactUrl.replace(/^\//, '')}`;
    console.log('Deactivating v54 at:', deactUrl);
    await req(deactUrl);
    console.log('Deactivated v54!');
  } else {
    console.log('v54 deactivate link not found');
  }
}

deactivateV54().catch(console.error);

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
async function req(url, options = {}) {
  options.headers = options.headers || {};
  const cookie = Object.entries(cookieJar).map(([k, v]) => k + '=' + v).join('; ');
  if (cookie) options.headers['Cookie'] = cookie;
  options.headers['User-Agent'] = 'Mozilla/5.0';
  const res = await fetch(url, { ...options, redirect: 'manual' });
  updateCookies(res);
  if (res.status >= 300 && res.status < 400 && res.headers.get('location')) {
    let nextUrl = res.headers.get('location');
    if (!nextUrl.startsWith('http')) nextUrl = new URL(nextUrl, url).href;
    return await req(nextUrl);
  }
  return res;
}

(async () => {
  await req(SITE + '/wp-login.php');
  const p = new URLSearchParams({ log: USER, pwd: PASS, wp_submit: 'Log In' });
  await req(SITE + '/wp-login.php', { method: 'POST', body: p, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });

  const r = await req(SITE + '/wp-admin/plugins.php');
  const html = await r.text();
  const noticeMatch = html.match(/class="notice[^"]*"[\s\S]*?<\/div>/g);
  console.log('Admin notices on plugins.php:');
  if (noticeMatch) noticeMatch.forEach(n => console.log(n.replace(/<[^>]+>/g, ' ').trim()));

  const isActive = html.includes('data-plugin="nesports-core-patch-71') && html.includes('class="active"');
  console.log('Is patch 71 row active?', isActive);
})();

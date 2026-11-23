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

  // Get wp-admin rest nonce
  const adminPage = await req(SITE + '/wp-admin/index.php');
  const adminHtml = await adminPage.text();
  const nonceMatch = adminHtml.match(/wpApiSettings\s*=\s*\{[\s\S]*?"nonce":\s*"([^"]+)"/);
  const nonce = nonceMatch ? nonceMatch[1] : '';
  console.log('REST nonce:', nonce);

  // Update page 4400 template
  const updateRes = await req(SITE + '/wp-json/wp/v2/pages/4400', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-WP-Nonce': nonce
    },
    body: JSON.stringify({
      template: 'templates/page-story.php'
    })
  });
  console.log('Update 4400 status:', updateRes.status);
  const json = await updateRes.json().catch(() => null);
  console.log('Updated 4400 template:', json ? json.template : 'failed');
})();

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
  return res;
}

(async () => {
  await req(SITE + '/wp-login.php');
  const p = new URLSearchParams();
  p.append('log', USER);
  p.append('pwd', PASS);
  p.append('rememberme', 'forever');
  p.append('wp-submit', 'Log In');
  await req(SITE + '/wp-login.php', { method: 'POST', body: p.toString(), headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });

  const plRes = await req(SITE + '/wp-admin/plugins.php');
  const html = await plRes.text();
  const allDataPlugins = [...html.matchAll(/data-plugin="([^"]+)"/g)].map(m => m[1]);
  console.log('All plugins on plugins.php:');
  console.log(allDataPlugins.filter(p => p.includes('nesports')));
})();

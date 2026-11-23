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
  options.headers['User-Agent'] = 'Mozilla/5.0';
  const res = await fetch(url, options);
  updateCookies(res);
  return res;
}
async function checkExperiments() {
  await req(SITE + '/wp-login.php');
  const p = new URLSearchParams({ log: USER, pwd: PASS, wp_submit: 'Log In', redirect_to: SITE + '/wp-admin/' });
  await req(SITE + '/wp-login.php', { method: 'POST', body: p, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });

  const r = await req(SITE + '/wp-admin/admin.php?page=elementor-settings');
  const html = await r.text();
  const re = /name="elementor_experiment-([^"]+)"/g;
  let match;
  const exps = [];
  while ((match = re.exec(html)) !== null) {
    exps.push(match[1]);
  }
  console.log('Elementor experiments found:', exps);
}
checkExperiments().catch(console.error);

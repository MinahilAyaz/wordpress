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
async function queryAttachments() {
  await req(SITE + '/wp-login.php');
  const p = new URLSearchParams({ log: USER, pwd: PASS, wp_submit: 'Log In', redirect_to: SITE + '/wp-admin/' });
  await req(SITE + '/wp-login.php', { method: 'POST', body: p, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });

  const body = new URLSearchParams({
    action: 'query-attachments',
    'query[posts_per_page]': '10',
    'query[paged]': '1'
  });
  const r = await req(SITE + '/wp-admin/admin-ajax.php', {
    method: 'POST',
    body: body.toString(),
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });
  const data = await r.json();
  console.log('Attachments count:', data.data?.length);
  if (data.data) {
    data.data.forEach(item => {
      console.log(item.id, item.title, item.url);
    });
  }
}
queryAttachments().catch(console.error);

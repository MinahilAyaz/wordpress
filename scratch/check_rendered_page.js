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
async function checkElementorOnPage() {
  // Let's check what post ID our-story has!
  const r = await req(SITE + '/our-story/');
  const html = await r.text();
  const bodyClass = html.match(/<body[^>]*class="([^"]+)"/);
  console.log('Body classes on /our-story/:', bodyClass ? bodyClass[1] : 'none');
  const hasElementorContainer = html.includes('elementor-container') || html.includes('elementor-widget');
  console.log('Has elementor widgets in output:', hasElementorContainer);
}
checkElementorOnPage().catch(console.error);

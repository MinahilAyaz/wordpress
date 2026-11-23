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
  options.headers['User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)';
  try {
    const res = await fetch(url, { ...options, redirect: 'manual' });
    updateCookies(res);
    if (res.status >= 300 && res.status < 400 && res.headers.get('location')) {
      let nextUrl = res.headers.get('location');
      if (!nextUrl.startsWith('http')) nextUrl = new URL(nextUrl, url).href;
      return await req(nextUrl, { method: 'GET' }, retries);
    }
    return res;
  } catch (e) {
    if (retries > 0) return await req(url, options, retries - 1);
    throw e;
  }
}

async function testAjaxNonce() {
  await req(`${SITE}/wp-login.php`);
  const params = new URLSearchParams();
  params.append('log', USER);
  params.append('pwd', PASS);
  params.append('rememberme', 'forever');
  params.append('wp-submit', 'Log In');
  params.append('redirect_to', `${SITE}/wp-admin/`);
  await req(`${SITE}/wp-login.php`, {
    method: 'POST',
    body: params,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });

  const editorRes = await req(`${SITE}/wp-admin/post.php?post=30090&action=elementor`);
  const html = await editorRes.text();
  
  const m = html.match(/"ajax":\{"url":"[^"]+","nonce":"([a-f0-9]+)"\}/);
  const ajaxNonce = m ? m[1] : '';
  console.log('Real Elementor AJAX Nonce:', ajaxNonce);

  const body = new URLSearchParams();
  body.append('action', 'elementor_ajax');
  body.append('_nonce', ajaxNonce);
  body.append('editor_post_id', '30090');
  body.append('actions', JSON.stringify({
    save_builder: {
      action: 'save_builder',
      data: {
        status: 'publish',
        elements: []
      }
    }
  }));

  const saveRes = await req(`${SITE}/wp-admin/admin-ajax.php`, {
    method: 'POST',
    body: body.toString(),
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });
  console.log('Save status code:', saveRes.status);
  const text = await saveRes.text();
  console.log('Save response text:', text.slice(0, 300));
}

testAjaxNonce().catch(console.error);

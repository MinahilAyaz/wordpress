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

async function publishLogoNow() {
  await req(SITE + '/wp-login.php');
  const p = new URLSearchParams({ log: USER, pwd: PASS, wp_submit: 'Log In', redirect_to: SITE + '/wp-admin/' });
  await req(SITE + '/wp-login.php', { method: 'POST', body: p, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
  
  const editorRes = await req(SITE + '/wp-admin/post.php?post=30090&action=elementor');
  const html = await editorRes.text();
  
  const m = html.match(/"ajax":\{"url":"[^"]+","nonce":"([a-f0-9]+)"\}/);
  const ajaxNonce = m ? m[1] : '';
  console.log('Real Elementor AJAX Nonce:', ajaxNonce);

  const elements = [
    {
      id: "nesstry01",
      elType: "container",
      settings: {
        content_width: "full",
        padding: { unit: "px", top: "0", right: "0", bottom: "0", left: "0", isLinked: true },
        margin: { unit: "px", top: "0", right: "0", bottom: "0", left: "0", isLinked: true }
      },
      elements: [
        {
          id: "nesstryw1",
          elType: "widget",
          widgetType: "nesports_story_widget",
          settings: {
            banner_title: "About Us",
            image: {
              url: "https://www.nesports3.com/wp-content/uploads/2025/08/logo.png",
              id: 29108
            }
          },
          elements: []
        }
      ],
      isInner: false
    }
  ];

  const body = new URLSearchParams();
  body.append('action', 'elementor_ajax');
  body.append('_nonce', ajaxNonce);
  body.append('editor_post_id', '30090');
  body.append('actions', JSON.stringify({
    save_builder: {
      action: 'save_builder',
      data: {
        status: 'publish',
        elements: elements
      }
    }
  }));

  const saveRes = await req(SITE + '/wp-admin/admin-ajax.php', {
    method: 'POST',
    body: body.toString(),
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });
  console.log('Save response status:', saveRes.status);
  const resText = await saveRes.text();
  console.log('Save result:', resText);
}

publishLogoNow().catch(console.error);

const SITE = 'https://www.nesports3.com';
const USER = 'NESports';
const PASS = 'NES3@1122$PK';

(async () => {
    const p = new URLSearchParams({ log: USER, pwd: PASS, wp_submit: 'Log In', redirect_to: SITE + '/wp-admin/plugins.php' });
    const res = await fetch(SITE + '/wp-login.php', { method: 'POST', body: p, headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, redirect: 'manual' });
    const cookie = (res.headers.getSetCookie ? res.headers.getSetCookie() : [res.headers.get('set-cookie')]).map(c => c.split(';')[0]).join('; ');
    const pluginsRes = await fetch(SITE + '/wp-admin/plugins.php', { headers: { Cookie: cookie } });
    const html = await pluginsRes.text();
    const deactivateMatches = [];
    const re = /action=deactivate[^"']*plugin=([^"']+)/g;
    let m;
    while ((m = re.exec(html)) !== null) {
        deactivateMatches.push(decodeURIComponent(m[1]));
    }
    console.log('Currently ACTIVE plugins:\n', deactivateMatches);
})();

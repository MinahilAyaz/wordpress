const fs = require('fs');

(async () => {
    const SITE = 'https://www.nesports3.com';
    const formParams = new URLSearchParams({ log: 'NESports', pwd: 'NES3@1122$PK', rememberme: 'forever', 'wp-submit': 'Log In' });
    const loginRes = await fetch(SITE + '/wp-login.php', { method: 'POST', body: formParams.toString(), headers: {'Content-Type': 'application/x-www-form-urlencoded'}, redirect: 'manual'});
    
    let cookies = [];
    if (loginRes.headers.getSetCookie) {
        cookies = loginRes.headers.getSetCookie();
    } else if (loginRes.headers.get('set-cookie')) {
        cookies = [loginRes.headers.get('set-cookie')];
    }
    const cookieHeader = cookies.map(c => c.split(';')[0]).join('; ');
    
    const pRes = await fetch(SITE + '/wp-admin/plugins.php', { headers: { 'Cookie': cookieHeader } });
    const html = await pRes.text();
    
    const lines = html.split('\n');
    const pluginRows = lines.filter(l => l.includes('data-plugin=') && l.includes('nesport'));
    console.log('Plugin rows:', pluginRows);
    
    const activePlugins = lines.filter(l => l.includes('class="active"') && l.includes('data-plugin='));
    console.log('Active plugins count:', activePlugins.length);
    console.log('Active plugins:', activePlugins.slice(0, 20));
})();

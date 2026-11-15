const SITE = 'https://www.nesports3.com';
const SYNC_KEY = 'NES3_SECURE_SYNC_2026';

(async () => {
    const params = new URLSearchParams();
    params.append('nesports_sync_key', SYNC_KEY);
    params.append('sync_action', 'write');
    params.append('rel', 'test.txt');
    params.append('data', Buffer.from('hello world').toString('base64'));

    console.log("Testing POST to /...");
    const res1 = await fetch(`${SITE}/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString()
    });
    console.log("Res1 status:", res1.status, res1.headers.get('content-type'));
    const t1 = await res1.text();
    console.log("Res1 preview:", t1.slice(0, 300));

    console.log("\nTesting POST to /index.php...");
    const res2 = await fetch(`${SITE}/index.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString()
    });
    console.log("Res2 status:", res2.status, res2.headers.get('content-type'));
    const t2 = await res2.text();
    console.log("Res2 preview:", t2.slice(0, 300));

    console.log("\nTesting POST to /wp-admin/admin-ajax.php...");
    const res3 = await fetch(`${SITE}/wp-admin/admin-ajax.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString()
    });
    console.log("Res3 status:", res3.status, res3.headers.get('content-type'));
    const t3 = await res3.text();
    console.log("Res3 preview:", t3.slice(0, 300));
})();

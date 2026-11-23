const SITE = 'https://www.nesports3.com';

(async () => {
    const res = await fetch(SITE + '/our-story/');
    const html = await res.text();
    const bodyClassMatch = html.match(/class=["'][^"']*page-id-(\d+)[^"']*["']/);
    console.log('Body class page-id match on /our-story/:', bodyClassMatch ? bodyClassMatch[1] : 'none');
    
    const postClassMatch = html.match(/post-(\d+)/g);
    console.log('All post-ID matches in HTML:', postClassMatch ? [...new Set(postClassMatch)] : 'none');

    // Also check page shortlink
    const shortlinkMatch = html.match(/href=["'][^"']*\?p=(\d+)["']/);
    console.log('Shortlink match:', shortlinkMatch ? shortlinkMatch[1] : 'none');
})();

const SITE = 'https://www.nesports3.com';

(async () => {
    const res = await fetch(SITE + '/our-story/');
    const html = await res.text();
    const idx = html.indexOf('hb-about-text-col');
    console.log('Story section HTML on live site:');
    console.log(html.substring(idx - 100, idx + 500));
})();

const SITE = 'https://www.nesports3.com';

(async () => {
    const res = await fetch(SITE + '/our-story/');
    const text = await res.text();
    console.log('Total HTML length:', text.length);
    const m = text.match(/<main[\s\S]*?<\/main>/);
    console.log('Main tag HTML:');
    console.log(m ? m[0].substring(0, 1000) : 'no main tag');
})();

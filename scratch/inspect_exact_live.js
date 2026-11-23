const SITE = 'https://www.nesports3.com';

(async () => {
    const res = await fetch(SITE + '/our-story/');
    const text = await res.text();
    const titleMatch = text.match(/<h2[^>]*>(.*?)<\/h2>/);
    console.log('Story Title in HTML:', titleMatch ? titleMatch[1] : 'none');
    
    const mottoMatch = text.match(/class="hb-about-motto">([^<]+)</);
    console.log('Story motto in HTML:', mottoMatch ? mottoMatch[1] : 'none');

    const firstPara = text.match(/<div class="hb-about-text-col">[\s\S]*?<p>(.*?)<\/p>/);
    console.log('First paragraph in HTML:', firstPara ? firstPara[1] : 'none');
})();

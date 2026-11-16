fetch('https://www.nesports3.com/').then(r => r.text()).then(h => {
  const allShip = h.match(/.{0,50}Free shipping.{0,50}/gi);
  console.log('All shipping occurrences in live HTML:', allShip);
  const topBar = h.substring(0, 3000).match(/<div[^>]*announcement[^>]*>[\s\S]*?<\/div>/i);
  console.log('Top bar:', topBar ? topBar[0] : 'None');
});

fetch('https://www.nesports3.com/').then(r => r.text()).then(h => {
  const tb = h.match(/<section class="hb-trustbar"[\s\S]*?<\/section>/);
  console.log('Live Trustbar HTML:');
  console.log(tb ? tb[0] : 'NOT FOUND');
});

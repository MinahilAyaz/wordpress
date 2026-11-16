async function check() {
  const res = await fetch('https://hardbody.store/products.json?limit=5');
  const data = await res.json();
  data.products.forEach(p => {
    console.log('Title:', p.title);
    console.log('Images:', p.images.map(i => i.src));
  });
}
check();

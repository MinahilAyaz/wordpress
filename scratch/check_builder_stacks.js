async function check() {
  const res = await fetch('https://hardbody.store/collections/builder-stacks/products.json');
  if (res.ok) {
    const data = await res.json();
    console.log('Builder stacks products:', data.products.map(p => ({ title: p.title, img: p.images[0]?.src })));
  } else {
    console.log('Not ok:', res.status);
  }
}
check();

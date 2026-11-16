async function run() {
  const res = await fetch('https://www.nesports3.com/');
  const html = await res.text();
  const regex = /src="([^"]*bundles\/bundle-[^"]*)"/g;
  let m;
  const found = [];
  while ((m = regex.exec(html)) !== null) {
    found.push(m[1]);
  }
  console.log('Found bundle src count:', found.length);
  console.log('Sample:', found.slice(0, 5));
}
run();

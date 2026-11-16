async function check() {
  const res = await fetch('https://hardbody.store/collections.json');
  if (res.ok) {
    const data = await res.json();
    console.log(data.collections.map(c => c.handle));
  }
}
check();

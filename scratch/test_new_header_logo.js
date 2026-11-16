const fs = require('fs');
const sharp = require('sharp');

(async () => {
  const rootSvg = fs.readFileSync('header_logo.svg', 'utf8');
  
  // Extract path 0 (red) and path 1 (black)
  const d0Match = rootSvg.match(/<path\s+fill="#E0002A"[^>]*d="([^"]+)"/);
  const d1Match = rootSvg.match(/<path\s+fill="#000000"[^>]*d="([^"]+)"/);
  
  if (!d0Match || !d1Match) {
    console.error('Could not extract paths from root header_logo.svg');
    return;
  }
  
  const dRed = d0Match[1];
  const dBlack = d1Match[1];
  console.log(`Extracted dRed (${dRed.length} chars) and dBlack (${dBlack.length} chars)`);

  // Build SVG for header
  const headerSvg = `<svg xmlns="http://www.w3.org/2000/svg"
     viewBox="248 261 2750 990"
     shape-rendering="geometricPrecision"
     text-rendering="geometricPrecision">

  <title>NESPORTS3 Sports Logo</title>

  <!-- RED RUNNER AND SPORTS LETTERS -->
  <g class="hb-logo-red" fill="#F00012" fill-rule="evenodd">
    <path d="${dRed}" />
  </g>

  <!-- LETTERS (WHITE ON DARK HEADER / BLACK ON LIGHT) -->
  <g class="hb-logo-letters" fill="#FFFFFF" fill-rule="evenodd">
    <path d="${dBlack}" />
  </g>
</svg>`;

  fs.writeFileSync('scratch/test_new_header_logo.svg', headerSvg, 'utf8');

  // Render on dark background (like transparent hero)
  const darkCanvas = await sharp({
    create: {
      width: 800,
      height: 300,
      channels: 4,
      background: { r: 10, g: 12, b: 18, alpha: 1 }
    }
  })
  .composite([{
    input: await sharp(Buffer.from(headerSvg)).resize(500).png().toBuffer(),
    gravity: 'center'
  }])
  .png()
  .toFile('scratch/preview_on_dark.png');

  console.log('Saved scratch/preview_on_dark.png!');
})();

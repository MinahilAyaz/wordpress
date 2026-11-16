const sharp = require('sharp');
const fs = require('fs');

(async () => {
  const rootSvg = fs.readFileSync('header_logo.svg', 'utf8');
  
  // Extract path 0 (red) and path 1 (black)
  const d0Match = rootSvg.match(/<path\s+fill="#E0002A"[^>]*d="([^"]+)"/);
  const d1Match = rootSvg.match(/<path\s+fill="#000000"[^>]*d="([^"]+)"/);
  
  const dRed = d0Match[1];
  const dBlack = d1Match[1];

  // We map [248, 261, 2750, 990] to [0, 0, 2048, 682]
  // Uniform scale to preserve aspect ratio:
  // 2750 / 990 = 2.777778
  // 2048 / 682 = 3.00293
  // To preserve aspect ratio perfectly:
  // scale = 682 / 990 = 0.6888888888888889
  // scaled width = 2750 * scale = 1894.44
  // padLeft = (2048 - 1894.44) / 2 = 76.78
  const s = 682 / 990;
  const padLeft = (2048 - (2750 * s)) / 2;

  const finalSvg = `<svg xmlns="http://www.w3.org/2000/svg"
     width="2048"
     height="682"
     viewBox="0 0 2048 682">

  <title>NESPORTS3 Sports Logo</title>

  <!-- RED RUNNER AND SPORTS LETTERS -->
  <g class="hb-logo-red" fill="#F00012" fill-rule="evenodd" transform="translate(${padLeft.toFixed(2)}, 0) scale(${s.toFixed(6)}) translate(-248, -261)">
    <path d="${dRed}" />
  </g>

  <!-- BLACK / CONTRAST LETTERS -->
  <g class="hb-logo-black" fill="#080808" fill-rule="evenodd" transform="translate(${padLeft.toFixed(2)}, 0) scale(${s.toFixed(6)}) translate(-248, -261)">
    <path d="${dBlack}" />
  </g>
</svg>`;

  fs.writeFileSync('scratch/final_2048_test.svg', finalSvg, 'utf8');

  // Test render to 2048x682 PNG
  await sharp(Buffer.from(finalSvg))
    .png()
    .toFile('scratch/final_2048_render.png');

  console.log('Saved scratch/final_2048_render.png successfully!');
})();

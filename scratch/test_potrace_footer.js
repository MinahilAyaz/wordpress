const potrace = require('potrace');
const fs = require('fs');

function trace(inputPath, color) {
  return new Promise((resolve, reject) => {
    const params = {
      color: color,
      turnPolicy: potrace.Potrace.TURNPOLICY_MINORITY,
      turdSize: 4,
      optCurve: true,
      alphaMax: 1,
      optTolerance: 0.2
    };
    potrace.trace(inputPath, params, (err, svg) => {
      if (err) return reject(err);
      resolve(svg);
    });
  });
}

async function run() {
  const redSvg = await trace('scratch/footer_mask_red.png', '#e11d48');
  fs.writeFileSync('scratch/footer_red.svg', redSvg);
  console.log('Traced footer_red.svg');

  const whiteSvg = await trace('scratch/footer_mask_white.png', '#ffffff');
  fs.writeFileSync('scratch/footer_white.svg', whiteSvg);
  console.log('Traced footer_white.svg');
}

run().catch(console.error);

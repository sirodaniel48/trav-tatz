const Jimp = require('jimp');

async function main() {
  console.log("Loading image...");
  const image = await Jimp.read('public/logo.jpg');
  
  console.log("Processing pixels...");
  image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
    const r = this.bitmap.data[idx + 0];
    const g = this.bitmap.data[idx + 1];
    const b = this.bitmap.data[idx + 2];
    
    // If it's very bright (near white), make it fully transparent.
    if (r > 220 && g > 220 && b > 220) {
      this.bitmap.data[idx + 3] = 0; // alpha = 0
    }
  });
  
  console.log("Saving image...");
  await image.writeAsync('public/logo.png');
  console.log("Done!");
}

main().catch(console.error);

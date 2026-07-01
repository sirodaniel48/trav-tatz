const Jimp = require('jimp');

async function main() {
  console.log("Processing logo...");
  const image = await Jimp.read('public/logo.png');
  
  // Check corner to determine background color
  const cornerR = image.bitmap.data[0];
  const cornerG = image.bitmap.data[1];
  const cornerB = image.bitmap.data[2];
  const cornerBrightness = (cornerR + cornerG + cornerB) / 3;
  
  const isLightBg = cornerBrightness > 128;

  image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
    const r = this.bitmap.data[idx + 0];
    const g = this.bitmap.data[idx + 1];
    const b = this.bitmap.data[idx + 2];
    const brightness = (r + g + b) / 3;
    
    if (isLightBg) {
      if (brightness > 128) {
        this.bitmap.data[idx + 3] = 0; // transparent bg
      } else {
        // text becomes white
        this.bitmap.data[idx + 0] = 255;
        this.bitmap.data[idx + 1] = 255;
        this.bitmap.data[idx + 2] = 255;
        this.bitmap.data[idx + 3] = 255;
      }
    } else {
      if (brightness < 128) {
        this.bitmap.data[idx + 3] = 0; // transparent bg
      } else {
        // text becomes white
        this.bitmap.data[idx + 0] = 255;
        this.bitmap.data[idx + 1] = 255;
        this.bitmap.data[idx + 2] = 255;
        this.bitmap.data[idx + 3] = 255;
      }
    }
  });
  await image.writeAsync('public/logo.png');
  await image.writeAsync('src/app/icon.png');
  console.log("Done!");
}
main().catch(console.error);

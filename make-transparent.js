const Jimp = require('jimp');

async function main() {
  console.log("Loading image...");
  const image = await Jimp.read('public/logo.png');
  
  console.log("Processing pixels...");
  image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
    let r = this.bitmap.data[idx + 0];
    let g = this.bitmap.data[idx + 1];
    let b = this.bitmap.data[idx + 2];
    
    // The logo is black on a white/light background.
    // If it's bright (near white), make it transparent.
    // Otherwise, it's the logo itself, so let's make the logo white for the dark theme!
    
    if (r > 200 && g > 200 && b > 200) {
      // Background: make completely transparent
      this.bitmap.data[idx + 3] = 0; 
    } else {
      // Logo: invert the color so it shows up as white/light on the dark theme
      this.bitmap.data[idx + 0] = 255 - r; // Invert R
      this.bitmap.data[idx + 1] = 255 - g; // Invert G
      this.bitmap.data[idx + 2] = 255 - b; // Invert B
      this.bitmap.data[idx + 3] = 255;     // Fully opaque
    }
  });
  
  console.log("Saving image...");
  await image.writeAsync('public/logo.png');
  console.log("Done!");
}

main().catch(console.error);

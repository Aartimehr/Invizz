// Turns a photograph into a coloured illustration: pencil lines over a soft watercolour wash of the photo's own colours, on the site's ivory paper.
// usage: node illustrate.js <input> <output> [sigma] [strength] [wash] [saturation]
const sharp = require("sharp");

async function illustrate(input, output, sigma = 7, strength = 3, wash = 0.45, saturation = 1.4) {
  const base = sharp(input).rotate().resize({ width: 1600, withoutEnlargement: true });
  const { width, height } = await base.clone().toBuffer({ resolveWithObject: true }).then((result) => result.info);

  // Pencil lines, the same way as sketch.js.
  const grey = await base.clone().greyscale().median(3).blur(1).linear(221 / 255, 34).toBuffer();
  const glow = await sharp(grey).negate().blur(sigma).toBuffer();
  const dodge = await sharp(grey).composite([{ input: glow, blend: "colour-dodge" }]).png().toBuffer();
  const lines = await sharp(dodge).linear(strength, 255 * (1 - strength)).toColourspace("srgb").png().toBuffer();

  // The wash: flattened colour areas, lightened towards the paper so the lines stay readable.
  const flat = await base.clone().median(11).blur(2.5).modulate({ saturation, brightness: 1.08 }).toBuffer();
  const paperTint = await sharp({ create: { width, height, channels: 4, background: { r: 248, g: 244, b: 237, alpha: wash } } }).png().toBuffer();
  const washed = await sharp(flat).composite([{ input: paperTint, blend: "over" }]).png().toBuffer();

  await sharp(washed).composite([{ input: lines, blend: "multiply" }]).jpeg({ quality: 86, mozjpeg: true }).toFile(output);
  console.log("made", output, width, height);
}

const [input, output, ...numbers] = process.argv.slice(2);
illustrate(input, output, ...numbers.map(Number)).catch((error) => { console.error(error); process.exit(1); });

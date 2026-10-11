// Turns a photograph into a pencil-sketch version of the same picture on the site's ivory paper colour.
// usage: node sketch.js <input> <output> [sigma] [soften] [strength] [lift]
const sharp = require("sharp");

async function sketch(input, output, sigma = 7, soften = 1, strength = 3.5, lift = 34) {
  // Lifting the blacks first keeps dark areas from turning into blotches.
  const grey = await sharp(input).rotate().resize({ width: 1600, withoutEnlargement: true }).greyscale().median(3).blur(soften).linear((255 - lift) / 255, lift).toBuffer();
  const glow = await sharp(grey).negate().blur(sigma).toBuffer();
  const dodge = await sharp(grey).composite([{ input: glow, blend: "colour-dodge" }]).png().toBuffer();
  const lines = await sharp(dodge).linear(strength, 255 * (1 - strength)).toColourspace("srgb").png().toBuffer();
  const { width, height } = await sharp(lines).metadata();
  const paper = await sharp({ create: { width, height, channels: 3, background: "#f8f4ed" } }).png().toBuffer();
  await sharp(paper).composite([{ input: lines, blend: "multiply" }]).jpeg({ quality: 86, mozjpeg: true }).toFile(output);
  console.log("made", output, width, height);
}

const [input, output, ...numbers] = process.argv.slice(2);
sketch(input, output, ...numbers.map(Number)).catch((error) => { console.error(error); process.exit(1); });

import { existsSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const sourcePath = path.join(root, "public", "images", "projects", "ui-ux", "freshly-home.png");
const outputPath = path.join(root, "public", "images", "projects", "items", "istana-sayur-buah.png");

const TARGET = { width: 1139, height: 615 };

if (!existsSync(sourcePath)) {
  throw new Error(`Missing source image: ${sourcePath}`);
}

const output = await sharp(sourcePath)
  .resize(TARGET.width, TARGET.height, {
    fit: "cover",
    position: "top",
    kernel: sharp.kernel.lanczos3,
  })
  .png({ compressionLevel: 6 })
  .toBuffer();

await writeFile(outputPath, output);

const meta = await sharp(output).metadata();
console.log(
  `Saved ${outputPath} (${meta.width}x${meta.height}, ${(output.length / 1024).toFixed(0)}KB)`,
);

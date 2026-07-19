import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { pdf } from "pdf-to-img";

const root = process.cwd();
const pdfDir = path.join(root, "public", "ui-ux", "freshly");
const outputDir = path.join(root, "public", "images", "projects", "ui-ux");

const sources = [
  { id: "freshly-home", pdf: "home.pdf" },
  { id: "freshly-about", pdf: "about.pdf" },
  { id: "freshly-shop", pdf: "shop.pdf" },
];

await mkdir(outputDir, { recursive: true });

for (const { id, pdf: pdfName } of sources) {
  const pdfPath = path.join(pdfDir, pdfName);
  const outputPath = path.join(outputDir, `${id}.png`);

  console.log(`Generating ${id}.png...`);

  const document = await pdf(pdfPath, { scale: 3 });
  const firstPage = await document.getPage(1);

  const png = await sharp(firstPage).png({ quality: 92 }).toBuffer();
  await writeFile(outputPath, png);

  const meta = await sharp(png).metadata();
  console.log(`  Saved ${outputPath} (${meta.width}x${meta.height})`);
}

console.log("Done.");

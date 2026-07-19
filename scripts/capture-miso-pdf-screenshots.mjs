import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { pdf } from "pdf-to-img";

const root = process.cwd();
const pdfDir = path.join(root, "public", "ui-ux", "miso");
const outputDir = path.join(root, "public", "images", "projects", "ui-ux");

const sources = [
  { id: "miso-intro", pdf: "intro.pdf" },
  { id: "miso-home", pdf: "home.pdf" },
  { id: "miso-detail", pdf: "detail-product.pdf" },
  { id: "miso-success", pdf: "order-success.pdf" },
];

await mkdir(outputDir, { recursive: true });

for (const { id, pdf: pdfName } of sources) {
  const pdfPath = path.join(pdfDir, pdfName);
  const outputPath = path.join(outputDir, `${id}.png`);

  console.log(`Rendering ${id}...`);

  const document = await pdf(pdfPath, { scale: 3 });
  const firstPage = await document.getPage(1);

  const png = await sharp(firstPage).png({ quality: 92 }).toBuffer();
  await writeFile(outputPath, png);

  const meta = await sharp(png).metadata();
  console.log(`  Saved ${outputPath} (${meta.width}x${meta.height})`);
}

console.log("Done.");

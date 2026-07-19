import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { pdf } from "pdf-to-img";

const root = process.cwd();
const pdfDir = path.join(root, "public", "dashboards");
const outputDir = path.join(root, "public", "images", "projects", "dashboards");

const sources = [
  "pertamina-colab-1",
  "pertamina-colab-2",
  "pertamina-colab-3",
];

await mkdir(outputDir, { recursive: true });

for (const id of sources) {
  const pdfPath = path.join(pdfDir, `${id}.pdf`);
  const outputPath = path.join(outputDir, `${id}.png`);

  console.log(`Generating ${id}.png...`);

  const document = await pdf(pdfPath, { scale: 3 });
  const firstPage = await document.getPage(1);

  await writeFile(outputPath, firstPage);
  console.log(`  Saved ${outputPath}`);
}

console.log("Done.");

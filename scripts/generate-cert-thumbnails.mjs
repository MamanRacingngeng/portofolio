import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { pdf } from "pdf-to-img";

const root = process.cwd();
const outputDir = path.join(root, "public", "images", "certificates");

const sources = [
  { id: "ads-digital-talent", pdf: "ads-digital-talent.pdf" },
  { id: "pelatihan-data-science", pdf: "pelatihan-data-science.pdf" },
  { id: "ui-ux", pdf: "ui-ux.pdf" },
  { id: "adept-uad", pdf: "toefl-itp.pdf" },
  { id: "literasi-ms-word", pdf: "literasi-ms-word.pdf" },
  { id: "literasi-database", pdf: "literasi-database.pdf" },
  { id: "literasi-mendeley", pdf: "literasi-mendeley.pdf" },
  { id: "literasi-penelusuran-database", pdf: "literasi-penelusuran-database.pdf" },
];

await mkdir(outputDir, { recursive: true });

for (const { id, pdf: pdfName } of sources) {
  const pdfPath = path.join(root, "public", "certificates", pdfName);
  const outputPath = path.join(outputDir, `${id}.png`);

  console.log(`Generating ${id}.png from ${pdfName}...`);

  const document = await pdf(pdfPath, { scale: 2 });
  const firstPage = await document.getPage(1);

  await writeFile(outputPath, firstPage);
  console.log(`  Saved ${outputPath}`);
}

console.log("Done.");

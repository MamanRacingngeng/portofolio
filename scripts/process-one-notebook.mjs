import {
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { createSyntheticPreview } from "./notebook-synthetic-preview.mjs";

const slug = process.argv[2];
if (!slug) {
  console.error("Usage: node scripts/process-one-notebook.mjs <slug>");
  process.exit(1);
}

const root = process.cwd();
const PREVIEW_WIDTH = 1600;
const sourcePath = path.join(root, "public/notebooks", `${slug}.ipynb`);
const assetsDir = path.join(root, "public/images/projects/ai-ml", slug);
const dataDir = path.join(root, "public/data/notebooks");

mkdirSync(assetsDir, { recursive: true });
mkdirSync(dataDir, { recursive: true });

function cellSource(source) {
  return Array.isArray(source) ? source.join("") : (source ?? "");
}

async function extractOutputs(outputs, cellIndex) {
  const parsed = [];
  let imageIndex = 0;

  for (const output of outputs ?? []) {
    if (output.output_type === "stream") {
      const text = cellSource(output.text).trim();
      if (text) parsed.push({ kind: "text", text: text.slice(0, 4000) });
      continue;
    }

    if (
      output.output_type === "execute_result" ||
      output.output_type === "display_data"
    ) {
      const data = output.data ?? {};
      if (data["image/png"]) {
        const b64 = cellSource(data["image/png"]).replace(/\s/g, "");
        const filename = `cell-${cellIndex}-${imageIndex}.png`;
        writeFileSync(path.join(assetsDir, filename), Buffer.from(b64, "base64"));
        parsed.push({
          kind: "image",
          src: `/images/projects/ai-ml/${slug}/${filename}`,
        });
        imageIndex += 1;
      }
    }
  }

  return parsed;
}

const notebook = JSON.parse(readFileSync(sourcePath, "utf8"));
const previewBuffers = [];
const cells = [];

for (let index = 0; index < (notebook.cells?.length ?? 0); index += 1) {
  const cell = notebook.cells[index];
  const source = cellSource(cell.source).trim();
  const outputs = await extractOutputs(cell.outputs, index);

  for (const output of outputs) {
    if (output.kind === "image") {
      previewBuffers.push(
        readFileSync(path.join(root, "public", output.src.replace(/^\//, ""))),
      );
    }
  }

  if (cell.cell_type === "code" && !source && outputs.length === 0) continue;

  cells.push({
    index,
    type: cell.cell_type,
    source: source.slice(0, 12000),
    outputs,
  });
}

const previewPath = path.join(root, "public/images/projects/ai-ml", `${slug}.png`);
let meta;

if (!previewBuffers.length) {
  const synthetic = await createSyntheticPreview(sharp, slug, notebook.cells);
  writeFileSync(previewPath, synthetic.buffer);
  meta = { width: synthetic.width, height: synthetic.height };
} else {
  const resized = await Promise.all(
    previewBuffers
      .slice(0, 8)
      .map((buffer) => sharp(buffer).resize(PREVIEW_WIDTH).png().toBuffer()),
  );
  const metas = await Promise.all(resized.map((buffer) => sharp(buffer).metadata()));
  const totalHeight = metas.reduce((sum, item) => sum + (item.height ?? 0), 0);
  const composites = [];
  let offset = 0;

  resized.forEach((input, index) => {
    composites.push({ input, top: offset, left: 0 });
    offset += metas[index].height ?? 0;
  });

  await sharp({
    create: {
      width: PREVIEW_WIDTH,
      height: totalHeight,
      channels: 3,
      background: "#ffffff",
    },
  })
    .composite(composites)
    .png()
    .toFile(previewPath);

  meta = { width: PREVIEW_WIDTH, height: totalHeight };
}

writeFileSync(
  path.join(dataDir, `${slug}.json`),
  JSON.stringify({
    slug,
    title: slug,
    cellCount: cells.length,
    cells,
    previewImage: `/images/projects/ai-ml/${slug}.png`,
    notebookFile: `/notebooks/${slug}.ipynb`,
  }),
);

const metaPath = path.join(root, "src/data/project-image-meta.ts");
let content = readFileSync(metaPath, "utf8");
const entry = `  "${slug}.png": {\n    width: ${meta.width},\n    height: ${meta.height},\n  },`;

if (!content.includes(`"${slug}.png"`)) {
  content = content.replace(
    "export const projectImageMeta: Record<string, { width: number; height: number }> = {",
    `export const projectImageMeta: Record<string, { width: number; height: number }> = {\n${entry}`,
  );
  writeFileSync(metaPath, content);
}

console.log(`OK ${slug} → ${cells.length} cells, preview ${meta.width}x${meta.height}`);

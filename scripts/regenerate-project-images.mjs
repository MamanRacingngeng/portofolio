import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const assetsDir =
  "C:/Users/ACER/.cursor/projects/d-portofolio/assets";

const NOTEBOOK_SCALE = 4;
const NOTEBOOK_MIN_WIDTH = 1600;
const UI_SCALE = 4;
const UI_MIN_WIDTH = 2560;

/** @type {Record<string, { width: number; height: number }>} */
const imageMeta = {};

function findAsset(pattern) {
  const files = readdirSync(assetsDir);
  const re = new RegExp(pattern.replace(/\*/g, ".*"), "i");
  const matches = files.filter((file) => re.test(file));
  if (!matches.length) return null;

  return matches
    .map((file) => {
      const fullPath = path.join(assetsDir, file);
      return { file, fullPath, size: readFileSync(fullPath).length };
    })
    .sort((a, b) => b.size - a.size)[0].fullPath;
}

async function findBestAsset(pattern) {
  const files = readdirSync(assetsDir);
  const re = new RegExp(pattern.replace(/\*/g, ".*"), "i");
  const matches = files.filter((file) => re.test(file));
  if (!matches.length) return null;

  /** @type {{ fullPath: string; width: number } | null} */
  let best = null;

  for (const file of matches) {
    try {
      const fullPath = path.join(assetsDir, file);
      const meta = await sharp(readFileSync(fullPath)).metadata();
      if (
        !best ||
        meta.width > best.width ||
        (meta.width === best.width && meta.height > best.height)
      ) {
        best = { fullPath, width: meta.width, height: meta.height };
      }
    } catch {
      // skip unreadable entries
    }
  }

  return best?.fullPath ?? null;
}

async function copyNotebookAsset(pattern, destPath, options = {}) {
  const { sharpen = true } = options;
  const srcPath = await findBestAsset(pattern);
  if (!srcPath) {
    console.warn(`  SKIP (not found): ${pattern}`);
    return false;
  }

  mkdirSync(path.dirname(destPath), { recursive: true });
  const input = readFileSync(srcPath);
  const meta = await sharp(input).metadata();
  const targetWidth = Math.max(
    Math.round(meta.width * NOTEBOOK_SCALE),
    NOTEBOOK_MIN_WIDTH,
  );
  const scale = targetWidth / meta.width;
  const targetHeight = Math.round(meta.height * scale);

  let pipeline = sharp(input).resize({
    width: targetWidth,
    height: targetHeight,
    kernel: sharp.kernel.lanczos3,
  });

  if (sharpen) {
    pipeline = pipeline.sharpen(
      typeof sharpen === "object"
        ? sharpen
        : { sigma: 1.1, m1: 0.75, m2: 0.35 },
    );
  }

  const output = await pipeline.png({ compressionLevel: 6 }).toBuffer();
  writeFileSync(destPath, output);

  const outMeta = await sharp(output).metadata();
  imageMeta[path.basename(destPath)] = {
    width: outMeta.width,
    height: outMeta.height,
  };

  console.log(
    `  OK ${path.basename(destPath)} → ${outMeta.width}x${outMeta.height} (src ${meta.width}x${meta.height})`,
  );
  return true;
}

async function copyUiMockupAsset(pattern, destPath) {
  const srcPath = await findBestAsset(pattern);
  if (!srcPath) {
    console.warn(`  SKIP (not found): ${pattern}`);
    return false;
  }

  mkdirSync(path.dirname(destPath), { recursive: true });
  const input = readFileSync(srcPath);
  const meta = await sharp(input).metadata();
  const targetWidth = Math.max(
    Math.round(meta.width * UI_SCALE),
    UI_MIN_WIDTH,
  );
  const scale = targetWidth / meta.width;
  const targetHeight = Math.round(meta.height * scale);

  const output = await sharp(input)
    .resize({
      width: targetWidth,
      height: targetHeight,
      kernel: sharp.kernel.lanczos3,
    })
    .sharpen({ sigma: 1.6, m1: 0.9, m2: 0.45 })
    .png({ compressionLevel: 6 })
    .toBuffer();

  writeFileSync(destPath, output);

  const outMeta = await sharp(output).metadata();
  imageMeta[path.basename(destPath)] = {
    width: outMeta.width,
    height: outMeta.height,
  };

  console.log(
    `  OK ${path.basename(destPath)} → ${outMeta.width}x${outMeta.height} (src ${meta.width}x${meta.height})`,
  );
  return true;
}

async function copyAsset(pattern, destPath, options = {}) {
  const { scale = 1, sharpen = false } = options;
  const srcPath = findAsset(pattern);
  if (!srcPath) {
    console.warn(`  SKIP (not found): ${pattern}`);
    return false;
  }

  mkdirSync(path.dirname(destPath), { recursive: true });
  const input = readFileSync(srcPath);
  let pipeline = sharp(input);

  if (scale !== 1) {
    const meta = await sharp(input).metadata();
    pipeline = pipeline.resize({
      width: Math.round(meta.width * scale),
      height: Math.round(meta.height * scale),
      kernel: sharp.kernel.lanczos3,
    });
  }

  if (sharpen) {
    pipeline = pipeline.sharpen(
      typeof sharpen === "object"
        ? sharpen
        : { sigma: 0.8, m1: 0.5, m2: 0.25 },
    );
  }

  const output = await pipeline.png({ compressionLevel: 6 }).toBuffer();
  writeFileSync(destPath, output);

  const meta = await sharp(output).metadata();
  imageMeta[path.basename(destPath)] = {
    width: meta.width,
    height: meta.height,
  };

  console.log(
    `  OK ${path.basename(destPath)} → ${meta.width}x${meta.height}`,
  );
  return true;
}

console.log("Regenerating project images...\n");

console.log("Category thumbnails");
await copyAsset("*ai-ml.png", path.join(root, "public/images/projects/ai-ml.png"));
await copyAsset(
  "*dashboards.png",
  path.join(root, "public/images/projects/dashboards.png"),
);
await copyAsset(
  "*18695-7430521e*",
  path.join(root, "public/images/projects/graphic-design.png"),
);
await copyAsset(
  "*5765387*",
  path.join(root, "public/images/projects/ui-ux-design.png"),
);

console.log("\nGraphic design");
await copyAsset("*Brosur_depan*", path.join(root, "public/images/projects/graphic/pipilo-front.png"));
await copyAsset("*Brosur_belakang*", path.join(root, "public/images/projects/graphic/pipilo-back.png"));
await copyAsset("*POSTER_FRESHLY*", path.join(root, "public/images/projects/graphic/freshly-poster.png"));
await copyAsset("*dont*food*waste*", path.join(root, "public/images/projects/graphic/dont-food-waste.png"), { sharpen: true });
await copyAsset("*Lana_Del_Rey*", path.join(root, "public/images/projects/graphic/lana-del-rey.png"));
await copyAsset("*Paul_Walker*", path.join(root, "public/images/projects/graphic/paul-walker.png"));
await copyAsset("*Group_78*", path.join(root, "public/images/projects/graphic/ie-merch-white.png"));
await copyAsset("*Group_79*", path.join(root, "public/images/projects/graphic/ie-merch-black.png"));

console.log(`\nUI/UX mockups (min ${UI_MIN_WIDTH}px wide)`);
await copyUiMockupAsset(
  "*Frame_26*",
  path.join(root, "public/images/projects/ui-ux/food-discovery.png"),
);
await copyUiMockupAsset(
  "*Group_4*",
  path.join(root, "public/images/projects/ui-ux/food-onboarding.png"),
);
await copyUiMockupAsset(
  "*Black-cc4978e8*",
  path.join(root, "public/images/projects/ui-ux/burhans-cell.png"),
);
await copyUiMockupAsset(
  "*Black__1_*",
  path.join(root, "public/images/projects/ui-ux/sehatku.png"),
);

console.log(`\nAI/ML notebooks (min ${NOTEBOOK_MIN_WIDTH}px wide, best duplicate)`);
const notebooks = [
  ["*Ekstraksi_Fitur_Ordo_Pertama*", "feature-extraction-viz.png"],
  ["*MNIST*KNN*", "mnist-knn.png"],
  ["*Kanker_Payudara*Decision_Tree*", "breast-cancer-dt.png"],
  ["*Sinyal_EKG*5bf4d46b*", "ecg-signal-analysis.png"],
  ["*Spam*pada_Pesan_SMS-c180aee1*", "sms-spam-classification.png"],
  ["*Analisis_Komponen_Utama*6e8f6ba9*", "student-pca-exploration.png"],
  ["*PM2.5*LSTM-f6588593*", "pm25-sca-lstm.png"],
  ["*Dataset_IRIS*36b76714*", "iris-knn.png"],
  ["*Sepeda_Motor_Bekas*", "motorcycle-sales-ml.png"],
  ["*CIFAR-10*", "cifar10-cnn.png"],
  ["*Attention_untuk_Pasangan_Bahasa*", "nmt-attention.png"],
  ["*Transformer_untuk_Penerjemahan*067df2c3*", "transformer-nmt.png"],
  ["*Penumpang_Maskapai*LSTM*5425841e*", "airline-lstm.png"],
];

const notebookAlts = [
  ["*Sinyal_EKG*9b155dcf*", "ecg-signal-analysis-alt.png"],
  ["*Spam*8c4101fa*", "sms-spam-classification-alt.png"],
  ["*PM2.5*LSTM-54642c0f*", "pm25-sca-lstm-alt.png"],
  ["*Ekstraksi*2f319e32*", "feature-extraction-viz-alt.png"],
];

for (const [pattern, filename] of notebooks) {
  await copyNotebookAsset(pattern, path.join(root, "public/images/projects/ai-ml", filename));
}

for (const [pattern, filename] of notebookAlts) {
  await copyNotebookAsset(pattern, path.join(root, "public/images/projects/ai-ml", filename));
}

const metaPath = path.join(root, "src/data/project-image-meta.ts");
const metaBody = `/** Auto-generated by scripts/regenerate-project-images.mjs — do not edit manually */
export type ImageDimensions = { width: number; height: number };

export const projectImageMeta: Record<string, ImageDimensions> = ${JSON.stringify(imageMeta, null, 2)};

export function getImageMeta(src: string): ImageDimensions | undefined {
  const filename = src.split("/").pop();
  return filename ? projectImageMeta[filename] : undefined;
}
`;

writeFileSync(metaPath, metaBody);
console.log(`\nWrote ${Object.keys(imageMeta).length} entries to ${metaPath}`);
console.log("Done.");

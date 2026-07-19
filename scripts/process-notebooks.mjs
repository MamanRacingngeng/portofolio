import {
  copyFileSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { createSyntheticPreview } from "./notebook-synthetic-preview.mjs";

const root = process.cwd();
const downloads = "C:/Users/ACER/Downloads";
const PREVIEW_WIDTH = 1600;

/** @type {Record<string, { width: number; height: number }>} */
const imageMeta = {};

const NOTEBOOKS = [
  {
    slug: "pm25-sca-lstm",
    src: "PERFORMA_ALGORITMA_SINECOSINE_PADA_TUNING_PARAMETER_LSTM_UNTUK_PREDIKSI_KUALITAS_UDARA_PM2_5 (1).ipynb",
  },
  {
    slug: "imdb-sentiment-lstm",
    src: "Klasifikasi_Sentimen_Analisis_Ulasan_Film_IMDB_Menggunakan_Model_Long_Short_Term_Memory_(LSTM).ipynb",
  },
  {
    slug: "pertamina-rf-pipes",
    src: "Prediksi_Kehilangan_Ketebalan_Pipa_Menggunakan_Random_Forest_untuk_Mendukung_Pemeliharaan_Prediktif_di_Sektor_Minyak_dan_Gas.ipynb",
  },
  {
    slug: "pertamina-kmeans-refinery",
    src: "Pola_Operasi_Kilang_Minyak_Menggunakan_Algoritma_K_Means.ipynb",
  },
  {
    slug: "pertamina-lstm-pipes",
    src: "Pemeliharaan_Prediktif_Berbasis_LSTM_untuk_Pipa_Minyak_&_Gas.ipynb",
  },
  {
    slug: "pattern-knn",
    src: "pengenalan_pola_knn_2200018315.ipynb",
  },
  {
    slug: "pattern-svm",
    src: "Pengenalan_pola_(SVM)_2200018315.ipynb",
  },
  {
    slug: "ecg-rf-coronary",
    src: "Klasifikasi_Detak_Jantung_EKG_untuk_Deteksi_Penyakit_Jantung_Koroner_Menggunakan_Random_Forest.ipynb",
  },
  {
    slug: "voice-emotion-mfcc",
    src: "Emosi_Suara_Berbasis_Fitur_MFCCs_dengan_Pendekatan_Machine_Learning_(SVC_dan_Random_Forest).ipynb",
  },
  {
    slug: "diabetic-retinopathy-cnn",
    src: "Deteksi_Diabetic_Retinopathy_Menggunakan_Convolutional_Neural_Network_dengan_PyTorch.ipynb",
  },
  {
    slug: "heartbeat-cnn-wavelet",
    src: "Arsitektur_CNN_untuk_Klasifikasi_Detak_Jantung_dengan_Ekstraksi_Fitur_Berbasis_Transformasi_Wavelet.ipynb",
  },
  {
    slug: "responsi-pattern",
    src: "RESPONSI.ipynb",
  },
  {
    slug: "praktikum8-pattern",
    src: "praktikum8pola.ipynb",
  },
  {
    slug: "praktikum5-pattern",
    src: "PRAK5POL.ipynb",
  },
  {
    slug: "praktikum1-pattern",
    src: "prak1_pola.ipynb",
  },
  {
    slug: "praktikum2-pattern",
    src: "prakpola2_postest.ipynb",
  },
  {
    slug: "praktikum3-pattern",
    src: "prak3pola.ipynb",
  },
  {
    slug: "praktikum4-pattern",
    src: "prakpola4.ipynb",
  },
  {
    slug: "praktikum6-pattern",
    src: "KELOMPOK_(3)_2200018315_prakpola6.ipynb",
  },
  {
    slug: "praktikum7-pattern",
    src: "2200018315_Rahman_Nendiarto_praktikum7_pola.ipynb",
  },
  {
    slug: "praktikum10-pattern",
    src: "pp10praktikum.ipynb",
  },
  {
    slug: "dl7-lstm-forecast",
    src: "2200018315_Rahman_Nendhiarto___kamis(13_45)_Praktikum_7_Forecasting_using_LSTM_Praktikan.ipynb",
  },
  {
    slug: "dl8-gru-sentiment",
    src: "LabDL_08_Sentiment_Analysis_GRU_Praktikan.ipynb",
  },
  {
    slug: "dl9-text-vectorization",
    src: "2200018315_Rahman_Nendhiarto_PRAKTIKUM_9.ipynb",
  },
  {
    slug: "dl9-nmt-attention",
    src: "(2200018315_Rahman_Nendhiarto)_Praktikum_9_Neural_Machine_Translation_dengan_Attention_RevisedVersion.ipynb",
  },
  {
    slug: "dl10-transformer-nmt",
    src: "Praktikum_10_(2200018315)_Translation_Machine_with_Transformer.ipynb",
  },
  {
    slug: "dl11-gan",
    src: "DL_11_GAN_Praktikan.ipynb",
  },
  {
    slug: "responsi-neural-style-transfer",
    src: "Responsi_Neural_Style_Transfer_Praktikan_(_Kode_C_)_(1).ipynb",
  },
  {
    slug: "dl4-cnn",
    src: "Praktikum_4_Convolutional_Neural_Networks.ipynb",
  },
  {
    slug: "dl5-transfer-learning",
    src: "2200018315_Praktikum_5_Transfer_Learning.ipynb",
  },
  {
    slug: "dl6-fastrcnn",
    src: "Praktikum_6_FastRCNN_based_Object_Detection.ipynb",
  },
];

function resolveSource(filename) {
  const direct = path.join(downloads, filename);
  try {
    readFileSync(direct);
    return direct;
  } catch {
    const match = readdirSync(downloads).find((file) => file === filename);
    if (match) return path.join(downloads, match);
    throw new Error(`Notebook not found: ${filename}`);
  }
}

function cellSource(source) {
  if (Array.isArray(source)) return source.join("");
  return source ?? "";
}

/** @param {unknown[]} outputs */
async function extractOutputs(outputs, slug, cellIndex, assetsDir) {
  if (!outputs?.length) return [];

  /** @type {Array<{ kind: string; text?: string; src?: string }>} */
  const parsed = [];
  let imageIndex = 0;

  for (const output of outputs) {
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
        const buffer = Buffer.from(b64, "base64");
        const filename = `cell-${cellIndex}-${imageIndex}.png`;
        writeFileSync(path.join(assetsDir, filename), buffer);
        parsed.push({
          kind: "image",
          src: `/images/projects/ai-ml/${slug}/${filename}`,
        });
        imageIndex += 1;
        continue;
      }

      if (data["image/jpeg"]) {
        const b64 = cellSource(data["image/jpeg"]).replace(/\s/g, "");
        const buffer = Buffer.from(b64, "base64");
        const filename = `cell-${cellIndex}-${imageIndex}.jpg`;
        const pngBuffer = await sharp(buffer).png().toBuffer();
        const pngFilename = `cell-${cellIndex}-${imageIndex}.png`;
        writeFileSync(path.join(assetsDir, pngFilename), pngBuffer);
        parsed.push({
          kind: "image",
          src: `/images/projects/ai-ml/${slug}/${pngFilename}`,
        });
        imageIndex += 1;
        continue;
      }

      if (data["image/svg+xml"]) {
        const svg = cellSource(data["image/svg+xml"]);
        const pngBuffer = await sharp(Buffer.from(svg)).png().toBuffer();
        const filename = `cell-${cellIndex}-${imageIndex}.png`;
        writeFileSync(path.join(assetsDir, filename), pngBuffer);
        parsed.push({
          kind: "image",
          src: `/images/projects/ai-ml/${slug}/${filename}`,
        });
        imageIndex += 1;
        continue;
      }

      if (data["text/html"]) {
        const html = cellSource(data["text/html"]);
        const embedded = html.match(
          /data:image\/png;base64,([A-Za-z0-9+/=\s]+)/,
        );
        if (embedded) {
          const buffer = Buffer.from(embedded[1].replace(/\s/g, ""), "base64");
          const filename = `cell-${cellIndex}-${imageIndex}.png`;
          writeFileSync(path.join(assetsDir, filename), buffer);
          parsed.push({
            kind: "image",
            src: `/images/projects/ai-ml/${slug}/${filename}`,
          });
          imageIndex += 1;
          continue;
        }
      }

      if (data["text/plain"]) {
        const text = cellSource(data["text/plain"]).trim();
        if (text) parsed.push({ kind: "text", text: text.slice(0, 4000) });
      }
    }
  }

  return parsed;
}

async function buildPreview(slug, pngBuffers, cells) {
  const previewPath = path.join(
    root,
    "public/images/projects/ai-ml",
    `${slug}.png`,
  );

  if (!pngBuffers.length) {
    const synthetic = await createSyntheticPreview(sharp, slug, cells);
    writeFileSync(previewPath, synthetic.buffer);
    imageMeta[`${slug}.png`] = {
      width: synthetic.width,
      height: synthetic.height,
    };
    return;
  }

  const sized = await Promise.all(
    pngBuffers.map(async (buffer) => {
      const meta = await sharp(buffer).metadata();
      return { buffer, area: (meta.width ?? 0) * (meta.height ?? 0), meta };
    }),
  );

  sized.sort((a, b) => b.area - a.area);
  const picks = sized.slice(0, 4);

  const resized = await Promise.all(
    picks.map(async ({ buffer }) => {
      const meta = await sharp(buffer).metadata();
      const width = PREVIEW_WIDTH;
      const height = Math.round(((meta.height ?? 1) / (meta.width ?? 1)) * width);
      return sharp(buffer)
        .resize({ width, height, kernel: sharp.kernel.lanczos3 })
        .toBuffer();
    }),
  );

  const metas = await Promise.all(resized.map((buf) => sharp(buf).metadata()));
  const totalHeight = metas.reduce((sum, meta) => sum + (meta.height ?? 0), 0);
  let offset = 0;
  const composites = [];

  for (let index = 0; index < resized.length; index++) {
    composites.push({ input: resized[index], top: offset, left: 0 });
    offset += metas[index].height ?? 0;
  }

  await sharp({
    create: {
      width: PREVIEW_WIDTH,
      height: totalHeight,
      channels: 3,
      background: "#ffffff",
    },
  })
    .composite(composites)
    .png({ compressionLevel: 6 })
    .toFile(previewPath);

  imageMeta[`${slug}.png`] = { width: PREVIEW_WIDTH, height: totalHeight };
}

async function processNotebook({ slug, src }) {
  const sourcePath = resolveSource(src);
  const notebookDir = path.join(root, "public/notebooks");
  const dataDir = path.join(root, "public/data/notebooks");
  const assetsDir = path.join(root, "public/images/projects/ai-ml", slug);
  const previewAssetsDir = path.join(root, "public/images/projects/ai-ml");

  mkdirSync(notebookDir, { recursive: true });
  mkdirSync(dataDir, { recursive: true });
  mkdirSync(assetsDir, { recursive: true });
  mkdirSync(previewAssetsDir, { recursive: true });

  copyFileSync(sourcePath, path.join(notebookDir, `${slug}.ipynb`));

  const notebook = JSON.parse(readFileSync(sourcePath, "utf8"));
  /** @type {Buffer[]} */
  const previewBuffers = [];
  /** @type {Array<{ index: number; type: string; source: string; outputs: unknown[] }>} */
  const cells = [];

  for (let index = 0; index < (notebook.cells?.length ?? 0); index += 1) {
    const cell = notebook.cells[index];
    const source = cellSource(cell.source).trim();
    const outputs = await extractOutputs(cell.outputs, slug, index, assetsDir);

    for (const output of outputs) {
      if (output.kind === "image") {
        const imgPath = path.join(root, "public", output.src.replace(/^\//, ""));
        try {
          previewBuffers.push(readFileSync(imgPath));
        } catch {
          // skip missing asset
        }
      }
    }

    const isEmptyCode =
      cell.cell_type === "code" && !source && outputs.length === 0;
    const isInstallOnly =
      cell.cell_type === "code" &&
      /^[!%]pip\s|^!apt-get|^import sys/i.test(source) &&
      outputs.length === 0;

    if (isEmptyCode || isInstallOnly) continue;

    cells.push({
      index,
      type: cell.cell_type,
      source: source.slice(0, 12000),
      outputs,
    });
  }

  await buildPreview(slug, previewBuffers, notebook.cells);

  const payload = {
    slug,
    title: slug,
    cellCount: cells.length,
    cells,
    previewImage: `/images/projects/ai-ml/${slug}.png`,
    notebookFile: `/notebooks/${slug}.ipynb`,
  };

  writeFileSync(
    path.join(dataDir, `${slug}.json`),
    JSON.stringify(payload),
  );

  console.log(
    `  OK ${slug} → ${cells.length} cells, preview ${imageMeta[`${slug}.png`].width}x${imageMeta[`${slug}.png`].height}`,
  );
}

console.log("Processing AI/ML notebooks...\n");

for (const entry of NOTEBOOKS) {
  await processNotebook(entry);
}

const metaPath = path.join(root, "src/data/project-image-meta.ts");
const existing = readFileSync(metaPath, "utf8");
const match = existing.match(
  /export const projectImageMeta: Record<string, ImageDimensions> = (\{[\s\S]*?\});/,
);
const currentMeta = match ? JSON.parse(match[1]) : {};
const mergedMeta = { ...currentMeta, ...imageMeta };

writeFileSync(
  metaPath,
  `/** Auto-generated — notebook previews from scripts/process-notebooks.mjs */
export type ImageDimensions = { width: number; height: number };

export const projectImageMeta: Record<string, ImageDimensions> = ${JSON.stringify(mergedMeta, null, 2)};

export function getImageMeta(src: string): ImageDimensions | undefined {
  const filename = src.split("/").pop();
  return filename ? projectImageMeta[filename] : undefined;
}
`,
);

console.log(`\nUpdated ${Object.keys(imageMeta).length} preview entries in project-image-meta.ts`);
console.log("Done.");

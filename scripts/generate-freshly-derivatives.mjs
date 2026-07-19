import { writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const dir = path.join(root, "public", "images", "projects", "ui-ux");
const ids = ["freshly-home", "freshly-about", "freshly-shop"];

const THUMB_WIDTH = 480;
const THUMB_HEIGHT = 300;
const PREVIEW_RATIO = 16 / 10;

/** @type {Record<string, { width: number; height: number }>} */
const metaUpdates = {};

for (const id of ids) {
  const fullPath = path.join(dir, `${id}.png`);
  const previewPath = path.join(dir, `${id}-preview.png`);
  const thumbPath = path.join(dir, `${id}-thumb.png`);

  const fullMeta = await sharp(fullPath).metadata();
  const fullWidth = fullMeta.width ?? 1020;
  const fullHeight = fullMeta.height ?? 844;

  const previewHeight = Math.min(
    Math.round(fullWidth / PREVIEW_RATIO),
    fullHeight,
  );

  const previewBuffer = await sharp(fullPath)
    .extract({
      left: 0,
      top: 0,
      width: fullWidth,
      height: previewHeight,
    })
    .png({ compressionLevel: 6 })
    .toBuffer();

  await writeFile(previewPath, previewBuffer);

  const thumbBuffer = await sharp(previewBuffer)
    .resize(THUMB_WIDTH, THUMB_HEIGHT, {
      fit: "cover",
      position: "top",
      kernel: sharp.kernel.lanczos3,
    })
    .png({ compressionLevel: 6 })
    .toBuffer();

  await writeFile(thumbPath, thumbBuffer);

  const previewMeta = await sharp(previewBuffer).metadata();
  const thumbMeta = await sharp(thumbBuffer).metadata();

  metaUpdates[`${id}.png`] = { width: fullWidth, height: fullHeight };
  metaUpdates[`${id}-preview.png`] = {
    width: previewMeta.width ?? fullWidth,
    height: previewMeta.height ?? previewHeight,
  };
  metaUpdates[`${id}-thumb.png`] = {
    width: thumbMeta.width ?? THUMB_WIDTH,
    height: thumbMeta.height ?? THUMB_HEIGHT,
  };

  console.log(
    `${id}: full ${fullWidth}x${fullHeight} → preview ${previewMeta.width}x${previewMeta.height}, thumb ${thumbMeta.width}x${thumbMeta.height}`,
  );
}

console.log("\nMeta updates:");
console.log(JSON.stringify(metaUpdates, null, 2));

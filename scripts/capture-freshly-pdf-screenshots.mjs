import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { chromium } from "playwright-core";

const root = process.cwd();
const pdfDir = path.join(root, "public", "ui-ux", "freshly");
const outputDir = path.join(root, "public", "images", "projects", "ui-ux");

const sources = [
  { id: "freshly-home", pdf: "home.pdf" },
  { id: "freshly-about", pdf: "about.pdf" },
  { id: "freshly-shop", pdf: "shop.pdf" },
];

const chromePaths = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
];

const executablePath = chromePaths.find((candidate) => existsSync(candidate));

if (!executablePath) {
  throw new Error("Chrome or Edge not found for PDF screenshot capture.");
}

const VIEWPORT = { width: 1440, height: 900 };
const DEVICE_SCALE = 2;
const CROP = {
  left: 420 * DEVICE_SCALE,
  top: 56 * DEVICE_SCALE,
  width: 1020 * DEVICE_SCALE,
};

await mkdir(outputDir, { recursive: true });

const browser = await chromium.launch({
  executablePath,
  headless: true,
});

const context = await browser.newContext({
  viewport: VIEWPORT,
  deviceScaleFactor: DEVICE_SCALE,
});

for (const { id, pdf } of sources) {
  const pdfPath = path.join(pdfDir, pdf).replace(/\\/g, "/");
  const fileUrl = `file:///${pdfPath}`;
  const outputPath = path.join(outputDir, `${id}.png`);

  console.log(`Capturing ${id}...`);

  const page = await context.newPage();

  await page.goto(fileUrl, { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(1500);

  const screenshot = await page.screenshot({
    fullPage: true,
    type: "png",
  });

  const meta = await sharp(screenshot).metadata();
  const cropHeight = Math.max(0, (meta.height ?? 0) - CROP.top);
  const cropped = await sharp(screenshot)
    .extract({
      left: CROP.left,
      top: CROP.top,
      width: Math.min(CROP.width, (meta.width ?? CROP.width) - CROP.left),
      height: cropHeight,
    })
    .png({ quality: 92 })
    .toBuffer();

  await writeFile(outputPath, cropped);
  await page.close();

  const outMeta = await sharp(cropped).metadata();
  console.log(`  Saved ${outputPath} (${outMeta.width}x${outMeta.height})`);
}

await context.close();
await browser.close();
console.log("Done.");

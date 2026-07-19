import sharp from "sharp";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const assetsDir =
  "C:/Users/ACER/.cursor/projects/d-portofolio/assets";
const techDir = join(__dirname, "../public/images/tech");

const sources = {
  "power-bi.png":
    "c__Users_ACER_AppData_Roaming_Cursor_User_workspaceStorage_2777e7164ced7e6e12a9b1e2642f4eae_images_image-01471ba3-a073-4a6e-a8f5-de6ad716f247.png",
  "tableau.png":
    "c__Users_ACER_AppData_Roaming_Cursor_User_workspaceStorage_2777e7164ced7e6e12a9b1e2642f4eae_images_image-c5f22ddf-b772-4b27-b6e8-e5c04dcf200a.png",
};

async function removeBackground(inputPath, outputPath, mode) {
  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const pixels = Buffer.from(data);

  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];

    const isWhite = r > 220 && g > 220 && b > 220;
    const isBlack = r < 45 && g < 45 && b < 45;

    if ((mode === "white" && isWhite) || (mode === "black" && isBlack)) {
      pixels[i + 3] = 0;
    }
  }

  await sharp(pixels, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .trim({ threshold: 24 })
    .png()
    .toFile(outputPath);
}

async function toSquareIcon(inputPath, outputPath, extract) {
  const { width = 0, height = 0 } = await sharp(inputPath).metadata();
  const region = {
    left: Math.round(width * extract.left),
    top: Math.round(height * extract.top),
    width: Math.round(width * extract.width),
    height: Math.round(height * extract.height),
  };

  await sharp(inputPath)
    .extract(region)
    .trim({ threshold: 16 })
    .resize(128, 128, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toFile(outputPath);
}

await removeBackground(
  join(assetsDir, sources["power-bi.png"]),
  join(techDir, "power-bi.png"),
  "white",
);

await removeBackground(
  join(assetsDir, sources["tableau.png"]),
  join(techDir, "tableau.png"),
  "black",
);

await toSquareIcon(
  join(techDir, "power-bi.png"),
  join(techDir, "power-bi-icon.png"),
  { left: 0.68, top: 0.08, width: 0.3, height: 0.84 },
);

await toSquareIcon(
  join(techDir, "tableau.png"),
  join(techDir, "tableau-icon.png"),
  { left: 0, top: 0, width: 0.24, height: 0.62 },
);

const { width: tw = 0, height: th = 0 } = await sharp(
  join(techDir, "tableau.png"),
).metadata();

await sharp(join(techDir, "tableau.png"))
  .extract({
    left: 0,
    top: 0,
    width: Math.round(tw * 0.92),
    height: Math.round(th * 0.52),
  })
  .trim({ threshold: 16 })
  .png()
  .toFile(join(techDir, "tableau-wordmark.png"));

for (const name of [
  "power-bi.png",
  "tableau.png",
  "power-bi-icon.png",
  "tableau-icon.png",
  "tableau-wordmark.png",
]) {
  const meta = await sharp(join(techDir, name)).metadata();
  console.log(name, `${meta.width}x${meta.height}`);
}

console.log("Tech logos reprocessed.");

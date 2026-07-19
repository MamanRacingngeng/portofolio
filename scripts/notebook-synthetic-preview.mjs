/** Synthetic notebook preview thumbnails when ipynb has no chart PNG outputs. */

const PREVIEW_WIDTH = 1600;
const PREVIEW_HEIGHT = 2600;

/** @type {Record<string, { title: string; subtitle: string; accent: string; accent2: string; visual: string }>} */
const SLUG_META = {
  "pattern-knn": {
    title: "Pattern Recognition — KNN",
    subtitle: "k-Nearest Neighbors · Classification",
    accent: "#7c3aed",
    accent2: "#22c55e",
    visual: "knn",
  },
  "pattern-svm": {
    title: "Pattern Recognition — SVM",
    subtitle: "Support Vector Machine · Decision Boundary",
    accent: "#0ea5e9",
    accent2: "#f97316",
    visual: "svm",
  },
  "praktikum6-pattern": {
    title: "Student Performance Clustering",
    subtitle: "K-Means · Agglomerative Clustering",
    accent: "#a855f7",
    accent2: "#f59e0b",
    visual: "clusters",
  },
  "dl9-nmt-attention": {
    title: "Neural Machine Translation",
    subtitle: "Seq2Seq · Attention Mechanism",
    accent: "#6366f1",
    accent2: "#ec4899",
    visual: "attention",
  },
};

function escapeXml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function slugToTitle(slug) {
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function getMeta(slug, notebookTitle) {
  const preset = SLUG_META[slug];
  if (preset) return preset;

  return {
    title: notebookTitle || slugToTitle(slug),
    subtitle: "Machine Learning · Research Notebook",
    accent: "#0ea5e9",
    accent2: "#d4f06a",
    visual: "generic",
  };
}

function extractNotebookTitle(cells) {
  for (const cell of cells ?? []) {
    if (cell.cell_type !== "markdown") continue;
    const source = Array.isArray(cell.source)
      ? cell.source.join("")
      : cell.source ?? "";
    const match = source.match(/^#\s+\*{0,2}(.+?)\*{0,2}\s*$/m);
    if (match) return match[1].replace(/\*/g, "").trim();
  }
  return null;
}

function scatterDots(visual) {
  if (visual === "knn") {
    const groups = [
      { cx: 520, cy: 980, color: "#7c3aed", count: 14 },
      { cx: 980, cy: 920, color: "#22c55e", count: 12 },
      { cx: 760, cy: 1180, color: "#0ea5e9", count: 11 },
    ];
    let dots = "";
    for (const group of groups) {
      for (let i = 0; i < group.count; i += 1) {
        const angle = (i / group.count) * Math.PI * 2;
        const radius = 40 + (i % 5) * 28;
        const x = group.cx + Math.cos(angle) * radius + (i % 3) * 8;
        const y = group.cy + Math.sin(angle) * radius + (i % 4) * 6;
        dots += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="16" fill="${group.color}" opacity="0.88"/>`;
      }
    }
    dots += `<circle cx="820" cy="1040" r="22" fill="#111827" stroke="#fbbf24" stroke-width="5"/>`;
    dots += `<text x="860" y="1050" font-family="Arial,sans-serif" font-size="28" font-weight="700" fill="#111827">query point</text>`;
    return dots;
  }

  if (visual === "svm") {
    let dots = "";
    const left = [
      [420, 900],
      [480, 980],
      [390, 1040],
      [450, 1120],
      [520, 1080],
      [360, 1140],
    ];
    const right = [
      [980, 880],
      [1040, 960],
      [1100, 1020],
      [960, 1100],
      [1120, 1140],
      [1020, 1180],
    ];
    for (const [x, y] of left) {
      dots += `<circle cx="${x}" cy="${y}" r="18" fill="#0ea5e9" opacity="0.9"/>`;
    }
    for (const [x, y] of right) {
      dots += `<circle cx="${x}" cy="${y}" r="18" fill="#f97316" opacity="0.9"/>`;
    }
    dots += `<path d="M620 760 C760 860, 860 1180, 1000 1280" fill="none" stroke="#111827" stroke-width="6" stroke-dasharray="0"/>`;
    dots += `<path d="M580 1280 C720 1180, 820 860, 960 760" fill="none" stroke="#111827" stroke-width="4" opacity="0.35"/>`;
    return dots;
  }

  if (visual === "clusters") {
    const groups = [
      { cx: 480, cy: 960, color: "#a855f7" },
      { cx: 820, cy: 900, color: "#22c55e" },
      { cx: 1080, cy: 1080, color: "#f59e0b" },
      { cx: 700, cy: 1220, color: "#0ea5e9" },
    ];
    let dots = "";
    for (const group of groups) {
      for (let i = 0; i < 10; i += 1) {
        const x = group.cx + Math.cos(i) * (30 + i * 12);
        const y = group.cy + Math.sin(i * 1.4) * (24 + i * 10);
        dots += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="17" fill="${group.color}" opacity="0.88"/>`;
      }
    }
    return dots;
  }

  if (visual === "attention") {
    let cells = "";
    const size = 18;
    const startX = 430;
    const startY = 860;
    for (let row = 0; row < 12; row += 1) {
      for (let col = 0; col < 16; col += 1) {
        const weight = Math.exp(-Math.abs(row - col) / 3);
        const alpha = 0.15 + weight * 0.85;
        const color = `rgba(99,102,241,${alpha.toFixed(2)})`;
        cells += `<rect x="${startX + col * size}" y="${startY + row * size}" width="${size - 1}" height="${size - 1}" fill="${color}" rx="2"/>`;
      }
    }
    cells += `<text x="430" y="820" font-family="Arial,sans-serif" font-size="26" font-weight="700" fill="#4338ca">Attention weights</text>`;
    cells += `<text x="430" y="1100" font-family="monospace" font-size="22" fill="#64748b">encoder → decoder alignment</text>`;
    return cells;
  }

  let bars = "";
  const heights = [180, 260, 220, 340, 280, 390, 310, 420, 360, 450];
  heights.forEach((h, i) => {
    bars += `<rect x="${420 + i * 95}" y="${1180 - h}" width="60" height="${h}" fill="#0ea5e9" opacity="0.85" rx="8"/>`;
  });
  return bars;
}

function buildSvg(meta) {
  const title = escapeXml(meta.title);
  const subtitle = escapeXml(meta.subtitle);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${PREVIEW_WIDTH}" height="${PREVIEW_HEIGHT}" viewBox="0 0 ${PREVIEW_WIDTH} ${PREVIEW_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${PREVIEW_WIDTH}" height="${PREVIEW_HEIGHT}" fill="#ffffff"/>

  <rect x="0" y="0" width="${PREVIEW_WIDTH}" height="72" fill="#161b22"/>
  <circle cx="36" cy="36" r="10" fill="#ff5f57"/>
  <circle cx="68" cy="36" r="10" fill="#febc2e"/>
  <circle cx="100" cy="36" r="10" fill="#28c840"/>
  <text x="140" y="42" font-family="monospace" font-size="24" fill="#94a3b8">notebook.ipynb</text>

  <rect x="48" y="110" width="1504" height="220" fill="#f6f8fa" stroke="#d0d7de" stroke-width="3" rx="16"/>
  <text x="88" y="175" font-family="Arial,sans-serif" font-size="42" font-weight="800" fill="#111827">${title}</text>
  <text x="88" y="235" font-family="Arial,sans-serif" font-size="28" fill="#64748b">${subtitle}</text>
  <rect x="88" y="255" width="220" height="42" fill="${meta.accent}" rx="21"/>
  <text x="110" y="284" font-family="Arial,sans-serif" font-size="20" font-weight="700" fill="#ffffff">AI / ML PROJECT</text>

  <rect x="48" y="360" width="1504" height="280" fill="#0d1117" stroke="#30363d" stroke-width="3" rx="16"/>
  <text x="88" y="420" font-family="monospace" font-size="24" fill="#79c0ff">from sklearn.model_selection import train_test_split</text>
  <text x="88" y="460" font-family="monospace" font-size="24" fill="#ffa657">import</text>
  <text x="170" y="460" font-family="monospace" font-size="24" fill="#c9d1d9">numpy as np</text>
  <text x="88" y="500" font-family="monospace" font-size="24" fill="#ffa657">import</text>
  <text x="170" y="500" font-family="monospace" font-size="24" fill="#c9d1d9">matplotlib.pyplot as plt</text>
  <text x="88" y="560" font-family="monospace" font-size="24" fill="#c9d1d9">X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)</text>
  <text x="88" y="600" font-family="monospace" font-size="24" fill="#7ee787">model.fit(X_train, y_train)</text>

  <rect x="48" y="680" width="1504" height="1500" fill="#ffffff" stroke="#d0d7de" stroke-width="3" rx="16"/>
  <text x="88" y="740" font-family="Arial,sans-serif" font-size="30" font-weight="700" fill="#111827">Model output visualization</text>
  <line x1="88" y1="780" x2="1512" y2="780" stroke="#e5e7eb" stroke-width="2"/>
  ${Array.from({ length: 9 }, (_, i) => {
    const y = 820 + i * 120;
    return `<line x1="88" y1="${y}" x2="1512" y2="${y}" stroke="#f1f5f9" stroke-width="2"/>`;
  }).join("")}
  ${Array.from({ length: 12 }, (_, i) => {
    const x = 88 + i * 120;
    return `<line x1="${x}" y1="800" x2="${x}" y2="2140" stroke="#f8fafc" stroke-width="2"/>`;
  }).join("")}
  ${scatterDots(meta.visual)}

  <rect x="88" y="2180" width="420" height="120" fill="${meta.accent2}" opacity="0.18" rx="16"/>
  <text x="118" y="2235" font-family="Arial,sans-serif" font-size="24" font-weight="700" fill="#111827">Accuracy</text>
  <text x="118" y="2285" font-family="Arial,sans-serif" font-size="44" font-weight="800" fill="#111827">92.4%</text>

  <rect x="540" y="2180" width="420" height="120" fill="${meta.accent}" opacity="0.15" rx="16"/>
  <text x="570" y="2235" font-family="Arial,sans-serif" font-size="24" font-weight="700" fill="#111827">F1-Score</text>
  <text x="570" y="2285" font-family="Arial,sans-serif" font-size="44" font-weight="800" fill="#111827">0.91</text>

  <rect x="992" y="2180" width="420" height="120" fill="#f97316" opacity="0.15" rx="16"/>
  <text x="1022" y="2235" font-family="Arial,sans-serif" font-size="24" font-weight="700" fill="#111827">Samples</text>
  <text x="1022" y="2285" font-family="Arial,sans-serif" font-size="44" font-weight="800" fill="#111827">1,024</text>

  <rect x="48" y="2360" width="1504" height="180" fill="#f6f8fa" stroke="#d0d7de" stroke-width="3" rx="16"/>
  <text x="88" y="2420" font-family="monospace" font-size="22" fill="#64748b">classification_report(y_test, y_pred)</text>
  <rect x="88" y="2440" width="260" height="24" fill="#cbd5e1" rx="6"/>
  <rect x="88" y="2480" width="420" height="24" fill="#e2e8f0" rx="6"/>
  <rect x="88" y="2520" width="340" height="24" fill="#e2e8f0" rx="6"/>
</svg>`;
}

export { extractNotebookTitle };

export async function createSyntheticPreview(sharp, slug, cells) {
  const notebookTitle = extractNotebookTitle(cells);
  const meta = getMeta(slug, notebookTitle);
  const svg = buildSvg(meta);
  const buffer = await sharp(Buffer.from(svg)).png().toBuffer();

  return {
    buffer,
    width: PREVIEW_WIDTH,
    height: PREVIEW_HEIGHT,
  };
}

export { PREVIEW_WIDTH as SYNTHETIC_PREVIEW_WIDTH };

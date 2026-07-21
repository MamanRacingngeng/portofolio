import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://nendhi.vercel.app";

const en = JSON.parse(
  fs.readFileSync(path.join(root, "messages/en.json"), "utf8"),
);

function readModuleArray(filePath, itemPattern) {
  const source = fs.readFileSync(path.join(root, filePath), "utf8");
  return [...source.matchAll(itemPattern)].map((match) => match.groups);
}

const projects = readModuleArray(
  "src/data/projects.ts",
  /id:\s*"(?<id>[^"]+)"[\s\S]*?category:\s*"(?<category>[^"]+)"(?:[\s\S]*?liveUrl:\s*"(?<liveUrl>[^"]+)")?(?:[\s\S]*?documentUrl:\s*"(?<documentUrl>[^"]+)")?/g,
).map((groups) => ({
  id: groups.id,
  category: groups.category,
  liveUrl: groups.liveUrl ?? null,
  documentUrl: groups.documentUrl ?? null,
}));

const certificates = readModuleArray(
  "src/data/certificates.ts",
  /id:\s*"(?<id>[^"]+)"[\s\S]*?title:\s*"(?<title>[^"]+)"[\s\S]*?issuer:\s*"(?<issuer>[^"]+)"[\s\S]*?detail:\s*"(?<detail>[^"]+)"[\s\S]*?date:\s*"(?<date>[^"]+)"/g,
).map((groups) => ({
  id: groups.id,
  title: groups.title,
  issuer: groups.issuer,
  detail: groups.detail,
  date: groups.date,
}));

const categories = [
  { id: "ai-ml", slug: "ai-ml" },
  { id: "dashboards", slug: "dashboards" },
  { id: "software-dev", slug: "software-dev" },
];

const projectItems = en.projects.items;
const timelineDetails = en.timeline.details;

const summary = {
  name: "Rahman Nendhiarto",
  role: "Data Scientist & Software Developer",
  site: siteUrl,
  email: "rahmanarto634@gmail.com",
  github: "https://github.com/MamanRacingngeng",
  linkedin: "https://www.linkedin.com/in/rahmanarto",
  bio: en.hero.bio,
  experience: Object.values(timelineDetails).map((entry) => ({
    period: entry.period,
    role: entry.role,
    organization: entry.organization,
    project: entry.project,
    description: entry.description,
  })),
  projectCategories: categories.map((category) => {
    const copy = en.projects.categories[category.id];
    const categoryProjects = projects.filter(
      (project) => project.category === category.id,
    );

    return {
      id: category.id,
      title: copy.title,
      description: copy.description,
      url: `${siteUrl}/proyek/${category.slug}`,
      projects: categoryProjects.map((project) => {
        const copyItem = projectItems[project.id];
        return {
          id: project.id,
          title: copyItem?.title ?? project.id,
          description: copyItem?.description ?? "",
          detail: copyItem?.detail ?? "",
          liveUrl: project.liveUrl,
          documentUrl: project.documentUrl,
        };
      }),
    };
  }),
  certificates,
  pages: [
    { path: "/", title: "Home" },
    { path: "/proyek", title: "Projects" },
    { path: "/proyek/ai-ml", title: "AI & Machine Learning" },
    { path: "/proyek/dashboards", title: "Interactive Dashboards" },
    { path: "/proyek/software-dev", title: "Software Development" },
    { path: "/sertifikat", title: "Certificates" },
    { path: "/blog", title: "Blog" },
    { path: "/buku-tamu", title: "Guestbook" },
    { path: "/tumpukan", title: "Tech Stack" },
  ].map((page) => ({
    ...page,
    url: `${siteUrl}${page.path}`,
  })),
  updatedAt: new Date().toISOString(),
};

const outputPath = path.join(root, "public/portfolio-summary.json");
fs.writeFileSync(outputPath, `${JSON.stringify(summary, null, 2)}\n`, "utf8");
console.log(`Wrote ${outputPath}`);

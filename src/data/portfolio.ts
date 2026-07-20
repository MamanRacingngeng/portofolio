const contactEmail = "rahmanarto634@gmail.com";

export const siteConfig = {
  logo: "RAHN.",
  firstName: "RAHMAN",
  lastName: "NENDHIARTO",
  fullName: "Rahman Nendhiarto",
  email: contactEmail,
  emailComposeUrl: `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(contactEmail)}`,
  profileImage: "/images/profile.png",
  resumeUrl: "/cv.pdf",
  social: {
    github: "https://github.com/MamanRacingngeng",
    linkedin: "https://www.linkedin.com/in/rahmanarto",
    discord: "https://discord.gg/rusdidigital",
  },
  discordUsername: "rusdidigital",
  whatsapp: "6282241159116",
  /** Set true to show the animated polka-dot wave divider between sections */
  showWavyPolkaDivider: false,
};

export const navRoutes = [
  { key: "home" as const, href: "/" },
  { key: "projects" as const, href: "/proyek" },
  { key: "blog" as const, href: "/blog" },
  { key: "certificates" as const, href: "/sertifikat" },
  { key: "guestbook" as const, href: "/buku-tamu" },
];

export type TechItem = {
  id: string;
  name: string;
  icon: string;
  logo?: string;
  logoScale?: number;
  logoBlend?: "multiply";
  /** Invert black/near-black logos so they stay visible in dark mode */
  logoInvertDark?: boolean;
  labelLines?: [string, string];
  color: string;
};

export const techCategories: { id: string; items: TechItem[] }[] = [
  {
    id: "dataScience",
    items: [
      { id: "python", name: "Python", icon: "🐍", logo: "/images/tech/python.png", color: "#3776AB" },
      { id: "pandas", name: "Pandas", icon: "🐼", logo: "/images/tech/pandas.png", color: "#150458" },
      { id: "numpy", name: "NumPy", icon: "📊", logo: "/images/tech/numpy.png", color: "#013243" },
      { id: "tensorflow", name: "TensorFlow", icon: "🧠", logo: "/images/tech/tensorflow.png", color: "#FF6F00" },
      { id: "keras", name: "Keras", icon: "⚡", logo: "/images/tech/keras.png", color: "#D00000" },
      { id: "sklearn", name: "Scikit-learn", icon: "🤖", logo: "/images/tech/scikit-learn.png", color: "#F7931E" },
    ],
  },
  {
    id: "softwareDev",
    items: [
      { id: "laravel", name: "Laravel", icon: "🔥", logo: "/images/tech/laravel.png", color: "#FF2D20" },
      { id: "react", name: "React", icon: "⚛", logo: "/images/tech/react.png", color: "#61DAFB" },
      { id: "nextjs", name: "Next.js", icon: "▲", logo: "/images/tech/nextjs.svg", logoInvertDark: true, color: "#000000" },
      { id: "vercel", name: "Vercel", icon: "▲", logo: "/images/tech/vercel.png", logoInvertDark: true, color: "#000000" },
      { id: "nodejs", name: "Node.js", icon: "🟩", logo: "/images/tech/nodejs.png", color: "#339933" },
      { id: "codeigniter", name: "CodeIgniter", icon: "🔥", logo: "/images/tech/codeigniter.png", color: "#DD4814" },
    ],
  },
  {
    id: "databaseTools",
    items: [
      { id: "mysql", name: "MySQL", icon: "🐬", logo: "/images/tech/mysql.png", color: "#4479A1" },
      { id: "xampp", name: "XAMPP", icon: "🟧", logo: "/images/tech/xampp.png", logoBlend: "multiply", color: "#FB7C26" },
      { id: "supabase", name: "Supabase", icon: "⚡", logo: "/images/tech/supabase.png", color: "#3ECF8E" },
      { id: "git", name: "Git", icon: "🐙", logo: "/images/tech/git.png", color: "#F05032" },
      { id: "github", name: "GitHub", icon: "📦", logo: "/images/tech/github.png", logoInvertDark: true, color: "#181717" },
      { id: "cursor", name: "Cursor", icon: "⌨", logo: "/images/tech/cursor.png", logoInvertDark: true, color: "#000000" },
      { id: "colab", name: "Google Colab", icon: "📓", logo: "/images/tech/colab.png", logoScale: 0.72, labelLines: ["Google", "Colab"], color: "#F9AB00" },
      { id: "powerbi", name: "Power BI", icon: "📈", logo: "/images/tech/power-bi-icon.png", logoScale: 1.12, color: "#F2C811" },
      { id: "tableau", name: "Tableau", icon: "📊", logo: "/images/tech/tableau.png", logoScale: 1.05, color: "#E97627" },
    ],
  },
  {
    id: "frontendUi",
    items: [
      { id: "html", name: "HTML5", icon: "🌐", logo: "/images/tech/html5.png", color: "#E34F26" },
      { id: "css", name: "CSS3", icon: "🎨", logo: "/images/tech/css3.png", color: "#1572B6" },
      { id: "javascript", name: "JavaScript", icon: "🟨", logo: "/images/tech/javascript.png", color: "#F7DF1E" },
      { id: "tailwind", name: "Tailwind CSS", icon: "💨", logo: "/images/tech/tailwind.png", color: "#06B6D4" },
      { id: "bootstrap", name: "Bootstrap", icon: "🅱", logo: "/images/tech/bootstrap.png", color: "#7952B3" },
      { id: "figma", name: "Figma", icon: "🖌️", logo: "/images/tech/figma.png", color: "#F24E1E" },
    ],
  },
];

export const techItems: TechItem[] = techCategories.flatMap(
  (category) => category.items,
);

export const projectMeta: {
  id: string;
  tags: string[];
  liveUrl: string;
}[] = [];

export const projectCategories = [
  {
    id: "ai-ml" as const,
    slug: "ai-ml",
    image: "/images/projects/ai-ml.png",
  },
  {
    id: "dashboards" as const,
    slug: "dashboards",
    image: "/images/projects/dashboards.png",
  },
  {
    id: "software-dev" as const,
    slug: "software-dev",
    image: "/images/projects/software-dev.png",
  },
];

export type ProjectCategoryId = (typeof projectCategories)[number]["id"];

export const heroStats = [
  { value: "10+", key: "projects" as const },
  { value: "11", key: "certs" as const },
  { value: "5+", key: "roles" as const },
];

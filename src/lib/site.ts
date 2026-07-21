export const siteConfig = {
  url:
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
    "https://nendhi.vercel.app",
  name: "RAHN.",
  fullName: "Rahman Nendhiarto",
  title: "Data Scientist & Software Developer",
  email: "rahmanarto634@gmail.com",
  locale: "en_US",
  twitterHandle: undefined as string | undefined,
  ogImagePath: "/images/profile.png",
} as const;

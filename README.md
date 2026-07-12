# Portofolio Website

Website portofolio pribadi dibangun dengan **Next.js 16**, **React 19**, **TypeScript**, dan **Tailwind CSS v4**.

## Fitur

- Desain modern dengan dark theme
- Responsif (mobile, tablet, desktop)
- Navigasi smooth scroll
- Section: Hero, Tentang, Keahlian, Proyek, Kontak
- Data terpusat — mudah dikustomisasi
- SEO-ready dengan metadata Open Graph

## Memulai

```bash
# Install dependencies
npm install

# Jalankan development server
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

## Kustomisasi

Edit file `src/data/portfolio.ts` untuk mengubah:

- Nama, judul, dan tagline
- Email dan link sosial media
- Teks tentang saya
- Daftar keahlian
- Daftar proyek

## Struktur Proyek

```
src/
├── app/
│   ├── layout.tsx      # Layout utama & metadata
│   ├── page.tsx        # Halaman utama
│   └── globals.css     # Global styles
├── components/
│   ├── Navbar.tsx
│   ├── Hero.tsx
│   ├── About.tsx
│   ├── Skills.tsx
│   ├── Projects.tsx
│   ├── Contact.tsx
│   ├── Footer.tsx
│   └── SectionHeading.tsx
├── data/
│   └── portfolio.ts    # Data portofolio (edit di sini)
└── lib/
    └── utils.ts
```

## Deploy

Deploy ke [Vercel](https://vercel.com) dengan satu klik:

```bash
npm run build
```

## Scripts

| Command       | Deskripsi              |
|---------------|------------------------|
| `npm run dev` | Development server     |
| `npm run build` | Build production     |
| `npm run start` | Jalankan production |
| `npm run lint` | Lint kode             |

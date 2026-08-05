# Sattar Memon — Portfolio (Next.js)

Devux.in ke multi-page structure se inspired, lekin unique design tokens
(colors, type, signature "Figma-frame" motif) aur Sattar ka apna data ke
saath banaya gaya hai.

## Chalane ke liye

```bash
npm install
npm run dev
```
Browser me `http://localhost:3000` khol lo.

Production build:
```bash
npm run build
npm start
```

## Pages

- `/` — Hero, Work preview (6 projects), Capabilities, Journey (experience),
  About, Contact (footer)
- `/work` — Saare projects ki full listing
- `/work/[slug]` — Har project ka alag case-study page (jaise Devux me hota hai)

## Apna data / images add karna

1. **Project images**: `src/data/projects.ts` file kholo, har project me
   `coverImage: ""` field hai — usme apni image ka path daal do, jaise
   `coverImage: "/projects/hms-cover.jpg"`. Image `public/projects/` folder
   me daal dena.
2. **Live links / Figma links**: same file me `liveLink` aur `figmaLink`
   fields empty hain jaha jaha available nahi hai — fill kar dena jab live
   ho jaye.
3. **Profile photo**: `src/app/page.tsx` me hero section aur about section
   me "photo goes here" placeholder hai — wahan `<img>` tag daal dena apni
   photo ke saath (photo ko `public/` folder me daal kar).
4. **CV / Resume link**: Header me "Let's talk" button hai; agar resume PDF
   link chahiye to Header.tsx me easily add ho sakta hai.

## Customize karna

- Colors: `src/app/globals.css` ke top me `:root` variables (`--accent`,
  `--gold`, `--bg` etc.)
- Fonts: `src/app/layout.tsx` — Fraunces (headings), Inter (body),
  IBM Plex Mono (labels/tags)
- Content: sab text `src/app/page.tsx`, `src/data/projects.ts`,
  `src/components/Footer.tsx` me easily editable hai — koi CMS nahi, seedha
  plain data.

Deploy Vercel/Netlify pe ek click me ho jayega (jaise tera pehla portfolio
Netlify pe tha).

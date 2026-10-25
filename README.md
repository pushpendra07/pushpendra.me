# pushpendra.me

Portfolio site for Pushpendra Singh — React + Vite.

## Develop

```sh
npm install
npm run dev
```

Content lives in `src/data/profile.js`; the resume PDF and portrait go in `public/`.

## Deploy

- **CI:** GitHub Actions (`.github/workflows/ci.yml`) builds every push and pull request.
- **CD:** Cloudflare Pages is connected to this repo. Pushes to `main` deploy to https://pushpendra.me; pull requests get preview URLs.
  - Build command: `npm run build`
  - Output directory: `dist`

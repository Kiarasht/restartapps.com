# Restart Apps Website

Astro site for [restartapps.com](https://restartapps.com), hosted with GitHub Pages.

## Local Development

```sh
npm install
npm run dev
```

## Build

```sh
npm run build
```

## Deploy

Push to `main`. GitHub Actions builds the Astro site and deploys it to GitHub Pages.

In GitHub repository settings, set:

- Pages source: GitHub Actions
- Custom domain: `restartapps.com`
- Enforce HTTPS after GitHub issues the certificate

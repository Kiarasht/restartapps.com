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

## Download Counts

The `Update app download counts` workflow runs every Monday and can also be run manually from the
Actions tab. It reads Google Play's public download minimums, adds App Store initial-download units
when App Store Connect is configured, updates `src/data/download-counts.json`, and commits only when
a source count changes.

Google Play needs no credentials. To include iOS downloads, create an App Store Connect team API key
with report access and add these repository Actions secrets:

- `APPLE_ISSUER_ID`: issuer ID shown in Users and Access > Integrations
- `APPLE_KEY_ID`: key ID for the team API key
- `APPLE_PRIVATE_KEY`: the complete contents of the downloaded `.p8` file
- `APPLE_VENDOR_NUMBER`: vendor number shown in App Store Connect payments/reporting pages

The Apple app IDs and report start years are in `scripts/downloads.config.json`. The updater counts
initial app downloads and excludes updates and re-downloads. Without all four Apple secrets, the
workflow still updates Google Play and preserves the last known iOS totals.

Run the updater locally with:

```sh
npm run update-downloads
```

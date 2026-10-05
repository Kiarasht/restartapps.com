import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { sign } from 'node:crypto';
import { gunzipSync } from 'node:zlib';

const projectRoot = resolve(import.meta.dirname, '..');
const configPath = resolve(projectRoot, 'scripts/downloads.config.json');
const countsPath = resolve(projectRoot, 'src/data/download-counts.json');
const appleDownloadTypes = new Set(['1', '1E', '1EP', '1EU', '1F', '1T']);

const pad = (value) => String(value).padStart(2, '0');
const dateKey = (date) =>
  `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`;

export function parseCompactCount(value) {
  const normalized = value.trim().toUpperCase().replaceAll(',', '').replace('+', '');
  const match = normalized.match(/^(\d+(?:\.\d+)?)([KMB])?$/);

  if (!match) {
    throw new Error(`Unsupported download count: ${value}`);
  }

  const multipliers = { K: 1_000, M: 1_000_000, B: 1_000_000_000 };
  return Math.floor(Number.parseFloat(match[1]) * (multipliers[match[2]] ?? 1));
}

export function parseGooglePlayDownloads(html) {
  const match = html.match(/>([\d,.]+(?:[KMB])?\+?)<\/div><div[^>]*>Downloads<\/div>/i);

  if (!match) {
    throw new Error('Google Play download count was not found in the store page');
  }

  return parseCompactCount(match[1]);
}

export function formatDownloadCount(value) {
  if (value >= 1_000_000) {
    return `${Math.floor(value / 100_000) / 10}M+`;
  }

  if (value >= 100_000) {
    return `${Math.floor(value / 1_000)}K+`;
  }

  if (value >= 1_000) {
    return `${Math.floor(value / 100) / 10}K+`;
  }

  return `${value}+`;
}

export function parseAppleSalesReport(report, appleIds) {
  const totals = Object.fromEntries(appleIds.map((appleId) => [appleId, 0]));
  const lines = report.trimEnd().split(/\r?\n/);

  if (lines.length < 2) return totals;

  const headers = lines[0].replace(/^\uFEFF/, '').split('\t');
  const appleIdIndex = headers.indexOf('Apple Identifier');
  const productTypeIndex = headers.indexOf('Product Type Identifier');
  const unitsIndex = headers.indexOf('Units');

  if ([appleIdIndex, productTypeIndex, unitsIndex].some((index) => index === -1)) {
    throw new Error('Apple sales report is missing an expected column');
  }

  for (const line of lines.slice(1)) {
    if (!line) continue;

    const columns = line.split('\t');
    const appleId = columns[appleIdIndex];
    const productType = columns[productTypeIndex];

    if (!(appleId in totals) || !appleDownloadTypes.has(productType)) continue;

    const units = Number.parseFloat(columns[unitsIndex]);
    if (Number.isFinite(units)) totals[appleId] += units;
  }

  return totals;
}

async function fetchGooglePlayMinimum(packageName) {
  const url = new URL('https://play.google.com/store/apps/details');
  url.searchParams.set('id', packageName);
  url.searchParams.set('hl', 'en_US');
  url.searchParams.set('gl', 'US');

  const response = await fetch(url, {
    headers: {
      'user-agent':
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/140 Safari/537.36'
    }
  });

  if (!response.ok) {
    throw new Error(`Google Play returned HTTP ${response.status} for ${packageName}`);
  }

  return parseGooglePlayDownloads(await response.text());
}

function readAppleCredentials() {
  const names = [
    'APPLE_ISSUER_ID',
    'APPLE_KEY_ID',
    'APPLE_PRIVATE_KEY',
    'APPLE_VENDOR_NUMBER'
  ];
  const supplied = names.filter((name) => process.env[name]);

  if (supplied.length === 0) return null;

  if (supplied.length !== names.length) {
    const missing = names.filter((name) => !process.env[name]);
    throw new Error(`Incomplete App Store Connect configuration. Missing: ${missing.join(', ')}`);
  }

  return {
    issuerId: process.env.APPLE_ISSUER_ID,
    keyId: process.env.APPLE_KEY_ID,
    privateKey: process.env.APPLE_PRIVATE_KEY.replaceAll('\\n', '\n'),
    vendorNumber: process.env.APPLE_VENDOR_NUMBER
  };
}

function createAppleToken(credentials) {
  const now = Math.floor(Date.now() / 1_000);
  const header = Buffer.from(
    JSON.stringify({ alg: 'ES256', kid: credentials.keyId, typ: 'JWT' })
  ).toString('base64url');
  const payload = Buffer.from(
    JSON.stringify({ iss: credentials.issuerId, iat: now, exp: now + 1_200, aud: 'appstoreconnect-v1' })
  ).toString('base64url');
  const unsignedToken = `${header}.${payload}`;
  const signature = sign('sha256', Buffer.from(unsignedToken), {
    key: credentials.privateKey,
    dsaEncoding: 'ieee-p1363'
  }).toString('base64url');

  return `${unsignedToken}.${signature}`;
}

const wait = (milliseconds) => new Promise((resolveWait) => setTimeout(resolveWait, milliseconds));

async function fetchAppleReport(credentials, token, frequency, reportDate) {
  const url = new URL('https://api.appstoreconnect.apple.com/v1/salesReports');
  url.searchParams.set('filter[frequency]', frequency);
  url.searchParams.set('filter[reportDate]', reportDate);
  url.searchParams.set('filter[reportSubType]', 'SUMMARY');
  url.searchParams.set('filter[reportType]', 'SALES');
  url.searchParams.set('filter[vendorNumber]', credentials.vendorNumber);
  url.searchParams.set('filter[version]', '1_0');

  for (let attempt = 0; attempt < 4; attempt += 1) {
    const response = await fetch(url, {
      headers: {
        authorization: `Bearer ${token}`,
        accept: 'application/a-gzip, application/gzip, text/plain'
      }
    });

    if (response.status === 404) return null;

    if (response.ok) {
      const body = Buffer.from(await response.arrayBuffer());
      return body[0] === 0x1f && body[1] === 0x8b ? gunzipSync(body).toString('utf8') : body.toString('utf8');
    }

    if ((response.status === 429 || response.status >= 500) && attempt < 3) {
      await wait(2 ** attempt * 1_000);
      continue;
    }

    const detail = (await response.text()).slice(0, 300);
    throw new Error(
      `App Store Connect returned HTTP ${response.status} for ${frequency} ${reportDate}: ${detail}`
    );
  }

  return null;
}

function mergeAppleTotals(target, source) {
  for (const [appleId, units] of Object.entries(source)) {
    target[appleId] = (target[appleId] ?? 0) + units;
  }
}

function daysInMonth(year, month) {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

async function addDailyAppleReports({ credentials, token, appleIds, totals, year, month, lastDay }) {
  for (let day = 1; day <= lastDay; day += 1) {
    const reportDate = `${year}-${pad(month)}-${pad(day)}`;
    const report = await fetchAppleReport(credentials, token, 'DAILY', reportDate);
    if (report) mergeAppleTotals(totals, parseAppleSalesReport(report, appleIds));
  }
}

async function fetchAppleDownloadTotals(configApps, credentials) {
  const appleApps = configApps.filter((app) => app.appleId);
  const appleIds = appleApps.map((app) => app.appleId);
  const totals = Object.fromEntries(appleIds.map((appleId) => [appleId, 0]));

  if (appleIds.length === 0) return totals;

  const token = createAppleToken(credentials);
  const now = new Date();
  const cutoff = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1_000);
  const currentYear = now.getUTCFullYear();
  const currentMonth = now.getUTCMonth() + 1;
  const earliestYear = Math.min(...appleApps.map((app) => app.appleReportStartYear));

  for (let year = earliestYear; year < currentYear; year += 1) {
    const report = await fetchAppleReport(credentials, token, 'YEARLY', String(year));

    if (report) {
      mergeAppleTotals(totals, parseAppleSalesReport(report, appleIds));
      continue;
    }

    if (year === currentYear - 1 && currentMonth === 1) {
      for (let month = 1; month <= 12; month += 1) {
        const monthlyReport = await fetchAppleReport(
          credentials,
          token,
          'MONTHLY',
          `${year}-${pad(month)}`
        );
        if (monthlyReport) {
          mergeAppleTotals(totals, parseAppleSalesReport(monthlyReport, appleIds));
        }
      }
    }
  }

  for (let month = 1; month < currentMonth; month += 1) {
    const report = await fetchAppleReport(
      credentials,
      token,
      'MONTHLY',
      `${currentYear}-${pad(month)}`
    );

    if (report) {
      mergeAppleTotals(totals, parseAppleSalesReport(report, appleIds));
      continue;
    }

    if (month === currentMonth - 1) {
      await addDailyAppleReports({
        credentials,
        token,
        appleIds,
        totals,
        year: currentYear,
        month,
        lastDay: daysInMonth(currentYear, month)
      });
    }
  }

  if (cutoff.getUTCFullYear() === currentYear && cutoff.getUTCMonth() + 1 === currentMonth) {
    await addDailyAppleReports({
      credentials,
      token,
      appleIds,
      totals,
      year: currentYear,
      month: currentMonth,
      lastDay: cutoff.getUTCDate()
    });
  }

  return Object.fromEntries(
    Object.entries(totals).map(([appleId, units]) => [appleId, Math.max(0, Math.floor(units))])
  );
}

async function main() {
  const config = JSON.parse(await readFile(configPath, 'utf8'));
  const previousCounts = JSON.parse(await readFile(countsPath, 'utf8'));
  const credentials = readAppleCredentials();
  const appleTotals = credentials ? await fetchAppleDownloadTotals(config.apps, credentials) : null;
  const checkedAt = dateKey(new Date());
  const nextCounts = {};

  for (const app of config.apps) {
    const previous = previousCounts[app.slug] ?? {};
    const fetchedGoogleMinimum = await fetchGooglePlayMinimum(app.googlePlayPackage);
    const googlePlayMinimum = Math.max(previous.googlePlayMinimum ?? 0, fetchedGoogleMinimum);
    const appStoreDownloads = app.appleId
      ? (appleTotals?.[app.appleId] ?? previous.appStoreDownloads ?? null)
      : null;
    const combinedMinimum = googlePlayMinimum + (appStoreDownloads ?? 0);
    const changed =
      googlePlayMinimum !== previous.googlePlayMinimum ||
      appStoreDownloads !== previous.appStoreDownloads;

    nextCounts[app.slug] = {
      googlePlayMinimum,
      appStoreDownloads,
      combinedMinimum,
      display: formatDownloadCount(combinedMinimum),
      updatedAt: changed ? checkedAt : (previous.updatedAt ?? checkedAt)
    };

    const appleSummary = appStoreDownloads === null ? 'not configured' : appStoreDownloads;
    console.log(
      `${app.slug}: Google Play ${googlePlayMinimum}, App Store ${appleSummary}, combined ${nextCounts[app.slug].display}`
    );
  }

  await writeFile(countsPath, `${JSON.stringify(nextCounts, null, 2)}\n`);
}

const entryPoint = process.argv[1] ? pathToFileURL(resolve(process.argv[1])).href : null;
if (entryPoint === import.meta.url) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}

import test from 'node:test';
import assert from 'node:assert/strict';

import {
  formatDownloadCount,
  parseAppleSalesReport,
  parseCompactCount,
  parseGooglePlayDownloads
} from './update-downloads.mjs';

test('parses compact store counts', () => {
  assert.equal(parseCompactCount('1K+'), 1_000);
  assert.equal(parseCompactCount('1.5M+'), 1_500_000);
  assert.equal(parseCompactCount('12,345'), 12_345);
});

test('extracts the download count from a Google Play page fragment', () => {
  const html = '<div class="ClM7O">5K+</div><div class="g1rdde">Downloads</div>';
  assert.equal(parseGooglePlayDownloads(html), 5_000);
});

test('formats a conservative combined download total', () => {
  assert.equal(formatDownloadCount(999), '999+');
  assert.equal(formatDownloadCount(1_387), '1.3K+');
  assert.equal(formatDownloadCount(15_999), '15.9K+');
  assert.equal(formatDownloadCount(1_250_000), '1.2M+');
});

test('counts initial Apple downloads and excludes updates and re-downloads', () => {
  const report = [
    'Title\tProduct Type Identifier\tUnits\tApple Identifier',
    'App One\t1F\t25\t123',
    'App One\t3F\t4\t123',
    'App One\t7F\t100\t123',
    'App Two\t1\t7\t456'
  ].join('\n');

  assert.deepEqual(parseAppleSalesReport(report, ['123', '456']), { 123: 25, 456: 7 });
});

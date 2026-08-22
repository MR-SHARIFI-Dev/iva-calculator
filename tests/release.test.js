import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const VERSION = '3.3.1';

test('HTML loads only versioned current assets and displays the build version', async () => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  assert.match(html, new RegExp(`app\\.js\\?v=${VERSION.replaceAll('.', '\\.')}`));
  assert.match(html, new RegExp(`style\\.css\\?v=${VERSION.replaceAll('.', '\\.')}`));
  assert.match(html, new RegExp(`Calculator Pro · v${VERSION.replaceAll('.', '\\.')}`));
});

test('service worker has an explicit non-stale upgrade path', async () => {
  const worker = await readFile(new URL('../sw.js', import.meta.url), 'utf8');
  assert.match(worker, new RegExp(`const VERSION = '${VERSION.replaceAll('.', '\\.')}'`));
  assert.match(worker, /self\.skipWaiting\(\)/);
  assert.match(worker, /await self\.clients\.claim\(\)/);
  assert.match(worker, /caches\.delete/);
  assert.match(worker, /client\.navigate/);
  assert.match(worker, /fetch\(event\.request\)/); // network-first
});

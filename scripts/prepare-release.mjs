/* global process, console, URL */
import { createHash } from 'node:crypto';
import { createReadStream } from 'node:fs';
import { mkdir, readFile, writeFile, stat } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const args = Object.fromEntries(
  process.argv.slice(2).map((arg) => {
    const index = arg.indexOf('=');
    return [arg.slice(0, index), arg.slice(index + 1)];
  }),
);
if (
  !args['--file'] ||
  !args['--url'] ||
  !/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.test(args['--version'] ?? '')
)
  throw new Error(
    '用法：node scripts/prepare-release.mjs --file=/绝对路径/Lightwise.dmg --url=https://github.com/owner/repo/releases/download/v版本/安装包.dmg --version=0.1.0；更新文案请直接编辑 CHANGELOG.md。',
  );
if (args['--notes'] !== undefined) throw new Error('请直接编辑 CHANGELOG.md，不再使用 --notes。');
const url = new URL(args['--url']);
if (url.protocol !== 'https:' || url.username || url.password || url.hash)
  throw new Error('下载地址必须是无凭据的 HTTPS 地址。');
const file = resolve(args['--file']);
const info = await stat(file);
if (!info.isFile() || info.size <= 0 || info.size > 2 * 1024 ** 3)
  throw new Error('安装包大小无效。');
const hash = createHash('sha256');
for await (const chunk of createReadStream(file)) hash.update(chunk);
const manifest = {
  schemaVersion: 1,
  appId: 'com.lightwise.desktop',
  platform: 'darwin',
  arch: 'arm64',
  version: args['--version'],
  downloadUrl: url.href,
  sha256: hash.digest('hex'),
  bytes: info.size,
};
const root = fileURLToPath(new URL('../', import.meta.url));
const currentRelease = JSON.parse(await readFile(resolve(root, 'release.json'), 'utf8'));
await mkdir(resolve(root, 'updates'), { recursive: true });
// 仅生成本地发布资料；上传资产和更新线上清单仍需单独授权。
await writeFile(resolve(root, 'updates/latest.json'), JSON.stringify(manifest, null, 2) + '\n');
await writeFile(
  resolve(root, 'release.json'),
  JSON.stringify(
    {
      version: manifest.version,
      published: true,
      manifestUrl: './updates/latest.json',
      historyUrl: currentRelease.historyUrl ?? null,
    },
    null,
    2,
  ) + '\n',
);
console.log('已生成本地版本清单。请先上传并核验安装包，再发布网站。');

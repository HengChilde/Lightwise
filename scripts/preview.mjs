/* global process, console, URL */
import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { readFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { extname, resolve, relative, isAbsolute } from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const port = Number(process.argv.find((v) => v.startsWith('--port='))?.split('=')[1] ?? 4173);
const packageArg = process.argv.find((v) => v.startsWith('--package='))?.slice('--package='.length);
const localPackage = packageArg ? resolve(packageArg) : null;
if (localPackage && !(await stat(localPackage)).isFile())
  throw new Error('指定的本地安装包不存在。');
const release = JSON.parse(await readFile(resolve(root, 'release.json'), 'utf8'));
const mime = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
  '.json': 'application/json',
  '.md': 'text/markdown; charset=utf-8',
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
};
// 只绑定本机，唯一下载入口只提供启动时明确指定的 DMG，不暴露任意磁盘路径。
const server = createServer(async (request, response) => {
  if (!['GET', 'HEAD'].includes(request.method)) {
    response.writeHead(405).end();
    return;
  }
  try {
    const pathname = decodeURIComponent(new URL(request.url, `http://127.0.0.1:${port}`).pathname);
    if (pathname === '/release.json' && localPackage) {
      response.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
      response.end(
        request.method === 'HEAD'
          ? undefined
          : JSON.stringify({
              ...release,
              manifestUrl: null,
              published: true,
              localPreview: true,
              downloadUrl: '/download/Lightwise.dmg',
            }),
      );
      return;
    }
    const download = pathname === '/download/Lightwise.dmg' && localPackage;
    const filename = download
      ? localPackage
      : resolve(root, `.${pathname === '/' ? '/index.html' : pathname}`);
    const nested = relative(root, filename);
    if (!download && (nested.startsWith('..') || isAbsolute(nested))) {
      response.writeHead(403).end();
      return;
    }
    const info = await stat(filename);
    if (!info.isFile()) {
      response.writeHead(404).end();
      return;
    }
    response.writeHead(200, {
      'Content-Type': download
        ? 'application/x-apple-diskimage'
        : (mime[extname(filename)] ?? 'application/octet-stream'),
      'Content-Length': info.size,
      ...(download
        ? { 'Content-Disposition': `attachment; filename="Lightwise-${release.version}-arm64.dmg"` }
        : {}),
    });
    if (request.method === 'HEAD') response.end();
    else
      createReadStream(filename)
        .on('error', () => response.destroy())
        .pipe(response);
  } catch {
    response.writeHead(404).end('Not found');
  }
});
server.listen(port, '127.0.0.1', () => console.log(`Lightwise website: http://127.0.0.1:${port}`));

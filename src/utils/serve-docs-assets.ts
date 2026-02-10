import { readFile, stat } from 'node:fs/promises';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { isAbsolute, relative, resolve } from 'node:path';
import { getMimeType, isSupportedStaticAsset } from './static-assets.js';

export function createStaticAssetMiddleware(
  staticDir: string,
): (req: IncomingMessage, res: ServerResponse, next: () => void) => void {
  const normalizedDir = resolve(staticDir);

  return async (req, res, next) => {
    const url = req.url;
    if (!url) return next();

    let pathname: string;
    try {
      pathname = decodeURIComponent(new URL(url, 'http://localhost').pathname);
    } catch {
      return next();
    }

    const relativePath = pathname.startsWith('/')
      ? pathname.slice(1)
      : pathname;
    if (!relativePath) return next();
    if (!isSupportedStaticAsset(relativePath)) return next();

    const filePath = resolve(normalizedDir, relativePath);
    const relativeToRoot = relative(normalizedDir, filePath);
    if (relativeToRoot.startsWith('..') || isAbsolute(relativeToRoot))
      return next();

    try {
      const stats = await stat(filePath);
      if (!stats.isFile()) return next();

      const content = await readFile(filePath);
      const mimeType = getMimeType(pathname);
      if (mimeType) {
        res.setHeader('Content-Type', mimeType);
      }
      res.end(content);
    } catch {
      next();
    }
  };
}

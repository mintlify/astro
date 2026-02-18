import { readFile } from 'node:fs/promises';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { isAbsolute, relative, resolve } from 'node:path';

export function createRawMdMiddleware(
  docsDir: string,
): (req: IncomingMessage, res: ServerResponse, next: () => void) => void {
  const normalizedDocsDir = resolve(docsDir);

  return async (req, res, next) => {
    const url = req.url;
    if (!url) return next();

    let pathname: string;
    try {
      pathname = decodeURIComponent(new URL(url, 'http://localhost').pathname);
    } catch {
      return next();
    }

    if (!pathname.endsWith('.md')) return next();

    const stripped = pathname.startsWith('/') ? pathname.slice(1) : pathname;
    const rawSlug = stripped.slice(0, -'.md'.length);
    const slug = rawSlug === '' ? 'index' : rawSlug;

    const mdxPath = resolve(normalizedDocsDir, `${slug}.mdx`);
    const relativeCheck = relative(normalizedDocsDir, mdxPath);
    if (relativeCheck.startsWith('..') || isAbsolute(relativeCheck)) {
      return next();
    }

    const mdPath = resolve(normalizedDocsDir, `${slug}.md`);

    try {
      let content: Buffer;
      try {
        content = await readFile(mdxPath);
      } catch {
        content = await readFile(mdPath);
      }
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.end(content);
    } catch {
      next();
    }
  };
}

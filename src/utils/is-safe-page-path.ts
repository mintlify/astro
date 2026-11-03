import { posix } from 'node:path';

export function isSafePagePath(pagePath: string): boolean {
  const normalized = posix.normalize(
    pagePath.replaceAll('\\', '/').replace(/^\/+/, ''),
  );
  return normalized !== '..' && !normalized.startsWith('../');
}

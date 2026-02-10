import { posix } from 'node:path';

const SUPPORTED_STATIC_ASSETS: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.css': 'text/css',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.md': 'text/plain',
};

export function isSupportedStaticAsset(pathname: string): boolean {
  const extension = posix.extname(pathname).toLowerCase();
  return extension in SUPPORTED_STATIC_ASSETS;
}

export function getMimeType(pathname: string): string | undefined {
  const extension = posix.extname(pathname).toLowerCase();
  return SUPPORTED_STATIC_ASSETS[extension];
}

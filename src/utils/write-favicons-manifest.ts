import { join } from 'node:path';
import { mkdir, writeFile } from 'node:fs/promises';
import type { Favicons } from '../types';

export async function writeFaviconsManifest(
  rootDir: string,
  favicons: Favicons,
): Promise<void> {
  const generatedDir = join(rootDir, '.mintlify', 'generated');
  await mkdir(generatedDir, { recursive: true });

  const filePath = join(generatedDir, 'favicons.json');
  await writeFile(filePath, JSON.stringify(favicons, null, 2));
}

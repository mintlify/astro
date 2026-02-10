import { cp, mkdir, readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';
import { isSupportedStaticAsset } from './static-assets.js';

async function isDirectory(path: string): Promise<boolean> {
  try {
    const stats = await stat(path);
    return stats.isDirectory();
  } catch {
    return false;
  }
}

export async function copyAssets(
  docsDir: string,
  outputDir: string,
): Promise<number> {
  if (!(await isDirectory(docsDir))) return 0;

  let count = 0;

  const copyDirectory = async (sourceDir: string, targetDir: string) => {
    const entries = await readdir(sourceDir, { withFileTypes: true });

    const files = entries.filter(
      (e) => e.isFile() && isSupportedStaticAsset(e.name),
    );
    const subdirs = entries.filter((e) => e.isDirectory());

    if (files.length > 0) {
      await mkdir(targetDir, { recursive: true });
      await Promise.all(
        files.map((entry) =>
          cp(join(sourceDir, entry.name), join(targetDir, entry.name)),
        ),
      );
      count += files.length;
    }

    await Promise.all(
      subdirs.map((entry) =>
        copyDirectory(join(sourceDir, entry.name), join(targetDir, entry.name)),
      ),
    );
  };

  await copyDirectory(docsDir, outputDir);
  return count;
}

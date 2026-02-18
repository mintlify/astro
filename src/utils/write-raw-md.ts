import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

export async function writeRawMd(
  pagePaths: string[],
  docsDir: string,
  outputDir: string,
): Promise<void> {
  await Promise.all(
    pagePaths.map(async (pagePath) => {
      let content: Buffer;
      try {
        content = await readFile(join(docsDir, `${pagePath}.mdx`));
      } catch {
        try {
          content = await readFile(join(docsDir, `${pagePath}.md`));
        } catch {
          return;
        }
      }

      let filePath: string;
      if (pagePath === 'index') {
        filePath = join(outputDir, 'index.md');
      } else {
        const parts = pagePath.split('/');
        const fileName = parts.pop() + '.md';
        const dirPath = join(outputDir, ...parts);
        if (parts.length > 0) {
          await mkdir(dirPath, { recursive: true });
        }
        filePath = join(dirPath, fileName);
      }

      await writeFile(filePath, content);
    }),
  );
}

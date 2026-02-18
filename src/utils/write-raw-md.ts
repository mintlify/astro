import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';

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

      const outputFilePath = pagePath.startsWith('index')
        ? pagePath.replace(/^index/, '') + '.md'
        : `${pagePath}.md`;
      const outputPath = join(outputDir, outputFilePath);
      await mkdir(dirname(outputPath), { recursive: true });
      await writeFile(outputPath, content);
    }),
  );
}

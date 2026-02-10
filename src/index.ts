import type { AstroIntegration } from 'astro';
import { cp } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { getAllPathsInDocsNav } from '@mintlify/common';
import { clearContentDirectory } from './utils/clear-content-directory.js';
import { copyAssets } from './utils/copy-assets.js';
import { findUserComponents } from './utils/find-user-components.js';
import { loadAllSnippets } from './utils/load-all-snippets.js';
import { initLogger } from './utils/logger.js';
import { readDocsConfig } from './utils/read-docs-config.js';
import { readPageContent } from './utils/read-page-content.js';
import { createStaticAssetMiddleware } from './utils/serve-docs-assets.js';
import { writePageContent } from './utils/write-page-content.js';
import { writeRawMd } from './utils/write-raw-md.js';

export type { DocsConfig, NavigationConfig } from './types.js';
export { readDocsConfig } from './utils/read-docs-config.js';

export interface MintlifyOptions {
  docsDir?: string;
}

export function mintlify(options?: MintlifyOptions): AstroIntegration {
  let docsDir: string;
  let staticDir: string;

  return {
    name: '@mintlify/astro',
    hooks: {
      'astro:config:setup': async ({ config: astroConfig, logger }) => {
        initLogger(logger);

        const rootDir = fileURLToPath(astroConfig.root);
        const contentDir = join(rootDir, '.mintlify', 'docs');
        const componentsDir = join(rootDir, '.mintlify', 'components');
        staticDir = join(rootDir, '.mintlify', 'static');

        docsDir = resolve(rootDir, options?.docsDir ?? './docs');

        await Promise.all([
          clearContentDirectory(contentDir),
          clearContentDirectory(componentsDir),
          clearContentDirectory(staticDir),
        ]);

        const assetCount = await copyAssets(docsDir, staticDir);
        logger.info(`Copied ${assetCount} static assets`);

        const snippets = await loadAllSnippets(docsDir);
        logger.info(`Loaded ${snippets.length} snippet files`);

        const userComponents = await findUserComponents(docsDir);

        const docsConfig = await readDocsConfig(docsDir);
        const pagePaths = getAllPathsInDocsNav(docsConfig.navigation);

        logger.info(`Found ${pagePaths.length} pages to sync`);

        await Promise.all([
          writeRawMd(pagePaths, docsDir, staticDir),

          ...pagePaths.map(async (pagePath) => {
            try {
              const { content, slug } = await readPageContent(
                pagePath,
                docsDir,
              );
              await writePageContent({
                content,
                slug,
                contentDir,
                componentsDir,
                userComponents,
                snippets,
              });
            } catch (error) {
              logger.warn(`Failed to read content for ${pagePath}: ${error}`);
            }
          }),
        ]);

        logger.info(`Synced ${pagePaths.length} pages`);
      },

      'astro:server:setup': ({ server }) => {
        server.middlewares.use(createStaticAssetMiddleware(staticDir));
      },

      'astro:build:done': async ({ dir }) => {
        const outputDir = fileURLToPath(dir);
        await cp(staticDir, outputDir, { recursive: true });
      },
    },
  };
}

# @mintlify/astro

Mintlify integration for Astro. This package syncs Mintlify-style docs content into Astro content collections and provides MDX components for rendering docs pages.

## Install

```bash
npm install @mintlify/components
```

## Usage

### 1) Configure Astro integration

```ts
// astro.config.mjs
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import { mintlify } from '@mintlify/astro';

export default defineConfig({
  integrations: [mintlify({ docsDir: './docs' }), react(), mdx()],
});
```

### 2) Use MDX components in docs page

```astro
---
import { render } from 'astro:content';
import { components } from '@mintlify/astro/components';
---
<Content components={components} />
```

## Expected docs structure

- `./docs/docs.json`
- `./docs/**/*.mdx`
- `./docs/snippets/*` (optional)
- supported static assets anywhere in `./docs/**` (`.png`, `.jpg`, `.jpeg`, `.gif`, `.webp`, `.svg`, `.ico`, `.mp4`, `.webm`, `.mp3`, `.wav`, `.css`, `.woff`, `.woff2`, `.ttf`, `.eot`)

At build setup time, the integration generates:

- `.mintlify/docs/**/*` (synced page content)
- `.mintlify/components/**/*` (extracted React components)
- `.mintlify/static/**/*` (static assets from docs)
- `.mintlify/generated/favicons.json` (when favicon is configured)

These directories are generated build artifacts and should not be edited manually.

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
- assets like `./docs/images`, `./docs/logo`, `./docs/favicon.*` (optional)

At build setup time, the integration generates:

- `src/content/docs/**/*`
- `src/content/components/**/*`
- `src/content/generated/favicons.json` (when favicon is configured)


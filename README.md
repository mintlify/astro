# @mintlify/astro

Mintlify integration for [Astro](https://astro.build). Syncs Mintlify-style docs content into Astro content collections and provides MDX components for rendering docs pages.

## Install

```bash
npm install @mintlify/astro
```

Peer dependencies: `astro`, `@astrojs/react`, `@astrojs/mdx`, `@mintlify/components`, and `react`.

## Usage

### 1. Configure the Astro integration

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

### 2. Use MDX components in a docs page

```astro
---
import { render } from 'astro:content';
import { components } from '@mintlify/astro/components';
---

<Content components={components} />
```

## Expected docs structure

- `./docs/docs.json` — navigation and site configuration
- `./docs/**/*.mdx` — page content
- `./docs/snippets/*` — reusable content snippets (optional)
- Static assets anywhere in `./docs/**` (`.png`, `.jpg`, `.jpeg`, `.gif`, `.webp`, `.svg`, `.ico`, `.mp4`, `.webm`, `.mp3`, `.wav`, `.css`, `.woff`, `.woff2`, `.ttf`, `.eot`)

At build setup time, the integration generates files under `.mintlify/`:

| Directory | Contents |
|-----------|----------|
| `.mintlify/docs/` | Synced page content |
| `.mintlify/components/` | Extracted React components |
| `.mintlify/static/` | Static assets from docs |

These are generated build artifacts and should not be edited manually.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) and [DEVELOPMENT.md](./DEVELOPMENT.md).

## License

[MIT](./LICENSE)

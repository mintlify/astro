# Development Guide

This guide covers how to set up and work on `@mintlify/astro` locally.

## Prerequisites

- [Node.js](https://nodejs.org/) >= 18.0.0
- [npm](https://www.npmjs.com/)

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/mintlify/astro.git
cd astro
```

2. Install dependencies:

```bash
npm install
```

## Development Workflow

### Building

Build the package:

```bash
npm run build
```

This runs the TypeScript compiler to produce output in `dist/`.

### Type Checking

Run type checks without emitting files:

```bash
npm run type
```

### Formatting

Format all files with Prettier:

```bash
npm run format
```

## Project Structure

```
src/
├── index.ts              # Astro integration entry point
├── components.ts         # MDX component exports
├── helpers.ts            # Navigation and page data helpers
├── types.ts              # Shared type definitions
└── utils/
    ├── clear-content-directory.ts
    ├── copy-assets.ts
    ├── extract-react-components.ts
    ├── find-user-components.ts
    ├── load-all-snippets.ts
    ├── logger.ts
    ├── mintlify-components.tsx
    ├── read-docs-config.ts
    ├── read-page-content.ts
    ├── resolve-snippets.ts
    ├── serve-docs-assets.ts
    ├── static-assets.ts
    ├── write-page-content.ts
    └── write-raw-md.ts
```

### Key Modules

- **`index.ts`** — The main Astro integration. Hooks into `astro:config:setup` to sync docs content into `.mintlify/` content collections, `astro:server:setup` to serve static assets in dev, and `astro:build:done` to copy assets to the output directory.
- **`components.ts`** — Re-exports the MDX component map from `@mintlify/components` for use in Astro pages.
- **`helpers.ts`** — Navigation helpers for decorating raw navigation config, resolving sidebar entries, tabs, footer pages, and favicons.

## Testing Changes in an Astro Project

To test local changes in a consuming Astro project, you can use [yalc](https://github.com/wclr/yalc):

```bash
# In this repo
npx yalc publish

# In your Astro project
npx yalc add @mintlify/astro
npm install
```

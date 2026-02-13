import { sep } from 'node:path';
import { divisions, type NavigationConfig, type DocsConfig } from '@mintlify/validation';

export interface NavPage {
  href: string;
  title: string;
  icon?: string;
  tag?: string;
  api?: string;
  deprecated?: boolean;
}

export interface NavGroup {
  group: string;
  pages: NavEntry[];
  icon?: string;
  tag?: string;
}

export type NavEntry = NavPage | NavGroup;
export type NavNode = Record<string, unknown>;

export interface TabInfo {
  name: string;
  href: string;
  isActive: boolean;
}

export type Favicons = {
  icons: Array<{
    rel?: string;
    type?: string;
    sizes?: string;
    href?: string;
    media?: string;
  }>;
};

export type AnchorItem = {
  name: string;
  href: string;
  icon?: string;
  color?: string;
};

export function isNavPage(entry: NavEntry): entry is NavPage {
  return 'href' in entry && 'title' in entry;
}

export function isNavGroup(entry: NavEntry): entry is NavGroup {
  return 'group' in entry && 'pages' in entry;
}

function normalizePath(path: string): string {
  let normalized = sep !== '/' ? path.replaceAll(sep, '/') : path;
  if (normalized.length > 1 && normalized.endsWith('/')) {
    normalized = normalized.slice(0, -1);
  }
  return normalized;
}

/**
 * Decorates a raw `NavigationConfig` from docs.json by resolving string page
 * slugs into `{ href, title }` entries using the provided title map.
 */
export function decorateNavigation(
  nav: NavigationConfig,
  titleMap: Record<string, string>,
): NavNode {
  return decorateNavNode(nav as NavNode, titleMap);
}

function decorateNavNode(
  nav: NavNode,
  titleMap: Record<string, string>,
): NavNode {
  const result: NavNode = { ...nav };

  const pages = result.pages;
  if (Array.isArray(pages) && !result.group) {
    result.pages = pages.map((p: unknown) => decorateEntry(p, titleMap));
  }

  const groups = result.groups;
  if (Array.isArray(groups)) {
    result.groups = groups.map((g: unknown) => decorateEntry(g, titleMap));
  }

  for (const key of divisions) {
    const division = result[key];
    if (Array.isArray(division)) {
      result[key] = division.map((item: unknown) =>
        decorateNavNode(item as NavNode, titleMap),
      );
    }
  }

  return result;
}

function decorateEntry(
  entry: unknown,
  titleMap: Record<string, string>,
): NavEntry | NavNode {
  if (typeof entry === 'string') {
    return {
      href: entry === 'index' ? '/' : `/${entry}`,
      title: titleMap[entry] ?? slugToTitle(entry),
    };
  }
  if (typeof entry === 'object' && entry !== null) {
    const node = entry as NavNode;
    const pages = node.pages;
    if (node.group != null && Array.isArray(pages)) {
      return {
        ...node,
        pages: pages.map((page: unknown) => decorateEntry(page, titleMap)),
      };
    }
  }
  return entry as NavNode;
}

function slugToTitle(slug: string): string {
  const last = slug.split('/').pop() ?? slug;
  return last
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Extracts the sidebar navigation entries for the current page's division.
 */
export function unwrapNav(nav: NavNode, currentPath: string): NavEntry[] {
  const groups = nav.groups;
  if (Array.isArray(groups)) return groups as NavEntry[];

  const pages = nav.pages;
  if (Array.isArray(pages) && !nav.group) return pages as NavEntry[];

  for (const key of divisions) {
    const divisionArr = nav[key];
    if (!Array.isArray(divisionArr)) continue;

    for (const division of divisionArr) {
      const entries = unwrapNav(division as NavNode, currentPath);
      if (entries.length > 0 && containsPath(entries, currentPath))
        return entries;
    }

    if (divisionArr.length > 0) {
      return unwrapNav(divisionArr[0] as NavNode, currentPath);
    }
  }

  return [];
}

/**
 * Returns true if the given path is contained within the navigation entries.
 */
export function containsPath(entries: NavEntry[], path: string): boolean {
  const normalized = normalizePath(path);
  return entries.some((entry) =>
    isNavPage(entry)
      ? normalizePath(entry.href) === normalized
      : isNavGroup(entry) && containsPath(entry.pages, normalized),
  );
}

/**
 * Builds tab metadata from the top-level `tabs` division of the navigation.
 */
export function getTabsFromNav(
  nav: NavNode,
  currentPath: string,
): TabInfo[] | null {
  const tabs = nav.tabs;
  if (!Array.isArray(tabs)) return null;

  return tabs.map((tab: unknown) => {
    const tabNode = tab as NavNode;
    const entries = unwrapNav(tabNode, currentPath);
    return {
      name: (tabNode.tab as string) ?? '',
      href: findFirstPage(entries)?.href ?? '/',
      isActive: containsPath(entries, currentPath),
    };
  });
}

function findFirstPage(entries: NavEntry[]): NavPage | undefined {
  for (const entry of entries) {
    if (isNavPage(entry)) return entry;
    if (isNavGroup(entry)) {
      const page = findFirstPage(entry.pages);
      if (page) return page;
    }
  }
  return undefined;
}

/**
 * Returns the previous and next pages relative to the current path,
 * for footer navigation.
 */
export function getFooterPages(entries: NavEntry[], currentPath: string) {
  const normalized = normalizePath(currentPath);
  const pages = flattenPages(entries);
  const idx = pages.findIndex((p) => normalizePath(p.href) === normalized);
  return {
    prev: idx > 0 ? pages[idx - 1] : null,
    next: idx < pages.length - 1 ? pages[idx + 1] : null,
  };
}

function flattenPages(entries: NavEntry[]): NavPage[] {
  return entries.flatMap((x) =>
    isNavGroup(x) ? flattenPages(x.pages) : [x],
  );
}

/**
 * Finds the group label that contains the given path.
 */
export function findGroupForPath(
  entries: NavEntry[],
  path: string,
): string | undefined {
  const normalized = normalizePath(path);
  for (const entry of entries) {
    if (isNavGroup(entry)) {
      for (const page of entry.pages) {
        if (isNavPage(page) && normalizePath(page.href) === normalized) {
          return entry.group;
        }
        if (isNavGroup(page)) {
          const nested = findGroupForPath([page], normalized);
          if (nested) return nested;
        }
      }
    }
  }
  return undefined;
}

/**
 * Resolves the favicon configuration from docs.json into link element data.
 * Handles both string and `{ light, dark }` formats.
 */
export function getFavicons(config: DocsConfig): Favicons | undefined {
  const faviconConfig = config.favicon;
  const faviconHref =
    typeof faviconConfig === 'string'
      ? faviconConfig
      : (faviconConfig?.light ?? faviconConfig?.dark);

  if (!faviconHref) {
    return undefined;
  }

  return {
    icons: [
      {
        rel: 'icon',
        type: 'image/svg+xml',
        href: faviconHref,
      },
    ],
  };
}

/**
 * Extracts anchor items from `navigation.global.anchors` in docs.json.
 */
export function getAnchors(config: DocsConfig): AnchorItem[] {
  const anchors = config.navigation.global?.anchors ?? [];

  return anchors.map((anchor) => ({
    name: anchor.anchor,
    href: anchor.href,
    icon: typeof anchor.icon === 'string' ? anchor.icon : anchor.icon?.name,
    color: anchor.color?.light ?? anchor.color?.dark,
  }));
}

export interface PageData {
  favicons: Favicons | undefined;
  navigation: NavNode;
  sidebarEntries: NavEntry[];
  tabs: TabInfo[] | null;
  footerPages: { prev: NavPage | null; next: NavPage | null };
  groupName: string | undefined;
  anchors: AnchorItem[];
}

/**
 * Resolves the page context from a docs config in a single call.
 * Orchestrates navigation decoration, sidebar entries, tabs, footer pages,
 * group name, and anchors.
 */
export function resolvePageData(
  config: DocsConfig,
  options: {
    currentPath: string;
    titleMap: Record<string, string>;
  },
): PageData {
  const { currentPath, titleMap } = options;

  const decoratedNav = decorateNavigation(config.navigation, titleMap);
  const sidebarEntries = unwrapNav(decoratedNav, currentPath);

  return {
    favicons: getFavicons(config),
    navigation: decoratedNav,
    sidebarEntries,
    tabs: getTabsFromNav(decoratedNav, currentPath),
    footerPages: getFooterPages(sidebarEntries, currentPath),
    groupName: findGroupForPath(sidebarEntries, currentPath),
    anchors: getAnchors(config),
  };
}

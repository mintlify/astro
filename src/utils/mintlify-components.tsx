import type { ReactNode } from 'react';
import {
  Accordion,
  Badge,
  Callout,
  Card,
  Check,
  CodeBlock,
  CodeGroup,
  Color,
  Columns,
  Danger,
  Expandable,
  Frame,
  Icon,
  Info,
  Mermaid,
  Note,
  Panel,
  Property,
  Steps,
  Tabs,
  Tile,
  Tip,
  Tooltip,
  Tree,
  Update,
  Warning,
} from '@mintlify/components';
import type { MDXComponents } from 'mdx/types';

const Wrapper = ({ children }: { children?: ReactNode }) => (
  <div>{children}</div>
);

const MintlifyComponents = {
  Accordion,
  AccordionGroup: Accordion.Group,
  Badge,
  Callout,
  Card,
  CardGroup: Columns,
  Check,
  CodeBlock,
  CodeGroup,
  Color,
  Columns,
  Danger,
  Expandable,
  Frame,
  Icon,
  Info,
  Mermaid,
  Note,
  Panel,
  Property,
  ResponseField: Property,
  Steps,
  Tabs,
  Tile,
  Tip,
  Tooltip,
  Tree,
  Update,
  Warning,
};

const placeholderComponents: Record<string, typeof Wrapper> = {
  Column: Wrapper,
  ApiPlayground: Wrapper,
  CustomCode: Wrapper,
  CustomComponent: Wrapper,
  DynamicCustomComponent: Wrapper,
  Heading: Wrapper,
  Latex: Wrapper,
  Link: Wrapper,
  Loom: Wrapper,
  MDXContentController: Wrapper,
  Param: Wrapper,
  ParamField: Wrapper,
  PreviewButton: Wrapper,
  RequestExample: Wrapper,
  ResponseExample: Wrapper,
  Snippet: Wrapper,
  SnippetGroup: Wrapper,
  View: Wrapper,
};

export const components = {
  ...MintlifyComponents,
  ...placeholderComponents,
};

export function useMDXComponents(): MDXComponents {
  return {
    ...components,
    Step: Steps.Item,
    Tab: Tabs.Item,
  };
}

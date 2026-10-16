import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

// ============================================================================
// Test helper (NOT a test): runs the REAL pixel snippets from src/app/layout.tsx
// inside a fake window, so tests see the stubs exactly as a browser does
// (bare globals like `whop`, `fbq`, `twq`, `dataLayer` and the GA `function
// gtag` declared inside an else-block all land on the window object).
//
// Each `<Script id="...">` body is a template literal with `${...}` ids; the
// helper slices the literal out and substitutes fixed ids. Script injection
// (createElement / insertBefore / head.appendChild) is stubbed and recorded.
// ============================================================================

const LAYOUT_PATH = fileURLToPath(new URL('../app/layout.tsx', import.meta.url));

export const FIXED_IDS: Record<string, string> = {
  GA_MEASUREMENT_ID: 'G-TEST1234',
  META_PIXEL_ID: '1234567890',
  X_PIXEL_ID: 'r8vgq',
};

export function layoutSource(): string {
  return readFileSync(LAYOUT_PATH, 'utf8');
}

/** The JavaScript text of one layout `<Script id="...">`, ids substituted. */
export function snippetBody(id: string, source: string = layoutSource()): string {
  const at = source.indexOf(`id="${id}"`);
  if (at === -1) throw new Error(`Script ${id} not found in layout.tsx`);
  const close = source.indexOf('</Script>', at);
  const open = source.indexOf('{`', at);
  const end = source.lastIndexOf('`}', close);
  if (open === -1 || end === -1 || open > close) throw new Error(`Script ${id} has no template-literal body`);
  let body = source.slice(open + 2, end);
  for (const [name, value] of Object.entries(FIXED_IDS)) body = body.split('${' + name + '}').join(value);
  if (body.includes('${')) throw new Error(`Script ${id} still has an interpolation: ${body.match(/\$\{[^}]+\}/)?.[0]}`);
  return body;
}

export interface FakeWindow {
  __smTrack: boolean;
  injected: string[];
  document: unknown;
  window: unknown;
  [key: string]: unknown;
}

/** A fresh fake window: a vm context whose global IS the window, with a stub document. */
export function makeFakeWindow(tracked = true): FakeWindow {
  const injected: string[] = [];
  const scriptNode = () => {
    const node: Record<string, unknown> = {};
    return node;
  };
  const firstScript = { parentNode: { insertBefore: (node: { src?: string }) => injected.push(String(node.src ?? '')) } };
  const document = {
    title: 'test',
    readyState: 'complete',
    createElement: () => scriptNode(),
    getElementsByTagName: () => [firstScript],
    head: { appendChild: (node: { src?: string }) => injected.push(String(node.src ?? '')) },
    addEventListener: () => undefined,
  };
  const win: Record<string, unknown> = { __smTrack: tracked, injected, document, Date, Array, Object, Function, JSON, RegExp, String, Number };
  win.window = win;
  vm.createContext(win);
  return win as unknown as FakeWindow;
}

/** Run one snippet in the fake window (as an inline script tag would). */
export function runSnippet(win: FakeWindow, id: string, source?: string): void {
  vm.runInContext(snippetBody(id, source), win as unknown as vm.Context, { filename: `layout-${id}.js` });
}

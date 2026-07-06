import { readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';

export type PublicResource = { id: string; path: string; title: string; canonicalUrl: string; text: string };

const ROOT = path.resolve(process.cwd());
const SITE_URL = (process.env.PUBLIC_SITE_URL ?? 'https://<your-domain>').replace(/\/$/, '');
const ALLOWED_PAGES = new Set([
  'index.html', 'about.html', 'platform.html', 'technology.html', 'research.html',
  'licensing.html', 'privacy.html', 'terms.html', 'support.html', 'contact.html'
]);

function stripHtml(source: string): string {
  return source
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function titleFor(filePath: string, text: string): string {
  const base = path.basename(filePath, path.extname(filePath));
  const first = text.split(/[.!?]/)[0]?.trim();
  return first && first.length < 90 ? first : base.replace(/-/g, ' ');
}

function safeRead(relativePath: string): PublicResource | null {
  const normalized = path.posix.normalize(relativePath).replace(/^\.\//, '');
  if (normalized.startsWith('..') || path.isAbsolute(normalized)) return null;
  if (!ALLOWED_PAGES.has(normalized) && !normalized.startsWith('docs/')) return null;
  const fullPath = path.resolve(ROOT, normalized);
  if (!fullPath.startsWith(ROOT + path.sep)) return null;
  const stat = statSync(fullPath, { throwIfNoEntry: false });
  if (!stat?.isFile()) return null;
  const ext = path.extname(normalized).toLowerCase();
  if (!['.html', '.md', '.txt'].includes(ext)) return null;
  const raw = readFileSync(fullPath, 'utf8');
  const text = ext === '.html' ? stripHtml(raw) : raw.replace(/\s+/g, ' ').trim();
  return { id: normalized.replace(/[^a-z0-9]+/gi, '_').replace(/^_|_$/g, '').toLowerCase(), path: normalized, title: titleFor(normalized, text), canonicalUrl: `${SITE_URL}/${normalized}`, text };
}

function docFiles(dir = 'docs'): string[] {
  const full = path.resolve(ROOT, dir);
  const stat = statSync(full, { throwIfNoEntry: false });
  if (!stat?.isDirectory()) return [];
  return readdirSync(full, { withFileTypes: true }).flatMap((entry) => {
    const rel = path.posix.join(dir, entry.name);
    if (entry.isDirectory()) return docFiles(rel);
    return ['.md', '.txt', '.html'].includes(path.extname(entry.name).toLowerCase()) ? [rel] : [];
  });
}

export function listResources(): PublicResource[] {
  return [...ALLOWED_PAGES, ...docFiles()].map((p) => safeRead(p)).filter((r): r is PublicResource => Boolean(r));
}

export function fetchResource(pageIdOrPath: string): PublicResource | null {
  const resources = listResources();
  const key = pageIdOrPath.trim().toLowerCase();
  return resources.find((r) => r.id === key || r.path.toLowerCase() === key || path.basename(r.path).toLowerCase() === key) ?? null;
}

export function searchResources(query: string): Array<PublicResource & { snippet: string; score: number }> {
  const terms = query.toLowerCase().split(/\s+/).filter((term) => term.length > 1).slice(0, 8);
  if (!terms.length) return [];
  return listResources().map((resource) => {
    const haystack = `${resource.title} ${resource.path} ${resource.text}`.toLowerCase();
    const score = terms.reduce((sum, term) => sum + (haystack.includes(term) ? 1 : 0), 0);
    const firstIndex = Math.max(0, Math.min(...terms.map((term) => haystack.indexOf(term)).filter((i) => i >= 0), 0));
    const snippet = resource.text.slice(Math.max(0, firstIndex - 80), firstIndex + 420).trim();
    return { ...resource, snippet, score };
  }).filter((r) => r.score > 0).sort((a, b) => b.score - a.score || a.path.localeCompare(b.path)).slice(0, 8);
}

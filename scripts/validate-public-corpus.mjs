import { existsSync, statSync } from 'node:fs';

const allowed = [
  'index.html', 'about.html', 'platform.html', 'technology.html', 'research.html',
  'licensing.html', 'privacy.html', 'terms.html', 'support.html', 'contact.html',
  'docs/getting-started.md'
];

for (const file of allowed) {
  if (!existsSync(file) || !statSync(file).isFile()) {
    throw new Error(`Missing public corpus file: ${file}`);
  }
}

console.log(`public corpus ok (${allowed.length} files)`);

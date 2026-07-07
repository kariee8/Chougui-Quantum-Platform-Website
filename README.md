# Chougui Quantum Platform Website

Official public website for the Chougui Quantum Platform, an AI and quantum-computing research platform with documented backend execution evidence, including public documentation, research overview, licensing information, support resources, and OpenAI App integration language.
Official public website for the Chougui Quantum Platform, including public documentation, research overview, licensing information, support resources, and OpenAI App integration language.

## Pages

- `index.html` — Home and animated hero
- `about.html` — Mission and vision
- `platform.html` — Platform overview
- `technology.html` — Technology, Codex workflow, and MCP architecture overview
- `research.html` — Public research communication overview
- `licensing.html` — Licensing information
- `privacy.html` — Privacy policy
- `terms.html` — Terms of use
- `support.html` — Documentation and support resources
- `contact.html` — Public contact page

## Structure

```text
/assets
  /css
  /js
  /images
  /fonts
/docs
```

## GitHub Pages deployment

1. Push this repository to GitHub.
2. Open **Settings → Pages**.
3. Select the branch that contains this website.
4. Select the repository root as the publishing source.
5. Save and wait for GitHub Pages to publish the site.

## Development

This is a static website built with clean HTML, CSS, and vanilla JavaScript. No framework or build step is required.

To preview locally:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Public information policy

The website is intentionally public-facing. This platform includes protected research documentation and preserved IBM Quantum backend execution artifacts. Public materials summarize evidence categories only and do not expose raw job data, OpenQASM, private repository contents, or Core IP. Do not add unpublished research details, confidential datasets, credentials, private infrastructure information, raw JSON, raw OpenQASM, job payloads, Core IP, unsupported scientific claims, or IBM partnership/endorsement claims.

## Public MCP server for ChatGPT Apps

This repository includes a minimal read-only Model Context Protocol (MCP) server for OpenAI Apps SDK submission and tool scanning of public-safe website materials for an AI and quantum-computing research platform with documented backend execution evidence.

### Endpoints

- Health check: `https://<your-deployed-domain>/health`
- MCP endpoint: `https://<your-deployed-domain>/mcp`
- Optional OpenAI domain verification: `https://<your-deployed-domain>/.well-known/openai-domain-verification.txt`

The MCP server exposes only public-safe website content from these files:

- Root public pages: `index.html`, `about.html`, `platform.html`, `technology.html`, `research.html`, `licensing.html`, `privacy.html`, `terms.html`, `support.html`, and `contact.html`
- Public documentation files under `docs/`

It does not expose private repositories, private quantum job files, raw JSON, raw OpenQASM, job payloads, personal documents, secrets, credentials, unpublished research, raw backend data, Core IP, or legal/private evidence files. It also does not claim endorsement, approval, certification, backing, or partnership by IBM.

### MCP tools

- `search_public_docs` — searches public website pages and documentation snippets.
- `fetch_public_doc` — fetches full text and canonical URL for a public page or docs path.
- `list_public_resources` — lists available public pages and docs resources.
- `get_licensing_info` — returns public licensing information from `licensing.html`.
- `get_support_info` — returns support and contact information from `support.html` and `contact.html`.

### Environment variables

- `PORT` — optional server port. Defaults to `3000`.
- `PUBLIC_SITE_URL` — optional canonical public website URL used in MCP results, for example `https://chougui-quantum.example.com`.
- `OPENAI_DOMAIN_VERIFICATION_TOKEN` — optional token served at `/.well-known/openai-domain-verification.txt` for domain verification.

Never commit secrets or real verification tokens. Configure them in the deployment provider dashboard.

### Local MCP development

```bash
npm install
npm run dev
```

Then verify:

```bash
curl http://localhost:3000/health
```

Expected response:

```text
ok
```

### Deployment target

Deploy the Node.js server to any HTTPS host that supports long-lived HTTP requests, such as Render, Railway, Fly.io, a container platform, or another public HTTPS Node.js deployment.

Use these settings on a typical Node.js host:

- Build command: `npm ci && npm run build`
- Start command: `npm start`
- Public MCP URL format for OpenAI Platform: `https://<your-deployed-domain>/mcp`
- Public health URL format: `https://<your-deployed-domain>/health`

### OpenAI Platform “Scan Tools” test

1. Deploy the server to a public HTTPS domain.
2. If domain verification is required, set `OPENAI_DOMAIN_VERIFICATION_TOKEN` in the host environment and confirm `https://<your-deployed-domain>/.well-known/openai-domain-verification.txt` returns the token.
3. In OpenAI Platform app configuration, set the MCP server URL to `https://<your-deployed-domain>/mcp`.
4. Run **Scan Tools**.
5. Confirm the five read-only tools appear: `search_public_docs`, `fetch_public_doc`, `list_public_resources`, `get_licensing_info`, and `get_support_info`.
The website is intentionally public-facing. Do not add unpublished research details, confidential datasets, credentials, private infrastructure information, or unsupported scientific claims.

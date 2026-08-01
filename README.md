# Chougui Quantum Platform Website

Public website and public, read-only MCP server for the Chougui Quantum Platform.

The submitted OpenAI app scope is intentionally limited to approved public website pages and documentation. It does not expose private repositories, raw IBM Quantum job files, raw OpenQASM, credentials, personal documents, unpublished research, customer data, or paid quantum execution.

## Public website

The website contains:

- `index.html` — home
- `about.html` — mission and background
- `platform.html` — platform overview
- `technology.html` — technology and MCP architecture
- `research.html` — public research communication
- `licensing.html` — licensing information
- `privacy.html` — privacy policy
- `terms.html` — terms of use
- `support.html` — support resources
- `contact.html` — contact information
- `docs/` — approved public documentation

The static website may be hosted through GitHub Pages or another static host.

## Public MCP server

The Node.js server exposes:

- `GET /` — service metadata
- `GET /health` — process liveness
- `GET /ready` — corpus and MCP readiness
- `POST /mcp` — Streamable HTTP MCP endpoint
- `GET /.well-known/openai-domain-verification.txt` — optional domain verification

### Tools

- `search_public_docs`
- `fetch_public_doc`
- `list_public_resources`
- `get_licensing_info`
- `get_support_info`

Every submitted tool is read-only and restricted to the approved public corpus.

## Local development

Requirements: Node.js 20 or newer.

```bash
npm ci
npm test
npm run dev
```

Verify liveness and readiness:

```bash
curl --fail http://127.0.0.1:3000/health
curl --fail http://127.0.0.1:3000/ready
```

## Production build

```bash
npm ci
npm test
npm run build
npm start
```

The production start command runs `dist/src/server.js`.

## MCP connectivity test

Start the production server and run:

```bash
MCP_URL=http://127.0.0.1:3000/mcp npm run smoke:mcp
```

The test initializes an MCP session, scans the tool list, confirms the read-only annotations, and invokes two tools.

For a remote deployment:

```bash
MCP_URL=https://YOUR-MCP-DOMAIN/mcp npm run smoke:mcp
```

## Container deployment

```bash
docker build -t chougui-public-mcp .
docker run --rm -p 3000:3000 \
  -e PORT=3000 \
  -e PUBLIC_SITE_URL=https://YOUR-PUBLIC-SITE \
  chougui-public-mcp
```

A `render.yaml` blueprint is included for a Node web service. The MCP server must run on a public HTTPS application host; GitHub Pages alone cannot run the Node.js MCP process.

Required host configuration:

- build: `npm ci && npm test && npm run build`
- start: `npm start`
- health check: `/ready`
- MCP URL submitted to OpenAI: `https://YOUR-MCP-DOMAIN/mcp`

## Environment variables

- `PORT` — server port; defaults to `3000`
- `PUBLIC_SITE_URL` — canonical public website URL used in tool results
- `OPENAI_DOMAIN_VERIFICATION_TOKEN` — optional domain-verification token
- `APP_VERSION` — deployed application version
- `GIT_COMMIT_SHA` — optional deployed commit identifier

Never commit real tokens or secrets.

## OpenAI app review procedure

Before resubmission:

1. Deploy the MCP server to a public HTTPS application host.
2. Confirm `/health` and `/ready` return HTTP 200.
3. Run the remote `smoke:mcp` test.
4. Configure the exact endpoint `https://YOUR-MCP-DOMAIN/mcp`.
5. Run **Scan Tools** in OpenAI Platform or ChatGPT developer mode.
6. Confirm all five read-only tools appear and can be called.
7. Record the deployed commit and test evidence.

Review documents are in `docs/review/`.

## CI

`.github/workflows/mcp-connectivity.yml` is a blocking connectivity pipeline that:

- installs dependencies
- type-checks and validates the public corpus
- builds and starts the production server
- checks `/ready`
- performs an MCP protocol smoke test
- builds and runs the production container
- repeats the readiness and MCP checks against the container

## Public information policy

Public materials may summarize platform architecture and approved evidence categories. Do not publish:

- private repository contents
- raw IBM Quantum credentials or private job payloads
- raw protected OpenQASM
- unpublished research
- personal documents
- secrets or tokens
- unsupported scientific claims
- claims of OpenAI or IBM endorsement, approval, certification, or partnership

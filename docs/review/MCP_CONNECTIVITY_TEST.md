# MCP Connectivity Test

## Purpose

This procedure verifies the exact technical boundary required before an OpenAI app review: a remote client must be able to initialize an MCP session, discover the declared tools, and call read-only tools successfully.

## Automated test

The repository contains `scripts/smoke-mcp.mjs`.

Against a local production build:

```bash
npm ci
npm test
npm run build
PORT=3000 PUBLIC_SITE_URL=https://example.test npm start
```

In a second terminal:

```bash
MCP_URL=http://127.0.0.1:3000/mcp npm run smoke:mcp
```

The test must:

1. Establish a Streamable HTTP MCP connection.
2. Discover all five expected tools.
3. Confirm each exposed app tool is annotated as read-only.
4. Call `list_public_resources` successfully.
5. Call `search_public_docs` successfully.

## Remote deployment test

```bash
curl --fail --show-error https://YOUR-MCP-DOMAIN/health
curl --fail --show-error https://YOUR-MCP-DOMAIN/ready
MCP_URL=https://YOUR-MCP-DOMAIN/mcp npm run smoke:mcp
```

Expected health response:

```text
ok
```

Expected readiness response:

- HTTP 200
- `status` is `ready`
- `transport` is `streamable-http`
- `mcp_endpoint` is `/mcp`
- all five tools are listed
- `public_resource_count` is greater than zero

## OpenAI Platform verification

1. Use the exact URL `https://YOUR-MCP-DOMAIN/mcp`.
2. Run **Scan Tools**.
3. Confirm the five tools appear.
4. Invoke each tool in developer mode.
5. Record the deployment commit and test date before resubmission.

Do not resubmit while any step above is unverified.

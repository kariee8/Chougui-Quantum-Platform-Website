# Deployment Checklist

## Required configuration

- [ ] Node.js 20 or newer
- [ ] `npm ci` succeeds
- [ ] `npm test` succeeds
- [ ] `npm run build` creates `dist/src/server.js`
- [ ] `npm start` launches the production server
- [ ] Host provides a public HTTPS URL
- [ ] Host forwards its assigned `PORT` environment variable
- [ ] `PUBLIC_SITE_URL` is set to the canonical public website URL
- [ ] `OPENAI_DOMAIN_VERIFICATION_TOKEN` is configured only when required
- [ ] No secrets or private research files are included in the deployment

## Required public endpoints

- [ ] `/` returns service metadata
- [ ] `/health` returns HTTP 200 and `ok`
- [ ] `/ready` returns HTTP 200 and a non-empty public corpus
- [ ] `/mcp` accepts Streamable HTTP MCP POST requests
- [ ] `/.well-known/openai-domain-verification.txt` returns the configured token when domain verification is enabled

## Required MCP checks

- [ ] Remote smoke test passes
- [ ] OpenAI **Scan Tools** succeeds
- [ ] All five declared tools appear
- [ ] Every tool is read-only
- [ ] No tool exposes private repositories, raw IBM job files, raw OpenQASM, credentials, personal documents, or unpublished research

## Deployment evidence to retain

- Deployment URL
- Deployment provider
- Deployment timestamp
- Git commit SHA
- Build log
- Startup log
- `/ready` response
- MCP smoke-test output
- OpenAI Scan Tools result
- Name of the person who approved resubmission

## Rollback

Keep the previously working deployment revision available. If health, readiness, or MCP smoke testing fails after deployment, roll back before submitting the app for review.

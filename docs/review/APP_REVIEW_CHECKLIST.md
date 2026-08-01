# OpenAI App Review Checklist

## Submission identity

- App name: **Chougui Quantum Platform**
- Initial scope: **public, read-only research and documentation assistant**
- MCP endpoint: `https://YOUR-MCP-DOMAIN/mcp`
- Public website: `https://YOUR-PUBLIC-SITE`
- Privacy policy: `https://YOUR-PUBLIC-SITE/privacy.html`
- Terms: `https://YOUR-PUBLIC-SITE/terms.html`
- Support: `https://YOUR-PUBLIC-SITE/support.html`

## Scope statement

The submitted version searches and retrieves approved public website pages and public documentation. It does not rent quantum computing capacity, submit paid IBM Quantum jobs, expose private research, or make scientific validation claims.

Those capabilities may be introduced only in later versions with separate authentication, pricing, approval, audit, and evidence controls.

## Technical gate

- [ ] CI passes on the exact commit to deploy
- [ ] Production container builds
- [ ] Public HTTPS deployment is active
- [ ] `/health` passes
- [ ] `/ready` passes
- [ ] Remote MCP smoke test passes
- [ ] OpenAI Scan Tools passes
- [ ] All tool calls have been tested in ChatGPT developer mode
- [ ] Cold-start behavior has been tested after inactivity
- [ ] The deployed commit SHA has been recorded

## Product and policy gate

- [ ] App description matches the actual five read-only tools
- [ ] No claim implies OpenAI or IBM endorsement
- [ ] No claim promises scientific proof, quantum advantage, guaranteed performance, or financial return
- [ ] Privacy policy accurately describes MCP request processing and hosting logs
- [ ] Support and contact pages are reachable
- [ ] Public resources have been manually reviewed for private information
- [ ] Tool descriptions clearly state their public-only boundary

## Resubmission record

Complete this section immediately before submission:

- Deployment URL:
- Deployment commit:
- Remote smoke-test date:
- Scan Tools date:
- Reviewer:
- Known limitations:
- Submission ID:

## Rejection remediation

The previous review stated that OpenAI could not connect to the MCP server. This submission must not be repeated until remote connectivity is evidenced by both the repository smoke test and OpenAI Scan Tools.

# Chougui Quantum Platform Website

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

The website is intentionally public-facing. Do not add unpublished research details, confidential datasets, credentials, private infrastructure information, or unsupported scientific claims.

import { randomUUID } from 'node:crypto';
import express from 'express';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { isInitializeRequest } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import { fetchResource, listResources, searchResources } from './publicContent.js';

const PORT = Number(process.env.PORT ?? 3000);
const DOMAIN_TOKEN = process.env.OPENAI_DOMAIN_VERIFICATION_TOKEN;
const APP_NAME = 'chougui-quantum-platform-public-docs';
const APP_VERSION = process.env.APP_VERSION ?? '1.0.1';
const COMMIT_SHA = process.env.GIT_COMMIT_SHA ?? process.env.RENDER_GIT_COMMIT ?? 'unknown';
const MCP_PATH = '/mcp';
const TOOL_NAMES = [
  'search_public_docs',
  'fetch_public_doc',
  'list_public_resources',
  'get_licensing_info',
  'get_support_info'
] as const;

const READ_ONLY_ANNOTATIONS = {
  readOnlyHint: true,
  destructiveHint: false,
  idempotentHint: true,
  openWorldHint: false
};

type Transport = StreamableHTTPServerTransport;
const transports: Record<string, Transport> = {};

function textResult(text: string) {
  return { content: [{ type: 'text' as const, text }] };
}

function createMcpServer() {
  const server = new McpServer({ name: APP_NAME, version: APP_VERSION });

  server.registerTool('search_public_docs', {
    description: 'Search only public-safe Chougui Quantum Platform website pages and docs. Returns matching snippets; does not access private repositories, secrets, backend data, job files, or unpublished research.',
    inputSchema: { query: z.string().min(1).describe('Search query for public website documentation') },
    annotations: READ_ONLY_ANNOTATIONS
  }, async ({ query }) => textResult(JSON.stringify(searchResources(query).map(({ id, path, title, canonicalUrl, snippet, score }) => ({ id, path, title, canonicalUrl, snippet, score })), null, 2)));

  server.registerTool('fetch_public_doc', {
    description: 'Fetch the full text for a specific public-safe website page or docs file by page_id or path. Only approved public HTML pages and docs/ files are available.',
    inputSchema: { page_id_or_path: z.string().min(1).describe('Public page id, filename, or path such as platform.html or docs/getting-started.md') },
    annotations: READ_ONLY_ANNOTATIONS
  }, async ({ page_id_or_path }) => {
    const resource = fetchResource(page_id_or_path);
    if (!resource) return textResult(`No public resource found for: ${page_id_or_path}`);
    return textResult(JSON.stringify(resource, null, 2));
  });

  server.registerTool('list_public_resources', {
    description: 'List every public-safe resource exposed by this read-only MCP server. This is limited to approved website pages and public docs files.',
    inputSchema: {},
    annotations: READ_ONLY_ANNOTATIONS
  }, async () => textResult(JSON.stringify(listResources().map(({ id, path, title, canonicalUrl }) => ({ id, path, title, canonicalUrl })), null, 2)));

  server.registerTool('get_licensing_info', {
    description: 'Return public licensing information summarized from licensing.html. Optional topic can narrow the licensing answer.',
    inputSchema: { topic: z.string().optional().describe('Optional licensing topic, such as open source, third party services, or reuse') },
    annotations: READ_ONLY_ANNOTATIONS
  }, async ({ topic }) => {
    const licensing = fetchResource('licensing.html');
    const prefix = topic ? `Topic: ${topic}\n\n` : '';
    return textResult(prefix + (licensing?.text ?? 'Licensing information is not available.'));
  });

  server.registerTool('get_support_info', {
    description: 'Return public support and contact information from support.html and contact.html for documentation, OpenAI App review, and website inquiries.',
    inputSchema: {},
    annotations: READ_ONLY_ANNOTATIONS
  }, async () => {
    const support = fetchResource('support.html');
    const contact = fetchResource('contact.html');
    return textResult(JSON.stringify({ support, contact }, null, 2));
  });

  return server;
}

function readinessPayload() {
  const resources = listResources();
  if (resources.length === 0) {
    throw new Error('No public resources are available');
  }

  return {
    status: 'ready',
    service: APP_NAME,
    version: APP_VERSION,
    commit: COMMIT_SHA,
    transport: 'streamable-http',
    mcp_endpoint: MCP_PATH,
    tool_count: TOOL_NAMES.length,
    tools: TOOL_NAMES,
    public_resource_count: resources.length,
    access: 'public-read-only'
  };
}

const app = express();
app.disable('x-powered-by');
app.use(express.json({ limit: '1mb' }));
app.use((_req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});

app.get('/', (_req, res) => res.json({
  name: 'Chougui Quantum Platform Public MCP',
  status: 'online',
  version: APP_VERSION,
  commit: COMMIT_SHA,
  health_endpoint: '/health',
  readiness_endpoint: '/ready',
  mcp_endpoint: MCP_PATH,
  access: 'public-read-only'
}));

app.get('/health', (_req, res) => res.type('text/plain').send('ok'));

app.get('/ready', (_req, res) => {
  try {
    return res.status(200).json(readinessPayload());
  } catch (error) {
    console.error(JSON.stringify({ event: 'readiness_failed', error: error instanceof Error ? error.message : String(error) }));
    return res.status(503).json({ status: 'not_ready', error: 'Public corpus is unavailable' });
  }
});

app.get('/.well-known/openai-domain-verification.txt', (_req, res) => {
  if (!DOMAIN_TOKEN) return res.status(404).type('text/plain').send('domain verification token not configured');
  return res.type('text/plain').send(DOMAIN_TOKEN);
});

app.post(MCP_PATH, async (req, res) => {
  const startedAt = Date.now();
  try {
    const sessionId = req.headers['mcp-session-id'];
    let transport: Transport | undefined = typeof sessionId === 'string' ? transports[sessionId] : undefined;

    if (!transport && isInitializeRequest(req.body)) {
      transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: () => randomUUID(),
        enableJsonResponse: true,
        onsessioninitialized: (id) => {
          if (transport) transports[id] = transport;
        }
      });
      transport.onclose = () => {
        const id = transport?.sessionId;
        if (id) delete transports[id];
      };
      await createMcpServer().connect(transport);
    }

    if (!transport) {
      return res.status(400).json({
        jsonrpc: '2.0',
        error: { code: -32000, message: 'Bad Request: initialize first or provide a valid MCP session id' },
        id: null
      });
    }

    await transport.handleRequest(req, res, req.body);
    console.log(JSON.stringify({ event: 'mcp_request', status: res.statusCode, duration_ms: Date.now() - startedAt }));
  } catch (error) {
    console.error(JSON.stringify({ event: 'mcp_request_failed', duration_ms: Date.now() - startedAt, error: error instanceof Error ? error.message : String(error) }));
    if (!res.headersSent) {
      res.status(500).json({ jsonrpc: '2.0', error: { code: -32603, message: 'Internal server error' }, id: null });
    }
  }
});

app.get(MCP_PATH, (_req, res) => res.status(405).set('Allow', 'POST').type('text/plain').send('Method Not Allowed'));

const httpServer = app.listen(PORT, () => {
  console.log(JSON.stringify({ event: 'server_started', service: APP_NAME, version: APP_VERSION, commit: COMMIT_SHA, port: PORT, mcp_endpoint: MCP_PATH }));
});

function shutdown(signal: string) {
  console.log(JSON.stringify({ event: 'server_shutdown', signal }));
  httpServer.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 10_000).unref();
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

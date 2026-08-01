import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';

const endpoint = process.env.MCP_URL ?? 'http://127.0.0.1:3000/mcp';
const expectedTools = [
  'search_public_docs',
  'fetch_public_doc',
  'list_public_resources',
  'get_licensing_info',
  'get_support_info'
];

const client = new Client({
  name: 'chougui-openai-review-smoke-test',
  version: '1.0.0'
});

const transport = new StreamableHTTPClientTransport(new URL(endpoint));

try {
  await client.connect(transport);

  const listed = await client.listTools();
  const names = listed.tools.map((tool) => tool.name).sort();
  const missing = expectedTools.filter((name) => !names.includes(name));

  if (missing.length > 0) {
    throw new Error(`MCP tool scan is missing: ${missing.join(', ')}`);
  }

  for (const tool of listed.tools) {
    if (expectedTools.includes(tool.name) && tool.annotations?.readOnlyHint !== true) {
      throw new Error(`Tool ${tool.name} is not advertised as read-only`);
    }
  }

  const resourcesResult = await client.callTool({
    name: 'list_public_resources',
    arguments: {}
  });
  if (resourcesResult.isError) {
    throw new Error('list_public_resources returned an MCP error');
  }

  const searchResult = await client.callTool({
    name: 'search_public_docs',
    arguments: { query: 'quantum platform' }
  });
  if (searchResult.isError) {
    throw new Error('search_public_docs returned an MCP error');
  }

  console.log(JSON.stringify({
    status: 'ok',
    endpoint,
    discovered_tools: names,
    tested_calls: ['list_public_resources', 'search_public_docs']
  }, null, 2));
} catch (error) {
  console.error(JSON.stringify({
    status: 'failed',
    endpoint,
    error: error instanceof Error ? error.message : String(error)
  }, null, 2));
  process.exitCode = 1;
} finally {
  await client.close().catch(() => undefined);
}

# Privacy and Data Flow

## Submitted app boundary

The public MCP server exposes only allowlisted website pages and documentation files. It does not connect to private repositories, IBM Quantum accounts, customer databases, payment systems, local computers, Unreal projects, or unpublished research storage.

## Data flow

```text
ChatGPT user request
  -> OpenAI app/MCP client
  -> public HTTPS POST /mcp
  -> one allowlisted read-only tool
  -> approved public website or docs file
  -> tool response returned to ChatGPT
```

## Data processed

The server may process:

- tool name
- tool arguments, such as a documentation search query or public page path
- MCP session identifier
- request timing and HTTP status
- public documentation returned by the selected tool

## Data not intentionally collected by the application

- account passwords
- payment details
- health information
- government identifiers
- private repository contents
- raw IBM Quantum credentials or private job payloads
- unpublished QASM or protected research files
- ChatGPT conversation history beyond the tool request delivered to the server

## Logging

The application emits operational logs for startup, readiness failures, MCP request status, duration, and server errors. It does not intentionally log full tool arguments or returned document bodies. The deployment provider may independently retain standard access logs according to its own policy and configuration.

## Storage

The submitted server has no application database and does not intentionally persist MCP tool requests. In-memory MCP sessions are removed when their transport closes and are lost when the process restarts.

## Third parties

- OpenAI transports the app request from ChatGPT.
- The selected hosting provider runs the public MCP server and may process network metadata.
- Public website hosting may be separate from MCP server hosting.

No IBM Quantum execution is performed by the submitted read-only app.

## User controls and contact

Users can avoid sending personal or confidential information in documentation search queries. Privacy and support inquiries should use the contact information published on the platform website.

## Future features

Authentication, paid services, quantum job submission, customer accounts, persistent storage, or private research access require a new privacy review and must not be treated as covered by this public read-only data flow.

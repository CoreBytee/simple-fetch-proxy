# simple-fetch-proxy

A lightweight, configurable fetch proxy server. This package was created to allow proxying fetch requests through another server or IP.

## Features
- Forward HTTP requests to target servers
- Easy configuration
- Minimal dependencies

## Installation

Install via npm or bun:

```bash
npm install @corebyte/proxy
# or
bun add @corebyte/proxy
```

## Documentation
The package is fully written in TypeScript so you can use the type definitions as documentation. And you can also look at the code here on GitHub.

## Usage

Configure the server using env vars:
- `PROXY_PORT`: Host where the server listens
- `PROXY_SECRET`: Server secret

Start the proxy server:
```bash
npm run proxy [.env]
# or
bun run proxy [.env]
```

Create fetch function:
```js
import createFetch from "@corebyte/proxy";

const fetch = createFetch();
const response = await fetch("https://example.com");
console.log(await response.text());
```

## License

MIT License


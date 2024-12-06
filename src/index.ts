export default function createFetch(
    options: {
        ssl: boolean,
        host: string,
        port: number,
        secret: string,
    } = {
            ssl: false,
            host: 'localhost',
            port: 4000,
            secret: process.env.PROXY_SECRET as string
        }
): Function {
    const proxyUrl = `${options.ssl ? 'https' : 'http'}://${options.host}:${options.port}/`

    return async function (
        input: string | URL | globalThis.Request,
        init?: RequestInit
    ): Promise<Response> {
        const url = typeof input === 'string'
            ? new URL(input)
            : input instanceof URL
                ? input
                : new URL(input.url);

        const method = init?.method || (input instanceof Request ? input.method : 'GET');

        const headers = init?.headers
            ? new Headers(init.headers)
            : input instanceof Request
                ? input.headers
                : new Headers();

        const body = init?.body || (input instanceof Request ? input.body : undefined);

        const fetchUrl = new URL(proxyUrl)
        fetchUrl.searchParams.set('url', url.toString())
        fetchUrl.searchParams.set("method", method || "GET")
        fetchUrl.searchParams.set("headers", JSON.stringify(headers || {}))
        fetchUrl.searchParams.set("secret", options.secret)

        const response = await fetch(
            fetchUrl.toString(),
            {
                ...init,
                method,
                body
            }
        )

        return response
    }
}
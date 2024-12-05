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
        url: string,
        fetchOptions: RequestInit = {}
    ): Promise<Response> {
        const fetchUrl = new URL(proxyUrl)
        fetchUrl.searchParams.set('url', url)
        fetchUrl.searchParams.set("method", fetchOptions.method || "GET")
        fetchUrl.searchParams.set("headers", JSON.stringify(fetchOptions.headers || {}))
        fetchUrl.searchParams.set("secret", options.secret)

        const response = await fetch(
            fetchUrl.toString()
        )

        return response
    }
}
export default function createFetch(
    options: {
        ssl: boolean,
        host: string,
        port: number,
    } = {
            ssl: false,
            host: 'localhost',
            port: 4000,
        }
): Function {
    const proxyUrl = `${options.ssl ? 'https' : 'http'}://${options.host}:${options.port}/`

    return async function (
        url: string,
        options: RequestInit = {}
    ): Promise<Response> {
        const response = await fetch(
            `${proxyUrl}?${url}`,
            options
        )

        return response
    }
}
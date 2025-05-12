export default function createFetch(
	options: {
		ssl: boolean;
		host: string;
		port: number;
		secret: string;
	} = {
		ssl: false,
		host: "localhost",
		port: 4000,
		secret: process.env.PROXY_SECRET as string,
	},
): (input: string | URL | globalThis.Request, init?: RequestInit) => Promise<Response> {
	const proxyUrl = `${options.ssl ? "https" : "http"}://${options.host}:${options.port}/`;

	return async (
		input: string | URL | globalThis.Request,
		init?: RequestInit,
	): Promise<Response> => {
		const url =
			typeof input === "string"
				? new URL(input)
				: input instanceof URL
					? input
					: new URL(input.url);

		// Transform the url for use with our proxy.
		url.searchParams.set("url", url.toString()); // keep original query param name
		url.host = `${options.host}:${options.port}`;
		url.protocol = options.ssl ? "https" : "http";

		// Remove the path from the requested url
		url.pathname = "/";
		url.hash = "";

		const headers = init?.headers
			? new Headers(init.headers)
			: input instanceof Request
				? input.headers
				: new Headers();

		// Serialize headers as query param (keep original param name)
		const headerArray: [string, string][] = [];
		headers.forEach((value, key) => {
			headerArray.push([key, value]);
		});
		url.searchParams.set("headers", JSON.stringify(headerArray));
		url.searchParams.set("secret", options.secret);

		headers.delete("user-agent");

		const request = new Request(
			url,
			input instanceof Request ? input : undefined
		);

		return fetch(request, init ? {
			...init,
			headers
		} : {
			headers
		});
	};
}

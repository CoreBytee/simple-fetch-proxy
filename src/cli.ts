import { Readable } from "node:stream";
import bodyParser from "body-parser";
import { configDotenv } from "dotenv";
import express from "express";

configDotenv({ path: process.argv[2] || ".env" });

const app = express();

const port = process.env.PROXY_PORT;
const secretToken = process.env.PROXY_SECRET;

console.log(
	`Starting on port ${port} with secret ${Array(secretToken?.length).fill("*").join("")}`,
);

app.use(bodyParser.text({ type: "*/*" }));

app.all("/", async (request, response) => {
	const secret: string = request.query.secret as string;
	const url: string = request.query.url as string;
	const headers: string = request.query.headers as string;
	const method: string = request.method;

	if (secret !== secretToken) {
		response.status(401).send("Unauthorized");
		return
	}

	console.log(`Request: ${method} ${url} ${headers}`);

	const fetchResponse = await fetch(url, {
		method,
		headers: JSON.parse(headers),
		body: typeof request.body === "string" ? request.body : undefined,
	});

	response.status(fetchResponse.status);
	fetchResponse.headers.forEach((value, key) => {
		if (key.toLowerCase() === "content-length") return;
		if (key.toLowerCase() === "content-encoding") return;
		response.setHeader(key, value);
	});

	if (!fetchResponse.body) {
		response.end();
		return;
	}
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const nodeStream = Readable.fromWeb(fetchResponse.body as any);
	nodeStream.pipe(response);
});

app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});

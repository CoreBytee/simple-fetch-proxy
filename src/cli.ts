import bodyParser from "body-parser";
import { configDotenv } from "dotenv";
import express from "express";

configDotenv()

const app = express()

const port = process.argv[3] || process.env.PROXY_PORT
const secretToken = process.argv[2] || process.env.PROXY_SECRET

console.log(`Starting on port ${port} with secret ${Array(secretToken?.length).fill("*").join("")}`)

app.use(bodyParser.text({ type: '*/*' }));

app.all(
    "/",
    async (request, response) => {
        const secret: string = request.query.secret as string
        const url: string = request.query.url as string
        const headers: string = request.query.headers as string
        const method: string = request.method

        if (secret !== secretToken) {
            response.status(401).send("Unauthorized")
        }

        console.log(
            `Request: ${method} ${url} ${headers}`
        )

        const fetchResponse = await fetch(
            url,
            {
                method,
                headers: JSON.parse(headers),
                body: typeof request.body == "string" ? request.body : undefined,
            }
        )

        function copyHeader(headerName: string) {
            const headerValue = fetchResponse.headers.get(headerName)
            if (headerValue) {
                response.setHeader(headerName, headerValue)
            }
        }

        response.status(fetchResponse.status)
        copyHeader("Content-Type")
        copyHeader("Content-Length")
        copyHeader("Content-Disposition")
        copyHeader("Content-Language")
        copyHeader("Content-Range")
        copyHeader("accept-ranges")
        response.send(await fetchResponse.text())

    }
)

app.listen(
    port,
    () => {
        console.log(`Server is running on http://localhost:${port}`)
    }
)
import { configDotenv } from "dotenv";
import express from "express";

configDotenv()

const app = express()

app.all(
    "/",
    async (request, response) => {
        console.log(request.url.substring(2), request)

        const fetchResponse = await fetch(
            request.url.substring(2),
            {
                headers: request.headers as object,
                verbose: true
            }
        )

        response.send(
            await fetchResponse.text()
        )
    }
)

app.listen(
    process.env.PROXY_PORT,
    () => {
        console.log(`Server is running on http://localhost:${process.env.PROXY_PORT}`)
    }
)
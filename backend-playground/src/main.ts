import express from "express";

import * as policies from "./routes/policies";
import * as requests from "./routes/requests"
import Logger from "./logger";
import { addCORSHeaders, checkAuthorizationHeader } from "./routes/middleware";

const app = express();
const port = 5000;

// allowing all content types to be parsed
app.use(express.text({ type: '*/*' }));

// middleware

app.use(checkAuthorizationHeader);
app.use(addCORSHeaders);

// specific route handlers

app.use('/uma/policies', policies.default);
app.use('/uma/requests', requests.default);

app.listen(port, () => {
    Logger.info(`Playground API endpoints running on http://localhost:${port}/`);
});

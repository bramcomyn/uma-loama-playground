import express from "express";
import router from "./routes/requests";

const app = express();
const port = 3000;

app.use("/", router);

app.listen(port, () => {
    console.log(`Playground API endpoints running on http://localhost:${port}/`);
});

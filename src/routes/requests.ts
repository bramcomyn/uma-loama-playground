import express from "express";
import { Request, Response } from "express";
import { AccessRequestController } from "../controllers/access-request-controller";
import { MemoryAccessRequestStorage } from "../storages/access-request-storage";

const checkContentType = (type: string) => (req: Request, res: Response, next) => {
    if (req.headers["content-type"] !== type) {
        res.status(400);
        res.send(`Content-Type MUST be ${type}`);    
    } else next();
}

const checkAuthorization = (req: Request, res: Response, next) => {
    if (req.headers.authorization) next();
    else {
        res.status(400);
        res.send("Authorization header MUST be set");
    }
}

const router = express.Router();
const controller = new AccessRequestController(
    new MemoryAccessRequestStorage()
);

router.all('/', checkAuthorization);

router.get('/', async (req, res) => {
    const requester = req.headers.authorization;
    const data = await controller.getAccessRequests(requester);
    res.status(200);
    res.send(data);
});

router.post('/', checkContentType('text/turtle'));
router.post('/', (req, res) => {
    req.on("data", async (chunk) => await controller.addAccessRequest(chunk.toString()));
    res.status(200);
    res.send();
});

router.patch('/', checkContentType('application/sparql-update'));
router.patch('/', (req, res) => {
    req.on("data", async (chunk) => await controller.updateAccessRequest(chunk.toString()));
    res.status(200);
    res.send();
});

export default router;

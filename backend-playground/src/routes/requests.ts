import { Router } from "express";
import Logger from "../logger/logger";
import { checkContentTypeEquals } from "./middleware";
import { RequestController } from "../controllers/requests";
import { MemoryRequestStore } from "../stores/requests";

const router = Router();
const controller = new RequestController(
    new MemoryRequestStore()
);

router.get('/', (_, res) => {
    Logger.info(`Received GET for /uma/requests`);
    res.status(204);
    res.send();
});

router.post('/', checkContentTypeEquals('text/turtle'));
router.post('/', async (request, response, next) => {
    Logger.info(`Received POST for /uma/requests`);

    const clientID = request.headers['authorization'];
    if (request.body) await controller.addRequest(request.body, clientID);
    
    response.status(201);
    response.send();
});


router.get('/:id', (req, res) => {
    Logger.info(`Received GET for /uma/requests/${req.params.id}`);
    res.status(204);
    res.send();
});

router.patch('/:id', (req, res) => {
    Logger.info(`Received PATCH for /uma/requests/${req.params.id}`);
    res.status(204);
    res.send();
});

export default router;

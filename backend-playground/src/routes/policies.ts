import { Router } from "express";
import Logger from "../logger/logger";
import { checkContentTypeEquals } from "./middleware";
import { PolicyController } from "../controllers";
import { MemoryPolicyStore } from "../stores";

const router = Router();
const controller = new PolicyController(
    new MemoryPolicyStore()
);

router.get('/', (_, res) => {
    Logger.info(`Received GET for /uma/policies`);
    res.status(204);
    res.send();
});

router.post('/', checkContentTypeEquals('text/turtle'));
router.post('/', async (request, response) => {
    Logger.info(`Received POST for /uma/policies`);

    const clientID = request.headers['authorization'];
    if (request.body) await controller.addPolicy(request.body, clientID);
    
    response.status(201);
    response.send();
});


router.get('/:id', (req, res) => {
    Logger.info(`Received GET for /uma/policies/${req.params.id}`);
    res.status(204);
    res.send();
});

router.patch('/:id', (req, res) => {
    Logger.info(`Received PATCH for /uma/policies/${req.params.id}`);
    res.status(204);
    res.send();
});

export default router;

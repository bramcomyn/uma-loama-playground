import { Router } from "express";
import Logger from "../logger/logger";
import { checkContentTypeEquals } from "./middleware";
import { RequestController } from "../controllers/requests";
import { MemoryRequestStore } from "../stores/requests";
import { defaultIdParamRouteHandler, defaultRouteHandler, Method } from "../util";

const router = Router();
const controller = new RequestController(
    new MemoryRequestStore()
);

router.get('/', defaultRouteHandler(Method.GET));

router.post('/', checkContentTypeEquals('text/turtle'));
router.post('/', async (request, response) => {
    Logger.info(`Received POST for ${request.baseUrl}`);

    const clientID = request.headers['authorization'];
    if (request.body) await controller.addRequest(request.body, clientID);
    
    response.status(201).send();
});


router.get('/:id', defaultIdParamRouteHandler(Method.GET));
router.patch('/:id', defaultIdParamRouteHandler(Method.PATCH));
router.delete('/:id', defaultIdParamRouteHandler(Method.DELETE));

export default router;

import { Router } from "express";
import Logger from "../logger/logger";
import { checkContentTypeEquals } from "./middleware";
import { PolicyController } from "../controllers";
import { MemoryPolicyStore } from "../stores";
import { defaultIdParamRouteHandler, defaultRouteHandler, Method } from "../util";

const router = Router();
const controller = new PolicyController(
    new MemoryPolicyStore()
);

router.get('/', defaultRouteHandler(Method.GET));

router.post('/', checkContentTypeEquals('text/turtle'));
router.post('/', async (request, response) => {
    Logger.info(`Received POST for ${request.baseUrl}`);

    const clientID = request.headers['authorization'];
    if (request.body) await controller.addPolicy(request.body, clientID);
    
    response.status(201).send();
});


router.get('/:id', defaultIdParamRouteHandler(Method.GET));
router.patch('/:id', defaultIdParamRouteHandler(Method.PATCH));

export default router;

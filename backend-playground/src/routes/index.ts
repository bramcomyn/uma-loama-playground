import { Router } from "express";
import { checkContentTypeEquals } from "./middleware";
import { logIdRequest, logRequest, Method } from "../util";

type Controller = ReturnType<typeof import("../controllers/request-controller").default> |
                  ReturnType<typeof import("../controllers/policy-controller").default>;

export function createRouter(controller: Controller, patchContentType: string) {
    const router = Router();

    router.get('/', async (req, res) => {
        logRequest(Method.GET, req);

        const clientID = req.headers['authorization'];
        const { message, status } = await controller.getEntities(clientID) || { message: '', status: 500 };

        res.status(status).send(message);
    });

    router.post('/', checkContentTypeEquals('text/turtle'));
    router.post('/', async (req, res) => {
        logRequest(Method.POST, req);

        const clientID = req.headers['authorization'];
        let status = 500;
        if (req.body) status = await controller.addEntity(req.body, clientID);

        res.status(status).send();
    });

    router.get('/:id', async (req, res) => {
        logIdRequest(Method.GET, req);

        const clientID = req.headers['authorization'];
        const { message, status } = await controller.getEntity(req.params.id, clientID) || { message: '', status: 500 };

        res.status(status).send(message);
    });

    router.patch('/:id', checkContentTypeEquals(patchContentType));
    router.patch('/:id', async (req, res) => {
        logIdRequest(Method.PATCH, req);

        const clientID = req.headers['authorization'];
        let status = 500;

        if (req.body) {
            if (patchContentType === 'application/json') {
                const body = JSON.parse(req.body);
                if (body.status) status = await controller.patchEntity(req.params.id, body.status, clientID, false);
            } else {
                status = await controller.patchEntity(req.params.id, req.body, clientID);
            }
        }

        res.status(status).send();
    });

    router.delete('/:id', async (req, res) => {
        logIdRequest(Method.DELETE, req);

        const clientID = req.headers['authorization'];
        await controller.deleteEntity(req.params.id, clientID);

        res.status(204).send();
    });

    return router;
}

export * as policies from './policies';
export * as requests from './requests';

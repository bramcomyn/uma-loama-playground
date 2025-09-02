import { Request, Response } from "express";
import Logger from "../logger/logger";

export const checkAuthorizationHeader = (request: Request, response: Response, next: Function) => {
    if (typeof request.headers['authorization'] === 'string' || request.method === 'OPTIONS')
        next();
    else {
        Logger.error(`Received request without required 'authorization' header`);
        response.status(400).send({ message: 'Bad request' });
    }
};

export const addCORSHeaders = (request: Request, response: Response, next: Function) => {
    Logger.debug(`adding CORS headers`);

    response.header('access-control-allow-origin', '*');
    response.header('access-control-allow-methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    response.header('access-control-allow-headers', 'content-type, authorization');

    if (request.method === "OPTIONS") {
        response.sendStatus(204);
    } else next();
};

export const checkContentTypeEquals = (type: string) =>
    (request: Request, response: Response, next: Function) => {
        const contentType = request.headers['content-type'];
        if (contentType === type) next();
        else {
            Logger.error(`Received incorrect content type (must be ${type}, was ${contentType})`);
            response.status(415).send({ message: `content type must be '${type}'` });
        }
};

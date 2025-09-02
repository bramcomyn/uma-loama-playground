import { Request, Response } from "express";
import Logger from "./logger/logger";

export enum Method {
    GET     = 'GET',
    POST    = 'POST',
    PATCH   = 'PATCH',
    DELETE  = 'DELETE',
    PUT     = 'PUT',
    OPTIONS = 'OPTIONS'
}

const baseHandler = (meth: Method, includeId: boolean) => 
    (req: Request, res: Response) => {
        const path = includeId ? `${req.baseUrl}/${req.params.id}` : req.baseUrl;
        Logger.info(`Received ${meth} for ${path}`);
        res.status(204).send();
    };

export const defaultRouteHandler = (meth: Method) => baseHandler(meth, false);
export const defaultIdParamRouteHandler = (meth: Method) => baseHandler(meth, true);

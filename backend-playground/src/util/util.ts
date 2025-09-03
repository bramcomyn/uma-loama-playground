import { Request, Response } from "express";
import Logger from "../logger";

export enum Method {
    GET     = 'GET',
    POST    = 'POST',
    PATCH   = 'PATCH',
    DELETE  = 'DELETE',
    PUT     = 'PUT',
    OPTIONS = 'OPTIONS'
}

const baseRouteLog = (meth: Method, req: Request, includeID: boolean): void => { Logger.info(`Received ${meth} for ${req.baseUrl}/${includeID ? req.params.id : ''}`); }
export const logRequest = (meth: Method, req: Request) => baseRouteLog(meth, req, false);
export const logIdRequest = (meth: Method, req: Request) => baseRouteLog(meth, req, true);

const baseHandler = (meth: Method, includeID: boolean) => 
    (req: Request, res: Response) => {
        const path = includeID ? `${req.baseUrl}/${req.params.id}` : req.baseUrl;
        Logger.info(`Received ${meth} for ${path}`);
        res.status(204).send();
    };

export const defaultRouteHandler = (meth: Method) => baseHandler(meth, false);
export const defaultIdParamRouteHandler = (meth: Method) => baseHandler(meth, true);

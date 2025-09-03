import { Store } from "../stores";
import { BaseController } from ".";
import { sanitizeDeleteRequest, sanitizeGetRequest, sanitizeGetRequests, sanitizePatchRequest, sanitizePostRequest } from "../util";

const requestController = (store: Store) =>
    new BaseController(
        store,
        "Already existing requests found",
        sanitizePostRequest,
        sanitizeDeleteRequest,
        sanitizeGetRequests,
        sanitizeGetRequest,
        sanitizePatchRequest
    );

export default requestController;

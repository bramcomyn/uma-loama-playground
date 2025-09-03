import { store } from "../stores";
import { createRouter } from ".";
import requestController from "../controllers/request-controller";

export const router = createRouter(requestController(store), 'application/json');
export default router;

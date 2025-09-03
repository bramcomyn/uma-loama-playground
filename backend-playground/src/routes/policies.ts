import { store } from "../stores";
import { createRouter } from ".";
import policyController from "../controllers/policy-controller";

export const router = createRouter(policyController(store), 'application/sparql-update');
export default router;

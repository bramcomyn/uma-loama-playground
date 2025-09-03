import { Store } from "../stores";
import { BaseController } from ".";
import { sanitizeDeletePolicy, sanitizeGetPolicies, sanitizeGetPolicy, sanitizePatchPolicy, sanitizePostPolicy } from "../util";

const policyController = (store: Store) =>
    new BaseController(
        store,
        "Already existing policies found",
        sanitizePostPolicy,
        sanitizeDeletePolicy,
        sanitizeGetPolicies,
        sanitizeGetPolicy,
        sanitizePatchPolicy
    );

export default policyController;

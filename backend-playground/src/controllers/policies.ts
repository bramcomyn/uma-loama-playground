import { parseStringAsN3Store } from "koreografeye";
import { PolicyStore } from "../stores";
import { noAlreadyDefinedSubjects, sanitizePolicy } from "./sanitization";
import Logger from "../logger/logger";

export class PolicyController {
    constructor(
        private readonly store: PolicyStore
    ) {

    }

    public async addPolicy(data: string, clientID: string) {
        const store = await parseStringAsN3Store(data);
        const sanitizedStore = await sanitizePolicy(store, clientID);

        if (noAlreadyDefinedSubjects(this.store.getStore(), sanitizedStore))
            this.store.addPolicy(sanitizedStore);
        else {
            Logger.error(`Already existing policies found`);
            throw new Error(`Cannot create existing policies`);
        }
    }
}

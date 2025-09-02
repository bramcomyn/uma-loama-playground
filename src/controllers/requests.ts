import { parseStringAsN3Store } from "koreografeye";
import { RequestStore } from "../stores";
import { noAlreadyDefinedSubjects, sanitizeRequest } from "./sanitization";
import Logger from "../logger/logger";

export class RequestController {
    constructor(
        private readonly store: RequestStore
    ) {

    }

    public async addRequest(data: string, clientID: string) {
        const store = await parseStringAsN3Store(data);
        const sanitizedStore = await sanitizeRequest(store, clientID);

        if (noAlreadyDefinedSubjects(this.store.getStore(), sanitizedStore))
            this.store.addRequest(sanitizedStore);
        else {
            Logger.error(`Already existing access requests found`);
            throw new Error(`Cannot create existing access requests`);
        }
    }
}

export * from './policy-controller';
export * from './request-controller';

import { parseStringAsN3Store } from "koreografeye";
import { Store as N3Store, Writer } from "n3";
import { Store } from "../stores";
import { noAlreadyDefinedSubjects } from "../util";
import Logger from "../logger";

export class BaseController {
    constructor(
        protected readonly store: Store,
        protected readonly conflictMessage: string,
        protected readonly sanitizePost: (store: N3Store, clientID: string) => Promise<N3Store>,
        protected readonly sanitizeDelete: (store: N3Store, entityID: string, clientID: string) => Promise<void>,
        protected readonly sanitizeGets: (store: N3Store, clientID: string) => Promise<N3Store>,
        protected readonly sanitizeGet: (store: N3Store, entityID: string, clientID: string) => Promise<N3Store>,
        protected readonly sanitizePatch: (store: N3Store, entityID: string, clientID: string, patchInformation: string) => Promise<void>
    ) {}

    protected async writeStore(store: N3Store): Promise<string> {
        const writer = new Writer({ format: 'text/turtle' });
        writer.addQuads(store.getQuads(null, null, null, null));

        return new Promise<string>((resolve, reject) => {
            writer.end((error, result) => {
                if (error) reject(error);
                else resolve(result);
            });
        });
    }

    public async getEntities(clientID: string): Promise<{ message: string, status: number }> {
        const store = await this.sanitizeGets(this.store.getStore(), clientID);
        const message = store.size > 0
            ? await this.writeStore(store)
            : '';

        const status = message === ''
            ? 404 : 200;

        return { message, status };
    }

    public async getEntity(entityID: string, clientID: string): Promise<{ message: string, status: number }> {
        const store = await this.sanitizeGet(this.store.getStore(), entityID, clientID);
        const message = store.size > 0
            ? await this.writeStore(store)
            : '';

        const status = message === ''
            ? 404 : 200;

        return { message, status };
    }

    public async addEntity(data: string, clientID: string): Promise<number> {
        const store = await parseStringAsN3Store(data);
        const sanitizedStore = await this.sanitizePost(store, clientID);

        // check for redefinition ==> refuse
        if (noAlreadyDefinedSubjects(this.store.getStore(), sanitizedStore))
            this.store.add(sanitizedStore);
        else {
            Logger.error(this.conflictMessage);
            return 409;
        }

        return 201;
    }

    public async deleteEntity(entityID: string, clientID: string): Promise<number> {
        await this.sanitizeDelete(this.store.getStore(), entityID, clientID);
        return 204;
    }

    public async patchEntity(entityID: string, patchInformation: string, clientID: string, isolate: boolean = true): Promise<number> {
        let store: N3Store;
        if (isolate) { // isolate all information about this entity
            store = await this.sanitizeGet(this.store.getStore(), entityID, clientID);
            this.store.getStore().removeQuads(store.getQuads(null, null, null, null));
        } else store = this.store.getStore();

        // update the information
        await this.sanitizePatch(store, entityID, clientID, patchInformation);

        if (isolate) {
            // isolate information again to make sure nothing is changed about the structure of the entity
            // * bonus: filters out all extra quads that could be defined in the store
            // ! drawback: PATCH may still be used to DELETE all information
            // TODO: check if PATCH is smth we want for all resources, make patchEntity optional otherwise
            store = await this.sanitizeGet(store, entityID, clientID);
            this.store.getStore().addAll(store);
        }

        return 204;
    }
}

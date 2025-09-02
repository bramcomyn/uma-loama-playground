import { Store } from "n3";

export interface RequestStore {
    getStore(): Store;
    addRequest(store: Store): void;
}

export class MemoryRequestStore implements RequestStore {
    private readonly store: Store = new Store();

    constructor() { }

    public getStore() {
        return this.store;
    }

    public addRequest(store: Store): void {
        this.store.addQuads(store.getQuads(null, null, null, null));
    }
}

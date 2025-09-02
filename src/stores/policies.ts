import { Store } from "n3";

export interface PolicyStore {
    getStore(): Store;
    addPolicy(store: Store): void;
}

export class MemoryPolicyStore implements PolicyStore {
    private readonly store: Store = new Store();

    constructor() { }

    public getStore() {
        return this.store;
    }

    public addPolicy(store: Store) {
        this.store.addQuads(store.getQuads(null, null, null, null));
    }
}

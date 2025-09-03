import { Store as N3Store } from 'n3';

export interface Store {
    getStore(): N3Store;
    add(store: N3Store): void;
}

export class MemoryStore {
    private readonly store: N3Store = new N3Store();

    constructor() {}

    public getStore() { return this.store; }

    public add(store: N3Store) {
        this.store.addAll(store);
    }
}

export const store = new MemoryStore();

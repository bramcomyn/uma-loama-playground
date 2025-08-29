import { Store } from 'n3';
import { QueryEngine } from '@comunica/query-sparql';
import { QueryEngineError } from '../util/errors';

export interface AccessRequestStorage {
    getStore: () => Store;
    addAccessRequest: (request: Store) => Promise<void>;
    getAccessRequests: (requester: string) => Promise<Store>;
    updateAccessRequest: (query: string) => Promise<void>;
    deleteAccessRequest: (query: string) => Promise<void>;
}

export class MemoryAccessRequestStorage implements AccessRequestStorage {
    private store: Store = new Store();

    public getStore(): Store {
        return this.store;
    }

    public async addAccessRequest(request: Store): Promise<void> {
        this.store.addQuads(request.getQuads(null, null, null, null));
    }

    // alternatief: query engine uit communica gebruiken
    public async getAccessRequests(requester: string): Promise<Store> {
        const quads = this.store.getQuads(null, "https://w3id.org/force/sotw#requestingParty", requester, null); // TODO: change prefix by Vocabulary element
        return new Store(
            quads.flatMap((quad) => this.store.getQuads(quad.subject, null, null, null))
        );
    }

    public async updateAccessRequest(query: string): Promise<void> {
        try {
            await new QueryEngine().queryVoid(query, { sources: [this.getStore()] });
        } catch {
            throw new QueryEngineError();
        }
    }

    public async deleteAccessRequest(query: string): Promise<void> {
        try {
            await new QueryEngine().queryVoid(query, { sources: [this.getStore()] });
        } catch {
            throw new QueryEngineError();
        }
    }
}

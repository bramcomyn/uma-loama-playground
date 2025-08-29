import type { AccessRequestStorage } from "../storages/access-request-storage";
import { Parser, Writer, Store } from "n3";

export class AccessRequestController {
    public constructor(
        private readonly store: AccessRequestStorage
    ) {

    }

    private parseTurtle(data: string): void {
        const parser = new Parser()
        parser.parse(data, {
            onQuad: (error, quad) => { if (quad) this.store.getStore().addQuad(quad); }
        });
    }

    private writeToTurtle(store: Store): string {
        const writer = new Writer();
        let result: string = '';

        writer.addQuads(store.getQuads(null, null, null, null));
        writer.end((_, quad) => result = quad);

        return result;
    }

    public async addAccessRequest(data: string): Promise<void> {
        this.parseTurtle(data);
    }

    public async getAccessRequests(requestingPartyId: string): Promise<string> {
        const store = await this.store.getAccessRequests(requestingPartyId);
        return this.writeToTurtle(store);
    }

    public async updateAccessRequest(query: string): Promise<void> {
        await this.store.updateAccessRequest(query);
    }
}

import { Store } from "n3";
import Logger from "../logger/logger";
import { QueryEngine } from "@comunica/query-sparql";

const queryEngine = new QueryEngine();

const sanitize = async (
    store: Store,
    clientID: string,
    query: string,
    vars: string[]
): Promise<Store> => {
    Logger.info(`Sanitizing new data for ${clientID}`);
    const result = new Store();

    const bindings = await queryEngine.queryBindings(query, { sources: [store] });
    const results: Store[] = [];

    for await (const binding of bindings) {
        Logger.debug(`Binding found: ${binding.toString()}`);

        const subStore = new Store();
        let valid = true;

        for (const v of vars) {
            const term = binding.get(v);
            
            if (!term) {
                valid = false;
                break;
            }

            subStore.addQuads(store.getQuads(term, null, null, null));
        }

        if (valid) results.push(subStore);
    }

    if (results.length !== 1) {
        Logger.error(`Detected ${results.length} entities in a single POST`);
        throw new SanitizationError(`too many or too few entities defined`);
    }

    result.addAll(results[0]);
    return result;
};

const policyQuery = (clientID: string) => `
    PREFIX odrl: <http://www.w3.org/ns/odrl/2/>
    PREFIX dct: <http://purl.org/dc/terms/>

    SELECT ?p ?r
    WHERE {
        ?p a odrl:Agreement ;
           odrl:permission ?r ;
           odrl:uid ?p .

        ?r a odrl:Permission ;
           odrl:action ?action ;
           odrl:target ?target ;
           odrl:assignee ?assignee ;
           odrl:assigner <${clientID}> .
    }
`;

export const sanitizePolicy = (store: Store, clientID: string) =>
    sanitize(store, clientID, policyQuery(clientID), ["p", "r"]);

const requestQuery = (clientID: string) => `
    PREFIX ex: <http://example.org/>
    PREFIX sotw: <https://w3id.org/force/sotw#>
    PREFIX dcterms: <http://purl.org/dc/terms/>

    SELECT ?r
    WHERE {
        ?r a sotw:EvaluationRequest ;
           dcterms:issued ?date ;
           sotw:requestedTarget ?target ;
           sotw:requestedAction ?action ;
           sotw:requestingParty <${clientID}> ;
           ex:requestStatus ex:requested .
    }
`;

export const sanitizeRequest = (store: Store, clientID: string) =>
    sanitize(store, clientID, requestQuery(clientID), ["r"]);

export const noAlreadyDefinedSubjects = (store: Store, newStore: Store): boolean =>
    newStore.getSubjects(null, null, null)
        .every((subject) => store.countQuads(subject, null, null, null) === 0);

export class SanitizationError extends Error {
    constructor(reason: string) { super(`Sanitization failed: ${reason}`); }
}

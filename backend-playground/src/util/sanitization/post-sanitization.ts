import { Store } from "n3";
import Logger from "../../logger";
import { queryEngine } from ".";

const sanitizePost = async (
    store: Store,
    query: string,
    vars: string[]
): Promise<Store> => {
    const result = new Store();

    const bindings = await queryEngine.queryBindings(query, { sources: [store] });
    const results: Store[] = [];

    for await (const binding of bindings) {
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

const postPolicyQuery = (clientID: string) => `
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

export const sanitizePostPolicy = (store: Store, clientID: string) =>
    sanitizePost(store, postPolicyQuery(clientID), ["p", "r"]);

const postRequestQuery = (clientID: string) => `
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

export const sanitizePostRequest = (store: Store, clientID: string) =>
    sanitizePost(store, postRequestQuery(clientID), ["r"]);

export const noAlreadyDefinedSubjects = (store: Store, newStore: Store): boolean =>
    newStore.getSubjects(null, null, null)
        .every((subject) => store.countQuads(subject, null, null, null) === 0);

export class ConflictError extends Error {
    constructor() { super(`Resource already exists`); }
}

export class SanitizationError extends Error {
    constructor(reason: string) { super(`Sanitization failed: ${reason}`); }
}

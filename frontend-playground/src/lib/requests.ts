import { v4 as uuidv4 } from "uuid";

export enum Method {
    GET = "GET",
    POST = "POST",
    PATCH = "PATCH",
    DELETE = "DELETE",
}

export enum Party {
    RO = "Resource Owner",
    RP = "Requesting Party",
}

interface RequestConfiguration {
    url: string;
    headers: HeadersInit;
    method: string;
    body?: string;
}

type BodyBuilder = (
    method: Method,
    id: string,
    uri: string
) => string | object | undefined;

interface RequestOptions {
    method: Method;
    url: string;
    id: string;
    selected?: string;
    bodyBuilder: BodyBuilder;
    requireSelectionFor?: Method[];
    sendJSONinsteadofSPARQLUpdate: boolean,
}

const sendRequest = async ({
    method,
    url,
    id,
    selected,
    bodyBuilder,
    requireSelectionFor = [],
    sendJSONinsteadofSPARQLUpdate
}: RequestOptions): Promise<{
    request: string;
    response: Response;
    created?: string;
}> => {
    const resourceURI = selected || uuidv4();
    const headers: HeadersInit = {
        Authorization: id,
    };

    if (requireSelectionFor.includes(method) && !selected) {
        throw new Error(
            `${method} requires "selected" to be provided`
        );
    }
    
    if (method === Method.POST) {
        headers["Content-Type"] = "text/turtle";
    } else if (method === Method.PATCH) {
        headers["Content-Type"] = sendJSONinsteadofSPARQLUpdate ? "application/json" : "application/sparql-update";
    }

    const requestBody = bodyBuilder(method, id, resourceURI);

    const isPatchOrDelete =
        method === Method.PATCH || method === Method.DELETE;
    const fetchURL = isPatchOrDelete
        ? `${url}/${encodeURIComponent(`http://example.org/${resourceURI}`)}`
        : url;

    const requestConfiguration: RequestConfiguration = {
        url: fetchURL,
        headers,
        method,
        body: typeof requestBody === 'object' ? JSON.stringify(requestBody) : requestBody?.toString(),
    };

    const response = await fetch(
        requestConfiguration.url,
        requestConfiguration
    );

    return {
        request: `${method} ${fetchURL} ${requestBody || ""}`,
        response,
        created: method === Method.POST ? resourceURI : undefined,
    };
};

const policyBodyBuilder: BodyBuilder = (method, id, uri) => {
    switch (method) {
        case Method.POST:
            const permissionURI = uuidv4();
            return `
            @prefix ex: <http://example.org/>.
            @prefix odrl: <http://www.w3.org/ns/odrl/2/> .
            @prefix dct: <http://purl.org/dc/terms/>.

            ex:${uri} a odrl:Agreement ;
                       odrl:permission ex:${permissionURI} ;
                       odrl:uid ex:${uri} .
            ex:${permissionURI} a odrl:Permission ;
                       odrl:action odrl:read ;
                       odrl:target <http://localhost:3000/resources/resource.txt> ;
                       odrl:assignee <https://example.pod.knows.idlab.ugent.be/profile/card#me> ;
                       odrl:assigner <${id}> .`;
        case Method.PATCH:
            return `
            PREFIX odrl: <http://www.w3.org/ns/odrl/2/>

            DELETE { ?policy odrl:action odrl:read }
            INSERT { ?policy odrl:action odrl:write }
            WHERE  { ?policy odrl:target <http://localhost:3000/resources/resource.txt> }`;
        default:
            return undefined;
    }
};

const accessBodyBuilder: BodyBuilder = (method, id, uri) => {
    switch (method) {
        case Method.POST:
            return `
            @prefix sotw: <https://w3id.org/force/sotw#> .
            @prefix odrl: <http://www.w3.org/ns/odrl/2/> .
            @prefix dcterms: <http://purl.org/dc/terms/> .
            @prefix dct: <http://purl.org/dc/terms/> .
            @prefix ex: <http://example.org/> .
            @prefix xsd: <http://www.w3.org/2001/XMLSchema#> .

            ex:${uri} a sotw:EvaluationRequest ;
                odrl:uid ex:${uri} ;
                dcterms:issued "2025-08-21T11:24:34.999Z"^^xsd:datetime ;
                sotw:requestedTarget <http://localhost:3000/resources/resource.txt> ;
                sotw:requestedAction odrl:read ;
                sotw:requestingParty <${id}> ;
                ex:requestStatus ex:requested .`;
        case Method.PATCH:
            return { status: 'accepted' };
        default:
            return undefined;
    }
};

export const sendPolicyRequest = (method: Method, url: string, id: string, selected?: string) =>
    sendRequest({
        method,
        url,
        id,
        selected,
        bodyBuilder: policyBodyBuilder,
        requireSelectionFor: [Method.PATCH, Method.DELETE],
        sendJSONinsteadofSPARQLUpdate: false
    });

export const sendAccessRequest = (method: Method, url: string, id: string, selected?: string) =>
    sendRequest({
        method,
        url,
        id,
        selected,
        bodyBuilder: accessBodyBuilder,
        requireSelectionFor: [Method.PATCH],
        sendJSONinsteadofSPARQLUpdate: true
    });

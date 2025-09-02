import { v4 as uuidv4 } from 'uuid';

export enum Method {
    GET = 'GET',
    POST = 'POST',
    PATCH = 'PATCH',
    DELETE = 'DELETE',
};

export enum Party {
    RO = "Resource Owner",
    RP = "Requesting Party"
};

interface RequestConfiguration {
    url: string;
    headers: HeadersInit;
    method: string;
    body?: string
}

export const sendPolicyRequest = async (
    method: Method,
    url: string,
    id: string,
    selected?: string
) : Promise<{ request: string, response: Response, created?: string }> => {
    let requestBody: string | undefined = undefined;
    const policyURI = selected || uuidv4();
    const permissionURI = uuidv4();
    const headers: HeadersInit = {
        'Authorization': id
    }

    switch (method) {
        case Method.POST :
            headers['Content-Type'] = 'text/turtle';
            requestBody = `
            @prefix ex: <http://example.org/>.
            @prefix odrl: <http://www.w3.org/ns/odrl/2/> .
            @prefix dct: <http://purl.org/dc/terms/>.

            ex:${policyURI} a odrl:Agreement ;
                           odrl:permission ex:${permissionURI} ;
                           odrl:uid ex:${policyURI} .
            ex:${permissionURI} a odrl:Permission ;
                          odrl:action odrl:read ;
                          odrl:target <http://localhost:3000/resources/resource.txt> ;
                          odrl:assignee <https://example.pod.knows.idlab.ugent.be/profile/card#me> ;
                          odrl:assigner <${id}> .`;
            break ;
        case Method.PATCH :
            headers['Content-Type'] = 'application/sparql-update';
            requestBody = `
            PREFIX odrl: <http://www.w3.org/ns/odrl/2/>

            DELETE {
                ?policy odrl:action odrl:read
            } INSERT {
                ?policy odrl:action odrl:write
            } WHERE {
                ?policy odrl:target <http://localhost:3000/resources/resource.txt>
            }`;
            break ;
        case Method.GET :
        default :
            break ;
    }

    if (!selected && method === Method.PATCH) throw new Error("selected is required for PATCH");
    const fetchURL = method === Method.PATCH ? `${url}/${encodeURIComponent(`https://example.org/${policyURI}`)}` : url;

    const requestConfiguration: RequestConfiguration = {
        url: fetchURL,
        headers: headers,
        method: method,
        body: requestBody
    }

    const response = await fetch(requestConfiguration.url, requestConfiguration);

    return {
        request: `${method} ${fetchURL} ${requestBody || ''}`,
        response: response,
        created: method === Method.POST ? policyURI : undefined
    }
};

export const sendAccessRequest = async (
    method: Method,
    url: string,
    id: string,
    selected?: string
) : Promise<{ request: string, response: Response, created?: string }> => {
    let requestBody: string | undefined = undefined;
    const requestURI = selected || uuidv4();
    const headers: HeadersInit = {
        'Authorization': id
    }

    switch(method) {
        case Method.POST :
            headers['Content-Type'] = 'text/turtle';
            requestBody = `
            @prefix sotw: <https://w3id.org/force/sotw#> .
            @prefix odrl: <http://www.w3.org/ns/odrl/2/> .
            @prefix dcterms: <http://purl.org/dc/terms/> .
            @prefix dct: <http://purl.org/dc/terms/> .
            @prefix ex: <http://example.org/> .
            @prefix xsd: <http://www.w3.org/2001/XMLSchema#> .

            ex:${requestURI} a sotw:EvaluationRequest ;
                dcterms:issued "2025-08-21T11:24:34.999Z"^^xsd:datetime ;
                sotw:requestedTarget <http://localhost:3000/resources/resource.txt> ;
                sotw:requestedAction odrl:read ;
                sotw:requestingParty <${id}> ;
                ex:requestStatus ex:requested .`;
            break ;
        case Method.PATCH :
            headers['Content-Type'] = 'application/sparql-update';
            requestBody = `
            PREFIX ex: <http://example.org/>
            PREFIX sotw: <http://w3id.org/force/sotw#>

            DELETE {
                ?request ex:requestStatus ex:requested .
            } INSERT {
                ?request ex:requestStatus ex:accepted .
            } WHERE {
                ?request a sotw:EvaluationRequest .
            }`;
            break ;
        case Method.GET :
        default : 
            break ;
    }

    if (!selected && method === Method.PATCH) throw new Error("selected is required for PATCH");
    const fetchURL = method === Method.PATCH ? `${url}/${encodeURIComponent(`https://example.org/${requestURI}`)}` : url;

    const requestConfiguration: RequestConfiguration = {
        url: fetchURL,
        headers: headers,
        method: method,
        body: requestBody
    }

    const response = await fetch(requestConfiguration.url, requestConfiguration);

    return {
        request: `${method} ${fetchURL} ${requestBody || ''}`,
        response: response,
        created: method === Method.POST ? requestURI : undefined
    }
}

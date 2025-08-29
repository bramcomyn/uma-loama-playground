curl -X PATCH --location 'http://localhost:3000/' \
--header 'Authorization: https://example.pod.knows.idlab.ugent.be/profile/card#me' \
--header 'Content-Type: application/sparql-update' \
--data-raw '
PREFIX ex: <https://example.org/>
PREFIX sotw: <https://w3id.org/force/sotw#>

DELETE {
    ?request ex:requestStatus ex:requested .
} INSERT {
    ?request ex:requestStatus ex:accepted . # change to `ex:denied` in order to deny
} WHERE {
    ?request sotw:requestedTarget <http://localhost:3000/resources/resource.txt> .
}
'

curl --location 'http://localhost:3000/' \
--header 'Authorization: https://example.pod.knows.idlab.ugent.be/profile/card#me' \
--header 'Content-Type: text/turtle' \
--data-raw '
@prefix sotw: <https://w3id.org/force/sotw#> .
@prefix odrl: <https://www.w3.org/ns/odrl/2/> .
@prefix dcterms: <https://purl.org/dc/terms/> .
@prefix dct: <https://purl.org/dc/terms/> .
@prefix ex: <https://example.org/> .
@prefix xsd: <https://www.w3.org/2001/XMLSchema#> .

ex:request a sotw:EvaluationRequest ;
      dcterms:issued "2025-08-21T11:24:34.999Z"^^xsd:datetime ;
      sotw:requestedTarget <http://localhost:3000/resources/resource.txt> ;
      sotw:requestedAction odrl:read ;
      sotw:requestingParty <https://example.pod.knows.idlab.ugent.be/profile/card#me> ;
      ex:requestStatus ex:requested .
'

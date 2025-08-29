export class MethodNotImplementedError extends Error {
    public constructor() {
        super("Method not Implemented");
    }
}

export class QueryEngineError extends Error {
    public constructor() {
        super("Something went wrong in the QueryEngine");
    }
}

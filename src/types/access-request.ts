export interface AccessRequest {
    issueDate: Date;
    target: string;
    action: "read" | "write" | "append" | "create" | "control";
    requester: string;
    status: "requested" | "accepted" | "denied";
}

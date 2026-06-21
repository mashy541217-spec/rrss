"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkspaceCreated = void 0;
class WorkspaceCreated {
    workspaceId;
    name;
    ownerId;
    occurredAt;
    constructor(workspaceId, name, ownerId) {
        this.workspaceId = workspaceId;
        this.name = name;
        this.ownerId = ownerId;
        this.occurredAt = new Date();
    }
    getAggregateId() {
        return this.workspaceId;
    }
}
exports.WorkspaceCreated = WorkspaceCreated;

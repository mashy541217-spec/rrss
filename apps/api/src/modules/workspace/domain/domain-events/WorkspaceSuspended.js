"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkspaceSuspended = void 0;
class WorkspaceSuspended {
    workspaceId;
    occurredAt;
    constructor(workspaceId) {
        this.workspaceId = workspaceId;
        this.occurredAt = new Date();
    }
    getAggregateId() {
        return this.workspaceId;
    }
}
exports.WorkspaceSuspended = WorkspaceSuspended;

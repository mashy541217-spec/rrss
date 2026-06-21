"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkspaceArchived = void 0;
class WorkspaceArchived {
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
exports.WorkspaceArchived = WorkspaceArchived;

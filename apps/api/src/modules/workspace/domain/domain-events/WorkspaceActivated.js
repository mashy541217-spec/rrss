"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkspaceActivated = void 0;
class WorkspaceActivated {
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
exports.WorkspaceActivated = WorkspaceActivated;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkspaceSettingsUpdated = void 0;
class WorkspaceSettingsUpdated {
    workspaceId;
    newSettings;
    occurredAt;
    constructor(workspaceId, newSettings) {
        this.workspaceId = workspaceId;
        this.newSettings = newSettings;
        this.occurredAt = new Date();
    }
    getAggregateId() {
        return this.workspaceId;
    }
}
exports.WorkspaceSettingsUpdated = WorkspaceSettingsUpdated;

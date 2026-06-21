"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkspaceArchivedException = void 0;
const WorkspaceException_1 = require("./WorkspaceException");
class WorkspaceArchivedException extends WorkspaceException_1.WorkspaceException {
    constructor(message) {
        super(message, 'WORKSPACE_ARCHIVED');
    }
}
exports.WorkspaceArchivedException = WorkspaceArchivedException;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkspaceSuspendedException = void 0;
const WorkspaceException_1 = require("./WorkspaceException");
class WorkspaceSuspendedException extends WorkspaceException_1.WorkspaceException {
    constructor(message) {
        super(message, 'WORKSPACE_SUSPENDED');
    }
}
exports.WorkspaceSuspendedException = WorkspaceSuspendedException;

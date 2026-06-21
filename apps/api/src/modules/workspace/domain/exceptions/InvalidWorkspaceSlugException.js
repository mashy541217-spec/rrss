"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidWorkspaceSlugException = void 0;
const WorkspaceException_1 = require("./WorkspaceException");
class InvalidWorkspaceSlugException extends WorkspaceException_1.WorkspaceException {
    constructor(message) {
        super(message, 'INVALID_WORKSPACE_SLUG');
    }
}
exports.InvalidWorkspaceSlugException = InvalidWorkspaceSlugException;

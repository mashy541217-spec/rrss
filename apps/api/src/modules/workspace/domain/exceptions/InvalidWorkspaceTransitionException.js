"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidWorkspaceTransitionException = void 0;
const WorkspaceException_1 = require("./WorkspaceException");
class InvalidWorkspaceTransitionException extends WorkspaceException_1.WorkspaceException {
    constructor(message) {
        super(message, 'INVALID_WORKSPACE_TRANSITION');
    }
}
exports.InvalidWorkspaceTransitionException = InvalidWorkspaceTransitionException;

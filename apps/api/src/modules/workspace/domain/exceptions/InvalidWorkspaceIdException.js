"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidWorkspaceIdException = void 0;
const WorkspaceException_1 = require("./WorkspaceException");
class InvalidWorkspaceIdException extends WorkspaceException_1.WorkspaceException {
    constructor(message) {
        super(message, 'INVALID_WORKSPACE_ID');
    }
}
exports.InvalidWorkspaceIdException = InvalidWorkspaceIdException;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidWorkspaceNameException = void 0;
const WorkspaceException_1 = require("./WorkspaceException");
class InvalidWorkspaceNameException extends WorkspaceException_1.WorkspaceException {
    constructor(message) {
        super(message, 'INVALID_WORKSPACE_NAME');
    }
}
exports.InvalidWorkspaceNameException = InvalidWorkspaceNameException;

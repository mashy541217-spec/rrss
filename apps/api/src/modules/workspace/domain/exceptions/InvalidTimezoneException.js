"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidTimezoneException = void 0;
const WorkspaceException_1 = require("./WorkspaceException");
class InvalidTimezoneException extends WorkspaceException_1.WorkspaceException {
    constructor(message) {
        super(message, 'INVALID_TIMEZONE');
    }
}
exports.InvalidTimezoneException = InvalidTimezoneException;

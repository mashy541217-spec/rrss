"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkspaceException = void 0;
const domain_1 = require("@rrss-auto/domain");
class WorkspaceException extends domain_1.DomainException {
    constructor(message, code) {
        super(message, code);
    }
}
exports.WorkspaceException = WorkspaceException;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkspaceOwnerId = void 0;
const domain_1 = require("@rrss-auto/domain");
const InvalidWorkspaceIdException_1 = require("../exceptions/InvalidWorkspaceIdException");
class WorkspaceOwnerId extends domain_1.ValueObject {
    constructor(props) {
        super(props);
    }
    get value() {
        return this.props.value;
    }
    static create(value) {
        if (!value || value.trim().length === 0) {
            throw new InvalidWorkspaceIdException_1.InvalidWorkspaceIdException('Workspace owner ID cannot be empty');
        }
        return new WorkspaceOwnerId({ value: value.trim() });
    }
}
exports.WorkspaceOwnerId = WorkspaceOwnerId;

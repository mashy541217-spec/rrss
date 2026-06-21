"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkspaceName = void 0;
const domain_1 = require("@rrss-auto/domain");
const InvalidWorkspaceNameException_1 = require("../exceptions/InvalidWorkspaceNameException");
class WorkspaceName extends domain_1.ValueObject {
    constructor(props) {
        super(props);
    }
    get value() {
        return this.props.value;
    }
    static create(value) {
        if (!value) {
            throw new InvalidWorkspaceNameException_1.InvalidWorkspaceNameException('Workspace name cannot be null or undefined');
        }
        const trimmedValue = value.trim();
        if (trimmedValue.length < 3 || trimmedValue.length > 100) {
            throw new InvalidWorkspaceNameException_1.InvalidWorkspaceNameException('Workspace name must be between 3 and 100 characters');
        }
        return new WorkspaceName({ value: trimmedValue });
    }
}
exports.WorkspaceName = WorkspaceName;

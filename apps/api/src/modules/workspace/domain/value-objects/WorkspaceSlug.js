"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkspaceSlug = void 0;
const domain_1 = require("@rrss-auto/domain");
const InvalidWorkspaceSlugException_1 = require("../exceptions/InvalidWorkspaceSlugException");
class WorkspaceSlug extends domain_1.ValueObject {
    constructor(props) {
        super(props);
    }
    get value() {
        return this.props.value;
    }
    static create(value) {
        if (!value) {
            throw new InvalidWorkspaceSlugException_1.InvalidWorkspaceSlugException('Workspace slug cannot be empty');
        }
        const trimmedValue = value.trim();
        const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
        if (!slugRegex.test(trimmedValue)) {
            throw new InvalidWorkspaceSlugException_1.InvalidWorkspaceSlugException(`Slug '${trimmedValue}' is invalid. It must be lowercase, alphanumeric, and may contain hyphens.`);
        }
        return new WorkspaceSlug({ value: trimmedValue });
    }
}
exports.WorkspaceSlug = WorkspaceSlug;

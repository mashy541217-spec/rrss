"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkspaceLimits = void 0;
const domain_1 = require("@rrss-auto/domain");
class WorkspaceLimits extends domain_1.ValueObject {
    constructor(props) {
        super(props);
    }
    get maxBusinesses() {
        return this.props.maxBusinesses;
    }
    get maxConcurrentExecutions() {
        return this.props.maxConcurrentExecutions;
    }
    get maxProxies() {
        return this.props.maxProxies;
    }
    get maxVms() {
        return this.props.maxVms;
    }
    static create(props) {
        if (props.maxBusinesses < 0 ||
            props.maxConcurrentExecutions < 0 ||
            props.maxProxies < 0 ||
            props.maxVms < 0) {
            throw new Error('Workspace limits cannot be negative');
        }
        return new WorkspaceLimits(props);
    }
}
exports.WorkspaceLimits = WorkspaceLimits;

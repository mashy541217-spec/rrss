"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Workspace = void 0;
const domain_1 = require("@rrss-auto/domain");
const WorkspaceStatus_1 = require("../enums/WorkspaceStatus");
const InvalidWorkspaceTransitionException_1 = require("../exceptions/InvalidWorkspaceTransitionException");
const WorkspaceSuspendedException_1 = require("../exceptions/WorkspaceSuspendedException");
const WorkspaceArchivedException_1 = require("../exceptions/WorkspaceArchivedException");
const WorkspaceSuspended_1 = require("../domain-events/WorkspaceSuspended");
const WorkspaceActivated_1 = require("../domain-events/WorkspaceActivated");
const WorkspaceArchived_1 = require("../domain-events/WorkspaceArchived");
const WorkspaceSettingsUpdated_1 = require("../domain-events/WorkspaceSettingsUpdated");
const WorkspaceCreated_1 = require("../domain-events/WorkspaceCreated");
class Workspace extends domain_1.AggregateRoot {
    constructor(props, id) {
        super(props, id);
    }
    get name() { return this.props.name; }
    get slug() { return this.props.slug; }
    get ownerId() { return this.props.ownerId; }
    get status() { return this.props.status; }
    get settings() { return this.props.settings; }
    get limits() { return this.props.limits; }
    static initialize(props, id) {
        return new Workspace(props, id);
    }
    static createNew(props, id) {
        const workspace = new Workspace(props, id);
        workspace.addDomainEvent(new WorkspaceCreated_1.WorkspaceCreated(id, props.name.value, props.ownerId.value));
        return workspace;
    }
    checkNotArchived() {
        if (this.props.status === WorkspaceStatus_1.WorkspaceStatus.Archived) {
            throw new WorkspaceArchivedException_1.WorkspaceArchivedException('Cannot perform operations on an archived workspace');
        }
    }
    checkNotSuspended() {
        if (this.props.status === WorkspaceStatus_1.WorkspaceStatus.Suspended) {
            throw new WorkspaceSuspendedException_1.WorkspaceSuspendedException('Cannot perform operations on a suspended workspace');
        }
    }
    activate() {
        this.checkNotArchived();
        if (this.props.status === WorkspaceStatus_1.WorkspaceStatus.Active) {
            return; // Idempotent
        }
        if (this.props.status !== WorkspaceStatus_1.WorkspaceStatus.CreationRequested && this.props.status !== WorkspaceStatus_1.WorkspaceStatus.Suspended) {
            throw new InvalidWorkspaceTransitionException_1.InvalidWorkspaceTransitionException(`Cannot transition from ${this.props.status} to Active`);
        }
        this.props.status = WorkspaceStatus_1.WorkspaceStatus.Active;
        this.addDomainEvent(new WorkspaceActivated_1.WorkspaceActivated(this.id));
    }
    suspend() {
        this.checkNotArchived();
        if (this.props.status === WorkspaceStatus_1.WorkspaceStatus.Suspended) {
            return; // Idempotent
        }
        if (this.props.status !== WorkspaceStatus_1.WorkspaceStatus.Active) {
            throw new InvalidWorkspaceTransitionException_1.InvalidWorkspaceTransitionException(`Cannot transition from ${this.props.status} to Suspended`);
        }
        this.props.status = WorkspaceStatus_1.WorkspaceStatus.Suspended;
        this.addDomainEvent(new WorkspaceSuspended_1.WorkspaceSuspended(this.id));
    }
    archive() {
        if (this.props.status === WorkspaceStatus_1.WorkspaceStatus.Archived) {
            return; // Idempotent
        }
        this.props.status = WorkspaceStatus_1.WorkspaceStatus.Archived;
        this.addDomainEvent(new WorkspaceArchived_1.WorkspaceArchived(this.id));
    }
    updateSettings(newSettings) {
        this.checkNotArchived();
        this.checkNotSuspended();
        this.props.settings = newSettings;
        this.addDomainEvent(new WorkspaceSettingsUpdated_1.WorkspaceSettingsUpdated(this.id, newSettings));
    }
    updateLimits(newLimits) {
        this.checkNotArchived();
        this.checkNotSuspended();
        this.props.limits = newLimits;
    }
}
exports.Workspace = Workspace;

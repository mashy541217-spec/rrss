import { Subscription } from '../value-objects/Subscription';
import { Quota } from '../value-objects/Quota';
import { FeatureFlag, DefaultFeatureFlags } from '../value-objects/FeatureFlag';
import { Role } from '../value-objects/Role';

export class OrganizationMember {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly role: Role,
    public readonly joinedAt: Date
  ) {}
}

export class Organization {
  private _members: OrganizationMember[] = [];
  private _flags: FeatureFlag[] = [...DefaultFeatureFlags];

  constructor(
    public readonly id: string,
    public name: string,
    public readonly createdAt: Date,
    public subscription: Subscription,
    public readonly quota: Quota
  ) {}

  public get members(): ReadonlyArray<OrganizationMember> {
    return this._members;
  }

  public get featureFlags(): ReadonlyArray<FeatureFlag> {
    return this._flags;
  }

  addMember(userId: string, role: Role) {
    if (this._members.some(m => m.userId === userId)) {
      throw new Error('User is already a member of this organization');
    }
    if (this._members.length >= this.quota.maxSeats) {
      throw new Error('Organization seat quota exceeded');
    }
    this._members.push(new OrganizationMember(Math.random().toString(), userId, role, new Date()));
  }

  setFeatureFlag(name: string, isEnabled: boolean) {
    const flag = this._flags.find(f => f.name === name);
    if (flag) {
      Object.assign(flag, { isEnabled });
    } else {
      this._flags.push(new FeatureFlag(name, isEnabled));
    }
  }

  isFeatureEnabled(name: string): boolean {
    const flag = this._flags.find(f => f.name === name);
    return flag ? flag.isEnabled : false;
  }
}

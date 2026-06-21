import { ValueObject } from '@rrss-auto/domain';
import { InvalidPermissionIdentifierException } from '../exceptions/InvalidPermissionIdentifierException';

export interface PermissionProps {
  identifier: string;
}

/**
 * Strongly-typed permission Value Object.
 *
 * A permission is identified by a dot-separated string in the format:
 *   `resource.action`
 *
 * Examples:
 *   workspace.create
 *   workspace.delete
 *   business.create
 *   execution.run
 *   vm.start
 *   instagram.publish
 *   tiktok.publish
 *
 * This approach scales better than enums because new permissions can be
 * added without changing the domain model.
 */
export class Permission extends ValueObject<PermissionProps> {
  /** Pattern: one or more dot-separated segments of lowercase alphanumeric + hyphens. */
  private static readonly IDENTIFIER_PATTERN = /^[a-z][a-z0-9-]*(\.[a-z][a-z0-9-]*)+$/;

  private constructor(props: PermissionProps) {
    super(props);
  }

  get identifier(): string {
    return this.props.identifier;
  }

  /** The resource segment (e.g. "workspace" from "workspace.create"). */
  get resource(): string {
    return this.props.identifier.split('.').slice(0, -1).join('.');
  }

  /** The action segment (e.g. "create" from "workspace.create"). */
  get action(): string {
    const parts = this.props.identifier.split('.');
    return parts[parts.length - 1];
  }

  public static create(identifier: string): Permission {
    if (!identifier || identifier.trim().length === 0) {
      throw new InvalidPermissionIdentifierException('Permission identifier cannot be empty');
    }

    const normalised = identifier.trim().toLowerCase();

    if (!Permission.IDENTIFIER_PATTERN.test(normalised)) {
      throw new InvalidPermissionIdentifierException(
        `'${normalised}' is not a valid permission identifier. ` +
          'Expected format: resource.action (e.g., workspace.create)',
      );
    }

    return new Permission({ identifier: normalised });
  }

  /** Convenience factory for well-known platform permissions. */
  static readonly WORKSPACE_CREATE = Permission.create('workspace.create');
  static readonly WORKSPACE_DELETE = Permission.create('workspace.delete');
  static readonly WORKSPACE_SETTINGS_UPDATE = Permission.create('workspace.settings.update');
  static readonly BUSINESS_CREATE = Permission.create('business.create');
  static readonly BUSINESS_DELETE = Permission.create('business.delete');
  static readonly EXECUTION_RUN = Permission.create('execution.run');
  static readonly EXECUTION_CANCEL = Permission.create('execution.cancel');
  static readonly VM_START = Permission.create('vm.start');
  static readonly VM_STOP = Permission.create('vm.stop');
  static readonly INSTAGRAM_PUBLISH = Permission.create('instagram.publish');
  static readonly TIKTOK_PUBLISH = Permission.create('tiktok.publish');
  static readonly MEMBER_INVITE = Permission.create('member.invite');
  static readonly MEMBER_REVOKE = Permission.create('member.revoke');
  static readonly ROLE_MANAGE = Permission.create('role.manage');
}

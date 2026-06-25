export enum Role {
  OWNER = 'OWNER',
  ADMINISTRATOR = 'ADMINISTRATOR',
  MANAGER = 'MANAGER',
  OPERATOR = 'OPERATOR',
  DEVELOPER = 'DEVELOPER',
  VIEWER = 'VIEWER'
}

export class RolePermissions {
  static readonly hierarchy: Record<Role, number> = {
    [Role.OWNER]: 100,
    [Role.ADMINISTRATOR]: 80,
    [Role.MANAGER]: 60,
    [Role.OPERATOR]: 40,
    [Role.DEVELOPER]: 40,
    [Role.VIEWER]: 10
  };

  static hasPermission(userRole: Role, requiredRole: Role): boolean {
    return this.hierarchy[userRole] >= this.hierarchy[requiredRole];
  }
}

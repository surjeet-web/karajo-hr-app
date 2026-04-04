import { ROLE_HIERARCHY, ROLE_PERMISSIONS, SCREEN_PERMISSIONS, APPROVAL_LIMITS, DEPARTMENT_ACCESS, ROLE_FEATURES, PERMISSIONS } from './rbac';

export type Role = keyof typeof ROLE_HIERARCHY;
export type Permission = keyof typeof PERMISSIONS;
export type ScreenName = keyof typeof SCREEN_PERMISSIONS;
export type DepartmentAccess = 'own' | 'all' | 'none';
export type RequestType = 'leave' | 'permission' | 'overtime' | 'expense' | 'payroll';

interface RoleInfo {
  id: Role;
  label: string;
  level: number;
}

interface ApprovalLimit {
  maxDays?: number;
  maxHours?: number;
  maxHoursPerMonth?: number;
  maxAmount?: number;
  escalateTo?: Role | null;
}

interface DepartmentDataItem {
  department: string;
}

export const getRolePermissions = (role: Role): Permission[] => {
  const roleConfig = ROLE_HIERARCHY[role];
  if (!roleConfig) return [];

  let permissions = [...(ROLE_PERMISSIONS[role] || [])];

  roleConfig.inherits.forEach(inheritedRole => {
    const inheritedPerms = ROLE_PERMISSIONS[inheritedRole] || [];
    inheritedPerms.forEach(perm => {
      if (!permissions.includes(perm)) {
        permissions.push(perm);
      }
    });
  });

  return permissions as Permission[];
};

export const hasPermission = (role: Role, permission: Permission): boolean => {
  const permissions = getRolePermissions(role);
  return permissions.includes(permission);
};

export const hasAnyPermission = (role: Role, permissions: Permission[]): boolean => {
  return permissions.some(perm => hasPermission(role, perm));
};

export const hasAllPermissions = (role: Role, permissions: Permission[]): boolean => {
  return permissions.every(perm => hasPermission(role, perm));
};

export const getRoleLevel = (role: Role): number => {
  return ROLE_HIERARCHY[role]?.level || 0;
};

export const canManageRole = (managerRole: Role, targetRole: Role): boolean => {
  return getRoleLevel(managerRole) > getRoleLevel(targetRole);
};

export const canAccessScreen = (role: Role, screenName: ScreenName): boolean => {
  const requiredPermissions = SCREEN_PERMISSIONS[screenName];
  if (!requiredPermissions || requiredPermissions.length === 0) return true;
  return hasAnyPermission(role, requiredPermissions as Permission[]);
};

export const getAccessibleScreens = (role: Role): ScreenName[] => {
  return Object.entries(SCREEN_PERMISSIONS)
    .filter(([_, perms]) => hasAnyPermission(role, perms as Permission[]))
    .map(([screen]) => screen as ScreenName);
};

export const getApprovalLimit = (role: Role, requestType: RequestType): ApprovalLimit | null => {
  const limits = APPROVAL_LIMITS[role];
  if (!limits) return null;
  return limits[requestType] || null;
};

export const canApprove = (role: Role, requestType: RequestType, value: number): boolean => {
  const limit = getApprovalLimit(role, requestType);
  if (!limit) return false;
  if (limit.maxDays !== undefined) return value <= limit.maxDays;
  if (limit.maxHours !== undefined) return value <= limit.maxHours;
  if (limit.maxHoursPerMonth !== undefined) return value <= limit.maxHoursPerMonth;
  if (limit.maxAmount !== undefined) return value <= limit.maxAmount;
  return false;
};

export const getDepartmentAccess = (role: Role): DepartmentAccess => {
  return DEPARTMENT_ACCESS[role] || 'none';
};

export const getRoleFeatures = (role: Role): Record<string, boolean> => {
  return ROLE_FEATURES[role] || {};
};

export const hasFeature = (role: Role, feature: string): boolean => {
  const features = getRoleFeatures(role);
  return features[feature] === true;
};

export const getAllRoles = (): RoleInfo[] => {
  return Object.keys(ROLE_HIERARCHY).map(role => ({
    id: role as Role,
    label: ROLE_HIERARCHY[role as Role].label,
    level: ROLE_HIERARCHY[role as Role].level,
  })).sort((a, b) => b.level - a.level);
};

export const getRoleLabel = (role: Role): string => {
  return ROLE_HIERARCHY[role]?.label || role;
};

export const getEscalationRole = (role: Role, requestType: RequestType): Role | null => {
  const limit = getApprovalLimit(role, requestType);
  return limit?.escalateTo || null;
};

export const canViewUserData = (viewerRole: Role, viewerDepartment: string, targetDepartment: string): boolean => {
  const access = getDepartmentAccess(viewerRole);
  if (access === 'all') return true;
  if (access === 'own') return viewerDepartment === targetDepartment;
  return false;
};

export const filterByDepartmentAccess = <T extends DepartmentDataItem>(role: Role, userDepartment: string, data: T[]): T[] => {
  const access = getDepartmentAccess(role);
  if (access === 'all') return data;
  if (access === 'own') return data.filter(item => item.department === userDepartment);
  return [];
};

export const getPermissionDescription = (permission: Permission): string => {
  return PERMISSIONS[permission] || permission;
};

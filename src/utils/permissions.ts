import { ROLE_HIERARCHY, ROLE_PERMISSIONS, SCREEN_PERMISSIONS, APPROVAL_LIMITS, DEPARTMENT_ACCESS, ROLE_FEATURES, PERMISSIONS } from './rbac';
import type { RoleId, PermissionKey, ScreenKey, EmployeeFeatures, RequestType, DepartmentAccessType } from './rbac';

export type Role = RoleId;
export type Permission = PermissionKey;
export type ScreenName = ScreenKey;
export type DepartmentAccess = DepartmentAccessType;
export type { RequestType } from './rbac';

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

// ============================================
// PERMISSION RESOLUTION
// Collects direct + inherited permissions
// ============================================

const rolePermissionCache = new Map<RoleId, PermissionKey[]>();

export const getRolePermissions = (role: RoleId): PermissionKey[] => {
  if (rolePermissionCache.has(role)) {
    return rolePermissionCache.get(role)!;
  }

  const roleConfig = ROLE_HIERARCHY[role];
  if (!roleConfig) return [];

  const permissions = new Set<PermissionKey>(ROLE_PERMISSIONS[role] || []);

  roleConfig.inherits.forEach(inheritedRole => {
    const inheritedPerms = getRolePermissions(inheritedRole);
    inheritedPerms.forEach(perm => permissions.add(perm));
  });

  const result = Array.from(permissions);
  rolePermissionCache.set(role, result);
  return result;
};

export const clearPermissionCache = (): void => {
  rolePermissionCache.clear();
};

// ============================================
// PERMISSION CHECKS
// ============================================

export const hasPermission = (role: RoleId, permission: PermissionKey): boolean => {
  const permissions = getRolePermissions(role);
  return permissions.includes(permission);
};

export const hasAnyPermission = (role: RoleId, permissions: PermissionKey[]): boolean => {
  return permissions.some(perm => hasPermission(role, perm));
};

export const hasAllPermissions = (role: RoleId, permissions: PermissionKey[]): boolean => {
  return permissions.every(perm => hasPermission(role, perm));
};

// ============================================
// ROLE MANAGEMENT
// ============================================

export const getRoleLevel = (role: RoleId): number => {
  return ROLE_HIERARCHY[role]?.level || 0;
};

export const canManageRole = (managerRole: RoleId, targetRole: RoleId): boolean => {
  return getRoleLevel(managerRole) > getRoleLevel(targetRole);
};

// ============================================
// SCREEN ACCESS — DEFAULT DENY
// FIX: Unknown screens are denied by default (was default-allow)
// ============================================

export const canAccessScreen = (role: RoleId, screenName: ScreenKey): boolean => {
  const requiredPermissions = SCREEN_PERMISSIONS[screenName];
  if (!requiredPermissions || requiredPermissions.length === 0) return false;
  return hasAnyPermission(role, requiredPermissions);
};

export const getAccessibleScreens = (role: RoleId): ScreenKey[] => {
  return (Object.keys(SCREEN_PERMISSIONS) as ScreenKey[])
    .filter(screen => canAccessScreen(role, screen));
};

// ============================================
// APPROVAL LIMITS
// ============================================

export const getApprovalLimit = (role: RoleId, requestType: RequestType): ApprovalLimit | null => {
  const limits = APPROVAL_LIMITS[role];
  if (!limits) return null;
  const limit = limits[requestType];
  if (!limit) return null;
  return limit as ApprovalLimit;
};

export const canApprove = (role: RoleId, requestType: RequestType, value: number): boolean => {
  const limit = getApprovalLimit(role, requestType);
  if (!limit) return false;
  if (limit.maxDays !== undefined && limit.maxDays === Infinity) return true;
  if (limit.maxHours !== undefined && limit.maxHours === Infinity) return true;
  if (limit.maxHoursPerMonth !== undefined && limit.maxHoursPerMonth === Infinity) return true;
  if (limit.maxAmount !== undefined && limit.maxAmount === Infinity) return true;
  if (limit.maxDays !== undefined) return value <= limit.maxDays;
  if (limit.maxHours !== undefined) return value <= limit.maxHours;
  if (limit.maxHoursPerMonth !== undefined) return value <= limit.maxHoursPerMonth;
  if (limit.maxAmount !== undefined) return value <= limit.maxAmount;
  return false;
};

export const getEscalationRole = (role: RoleId, requestType: RequestType): RoleId | null => {
  const limit = getApprovalLimit(role, requestType);
  return limit?.escalateTo || null;
};

// ============================================
// DEPARTMENT ACCESS
// ============================================

export const getDepartmentAccess = (role: RoleId): DepartmentAccessType => {
  return DEPARTMENT_ACCESS[role] || 'none';
};

export const canViewUserData = (viewerRole: RoleId, viewerDepartment: string, targetDepartment: string): boolean => {
  const access = getDepartmentAccess(viewerRole);
  if (access === 'all') return true;
  if (access === 'own') return viewerDepartment === targetDepartment;
  return false;
};

export const filterByDepartmentAccess = <T extends DepartmentDataItem>(role: RoleId, userDepartment: string, data: T[]): T[] => {
  const access = getDepartmentAccess(role);
  if (access === 'all') return data;
  if (access === 'own') return data.filter(item => item.department === userDepartment);
  return [];
};

// ============================================
// FEATURES — TYPE SAFE
// FIX: Uses keyof EmployeeFeatures instead of string
// ============================================

type FeatureKey = keyof EmployeeFeatures;

export const getRoleFeatures = (role: RoleId): EmployeeFeatures => {
  return ROLE_FEATURES[role] || {};
};

export const hasFeature = (role: RoleId, feature: FeatureKey): boolean => {
  const features = getRoleFeatures(role);
  return features[feature] === true;
};

// ============================================
// UTILITY
// ============================================

export const getAllRoles = (): RoleInfo[] => {
  return Object.keys(ROLE_HIERARCHY).map(role => ({
    id: role as RoleId,
    label: ROLE_HIERARCHY[role as RoleId].label,
    level: ROLE_HIERARCHY[role as RoleId].level,
  })).sort((a, b) => b.level - a.level);
};

export const getRoleLabel = (role: RoleId): string => {
  return ROLE_HIERARCHY[role]?.label || role;
};

export const getPermissionDescription = (permission: PermissionKey): string => {
  return PERMISSIONS[permission] || permission;
};

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, type ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '../services';
import { loadState } from '../store';
import { getRolePermissions, hasPermission, hasAnyPermission, hasFeature, getRoleFeatures, canAccessScreen, getAccessibleScreens, getRoleLabel, getRoleLevel, canManageRole, canApprove, getApprovalLimit, getDepartmentAccess, filterByDepartmentAccess } from '../utils/permissions';
import type { Role, Permission, ScreenName, RequestType } from '../utils/permissions';
import type { RoleId, EmployeeFeatures } from '../utils/rbac';

const ONBOARDING_KEY = '@karajo_onboarding_completed';

const VALID_ROLES: RoleId[] = ['ceo', 'hr_manager', 'hr_specialist', 'recruiter', 'finance_mgr', 'accountant', 'manager', 'team_lead', 'employee'];

const isValidRole = (role: string): role is RoleId => VALID_ROLES.includes(role as RoleId);

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role?: string;
  department?: string | null;
  [key: string]: unknown;
}

export interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  role: RoleId;
  roleLabel: string;
  roleLevel: number;
  userDepartment: string | null;
  hasCompletedOnboarding: boolean;
  isOnboarding: boolean;
  setRole: (newRole: RoleId) => void;
  switchRole: (newRole: RoleId) => Promise<void>;
  login: (email: string, password: string, selectedRole?: string) => Promise<unknown>;
  logout: () => Promise<void>;
  updateProfile: (updates: Record<string, unknown>) => Promise<unknown>;
  refreshUser: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
  startOffboarding: () => void;
  permissions: Permission[];
  features: EmployeeFeatures;
  accessibleScreens: ScreenName[];
  hasPermission: (permission: Permission) => boolean;
  hasAnyPermission: (permissions: Permission[]) => boolean;
  hasFeature: (feature: keyof EmployeeFeatures) => boolean;
  canAccessScreen: (screenName: ScreenName) => boolean;
  canApprove: (requestType: RequestType, value: number) => boolean;
  canManageRole: (targetRole: Role) => boolean;
  getApprovalLimit: (type: RequestType) => { maxDays?: number; maxHours?: number; maxHoursPerMonth?: number; maxAmount?: number; escalateTo?: Role | null } | null;
  getDepartmentAccess: () => string;
  filterByDepartment: <T,>(data: T[]) => T[];
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [role, setRoleState] = useState<RoleId>('employee');
  const [userDepartment, setUserDepartment] = useState<string | null>(null);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [isOnboarding, setIsOnboarding] = useState(false);

  const setRole = (newRole: RoleId) => {
    if (!isValidRole(newRole)) {
      console.warn(`[Auth] Invalid role: ${newRole}. Defaulting to 'employee'.`);
      setRoleState('employee');
      return;
    }
    setRoleState(newRole);
  };

  const initialize = useCallback(async () => {
    try {
      setIsLoading(true);
      const authenticated = await authService.isAuthenticated();
      if (authenticated) {
        const profile = await authService.getProfile();
        const userData = profile.user || profile;
        setUser(userData as AuthUser);
        const rawRole = (userData as any)?.role || profile.role || 'employee';
        setRole(isValidRole(rawRole) ? rawRole : 'employee');
        setUserDepartment((userData as any)?.department || profile.department || null);
        setIsAuthenticated(true);
        await loadState();

        const onboarded = await AsyncStorage.getItem(ONBOARDING_KEY);
        setHasCompletedOnboarding(onboarded === 'true');
      }
    } catch (err) {
      setError((err as Error).message);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    initialize();
  }, [initialize]);

  const login = async (email: string, password: string, selectedRole?: string) => {
    try {
      setError(null);
      setIsLoading(true);
      const data = await authService.login(email, password);
      setUser(data.user as AuthUser);
      const rawRole = selectedRole || (data.user as any)?.role || 'employee';
      setRole(isValidRole(rawRole) ? rawRole : 'employee');
      setUserDepartment((data.user as any)?.department || null);
      setIsAuthenticated(true);
      await loadState();
      return data;
    } catch (err) {
      setError((err as Error).message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch {
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      setRoleState('employee');
      setUserDepartment(null);
    }
  };

  const updateProfile = async (updates: Record<string, unknown>) => {
    try {
      const data = await authService.updateProfile(updates);
      const userData = data.user || data;
      setUser(userData as AuthUser);
      if ((data as any).user?.role) {
        const rawRole = (data as any).user.role;
        setRole(isValidRole(rawRole) ? rawRole : role);
      }
      if ((data as any).user?.department) setUserDepartment((data as any).user.department);
      return data;
    } catch (err) {
      setError((err as Error).message);
      throw err;
    }
  };

  const switchRole = async (newRole: RoleId) => {
    if (!isValidRole(newRole)) {
      console.warn(`[Auth] switchRole rejected: "${newRole}" is not a valid role.`);
      return;
    }
    setRoleState(newRole);
  };

  const permissions = useMemo(() => getRolePermissions(role), [role]);
  const features = useMemo(() => getRoleFeatures(role), [role]);
  const accessibleScreens = useMemo(() => getAccessibleScreens(role), [role]);

  const checkPermission = useCallback((permission: Permission) => {
    return hasPermission(role, permission);
  }, [role]);

  const checkAnyPermission = useCallback((perms: Permission[]) => {
    return hasAnyPermission(role, perms);
  }, [role]);

  const checkFeature = useCallback((feature: keyof EmployeeFeatures) => {
    return hasFeature(role, feature);
  }, [role]);

  const checkScreenAccess = useCallback((screenName: ScreenName) => {
    return canAccessScreen(role, screenName);
  }, [role]);

  const checkCanApprove = useCallback((requestType: RequestType, value: number) => {
    return canApprove(role, requestType, value);
  }, [role]);

  const checkCanManageRole = useCallback((targetRole: Role) => {
    return canManageRole(role, targetRole);
  }, [role]);

  const filterDataByDepartment = useCallback(<T,>(data: T[]) => {
    return filterByDepartmentAccess(role, userDepartment || '', data as any) as unknown as T[];
  }, [role, userDepartment]);

  const completeOnboarding = useCallback(async () => {
    await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
    setHasCompletedOnboarding(true);
    setIsOnboarding(false);
  }, []);

  const startOffboarding = useCallback(() => {
    setIsOnboarding(false);
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    error,
    role,
    roleLabel: getRoleLabel(role),
    roleLevel: getRoleLevel(role),
    userDepartment,
    hasCompletedOnboarding,
    isOnboarding,
    setRole,
    switchRole,
    login,
    logout,
    updateProfile,
    refreshUser: initialize,
    completeOnboarding,
    startOffboarding,
    permissions,
    features,
    accessibleScreens,
    hasPermission: checkPermission,
    hasAnyPermission: checkAnyPermission,
    hasFeature: checkFeature,
    canAccessScreen: checkScreenAccess,
    canApprove: checkCanApprove,
    canManageRole: checkCanManageRole,
    getApprovalLimit: (type: RequestType) => getApprovalLimit(role, type),
    getDepartmentAccess: () => getDepartmentAccess(role),
    filterByDepartment: filterDataByDepartment,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;

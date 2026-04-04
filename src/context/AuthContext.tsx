import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, type ReactNode } from 'react';
import { authService } from '../services';
import { loadState } from '../store';
import { getRolePermissions, hasPermission, hasAnyPermission, hasFeature, getRoleFeatures, canAccessScreen, getAccessibleScreens, getRoleLabel, getRoleLevel, canManageRole, canApprove, getApprovalLimit, getDepartmentAccess, filterByDepartmentAccess } from '../utils/permissions';
import type { Role, Permission, ScreenName, RequestType } from '../utils/permissions';

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
  role: string;
  roleLabel: string;
  roleLevel: number;
  userDepartment: string | null;
  setRole: React.Dispatch<React.SetStateAction<string>>;
  switchRole: (newRole: string) => Promise<void>;
  login: (email: string, password: string, selectedRole?: string) => Promise<unknown>;
  logout: () => Promise<void>;
  updateProfile: (updates: Record<string, unknown>) => Promise<unknown>;
  refreshUser: () => Promise<void>;
  permissions: Permission[];
  features: Record<string, boolean>;
  accessibleScreens: ScreenName[];
  hasPermission: (permission: Permission) => boolean;
  hasAnyPermission: (permissions: Permission[]) => boolean;
  hasFeature: (feature: string) => boolean;
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
  const [role, setRole] = useState<string>('employee');
  const [userDepartment, setUserDepartment] = useState<string | null>(null);

  const initialize = useCallback(async () => {
    try {
      setIsLoading(true);
      const authenticated = await authService.isAuthenticated();
      if (authenticated) {
        const profile = await authService.getProfile();
        const userData = profile.user || profile;
        setUser(userData as AuthUser);
        setRole((userData as any)?.role || profile.role || 'employee');
        setUserDepartment((userData as any)?.department || profile.department || null);
        setIsAuthenticated(true);
        await loadState();
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
      const userRole = selectedRole || (data.user as any)?.role || 'employee';
      setRole(userRole);
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
      setRole('employee');
      setUserDepartment(null);
    }
  };

  const updateProfile = async (updates: Record<string, unknown>) => {
    try {
      const data = await authService.updateProfile(updates);
      const userData = data.user || data;
      setUser(userData as AuthUser);
      if ((data as any).user?.role) setRole((data as any).user.role);
      if ((data as any).user?.department) setUserDepartment((data as any).user.department);
      return data;
    } catch (err) {
      setError((err as Error).message);
      throw err;
    }
  };

  const switchRole = async (newRole: string) => {
    setRole(newRole);
  };

  const permissions = useMemo(() => getRolePermissions(role as Role), [role]);
  const features = useMemo(() => getRoleFeatures(role as Role), [role]);
  const accessibleScreens = useMemo(() => getAccessibleScreens(role as Role), [role]);

  const checkPermission = useCallback((permission: Permission) => {
    return hasPermission(role as Role, permission);
  }, [role]);

  const checkAnyPermission = useCallback((perms: Permission[]) => {
    return hasAnyPermission(role as Role, perms);
  }, [role]);

  const checkFeature = useCallback((feature: string) => {
    return hasFeature(role as Role, feature);
  }, [role]);

  const checkScreenAccess = useCallback((screenName: ScreenName) => {
    return canAccessScreen(role as Role, screenName);
  }, [role]);

  const checkCanApprove = useCallback((requestType: RequestType, value: number) => {
    return canApprove(role as Role, requestType, value);
  }, [role]);

  const checkCanManageRole = useCallback((targetRole: Role) => {
    return canManageRole(role as Role, targetRole);
  }, [role]);

  const filterDataByDepartment = useCallback(<T,>(data: T[]) => {
    return filterByDepartmentAccess(role as Role, userDepartment || '', data as any) as unknown as T[];
  }, [role, userDepartment]);

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    error,
    role,
    roleLabel: getRoleLabel(role as Role),
    roleLevel: getRoleLevel(role as Role),
    userDepartment,
    setRole,
    switchRole,
    login,
    logout,
    updateProfile,
    refreshUser: initialize,
    permissions,
    features,
    accessibleScreens,
    hasPermission: checkPermission,
    hasAnyPermission: checkAnyPermission,
    hasFeature: checkFeature,
    canAccessScreen: checkScreenAccess,
    canApprove: checkCanApprove,
    canManageRole: checkCanManageRole,
    getApprovalLimit: (type: RequestType) => getApprovalLimit(role as Role, type),
    getDepartmentAccess: () => getDepartmentAccess(role as Role),
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

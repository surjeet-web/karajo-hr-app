import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services';
import { loadState } from '../store';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [role, setRole] = useState(null);

  const initialize = useCallback(async () => {
    try {
      setIsLoading(true);
      const authenticated = await authService.isAuthenticated();
      if (authenticated) {
        const profile = await authService.getProfile();
        setUser(profile.user || profile);
        setIsAuthenticated(true);
        await loadState();
      }
    } catch (err) {
      setError(err.message);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    initialize();
  }, [initialize]);

  const login = async (email, password, selectedRole) => {
    try {
      setError(null);
      setIsLoading(true);
      const data = await authService.login(email, password);
      setUser(data.user);
      setIsAuthenticated(true);
      if (selectedRole) {
        setRole(selectedRole);
      }
      await loadState();
      return data;
    } catch (err) {
      setError(err.message);
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
      setRole(null);
    }
  };

  const updateProfile = async (updates) => {
    try {
      const data = await authService.updateProfile(updates);
      setUser(data.user || data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    error,
    role,
    setRole,
    login,
    logout,
    updateProfile,
    refreshUser: initialize,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;

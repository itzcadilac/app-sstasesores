import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { User, LoginCredentials, PersonalLoginCredentials } from '@/types';
import * as authService from '@/services/authService';

const AUTH_STORAGE_KEY = '@sst_auth_user';

export const [AuthProvider, useAuth] = createContextHook(() => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStoredUser = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch {
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      setError(null);
      setIsLoading(true);
      const userData = await authService.login(credentials);
      setUser(userData);
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData));
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al iniciar sesión';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loginPersonal = useCallback(async (credentials: PersonalLoginCredentials): Promise<boolean> => {
    try {
      setError(null);
      setIsLoading(true);
      const userData = await authService.loginPersonal(credentials);
      setUser(userData);
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData));
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al iniciar sesión';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      setUser(null);
      await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
    } catch {
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  useEffect(() => {
    loadStoredUser();
  }, [loadStoredUser]);

  return useMemo(() => ({
    user,
    isLoading,
    error,
    login,
    loginPersonal,
    logout,
    clearError,
    isAuthenticated: !!user,
    isEmpresa: user?.tipo === 'empresa',
    isPersonal: user?.tipo === 'personal',
  }), [user, isLoading, error, login, loginPersonal, logout, clearError]);
});

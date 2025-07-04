import { useState, useEffect } from 'react';
import { AuthState, LoginCredentials, RegisterCredentials } from '../types/auth';
import { login as apiLogin, register as apiRegister, getProfile } from '../utils/api';

const STORAGE_KEY = 'cv_app_user';
const TOKEN_KEY = 'cv_app_token';

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    // Check for stored user and token on app load
    const storedUser = localStorage.getItem(STORAGE_KEY);
    const token = localStorage.getItem(TOKEN_KEY);
    if (storedUser && token) {
      try {
        const user = JSON.parse(storedUser);
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
      } catch {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(TOKEN_KEY);
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    } else {
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  }, []);

  const login = async (credentials: LoginCredentials): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await apiLogin(credentials);
      if (res.token) {
        localStorage.setItem(TOKEN_KEY, res.token);
        let user = {
          id: res.id || '',
          email: res.email || credentials.email,
          firstName: res.firstName || '',
          lastName: res.lastName || '',
          createdAt: res.createdAt || '',
        };
        if (!user.id || !user.firstName || !user.lastName) {
          try {
            user = await getProfile();
          } catch {
            // fallback to what we have
          }
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
        return { success: true };
      } else {
        return { success: false, error: 'No token received' };
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Login failed. Please try again.';
      return { success: false, error: message };
    }
  };

  const register = async (credentials: RegisterCredentials): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await apiRegister(credentials);
      if (res.token) {
        localStorage.setItem(TOKEN_KEY, res.token);
        let user;
        try {
          user = await getProfile();
        } catch {
          user = res.user || {
            id: res.id || '',
            email: res.email || credentials.email,
            firstName: res.firstName || credentials.firstName,
            lastName: res.lastName || credentials.lastName,
            createdAt: res.createdAt || '',
          };
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
        return { success: true };
      } else {
        return { success: false, error: 'No token received' };
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Registration failed. Please try again.';
      return { success: false, error: message };
    }
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(TOKEN_KEY);
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  return {
    ...authState,
    login,
    register,
    logout,
  };
};
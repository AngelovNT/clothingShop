"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
  resendVerificationEmail: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Function to set up axios with token
  const setupAxiosAuth = (token: string) => {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  };

  // Function to clear axios auth
  const clearAxiosAuth = () => {
    delete axios.defaults.headers.common['Authorization'];
  };

  // Function to fetch user data
  const fetchUserData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/users/me');
      setUser(response.data);
      setIsAuthenticated(true);
      return true;
    } catch (err) {
      console.error('Error fetching user data:', err);
      return false;
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        if (token) {
          setupAxiosAuth(token);
          const success = await fetchUserData();
          if (!success) {
            localStorage.removeItem('token');
            clearAxiosAuth();
          }
        }
      } catch (err) {
        console.error('Authentication check failed:', err);
        localStorage.removeItem('token');
        clearAxiosAuth();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post('http://localhost:5000/users/login', {
        email,
        password
      });
      
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      setupAxiosAuth(token);
      setUser(user);
      setIsAuthenticated(true);
      
      // Verify the auth state by fetching user data
      await fetchUserData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post('http://localhost:5000/users/register', {
        name,
        email,
        password
      });
      
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      setupAxiosAuth(token);
      setUser(user);
      setIsAuthenticated(true);
      
      // Verify the auth state by fetching user data
      await fetchUserData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // For development/testing: simulate a successful response
      // Comment this section and uncomment the axios call when backend is ready
      console.log(`Password reset requested for email: ${email}`);
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      return;
      
      // Uncomment this when the backend endpoint is ready
      // await axios.post('http://localhost:5000/users/forgot-password', { email });
      
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send password reset email. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (token: string, newPassword: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // For development/testing: simulate a successful response
      // Comment this section and uncomment the axios call when backend is ready
      console.log(`Password reset with token: ${token}`);
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      return;
      
      // Uncomment this when the backend endpoint is ready
      // await axios.post('http://localhost:5000/users/reset-password', { 
      //   token, 
      //   newPassword 
      // });
      
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to reset password. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const verifyEmail = async (token: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // For development/testing: simulate a successful response
      // Comment this section and uncomment the axios call when backend is ready
      console.log(`Verifying email with token: ${token}`);
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // If user is logged in, update their verification status
      if (user) {
        setUser({
          ...user,
          isEmailVerified: true
        });
      }
      
      return;
      
      // Uncomment this when the backend endpoint is ready
      // const response = await axios.post('http://localhost:5000/users/verify-email', { token });
      // 
      // // If user is logged in, update their verification status
      // if (user) {
      //   await fetchUserData();
      // }
      
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to verify email. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const resendVerificationEmail = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // For development/testing: simulate a successful response
      // Comment this section and uncomment the axios call when backend is ready
      console.log(`Resending verification email to: ${user?.email}`);
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      return;
      
      // Uncomment this when the backend endpoint is ready
      // await axios.post('http://localhost:5000/users/resend-verification');
      
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to resend verification email. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    clearAxiosAuth();
    setUser(null);
    setIsAuthenticated(false);
  };

  const isAdmin = user?.role === 'admin';

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated,
    isAdmin,
    forgotPassword,
    resetPassword,
    verifyEmail,
    resendVerificationEmail
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext; 
'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface User {
  name: string;
  email: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

/**
 * Enhanced authentication hook with persistent state and advanced features
 * This would ideally connect to  or another backend service
 */
export const useAuth = () => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false
  });
  const router = useRouter();

  // Initialize auth state from localStorage on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setState({
        user,
        isLoading: false,
        isAuthenticated: true
      });
    } else {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  // Mock login function - would connect to backend in production
  const login = async (userData: User) => {
    setState({
      user: userData,
      isLoading: false,
      isAuthenticated: true
    });
    localStorage.setItem('user', JSON.stringify(userData));
    router.push('/profile');
  };

  // Mock logout function
  const logout = () => {
    setState({
      user: null,
      isLoading: false,
      isAuthenticated: false
    });
    localStorage.removeItem('user');
    router.push('/');
  };

  // Mock signup function
  const signup = async (name: string, email: string, password: string) => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const userData = { 
      name, 
      email,
      avatar: '/placeholder.svg'
    };
    
    setState({
      user: userData,
      isLoading: false,
      isAuthenticated: true
    });
    
    // Store auth state in localStorage
    localStorage.setItem('user', JSON.stringify(userData));
    
    // Show success notification
    toast.success("Account created", {
      description: `Welcome, ${name}!`
    });
    
    // Redirect to home page
    router.push('/');
  };

  return {
    user: state.user,
    isLoading: state.isLoading,
    isAuthenticated: state.isAuthenticated,
    login,
    logout,
    signup
  };
};

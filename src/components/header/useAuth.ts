
import { signup } from '@/app/server/_actions/auth';
import { useState } from 'react';

interface AuthContextType {
  isLoggedIn: boolean;
  user: { name: string; email: string } | null;
  login: (user: { name: string; email: string; avatar: string }) => void;
  logout: () => void;
  signup: (name: string, email: string, password: string) => Promise<void>;
}
// Custom hook to handle authentication state
export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  // Mock login/logout functions
  const login = (p0: { name: string; email: string; avatar: string; }) => {
    setIsLoggedIn(true);
    setUser({ name: 'Abdelrahman Magdy', email: 'abdelrahman@example.com' });
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
  };

  return { isLoggedIn, user, login, logout, signup: async (name: string, email: string, password: string) => {} };
};

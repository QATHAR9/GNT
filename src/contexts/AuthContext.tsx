import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string, role: 'admin' | 'sales') => boolean;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo users
const DEMO_USERS = [
  { id: '1', username: 'admin', password: 'admin123', role: 'admin' as const, name: 'Admin User' },
  { id: '2', username: 'sales', password: 'sales123', role: 'sales' as const, name: 'Sales Staff' },
];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('elegante_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = (username: string, password: string, role: 'admin' | 'sales'): boolean => {
    const demoUser = DEMO_USERS.find(u => 
      u.username === username && 
      u.password === password && 
      u.role === role
    );

    if (demoUser) {
      const user = { id: demoUser.id, username: demoUser.username, role: demoUser.role, name: demoUser.name };
      setUser(user);
      localStorage.setItem('elegante_user', JSON.stringify(user));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('elegante_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
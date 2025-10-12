import React, {createContext, ReactNode, useContext, useState} from 'react';
import {User, UserRole} from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (role: UserRole, name: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for easy login
export const mockUsers: Record<UserRole, User> = {
  warehouse: {
    id: '1',
    name: 'John Warehouse',
    email: 'john@ecorp.com',
    role: 'warehouse',
    location: 'California HQ',
  },
  sales: {
    id: '2',
    name: 'Sarah Sales',
    email: 'sarah@ecorp.com',
    role: 'sales',
    location: 'New York Dealership',
  },
  customer_service: {
    id: '3',
    name: 'Mike Service',
    email: 'mike@ecorp.com',
    role: 'customer_service',
    location: 'Texas Dealership',
  },
  mechanic: {
    id: '4',
    name: 'Tom Mechanic',
    email: 'tom@ecorp.com',
    role: 'mechanic',
    location: 'Florida Dealership',
  },
  csuite: {
    id: '5',
    name: 'Emily Executive',
    email: 'emily@ecorp.com',
    role: 'csuite',
    location: 'California HQ',
  },
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({children}) => {
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = (role: UserRole, name: string) => {
    const userData = {...mockUsers[role], name};
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    login: handleLogin,
    logout: handleLogout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

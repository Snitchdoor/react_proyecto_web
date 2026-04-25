import { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'admin' | 'repartidor' | 'client';

interface User {
  username: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => boolean;
  loginAsClient: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const CREDENTIALS = {
  admin: { username: 'admin', password: '1234', role: 'admin' as UserRole },
  repartidor: { username: 'repartidor', password: '1234', role: 'repartidor' as UserRole },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (username: string, password: string): boolean => {
    const credential = CREDENTIALS[username as keyof typeof CREDENTIALS];
    if (credential && credential.password === password) {
      setUser({ username: credential.username, role: credential.role });
      return true;
    }
    return false;
  };

  const loginAsClient = () => {
    setUser({ username: 'Client', role: 'client' });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, loginAsClient, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
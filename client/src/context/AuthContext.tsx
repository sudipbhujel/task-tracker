import { useAuth } from '@/hooks/useAuth';
import { createContext } from 'react';
import { User } from '../hooks/useUser';

interface AuthContext {
  user: User | null;
  login: (data: { email: string; password: string }) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContext>({
  user: null,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { login, logout, user } = useAuth();
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

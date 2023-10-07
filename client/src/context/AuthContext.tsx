import { useAuth } from '@/hooks/useAuth';
import { createContext } from 'react';
import { User } from '../hooks/useUser';
import { components } from '@/types';

interface AuthContext {
  user: User | null;
  register: (data: components['schemas']['RegisterUserDto']) => void;
  login: (data: { email: string; password: string }) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContext>({
  user: null,
  register: () => {},
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { register, login, logout, user } = useAuth();
  return (
    <AuthContext.Provider value={{ register, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

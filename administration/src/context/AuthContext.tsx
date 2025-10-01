import React, {
  createContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
  useContext,
} from 'react';
import authService, { User } from 'services/authService';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  booting: boolean; // <-- добавили сюда
  login: (email: string, password: string) => Promise<User | null>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [{ isAuthenticated, user }, setAuthState] = useState<{
    isAuthenticated: boolean;
    user: User | null;
  }>({
    isAuthenticated: authService.isAuthenticated,
    user: authService.user,
  });

  const [booting, setBooting] = useState(true);

  useEffect(() => {
    authService.ready().finally(() => setBooting(false));
    return authService.onChange(setAuthState);
  }, []);

  const value = useMemo<AuthContextType>(
    () => ({
      isAuthenticated,
      user,
      booting,
      login: authService.login.bind(authService),
      logout: authService.logout.bind(authService),
    }),
    [isAuthenticated, user, booting]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// удобный хук
export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth должен вызываться внутри <AuthProvider>');
  }
  return ctx;
}

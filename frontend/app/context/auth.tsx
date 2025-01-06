import { createContext, useContext, useState, useEffect } from 'react';
import { userSingIn, logout, getAuthData } from '~/services/userService';
import { User } from '~/models/User';

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  token: string | null;
  setToken: (token: string | null) => void;
  loginUser: (email: string, password: string) => Promise<void>;
  logoutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('auth_user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [token, setToken] = useState<string | null>(localStorage.getItem('auth_token'));

  useEffect(() => {
    const authData = getAuthData();
    if (authData) {
      setUser(authData.user);
      setToken(authData.token);
    }
  }, []);

  const loginUser = async (email: string, password: string) => {
    try {
      const response = await userSingIn(email, password);
      setUser(response.user);
      setToken(response.access_token);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const logoutUser = async () => {
    try {
      await logout();
      setUser(null);
      setToken(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loginUser, logoutUser, setUser, setToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';

interface AuthContextType {
  user: UserProfile | null;
  demoUsers: UserProfile[];
  loading: boolean;
  loginByEmail: (email: string) => Promise<boolean>;
  switchUserByRole: (role: UserRole) => void;
  logout: () => void;
  isConsumer: boolean;
  isOfficer: boolean;
  isFieldEngineer: boolean;
  isStreetlightOfficer: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [demoUsers, setDemoUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch demo users from backend
  useEffect(() => {
    const fetchDemoUsers = async () => {
      try {
        const res = await fetch('/api/auth/demo-users');
        if (res.ok) {
          const data: UserProfile[] = await res.json();
          setDemoUsers(data);
          
          // Check saved user or default to consumer for demo ease
          const savedUserId = localStorage.getItem('vs_user_id');
          if (savedUserId) {
            const found = data.find(u => u.id === savedUserId);
            if (found) {
              setUser(found);
            }
          }
        }
      } catch (err) {
        console.error('Failed to load demo users from backend:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDemoUsers();
  }, []);

  const loginByEmail = async (email: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        localStorage.setItem('vs_user_id', data.user.id);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Login error:', err);
      return false;
    }
  };

  const switchUserByRole = (role: UserRole) => {
    const targetUser = demoUsers.find(u => u.role === role);
    if (targetUser) {
      setUser(targetUser);
      localStorage.setItem('vs_user_id', targetUser.id);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('vs_user_id');
  };

  const role = user?.role;

  return (
    <AuthContext.Provider
      value={{
        user,
        demoUsers,
        loading,
        loginByEmail,
        switchUserByRole,
        logout,
        isConsumer: role === 'CONSUMER',
        isOfficer: role === 'BESCOM_OFFICER',
        isFieldEngineer: role === 'FIELD_ENGINEER',
        isStreetlightOfficer: role === 'STREETLIGHT_OFFICER',
        isAdmin: role === 'ADMINISTRATOR',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

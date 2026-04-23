// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, AuthContextType } from '@/src/types';

// Mock users data
const MOCK_USERS: User[] = [
  { id: '1', name: 'Admin', email: 'admin@treino.com', isAdmin: true },
  { id: '2', name: 'Usuário', email: 'user@treino.com', isAdmin: false },
];

const STORAGE_KEYS = {
  TOKEN: '@gymdiary:token',
  USER: '@gymdiary:user',
  USERS: '@gymdiary:users',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Load stored auth data on startup
  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const storedToken = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
      const storedUser = await AsyncStorage.getItem(STORAGE_KEYS.USER);
      
      // Load mock users
      const storedUsers = await AsyncStorage.getItem(STORAGE_KEYS.USERS);
      if (!storedUsers) {
        await AsyncStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(MOCK_USERS));
      }
      
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Erro ao carregar autenticação:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Mock login - accepts any password for demo
      const usersStr = await AsyncStorage.getItem(STORAGE_KEYS.USERS);
      const users: User[] = usersStr ? JSON.parse(usersStr) : MOCK_USERS;
      
      const foundUser = users.find(u => u.email === email);
      
      if (foundUser) {
        const mockToken = `mock-token-${Date.now()}`;
        setToken(mockToken);
        setUser(foundUser);
        
        await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, mockToken);
        await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(foundUser));
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erro no login:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.multiRemove([STORAGE_KEYS.TOKEN, STORAGE_KEYS.USER]);
      setToken(null);
      setUser(null);
    } catch (error) {
      console.error('Erro no logout:', error);
    }
  };

  const register = async (name: string, email: string, password: string, isAdmin = false): Promise<boolean> => {
    try {
      const usersStr = await AsyncStorage.getItem(STORAGE_KEYS.USERS);
      const users: User[] = usersStr ? JSON.parse(usersStr) : MOCK_USERS;
      
      // Check if user already exists
      if (users.some(u => u.email === email)) {
        return false;
      }
      
      const newUser: User = {
        id: Date.now().toString(),
        name,
        email,
        isAdmin,
      };
      
      const updatedUsers = [...users, newUser];
      await AsyncStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(updatedUsers));
      
      return true;
    } catch (error) {
      console.error('Erro ao registrar:', error);
      return false;
    }
  };

  const updateUser = async (userId: string, updates: Partial<User>): Promise<boolean> => {
    try {
      const usersStr = await AsyncStorage.getItem(STORAGE_KEYS.USERS);
      const users: User[] = usersStr ? JSON.parse(usersStr) : MOCK_USERS;
      
      const index = users.findIndex(u => u.id === userId);
      if (index === -1) return false;
      
      users[index] = { ...users[index], ...updates };
      await AsyncStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
      
      // Update current user if it's the same
      if (user?.id === userId) {
        setUser(users[index]);
        await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(users[index]));
      }
      
      return true;
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      return false;
    }
  };

  const deleteUser = async (userId: string): Promise<boolean> => {
    try {
      if (user?.id === userId) return false; // Can't delete self
      
      const usersStr = await AsyncStorage.getItem(STORAGE_KEYS.USERS);
      const users: User[] = usersStr ? JSON.parse(usersStr) : MOCK_USERS;
      
      const filteredUsers = users.filter(u => u.id !== userId);
      await AsyncStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(filteredUsers));
      
      return true;
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
      return false;
    }
  };

  const getUsers = (): User[] => {
    // This is sync for simplicity - in real app would be async
    return MOCK_USERS;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        register,
        updateUser,
        deleteUser,
        getUsers,
      }}
    >
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
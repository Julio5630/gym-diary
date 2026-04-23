// src/contexts/DataContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './AuthContext';
import { AppData, DataContextType, Exercise, WorkoutTemplate, WorkoutHistory } from '@/src/types';
import { MOCK_EXERCISES, MOCK_TEMPLATES, MOCK_HISTORY } from '@/src/services/mockData';

const STORAGE_KEY_PREFIX = '@gymdiary:data:';

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [data, setData] = useState<AppData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getStorageKey = () => `${STORAGE_KEY_PREFIX}${user?.id || 'guest'}`;

  const loadAllData = async () => {
    if (!user) {
      setData(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const storageKey = getStorageKey();
      const storedData = await AsyncStorage.getItem(storageKey);
      
      let parsedData: AppData;
      
      if (storedData) {
        parsedData = JSON.parse(storedData);
      } else {
        // Initialize with mock data
        parsedData = {
          exercises: MOCK_EXERCISES,
          workoutTemplates: MOCK_TEMPLATES,
          workoutHistory: MOCK_HISTORY,
          weeklyRoutine: new Array(7).fill(null),
          currentWorkout: null,
        };
        await AsyncStorage.setItem(storageKey, JSON.stringify(parsedData));
      }
      
      setData(parsedData);
    } catch (err) {
      console.error('[DataContext] Erro ao carregar dados:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar dados');
      // Fallback to empty data
      setData({
        exercises: [],
        workoutTemplates: [],
        workoutHistory: [],
        weeklyRoutine: new Array(7).fill(null),
        currentWorkout: null,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, [user]);

  const refreshData = async () => {
    await loadAllData();
  };

  const updatePartial = async (updates: Partial<AppData>) => {
    if (!data || !user) return;
    
    const newData = { ...data, ...updates };
    setData(newData);
    
    try {
      const storageKey = getStorageKey();
      await AsyncStorage.setItem(storageKey, JSON.stringify(newData));
    } catch (err) {
      console.error('[DataContext] Erro ao salvar dados:', err);
      setError(err instanceof Error ? err.message : 'Erro ao salvar dados');
    }
  };

  return (
    <DataContext.Provider value={{ data, loading, error, refreshData, updatePartial }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
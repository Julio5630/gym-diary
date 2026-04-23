// src/services/storage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppData, Exercise, WorkoutTemplate, WorkoutHistory, WorkoutInProgress } from '@/src/types';
import { MOCK_EXERCISES, MOCK_TEMPLATES, MOCK_HISTORY } from './mockData';

const STORAGE_KEYS = {
  EXERCISES: '@gymdiary:exercises',
  TEMPLATES: '@gymdiary:templates',
  HISTORY: '@gymdiary:history',
  WEEKLY_ROUTINE: '@gymdiary:weekly_routine',
  CURRENT_WORKOUT: '@gymdiary:current_workout',
};

// Exercises
export const saveExercises = async (exercises: Exercise[]): Promise<void> => {
  await AsyncStorage.setItem(STORAGE_KEYS.EXERCISES, JSON.stringify(exercises));
};

export const getExercises = async (): Promise<Exercise[]> => {
  const data = await AsyncStorage.getItem(STORAGE_KEYS.EXERCISES);
  return data ? JSON.parse(data) : MOCK_EXERCISES;
};

// Templates
export const saveTemplates = async (templates: WorkoutTemplate[]): Promise<void> => {
  await AsyncStorage.setItem(STORAGE_KEYS.TEMPLATES, JSON.stringify(templates));
};

export const getTemplates = async (): Promise<WorkoutTemplate[]> => {
  const data = await AsyncStorage.getItem(STORAGE_KEYS.TEMPLATES);
  return data ? JSON.parse(data) : MOCK_TEMPLATES;
};

// History
export const saveHistory = async (history: WorkoutHistory[]): Promise<void> => {
  await AsyncStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
};

export const getHistory = async (): Promise<WorkoutHistory[]> => {
  const data = await AsyncStorage.getItem(STORAGE_KEYS.HISTORY);
  return data ? JSON.parse(data) : MOCK_HISTORY;
};

// Weekly Routine
export const saveWeeklyRoutine = async (routine: (string | null)[]): Promise<void> => {
  await AsyncStorage.setItem(STORAGE_KEYS.WEEKLY_ROUTINE, JSON.stringify(routine));
};

export const getWeeklyRoutine = async (): Promise<(string | null)[]> => {
  const data = await AsyncStorage.getItem(STORAGE_KEYS.WEEKLY_ROUTINE);
  return data ? JSON.parse(data) : new Array(7).fill(null);
};

// Current Workout
export const saveCurrentWorkout = async (workout: WorkoutInProgress | null): Promise<void> => {
  if (workout) {
    await AsyncStorage.setItem(STORAGE_KEYS.CURRENT_WORKOUT, JSON.stringify(workout));
  } else {
    await AsyncStorage.removeItem(STORAGE_KEYS.CURRENT_WORKOUT);
  }
};

export const getCurrentWorkout = async (): Promise<WorkoutInProgress | null> => {
  const data = await AsyncStorage.getItem(STORAGE_KEYS.CURRENT_WORKOUT);
  return data ? JSON.parse(data) : null;
};

// Full data save/load
export const saveAllUserData = async (userId: string, data: AppData): Promise<void> => {
  const prefix = `@gymdiary:user:${userId}`;
  await AsyncStorage.multiSet([
    [`${prefix}:exercises`, JSON.stringify(data.exercises)],
    [`${prefix}:templates`, JSON.stringify(data.workoutTemplates)],
    [`${prefix}:history`, JSON.stringify(data.workoutHistory)],
    [`${prefix}:weekly_routine`, JSON.stringify(data.weeklyRoutine)],
    [`${prefix}:current_workout`, JSON.stringify(data.currentWorkout)],
  ]);
};

export const loadAllUserData = async (userId: string): Promise<AppData | null> => {
  try {
    const prefix = `@gymdiary:user:${userId}`;
    const results = await AsyncStorage.multiGet([
      `${prefix}:exercises`,
      `${prefix}:templates`,
      `${prefix}:history`,
      `${prefix}:weekly_routine`,
      `${prefix}:current_workout`,
    ]);
    
    return {
      exercises: results[0][1] ? JSON.parse(results[0][1]) : MOCK_EXERCISES,
      workoutTemplates: results[1][1] ? JSON.parse(results[1][1]) : MOCK_TEMPLATES,
      workoutHistory: results[2][1] ? JSON.parse(results[2][1]) : MOCK_HISTORY,
      weeklyRoutine: results[3][1] ? JSON.parse(results[3][1]) : new Array(7).fill(null),
      currentWorkout: results[4][1] ? JSON.parse(results[4][1]) : null,
    };
  } catch (error) {
    console.error('Erro ao carregar dados do usuário:', error);
    return null;
  }
};
// src/types/index.ts

export interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

export interface Exercise {
  id: string;
  name: string;
  category: string;
}

export interface WorkoutSet {
  reps: number;
  weight: number;
  completed: boolean;
}

export interface WorkoutExercise {
  exerciseId: string;
  exerciseName: string;
  sets: WorkoutSet[];
}

export interface WorkoutTemplate {
  id: string;
  name: string;
  exercises: { id: string; defaultSets: number }[];
}

export interface WorkoutHistory {
  id: string;
  name: string;
  date: string;
  exercises: {
    exerciseId: string;
    sets: WorkoutSet[];
  }[];
}

export interface WorkoutInProgress {
  id: number;
  name: string;
  exercises: WorkoutExercise[];
}

export interface AppData {
  exercises: Exercise[];
  workoutTemplates: WorkoutTemplate[];
  workoutHistory: WorkoutHistory[];
  weeklyRoutine: (string | null)[];
  currentWorkout: WorkoutInProgress | null;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (name: string, email: string, password: string, isAdmin?: boolean) => Promise<boolean>;
  updateUser: (userId: string, updates: Partial<User>) => Promise<boolean>;
  deleteUser: (userId: string) => Promise<boolean>;
  getUsers: () => User[];
}

export interface DataContextType {
  data: AppData | null;
  loading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
  updatePartial: (updates: Partial<AppData>) => Promise<void>;
}
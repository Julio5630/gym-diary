// src/services/mockData.ts
import { Exercise, WorkoutTemplate, WorkoutHistory } from '@/src/types';

export const MOCK_EXERCISES: Exercise[] = [
  { id: 'ex1', name: 'Supino reto', category: 'Peito' },
  { id: 'ex2', name: 'Crucifixo', category: 'Peito' },
  { id: 'ex3', name: 'Puxada frontal', category: 'Costas' },
  { id: 'ex4', name: 'Remada curvada', category: 'Costas' },
  { id: 'ex5', name: 'Rosca direta', category: 'Bíceps' },
  { id: 'ex6', name: 'Rosca alternada', category: 'Bíceps' },
  { id: 'ex7', name: 'Tríceps corda', category: 'Tríceps' },
  { id: 'ex8', name: 'Tríceps francês', category: 'Tríceps' },
  { id: 'ex9', name: 'Agachamento livre', category: 'Perna' },
  { id: 'ex10', name: 'Leg press', category: 'Perna' },
  { id: 'ex11', name: 'Desenvolvimento', category: 'Ombro' },
  { id: 'ex12', name: 'Elevação lateral', category: 'Ombro' },
  { id: 'ex13', name: 'Panturrilha em pé', category: 'Perna' },
  { id: 'ex14', name: 'Stiff', category: 'Perna' },
  { id: 'ex15', name: 'Supino inclinado', category: 'Peito' },
];

export const MOCK_TEMPLATES: WorkoutTemplate[] = [
  {
    id: 'w1',
    name: 'Treino A - Peito e Tríceps',
    exercises: [
      { id: 'ex1', defaultSets: 4 },
      { id: 'ex2', defaultSets: 3 },
      { id: 'ex7', defaultSets: 3 },
      { id: 'ex8', defaultSets: 3 },
    ],
  },
  {
    id: 'w2',
    name: 'Treino B - Costas e Bíceps',
    exercises: [
      { id: 'ex3', defaultSets: 4 },
      { id: 'ex4', defaultSets: 3 },
      { id: 'ex5', defaultSets: 3 },
      { id: 'ex6', defaultSets: 3 },
    ],
  },
  {
    id: 'w3',
    name: 'Treino C - Pernas',
    exercises: [
      { id: 'ex9', defaultSets: 4 },
      { id: 'ex10', defaultSets: 3 },
      { id: 'ex13', defaultSets: 4 },
      { id: 'ex14', defaultSets: 3 },
    ],
  },
  {
    id: 'w4',
    name: 'Treino D - Ombro e Abdômen',
    exercises: [
      { id: 'ex11', defaultSets: 4 },
      { id: 'ex12', defaultSets: 3 },
    ],
  },
];

export const MOCK_HISTORY: WorkoutHistory[] = [
  {
    id: 'hist1',
    name: 'Treino A - Peito e Tríceps',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    exercises: [
      {
        exerciseId: 'ex1',
        sets: [
          { reps: 10, weight: 60, completed: true },
          { reps: 8, weight: 65, completed: true },
          { reps: 8, weight: 65, completed: true },
          { reps: 7, weight: 65, completed: true },
        ],
      },
      {
        exerciseId: 'ex2',
        sets: [
          { reps: 12, weight: 20, completed: true },
          { reps: 10, weight: 22, completed: true },
          { reps: 10, weight: 22, completed: true },
        ],
      },
      {
        exerciseId: 'ex7',
        sets: [
          { reps: 15, weight: 25, completed: true },
          { reps: 12, weight: 27, completed: true },
          { reps: 12, weight: 27, completed: true },
        ],
      },
    ],
  },
  {
    id: 'hist2',
    name: 'Treino B - Costas e Bíceps',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    exercises: [
      {
        exerciseId: 'ex3',
        sets: [
          { reps: 10, weight: 50, completed: true },
          { reps: 8, weight: 55, completed: true },
          { reps: 8, weight: 55, completed: true },
        ],
      },
      {
        exerciseId: 'ex5',
        sets: [
          { reps: 12, weight: 15, completed: true },
          { reps: 10, weight: 17, completed: true },
          { reps: 10, weight: 17, completed: true },
        ],
      },
    ],
  },
  {
    id: 'hist3',
    name: 'Treino C - Pernas',
    date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    exercises: [
      {
        exerciseId: 'ex9',
        sets: [
          { reps: 8, weight: 80, completed: true },
          { reps: 6, weight: 85, completed: true },
          { reps: 6, weight: 85, completed: true },
        ],
      },
      {
        exerciseId: 'ex10',
        sets: [
          { reps: 10, weight: 120, completed: true },
          { reps: 8, weight: 130, completed: true },
          { reps: 8, weight: 130, completed: true },
        ],
      },
    ],
  },
];

export const EXERCISE_CATEGORIES = [
  'Peito',
  'Costas',
  'Perna',
  'Ombro',
  'Bíceps',
  'Tríceps',
  'Abdômen',
  'Outros',
];
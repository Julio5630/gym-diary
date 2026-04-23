// app/(auth)/execution.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useData } from '@/src/contexts/DataContext';
import Header from '@/src/components/Header';
import IndustrialCard from '@/src/components/IndustrialCard';
import Checkbox from '@/src/components/Checkbox';
import GearBackground from '@/src/components/GearBackground';
import LoadingSpinner from '@/src/components/LoadingSpinner';
import { colors } from '@/src/styles/colors';
import { WorkoutInProgress, WorkoutExercise } from '@/src/types';

export default function WorkoutExecutionScreen() {
  const router = useRouter();
  const { data, updatePartial } = useData();
  const [currentWorkout, setCurrentWorkout] = useState<WorkoutInProgress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!data) return;

    if (data.currentWorkout) {
      setCurrentWorkout(data.currentWorkout);
      setLoading(false);
      return;
    }

    const today = new Date().getDay();
    const routineId = data.weeklyRoutine?.[today];
    let template = null;
    if (routineId) {
      template = data.workoutTemplates?.find(w => w.id === routineId);
    }

    if (template) {
      const workoutExercises: WorkoutExercise[] = template.exercises.map(exItem => {
        const exercise = data.exercises?.find(e => e.id === exItem.id);
        const defaultSets = exItem.defaultSets || 3;
        const sets = Array(defaultSets).fill(null).map(() => ({ reps: 8, weight: 0, completed: false }));
        return {
          exerciseId: exItem.id,
          exerciseName: exercise ? exercise.name : 'Exercício',
          sets,
        };
      });
      const newWorkout: WorkoutInProgress = {
        id: Date.now(),
        name: template.name,
        exercises: workoutExercises,
      };
      setCurrentWorkout(newWorkout);
      updatePartial({ currentWorkout: newWorkout });
    } else {
      setCurrentWorkout(null);
    }
    setLoading(false);
  }, [data]);

  const updateWorkout = (updatedWorkout: WorkoutInProgress) => {
    setCurrentWorkout(updatedWorkout);
    updatePartial({ currentWorkout: updatedWorkout });
  };

  const addSet = (exIndex: number) => {
    if (!currentWorkout) return;
    const newWorkout = { ...currentWorkout };
    newWorkout.exercises[exIndex].sets.push({ reps: 8, weight: 0, completed: false });
    updateWorkout(newWorkout);
  };

  const removeSet = (exIndex: number, setIndex: number) => {
    if (!currentWorkout) return;
    const newWorkout = { ...currentWorkout };
    newWorkout.exercises[exIndex].sets.splice(setIndex, 1);
    updateWorkout(newWorkout);
  };

  const updateReps = (exIndex: number, setIndex: number, delta: number) => {
    if (!currentWorkout) return;
    const newWorkout = { ...currentWorkout };
    const current = newWorkout.exercises[exIndex].sets[setIndex].reps;
    if (current + delta >= 0) {
      newWorkout.exercises[exIndex].sets[setIndex].reps += delta;
      updateWorkout(newWorkout);
    }
  };

  const updateWeight = (exIndex: number, setIndex: number, delta: number) => {
    if (!currentWorkout) return;
    const newWorkout = { ...currentWorkout };
    const current = newWorkout.exercises[exIndex].sets[setIndex].weight;
    if (current + delta >= 0) {
      newWorkout.exercises[exIndex].sets[setIndex].weight += delta;
      updateWorkout(newWorkout);
    }
  };

  const toggleComplete = (exIndex: number, setIndex: number) => {
    if (!currentWorkout) return;
    const newWorkout = { ...currentWorkout };
    newWorkout.exercises[exIndex].sets[setIndex].completed = 
      !newWorkout.exercises[exIndex].sets[setIndex].completed;
    updateWorkout(newWorkout);
  };

  const removeExercise = (exIndex: number) => {
    if (!currentWorkout) return;
    const newWorkout = { ...currentWorkout };
    newWorkout.exercises.splice(exIndex, 1);
    updateWorkout(newWorkout);
  };

  const finishWorkout = () => {
    if (!currentWorkout || !data) return;
    
    const historyEntry = {
      id: Date.now().toString(),
      name: currentWorkout.name,
      date: new Date().toISOString().split('T')[0],
      exercises: currentWorkout.exercises.map(ex => ({
        exerciseId: ex.exerciseId,
        sets: ex.sets.map(s => ({ reps: s.reps, weight: s.weight, completed: s.completed })),
      })),
    };
    
    const newHistory = [historyEntry, ...(data.workoutHistory || [])];
    updatePartial({ workoutHistory: newHistory, currentWorkout: null });
    Alert.alert('Sucesso', 'Treino finalizado com sucesso!');
    router.push('/history');
  };

  const selectTemplate = (templateId: string) => {
    if (!data) return;
    const template = data.workoutTemplates?.find(w => w.id === templateId);
    if (template) {
      const workoutExercises: WorkoutExercise[] = template.exercises.map(exItem => {
        const exercise = data.exercises?.find(e => e.id === exItem.id);
        const defaultSets = exItem.defaultSets || 3;
        const sets = Array(defaultSets).fill(null).map(() => ({ reps: 8, weight: 0, completed: false }));
        return {
          exerciseId: exItem.id,
          exerciseName: exercise ? exercise.name : 'Exercício',
          sets,
        };
      });
      const newWorkout: WorkoutInProgress = {
        id: Date.now(),
        name: template.name,
        exercises: workoutExercises,
      };
      setCurrentWorkout(newWorkout);
      updatePartial({ currentWorkout: newWorkout });
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen message="Carregando..." />;
  }

  if (!currentWorkout) {
    return (
      <View style={styles.container}>
        <GearBackground variant="default" />
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Header title="EXECUÇÃO DE TREINO" subtitle="NENHUM TREINO PROGRAMADO PARA HOJE" variant="small" />
          
          <IndustrialCard title="ESCOLHA UM TREINO" icon="🏋️">
            <View style={styles.templateList}>
              {data?.workoutTemplates?.map(template => (
                <TouchableOpacity
                  key={template.id}
                  style={styles.templateButton}
                  onPress={() => selectTemplate(template.id)}
                >
                  <Text style={styles.templateButtonText}>{template.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </IndustrialCard>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <GearBackground variant="default" />
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Header title="EXECUÇÃO DE TREINO" subtitle={currentWorkout.name} variant="small" />
        
        <IndustrialCard>
          <View style={styles.workoutHeader}>
            <Text style={styles.workoutTitle}>{currentWorkout.name}</Text>
            <TouchableOpacity style={styles.finishButton} onPress={finishWorkout}>
              <Text style={styles.finishButtonText}>FINALIZAR</Text>
            </TouchableOpacity>
          </View>

          {currentWorkout.exercises.map((exercise, exIdx) => (
            <View key={exIdx} style={styles.exerciseBlock}>
              <View style={styles.exerciseHeader}>
                <Text style={styles.exerciseName}>{exercise.exerciseName}</Text>
                <TouchableOpacity onPress={() => removeExercise(exIdx)}>
                  <Text style={styles.removeText}>✖</Text>
                </TouchableOpacity>
              </View>

              {exercise.sets.map((set, setIdx) => (
                <View key={setIdx} style={styles.setRow}>
                  <Checkbox checked={set.completed} onToggle={() => toggleComplete(exIdx, setIdx)} size={40} />
                  
                  <View style={styles.setControls}>
                    <View style={styles.controlGroup}>
                      <TouchableOpacity style={styles.controlBtn} onPress={() => updateReps(exIdx, setIdx, -1)}>
                        <Text style={styles.controlBtnText}>-</Text>
                      </TouchableOpacity>
                      <Text style={styles.valueText}>{set.reps}</Text>
                      <TouchableOpacity style={styles.controlBtn} onPress={() => updateReps(exIdx, setIdx, 1)}>
                        <Text style={styles.controlBtnText}>+</Text>
                      </TouchableOpacity>
                      <Text style={styles.labelText}>REPS</Text>
                    </View>
                    
                    <View style={styles.controlGroup}>
                      <TouchableOpacity style={styles.controlBtn} onPress={() => updateWeight(exIdx, setIdx, -2.5)}>
                        <Text style={styles.controlBtnText}>-</Text>
                      </TouchableOpacity>
                      <Text style={styles.valueText}>{set.weight} kg</Text>
                      <TouchableOpacity style={styles.controlBtn} onPress={() => updateWeight(exIdx, setIdx, 2.5)}>
                        <Text style={styles.controlBtnText}>+</Text>
                      </TouchableOpacity>
                      <Text style={styles.labelText}>PESO</Text>
                    </View>
                    
                    <TouchableOpacity onPress={() => removeSet(exIdx, setIdx)}>
                      <Text style={styles.removeSetText}>✖</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
              
              <TouchableOpacity style={styles.addSetButton} onPress={() => addSet(exIdx)}>
                <Text style={styles.addSetButtonText}>+ Adicionar série</Text>
              </TouchableOpacity>
            </View>
          ))}
        </IndustrialCard>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  templateList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
  },
  templateButton: {
    backgroundColor: colors.industrialGray,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 4,
  },
  templateButtonText: {
    color: colors.textLight,
    fontWeight: 'bold',
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.industrialBorder,
  },
  workoutTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  finishButton: {
    backgroundColor: colors.successDark,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  finishButtonText: {
    color: colors.textLight,
    fontWeight: 'bold',
    fontSize: 12,
  },
  exerciseBlock: {
    backgroundColor: colors.overlay,
    borderRadius: 4,
    padding: 12,
    marginBottom: 16,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  removeText: {
    color: colors.danger,
    fontSize: 16,
  },
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 8,
    borderRadius: 4,
    marginBottom: 8,
    gap: 12,
  },
  setControls: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
  },
  controlGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.industrialDark,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 6,
  },
  controlBtn: {
    width: 28,
    height: 28,
    backgroundColor: colors.industrialGray,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlBtnText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  valueText: {
    color: colors.textLight,
    fontSize: 14,
    fontWeight: 'bold',
    minWidth: 45,
    textAlign: 'center',
  },
  labelText: {
    color: colors.textDark,
    fontSize: 10,
    marginLeft: 2,
  },
  removeSetText: {
    color: colors.danger,
    fontSize: 14,
    padding: 4,
  },
  addSetButton: {
    backgroundColor: 'rgba(255,107,53,0.2)',
    borderWidth: 1,
    borderColor: colors.primary,
    borderStyle: 'dashed',
    borderRadius: 4,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  addSetButtonText: {
    color: colors.primaryLight,
    fontSize: 12,
  },
});
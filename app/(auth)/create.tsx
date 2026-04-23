// app/(auth)/create.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useData } from '@/src/contexts/DataContext';
import Header from '@/src/components/Header';
import IndustrialCard from '@/src/components/IndustrialCard';
import IndustrialInput from '@/src/components/IndustrialInput';
import IndustrialButton from '@/src/components/IndustrialButton';
import GearBackground from '@/src/components/GearBackground';
import LoadingSpinner from '@/src/components/LoadingSpinner';
import { colors } from '@/src/styles/colors';
import { Exercise } from '@/src/types';

export default function WorkoutCreatorScreen() {
  const router = useRouter();
  const { data, updatePartial } = useData();
  const [workoutName, setWorkoutName] = useState('');
  const [selectedExercises, setSelectedExercises] = useState<{ id: string; name: string; defaultSets: number }[]>([]);
  const [defaultSets, setDefaultSets] = useState(3);

  if (!data) {
    return <LoadingSpinner fullScreen message="Carregando..." />;
  }

  const availableExercises: Exercise[] = data.exercises || [];

  const addExercise = (exercise: Exercise) => {
    if (selectedExercises.find(e => e.id === exercise.id)) {
      Alert.alert('Aviso', 'Este exercício já foi adicionado');
      return;
    }
    setSelectedExercises([
      ...selectedExercises,
      { id: exercise.id, name: exercise.name, defaultSets },
    ]);
  };

  const removeExercise = (index: number) => {
    const newSelected = [...selectedExercises];
    newSelected.splice(index, 1);
    setSelectedExercises(newSelected);
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const newSelected = [...selectedExercises];
    [newSelected[index - 1], newSelected[index]] = [newSelected[index], newSelected[index - 1]];
    setSelectedExercises(newSelected);
  };

  const moveDown = (index: number) => {
    if (index === selectedExercises.length - 1) return;
    const newSelected = [...selectedExercises];
    [newSelected[index], newSelected[index + 1]] = [newSelected[index + 1], newSelected[index]];
    setSelectedExercises(newSelected);
  };

  const updateDefaultSets = (index: number, sets: number) => {
    const newSelected = [...selectedExercises];
    newSelected[index].defaultSets = sets;
    setSelectedExercises(newSelected);
  };

  const saveWorkout = () => {
    if (!workoutName.trim()) {
      Alert.alert('Erro', 'Digite um nome para o treino');
      return;
    }
    if (selectedExercises.length === 0) {
      Alert.alert('Erro', 'Adicione pelo menos um exercício');
      return;
    }

    const newTemplate = {
      id: Date.now().toString(),
      name: workoutName.trim(),
      exercises: selectedExercises.map(ex => ({
        id: ex.id,
        defaultSets: ex.defaultSets,
      })),
    };

    const updatedTemplates = [...(data.workoutTemplates || []), newTemplate];
    updatePartial({ workoutTemplates: updatedTemplates });

    setWorkoutName('');
    setSelectedExercises([]);
    Alert.alert('Sucesso', 'Treino criado com sucesso!', [
      { text: 'OK', onPress: () => router.push('/routines') },
    ]);
  };

  return (
    <View style={styles.container}>
      <GearBackground variant="default" />
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Header title="CRIAR NOVO TREINO" subtitle="MONTE SUA ROTINA PERSONALIZADA" />
        
        <IndustrialCard>
          <View style={styles.form}>
            <IndustrialInput
              label="NOME DO TREINO"
              placeholder="Ex: Treino A - Peito e Tríceps"
              value={workoutName}
              onChangeText={setWorkoutName}
            />

            <View style={styles.row}>
              <View style={styles.halfInput}>
                <Text style={styles.label}>SÉRIES PADRÃO</Text>
                <TextInput
                  style={styles.input}
                  value={String(defaultSets)}
                  onChangeText={(text) => setDefaultSets(parseInt(text) || 1)}
                  keyboardType="numeric"
                  placeholder="3"
                  placeholderTextColor={colors.textDark}
                />
                <Text style={styles.smallText}>Número de séries ao adicionar exercício</Text>
              </View>
            </View>

            <View style={styles.exercisesPanel}>
              {/* Available Exercises */}
              <View style={styles.panel}>
                <Text style={styles.panelTitle}>EXERCÍCIOS DISPONÍVEIS</Text>
                <ScrollView style={styles.panelList} nestedScrollEnabled>
                  {availableExercises.map((exercise) => {
                    const isAdded = selectedExercises.some(e => e.id === exercise.id);
                    return (
                      <View key={exercise.id} style={styles.listItem}>
                        <Text style={styles.itemName}>{exercise.name}</Text>
                        <TouchableOpacity
                          style={[styles.addButton, isAdded && styles.addButtonDisabled]}
                          onPress={() => addExercise(exercise)}
                          disabled={isAdded}
                        >
                          <Text style={styles.addButtonText}>+</Text>
                        </TouchableOpacity>
                      </View>
                    );
                  })}
                  {availableExercises.length === 0 && (
                    <Text style={styles.emptyText}>Nenhum exercício disponível</Text>
                  )}
                </ScrollView>
              </View>

              {/* Selected Exercises */}
              <View style={styles.panel}>
                <Text style={styles.panelTitle}>EXERCÍCIOS SELECIONADOS</Text>
                <ScrollView style={styles.panelList} nestedScrollEnabled>
                  {selectedExercises.map((exercise, idx) => (
                    <View key={exercise.id} style={[styles.listItem, styles.selectedItem]}>
                      <View style={styles.itemInfo}>
                        <Text style={styles.itemName}>{exercise.name}</Text>
                        <View style={styles.setsControl}>
                          <Text style={styles.setsLabel}>Séries:</Text>
                          <TextInput
                            style={styles.setsInput}
                            value={String(exercise.defaultSets)}
                            onChangeText={(text) => updateDefaultSets(idx, parseInt(text) || 1)}
                            keyboardType="numeric"
                          />
                        </View>
                      </View>
                      <View style={styles.itemActions}>
                        <TouchableOpacity onPress={() => moveUp(idx)} disabled={idx === 0}>
                          <Text style={[styles.actionIcon, idx === 0 && styles.disabledIcon]}>↑</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => moveDown(idx)} disabled={idx === selectedExercises.length - 1}>
                          <Text style={[styles.actionIcon, idx === selectedExercises.length - 1 && styles.disabledIcon]}>↓</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => removeExercise(idx)}>
                          <Text style={[styles.actionIcon, styles.removeIcon]}>✖</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                  {selectedExercises.length === 0 && (
                    <Text style={styles.emptyText}>Nenhum exercício adicionado</Text>
                  )}
                </ScrollView>
              </View>
            </View>

            <View style={styles.formActions}>
              <IndustrialButton title="SALVAR TREINO" onPress={saveWorkout} variant="primary" />
            </View>
          </View>
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
  form: {
    gap: 20,
  },
  row: {
    flexDirection: 'row',
    gap: 20,
  },
  halfInput: {
    flex: 1,
  },
  label: {
    color: colors.textDark,
    fontSize: 12,
    letterSpacing: 1,
    marginBottom: 6,
    fontFamily: 'monospace',
  },
  input: {
    backgroundColor: colors.overlay,
    borderWidth: 1,
    borderColor: colors.industrialGray,
    borderRadius: 4,
    padding: 12,
    color: colors.textLight,
    fontFamily: 'monospace',
    fontSize: 14,
  },
  smallText: {
    color: colors.textDark,
    fontSize: 10,
    marginTop: 4,
  },
  exercisesPanel: {
    flexDirection: 'row',
    gap: 20,
  },
  panel: {
    flex: 1,
    backgroundColor: colors.overlay,
    borderWidth: 1,
    borderColor: colors.industrialBorder,
    borderRadius: 4,
    padding: 12,
    minHeight: 300,
  },
  panelTitle: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 12,
    letterSpacing: 1,
  },
  panelList: {
    maxHeight: 300,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.industrialBorder,
  },
  selectedItem: {
    backgroundColor: 'rgba(255,107,53,0.05)',
  },
  itemInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap',
  },
  itemName: {
    color: colors.text,
    fontSize: 12,
  },
  setsControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.industrialDark,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  setsLabel: {
    color: colors.textDark,
    fontSize: 10,
  },
  setsInput: {
    backgroundColor: colors.background,
    width: 40,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
    color: colors.textLight,
    textAlign: 'center',
  },
  itemActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionIcon: {
    color: colors.textDark,
    fontSize: 16,
    padding: 4,
  },
  disabledIcon: {
    opacity: 0.3,
  },
  removeIcon: {
    color: colors.danger,
  },
  addButton: {
    backgroundColor: colors.industrialGray,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonDisabled: {
    opacity: 0.3,
  },
  addButtonText: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: 'bold',
  },
  emptyText: {
    color: colors.textDark,
    textAlign: 'center',
    padding: 20,
    fontSize: 12,
  },
  formActions: {
    alignItems: 'flex-end',
    marginTop: 20,
  },
});

// Responsive adjustment
if (typeof window !== 'undefined' && window.innerWidth < 768) {
  Object.assign(styles.exercisesPanel, { flexDirection: 'column' });
}
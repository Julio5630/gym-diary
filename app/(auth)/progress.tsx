// app/(auth)/progress.tsx
import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useData } from '@/src/contexts/DataContext';
import Header from '@/src/components/Header';
import IndustrialCard from '@/src/components/IndustrialCard';
import GearBackground from '@/src/components/GearBackground';
import LoadingSpinner from '@/src/components/LoadingSpinner';
import { colors } from '@/src/styles/colors';
import { Exercise } from '@/src/types';

const { width: screenWidth } = Dimensions.get('window');

export default function ProgressScreen() {
  const { data } = useData();
  const [selectedExerciseId, setSelectedExerciseId] = useState('');

  if (!data) {
    return <LoadingSpinner fullScreen message="Carregando..." />;
  }

  const exercises: Exercise[] = data.exercises || [];
  const history = data.workoutHistory || [];
  const sortedHistory = [...history].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Progression data for selected exercise
  const progression = useMemo(() => {
    if (!selectedExerciseId) return [];
    const entries: { date: string; weight: number; reps: number; volume: number; label: string }[] = [];
    sortedHistory.forEach(workout => {
      const exerciseLog = workout.exercises?.find(e => e.exerciseId === selectedExerciseId);
      if (exerciseLog && exerciseLog.sets?.length) {
        const lastSet = exerciseLog.sets[exerciseLog.sets.length - 1];
        entries.push({
          date: workout.date,
          weight: lastSet.weight,
          reps: lastSet.reps,
          volume: lastSet.weight * lastSet.reps,
          label: workout.date.slice(5),
        });
      }
    });
    return entries;
  }, [selectedExerciseId, sortedHistory]);

  // Personal best
  const personalBest = useMemo(() => {
    if (!selectedExerciseId) return null;
    let best = { weight: 0, reps: 0, volume: 0, date: '' };
    sortedHistory.forEach(workout => {
      const exerciseLog = workout.exercises?.find(e => e.exerciseId === selectedExerciseId);
      if (exerciseLog && exerciseLog.sets?.length) {
        exerciseLog.sets.forEach(set => {
          const volume = set.weight * set.reps;
          if (volume > best.volume) {
            best = { weight: set.weight, reps: set.reps, volume, date: workout.date };
          }
        });
      }
    });
    return best.volume > 0 ? best : null;
  }, [selectedExerciseId, sortedHistory]);

  // Weekly volume (last 5 weeks)
  const weeklyVolume = useMemo(() => {
    const weeks = [];
    const now = new Date();
    for (let i = 4; i >= 0; i--) {
      const start = new Date(now);
      start.setDate(now.getDate() - (now.getDay() + 7 * i));
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      let volume = 0;
      history.forEach(workout => {
        const workoutDate = new Date(workout.date);
        if (workoutDate >= start && workoutDate <= end) {
          workout.exercises?.forEach(ex => {
            ex.sets?.forEach(set => {
              volume += (set.weight || 0) * (set.reps || 0);
            });
          });
        }
      });
      weeks.push({
        label: `${start.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}`,
        volume,
      });
    }
    return weeks;
  }, [history]);

  const maxVolume = Math.max(...weeklyVolume.map(w => w.volume), 1);
  const maxWeeklyWorkouts = Math.max(...weeklyVolume.map(w => Math.floor(w.volume / 100)), 1);

  const getBarWidth = (value: number, max: number) => {
    return (value / max) * 100;
  };

  return (
    <View style={styles.container}>
      <GearBackground variant="progress" />
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Header title="PROGRESSO E EVOLUÇÃO" subtitle="ACOMPANHE SEUS RESULTADOS" />

        <IndustrialCard>
          <View style={styles.selector}>
            <Text style={styles.selectorLabel}>ESCOLHA UM EXERCÍCIO:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.selectorScroll}>
              <View style={styles.selectorButtons}>
                <TouchableOpacity
                  style={[styles.selectorButton, !selectedExerciseId && styles.selectorButtonActive]}
                  onPress={() => setSelectedExerciseId('')}
                >
                  <Text style={styles.selectorButtonText}>-- Selecione --</Text>
                </TouchableOpacity>
                {exercises.map(ex => (
                  <TouchableOpacity
                    key={ex.id}
                    style={[styles.selectorButton, selectedExerciseId === ex.id && styles.selectorButtonActive]}
                    onPress={() => setSelectedExerciseId(ex.id)}
                  >
                    <Text style={styles.selectorButtonText}>{ex.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          {selectedExerciseId && (
            <>
              {personalBest && (
                <View style={styles.personalBest}>
                  <Text style={styles.pbIcon}>👑</Text>
                  <View style={styles.pbText}>
                    <Text style={styles.pbLabel}>RECORDE PESSOAL</Text>
                    <Text style={styles.pbValue}>
                      {personalBest.weight} kg x {personalBest.reps} reps
                    </Text>
                    <Text style={styles.pbDate}>
                      {new Date(personalBest.date).toLocaleDateString('pt-BR')}
                    </Text>
                  </View>
                </View>
              )}

              <View style={styles.chartContainer}>
                <Text style={styles.chartTitle}>EVOLUÇÃO DE CARGA (kg)</Text>
                {progression.length === 0 ? (
                  <Text style={styles.noData}>Nenhum dado registrado para este exercício.</Text>
                ) : (
                  <View style={styles.barsContainer}>
                    {progression.slice(-8).map((entry, idx) => {
                      const maxWeight = Math.max(...progression.map(p => p.weight), 1);
                      const barWidth = (entry.weight / maxWeight) * 100;
                      return (
                        <View key={idx} style={styles.barItem}>
                          <Text style={styles.barLabel}>{entry.label}</Text>
                          <View style={styles.barWrapper}>
                            <View style={[styles.bar, { width: `${barWidth}%` }]}>
                              <Text style={styles.barValue}>{entry.weight}</Text>
                            </View>
                          </View>
                        </View>
                      );
                    })}
                  </View>
                )}
              </View>

              <View style={styles.recentTable}>
                <Text style={styles.tableTitle}>ÚLTIMOS TREINOS</Text>
                <View style={styles.tableHeader}>
                  <Text style={[styles.tableCell, styles.tableCellDate]}>Data</Text>
                  <Text style={[styles.tableCell, styles.tableCellWeight]}>Peso</Text>
                  <Text style={[styles.tableCell, styles.tableCellReps]}>Reps</Text>
                  <Text style={[styles.tableCell, styles.tableCellVolume]}>Volume</Text>
                </View>
                {progression.slice(-5).reverse().map((entry, idx) => (
                  <View key={idx} style={styles.tableRow}>
                    <Text style={[styles.tableCell, styles.tableCellDate]}>{entry.date}</Text>
                    <Text style={[styles.tableCell, styles.tableCellWeight]}>{entry.weight}</Text>
                    <Text style={[styles.tableCell, styles.tableCellReps]}>{entry.reps}</Text>
                    <Text style={[styles.tableCell, styles.tableCellVolume]}>{entry.volume}</Text>
                  </View>
                ))}
              </View>
            </>
          )}
        </IndustrialCard>

        {/* Weekly Stats */}
        <View style={styles.statsGrid}>
          <IndustrialCard title="VOLUME SEMANAL (kg)" icon="📊">
            <View style={styles.weeklyBars}>
              {weeklyVolume.map((week, idx) => (
                <View key={idx} style={styles.weeklyItem}>
                  <Text style={styles.weeklyLabel}>{week.label}</Text>
                  <View style={styles.weeklyBarWrapper}>
                    <View style={[styles.weeklyBar, { width: `${getBarWidth(week.volume, maxVolume)}%` }]} />
                    <Text style={styles.weeklyBarValue}>{week.volume.toLocaleString()}</Text>
                  </View>
                </View>
              ))}
            </View>
          </IndustrialCard>

          <IndustrialCard title="FREQUÊNCIA SEMANAL" icon="📅">
            <View style={styles.weeklyBars}>
              {weeklyVolume.map((week, idx) => {
                const workouts = Math.floor(week.volume / 100);
                return (
                  <View key={idx} style={styles.weeklyItem}>
                    <Text style={styles.weeklyLabel}>{week.label}</Text>
                    <View style={styles.weeklyBarWrapper}>
                      <View style={[styles.weeklyBarFrequency, { width: `${getBarWidth(workouts, maxWeeklyWorkouts)}%` }]} />
                      <Text style={styles.weeklyBarValue}>{workouts} treinos</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </IndustrialCard>
        </View>
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
  selector: {
    marginBottom: 20,
  },
  selectorLabel: {
    color: colors.textDark,
    fontSize: 12,
    letterSpacing: 1,
    marginBottom: 10,
  },
  selectorScroll: {
    flexGrow: 0,
  },
  selectorButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  selectorButton: {
    backgroundColor: colors.industrialGray,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  selectorButtonActive: {
    backgroundColor: colors.primary,
  },
  selectorButtonText: {
    color: colors.textLight,
    fontSize: 12,
    fontWeight: '500',
  },
  personalBest: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    backgroundColor: 'rgba(255,107,53,0.2)',
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    padding: 12,
    borderRadius: 4,
    marginBottom: 20,
  },
  pbIcon: {
    fontSize: 28,
  },
  pbText: {
    flex: 1,
  },
  pbLabel: {
    color: colors.primary,
    fontSize: 10,
    letterSpacing: 1,
  },
  pbValue: {
    color: colors.textLight,
    fontSize: 16,
    fontWeight: 'bold',
  },
  pbDate: {
    color: colors.textDark,
    fontSize: 10,
  },
  chartContainer: {
    marginBottom: 20,
  },
  chartTitle: {
    color: colors.primary,
    fontSize: 12,
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.industrialBorder,
    paddingBottom: 5,
  },
  noData: {
    color: colors.textDark,
    textAlign: 'center',
    padding: 30,
  },
  barsContainer: {
    gap: 12,
  },
  barItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  barLabel: {
    width: 50,
    color: colors.textDark,
    fontSize: 10,
  },
  barWrapper: {
    flex: 1,
    backgroundColor: colors.overlay,
    borderRadius: 4,
    height: 28,
    overflow: 'hidden',
  },
  bar: {
    backgroundColor: colors.primary,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 8,
  },
  barValue: {
    color: colors.textLight,
    fontSize: 10,
    fontWeight: 'bold',
  },
  recentTable: {
    marginTop: 10,
  },
  tableTitle: {
    color: colors.primary,
    fontSize: 12,
    marginBottom: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.industrialBorder,
    paddingBottom: 8,
    marginBottom: 8,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.industrialBorder,
  },
  tableCell: {
    color: colors.textDark,
    fontSize: 11,
  },
  tableCellDate: {
    width: '30%',
  },
  tableCellWeight: {
    width: '20%',
  },
  tableCellReps: {
    width: '20%',
  },
  tableCellVolume: {
    width: '30%',
  },
  statsGrid: {
    gap: 20,
    marginTop: 10,
  },
  weeklyBars: {
    gap: 12,
  },
  weeklyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  weeklyLabel: {
    width: 50,
    color: colors.textDark,
    fontSize: 10,
  },
  weeklyBarWrapper: {
    flex: 1,
    backgroundColor: colors.overlay,
    borderRadius: 4,
    height: 24,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 8,
  },
  weeklyBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    height: '100%',
    backgroundColor: colors.success,
    borderRadius: 4,
  },
  weeklyBarFrequency: {
    position: 'absolute',
    left: 0,
    top: 0,
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  weeklyBarValue: {
    color: colors.textLight,
    fontSize: 10,
    fontWeight: 'bold',
    zIndex: 1,
  },
});
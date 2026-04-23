// app/(auth)/history.tsx
import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
} from 'react-native';
import { useData } from '@/src/contexts/DataContext';
import Header from '@/src/components/Header';
import GearBackground from '@/src/components/GearBackground';
import LoadingSpinner from '@/src/components/LoadingSpinner';
import { colors } from '@/src/styles/colors';

const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
const monthNames = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

interface DayData {
  date: Date;
  dateStr: string;
  workouts: any[];
  status: 'completed' | 'missed' | 'none';
  hasRecord: boolean;
}

export default function HistoryScreen() {
  const { data } = useData();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<DayData | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  if (!data) {
    return <LoadingSpinner fullScreen message="Carregando..." />;
  }

  // Calculate records per exercise
  const records = useMemo(() => {
    const rec: Record<string, { volume: number; weight: number; reps: number; date: string }> = {};
    data.workoutHistory?.forEach(workout => {
      workout.exercises?.forEach(ex => {
        ex.sets?.forEach(set => {
          const volume = (set.weight || 0) * (set.reps || 0);
          const current = rec[ex.exerciseId];
          if (!current || volume > current.volume) {
            rec[ex.exerciseId] = {
              volume,
              weight: set.weight,
              reps: set.reps,
              date: workout.date,
            };
          }
        });
      });
    });
    return rec;
  }, [data.workoutHistory]);

  const dayHasRecord = (dateStr: string, workouts: any[]) => {
    return workouts.some(workout =>
      workout.exercises.some((ex: any) =>
        ex.sets.some((set: any) => {
          const volume = (set.weight || 0) * (set.reps || 0);
          const record = records[ex.exerciseId];
          return record && record.volume === volume && record.date === workout.date;
        })
      )
    );
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const startWeekday = firstDayOfMonth.getDay();

  const days: DayData[] = [];
  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(year, month, i);
    const dateStr = date.toISOString().split('T')[0];
    const workoutsOnDay = data.workoutHistory?.filter(w => w.date === dateStr) || [];
    const hasWorkout = workoutsOnDay.length > 0;
    const routineId = data.weeklyRoutine?.[date.getDay()];
    const hasRoutine = routineId && data.workoutTemplates?.some(t => t.id === routineId);
    
    let status: 'completed' | 'missed' | 'none' = 'none';
    if (hasWorkout) status = 'completed';
    else if (hasRoutine) status = 'missed';
    
    const hasRecord = dayHasRecord(dateStr, workoutsOnDay);
    
    days.push({ date, dateStr, workouts: workoutsOnDay, status, hasRecord });
  }

  const blankCells = Array(startWeekday).fill(null);
  const allCells = [...blankCells, ...days];

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDay(null);
  };
  
  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDay(null);
  };

  const openDayDetails = (day: DayData) => {
    setSelectedDay(day);
    setModalVisible(true);
  };

  const getExerciseName = (exerciseId: string) => {
    const exercise = data.exercises?.find(e => e.id === exerciseId);
    return exercise ? exercise.name : 'Exercício';
  };

  const isRecordForExercise = (exerciseId: string, workoutDate: string, sets: any[]) => {
    return sets.some(set => {
      const volume = (set.weight || 0) * (set.reps || 0);
      const record = records[exerciseId];
      return record && record.volume === volume && record.date === workoutDate;
    });
  };

  return (
    <View style={styles.container}>
      <GearBackground variant="history" />
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Header title="HISTÓRICO DE TREINOS" subtitle="CALENDÁRIO DE ATIVIDADES" />

        <View style={styles.calendarCard}>
          <View style={styles.cardCorner} />
          
          <View style={styles.calendarNav}>
            <TouchableOpacity onPress={prevMonth} style={styles.navButton}>
              <Text style={styles.navButtonText}>◀</Text>
            </TouchableOpacity>
            <Text style={styles.calendarTitle}>
              {monthNames[month]} {year}
            </Text>
            <TouchableOpacity onPress={nextMonth} style={styles.navButton}>
              <Text style={styles.navButtonText}>▶</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.calendarWeekdays}>
            {weekDays.map((day, idx) => (
              <Text key={idx} style={styles.weekday}>{day}</Text>
            ))}
          </View>

          <View style={styles.calendarGrid}>
            {allCells.map((cell, idx) => (
              <TouchableOpacity
                key={idx}
                style={[
                  styles.calendarDay,
                  !cell && styles.blankDay,
                  cell?.status === 'completed' && styles.completedDay,
                  cell?.status === 'missed' && styles.missedDay,
                  cell?.hasRecord && styles.recordDay,
                ]}
                onPress={() => cell && openDayDetails(cell)}
                disabled={!cell}
                activeOpacity={0.7}
              >
                {cell && (
                  <>
                    <Text style={styles.dayNumber}>{cell.date.getDate()}</Text>
                    {cell.hasRecord && <Text style={styles.crownIcon}>👑</Text>}
                    {cell.status === 'completed' && !cell.hasRecord && (
                      <Text style={styles.indicator}>✓</Text>
                    )}
                    {cell.status === 'missed' && (
                      <Text style={styles.indicator}>!</Text>
                    )}
                  </>
                )}
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.legend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, styles.legendCompleted]} />
              <Text style={styles.legendText}>Treino realizado</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, styles.legendMissed]} />
              <Text style={styles.legendText}>Treino perdido</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, styles.legendNone]} />
              <Text style={styles.legendText}>Descanso</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, styles.legendRecord]} />
              <Text style={styles.legendText}>Recorde!</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Modal for day details */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {selectedDay?.date.toLocaleDateString('pt-BR', { 
                  weekday: 'long', 
                  day: 'numeric', 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalBody}>
              {selectedDay?.workouts.length === 0 ? (
                <Text style={styles.noWorkouts}>Nenhum treino registrado neste dia.</Text>
              ) : (
                selectedDay?.workouts.map((workout) => (
                  <View key={workout.id} style={styles.workoutDetail}>
                    <Text style={styles.workoutName}>{workout.name}</Text>
                    {workout.exercises.map((ex: any) => {
                      const isRecord = isRecordForExercise(ex.exerciseId, workout.date, ex.sets);
                      return (
                        <View key={ex.exerciseId} style={styles.exerciseDetail}>
                          <Text style={styles.exerciseName}>
                            {getExerciseName(ex.exerciseId)}
                            {isRecord && <Text style={styles.recordBadge}> 👑 RECORDE</Text>}
                          </Text>
                          {ex.sets.map((set: any, idx: number) => (
                            <Text key={idx} style={styles.setDetail}>
                              • Série {idx + 1}: {set.reps} reps x {set.weight}kg {set.completed ? '✔' : ''}
                            </Text>
                          ))}
                        </View>
                      );
                    })}
                  </View>
                ))
              )}
            </ScrollView>
            
            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.closeButtonText}>Fechar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
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
  calendarCard: {
    backgroundColor: colors.cardBg,
    borderWidth: 1,
    borderColor: colors.industrialBorder,
    borderRadius: 4,
    padding: 20,
    position: 'relative',
  },
  cardCorner: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 30,
    height: 30,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderTopColor: colors.primary,
    borderLeftColor: colors.primary,
  },
  calendarNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  navButton: {
    backgroundColor: colors.overlay,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  navButtonText: {
    color: colors.text,
    fontSize: 16,
  },
  calendarTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  calendarWeekdays: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  weekday: {
    color: colors.textDark,
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    width: '14%',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calendarDay: {
    width: '14.28%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.overlay,
    borderWidth: 1,
    borderColor: colors.industrialBorder,
    borderRadius: 4,
    margin: 2,
    position: 'relative',
  },
  blankDay: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
  completedDay: {
    backgroundColor: 'rgba(46, 204, 113, 0.2)',
    borderColor: colors.success,
  },
  missedDay: {
    backgroundColor: 'rgba(220, 53, 69, 0.2)',
    borderColor: colors.danger,
  },
  recordDay: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    borderColor: colors.gold,
    shadowColor: colors.gold,
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
  dayNumber: {
    color: colors.text,
    fontSize: 14,
    fontWeight: 'bold',
  },
  crownIcon: {
    position: 'absolute',
    top: 2,
    right: 4,
    fontSize: 12,
  },
  indicator: {
    position: 'absolute',
    bottom: 2,
    right: 4,
    fontSize: 10,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 20,
    marginTop: 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: colors.industrialBorder,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendColor: {
    width: 14,
    height: 14,
    borderRadius: 2,
  },
  legendCompleted: {
    backgroundColor: 'rgba(46, 204, 113, 0.4)',
    borderWidth: 1,
    borderColor: colors.success,
  },
  legendMissed: {
    backgroundColor: 'rgba(220, 53, 69, 0.4)',
    borderWidth: 1,
    borderColor: colors.danger,
  },
  legendNone: {
    backgroundColor: 'rgba(128, 128, 128, 0.2)',
    borderWidth: 1,
    borderColor: colors.textDark,
  },
  legendRecord: {
    backgroundColor: 'rgba(255, 215, 0, 0.4)',
    borderWidth: 1,
    borderColor: colors.gold,
  },
  legendText: {
    color: colors.textDark,
    fontSize: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.industrialDark,
    borderRadius: 4,
    width: '90%',
    maxWidth: 500,
    maxHeight: '80%',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.industrialBorder,
  },
  modalTitle: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: 'bold',
    flex: 1,
    flexWrap: 'wrap',
  },
  modalClose: {
    color: colors.textDark,
    fontSize: 18,
    padding: 4,
  },
  modalBody: {
    padding: 16,
    maxHeight: 400,
  },
  noWorkouts: {
    color: colors.textDark,
    textAlign: 'center',
    padding: 20,
  },
  workoutDetail: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.industrialBorder,
    paddingBottom: 15,
  },
  workoutName: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  exerciseDetail: {
    marginTop: 8,
    paddingLeft: 10,
    borderLeftWidth: 2,
    borderLeftColor: colors.primary,
  },
  exerciseName: {
    color: colors.text,
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  recordBadge: {
    color: colors.gold,
    fontSize: 10,
  },
  setDetail: {
    color: colors.textDark,
    fontSize: 11,
    marginLeft: 12,
    marginBottom: 2,
  },
  modalFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.industrialBorder,
    alignItems: 'flex-end',
  },
  closeButton: {
    backgroundColor: colors.industrialGray,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  closeButtonText: {
    color: colors.textLight,
    fontSize: 12,
    fontWeight: 'bold',
  },
});
// app/(auth)/routines.tsx
import GearBackground from '@/src/components/GearBackground';
import Header from '@/src/components/Header';
import LoadingSpinner from '@/src/components/LoadingSpinner';
import { useData } from '@/src/contexts/DataContext';
import { colors } from '@/src/styles/colors';
import React, { useState } from 'react';
import {
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

const weekdays = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];

export default function RoutinesScreen() {
  const { data, updatePartial } = useData();
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  if (!data) {
    return <LoadingSpinner fullScreen message="Carregando..." />;
  }

  const routine = data.weeklyRoutine || new Array(7).fill(null);
  const startOfWeek = new Date();
  const currentDayOfWeek = startOfWeek.getDay();
  const diffToMonday = currentDayOfWeek === 0 ? -6 : 1 - currentDayOfWeek;
  startOfWeek.setDate(startOfWeek.getDate() + diffToMonday);

  const weekDates = weekdays.map((_, idx) => {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + idx);
    return date;
  });

  const getWorkoutName = (workoutId: string | null) => {
    if (!workoutId) return '—';
    const workout = data.workoutTemplates?.find(w => w.id === workoutId);
    return workout ? workout.name : '—';
  };

  const handleDayPress = (index: number) => {
    setSelectedDay(index);
    setModalVisible(true);
  };

  const assignWorkout = (workoutId: string | null) => {
    if (selectedDay !== null) {
      const newRoutine = [...routine];
      newRoutine[selectedDay] = workoutId;
      updatePartial({ weeklyRoutine: newRoutine });
      setModalVisible(false);
      setSelectedDay(null);
    }
  };

  return (
    <View style={styles.container}>
      <GearBackground variant="default" />
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Header title="ROTINA SEMANAL" subtitle="CALENDÁRIO DE TREINOS" />
        
        <View style={styles.calendarGrid}>
          {weekdays.map((day, idx) => (
            <TouchableOpacity
              key={idx}
              style={[styles.dayCard, routine[idx] ? styles.dayCardFilled : undefined]}
              onPress={() => handleDayPress(idx)}
              activeOpacity={0.7}
            >
              <View style={styles.dayHeader}>
                <Text style={styles.dayName}>{day}</Text>
                <Text style={styles.dayDate}>
                  {weekDates[idx].toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })}
                </Text>
              </View>
              <View style={styles.dayWorkout}>
                {routine[idx] ? (
                  <>
                    <View style={styles.workoutBadge}>
                      <Text style={styles.workoutBadgeText}>{getWorkoutName(routine[idx])}</Text>
                    </View>
                    <Text style={styles.editHint}>✎ Editar</Text>
                  </>
                ) : (
                  <View style={styles.assignButton}>
                    <Text style={styles.assignButtonText}>+ Atribuir treino</Text>
                  </View>
                )}
              </View>
              <View style={styles.cardCorner} />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, styles.legendFilled]} />
            <Text style={styles.legendText}>Treino atribuído</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, styles.legendEmpty]} />
            <Text style={styles.legendText}>Sem treino</Text>
          </View>
        </View>
      </ScrollView>

      {/* Modal para selecionar treino */}
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
              <Text style={styles.modalTitle}>SELECIONAR TREINO</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalList}>
              <TouchableOpacity
                style={styles.modalOption}
                onPress={() => assignWorkout(null)}
              >
                <Text style={styles.modalOptionText}>— Nenhum —</Text>
              </TouchableOpacity>
              {data.workoutTemplates?.map((workout) => (
                <TouchableOpacity
                  key={workout.id}
                  style={styles.modalOption}
                  onPress={() => assignWorkout(workout.id)}
                >
                  <Text style={styles.modalOptionText}>{workout.name}</Text>
                  <Text style={styles.modalOptionCount}>
                    {workout.exercises.length} exercícios
                  </Text>
                </TouchableOpacity>
              ))}
              {data.workoutTemplates?.length === 0 && (
                <Text style={styles.modalEmpty}>Nenhum treino cadastrado</Text>
              )}
            </ScrollView>
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
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 30,
  },
  dayCard: {
    flex: 1,
    minWidth: '30%',
    backgroundColor: colors.cardBg,
    borderWidth: 1,
    borderColor: colors.industrialBorder,
    borderRadius: 4,
    padding: 12,
    position: 'relative',
  },
  dayCardFilled: {
    borderLeftColor: colors.primary,
    borderLeftWidth: 3,
  },
  cardCorner: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 20,
    height: 20,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderTopColor: colors.primary,
    borderLeftColor: colors.primary,
  },
  dayHeader: {
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.industrialBorder,
  },
  dayName: {
    color: colors.text,
    fontWeight: 'bold',
    fontSize: 14,
  },
  dayDate: {
    color: colors.textDark,
    fontSize: 10,
    fontFamily: 'monospace',
    marginTop: 4,
  },
  dayWorkout: {
    alignItems: 'center',
    minHeight: 60,
    justifyContent: 'center',
  },
  workoutBadge: {
    backgroundColor: 'rgba(255,107,53,0.2)',
    borderLeftWidth: 2,
    borderLeftColor: colors.primary,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 2,
    marginBottom: 6,
  },
  workoutBadgeText: {
    color: colors.text,
    fontSize: 11,
    textAlign: 'center',
  },
  editHint: {
    color: colors.textDark,
    fontSize: 10,
  },
  assignButton: {
    borderWidth: 1,
    borderColor: colors.industrialBorder,
    borderStyle: 'dashed',
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  assignButtonText: {
    color: colors.textDark,
    fontSize: 10,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 30,
    padding: 15,
    backgroundColor: colors.overlay,
    borderRadius: 4,
    alignSelf: 'center',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 2,
  },
  legendFilled: {
    backgroundColor: colors.primary,
  },
  legendEmpty: {
    borderWidth: 1,
    borderColor: colors.textDark,
    borderStyle: 'dashed',
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
    maxWidth: 400,
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
    letterSpacing: 1,
  },
  modalClose: {
    color: colors.textDark,
    fontSize: 18,
  },
  modalList: {
    padding: 8,
  },
  modalOption: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.industrialBorder,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalOptionText: {
    color: colors.text,
    fontSize: 14,
  },
  modalOptionCount: {
    color: colors.textDark,
    fontSize: 10,
  },
  modalEmpty: {
    color: colors.textDark,
    textAlign: 'center',
    padding: 20,
  },
});
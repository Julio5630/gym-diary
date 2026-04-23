// app/(auth)/dashboard.tsx
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/src/contexts/AuthContext';
import { useData } from '@/src/contexts/DataContext';
import GearBackground from '@/src/components/GearBackground';
import IndustrialCard from '@/src/components/IndustrialCard';
import Header from '@/src/components/Header';
import LoadingSpinner from '@/src/components/LoadingSpinner';
import { colors } from '@/src/styles/colors';

export default function DashboardScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { data, loading } = useData();

  if (loading) {
    return <LoadingSpinner fullScreen message="Carregando dados..." />;
  }

  const today = new Date().getDay();
  const todayWorkoutId = data?.weeklyRoutine?.[today];
  const todayWorkout = data?.workoutTemplates?.find(w => w.id === todayWorkoutId);
  const lastWorkout = data?.workoutHistory?.[0];

  // Frequência semanal (últimos 7 dias)
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const workoutsThisWeek = data?.workoutHistory?.filter(w => new Date(w.date) >= weekAgo).length || 0;

  // Volume total
  let totalVolume = 0;
  data?.workoutHistory?.forEach(workout => {
    if (new Date(workout.date) >= weekAgo) {
      workout.exercises?.forEach(ex => {
        ex.sets?.forEach(set => {
          totalVolume += (set.weight || 0) * (set.reps || 0);
        });
      });
    }
  });

  const QuickAccessButton = ({ title, route, icon }: { title: string; route: any; icon: string }) => (
    <TouchableOpacity
      style={styles.quickButton}
      onPress={() => router.push(route)}
    >
      <Text style={styles.quickButtonIcon}>{icon}</Text>
      <Text style={styles.quickButtonText}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <GearBackground variant="dashboard" />
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Header title="PAINEL DE CONTROLE" subtitle={`OPERADOR: ${user?.name?.toUpperCase() || 'USER'}`} />

        {/* Cards Grid */}
        <View style={styles.cardsGrid}>
          {/* Treino de Hoje */}
          <IndustrialCard title="🔥 TREINO DE HOJE" icon="🔥">
            {todayWorkout ? (
              <>
                <Text style={styles.workoutName}>{todayWorkout.name}</Text>
                <Text style={styles.workoutStats}>
                  {todayWorkout.exercises?.length || 0} exercícios
                </Text>
                <TouchableOpacity
                  style={styles.cardButton}
                  onPress={() => router.push('/execution')}
                >
                  <Text style={styles.cardButtonText}>INICIAR TREINO</Text>
                </TouchableOpacity>
              </>
            ) : (
              <View>
                <Text style={styles.noWorkoutText}>Nenhum treino programado para hoje</Text>
                <TouchableOpacity
                  style={[styles.cardButton, styles.smallButton]}
                  onPress={() => router.push('/routines')}
                >
                  <Text style={styles.cardButtonText}>CONFIGURAR ROTINA</Text>
                </TouchableOpacity>
              </View>
            )}
          </IndustrialCard>

          {/* Último Treino */}
          <IndustrialCard title="📆 ÚLTIMO TREINO" icon="📆">
            {lastWorkout ? (
              <>
                <Text style={styles.workoutName}>{lastWorkout.name}</Text>
                <Text style={styles.workoutDate}>{lastWorkout.date}</Text>
                <Text style={styles.workoutStats}>
                  {lastWorkout.exercises?.reduce((acc, ex) => acc + (ex.sets?.length || 0), 0)} séries
                </Text>
                <TouchableOpacity
                  style={[styles.cardButton, styles.smallButton]}
                  onPress={() => router.push('/history')}
                >
                  <Text style={styles.cardButtonText}>VER DETALHES</Text>
                </TouchableOpacity>
              </>
            ) : (
              <Text style={styles.noWorkoutText}>Nenhum treino registrado ainda</Text>
            )}
          </IndustrialCard>

          {/* Resumo Semanal */}
          <IndustrialCard title="📊 RESUMO SEMANAL" icon="📊">
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Treinos:</Text>
              <Text style={styles.statValue}>{workoutsThisWeek}/7</Text>
            </View>
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressFill, { width: `${(workoutsThisWeek / 7) * 100}%` }]} />
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Volume total:</Text>
              <Text style={styles.statValue}>{totalVolume.toLocaleString()} kg</Text>
            </View>
          </IndustrialCard>
        </View>

        {/* Acesso Rápido */}
        <IndustrialCard title="⚡ ACESSO RÁPIDO" icon="⚡" noPadding>
          <View style={styles.quickButtonsGrid}>
            <QuickAccessButton title="EXECUÇÃO" route="/execution" icon="🏋️" />
            <QuickAccessButton title="CRIAR TREINO" route="/create" icon="✏️" />
            <QuickAccessButton title="BIBLIOTECA" route="/library" icon="📚" />
            <QuickAccessButton title="PROGRESSO" route="/progress" icon="📊" />
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
  cardsGrid: {
    gap: 20,
    marginBottom: 20,
  },
  workoutName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 8,
  },
  workoutDate: {
    fontSize: 12,
    color: colors.textDark,
    fontFamily: 'monospace',
    marginBottom: 4,
  },
  workoutStats: {
    fontSize: 12,
    color: colors.textDark,
    marginBottom: 12,
  },
  noWorkoutText: {
    color: colors.textDark,
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 12,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statLabel: {
    color: colors.textDark,
    fontSize: 12,
  },
  statValue: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: 12,
  },
  progressBarContainer: {
    backgroundColor: colors.overlay,
    borderRadius: 4,
    height: 8,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressFill: {
    backgroundColor: colors.primary,
    height: '100%',
  },
  cardButton: {
    backgroundColor: colors.industrialGray,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 12,
  },
  smallButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  cardButtonText: {
    color: colors.textLight,
    fontWeight: 'bold',
    fontSize: 12,
    letterSpacing: 1,
  },
  quickButtonsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 20,
    gap: 12,
  },
  quickButton: {
    backgroundColor: colors.industrialGray,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 4,
    alignItems: 'center',
    minWidth: 100,
    flex: 1,
  },
  quickButtonIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  quickButtonText: {
    color: colors.textLight,
    fontWeight: 'bold',
    fontSize: 11,
    letterSpacing: 1,
  },
});
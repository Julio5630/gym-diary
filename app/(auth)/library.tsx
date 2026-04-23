// app/(auth)/library.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { useData } from '@/src/contexts/DataContext';
import Header from '@/src/components/Header';
import IndustrialCard from '@/src/components/IndustrialCard';
import IndustrialButton from '@/src/components/IndustrialButton';
import GearBackground from '@/src/components/GearBackground';
import LoadingSpinner from '@/src/components/LoadingSpinner';
import { colors } from '@/src/styles/colors';
import { Exercise } from '@/src/types';

const categories = ['Peito', 'Costas', 'Perna', 'Ombro', 'Bíceps', 'Tríceps', 'Abdômen', 'Outros'];

export default function ExerciseLibraryScreen() {
  const { data, updatePartial } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('todas');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('Peito');

  if (!data) {
    return <LoadingSpinner fullScreen message="Carregando..." />;
  }

  const exercises = data.exercises || [];

  const filteredExercises = exercises.filter(ex => {
    const matchCategory = filterCategory === 'todas' || ex.category === filterCategory;
    const matchSearch = ex.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });

  const openCreateModal = () => {
    setEditingExercise(null);
    setFormName('');
    setFormCategory('Peito');
    setModalVisible(true);
  };

  const openEditModal = (exercise: Exercise) => {
    setEditingExercise(exercise);
    setFormName(exercise.name);
    setFormCategory(exercise.category);
    setModalVisible(true);
  };

  const handleSave = () => {
    if (!formName.trim()) {
      Alert.alert('Erro', 'Nome do exercício é obrigatório');
      return;
    }

    let newExercises: Exercise[];
    
    if (editingExercise) {
      // Edit existing
      newExercises = exercises.map(ex =>
        ex.id === editingExercise.id
          ? { ...ex, name: formName.trim(), category: formCategory }
          : ex
      );
    } else {
      // Create new
      const newExercise: Exercise = {
        id: Date.now().toString(),
        name: formName.trim(),
        category: formCategory,
      };
      newExercises = [...exercises, newExercise];
    }

    updatePartial({ exercises: newExercises });
    setModalVisible(false);
    Alert.alert('Sucesso', editingExercise ? 'Exercício atualizado!' : 'Exercício criado!');
  };

  const handleDelete = (exercise: Exercise) => {
    Alert.alert(
      'Confirmar exclusão',
      `Remover "${exercise.name}"? Ele será excluído de todos os treinos.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            const newExercises = exercises.filter(ex => ex.id !== exercise.id);
            updatePartial({ exercises: newExercises });
            Alert.alert('Sucesso', 'Exercício removido!');
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <GearBackground variant="library" />
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Header title="BIBLIOTECA DE EXERCÍCIOS" subtitle="GERENCIE SEUS MOVIMENTOS" />

        {/* Controls */}
        <View style={styles.controlsBar}>
          <View style={styles.searchBox}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="PESQUISAR EXERCÍCIO..."
              placeholderTextColor={colors.textDark}
              value={searchTerm}
              onChangeText={setSearchTerm}
            />
          </View>
          
          <View style={styles.filterBox}>
            <TextInput
              style={styles.filterInput}
              value={filterCategory}
              onChangeText={setFilterCategory}
              placeholder="TODAS CATEGORIAS"
              placeholderTextColor={colors.textDark}
            />
          </View>
          
          <IndustrialButton title="+ NOVO EXERCÍCIO" onPress={openCreateModal} size="small" />
        </View>

        {/* Exercises Grid */}
        <View style={styles.exercisesGrid}>
          {filteredExercises.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Nenhum exercício encontrado.</Text>
            </View>
          ) : (
            filteredExercises.map(exercise => (
              <View key={exercise.id} style={styles.exerciseCard}>
                <View style={styles.cardCorner} />
                <View style={styles.exerciseInfo}>
                  <Text style={styles.exerciseName}>{exercise.name}</Text>
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryText}>{exercise.category}</Text>
                  </View>
                </View>
                <View style={styles.cardActions}>
                  <TouchableOpacity onPress={() => openEditModal(exercise)} style={styles.actionBtn}>
                    <Text style={styles.editIcon}>✎</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDelete(exercise)} style={styles.actionBtn}>
                    <Text style={styles.deleteIcon}>🗑</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Modal for Create/Edit */}
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
                {editingExercise ? 'EDITAR EXERCÍCIO' : 'NOVO EXERCÍCIO'}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalBody}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>NOME</Text>
                <TextInput
                  style={styles.formInput}
                  value={formName}
                  onChangeText={setFormName}
                  placeholder="Ex: Supino reto"
                  placeholderTextColor={colors.textDark}
                />
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>CATEGORIA</Text>
                <TextInput
                  style={styles.formInput}
                  value={formCategory}
                  onChangeText={setFormCategory}
                  placeholder="Categoria"
                  placeholderTextColor={colors.textDark}
                />
              </View>
            </View>
            
            <View style={styles.modalFooter}>
              <IndustrialButton
                title="CANCELAR"
                onPress={() => setModalVisible(false)}
                variant="secondary"
                size="small"
              />
              <IndustrialButton
                title="SALVAR"
                onPress={handleSave}
                variant="primary"
                size="small"
              />
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
  controlsBar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
    backgroundColor: colors.cardBg,
    borderRadius: 4,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.industrialBorder,
  },
  searchBox: {
    flex: 1,
    position: 'relative',
    minWidth: 200,
  },
  searchIcon: {
    position: 'absolute',
    left: 10,
    top: 10,
    zIndex: 1,
    color: colors.textDark,
  },
  searchInput: {
    backgroundColor: colors.overlay,
    borderWidth: 1,
    borderColor: colors.industrialGray,
    borderRadius: 4,
    paddingVertical: 10,
    paddingLeft: 32,
    paddingRight: 12,
    color: colors.textLight,
    fontFamily: 'monospace',
    fontSize: 12,
  },
  filterBox: {
    minWidth: 150,
  },
  filterInput: {
    backgroundColor: colors.overlay,
    borderWidth: 1,
    borderColor: colors.industrialGray,
    borderRadius: 4,
    paddingVertical: 10,
    paddingHorizontal: 12,
    color: colors.textLight,
    fontFamily: 'monospace',
    fontSize: 12,
  },
  exercisesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  exerciseCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.cardBg,
    borderWidth: 1,
    borderColor: colors.industrialBorder,
    borderRadius: 4,
    padding: 16,
    width: '48%',
    position: 'relative',
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
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    color: colors.text,
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  categoryBadge: {
    backgroundColor: 'rgba(255,107,53,0.2)',
    borderLeftWidth: 2,
    borderLeftColor: colors.primary,
    paddingVertical: 2,
    paddingHorizontal: 6,
    alignSelf: 'flex-start',
  },
  categoryText: {
    color: colors.primaryLight,
    fontSize: 10,
    fontFamily: 'monospace',
  },
  cardActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionBtn: {
    padding: 4,
  },
  editIcon: {
    color: colors.textDark,
    fontSize: 16,
  },
  deleteIcon: {
    color: colors.danger,
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    width: '100%',
  },
  emptyText: {
    color: colors.textDark,
    fontSize: 14,
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
    borderWidth: 1,
    borderColor: colors.industrialBorder,
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
  modalBody: {
    padding: 20,
    gap: 16,
  },
  formGroup: {
    gap: 6,
  },
  formLabel: {
    color: colors.textDark,
    fontSize: 11,
    letterSpacing: 1,
  },
  formInput: {
    backgroundColor: colors.overlay,
    borderWidth: 1,
    borderColor: colors.industrialGray,
    borderRadius: 4,
    padding: 10,
    color: colors.textLight,
    fontFamily: 'monospace',
    fontSize: 14,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.industrialBorder,
  },
});

// Responsive adjustment
if (typeof window !== 'undefined' && window.innerWidth < 768) {
  Object.assign(styles.exerciseCard, { width: '100%' });
}
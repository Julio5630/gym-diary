// app/(auth)/admin.tsx
import React, { useState, useEffect } from 'react';
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
import { useAuth } from '@/src/contexts/AuthContext';
import Header from '@/src/components/Header';
import IndustrialCard from '@/src/components/IndustrialCard';
import IndustrialInput from '@/src/components/IndustrialInput';
import IndustrialButton from '@/src/components/IndustrialButton';
import GearBackground from '@/src/components/GearBackground';
import LoadingSpinner from '@/src/components/LoadingSpinner';
import { colors } from '@/src/styles/colors';
import { User } from '@/src/types';

export default function AdminPanelScreen() {
  const { user, getUsers, register, updateUser, deleteUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  
  // Edit state
  const [editUserId, setEditUserId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [editIsAdmin, setEditIsAdmin] = useState(false);
  
  // Delete modal
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    const userList = getUsers();
    setUsers(userList);
    setLoading(false);
  };

  const handleCreateUser = async () => {
    if (!name || !email || !password) {
      setMessage('Preencha todos os campos');
      setTimeout(() => setMessage(''), 3000);
      return;
    }
    
    const success = await register(name, email, password, false);
    if (success) {
      setMessage('Usuário criado com sucesso!');
      setName('');
      setEmail('');
      setPassword('');
      loadUsers();
    } else {
      setMessage('Erro ao criar usuário');
    }
    setTimeout(() => setMessage(''), 3000);
  };

  const startEdit = (userData: User) => {
    setEditUserId(userData.id);
    setEditName(userData.name);
    setEditEmail(userData.email);
    setEditPassword('');
    setEditIsAdmin(userData.isAdmin);
  };

  const cancelEdit = () => {
    setEditUserId(null);
    setEditName('');
    setEditEmail('');
    setEditPassword('');
    setEditIsAdmin(false);
  };

  const handleUpdateUser = async () => {
    if (!editName || !editEmail) {
      setMessage('Nome e email são obrigatórios');
      setTimeout(() => setMessage(''), 3000);
      return;
    }
    
    const updates: Partial<User> = {
      name: editName,
      email: editEmail,
      isAdmin: editIsAdmin,
    };
    
    if (editPassword) {
      // In a real app, you'd hash this
      Object.assign(updates, { password: editPassword });
    }
    
    const success = await updateUser(editUserId!, updates);
    if (success) {
      setMessage('Usuário atualizado');
      cancelEdit();
      loadUsers();
    } else {
      setMessage('Erro ao atualizar');
    }
    setTimeout(() => setMessage(''), 3000);
  };

  const confirmDelete = (userId: string) => {
    setDeleteConfirmId(userId);
  };

  const handleDeleteUser = async () => {
    if (deleteConfirmId) {
      const success = await deleteUser(deleteConfirmId);
      if (success) {
        setMessage('Usuário removido');
        loadUsers();
      } else {
        setMessage('Não é possível remover o próprio usuário');
      }
      setDeleteConfirmId(null);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen message="Carregando usuários..." />;
  }

  return (
    <View style={styles.container}>
      <GearBackground variant="default" />
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Header title="PAINEL DE ADMINISTRAÇÃO" subtitle="GERENCIAR USUÁRIOS" />

        {message !== '' && (
          <View style={styles.messageContainer}>
            <Text style={styles.messageText}>{message}</Text>
          </View>
        )}

        <View style={styles.grid}>
          {/* Create User Card */}
          <IndustrialCard title="👤+ CRIAR NOVO USUÁRIO" icon="👤+">
            <IndustrialInput
              label="NOME"
              placeholder="Nome completo"
              value={name}
              onChangeText={setName}
            />
            <IndustrialInput
              label="EMAIL"
              placeholder="email@exemplo.com"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <IndustrialInput
              label="SENHA"
              placeholder="********"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            <IndustrialButton title="CRIAR USUÁRIO" onPress={handleCreateUser} variant="primary" />
          </IndustrialCard>

          {/* Users List Card */}
          <IndustrialCard title="📋 USUÁRIOS CADASTRADOS" icon="📋">
            <ScrollView style={styles.usersList} nestedScrollEnabled>
              {users.map((userData) => (
                <View key={userData.id} style={styles.userItem}>
                  {editUserId === userData.id ? (
                    // Edit Mode
                    <View style={styles.editForm}>
                      <TextInput
                        style={styles.editInput}
                        value={editName}
                        onChangeText={setEditName}
                        placeholder="Nome"
                        placeholderTextColor={colors.textDark}
                      />
                      <TextInput
                        style={styles.editInput}
                        value={editEmail}
                        onChangeText={setEditEmail}
                        placeholder="Email"
                        placeholderTextColor={colors.textDark}
                        autoCapitalize="none"
                      />
                      <TextInput
                        style={styles.editInput}
                        value={editPassword}
                        onChangeText={setEditPassword}
                        placeholder="Nova senha (opcional)"
                        placeholderTextColor={colors.textDark}
                        secureTextEntry
                      />
                      <View style={styles.checkboxRow}>
                        <TouchableOpacity
                          style={[styles.checkbox, editIsAdmin && styles.checkboxChecked]}
                          onPress={() => setEditIsAdmin(!editIsAdmin)}
                        />
                        <Text style={styles.checkboxLabel}>Administrador</Text>
                      </View>
                      <View style={styles.editActions}>
                        <IndustrialButton title="SALVAR" onPress={handleUpdateUser} size="small" />
                        <IndustrialButton title="CANCELAR" onPress={cancelEdit} variant="secondary" size="small" />
                      </View>
                    </View>
                  ) : (
                    // View Mode
                    <>
                      <View style={styles.userInfo}>
                        <Text style={styles.userName}>{userData.name}</Text>
                        <Text style={styles.userEmail}>{userData.email}</Text>
                        {userData.isAdmin && (
                          <View style={styles.adminBadge}>
                            <Text style={styles.adminBadgeText}>ADMIN</Text>
                          </View>
                        )}
                      </View>
                      <View style={styles.userActions}>
                        <TouchableOpacity onPress={() => startEdit(userData)} style={styles.actionButton}>
                          <Text style={styles.editIcon}>✏️</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => confirmDelete(userData.id)} style={styles.actionButton}>
                          <Text style={styles.deleteIcon}>🗑️</Text>
                        </TouchableOpacity>
                      </View>
                    </>
                  )}
                </View>
              ))}
              {users.length === 0 && (
                <Text style={styles.noUsers}>Nenhum usuário cadastrado</Text>
              )}
            </ScrollView>
          </IndustrialCard>
        </View>
      </ScrollView>

      {/* Delete Confirmation Modal */}
      <Modal
        visible={deleteConfirmId !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setDeleteConfirmId(null)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setDeleteConfirmId(null)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>CONFIRMAR EXCLUSÃO</Text>
            </View>
            <View style={styles.modalBody}>
              <Text style={styles.modalText}>Tem certeza que deseja excluir este usuário?</Text>
              <Text style={styles.modalWarning}>Esta ação não pode ser desfeita.</Text>
            </View>
            <View style={styles.modalFooter}>
              <IndustrialButton title="EXCLUIR" onPress={handleDeleteUser} variant="danger" size="small" />
              <IndustrialButton title="CANCELAR" onPress={() => setDeleteConfirmId(null)} variant="secondary" size="small" />
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
  messageContainer: {
    backgroundColor: colors.primary,
    padding: 12,
    borderRadius: 4,
    marginBottom: 20,
  },
  messageText: {
    color: colors.textLight,
    textAlign: 'center',
    fontSize: 12,
    fontFamily: 'monospace',
  },
  grid: {
    gap: 20,
  },
  usersList: {
    maxHeight: 500,
  },
  userItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.industrialBorder,
  },
  userInfo: {
    flex: 1,
    gap: 4,
  },
  userName: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: 'bold',
  },
  userEmail: {
    color: colors.textDark,
    fontSize: 11,
    fontFamily: 'monospace',
  },
  adminBadge: {
    backgroundColor: colors.primary,
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 2,
    marginTop: 4,
  },
  adminBadgeText: {
    color: colors.background,
    fontSize: 9,
    fontWeight: 'bold',
  },
  userActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    padding: 4,
  },
  editIcon: {
    fontSize: 16,
  },
  deleteIcon: {
    fontSize: 16,
    color: colors.danger,
  },
  editForm: {
    flex: 1,
    gap: 8,
  },
  editInput: {
    backgroundColor: colors.overlay,
    borderWidth: 1,
    borderColor: colors.industrialGray,
    borderRadius: 4,
    padding: 8,
    color: colors.textLight,
    fontSize: 12,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 2,
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
  },
  checkboxLabel: {
    color: colors.textDark,
    fontSize: 11,
  },
  editActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  noUsers: {
    color: colors.textDark,
    textAlign: 'center',
    padding: 20,
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
    borderColor: colors.primary,
  },
  modalHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.industrialBorder,
    alignItems: 'center',
  },
  modalTitle: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  modalBody: {
    padding: 20,
    alignItems: 'center',
    gap: 8,
  },
  modalText: {
    color: colors.text,
    textAlign: 'center',
    fontSize: 14,
  },
  modalWarning: {
    color: colors.danger,
    fontSize: 11,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.industrialBorder,
  },
});
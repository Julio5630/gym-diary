// app/login.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/src/contexts/AuthContext';
import IndustrialInput from '@/src/components/IndustrialInput';
import IndustrialButton from '@/src/components/IndustrialButton';
import GearBackground from '@/src/components/GearBackground';
import { colors } from '@/src/styles/colors';
import { globalStyles } from '@/src/styles/globalStyles';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    setLoading(true);
    const success = await login(email, password);
    setLoading(false);

    if (success) {
      router.replace('/dashboard');
    } else {
      Alert.alert('Erro', 'Credenciais inválidas');
    }
  };

  return (
    <View style={styles.container}>
      <GearBackground variant="login" />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.card}>
            <View style={styles.cardCorner} />
            
            <View style={styles.header}>
              <Text style={styles.title}>
                GYM<Text style={styles.titleHighlight}>DIARY</Text>
              </Text>
              <View style={styles.headerLine} />
            </View>

            <View style={styles.form}>
              <IndustrialInput
                label="EMAIL"
                placeholder="seu@email.com"
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
              
              <IndustrialButton
                title="ACESSAR"
                onPress={handleLogin}
                loading={loading}
                variant="primary"
                size="large"
              />
            </View>

            <View style={styles.footer}>
              <View style={styles.rivets}>
                <View style={styles.rivet} />
                <View style={styles.rivet} />
                <View style={styles.rivet} />
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: colors.cardBg,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.industrialBorder,
    padding: 24,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.5,
    shadowRadius: 40,
    elevation: 20,
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
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: 4,
    color: colors.text,
  },
  titleHighlight: {
    color: colors.primary,
  },
  headerLine: {
    width: 60,
    height: 3,
    backgroundColor: colors.primary,
    marginTop: 12,
  },
  form: {
    gap: 20,
  },
  footer: {
    alignItems: 'center',
    marginTop: 32,
  },
  rivets: {
    flexDirection: 'row',
    gap: 20,
  },
  rivet: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.metal.light,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 1,
    elevation: 2,
  },
});
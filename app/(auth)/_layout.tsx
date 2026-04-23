// app/(auth)/_layout.tsx
import { useAuth } from '@/src/contexts/AuthContext';
import { colors } from '@/src/styles/colors';
import { Href, Stack, usePathname, useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const navItems = [
  { path: '/dashboard', label: 'Início', icon: '🏠' },
  { path: '/execution', label: 'Execução', icon: '🏋️' },
  { path: '/create', label: 'Criar', icon: '✏️' },
  { path: '/routines', label: 'Rotinas', icon: '📅' },
  { path: '/library', label: 'Biblioteca', icon: '📚' },
  { path: '/history', label: 'Histórico', icon: '📜' },
  { path: '/progress', label: 'Progresso', icon: '📊' },
];

export default function AuthLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.replace('/login' as Href);
  };

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <View style={styles.container}>
      {/* Navbar */}
      <View style={styles.navbar}>
        <View style={styles.navContainer}>
          <TouchableOpacity onPress={() => router.push('/dashboard' as Href)} style={styles.brand}>
            <Text style={styles.brandIcon}>⚙️</Text>
            <Text style={styles.brandText}>GYM<Text style={styles.brandHighlight}>DIARY</Text></Text>
          </TouchableOpacity>

          {/* Desktop Menu */}
          <View style={styles.desktopMenu}>
            {navItems.map((item) => (
              <TouchableOpacity
                key={item.path}
                style={[styles.navLink, isActive(item.path) && styles.navLinkActive]}
                onPress={() => router.push(item.path as Href)}
              >
                <Text style={styles.navIcon}>{item.icon}</Text>
                <Text style={styles.navLabel}>{item.label}</Text>
                {isActive(item.path) && <View style={styles.activeIndicator} />}
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.logoutLink} onPress={handleLogout}>
              <Text style={styles.navIcon}>🚪</Text>
              <Text style={styles.navLabel}>Sair</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.background },
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  navbar: {
    backgroundColor: 'rgba(10, 12, 15, 0.95)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 107, 53, 0.3)',
    paddingTop: 12,
    paddingBottom: 12,
    zIndex: 100,
  },
  navContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    maxWidth: 1200,
    width: '100%',
    alignSelf: 'center',
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandIcon: {
    fontSize: 24,
  },
  brandText: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 2,
    color: colors.text,
  },
  brandHighlight: {
    color: colors.primary,
  },
  desktopMenu: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  navLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
    position: 'relative',
  },
  navLinkActive: {
    backgroundColor: 'rgba(255, 107, 53, 0.1)',
  },
  navIcon: {
    fontSize: 16,
  },
  navLabel: {
    fontSize: 12,
    color: colors.textDark,
    fontWeight: '500',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: colors.primary,
  },
  logoutLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'rgba(220, 53, 69, 0.1)',
    borderRadius: 4,
    marginLeft: 8,
  },
  content: {
    flex: 1,
  },
});
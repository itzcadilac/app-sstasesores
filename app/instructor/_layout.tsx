import { Stack, useRouter } from 'expo-router';
import React, { useCallback } from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import Colors from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut } from 'lucide-react-native';

const fontWeight700 = '700' as const;

export default function InstructorLayout() {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = useCallback(async () => {
    console.log('[InstructorLayout] Logout pressed');
    await logout();
    router.replace('/login');
  }, [logout, router]);

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTitle: 'Dashboard Instructor',
        headerRight: () => (
          <TouchableOpacity onPress={handleLogout} style={styles.headerBtn} testID="instructor-logout-btn">
            <View style={styles.iconWrap}>
              <LogOut size={16} color="#fff" />
            </View>
            <Text style={styles.headerBtnText}>Cerrar sesión</Text>
          </TouchableOpacity>
        ),
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Dashboard' }} />
    </Stack>
  );
}

const styles = StyleSheet.create({
  headerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.error,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 8,
  },
  iconWrap: {
    width: 22,
    height: 22,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerBtnText: { color: '#fff', fontWeight: fontWeight700, fontSize: 12 },
});

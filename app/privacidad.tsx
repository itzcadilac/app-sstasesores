import React from 'react';
import { View, Text, StyleSheet, ScrollView, Linking } from 'react-native';
import { Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '@/constants/Colors';

export default function PrivacidadScreen() {
  const insets = useSafeAreaInsets();
  return (
    <View style={styles.container} testID="privacidad-screen">
      <Stack.Screen options={{ title: 'Política de Privacidad' }} />
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom }]}>
        <Text style={styles.h1}>Política de Privacidad</Text>
        <Text style={styles.p}>
          Respetamos tu privacidad. Esta política explica qué datos recolectamos, cómo los usamos y tus derechos.
        </Text>
        <Text style={styles.h2}>Datos que recolectamos</Text>
        <Text style={styles.p}>
          Identificadores básicos para autenticarte y registrar tus capacitaciones. No vendemos tu información.
        </Text>
        <Text style={styles.h2}>Finalidad</Text>
        <Text style={styles.p}>
          Usamos los datos para proveer el servicio, mejorar la app y cumplir obligaciones legales.
        </Text>
        <Text style={styles.h2}>Tus derechos</Text>
        <Text style={styles.p}>
          Puedes solicitar acceso, rectificación o eliminación de tus datos contactándonos.
        </Text>
        <Text style={styles.h2}>Contacto</Text>
        <Text
          onPress={() => Linking.openURL('mailto:soporte@sstasesores.pe')}
          style={styles.link}
          accessibilityRole="link"
          testID="privacy-contact-link"
        >
          soporte@sstasesores.pe
        </Text>
        <Text style={styles.small}>Última actualización: 21/10/2025</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 20, gap: 12 },
  h1: { fontSize: 22, fontWeight: '700', color: Colors.text },
  h2: { fontSize: 16, fontWeight: '600', color: Colors.text },
  p: { fontSize: 14, color: Colors.textSecondary, lineHeight: 20 },
  link: { fontSize: 14, color: Colors.primary, textDecorationLine: 'underline' },
  small: { fontSize: 12, color: Colors.textSecondary, marginTop: 8 },
});

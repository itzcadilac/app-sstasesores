import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '@/constants/Colors';

export default function TerminosScreen() {
  const insets = useSafeAreaInsets();
  return (
    <View style={styles.container} testID="terminos-screen">
      <Stack.Screen options={{ title: 'Términos y Condiciones' }} />
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom }]}>
        <Text style={styles.h1}>Términos y Condiciones</Text>
        <Text style={styles.p}>
          Bienvenido. Al usar esta aplicación aceptas estos términos. Si no estás de acuerdo, por favor no utilices la app.
        </Text>
        <Text style={styles.h2}>Uso del servicio</Text>
        <Text style={styles.p}>
          La app se ofrece para la consulta y gestión de capacitaciones. No realices usos fraudulentos, ilícitos o que perjudiquen a terceros.
        </Text>
        <Text style={styles.h2}>Cuentas y acceso</Text>
        <Text style={styles.p}>
          Eres responsable de mantener la confidencialidad de tus credenciales. Notifícanos ante cualquier uso no autorizado.
        </Text>
        <Text style={styles.h2}>Modificaciones</Text>
        <Text style={styles.p}>
          Podemos actualizar estos términos. Te notificaremos los cambios relevantes dentro de la app.
        </Text>
        <Text style={styles.small}>
          Última actualización: 21/10/2025
        </Text>
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
  small: { fontSize: 12, color: Colors.textSecondary, marginTop: 8 },
});

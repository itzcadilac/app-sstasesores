import React from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { Stack } from 'expo-router';
import Colors from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import * as instructorService from '@/services/instructorService';
import { Clock, Book, MapPin } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const fontWeight700 = '700' as const;
const fontWeight600 = '600' as const;

export default function CursosPendientesScreen() {
  const { user } = useAuth();
  const token = user?.token ?? '';
  const idInstructor = user?.id ?? '';
  const insets = useSafeAreaInsets();

  const cursosQuery = useQuery({
    queryKey: ['instructor', 'cursos-pendientes', idInstructor, token],
    queryFn: () => instructorService.getCursosPendientes(idInstructor, token),
    enabled: !!token && !!idInstructor,
  });

  const renderItem = ({ item }: { item: instructorService.CursoPendiente }) => (
    <View style={styles.card} testID={`curso-${item.idecalendcapacitaciones}`}>
      <View style={styles.cardHeader}>
        <Book size={20} color='#fff' />
        <Text style={styles.cardTitle} numberOfLines={2}>
          {item.desccapacitacion}
        </Text>
      </View>
      
      <View style={styles.cardBody}>
        <View style={styles.infoRow}>
          <Clock size={16} color={Colors.textSecondary} />
          <Text style={styles.infoText}>
            <Text style={styles.infoLabel}>Horario: </Text>
            {item.hora}
          </Text>
        </View>
        
        <View style={styles.infoRow}>
          <MapPin size={16} color={Colors.textSecondary} />
          <Text style={styles.infoText}>
            <Text style={styles.infoLabel}>Modalidad: </Text>
            {item.modalidad}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Capacitaciones Pendientes',
          headerStyle: { backgroundColor: Colors.primaryDark },
          headerTintColor: '#fff',
        }} 
      />
      <View style={styles.container}>
        {cursosQuery.isLoading && (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.loadingText}>Cargando capacitaciones pendientes...</Text>
          </View>
        )}

        {cursosQuery.isError && (
          <View style={styles.centerContainer}>
            <Text style={styles.errorText}>
              Error al cargar las capacitaciones: {cursosQuery.error?.message}
            </Text>
          </View>
        )}

        {!cursosQuery.isLoading && !cursosQuery.isError && (
          <FlatList
            data={cursosQuery.data || []}
            renderItem={renderItem}
            keyExtractor={(item) => item.idecalendcapacitaciones}
            contentContainerStyle={[
              styles.listContent,
              { paddingBottom: insets.bottom + 16 },
            ]}
            ListEmptyComponent={
              <View style={styles.centerContainer}>
                <Text style={styles.emptyText}>No hay capacitaciones pendientes</Text>
              </View>
            }
            testID="cursos-list"
          />
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: Colors.textSecondary,
  },
  errorText: {
    fontSize: 14,
    color: '#DC2626',
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeader: {
    backgroundColor: '#DC2626',
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  cardTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: fontWeight700,
    color: '#fff',
  },
  cardBody: {
    padding: 16,
    gap: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    fontSize: 14,
    color: Colors.text,
    flex: 1,
  },
  infoTextSmall: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  infoLabel: {
    fontWeight: fontWeight700,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: fontWeight600,
    textTransform: 'uppercase',
  },
});

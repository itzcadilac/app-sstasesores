import React from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { Stack } from 'expo-router';
import Colors from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import * as instructorService from '@/services/instructorService';
import { Clock, Book, MapPin, ClipboardCheck, PencilLine, FileText, Unlock } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const fontWeight700 = '700' as const;
const fontWeight600 = '600' as const;
const pendingAccent = '#C81E1E';
const pendingTint = '#FFF4F4';
const pendingChipBg = '#FFE7E2';

type PendingField = 'asistenciascerradas' | 'notascerradas' | 'fotos_cargadas' | 'cursoliberado';

type PendingIndicator = {
  key: PendingField;
  label: string;
  field: PendingField;
  Icon: typeof ClipboardCheck;
};

const pendingIndicators: PendingIndicator[] = [
  { key: 'asistenciascerradas', label: 'Cerrar asistencia', field: 'asistenciascerradas', Icon: ClipboardCheck },
  { key: 'notascerradas', label: 'Cerrar notas', field: 'notascerradas', Icon: PencilLine },
  { key: 'fotos_cargadas', label: 'Crear informes', field: 'fotos_cargadas', Icon: FileText },
  { key: 'cursoliberado', label: 'Liberación de curso', field: 'cursoliberado', Icon: Unlock },
];

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

  const renderItem = ({ item }: { item: instructorService.CursoPendiente }) => {
    const [fecha, horaExacta] = (item.hora ?? '').split(' ');
    const pendingBadges = pendingIndicators.filter(({ field }) => item[field] === 0);

    return (
      <View style={styles.card} testID={`curso-${item.idecalendcapacitaciones}`}>
        <View style={styles.cardHeader}>
          <View style={styles.statusPill}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>Curso pendiente</Text>
          </View>
          <View style={styles.headerIconWrap}>
            <Book size={20} color={pendingAccent} />
          </View>
        </View>

        <Text style={styles.cardTitle} numberOfLines={3}>
          {item.desccapacitacion}
        </Text>

        <View style={styles.divider} />

        <View style={styles.cardBody}>
          <View style={styles.infoRow}>
            <Clock size={16} color={Colors.textSecondary} />
            <Text style={styles.infoText}>
              <Text style={styles.infoLabel}>Horario: </Text>
              {fecha}
              {horaExacta ? ` · ${horaExacta}` : ''}
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

        {pendingBadges.length > 0 && (
          <View style={styles.pendingRow} testID={`pendientes-${item.idecalendcapacitaciones}`}>
            {pendingBadges.map(({ key, label, Icon }) => (
              <View key={key} style={styles.pendingBadge} testID={`pendiente-${item.idecalendcapacitaciones}-${key}`}>
                <Icon size={16} color={pendingAccent} />
                <Text style={styles.pendingBadgeText}>{label}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    );
  };

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
    gap: 16,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#FFD4D7',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
    gap: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: pendingTint,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: pendingAccent,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: fontWeight600,
    color: pendingAccent,
    textTransform: 'uppercase',
  },
  headerIconWrap: {
    backgroundColor: pendingTint,
    padding: 10,
    borderRadius: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: fontWeight700,
    color: Colors.text,
    lineHeight: 22,
  },
  divider: {
    height: 1,
    backgroundColor: '#FFE1E3',
  },
  cardBody: {
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
  infoLabel: {
    fontWeight: fontWeight700,
  },
  pendingRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  pendingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: pendingChipBg,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  pendingBadgeText: {
    marginLeft: 8,
    fontSize: 12,
    color: pendingAccent,
    fontWeight: fontWeight600,
  },
});

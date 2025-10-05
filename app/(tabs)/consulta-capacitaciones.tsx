import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, ActivityIndicator } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { FileText, Calendar, User as UserIcon, AlertCircle } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { consultarCapacitacionesPorDocumento } from '@/services/capacitacionService';

const fontWeight600 = '600' as const;

interface CapacitacionRow {
  documento: string;
  nombres?: string;
  ape_paterno?: string;
  ape_materno?: string;
  nombcompleto?: string;
  idecapacitacion?: string;
  nombrecorto?: string;
  nivel?: string | number;
  fecha?: string;
  nota?: string | number;
  ruc?: string;
  image?: string;
  empresa?: string;
  texto_cert?: string;
  canthoras?: string | number;
  codificacion?: string;
  diames?: string;
  fecini?: string;
  fecfin?: string;
}

export default function ConsultaCapacitacionesScreen() {
  const { user, isPersonal } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [rows, setRows] = useState<CapacitacionRow[]>([]);

  const fullName = useMemo(() => {
    const n = user?.nombre ?? '';
    return n;
  }, [user?.nombre]);

  const fetchData = useCallback(async () => {
    if (!isPersonal || !user?.documento) return;
    try {
      setError(null);
      setLoading(true);
      const data = await consultarCapacitacionesPorDocumento(user.documento, user.token);
      const parsed = Array.isArray(data) ? (data as CapacitacionRow[]) : [];
      setRows(parsed);
    } catch (e) {
      console.error('ConsultaCapacitaciones fetch error', e);
      setError(e instanceof Error ? e.message : 'Error desconocido');
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [isPersonal, user?.documento, user?.token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  }, [fetchData]);

  const getNotaColor = (nota?: string | number) => {
    const n = typeof nota === 'string' ? parseFloat(nota) : typeof nota === 'number' ? nota : 0;
    if (n >= 14) return Colors.success;
    if (n >= 11) return Colors.warning;
    return Colors.error;
  };

  return (
    <View style={styles.container} testID="consulta-capacitaciones-screen">
      <View style={styles.header}>
        <UserIcon size={40} color={Colors.primary} />
        <View style={{ marginLeft: 12 }}>
          <Text style={styles.title}>Mis Capacitaciones</Text>
          <Text style={styles.subtitle}>{fullName} • DNI {user?.documento ?? ''}</Text>
        </View>
      </View>

      {loading && !refreshing ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Cargando...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorBox} testID="consulta-capacitaciones-error">
          <AlertCircle size={20} color={Colors.error} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : rows.length === 0 ? (
        <View style={styles.empty}>
          <FileText size={56} color={Colors.textLight} />
          <Text style={styles.emptyTitle}>No hay registros</Text>
          <Text style={styles.emptyText}>Aún no se encontraron capacitaciones asociadas a tu documento.</Text>
        </View>
      ) : null}

      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {rows.map((row, idx) => (
          <View key={`${row.documento}-${idx}`} style={styles.card} testID={`cap-row-${idx}`}>
            <View style={styles.cardHeader}>
              <View style={styles.avatar}>
                <UserIcon size={22} color={Colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{row.nombcompleto ?? fullName}</Text>
                <Text style={styles.doc}>DNI: {row.documento}</Text>
              </View>
              {row.nota != null && (
                <View style={[styles.notaBadge, { backgroundColor: getNotaColor(row.nota) + '20' }]}>
                  <Text style={[styles.notaText, { color: getNotaColor(row.nota) }]}>{String(row.nota)}</Text>
                </View>
              )}
            </View>
            <View style={styles.cardBody}>
              <View style={styles.row}>
                <FileText size={16} color={Colors.textSecondary} />
                <Text style={styles.value}>{row.nombrecorto ?? '-'}</Text>
              </View>
              <View style={styles.row}>
                <Calendar size={16} color={Colors.textSecondary} />
                <Text style={styles.value}>{row.fecini ?? row.fecha ?? '-'}</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  title: {
    fontSize: 18,
    fontWeight: fontWeight600,
    color: Colors.text,
  },
  subtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  loading: {
    padding: 24,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 8,
    color: Colors.textSecondary,
  },
  errorBox: {
    margin: 16,
    padding: 12,
    borderRadius: 12,
    backgroundColor: Colors.error + '15',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  errorText: {
    color: Colors.error,
    flex: 1,
  },
  empty: {
    padding: 32,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: fontWeight600,
    color: Colors.text,
    marginTop: 12,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: fontWeight600,
    color: Colors.text,
  },
  doc: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  notaBadge: {
    minWidth: 40,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notaText: {
    fontSize: 14,
    fontWeight: fontWeight600,
  },
  cardBody: {
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  value: {
    fontSize: 14,
    color: Colors.text,
    flex: 1,
  },
});

import React, { useMemo, useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Platform, Linking } from 'react-native';
import Colors from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { BookOpenCheck, Users, ClipboardList, Check } from 'lucide-react-native';
import * as instructorService from '@/services/instructorService';
import type { InstructorReportItem } from '@/services/instructorService';
import * as WebBrowser from 'expo-web-browser';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const fontWeight700 = '700' as const;
const fontWeight600 = '600' as const;

export default function InstructorDashboard() {
  const { user } = useAuth();
  const token = user?.token ?? '';
  const insets = useSafeAreaInsets();

  const statsQuery = useQuery({
    queryKey: ['instructor','stats', user?.id, token],
    queryFn: () => instructorService.getStats(token),
    enabled: !!token,
  });

  const reportsQuery = useQuery({
    queryKey: ['instructor','reports','latest', user?.id, token],
    // Fetch up to 50 from backend, paginate locally by 5
    queryFn: () => instructorService.getRecentReports({ limit: 50 }, token),
    enabled: !!token,
  });

  const [visibleCount, setVisibleCount] = useState<number>(5);

  useEffect(() => {
    setVisibleCount(5);
  }, [user?.id]);

  const cards = useMemo(() => ([
    {
      key: 'capacitaciones',
      title: 'Capacitaciones',
      value: statsQuery.data?.capacitaciones ?? 0,
      icon: BookOpenCheck,
      color: Colors.primary,
    },
    {
      key: 'capacitados',
      title: 'Capacitados',
      value: statsQuery.data?.capacitados ?? 0,
      icon: Users,
      color: Colors.secondary,
    },
    {
      key: 'pendientes',
      title: 'Cursos pendientes',
      value: statsQuery.data?.pendientes ?? 0,
      icon: ClipboardList,
      color: Colors.warning,
    },
  ]), [statsQuery.data]);

  const handleDownload = async (documentoId?: string, anioId?: string) => {
    try {
      const url = instructorService.getReportDownloadUrlByIds(documentoId, anioId, token);
      if (Platform.OS === 'web') {
        window.open(url, '_blank');
        return;
      }
      const result = await WebBrowser.openBrowserAsync(url);
      if (result.type === 'cancel') {
        await Linking.openURL(url);
      }
    } catch (e) {
      console.log('Error al descargar reporte', e);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={[styles.content, { paddingBottom: insets.bottom }]} testID="instructor-dashboard">
      <Text style={styles.greeting} testID="greeting-text">Hola, {user?.nombre ?? 'Instructor'}</Text>

      <View style={styles.cardsRow}>
        {cards.map(({ key, title, value, icon: Icon, color }) => (
          <View key={key} style={[styles.card, { borderColor: color }]} testID={`card-${key}`}>
            <View style={[styles.iconWrap, { backgroundColor: color + '20' }]}>
              <Icon size={22} color={color} />
            </View>
            <Text style={styles.cardValue}>{value}</Text>
            <Text style={styles.cardTitle}>{title}</Text>
          </View>
        ))}
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Últimos informes</Text>
        {reportsQuery.isLoading && <ActivityIndicator color={Colors.primary} />}
      </View>

      <View style={styles.list}>
        {reportsQuery.data?.slice(0, visibleCount).map((r: InstructorReportItem) => (
          <View key={`${r.documentoId ?? r.titulo}-${r.anioId ?? r.anioNombre}`} style={styles.reportCard} testID={`report-${r.documentoId ?? r.titulo}`}>
            <View style={styles.reportHeader}>
              <Text style={styles.reportHeaderIcon}>▦</Text>
              <Text style={styles.reportHeaderTitle}>Listado de Informes</Text>
            </View>

            <View style={styles.reportBody}>
              <Text style={styles.reportSectionTitle}>DATOS DEL INFORME</Text>
              <Text style={styles.reportLine}><Text style={styles.reportLabel}>- ID: </Text>{r.titulo}{r.anioNombre ? ` - ${r.anioNombre}` : ''}</Text>
              {!!r.documentoTitulo && <Text style={styles.reportLine}><Text style={styles.reportLabel}>- Documento: </Text>{r.documentoTitulo}</Text>}
              {!!r.asunto && <Text style={styles.reportLine}><Text style={styles.reportLabel}>- Asunto: </Text>{r.asunto}</Text>}
              {!!r.remitente && <Text style={styles.reportLine}><Text style={styles.reportLabel}>- Remitente: </Text>{r.remitente}</Text>}
              {!!r.instructor && <Text style={styles.reportLine}><Text style={styles.reportLabel}>- Instructor: </Text>{r.instructor}</Text>}
              {!!r.fecha && <Text style={styles.reportLine}><Text style={styles.reportLabel}>- Fecha: </Text>{r.fecha}</Text>}
              {!!r.correoSolicitud && <Text style={styles.reportLine}><Text style={styles.reportLabel}>- Correo Solicitud: </Text>{r.correoSolicitud}</Text>}
              {!!r.empresa && <Text style={styles.reportLine}><Text style={styles.reportLabel}>- Empresa: </Text>{r.empresa}</Text>}

              <TouchableOpacity style={styles.generateBtn} onPress={() => handleDownload(r.documentoId, r.anioId)} testID={`generar-${r.documentoId ?? 'sin-id'}`}>
                <Check size={18} color="#fff" />
                <Text style={styles.generateText}>Generar Informe</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {(!reportsQuery.isLoading && (reportsQuery.data?.length ?? 0) === 0) && (
          <Text style={styles.emptyText}>No hay informes recientes</Text>
        )}

        {reportsQuery.data && reportsQuery.data.length > 0 && (
          <View style={styles.pagination} testID="reports-pagination">
            <Text style={styles.paginationText}>
              Mostrando {Math.min(visibleCount, reportsQuery.data.length)} de {reportsQuery.data.length}
            </Text>
            <View style={styles.paginationButtons}>
              <TouchableOpacity
                onPress={() => setVisibleCount((c) => Math.max(5, c - 5))}
                disabled={visibleCount <= 5}
                style={[styles.pageBtn, visibleCount <= 5 ? styles.pageBtnDisabled : undefined]}
                testID="reports-prev"
              >
                <Text style={styles.pageBtnText}>Ver menos</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setVisibleCount((c) => Math.min((reportsQuery.data?.length ?? 0), c + 5))}
                disabled={visibleCount >= (reportsQuery.data?.length ?? 0)}
                style={[styles.pageBtn, visibleCount >= (reportsQuery.data?.length ?? 0) ? styles.pageBtnDisabled : undefined]}
                testID="reports-next"
              >
                <Text style={styles.pageBtnText}>Ver más</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 16, gap: 16 },
  greeting: { fontSize: 22, fontWeight: fontWeight700, color: Colors.text },
  cardsRow: { flexDirection: 'row', gap: 12 },
  card: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  cardValue: { fontSize: 24, fontWeight: fontWeight700, color: Colors.text },
  cardTitle: { fontSize: 13, color: Colors.textSecondary },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 },
  sectionTitle: { fontSize: 18, fontWeight: fontWeight600, color: Colors.text },
  list: { gap: 12 },
  reportCard: { backgroundColor: Colors.surface, borderRadius: 12, borderWidth: 1, borderColor: Colors.border, overflow: 'hidden' },
  reportHeader: { backgroundColor: Colors.primaryDark, paddingVertical: 10, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', gap: 8 },
  reportHeaderIcon: { color: '#fff', fontSize: 14 },
  reportHeaderTitle: { color: '#fff', fontSize: 14, fontWeight: fontWeight600 },
  reportBody: { padding: 12, borderTopWidth: 1, borderTopColor: Colors.borderLight },
  reportSectionTitle: { fontSize: 13, fontWeight: fontWeight700, color: Colors.text, marginBottom: 8 },
  reportLine: { fontSize: 13, color: Colors.text, lineHeight: 20 },
  reportLabel: { fontWeight: fontWeight700 },
  generateBtn: { marginTop: 12, alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: Colors.primaryDark, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 8 },
  generateText: { color: '#fff', fontSize: 13, fontWeight: fontWeight600 },
  emptyText: { padding: 16, textAlign: 'center', color: Colors.textSecondary },
  pagination: { marginTop: 8, paddingVertical: 8, alignItems: 'center', gap: 8 },
  paginationText: { fontSize: 12, color: Colors.textSecondary },
  paginationButtons: { flexDirection: 'row', gap: 10 },
  pageBtn: { backgroundColor: Colors.primaryDark, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  pageBtnDisabled: { backgroundColor: Colors.border },
  pageBtnText: { color: '#fff', fontSize: 13, fontWeight: fontWeight600 },
});

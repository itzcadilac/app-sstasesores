import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Platform, Linking } from 'react-native';
import Colors from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { BookOpenCheck, Users, ClipboardList, Download } from 'lucide-react-native';
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
    queryFn: () => instructorService.getRecentReports({ limit: 5 }, token),
    enabled: !!token,
  });

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

  const handleDownload = async (reportId: string) => {
    try {
      const url = instructorService.getReportDownloadUrl(reportId, token);
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
        {reportsQuery.data?.map((r: InstructorReportItem) => (
          <View key={r.id} style={styles.listItem} testID={`report-${r.id}`}>
            <View style={styles.listTextWrap}>
              <Text style={styles.listTitle} numberOfLines={1}>{r.titulo}</Text>
              <Text style={styles.listMeta} numberOfLines={1}>{r.curso} • {r.fecha}</Text>
            </View>
            <TouchableOpacity style={styles.downloadBtn} onPress={() => handleDownload(r.id)} testID={`download-${r.id}`}>
              <Download size={18} color="#fff" />
              <Text style={styles.downloadText}>Descargar</Text>
            </TouchableOpacity>
          </View>
        ))}

        {(!reportsQuery.isLoading && (reportsQuery.data?.length ?? 0) === 0) && (
          <Text style={styles.emptyText}>No hay informes recientes</Text>
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
  list: { backgroundColor: Colors.surface, borderRadius: 12, borderWidth: 1, borderColor: Colors.border },
  listItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 12, borderBottomWidth: 1, borderBottomColor: Colors.borderLight, gap: 12 },
  listTextWrap: { flex: 1 },
  listTitle: { fontSize: 15, fontWeight: fontWeight600, color: Colors.text },
  listMeta: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  downloadBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: Colors.primary, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  downloadText: { color: '#fff', fontSize: 12, fontWeight: fontWeight600 },
  emptyText: { padding: 16, textAlign: 'center', color: Colors.textSecondary },
});

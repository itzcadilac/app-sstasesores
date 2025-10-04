import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { Building2, User, FileText, TrendingUp, Clock, CheckCircle } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import Colors from '@/constants/Colors';
import { obtenerEstadisticasEmpresa } from '@/services/capacitacionService';

const fontWeight700 = '700' as const;
const fontWeight600 = '600' as const;

interface EstadisticasEmpresa {
  cantidadSolicitudes: number;
  capacitados: number;
}

export default function HomeScreen() {
  const { user, isEmpresa } = useAuth();
  const router = useRouter();
  const [estadisticas, setEstadisticas] = useState<EstadisticasEmpresa>({ cantidadSolicitudes: 0, capacitados: 0 });
  const [isLoadingStats, setIsLoadingStats] = useState(false);

  useEffect(() => {
    if (isEmpresa && user?.ruc) {
      loadEstadisticas();
    }
  }, [isEmpresa, user?.ruc]);

  const loadEstadisticas = async () => {
    if (!user?.ruc) return;
    
    try {
      setIsLoadingStats(true);
      const stats = await obtenerEstadisticasEmpresa(user.ruc);
      setEstadisticas(stats);
    } catch (error) {
      console.error('Error loading estadisticas:', error);
    } finally {
      setIsLoadingStats(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <LinearGradient
        colors={[Colors.primary, Colors.primaryDark]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          {isEmpresa ? (
            <Building2 size={40} color="#FFFFFF" />
          ) : (
            <User size={40} color="#FFFFFF" />
          )}
          <Text style={styles.welcomeText}>Bienvenido</Text>
          <Text style={styles.userName}>{user?.nombre}</Text>
          {isEmpresa && user?.ruc && (
            <Text style={styles.rucText}>RUC: {user.ruc}</Text>
          )}
        </View>
      </LinearGradient>

      <View style={styles.statsContainer}>
        {isEmpresa ? (
          <>
            <View style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: Colors.primary + '20' }]}>
                <FileText size={24} color={Colors.primary} />
              </View>
              {isLoadingStats ? (
                <ActivityIndicator size="small" color={Colors.primary} />
              ) : (
                <Text style={styles.statValue}>{estadisticas.cantidadSolicitudes}</Text>
              )}
              <Text style={styles.statLabel}>Cantidad de Solicitudes</Text>
            </View>

            <View style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: Colors.secondary + '20' }]}>
                <TrendingUp size={24} color={Colors.secondary} />
              </View>
              {isLoadingStats ? (
                <ActivityIndicator size="small" color={Colors.secondary} />
              ) : (
                <Text style={styles.statValue}>{estadisticas.capacitados}</Text>
              )}
              <Text style={styles.statLabel}>Capacitados</Text>
            </View>
          </>
        ) : (
          <>
            <View style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: Colors.primary + '20' }]}>
                <FileText size={24} color={Colors.primary} />
              </View>
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>Capacitaciones</Text>
            </View>

            <View style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: Colors.success + '20' }]}>
                <CheckCircle size={24} color={Colors.success} />
              </View>
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>Completadas</Text>
            </View>

            <View style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: Colors.warning + '20' }]}>
                <Clock size={24} color={Colors.warning} />
              </View>
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>En Proceso</Text>
            </View>
          </>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Accesos Rápidos</Text>
        
        {isEmpresa ? (
          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/(tabs)/solicitud')}>
              <LinearGradient
                colors={[Colors.primary, Colors.primaryDark]}
                style={styles.actionGradient}
              >
                <FileText size={32} color="#FFFFFF" />
                <Text style={styles.actionText}>Nueva Solicitud</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/(tabs)/buscar')}>
              <LinearGradient
                colors={[Colors.secondary, Colors.secondaryDark]}
                style={styles.actionGradient}
              >
                <TrendingUp size={32} color="#FFFFFF" />
                <Text style={styles.actionText}>Ver Capacitados</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.infoCard}>
            <FileText size={48} color={Colors.primary} />
            <Text style={styles.infoTitle}>Consulta tus Capacitaciones</Text>
            <Text style={styles.infoText}>
              Accede a tu historial de capacitaciones, certificados y más información desde tu perfil.
            </Text>
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Información</Text>
        <View style={styles.infoBox}>
          <Text style={styles.infoBoxTitle}>SST Asesores</Text>
          <Text style={styles.infoBoxText}>
            Sistema de gestión de capacitaciones en Seguridad y Salud en el Trabajo.
          </Text>
          <Text style={styles.infoBoxText}>
            Para soporte técnico, contacte con su administrador.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingBottom: 24,
  },
  header: {
    padding: 32,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginTop: 16,
    opacity: 0.9,
  },
  userName: {
    fontSize: 24,
    fontWeight: fontWeight700,
    color: '#FFFFFF',
    marginTop: 4,
  },
  rucText: {
    fontSize: 14,
    color: '#FFFFFF',
    marginTop: 4,
    opacity: 0.85,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: -40,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: fontWeight700,
    color: Colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: fontWeight600,
    color: Colors.text,
    marginBottom: 16,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  actionGradient: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 140,
  },
  actionText: {
    fontSize: 16,
    fontWeight: fontWeight600,
    color: '#FFFFFF',
    marginTop: 12,
    textAlign: 'center',
  },
  infoCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: fontWeight600,
    color: Colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  infoBox: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoBoxTitle: {
    fontSize: 16,
    fontWeight: fontWeight600,
    color: Colors.text,
    marginBottom: 8,
  },
  infoBoxText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 4,
  },
});

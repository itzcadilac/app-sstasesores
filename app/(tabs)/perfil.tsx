import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { User, Building2, Mail, FileText, Phone } from 'lucide-react-native';
import Colors from '@/constants/Colors';

const fontWeight700 = '700' as const;
const fontWeight600 = '600' as const;

export default function PerfilScreen() {
  const { user, isEmpresa } = useAuth();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          {isEmpresa ? (
            <Building2 size={48} color={Colors.primary} />
          ) : (
            <User size={48} color={Colors.primary} />
          )}
        </View>
        <Text style={styles.name}>{user?.nombre}</Text>
        <Text style={styles.type}>
          {isEmpresa ? 'Cuenta Empresarial' : 'Cuenta Personal'}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Información</Text>
        
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Mail size={20} color={Colors.primary} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Correo Electrónico</Text>
              <Text style={styles.infoValue}>{user?.email || 'No disponible'}</Text>
            </View>
          </View>

          {isEmpresa ? (
            <>
              <View style={styles.infoRow}>
                <View style={styles.infoIcon}>
                  <Building2 size={20} color={Colors.primary} />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Empresa</Text>
                  <Text style={styles.infoValue}>{user?.empresa || 'No disponible'}</Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <View style={styles.infoIcon}>
                  <FileText size={20} color={Colors.primary} />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>RUC</Text>
                  <Text style={styles.infoValue}>{user?.ruc || 'No disponible'}</Text>
                </View>
              </View>
            </>
          ) : (
            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <FileText size={20} color={Colors.primary} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Documento</Text>
                <Text style={styles.infoValue}>{user?.documento || 'No disponible'}</Text>
              </View>
            </View>
          )}
        </View>
      </View>

      {!isEmpresa && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mis Capacitaciones</Text>
          <View style={styles.emptyState}>
            <FileText size={48} color={Colors.textLight} />
            <Text style={styles.emptyText}>No hay capacitaciones registradas</Text>
            <Text style={styles.emptySubtext}>
              Tus capacitaciones aparecerán aquí una vez que sean registradas
            </Text>
          </View>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Soporte</Text>
        <View style={styles.supportCard}>
          <Phone size={24} color={Colors.primary} />
          <Text style={styles.supportTitle}>¿Necesitas ayuda?</Text>
          <Text style={styles.supportText}>
            Contacta con nuestro equipo de soporte para cualquier consulta
          </Text>
          <TouchableOpacity style={styles.supportButton}>
            <Text style={styles.supportButtonText}>Contactar Soporte</Text>
          </TouchableOpacity>
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
  profileHeader: {
    backgroundColor: Colors.surface,
    padding: 32,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  avatarContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: fontWeight700,
    color: Colors.text,
    marginBottom: 4,
  },
  type: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: fontWeight600,
    color: Colors.text,
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: fontWeight600,
  },
  emptyState: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: fontWeight600,
    color: Colors.textSecondary,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.textLight,
    textAlign: 'center',
    marginTop: 8,
  },
  supportCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  supportTitle: {
    fontSize: 18,
    fontWeight: fontWeight600,
    color: Colors.text,
    marginTop: 12,
  },
  supportText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  supportButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  supportButtonText: {
    fontSize: 14,
    fontWeight: fontWeight600,
    color: '#FFFFFF',
  },
});

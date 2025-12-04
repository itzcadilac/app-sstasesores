import React, { useMemo, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, ActivityIndicator } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { User, Building2, Mail, FileText, Phone, Lock } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { changeEmpresaPassword, ChangePasswordInput } from '@/services/authService';

const fontWeight700 = '700' as const;
const fontWeight600 = '600' as const;

export default function PerfilScreen() {
  const { user, isEmpresa, isInstructor } = useAuth();
  const [showPwdModal, setShowPwdModal] = useState<boolean>(false);
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [changing, setChanging] = useState<boolean>(false);
  const [bannerMessage, setBannerMessage] = useState<string>('');
  const [bannerType, setBannerType] = useState<'success' | 'error' | 'info'>('info');

  const canSubmit = useMemo(() => {
    return !!currentPassword && !!newPassword && newPassword === confirmPassword;
  }, [currentPassword, newPassword, confirmPassword]);

  const onSubmitChange = useCallback(async () => {
    if (!user?.token) return;
    if (!canSubmit) {
      setBannerType('error');
      setBannerMessage('Verifique que las contraseñas coincidan.');
      return;
    }
    try {
      setChanging(true);
      const payload: ChangePasswordInput = { currentPassword, newPassword, idemp: user?.id ?? '', ruc: user?.ruc ?? '' };
      const res = await changeEmpresaPassword(payload, user.token);
      setBannerType(res.ok ? 'success' : 'info');
      setBannerMessage(res.message);
      if (res.ok) {
        setShowPwdModal(false);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'No se pudo cambiar la contraseña';
      setBannerType('error');
      setBannerMessage(msg);
    } finally {
      setChanging(false);
    }
  }, [user?.token, canSubmit, currentPassword, newPassword, user?.id, user?.ruc]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {bannerMessage ? (
        <View
          testID="banner-message"
          style={[
            styles.banner,
            bannerType === 'success' ? styles.bannerSuccess : bannerType === 'error' ? styles.bannerError : styles.bannerInfo,
          ]}
        >
          <Text style={styles.bannerText}>{bannerMessage}</Text>
        </View>
      ) : null}
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
          {isEmpresa ? 'Cuenta Empresarial' : isInstructor ? 'Cuenta Instructor' : 'Cuenta Capacitados'}
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

              <TouchableOpacity
                testID="btn-open-change-password"
                style={styles.actionButton}
                onPress={() => setShowPwdModal(true)}
              >
                <Lock size={18} color={Colors.surface} />
                <Text style={styles.actionButtonText}>Cambiar contraseña</Text>
              </TouchableOpacity>
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

      <Modal
        visible={showPwdModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPwdModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Cambiar contraseña</Text>
            <TextInput
              testID="input-current-password"
              style={styles.input}
              placeholder="Contraseña actual"
              secureTextEntry
              value={currentPassword}
              onChangeText={setCurrentPassword}
            />
            <TextInput
              testID="input-new-password"
              style={styles.input}
              placeholder="Nueva contraseña"
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <TextInput
              testID="input-confirm-password"
              style={styles.input}
              placeholder="Confirmar nueva contraseña"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                testID="btn-cancel-change-password"
                style={[styles.modalButton, styles.modalButtonGhost]}
                onPress={() => setShowPwdModal(false)}
                disabled={changing}
              >
                <Text style={styles.modalButtonGhostText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                testID="btn-submit-change-password"
                style={[styles.modalButton, !canSubmit || changing ? styles.modalButtonDisabled : null]}
                onPress={onSubmitChange}
                disabled={!canSubmit || changing}
              >
                {changing ? (
                  <ActivityIndicator color={Colors.surface} />
                ) : (
                  <Text style={styles.modalButtonText}>Guardar</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  actionButton: {
    marginTop: 12,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-start',
  },
  actionButtonText: {
    color: '#FFFFFF',
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
  modalBackdrop: {
    flex: 1,
    backgroundColor: Colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  modalCard: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: fontWeight600,
    color: Colors.text,
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 8,
    color: Colors.text,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
    gap: 12,
  },
  modalButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  modalButtonDisabled: {
    opacity: 0.6,
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontWeight: fontWeight600,
  },
  modalButtonGhost: {
    backgroundColor: Colors.borderLight,
  },
  modalButtonGhostText: {
    color: Colors.text,
    fontWeight: fontWeight600,
  },
  banner: {
    margin: 16,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  bannerText: {
    color: '#FFFFFF',
    fontWeight: fontWeight600,
  },
  bannerSuccess: {
    backgroundColor: '#16a34a',
  },
  bannerError: {
    backgroundColor: '#dc2626',
  },
  bannerInfo: {
    backgroundColor: '#2563eb',
  },
});

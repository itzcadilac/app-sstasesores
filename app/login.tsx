import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useRouter } from 'expo-router';
import { Building2, User, FileText, Lock, AlertCircle } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import Colors from '@/constants/Colors';

type LoginType = 'empresa' | 'personal';

const fontWeight = '700' as const;
const fontWeight600 = '600' as const;

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { login, loginPersonal, error, clearError } = useAuth();
  
  const [loginType, setLoginType] = useState<LoginType>('empresa');
  const [ruc, setRuc] = useState('');
  const [password, setPassword] = useState('');
  const [documento, setDocumento] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleEmpresaLogin = async () => {
    if (!ruc || !password) {
      return;
    }

    setIsLoading(true);
    const success = await login({ ruc, password, tipo: 'empresa' });
    setIsLoading(false);

    if (success) {
      router.replace('/(tabs)');
    }
  };

  const handlePersonalLogin = async () => {
    if (!documento) {
      return;
    }

    setIsLoading(true);
    const success = await loginPersonal({ documento });
    setIsLoading(false);

    if (success) {
      router.replace('/(tabs)');
    }
  };

  const handleSubmit = () => {
    clearError();
    if (loginType === 'empresa') {
      handleEmpresaLogin();
    } else {
      handlePersonalLogin();
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom }]}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Image
              source={{ uri: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/8gtp3xurxdqt9exz7kjwe' }}
              style={styles.logoImage}
              resizeMode="contain"
              accessibilityLabel="Logo SST Asesores"
              testID="company-logo"
            />
            <Text style={styles.title}>SST Asesores</Text>
            <Text style={styles.subtitle}>Sistema de Capacitaciones</Text>
          </View>

          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, loginType === 'empresa' && styles.tabActive]}
              onPress={() => {
                setLoginType('empresa');
                clearError();
              }}
            >
              <Building2
                size={20}
                color={loginType === 'empresa' ? Colors.primary : Colors.textSecondary}
              />
              <Text
                style={[
                  styles.tabText,
                  loginType === 'empresa' && styles.tabTextActive,
                ]}
              >
                Empresa
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tab, loginType === 'personal' && styles.tabActive]}
              onPress={() => {
                setLoginType('personal');
                clearError();
              }}
            >
              <User
                size={20}
                color={loginType === 'personal' ? Colors.primary : Colors.textSecondary}
              />
              <Text
                style={[
                  styles.tabText,
                  loginType === 'personal' && styles.tabTextActive,
                ]}
              >
                Personal
              </Text>
            </TouchableOpacity>
          </View>

          {error && (
            <View style={styles.errorContainer}>
              <AlertCircle size={20} color={Colors.error} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <View style={styles.formContainer}>
            {loginType === 'empresa' ? (
              <>
                <View style={styles.inputContainer}>
                  <FileText size={20} color={Colors.textSecondary} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="RUC (11 dígitos)"
                    placeholderTextColor={Colors.textLight}
                    value={ruc}
                    onChangeText={setRuc}
                    keyboardType="numeric"
                    maxLength={11}
                    autoCapitalize="none"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Lock size={20} color={Colors.textSecondary} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Contraseña"
                    placeholderTextColor={Colors.textLight}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    autoCapitalize="none"
                  />
                </View>
              </>
            ) : (
              <View style={styles.inputContainer}>
                <User size={20} color={Colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Número de documento (DNI/CE)"
                  placeholderTextColor={Colors.textLight}
                  value={documento}
                  onChangeText={setDocumento}
                  keyboardType="numeric"
                  maxLength={12}
                />
              </View>
            )}

            <TouchableOpacity
              style={[styles.button, isLoading && styles.buttonDisabled]}
              onPress={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.buttonText}>Iniciar Sesión</Text>
              )}
            </TouchableOpacity>

            {loginType === 'personal' && (
              <Text style={styles.helpText}>
                Ingrese su documento para consultar sus capacitaciones
              </Text>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  logoContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logoImage: {
    width: 180,
    height: 120,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: fontWeight,
    color: Colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  tabActive: {
    backgroundColor: Colors.primaryLight + '20',
  },
  tabText: {
    fontSize: 16,
    fontWeight: fontWeight600,
    color: Colors.textSecondary,
  },
  tabTextActive: {
    color: Colors.primary,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.error + '15',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    gap: 8,
  },
  errorText: {
    flex: 1,
    fontSize: 14,
    color: Colors.error,
  },
  formContainer: {
    gap: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: Colors.text,
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: fontWeight600,
    color: '#FFFFFF',
  },
  helpText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
  },
});

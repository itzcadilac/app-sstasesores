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

import { Link, useRouter } from 'expo-router';
import { Building2, User, FileText, Lock, AlertCircle, GraduationCap, Shield } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import Colors from '@/constants/Colors';

type LoginType = 'empresa' | 'personal' | 'instructor';

const fontWeight = '700' as const;
const fontWeight600 = '600' as const;

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { login, loginPersonal, loginInstructor, error, clearError } = useAuth();
  
  const [loginType, setLoginType] = useState<LoginType>('empresa');
  const [ruc, setRuc] = useState('');
  const [password, setPassword] = useState('');
  const [documento, setDocumento] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [instrPassword, setInstrPassword] = useState('');

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

  const handleInstructorLogin = async () => {
    if (!username || !instrPassword) return;
    setIsLoading(true);
    const success = await loginInstructor({ username, password: instrPassword });
    setIsLoading(false);
    if (success) {
      router.replace('/instructor');
    }
  };

  const handleSubmit = () => {
    clearError();
    if (loginType === 'empresa') {
      handleEmpresaLogin();
    } else if (loginType === 'personal') {
      handlePersonalLogin();
    } else {
      handleInstructorLogin();
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
            <View style={styles.logoContainer}>
              <Image
                source={{ uri: 'https://sstasesores.pe/wp-content/uploads/2024/06/logo_sst.webp' }}
                style={styles.logoImage}
                resizeMode="contain"
                accessibilityLabel="Logo TrainingSoft"
                testID="company-logo"
              />
            </View>
            <Text style={styles.title}>TrainingSoft</Text>
            <Text style={styles.subtitle}>Sistema de Gestión de Capacitaciones</Text>
          </View>

          <View
            style={styles.optionGroup}
            accessibilityRole="radiogroup"
            accessibilityLabel="Tipo de usuario"
            testID="login-type-group"
          >
            <TouchableOpacity
              style={[styles.optionCard, loginType === 'empresa' && styles.optionSelected]}
              onPress={() => {
                setLoginType('empresa');
                clearError();
              }}
              accessibilityRole="radio"
              accessibilityState={{ selected: loginType === 'empresa' }}
              accessibilityLabel="Empresa"
              testID="opt-empresa"
            >
              <View style={styles.optionLeft}>
                <View style={[styles.radioOuter, loginType === 'empresa' && styles.radioOuterActive]}
                  testID="opt-empresa-radio"
                >
                  {loginType === 'empresa' ? <View style={styles.radioInner} /> : null}
                </View>
                <Building2 size={22} color={loginType === 'empresa' ? Colors.primary : Colors.textSecondary} />
              </View>
              <View style={styles.optionContent}>
                <Text style={[styles.optionTitle, loginType === 'empresa' && styles.optionTitleActive]}
                  numberOfLines={1}
                >Empresa</Text>
                <Text style={styles.optionDesc} numberOfLines={2}>Acceso para empresas</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.optionCard, loginType === 'personal' && styles.optionSelected]}
              onPress={() => {
                setLoginType('personal');
                clearError();
              }}
              accessibilityRole="radio"
              accessibilityState={{ selected: loginType === 'personal' }}
              accessibilityLabel="Capacitados"
              testID="opt-personal"
            >
              <View style={styles.optionLeft}>
                <View style={[styles.radioOuter, loginType === 'personal' && styles.radioOuterActive]}
                  testID="opt-personal-radio"
                >
                  {loginType === 'personal' ? <View style={styles.radioInner} /> : null}
                </View>
                <User size={22} color={loginType === 'personal' ? Colors.primary : Colors.textSecondary} />
              </View>
              <View style={styles.optionContent}>
                <Text style={[styles.optionTitle, loginType === 'personal' && styles.optionTitleActive]}
                  numberOfLines={1}
                >Capacitados</Text>
                <Text style={styles.optionDesc} numberOfLines={2}>Consulta tus capacitaciones</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.optionCard, loginType === 'instructor' && styles.optionSelected]}
              onPress={() => {
                setLoginType('instructor');
                clearError();
              }}
              accessibilityRole="radio"
              accessibilityState={{ selected: loginType === 'instructor' }}
              accessibilityLabel="Instructores"
              testID="opt-instructor"
            >
              <View style={styles.optionLeft}>
                <View style={[styles.radioOuter, loginType === 'instructor' && styles.radioOuterActive]}
                  testID="opt-instructor-radio"
                >
                  {loginType === 'instructor' ? <View style={styles.radioInner} /> : null}
                </View>
                <GraduationCap size={22} color={loginType === 'instructor' ? Colors.primary : Colors.textSecondary} />
              </View>
              <View style={styles.optionContent}>
                <Text style={[styles.optionTitle, loginType === 'instructor' && styles.optionTitleActive]}
                  numberOfLines={1}
                >Instructores</Text>
                <Text style={styles.optionDesc} numberOfLines={2}>Gestión de cursos</Text>
              </View>
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
            ) : loginType === 'personal' ? (
              <View style={styles.inputContainer}>
                <User size={20} color={Colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Número de documento (DNI/CE)"
                  placeholderTextColor={Colors.textLight}
                  value={documento}
                  onChangeText={setDocumento}
                  autoCapitalize="characters"
                  inputMode="text"
                />
              </View>
            ) : (
              <>
                <View style={styles.inputContainer}>
                  <User size={20} color={Colors.textSecondary} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Usuario"
                    placeholderTextColor={Colors.textLight}
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
                <View style={styles.inputContainer}>
                  <Lock size={20} color={Colors.textSecondary} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Contraseña"
                    placeholderTextColor={Colors.textLight}
                    value={instrPassword}
                    onChangeText={setInstrPassword}
                    secureTextEntry
                    autoCapitalize="none"
                  />
                </View>
              </>
            )}

            <View style={styles.legalContainer} accessibilityLabel="Términos y privacidad" testID="legal-links">
              <Shield size={16} color={Colors.textSecondary} />
              <Text style={styles.legalText}>Al continuar aceptas nuestros </Text>
              <Link href="/terminos" testID="link-terminos" accessibilityRole="link">
                <Text style={styles.legalLink}>Términos</Text>
              </Link>
              <Text style={styles.legalText}> y </Text>
              <Link href="/privacidad" testID="link-privacidad" accessibilityRole="link">
                <Text style={styles.legalLink}>Privacidad</Text>
              </Link>
            </View>

            <TouchableOpacity
              style={[styles.button, isLoading && styles.buttonDisabled]}
              onPress={handleSubmit}
              disabled={isLoading}
              testID="login-button"
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
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 36,
  },
  logoContainer: {
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  logoImage: {
    width: 70,
    height: 70,
  },
  title: {
    fontSize: 32,
    fontWeight: fontWeight,
    color: Colors.text,
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  optionGroup: {
    gap: 10,
    marginBottom: 24,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: Colors.border,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  optionSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight + '20',
    shadowColor: Colors.primary,
    shadowOpacity: 0.15,
    elevation: 4,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginRight: 12,
  },
  optionContent: {
    flex: 1,
    gap: 2,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: fontWeight600,
    color: Colors.text,
  },
  optionTitleActive: {
    color: Colors.primary,
  },
  optionDesc: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  radioOuter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterActive: {
    borderColor: Colors.primary,
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
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
    borderRadius: 14,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: Colors.border,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
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
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
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
  legalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    justifyContent: 'center',
    marginTop: 4,
  },
  legalText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  legalLink: {
    fontSize: 12,
    color: Colors.primary,
    textDecorationLine: 'underline',
  },
});

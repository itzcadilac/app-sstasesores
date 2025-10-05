import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { FileText, Calendar, Users, Clock, MapPin, Phone, Mail, MessageSquare } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { SolicitudCapacitacion } from '@/types';

const fontWeight700 = '700' as const;
const fontWeight600 = '600' as const;

type ModalidadType = 'presencial' | 'virtual' | 'in-house';

export default function SolicitudScreen() {
  const { user } = useAuth();
  
  const [tipoCapacitacion, setTipoCapacitacion] = useState('');
  const [modalidad, setModalidad] = useState<ModalidadType>('presencial');
  const [numeroParticipantes, setNumeroParticipantes] = useState('');
  const [fechaSolicitada, setFechaSolicitada] = useState('');
  const [horarioPreferido, setHorarioPreferido] = useState('');
  const [area, setArea] = useState('');
  const [contactoNombre, setContactoNombre] = useState('');
  const [contactoTelefono, setContactoTelefono] = useState('');
  const [contactoEmail, setContactoEmail] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const tiposCapacitacion = [
    'Trabajo en Altura',
    'Espacios Confinados',
    'Primeros Auxilios',
    'Manejo de Extintores',
    'Seguridad Eléctrica',
    'Manejo Defensivo',
    'IPERC',
    'Comité de SST',
    'Otro',
  ];

  const handleSubmit = async () => {
    if (!tipoCapacitacion || !numeroParticipantes || !fechaSolicitada || !contactoNombre || !contactoTelefono) {
      Alert.alert('Error', 'Por favor complete todos los campos obligatorios');
      return;
    }

    const solicitud: SolicitudCapacitacion = {
      empresaId: user?.id || '',
      tipoCapacitacion,
      modalidad,
      numeroParticipantes: parseInt(numeroParticipantes),
      fechaSolicitada,
      horarioPreferido,
      area,
      contactoNombre,
      contactoTelefono,
      contactoEmail,
      observaciones,
    };

    setIsSubmitting(true);

    try {
      

      await new Promise(resolve => setTimeout(resolve, 1500));
      
      Alert.alert(
        'Éxito',
        'Solicitud enviada correctamente. Nos pondremos en contacto pronto.',
        [
          {
            text: 'OK',
            onPress: () => {
              setTipoCapacitacion('');
              setModalidad('presencial');
              setNumeroParticipantes('');
              setFechaSolicitada('');
              setHorarioPreferido('');
              setArea('');
              setContactoNombre('');
              setContactoTelefono('');
              setContactoEmail('');
              setObservaciones('');
            },
          },
        ]
      );
    } catch {
      Alert.alert('Error', 'No se pudo enviar la solicitud. Intente nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <FileText size={32} color={Colors.primary} />
        <Text style={styles.headerTitle}>Nueva Solicitud de Capacitación</Text>
        <Text style={styles.headerSubtitle}>Complete el formulario para solicitar una capacitación</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información de la Capacitación</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Tipo de Capacitación *</Text>
            <View style={styles.pickerContainer}>
              <TextInput
                style={styles.input}
                placeholder="Seleccione o escriba el tipo"
                value={tipoCapacitacion}
                onChangeText={setTipoCapacitacion}
              />
            </View>
            <View style={styles.chipContainer}>
              {tiposCapacitacion.map((tipo) => (
                <TouchableOpacity
                  key={tipo}
                  style={[
                    styles.chip,
                    tipoCapacitacion === tipo && styles.chipSelected,
                  ]}
                  onPress={() => setTipoCapacitacion(tipo)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      tipoCapacitacion === tipo && styles.chipTextSelected,
                    ]}
                  >
                    {tipo}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Modalidad *</Text>
            <View style={styles.modalidadContainer}>
              {(['presencial', 'virtual', 'in-house'] as ModalidadType[]).map((mod) => (
                <TouchableOpacity
                  key={mod}
                  style={[
                    styles.modalidadButton,
                    modalidad === mod && styles.modalidadButtonSelected,
                  ]}
                  onPress={() => setModalidad(mod)}
                >
                  <Text
                    style={[
                      styles.modalidadText,
                      modalidad === mod && styles.modalidadTextSelected,
                    ]}
                  >
                    {mod === 'in-house' ? 'In-House' : mod.charAt(0).toUpperCase() + mod.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Número de Participantes *</Text>
            <View style={styles.inputContainer}>
              <Users size={20} color={Colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Ej: 15"
                value={numeroParticipantes}
                onChangeText={setNumeroParticipantes}
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Fecha Solicitada *</Text>
            <View style={styles.inputContainer}>
              <Calendar size={20} color={Colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="DD/MM/YYYY"
                value={fechaSolicitada}
                onChangeText={setFechaSolicitada}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Horario Preferido</Text>
            <View style={styles.inputContainer}>
              <Clock size={20} color={Colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Ej: 9:00 AM - 1:00 PM"
                value={horarioPreferido}
                onChangeText={setHorarioPreferido}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Área/Departamento</Text>
            <View style={styles.inputContainer}>
              <MapPin size={20} color={Colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Ej: Operaciones"
                value={area}
                onChangeText={setArea}
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Datos de Contacto</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nombre del Contacto *</Text>
            <View style={styles.inputContainer}>
              <Users size={20} color={Colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Nombre completo"
                value={contactoNombre}
                onChangeText={setContactoNombre}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Teléfono *</Text>
            <View style={styles.inputContainer}>
              <Phone size={20} color={Colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="999 999 999"
                value={contactoTelefono}
                onChangeText={setContactoTelefono}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Correo Electrónico</Text>
            <View style={styles.inputContainer}>
              <Mail size={20} color={Colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="correo@empresa.com"
                value={contactoEmail}
                onChangeText={setContactoEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información Adicional</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Observaciones</Text>
            <View style={styles.textAreaContainer}>
              <MessageSquare size={20} color={Colors.textSecondary} style={styles.textAreaIcon} />
              <TextInput
                style={styles.textArea}
                placeholder="Detalles adicionales sobre la capacitación..."
                value={observaciones}
                onChangeText={setObservaciones}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.submitButtonText}>Enviar Solicitud</Text>
          )}
        </TouchableOpacity>
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
    backgroundColor: Colors.surface,
    padding: 24,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: fontWeight700,
    color: Colors.text,
    marginTop: 12,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
  form: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: fontWeight600,
    color: Colors.text,
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: fontWeight600,
    color: Colors.text,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: Colors.text,
  },
  pickerContainer: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 16,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  chipText: {
    fontSize: 14,
    color: Colors.text,
  },
  chipTextSelected: {
    color: '#FFFFFF',
    fontWeight: fontWeight600,
  },
  modalidadContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  modalidadButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  modalidadButtonSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  modalidadText: {
    fontSize: 14,
    color: Colors.text,
  },
  modalidadTextSelected: {
    color: '#FFFFFF',
    fontWeight: fontWeight600,
  },
  textAreaContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'flex-start',
  },
  textAreaIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  textArea: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
    minHeight: 100,
  },
  submitButton: {
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
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: fontWeight600,
    color: '#FFFFFF',
  },
});

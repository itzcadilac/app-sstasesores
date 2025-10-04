import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Search, User, FileText, Calendar } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { buscarCapacitadosPorDocumento } from '@/services/capacitacionService';
import Colors from '@/constants/Colors';

const fontWeight600 = '600' as const;

interface CapacitacionResult {
  documento: string;
  capacitado: string;
  capacitacion: string;
  fecha: string;
  nota: string;
}

export default function BuscarScreen() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<CapacitacionResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim() || !user?.ruc) {
      return;
    }

    setIsSearching(true);
    setHasSearched(true);

    try {
      console.log('Buscando por documento:', searchQuery);
      const data = await buscarCapacitadosPorDocumento(user.ruc, searchQuery);
      setResults(data);
    } catch (error) {
      console.error('Error en búsqueda:', error);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const getNotaColor = (nota: string) => {
    const notaNum = parseFloat(nota);
    if (notaNum >= 14) return Colors.success;
    if (notaNum >= 11) return Colors.warning;
    return Colors.error;
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Search size={20} color={Colors.textSecondary} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar por documento..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
              keyboardType="numeric"
              maxLength={8}
            />
          </View>
          <TouchableOpacity
            style={[styles.searchButton, isSearching && styles.searchButtonDisabled]}
            onPress={handleSearch}
            disabled={isSearching}
          >
            {isSearching ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Search size={20} color="#FFFFFF" />
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.resultsContainer} contentContainerStyle={styles.resultsContent}>
        {!hasSearched ? (
          <View style={styles.emptyState}>
            <Search size={64} color={Colors.textLight} />
            <Text style={styles.emptyTitle}>Buscar Capacitados</Text>
            <Text style={styles.emptyText}>
              Ingrese el número de documento para buscar capacitaciones registradas
            </Text>
          </View>
        ) : isSearching ? (
          <View style={styles.loadingState}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.loadingText}>Buscando...</Text>
          </View>
        ) : results.length === 0 ? (
          <View style={styles.emptyState}>
            <FileText size={64} color={Colors.textLight} />
            <Text style={styles.emptyTitle}>No se encontraron resultados</Text>
            <Text style={styles.emptyText}>
              No hay capacitaciones que coincidan con su búsqueda
            </Text>
          </View>
        ) : (
          <View style={styles.resultsList}>
            <Text style={styles.resultsCount}>
              {results.length} resultado{results.length !== 1 ? 's' : ''} encontrado{results.length !== 1 ? 's' : ''}
            </Text>
            {results.map((result, index) => (
              <View key={`${result.documento}-${index}`} style={styles.resultCard}>
                <View style={styles.resultHeader}>
                  <View style={styles.resultIcon}>
                    <User size={24} color={Colors.primary} />
                  </View>
                  <View style={styles.resultInfo}>
                    <Text style={styles.resultName}>{result.capacitado}</Text>
                    <Text style={styles.resultDocument}>DNI: {result.documento}</Text>
                  </View>
                  <View style={[
                    styles.notaBadge,
                    { backgroundColor: getNotaColor(result.nota) + '20' }
                  ]}>
                    <Text style={[
                      styles.notaText,
                      { color: getNotaColor(result.nota) }
                    ]}>
                      {result.nota}
                    </Text>
                  </View>
                </View>

                <View style={styles.resultDetails}>
                  <View style={styles.detailRow}>
                    <FileText size={16} color={Colors.textSecondary} />
                    <Text style={styles.detailText}>{result.capacitacion}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Calendar size={16} color={Colors.textSecondary} />
                    <Text style={styles.detailText}>{result.fecha}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  searchSection: {
    backgroundColor: Colors.surface,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  searchContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.text,
  },
  searchButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchButtonDisabled: {
    opacity: 0.6,
  },
  resultsContainer: {
    flex: 1,
  },
  resultsContent: {
    flexGrow: 1,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: fontWeight600,
    color: Colors.text,
    marginTop: 16,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  loadingState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  loadingText: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginTop: 16,
  },
  resultsList: {
    padding: 16,
  },
  resultsCount: {
    fontSize: 14,
    fontWeight: fontWeight600,
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  resultCard: {
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
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  resultIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  resultInfo: {
    flex: 1,
  },
  resultName: {
    fontSize: 16,
    fontWeight: fontWeight600,
    color: Colors.text,
    marginBottom: 2,
  },
  resultDocument: {
    fontSize: 14,
    color: Colors.textSecondary,
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
  resultDetails: {
    gap: 8,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: Colors.text,
    flex: 1,
  },

});

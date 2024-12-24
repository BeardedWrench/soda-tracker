import { useState, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Alert,
  TouchableOpacity,
  Modal,
  FlatList,
  Pressable,
} from 'react-native';
import { mockApi, SODA_BRANDS, COMMON_SIZES } from '../../services/mockApi';

interface SodaVariant {
  name: string;
  per12oz: {
    calories: number;
    sugar: number;
    carbs: number;
    caffeine: number;
  };
}

export default function LogScreen() {
  const [selectedSize, setSelectedSize] = useState(COMMON_SIZES[2]); // Default to 12 oz can
  const [selectedBrandIndex, setSelectedBrandIndex] = useState(0);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [showSizeModal, setShowSizeModal] = useState(false);
  const [showBrandModal, setShowBrandModal] = useState(false);
  const [showVariantModal, setShowVariantModal] = useState(false);

  const selectedBrand = SODA_BRANDS[selectedBrandIndex];
  const selectedVariant = selectedBrand.variants[selectedVariantIndex];
  
  const calculateNutrition = (flOz: number, variant: SodaVariant) => {
    const ratio = flOz / 12; // All our data is per 12 fl oz
    return {
      calories: Math.round(variant.per12oz.calories * ratio),
      sugar: Math.round(variant.per12oz.sugar * ratio),
      carbs: Math.round(variant.per12oz.carbs * ratio),
      caffeine: Math.round(variant.per12oz.caffeine * ratio),
    };
  };

  const handleSubmit = async () => {
    try {
      const nutrition = calculateNutrition(selectedSize.value, selectedVariant);
      await mockApi.logSodaConsumption({
        date: new Date().toISOString(),
        amount: selectedSize.value,
        brand: selectedVariant.name,
        ...nutrition
      });

      Alert.alert('Success', 'Soda consumption logged successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to log soda consumption');
      console.error(error);
    }
  };

  const nutrition = useMemo(
    () => calculateNutrition(selectedSize.value, selectedVariant),
    [selectedSize.value, selectedVariant]
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Log Drink</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.label}>Size</Text>
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => setShowSizeModal(true)}
          >
            <Text style={styles.dropdownText}>{selectedSize.label}</Text>
            <Text style={styles.dropdownIcon}>▼</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Brand</Text>
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => setShowBrandModal(true)}
          >
            <Text style={styles.dropdownText}>{selectedBrand.name}</Text>
            <Text style={styles.dropdownIcon}>▼</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Type</Text>
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => setShowVariantModal(true)}
          >
            <Text style={styles.dropdownText}>{selectedVariant.name}</Text>
            <Text style={styles.dropdownIcon}>▼</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.nutritionCard}>
          <Text style={styles.nutritionTitle}>Nutrition Facts</Text>
          <View style={styles.nutritionGrid}>
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionValue}>{nutrition.calories}</Text>
              <Text style={styles.nutritionLabel}>calories</Text>
            </View>
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionValue}>{nutrition.sugar}g</Text>
              <Text style={styles.nutritionLabel}>sugar</Text>
            </View>
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionValue}>{nutrition.carbs}g</Text>
              <Text style={styles.nutritionLabel}>carbs</Text>
            </View>
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionValue}>{nutrition.caffeine}mg</Text>
              <Text style={styles.nutritionLabel}>caffeine</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Log Consumption</Text>
        </TouchableOpacity>
      </View>

      {/* Size Selection Modal */}
      <Modal
        visible={showSizeModal}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Size</Text>
            <FlatList
              data={COMMON_SIZES}
              keyExtractor={(item) => item.label}
              renderItem={({ item }) => (
                <Pressable
                  style={[
                    styles.modalItem,
                    item.value === selectedSize.value && styles.modalItemSelected
                  ]}
                  onPress={() => {
                    setSelectedSize(item);
                    setShowSizeModal(false);
                  }}
                >
                  <Text style={[
                    styles.modalItemText,
                    item.value === selectedSize.value && styles.modalItemTextSelected
                  ]}>
                    {item.label}
                  </Text>
                </Pressable>
              )}
            />
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowSizeModal(false)}
            >
              <Text style={styles.modalCloseButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Brand Selection Modal */}
      <Modal
        visible={showBrandModal}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Brand</Text>
            <FlatList
              data={SODA_BRANDS}
              keyExtractor={(item) => item.name}
              renderItem={({ item, index }) => (
                <Pressable
                  style={[
                    styles.modalItem,
                    index === selectedBrandIndex && styles.modalItemSelected
                  ]}
                  onPress={() => {
                    setSelectedBrandIndex(index);
                    setSelectedVariantIndex(0); // Reset variant when brand changes
                    setShowBrandModal(false);
                  }}
                >
                  <Text style={[
                    styles.modalItemText,
                    index === selectedBrandIndex && styles.modalItemTextSelected
                  ]}>
                    {item.name}
                  </Text>
                </Pressable>
              )}
            />
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowBrandModal(false)}
            >
              <Text style={styles.modalCloseButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Variant Selection Modal */}
      <Modal
        visible={showVariantModal}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Type</Text>
            <FlatList
              data={selectedBrand.variants}
              keyExtractor={(item) => item.name}
              renderItem={({ item, index }) => (
                <Pressable
                  style={[
                    styles.modalItem,
                    index === selectedVariantIndex && styles.modalItemSelected
                  ]}
                  onPress={() => {
                    setSelectedVariantIndex(index);
                    setShowVariantModal(false);
                  }}
                >
                  <Text style={[
                    styles.modalItemText,
                    index === selectedVariantIndex && styles.modalItemTextSelected
                  ]}>
                    {item.name}
                  </Text>
                </Pressable>
              )}
            />
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowVariantModal(false)}
            >
              <Text style={styles.modalCloseButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 24,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  dropdownText: {
    fontSize: 16,
    color: '#1a1a1a',
  },
  dropdownIcon: {
    fontSize: 12,
    color: '#666',
  },
  nutritionCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  nutritionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  nutritionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    margin: -8,
  },
  nutritionItem: {
    width: '50%',
    padding: 8,
  },
  nutritionValue: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  nutritionLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  submitButton: {
    backgroundColor: '#339af0',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f5',
  },
  modalItemSelected: {
    backgroundColor: '#e7f5ff',
  },
  modalItemText: {
    fontSize: 16,
    color: '#1a1a1a',
  },
  modalItemTextSelected: {
    color: '#339af0',
    fontWeight: '500',
  },
  modalCloseButton: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#f1f3f5',
    borderRadius: 12,
    alignItems: 'center',
  },
  modalCloseButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
});
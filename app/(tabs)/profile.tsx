import { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { mockApi } from '../../services/mockApi';

export default function ProfileScreen() {
  const [dailyLimit, setDailyLimit] = useState('');
  const [weeklyLimit, setWeeklyLimit] = useState('');
  const [targetReduction, setTargetReduction] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadUserGoals();
  }, []);

  const loadUserGoals = async () => {
    try {
      const goals = await mockApi.getUserGoals();
      setDailyLimit(goals.dailyLimit.toString());
      setWeeklyLimit(goals.weeklyLimit.toString());
      setTargetReduction(goals.targetReduction.toString());
    } catch (error) {
      console.error('Error loading user goals:', error);
    }
  };

  const handleSave = async () => {
    if (!dailyLimit || !weeklyLimit || !targetReduction) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const daily = Number(dailyLimit);
    const weekly = Number(weeklyLimit);
    const reduction = Number(targetReduction);

    if (isNaN(daily) || isNaN(weekly) || isNaN(reduction)) {
      Alert.alert('Error', 'Please enter valid numbers');
      return;
    }

    try {
      await mockApi.updateUserGoals({
        dailyLimit: daily,
        weeklyLimit: weekly,
        targetReduction: reduction,
      });
      setIsEditing(false);
      Alert.alert('Success', 'Goals updated successfully');
    } catch (error) {
      console.error('Error updating goals:', error);
      Alert.alert('Error', 'Failed to update goals');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Daily Goals</Text>
          <View style={styles.card}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Daily Limit</Text>
              {isEditing ? (
                <TextInput
                  style={styles.input}
                  value={dailyLimit}
                  onChangeText={setDailyLimit}
                  keyboardType="numeric"
                  placeholder="Enter daily limit"
                />
              ) : (
                <Text style={styles.value}>{dailyLimit} fl oz</Text>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Weekly Limit</Text>
              {isEditing ? (
                <TextInput
                  style={styles.input}
                  value={weeklyLimit}
                  onChangeText={setWeeklyLimit}
                  keyboardType="numeric"
                  placeholder="Enter weekly limit"
                />
              ) : (
                <Text style={styles.value}>{weeklyLimit} fl oz</Text>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Target Reduction</Text>
              {isEditing ? (
                <TextInput
                  style={styles.input}
                  value={targetReduction}
                  onChangeText={setTargetReduction}
                  keyboardType="numeric"
                  placeholder="Enter target reduction %"
                />
              ) : (
                <Text style={styles.value}>{targetReduction}%</Text>
              )}
            </View>
          </View>

          {isEditing ? (
            <View style={styles.buttonGroup}>
              <TouchableOpacity 
                style={[styles.button, styles.cancelButton]}
                onPress={() => {
                  setIsEditing(false);
                  loadUserGoals();
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.button, styles.saveButton]}
                onPress={handleSave}
              >
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity 
              style={[styles.button, styles.editButton]}
              onPress={() => setIsEditing(true)}
            >
              <Text style={styles.editButtonText}>Edit Goals</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Tips for Success</Text>
          <Text style={styles.infoText}>
            • Start with achievable daily limits{'\n'}
            • Gradually reduce your weekly intake{'\n'}
            • Replace sodas with water or sugar-free alternatives{'\n'}
            • Track your progress regularly
          </Text>
        </View>
      </View>
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1a1a1a',
    backgroundColor: '#f8f9fa',
  },
  value: {
    fontSize: 16,
    color: '#1a1a1a',
    fontWeight: '500',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  button: {
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButton: {
    backgroundColor: '#339af0',
    marginTop: 16,
  },
  saveButton: {
    backgroundColor: '#339af0',
    flex: 1,
    marginLeft: 8,
  },
  cancelButton: {
    backgroundColor: '#f1f3f5',
    flex: 1,
    marginRight: 8,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButtonText: {
    color: '#1a1a1a',
    fontSize: 16,
    fontWeight: '600',
  },
  infoCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    padding: 16,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
  },
});
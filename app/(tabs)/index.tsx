import { useEffect, useState, useCallback } from 'react';
import { StyleSheet, View, Text, ScrollView, RefreshControl } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { mockApi } from '../../services/mockApi';

interface DailyStats {
  totalConsumption: number;
  remainingAllowance: number;
  totalCalories: number;
  totalSugar: number;
  totalCarbs: number;
  totalCaffeine: number;
}

export default function DashboardScreen() {
  const [stats, setStats] = useState<DailyStats | null>(null);
  const [goals, setGoals] = useState<{ dailyLimit: number } | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadDashboardData = async () => {
    try {
      const today = new Date();
      const dailyStats = await mockApi.getDailyStats(today);
      const userGoals = await mockApi.getUserGoals();
      setStats(dailyStats);
      setGoals(userGoals);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Refresh data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadDashboardData();
    }, [])
  );

  if (!stats || !goals) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  const progressPercentage = (stats.totalConsumption / goals.dailyLimit) * 100;

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.title}>Today's Overview</Text>
      </View>

      <View style={styles.mainCard}>
        <View style={styles.progressContainer}>
          <View style={styles.progressCircle}>
            <Text style={styles.progressAmount}>{stats.totalConsumption.toFixed(1)}</Text>
            <Text style={styles.progressUnit}>fl oz</Text>
          </View>
          <Text style={styles.progressLabel}>
            {stats.remainingAllowance > 0 
              ? `${stats.remainingAllowance.toFixed(1)} fl oz remaining`
              : 'Daily limit exceeded'}
          </Text>
        </View>
        
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${Math.min(progressPercentage, 100)}%` }
            ]} 
          />
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.totalCalories}</Text>
          <Text style={styles.statLabel}>calories</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.totalSugar}g</Text>
          <Text style={styles.statLabel}>sugar</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.totalCaffeine}mg</Text>
          <Text style={styles.statLabel}>caffeine</Text>
        </View>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Daily Goal</Text>
        <Text style={styles.infoText}>
          {goals.dailyLimit} fl oz
        </Text>
        <View style={styles.divider} />
        <Text style={styles.infoTitle}>Health Tip</Text>
        <Text style={styles.infoText}>
          Drinking water instead of soda can save you up to 150 calories per 12 oz serving.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
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
  mainCard: {
    margin: 16,
    padding: 24,
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  progressContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  progressCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  progressAmount: {
    fontSize: 32,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  progressUnit: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  progressLabel: {
    fontSize: 16,
    color: '#666',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#f1f3f5',
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#339af0',
    borderRadius: 2,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    marginHorizontal: 4,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    textTransform: 'uppercase',
  },
  infoCard: {
    margin: 16,
    padding: 24,
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  divider: {
    height: 1,
    backgroundColor: '#f1f3f5',
    marginVertical: 16,
  },
});

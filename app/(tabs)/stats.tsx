import { useEffect, useState, useCallback } from 'react';
import { StyleSheet, View, Text, ScrollView, Dimensions, RefreshControl } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useFocusEffect } from 'expo-router';
import { mockApi } from '../../services/mockApi';

interface WeeklyData {
  labels: string[];
  consumption: number[];
  calories: number[];
  sugar: number[];
  caffeine: number[];
}

export default function StatsScreen() {
  const [weeklyData, setWeeklyData] = useState<WeeklyData>({
    labels: [],
    consumption: [],
    calories: [],
    sugar: [],
    caffeine: [],
  });
  const [refreshing, setRefreshing] = useState(false);

  const loadWeeklyStats = async () => {
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - 7);

      const entries = await mockApi.getSodaEntries(startDate, endDate);
      
      const dailyData: { [key: string]: { 
        consumption: number;
        calories: number;
        sugar: number;
        caffeine: number;
      } } = {};
      
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dayKey = date.toISOString().split('T')[0];
        dailyData[dayKey] = { 
          consumption: 0,
          calories: 0,
          sugar: 0,
          caffeine: 0,
        };
      }

      entries.forEach(entry => {
        const dayKey = entry.date.split('T')[0];
        if (dailyData[dayKey]) {
          dailyData[dayKey].consumption += entry.amount;
          dailyData[dayKey].calories += entry.calories;
          dailyData[dayKey].sugar += entry.sugar;
          dailyData[dayKey].caffeine += entry.caffeine;
        }
      });

      const sortedData = Object.entries(dailyData)
        .sort(([a], [b]) => a.localeCompare(b));

      setWeeklyData({
        labels: sortedData.map(([date]) => days[new Date(date).getDay()]),
        consumption: sortedData.map(([_, data]) => Number(data.consumption.toFixed(1))),
        calories: sortedData.map(([_, data]) => data.calories),
        sugar: sortedData.map(([_, data]) => data.sugar),
        caffeine: sortedData.map(([_, data]) => data.caffeine),
      });

    } catch (error) {
      console.error('Error loading weekly stats:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadWeeklyStats();
    setRefreshing(false);
  };

  // Load stats when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadWeeklyStats();
    }, [])
  );

  // Initial load
  useEffect(() => {
    loadWeeklyStats();
  }, []);

  const screenWidth = Dimensions.get('window').width;

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(51, 154, 240, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(26, 26, 26, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: '#339af0',
    },
  };

  const getWeeklyTotal = (data: number[]) => data.reduce((a, b) => a + b, 0);

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.title}>Weekly Stats</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.chartTitle}>Daily Consumption</Text>
          {weeklyData.labels.length > 0 && (
            <LineChart
              data={{
                labels: weeklyData.labels,
                datasets: [{
                  data: weeklyData.consumption,
                }],
              }}
              width={screenWidth - 32}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
              yAxisLabel=""
              yAxisSuffix=" oz"
            />
          )}
        </View>

        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { backgroundColor: '#e7f5ff' }]}>
            <Text style={styles.statValue}>
              {getWeeklyTotal(weeklyData.consumption).toFixed(1)}
            </Text>
            <Text style={styles.statLabel}>fl oz total</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: '#fff4e6' }]}>
            <Text style={styles.statValue}>
              {getWeeklyTotal(weeklyData.sugar)}g
            </Text>
            <Text style={styles.statLabel}>sugar</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: '#f8f9fa' }]}>
            <Text style={styles.statValue}>
              {getWeeklyTotal(weeklyData.calories)}
            </Text>
            <Text style={styles.statLabel}>calories</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: '#f3f0ff' }]}>
            <Text style={styles.statValue}>
              {getWeeklyTotal(weeklyData.caffeine)}
            </Text>
            <Text style={styles.statLabel}>mg caffeine</Text>
          </View>
        </View>

        <View style={styles.insightCard}>
          <Text style={styles.insightTitle}>Weekly Impact</Text>
          <View style={styles.insightItem}>
            <Text style={styles.insightLabel}>Sugar Equivalent</Text>
            <Text style={[styles.insightValue, { color: '#f76707' }]}>
              {(getWeeklyTotal(weeklyData.sugar) / 4).toFixed(1)} tsp
            </Text>
          </View>
          <View style={styles.insightItem}>
            <Text style={styles.insightLabel}>Calorie Equivalent</Text>
            <Text style={[styles.insightValue, { color: '#339af0' }]}>
              {(getWeeklyTotal(weeklyData.calories) / 150).toFixed(1)} meals
            </Text>
          </View>
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
  card: {
    marginBottom: 24,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  chart: {
    marginRight: -16,
    borderRadius: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    margin: -8,
    marginBottom: 16,
  },
  statCard: {
    width: '48%',
    margin: 4,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
    textTransform: 'uppercase',
  },
  insightCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  insightItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  insightLabel: {
    fontSize: 14,
    color: '#666',
  },
  insightValue: {
    fontSize: 16,
    fontWeight: '600',
  },
});
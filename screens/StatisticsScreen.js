import React, { useContext, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PieChart, BarChart } from 'react-native-chart-kit';
import { ExpenseContext } from '../context/ExpenseContext';
import { globalStyles } from '../styles/global';
import colors from '../constants/colors';

const screenWidth = Dimensions.get('window').width;

// Helper to generate distinct colors for pie chart
const getCategoryColor = (index) => {
  const palette = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', 
    '#8B5CF6', '#EC4899', '#14B8A6', '#6366F1'
  ];
  return palette[index % palette.length];
};

const StatisticsScreen = () => {
  const { expenses } = useContext(ExpenseContext);

  const stats = useMemo(() => {
    // 1. Filter out only expenses
    const expenseData = expenses.filter(e => e.type === 'expense');
    
    // 2. Aggregate by Category for Pie Chart
    const categoryTotals = {};
    expenseData.forEach(exp => {
      categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
    });

    const pieChartData = Object.keys(categoryTotals).map((key, index) => ({
      name: key,
      population: categoryTotals[key],
      color: getCategoryColor(index),
      legendFontColor: colors.textMuted,
      legendFontSize: 12,
    })).sort((a, b) => b.population - a.population);

    // 3. Aggregate by month for Bar Chart (last 6 months)
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthlyTotals = {};
    
    // Initialize last 6 months
    const today = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const key = `${monthNames[d.getMonth()]} ${d.getFullYear().toString().substring(2)}`;
      monthlyTotals[key] = 0;
    }

    expenseData.forEach(exp => {
      const d = new Date(exp.date);
      const key = `${monthNames[d.getMonth()]} ${d.getFullYear().toString().substring(2)}`;
      if (monthlyTotals[key] !== undefined) {
        monthlyTotals[key] += exp.amount;
      }
    });

    const barChartData = {
      labels: Object.keys(monthlyTotals),
      datasets: [
        {
          data: Object.values(monthlyTotals)
        }
      ]
    };

    // 4. Insights
    const topCategory = pieChartData.length > 0 ? pieChartData[0] : null;
    const totalSpent = expenseData.reduce((acc, curr) => acc + curr.amount, 0);
    const averageMonthly = totalSpent / 6; // Simple avg over 6 months

    return { pieChartData, barChartData, topCategory, averageMonthly };
  }, [expenses]);

  const chartConfig = {
    backgroundColor: colors.surface,
    backgroundGradientFrom: colors.surface,
    backgroundGradientTo: colors.surface,
    color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`, // primary color
    labelColor: (opacity = 1) => colors.textMuted,
    barPercentage: 0.5,
    decimalPlaces: 0,
  };

  return (
    <SafeAreaView style={globalStyles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Statistics</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Insights Cards */}
        <View style={styles.insightsRow}>
          <View style={[globalStyles.card, styles.insightCard]}>
            <Text style={styles.insightLabel}>Top Category</Text>
            <Text style={styles.insightValue} numberOfLines={1}>
              {stats.topCategory ? stats.topCategory.name : 'N/A'}
            </Text>
            {stats.topCategory && (
              <Text style={styles.insightSub}>${stats.topCategory.population.toFixed(2)}</Text>
            )}
          </View>
          <View style={[globalStyles.card, styles.insightCard]}>
            <Text style={styles.insightLabel}>Monthly Avg</Text>
            <Text style={styles.insightValue}>${stats.averageMonthly.toFixed(2)}</Text>
          </View>
        </View>

        {/* Monthly Spending Bar Chart */}
        <View style={globalStyles.card}>
          <Text style={styles.chartTitle}>Monthly Spending (6 Mos)</Text>
          {stats.barChartData.datasets[0].data.some(val => val > 0) ? (
            <BarChart
              data={stats.barChartData}
              width={screenWidth - 80}
              height={220}
              yAxisLabel="$"
              chartConfig={chartConfig}
              verticalLabelRotation={0}
              style={styles.chartStyle}
            />
          ) : (
            <Text style={styles.emptyChart}>Not enough data to display chart.</Text>
          )}
        </View>

        {/* Expenses by Category Pie Chart */}
        <View style={globalStyles.card}>
          <Text style={styles.chartTitle}>Expenses by Category</Text>
          {stats.pieChartData.length > 0 ? (
            <PieChart
              data={stats.pieChartData}
              width={screenWidth - 80}
              height={220}
              chartConfig={chartConfig}
              accessor={"population"}
              backgroundColor={"transparent"}
              paddingLeft={"15"}
              center={[10, 0]}
              absolute // Shows values instead of percentages
            />
          ) : (
            <Text style={styles.emptyChart}>Not enough data to display chart.</Text>
          )}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  scrollContent: {
    paddingHorizontal: 24,
  },
  insightsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  insightCard: {
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
    padding: 16,
  },
  insightLabel: {
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: 4,
  },
  insightValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  insightSub: {
    fontSize: 12,
    color: colors.error,
    marginTop: 4,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  chartStyle: {
    marginVertical: 8,
    borderRadius: 16,
  },
  emptyChart: {
    textAlign: 'center',
    color: colors.textMuted,
    marginVertical: 40,
  }
});

export default StatisticsScreen;

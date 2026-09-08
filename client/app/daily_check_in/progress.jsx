import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  // Platform removed
  // Dimensions removed
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Calendar, Download, Share2 } from 'lucide-react-native';
import { Colors } from '../../constant/Colors';
import { isWeb, width } from '../../utils/responsive';
import WebLayout from '../../components/WebLayout';

// Removed unused screenWidth derived from Dimensions

// Mock data for visualizations
const mockMoodData = [
  { day: 'Mon', value: 4 },
  { day: 'Tue', value: 3 },
  { day: 'Wed', value: 5 },
  { day: 'Thu', value: 2 },
  { day: 'Fri', value: 4 },
  { day: 'Sat', value: 3 },
  { day: 'Sun', value: 4 },
];

const mockSleepData = [
  { day: 'Mon', value: 3 },
  { day: 'Tue', value: 4 },
  { day: 'Wed', value: 4 },
  { day: 'Thu', value: 2 },
  { day: 'Fri', value: 3 },
  { day: 'Sat', value: 5 },
  { day: 'Sun', value: 4 },
];

const mockStressData = [
  { day: 'Mon', value: 3 },
  { day: 'Tue', value: 2 },
  { day: 'Wed', value: 1 },
  { day: 'Thu', value: 4 },
  { day: 'Fri', value: 3 },
  { day: 'Sat', value: 2 },
  { day: 'Sun', value: 2 },
];

// Helper functions
const getBarColor = (value, isStress = false) => {
  if (isStress) {
    // For stress, lower is better
    if (value === 1) return Colors.SUCCESS;
    if (value === 2) return Colors.INFO;
    if (value === 3) return Colors.SECONDARY;
    if (value === 4) return Colors.WARNING;
    return Colors.ERROR;
  } else {
    // For mood and sleep, higher is better
    if (value === 5) return Colors.SUCCESS;
    if (value === 4) return Colors.INFO;
    if (value === 3) return Colors.SECONDARY;
    if (value === 2) return Colors.WARNING;
    return Colors.ERROR;
  }
};

const renderWebBarChart = (data, title, isStress = false) => {
  const maxValue = 5;
  
  return (
    <View style={styles.webChartCard}>
      <Text style={styles.webChartTitle}>{title}</Text>
      <View style={styles.webChartContent}>
        {data.map((item, index) => {
          const barHeight = (item.value / maxValue) * 80;
          return (
            <View key={index} style={styles.webBarContainer}>
              <Text style={styles.webBarValue}>{item.value}</Text>
              <View style={styles.webBarWrapper}>
                <View 
                  style={[
                    styles.webBar, 
                    { 
                      height: barHeight, 
                      backgroundColor: getBarColor(item.value, isStress) 
                    }
                  ]}
                />
              </View>
              <Text style={styles.webBarLabel}>{item.day}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const renderBarChart = (data, title, isStress = false) => {
  const maxValue = 5; // Maximum value for our scales
  
  return (
    <View style={styles.chartContainer}>
      <Text style={styles.chartTitle}>{title}</Text>
      <View style={styles.chartContent}>
        {data.map((item, index) => {
          const barHeight = (item.value / maxValue) * 120; // 120 is the max height of our bars
          return (
            <View key={index} style={styles.barContainer}>
              <View style={styles.barLabelContainer}>
                <Text style={styles.barValue}>{item.value}</Text>
              </View>
              <View style={styles.barWrapper}>
                <View 
                  style={[
                    styles.bar, 
                    { 
                      height: barHeight, 
                      backgroundColor: getBarColor(item.value, isStress) 
                    }
                  ]}
                />
              </View>
              <Text style={styles.barLabel}>{item.day}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default function ProgressScreen() {
  const [timeRange, setTimeRange] = React.useState('week'); // 'week', 'month', 'year'

  if (isWeb) {
    return (
      <WebLayout>
        <ScrollView style={styles.webContainer} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.webHeaderSection}>
            <View style={styles.webHeaderContent}>
              <Text style={styles.webHeaderTitle}>Your Wellness Progress</Text>
              <Text style={styles.webHeaderSubtitle}>
                Track your mental health journey over time
              </Text>
            </View>
          </View>

          {/* Time Range Selector */}
          <View style={styles.webSection}>
            <Text style={styles.webSectionTitle}>Time Period</Text>
            <View style={styles.webTimeRangeContainer}>
              <TouchableOpacity 
                style={[styles.webTimeRangeButton, timeRange === 'week' && styles.webActiveTimeRange]}
                onPress={() => setTimeRange('week')}
              >
                <Text style={[styles.webTimeRangeText, timeRange === 'week' && styles.webActiveTimeRangeText]}>Week</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.webTimeRangeButton, timeRange === 'month' && styles.webActiveTimeRange]}
                onPress={() => setTimeRange('month')}
              >
                <Text style={[styles.webTimeRangeText, timeRange === 'month' && styles.webActiveTimeRangeText]}>Month</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.webTimeRangeButton, timeRange === 'year' && styles.webActiveTimeRange]}
                onPress={() => setTimeRange('year')}
              >
                <Text style={[styles.webTimeRangeText, timeRange === 'year' && styles.webActiveTimeRangeText]}>Year</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Summary Cards */}
          <View style={styles.webSection}>
            <Text style={styles.webSectionTitle}>Weekly Summary</Text>
            <View style={styles.webSummaryGrid}>
              <View style={styles.webSummaryCard}>
                <Text style={styles.webSummaryLabel}>Average Mood</Text>
                <Text style={[styles.webSummaryValue, { color: Colors.INFO }]}>3.6/5</Text>
                <Text style={styles.webSummaryDescription}>Good overall mood</Text>
              </View>
              <View style={styles.webSummaryCard}>
                <Text style={styles.webSummaryLabel}>Sleep Quality</Text>
                <Text style={[styles.webSummaryValue, { color: Colors.INFO }]}>3.6/5</Text>
                <Text style={styles.webSummaryDescription}>Fair sleep patterns</Text>
              </View>
              <View style={styles.webSummaryCard}>
                <Text style={styles.webSummaryLabel}>Stress Level</Text>
                <Text style={[styles.webSummaryValue, { color: Colors.SUCCESS }]}>2.4/5</Text>
                <Text style={styles.webSummaryDescription}>Manageable stress</Text>
              </View>
            </View>
          </View>

          {/* Charts Section */}
          <View style={styles.webSection}>
            <Text style={styles.webSectionTitle}>Progress Charts</Text>
            <View style={styles.webChartsGrid}>
              {renderWebBarChart(mockMoodData, 'Mood Tracking')}
              {renderWebBarChart(mockSleepData, 'Sleep Quality')}
              {renderWebBarChart(mockStressData, 'Stress Level', true)}
            </View>
          </View>

          {/* Insights */}
          <View style={styles.webSection}>
            <Text style={styles.webSectionTitle}>Weekly Insights</Text>
            <View style={styles.webInsightsGrid}>
              <View style={styles.webInsightCard}>
                <View style={[styles.webInsightIcon, { backgroundColor: Colors.SUCCESS + '20' }]}>
                  <View style={[styles.webInsightDot, { backgroundColor: Colors.SUCCESS }]} />
                </View>
                <Text style={styles.webInsightText}>Your mood was highest on Wednesday this week.</Text>
              </View>
              <View style={styles.webInsightCard}>
                <View style={[styles.webInsightIcon, { backgroundColor: Colors.WARNING + '20' }]}>
                  <View style={[styles.webInsightDot, { backgroundColor: Colors.WARNING }]} />
                </View>
                <Text style={styles.webInsightText}>Your stress level peaked on Thursday.</Text>
              </View>
              <View style={styles.webInsightCard}>
                <View style={[styles.webInsightIcon, { backgroundColor: Colors.INFO + '20' }]}>
                  <View style={[styles.webInsightDot, { backgroundColor: Colors.INFO }]} />
                </View>
                <Text style={styles.webInsightText}>Your sleep quality has been improving over the weekend.</Text>
              </View>
            </View>
          </View>

          {/* Actions */}
          <View style={styles.webActionsSection}>
            <View style={styles.webActionsGrid}>
              <TouchableOpacity 
                style={styles.webActionButton}
                onPress={() => router.push('/daily_check_in/calendar')}
              >
                <LinearGradient
                  colors={[Colors.PRIMARY, '#1e40af']}
                  style={styles.webActionGradient}
                >
                  <Calendar size={20} color={Colors.WHITE} />
                  <Text style={styles.webActionText}>View Calendar</Text>
                </LinearGradient>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.webActionButton}>
                <LinearGradient
                  colors={[Colors.SECONDARY, '#d97706']}
                  style={styles.webActionGradient}
                >
                  <Download size={20} color={Colors.WHITE} />
                  <Text style={styles.webActionText}>Export Data</Text>
                </LinearGradient>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.webActionButton}>
                <LinearGradient
                  colors={['#3B82F6', '#1e40af']}
                  style={styles.webActionGradient}
                >
                  <Share2 size={20} color={Colors.WHITE} />
                  <Text style={styles.webActionText}>Share Report</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </WebLayout>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={[Colors.PRIMARY, Colors.DARK_BLUE]}
        style={styles.header}
      >
        <View style={styles.headerRow}>
          <TouchableOpacity 
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <ArrowLeft size={24} color={Colors.WHITE} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Your Progress</Text>
          <View style={styles.headerSpacer} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.contentPadding}>
          {/* Time Range Selector */}
          <View style={styles.timeRangeContainer}>
            <TouchableOpacity 
              style={[styles.timeRangeButton, timeRange === 'week' && styles.activeTimeRange]}
              onPress={() => setTimeRange('week')}
            >
              <Text style={[styles.timeRangeText, timeRange === 'week' && styles.activeTimeRangeText]}>Week</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.timeRangeButton, timeRange === 'month' && styles.activeTimeRange]}
              onPress={() => setTimeRange('month')}
            >
              <Text style={[styles.timeRangeText, timeRange === 'month' && styles.activeTimeRangeText]}>Month</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.timeRangeButton, timeRange === 'year' && styles.activeTimeRange]}
              onPress={() => setTimeRange('year')}
            >
              <Text style={[styles.timeRangeText, timeRange === 'year' && styles.activeTimeRangeText]}>Year</Text>
            </TouchableOpacity>
          </View>

          {/* Summary Card */}
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Weekly Summary</Text>
            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Average Mood</Text>
                <Text style={[styles.summaryValue, { color: Colors.INFO }]}>3.6/5</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Sleep Quality</Text>
                <Text style={[styles.summaryValue, { color: Colors.INFO }]}>3.6/5</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Stress Level</Text>
                <Text style={[styles.summaryValue, { color: Colors.INFO }]}>2.4/5</Text>
              </View>
            </View>
          </View>

          {/* Charts */}
          <View style={styles.chartsContainer}>
            {renderBarChart(mockMoodData, 'Mood')}
            {renderBarChart(mockSleepData, 'Sleep Quality')}
            {renderBarChart(mockStressData, 'Stress Level', true)}
          </View>

          {/* Insights */}
          <View style={styles.insightsCard}>
            <Text style={styles.insightsTitle}>Insights</Text>
            <View style={styles.insightItem}>
              <View style={[styles.insightBullet, { backgroundColor: Colors.SUCCESS }]} />
              <Text style={styles.insightText}>Your mood was highest on Wednesday this week.</Text>
            </View>
            <View style={styles.insightItem}>
              <View style={[styles.insightBullet, { backgroundColor: Colors.WARNING }]} />
              <Text style={styles.insightText}>Your stress level peaked on Thursday.</Text>
            </View>
            <View style={styles.insightItem}>
              <View style={[styles.insightBullet, { backgroundColor: Colors.INFO }]} />
              <Text style={styles.insightText}>Your sleep quality has been improving over the weekend.</Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionsContainer}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => router.push('/daily_check_in/calendar')}
            >
              <LinearGradient
                colors={[Colors.PRIMARY, Colors.DARK_BLUE]}
                style={styles.actionGradient}
              >
                <Calendar size={20} color={Colors.WHITE} />
                <Text style={styles.actionText}>View Calendar</Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <View style={styles.actionRow}>
              <TouchableOpacity style={[styles.actionButton, styles.halfButton]}>
                <LinearGradient
                  colors={[Colors.SECONDARY, Colors.DARK_GOLD]}
                  style={styles.actionGradient}
                >
                  <Download size={20} color={Colors.WHITE} />
                  <Text style={styles.actionText}>Export Data</Text>
                </LinearGradient>
              </TouchableOpacity>
              
              <TouchableOpacity style={[styles.actionButton, styles.halfButton]}>
                <LinearGradient
                  colors={[Colors.INFO, Colors.INFO_DARK]}
                  style={styles.actionGradient}
                >
                  <Share2 size={20} color={Colors.WHITE} />
                  <Text style={styles.actionText}>Share Report</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BACKGROUND,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.WHITE,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  contentPadding: {
    padding: 20,
  },
  timeRangeContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.WHITE,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: Colors.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  timeRangeButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTimeRange: {
    backgroundColor: Colors.PRIMARY,
  },
  timeRangeText: {
    fontSize: 16,
    color: Colors.TEXT,
    fontWeight: '500',
  },
  activeTimeRangeText: {
    color: Colors.WHITE,
  },
  summaryCard: {
    backgroundColor: Colors.WHITE,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: Colors.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.TEXT,
    marginBottom: 15,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    color: Colors.TEXT_SECONDARY,
    marginBottom: 5,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  chartsContainer: {
    marginBottom: 20,
  },
  chartContainer: {
    backgroundColor: Colors.WHITE,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: Colors.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.TEXT,
    marginBottom: 15,
  },
  chartContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 160,
  },
  barContainer: {
    alignItems: 'center',
    width: (width - 80) / 7, // Divide available width by number of bars
  },
  barLabelContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  barValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.TEXT_SECONDARY,
  },
  barWrapper: {
    height: 120,
    justifyContent: 'flex-end',
  },
  bar: {
    width: 20,
    borderRadius: 10,
  },
  barLabel: {
    marginTop: 8,
    fontSize: 12,
    color: Colors.TEXT_SECONDARY,
  },
  insightsCard: {
    backgroundColor: Colors.WHITE,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: Colors.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  insightsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.TEXT,
    marginBottom: 15,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  insightBullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 7,
    marginRight: 10,
  },
  insightText: {
    flex: 1,
    fontSize: 16,
    color: Colors.TEXT,
    lineHeight: 22,
  },
  actionsContainer: {
    marginBottom: 20,
  },
  actionButton: {
    marginBottom: 15,
    borderRadius: 10,
    overflow: 'hidden',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfButton: {
    flex: 0.48,
  },
  actionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  actionText: {
    color: Colors.WHITE,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  
  // Web Styles
  webContainer: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  webHeaderSection: {
    backgroundColor: 'white',
    paddingVertical: width < 640 ? 40 : width < 1024 ? 60 : 80,
    paddingHorizontal: width < 640 ? 16 : width < 1024 ? 32 : 60,
    marginHorizontal: width < 640 ? 16 : width < 1024 ? 24 : 32,
    marginBottom: width < 640 ? 16 : width < 1024 ? 20 : 24,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  webHeaderContent: {
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
    alignItems: 'center',
  },
  webHeaderTitle: {
    fontSize: width < 640 ? 32 : width < 1024 ? 42 : 56,
    fontWeight: '900',
    color: Colors.PRIMARY,
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: -1.5,
  },
  webHeaderSubtitle: {
    fontSize: width < 640 ? 16 : 18,
    color: Colors.SECONDARY,
    textAlign: 'center',
    fontWeight: '500',
  },
  webSection: {
    backgroundColor: 'white',
    paddingVertical: width < 640 ? 40 : width < 1024 ? 50 : 60,
    paddingHorizontal: width < 640 ? 16 : width < 1024 ? 32 : 60,
    marginHorizontal: width < 640 ? 16 : width < 1024 ? 24 : 32,
    marginBottom: width < 640 ? 16 : width < 1024 ? 20 : 24,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  webSectionTitle: {
    fontSize: width < 640 ? 24 : width < 1024 ? 28 : 32,
    fontWeight: '800',
    color: Colors.PRIMARY,
    marginBottom: width < 640 ? 24 : width < 1024 ? 32 : 40,
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  webTimeRangeContainer: {
    flexDirection: 'row',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 4,
    maxWidth: 400,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  webTimeRangeButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  webActiveTimeRange: {
    backgroundColor: Colors.PRIMARY,
  },
  webTimeRangeText: {
    fontSize: 16,
    color: '#64748b',
    fontWeight: '500',
  },
  webActiveTimeRangeText: {
    color: Colors.WHITE,
    fontWeight: '600',
  },
  webSummaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: width < 640 ? 16 : width < 1024 ? 20 : 24,
    maxWidth: 1200,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  webSummaryCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: width < 640 ? 20 : width < 1024 ? 24 : 28,
    width: width < 640 ? '100%' : '30%',
    minWidth: width < 640 ? 0 : 200,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  webSummaryLabel: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 8,
    fontWeight: '500',
  },
  webSummaryValue: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  webSummaryDescription: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
  },
  webChartsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: width < 640 ? 16 : width < 1024 ? 20 : 24,
    maxWidth: 1200,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  webChartCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: width < 640 ? 20 : width < 1024 ? 24 : 28,
    width: width < 640 ? '100%' : '48%',
    minWidth: width < 640 ? 0 : 300,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  webChartTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.PRIMARY,
    marginBottom: 20,
    textAlign: 'center',
  },
  webChartContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
  },
  webBarContainer: {
    alignItems: 'center',
    flex: 1,
  },
  webBarValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 8,
  },
  webBarWrapper: {
    height: 80,
    justifyContent: 'flex-end',
    width: 16,
  },
  webBar: {
    width: 16,
    borderRadius: 8,
  },
  webBarLabel: {
    marginTop: 8,
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  webInsightsGrid: {
    gap: width < 640 ? 16 : 20,
    maxWidth: 800,
    alignSelf: 'center',
  },
  webInsightCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 16,
  },
  webInsightIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  webInsightDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  webInsightText: {
    flex: 1,
    fontSize: 16,
    color: '#374151',
    lineHeight: 22,
  },
  webActionsSection: {
    paddingVertical: 40,
    paddingHorizontal: width < 640 ? 16 : width < 1024 ? 32 : 60,
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },
  webActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: width < 640 ? 16 : 20,
    justifyContent: 'center',
  },
  webActionButton: {
    borderRadius: 12,
    overflow: 'hidden',
    width: width < 640 ? '100%' : '30%',
    minWidth: width < 640 ? 0 : 200,
  },
  webActionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 12,
  },
  webActionText: {
    color: Colors.WHITE,
    fontSize: 16,
    fontWeight: '600',
  },
});
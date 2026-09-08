import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Platform,
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  ArrowLeft, 
  ChevronLeft, 
  ChevronRight, 
  Heart,
  Moon,
  Zap,
  Plus,
  Eye
} from 'lucide-react-native';
import { Colors } from '../../constant/Colors';
import { responsive } from '../../utils/responsive';
import WebLayout from '../../components/WebLayout';

const { width: screenWidth } = Dimensions.get('window');

// Mock data for check-ins
const mockCheckIns = {
  '2025-01-15': { mood: 4, sleep: 3, stress: 2 },
  '2025-01-14': { mood: 3, sleep: 4, stress: 3 },
  '2025-01-13': { mood: 5, sleep: 5, stress: 1 },
  '2025-01-12': { mood: 2, sleep: 2, stress: 4 },
  '2025-01-11': { mood: 4, sleep: 3, stress: 2 },
  '2025-01-10': { mood: 3, sleep: 4, stress: 3 },
  '2025-01-09': { mood: 4, sleep: 4, stress: 2 },
};

export default function CalendarScreen() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const formatDateKey = (date) => {
    return date.toISOString().split('T')[0];
  };

  const getCheckInData = (date) => {
    if (!date) return null;
    const dateKey = formatDateKey(date);
    return mockCheckIns[dateKey] || null;
  };

  const getMoodColor = (mood) => {
    if (!mood) return Colors.GRAY_300;
    if (mood >= 4) return Colors.SUCCESS;
    if (mood >= 3) return Colors.INFO;
    if (mood >= 2) return Colors.WARNING;
    return Colors.ERROR;
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const isToday = (date) => {
    if (!date) return false;
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSameDay = (date1, date2) => {
    if (!date1 || !date2) return false;
    return date1.toDateString() === date2.toDateString();
  };

  const handleDatePress = (date) => {
    setSelectedDate(date);
  };

  const handleAddCheckIn = () => {
    router.push('/daily_check_in/daily');
  };

  const handleViewCheckIn = (date) => {
    // Navigate to a detailed view of the check-in for this date
    // For now, just show the daily check-in screen
    router.push('/daily_check_in/daily');
  };

  if (Platform.OS === 'web') {
    return (
      <WebLayout>
        <ScrollView style={styles.webContainer} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.webHeaderSection}>
            <View style={styles.webHeaderContent}>
              <Text style={styles.webHeaderTitle}>Wellness Calendar</Text>
              <Text style={styles.webHeaderSubtitle}>
                Track your daily check-ins and wellness journey
              </Text>
            </View>
          </View>

          {/* Calendar Controls */}
          <View style={styles.webSection}>
            <View style={styles.webCalendarControls}>
              <TouchableOpacity 
                style={styles.webNavButton}
                onPress={() => navigateMonth(-1)}
              >
                <ChevronLeft size={20} color={Colors.PRIMARY} />
              </TouchableOpacity>
              
              <Text style={styles.webMonthTitle}>
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </Text>
              
              <TouchableOpacity 
                style={styles.webNavButton}
                onPress={() => navigateMonth(1)}
              >
                <ChevronRight size={20} color={Colors.PRIMARY} />
              </TouchableOpacity>
            </View>

            {/* Calendar Grid */}
            <View style={styles.webCalendarContainer}>
              {/* Day Headers */}
              <View style={styles.webDayHeaders}>
                {dayNames.map((day) => (
                  <Text key={day} style={styles.webDayHeader}>{day}</Text>
                ))}
              </View>

              {/* Calendar Days */}
              <View style={styles.webCalendarGrid}>
                {getDaysInMonth(currentDate).map((date, index) => {
                  const checkInData = getCheckInData(date);
                  const hasCheckIn = checkInData !== null;
                  
                  return (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.webDayCell,
                        !date && styles.webEmptyCell,
                        isToday(date) && styles.webTodayCell,
                        isSameDay(date, selectedDate) && styles.webSelectedCell,
                        hasCheckIn && styles.webHasCheckInCell
                      ]}
                      onPress={() => date && handleDatePress(date)}
                      disabled={!date}
                    >
                      {date && (
                        <>
                          <Text style={[
                            styles.webDayNumber,
                            isToday(date) && styles.webTodayText,
                            isSameDay(date, selectedDate) && styles.webSelectedText,
                            hasCheckIn && styles.webHasCheckInText
                          ]}>
                            {date.getDate()}
                          </Text>
                          {hasCheckIn && (
                            <View style={styles.webCheckInIndicators}>
                              <View style={[
                                styles.webMoodIndicator,
                                { backgroundColor: getMoodColor(checkInData.mood) }
                              ]} />
                            </View>
                          )}
                        </>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </View>

          {/* Selected Date Details */}
          {selectedDate && (
            <View style={styles.webSection}>
              <Text style={styles.webSectionTitle}>
                {selectedDate.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </Text>
              
              {getCheckInData(selectedDate) ? (
                <View style={styles.webCheckInDetails}>
                  <View style={styles.webCheckInMetrics}>
                    <View style={styles.webMetricCard}>
                      <Heart size={24} color={Colors.ERROR} />
                      <Text style={styles.webMetricLabel}>Mood</Text>
                      <Text style={[styles.webMetricValue, { color: getMoodColor(getCheckInData(selectedDate).mood) }]}>
                        {getCheckInData(selectedDate).mood}/5
                      </Text>
                    </View>
                    
                    <View style={styles.webMetricCard}>
                      <Moon size={24} color={Colors.INFO} />
                      <Text style={styles.webMetricLabel}>Sleep</Text>
                      <Text style={[styles.webMetricValue, { color: getMoodColor(getCheckInData(selectedDate).sleep) }]}>
                        {getCheckInData(selectedDate).sleep}/5
                      </Text>
                    </View>
                    
                    <View style={styles.webMetricCard}>
                      <Zap size={24} color={Colors.WARNING} />
                      <Text style={styles.webMetricLabel}>Stress</Text>
                      <Text style={[styles.webMetricValue, { color: getMoodColor(5 - getCheckInData(selectedDate).stress + 1) }]}>
                        {getCheckInData(selectedDate).stress}/5
                      </Text>
                    </View>
                  </View>
                  
                  <TouchableOpacity 
                    style={styles.webViewButton}
                    onPress={() => handleViewCheckIn(selectedDate)}
                  >
                    <Eye size={20} color={Colors.PRIMARY} />
                    <Text style={styles.webViewButtonText}>View Details</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.webNoCheckIn}>
                  <Text style={styles.webNoCheckInText}>No check-in recorded for this date</Text>
                  <TouchableOpacity 
                    style={styles.webAddButton}
                    onPress={handleAddCheckIn}
                  >
                    <LinearGradient
                      colors={[Colors.PRIMARY, '#1e40af']}
                      style={styles.webAddButtonGradient}
                    >
                      <Plus size={20} color={Colors.WHITE} />
                      <Text style={styles.webAddButtonText}>Add Check-in</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}

          {/* Legend */}
          <View style={styles.webSection}>
            <Text style={styles.webSectionTitle}>Legend</Text>
            <View style={styles.webLegendGrid}>
              <View style={styles.webLegendItem}>
                <View style={[styles.webLegendColor, { backgroundColor: Colors.SUCCESS }]} />
                <Text style={styles.webLegendText}>Great Mood (4-5)</Text>
              </View>
              <View style={styles.webLegendItem}>
                <View style={[styles.webLegendColor, { backgroundColor: Colors.INFO }]} />
                <Text style={styles.webLegendText}>Good Mood (3)</Text>
              </View>
              <View style={styles.webLegendItem}>
                <View style={[styles.webLegendColor, { backgroundColor: Colors.WARNING }]} />
                <Text style={styles.webLegendText}>Fair Mood (2)</Text>
              </View>
              <View style={styles.webLegendItem}>
                <View style={[styles.webLegendColor, { backgroundColor: Colors.ERROR }]} />
                <Text style={styles.webLegendText}>Poor Mood (1)</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </WebLayout>
    );
  }

  // Mobile version
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
          <Text style={styles.headerTitle}>Wellness Calendar</Text>
          <View style={styles.headerSpacer} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.contentPadding}>
          {/* Calendar Controls */}
          <View style={styles.calendarControls}>
            <TouchableOpacity 
              style={styles.navButton}
              onPress={() => navigateMonth(-1)}
            >
              <ChevronLeft size={24} color={Colors.PRIMARY} />
            </TouchableOpacity>
            
            <Text style={styles.monthTitle}>
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </Text>
            
            <TouchableOpacity 
              style={styles.navButton}
              onPress={() => navigateMonth(1)}
            >
              <ChevronRight size={24} color={Colors.PRIMARY} />
            </TouchableOpacity>
          </View>

          {/* Calendar */}
          <View style={styles.calendarContainer}>
            {/* Day Headers */}
            <View style={styles.dayHeaders}>
              {dayNames.map((day) => (
                <Text key={day} style={styles.dayHeader}>{day}</Text>
              ))}
            </View>

            {/* Calendar Grid */}
            <View style={styles.calendarGrid}>
              {getDaysInMonth(currentDate).map((date, index) => {
                const checkInData = getCheckInData(date);
                const hasCheckIn = checkInData !== null;
                
                return (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.dayCell,
                      !date && styles.emptyCell,
                      isToday(date) && styles.todayCell,
                      isSameDay(date, selectedDate) && styles.selectedCell,
                      hasCheckIn && styles.hasCheckInCell
                    ]}
                    onPress={() => date && handleDatePress(date)}
                    disabled={!date}
                    activeOpacity={0.7}
                  >
                    {date && (
                      <>
                        <Text style={[
                          styles.dayNumber,
                          isToday(date) && styles.todayText,
                          isSameDay(date, selectedDate) && styles.selectedText,
                          hasCheckIn && styles.hasCheckInText
                        ]}>
                          {date.getDate()}
                        </Text>
                        {hasCheckIn && (
                          <View style={[
                            styles.moodIndicator,
                            { backgroundColor: getMoodColor(checkInData.mood) }
                          ]} />
                        )}
                      </>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Selected Date Details */}
          {selectedDate && (
            <View style={styles.selectedDateCard}>
              <Text style={styles.selectedDateTitle}>
                {selectedDate.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </Text>
              
              {getCheckInData(selectedDate) ? (
                <View style={styles.checkInDetails}>
                  <View style={styles.metricsRow}>
                    <View style={styles.metricItem}>
                      <Heart size={20} color={Colors.ERROR} />
                      <Text style={styles.metricLabel}>Mood</Text>
                      <Text style={[styles.metricValue, { color: getMoodColor(getCheckInData(selectedDate).mood) }]}>
                        {getCheckInData(selectedDate).mood}/5
                      </Text>
                    </View>
                    
                    <View style={styles.metricItem}>
                      <Moon size={20} color={Colors.INFO} />
                      <Text style={styles.metricLabel}>Sleep</Text>
                      <Text style={[styles.metricValue, { color: getMoodColor(getCheckInData(selectedDate).sleep) }]}>
                        {getCheckInData(selectedDate).sleep}/5
                      </Text>
                    </View>
                    
                    <View style={styles.metricItem}>
                      <Zap size={20} color={Colors.WARNING} />
                      <Text style={styles.metricLabel}>Stress</Text>
                      <Text style={[styles.metricValue, { color: getMoodColor(5 - getCheckInData(selectedDate).stress + 1) }]}>
                        {getCheckInData(selectedDate).stress}/5
                      </Text>
                    </View>
                  </View>
                  
                  <TouchableOpacity 
                    style={styles.viewButton}
                    onPress={() => handleViewCheckIn(selectedDate)}
                  >
                    <LinearGradient
                      colors={[Colors.SECONDARY, Colors.DARK_GOLD]}
                      style={styles.viewButtonGradient}
                    >
                      <Eye size={20} color={Colors.WHITE} />
                      <Text style={styles.viewButtonText}>View Details</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.noCheckIn}>
                  <Text style={styles.noCheckInText}>No check-in recorded for this date</Text>
                  <TouchableOpacity 
                    style={styles.addButton}
                    onPress={handleAddCheckIn}
                  >
                    <LinearGradient
                      colors={[Colors.PRIMARY, Colors.DARK_BLUE]}
                      style={styles.addButtonGradient}
                    >
                      <Plus size={20} color={Colors.WHITE} />
                      <Text style={styles.addButtonText}>Add Check-in</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}

          {/* Legend */}
          <View style={styles.legendCard}>
            <Text style={styles.legendTitle}>Mood Legend</Text>
            <View style={styles.legendItems}>
              <View style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: Colors.SUCCESS }]} />
                <Text style={styles.legendText}>Great (4-5)</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: Colors.INFO }]} />
                <Text style={styles.legendText}>Good (3)</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: Colors.WARNING }]} />
                <Text style={styles.legendText}>Fair (2)</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: Colors.ERROR }]} />
                <Text style={styles.legendText}>Poor (1)</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // Mobile Styles
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
  calendarControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  navButton: {
    padding: 12,
    borderRadius: 25,
    backgroundColor: Colors.PRIMARY + '15',
  },
  monthTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.PRIMARY,
  },
  calendarContainer: {
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
  dayHeaders: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  dayHeader: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
    color: Colors.TEXT_SECONDARY,
    paddingVertical: 8,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: (screenWidth - 80) / 7,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 8,
    position: 'relative',
  },
  emptyCell: {
    backgroundColor: 'transparent',
  },
  todayCell: {
    backgroundColor: Colors.PRIMARY + '20',
    borderWidth: 2,
    borderColor: Colors.PRIMARY,
  },
  selectedCell: {
    backgroundColor: Colors.SECONDARY + '30',
    borderWidth: 2,
    borderColor: Colors.SECONDARY,
  },
  hasCheckInCell: {
    backgroundColor: Colors.SUCCESS + '10',
  },
  dayNumber: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.TEXT,
  },
  todayText: {
    color: Colors.PRIMARY,
    fontWeight: 'bold',
  },
  selectedText: {
    color: Colors.SECONDARY,
    fontWeight: 'bold',
  },
  hasCheckInText: {
    fontWeight: '600',
  },
  moodIndicator: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  selectedDateCard: {
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
  selectedDateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.PRIMARY,
    textAlign: 'center',
    marginBottom: 20,
  },
  checkInDetails: {
    alignItems: 'center',
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  metricItem: {
    alignItems: 'center',
    flex: 1,
  },
  metricLabel: {
    fontSize: 14,
    color: Colors.TEXT_SECONDARY,
    marginTop: 8,
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  viewButton: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  viewButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    gap: 8,
  },
  viewButtonText: {
    color: Colors.WHITE,
    fontSize: 16,
    fontWeight: '600',
  },
  noCheckIn: {
    alignItems: 'center',
  },
  noCheckInText: {
    fontSize: 16,
    color: Colors.TEXT_SECONDARY,
    marginBottom: 16,
    textAlign: 'center',
  },
  addButton: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  addButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    gap: 8,
  },
  addButtonText: {
    color: Colors.WHITE,
    fontSize: 16,
    fontWeight: '600',
  },
  legendCard: {
    backgroundColor: Colors.WHITE,
    borderRadius: 15,
    padding: 20,
    shadowColor: Colors.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  legendTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.PRIMARY,
    marginBottom: 15,
    textAlign: 'center',
  },
  legendItems: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
    color: Colors.TEXT,
  },

  // Web Styles
  webContainer: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  webHeaderSection: {
    backgroundColor: 'white',
    paddingVertical: responsive({ xs: 40, md: 60, lg: 80 }),
    paddingHorizontal: responsive({ xs: 16, md: 32, lg: 60 }),
    marginHorizontal: responsive({ xs: 16, md: 24, lg: 32 }),
    marginBottom: responsive({ xs: 16, md: 20, lg: 24 }),
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
    fontSize: responsive({ xs: 32, md: 42, lg: 56 }),
    fontWeight: '900',
    color: Colors.PRIMARY,
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: -1.5,
  },
  webHeaderSubtitle: {
    fontSize: responsive({ xs: 16, md: 18 }),
    color: Colors.SECONDARY,
    textAlign: 'center',
    fontWeight: '500',
  },
  webSection: {
    backgroundColor: 'white',
    paddingVertical: responsive({ xs: 40, md: 50, lg: 60 }),
    paddingHorizontal: responsive({ xs: 16, md: 32, lg: 60 }),
    marginHorizontal: responsive({ xs: 16, md: 24, lg: 32 }),
    marginBottom: responsive({ xs: 16, md: 20, lg: 24 }),
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  webSectionTitle: {
    fontSize: responsive({ xs: 24, md: 28, lg: 32 }),
    fontWeight: '800',
    color: Colors.PRIMARY,
    marginBottom: responsive({ xs: 24, md: 32, lg: 40 }),
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  webCalendarControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 40,
    marginBottom: 40,
  },
  webNavButton: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  webMonthTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.PRIMARY,
    minWidth: 250,
    textAlign: 'center',
  },
  webCalendarContainer: {
    maxWidth: 800,
    alignSelf: 'center',
    width: '100%',
  },
  webDayHeaders: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 8,
  },
  webDayHeader: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
    paddingVertical: 8,
  },
  webCalendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  webDayCell: {
    width: 'calc(14.28% - 7px)',
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    position: 'relative',
    cursor: 'pointer',
  },
  webEmptyCell: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    cursor: 'default',
  },
  webTodayCell: {
    backgroundColor: Colors.PRIMARY + '20',
    borderColor: Colors.PRIMARY,
    borderWidth: 2,
  },
  webSelectedCell: {
    backgroundColor: Colors.SECONDARY + '30',
    borderColor: Colors.SECONDARY,
    borderWidth: 2,
  },
  webHasCheckInCell: {
    backgroundColor: Colors.SUCCESS + '10',
  },
  webDayNumber: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  webTodayText: {
    color: Colors.PRIMARY,
    fontWeight: 'bold',
  },
  webSelectedText: {
    color: Colors.SECONDARY,
    fontWeight: 'bold',
  },
  webHasCheckInText: {
    fontWeight: '600',
  },
  webCheckInIndicators: {
    position: 'absolute',
    bottom: 8,
    right: 8,
  },
  webMoodIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  webCheckInDetails: {
    alignItems: 'center',
  },
  webCheckInMetrics: {
    flexDirection: 'row',
    gap: 32,
    marginBottom: 32,
    justifyContent: 'center',
  },
  webMetricCard: {
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 20,
    minWidth: 120,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  webMetricLabel: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 8,
    marginBottom: 4,
    fontWeight: '500',
  },
  webMetricValue: {
    fontSize: 20,
    fontWeight: '700',
  },
  webViewButton: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  webViewButtonText: {
    color: Colors.PRIMARY,
    fontSize: 16,
    fontWeight: '600',
  },
  webNoCheckIn: {
    alignItems: 'center',
  },
  webNoCheckInText: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 20,
    textAlign: 'center',
  },
  webAddButton: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  webAddButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    gap: 8,
  },
  webAddButtonText: {
    color: Colors.WHITE,
    fontSize: 16,
    fontWeight: '600',
  },
  webLegendGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 24,
    justifyContent: 'center',
  },
  webLegendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  webLegendColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  webLegendText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
});
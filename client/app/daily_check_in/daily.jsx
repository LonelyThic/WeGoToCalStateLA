import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Platform,
  // Dimensions removed
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Save, ChartBar as BarChart } from 'lucide-react-native';
import { Colors } from '../../constant/Colors';
import { width } from '../../utils/responsive';
import WebLayout from '../../components/WebLayout';

// Removed unused screenWidth from Dimensions

export default function DailyCheckInScreen() {
  const [mood, setMood] = useState(null);
  const [sleepQuality, setSleepQuality] = useState(null);
  const [stressLevel, setStressLevel] = useState(null);
  const [date] = useState(new Date());

  const moods = [
    { value: 5, label: 'Great', emoji: '😁', color: Colors.SUCCESS },
    { value: 4, label: 'Good', emoji: '🙂', color: Colors.INFO },
    { value: 3, label: 'Okay', emoji: '😐', color: Colors.SECONDARY },
    { value: 2, label: 'Not Great', emoji: '😕', color: Colors.WARNING },
    { value: 1, label: 'Poor', emoji: '😞', color: Colors.ERROR }
  ];

  const sleepOptions = [
    { value: 5, label: 'Excellent', color: Colors.SUCCESS },
    { value: 4, label: 'Good', color: Colors.INFO },
    { value: 3, label: 'Fair', color: Colors.SECONDARY },
    { value: 2, label: 'Poor', color: Colors.WARNING },
    { value: 1, label: 'Very Poor', color: Colors.ERROR }
  ];

  const stressOptions = [
    { value: 1, label: 'None', color: Colors.SUCCESS },
    { value: 2, label: 'Mild', color: Colors.INFO },
    { value: 3, label: 'Moderate', color: Colors.SECONDARY },
    { value: 4, label: 'High', color: Colors.WARNING },
    { value: 5, label: 'Severe', color: Colors.ERROR }
  ];

  const isAllAnswered = () => {
    return mood !== null && sleepQuality !== null && stressLevel !== null;
  };

  const handleSave = () => {
    // This would save the check-in data to AsyncStorage or context
    // For now, we'll just navigate to the progress screen
    router.push('/daily_check_in/progress');
  };

  if (Platform.OS === 'web') {
    return (
      <WebLayout>
        <ScrollView style={styles.webContainer} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.webHeaderSection}>
            <View style={styles.webHeaderContent}>
              <Text style={styles.webHeaderTitle}>Daily Wellness Check-In</Text>
              <Text style={styles.webHeaderDate}>
                {date.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </Text>
            </View>
          </View>

          {/* Mood Section */}
          <View style={styles.webSection}>
            <Text style={styles.webSectionTitle}>How are you feeling today?</Text>
            <View style={styles.webMoodGrid}>
              {moods.map((item) => (
                <TouchableOpacity
                  key={item.value}
                  style={[
                    styles.webMoodCard,
                    mood === item.value && styles.webSelectedCard
                  ]}
                  onPress={() => setMood(item.value)}
                >
                  <Text style={styles.webMoodEmoji}>{item.emoji}</Text>
                  <Text style={[
                    styles.webMoodLabel,
                    mood === item.value && { color: item.color }
                  ]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Sleep Section */}
          <View style={styles.webSection}>
            <Text style={styles.webSectionTitle}>How well did you sleep last night?</Text>
            <View style={styles.webOptionsGrid}>
              {sleepOptions.map((item) => (
                <TouchableOpacity
                  key={item.value}
                  style={[
                    styles.webOptionCard,
                    sleepQuality === item.value && [styles.webSelectedCard, { borderColor: item.color }]
                  ]}
                  onPress={() => setSleepQuality(item.value)}
                >
                  <Text style={[
                    styles.webOptionText,
                    sleepQuality === item.value && { color: item.color, fontWeight: '600' }
                  ]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Stress Section */}
          <View style={styles.webSection}>
            <Text style={styles.webSectionTitle}>What’s your stress level today?</Text>
            <View style={styles.webOptionsGrid}>
              {stressOptions.map((item) => (
                <TouchableOpacity
                  key={item.value}
                  style={[
                    styles.webOptionCard,
                    stressLevel === item.value && [styles.webSelectedCard, { borderColor: item.color }]
                  ]}
                  onPress={() => setStressLevel(item.value)}
                >
                  <Text style={[
                    styles.webOptionText,
                    stressLevel === item.value && { color: item.color, fontWeight: '600' }
                  ]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Actions */}
          <View style={styles.webActionsSection}>
            <TouchableOpacity 
              style={[styles.webSaveButton, !isAllAnswered() && styles.webDisabledButton]}
              onPress={handleSave}
              disabled={!isAllAnswered()}
            >
              <LinearGradient
                colors={isAllAnswered() ? [Colors.PRIMARY, '#1e40af'] : ['#d1d5db', '#9ca3af']}
                style={styles.webSaveButtonGradient}
              >
                <Save size={20} color={Colors.WHITE} />
                <Text style={styles.webSaveButtonText}>Save Today’s Check-In</Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.webSecondaryButton}
              onPress={() => router.push('/daily_check_in/progress')}
            >
              <BarChart size={20} color={Colors.PRIMARY} />
              <Text style={styles.webSecondaryButtonText}>View Progress</Text>
            </TouchableOpacity>
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
          <Text style={styles.headerTitle}>Daily Check-In</Text>
          <View style={styles.headerSpacer} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.contentPadding}>
          <View style={styles.dateContainer}>
            <Text style={styles.dateText}>
              {date.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </Text>
          </View>

          {/* Mood Section */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>How are you feeling today?</Text>
            <View style={styles.moodContainer}>
              {moods.map((item) => (
                <TouchableOpacity
                  key={item.value}
                  style={[
                    styles.moodButton,
                    mood === item.value && { borderColor: item.color, borderWidth: 2 }
                  ]}
                  onPress={() => setMood(item.value)}
                >
                  <Text style={styles.moodEmoji}>{item.emoji}</Text>
                  <Text style={[
                    styles.moodLabel,
                    mood === item.value && { color: item.color, fontWeight: 'bold' }
                  ]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Sleep Quality Section */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>How well did you sleep last night?</Text>
            <View style={styles.optionsContainer}>
              {sleepOptions.map((item) => (
                <TouchableOpacity
                  key={item.value}
                  style={[
                    styles.optionButton,
                    sleepQuality === item.value && { backgroundColor: item.color + '20', borderColor: item.color }
                  ]}
                  onPress={() => setSleepQuality(item.value)}
                >
                  <Text style={[
                    styles.optionText,
                    sleepQuality === item.value && { color: item.color, fontWeight: 'bold' }
                  ]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Stress Level Section */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>What’s your stress level today?</Text>
            <View style={styles.optionsContainer}>
              {stressOptions.map((item) => (
                <TouchableOpacity
                  key={item.value}
                  style={[
                    styles.optionButton,
                    stressLevel === item.value && { backgroundColor: item.color + '20', borderColor: item.color }
                  ]}
                  onPress={() => setStressLevel(item.value)}
                >
                  <Text style={[
                    styles.optionText,
                    stressLevel === item.value && { color: item.color, fontWeight: 'bold' }
                  ]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.actionsContainer}>
            <TouchableOpacity 
              style={[styles.actionButton, !isAllAnswered() && styles.disabledButton]}
              onPress={handleSave}
              disabled={!isAllAnswered()}
            >
              <LinearGradient
                colors={isAllAnswered() ? [Colors.PRIMARY, Colors.DARK_BLUE] : [Colors.GRAY, Colors.GRAY_DARK]}
                style={styles.actionGradient}
              >
                <Save size={20} color={Colors.WHITE} />
                <Text style={styles.actionText}>Save Today’s Check-In</Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => router.push('/daily_check_in/progress')}
            >
              <LinearGradient
                colors={[Colors.SECONDARY, Colors.DARK_GOLD]}
                style={styles.actionGradient}
              >
                <BarChart size={20} color={Colors.WHITE} />
                <Text style={styles.actionText}>View Progress</Text>
              </LinearGradient>
            </TouchableOpacity>
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
  dateContainer: {
    marginBottom: 15,
  },
  dateText: {
    fontSize: 16,
    color: Colors.TEXT_SECONDARY,
    textAlign: 'center',
  },
  sectionCard: {
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.TEXT,
    marginBottom: 15,
  },
  moodContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  moodButton: {
    width: (width - 80) / 5,
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.BORDER,
  },
  moodEmoji: {
    fontSize: 28,
    marginBottom: 5,
  },
  moodLabel: {
    fontSize: 12,
    color: Colors.TEXT,
    textAlign: 'center',
  },
  optionsContainer: {
    flexDirection: 'column',
    width: '100%',
  },
  optionButton: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: Colors.LIGHT_GRAY,
    borderWidth: 1,
    borderColor: Colors.BORDER,
  },
  optionText: {
    fontSize: 16,
    color: Colors.TEXT,
    textAlign: 'center',
  },
  actionsContainer: {
    marginVertical: 20,
  },
  actionButton: {
    marginBottom: 15,
    borderRadius: 10,
    overflow: 'hidden',
  },
  disabledButton: {
    opacity: 0.7,
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
  webHeaderDate: {
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
    fontSize: width < 640 ? 20 : width < 1024 ? 24 : 28,
    fontWeight: '700',
    color: Colors.PRIMARY,
    marginBottom: width < 640 ? 24 : width < 1024 ? 32 : 40,
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  webMoodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: width < 640 ? 12 : width < 1024 ? 16 : 20,
    maxWidth: 800,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  webMoodCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: width < 640 ? 16 : width < 1024 ? 20 : 24,
    width: width < 640 ? '18%' : width < 1024 ? '18%' : '18%',
    minWidth: width < 640 ? 60 : width < 1024 ? 80 : 100,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e2e8f0',
  },
  webSelectedCard: {
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  webMoodEmoji: {
    fontSize: width < 640 ? 24 : width < 1024 ? 28 : 32,
    marginBottom: 8,
  },
  webMoodLabel: {
    fontSize: width < 640 ? 12 : 14,
    fontWeight: '600',
    color: '#64748b',
    textAlign: 'center',
  },
  webOptionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: width < 640 ? 12 : width < 1024 ? 16 : 20,
    maxWidth: 800,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  webOptionCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: width < 640 ? 16 : width < 1024 ? 20 : 24,
    width: width < 640 ? '48%' : width < 1024 ? '30%' : '18%',
    minWidth: width < 640 ? 120 : width < 1024 ? 140 : 120,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e2e8f0',
  },
  webOptionText: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    fontWeight: '500',
  },
  webActionsSection: {
    paddingVertical: 40,
    paddingHorizontal: width < 640 ? 16 : width < 1024 ? 32 : 60,
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
    alignItems: 'center',
    gap: 16,
  },
  webSaveButton: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  webDisabledButton: {
    opacity: 0.6,
  },
  webSaveButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    gap: 12,
  },
  webSaveButtonText: {
    color: Colors.WHITE,
    fontSize: 16,
    fontWeight: '600',
  },
  webSecondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    gap: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  webSecondaryButtonText: {
    color: Colors.PRIMARY,
    fontSize: 16,
    fontWeight: '500',
  },
});
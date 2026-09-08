import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, ChevronRight } from 'lucide-react-native';
import { Colors } from '../../../constant/Colors';

export default function GAD7QuestionsScreen() {
  const [answers, setAnswers] = useState({
    q1: null,
    q2: null,
    q3: null,
    q4: null,
    q5: null,
    q6: null,
    q7: null
  });

  const questions = [
    'Feeling nervous, anxious, or on edge',
    'Not being able to stop or control worrying',
    'Worrying too much about different things',
    'Trouble relaxing',
    'Being so restless that it\'s hard to sit still',
    'Becoming easily annoyed or irritable',
    'Feeling afraid as if something awful might happen'
  ];

  const options = [
    { value: 0, label: 'Not at all' },
    { value: 1, label: 'Several days' },
    { value: 2, label: 'More than half the days' },
    { value: 3, label: 'Nearly every day' }
  ];

  const handleSelect = (question, value) => {
    setAnswers(prev => ({
      ...prev,
      [question]: value
    }));
  };

  const calculateScore = () => {
    let total = 0;
    Object.values(answers).forEach(value => {
      if (value !== null) {
        total += value;
      }
    });
    return total;
  };

  const isAllAnswered = () => {
    return Object.values(answers).every(value => value !== null);
  };

  const handleSubmit = () => {
    const score = calculateScore();
    // Store the score and date in AsyncStorage or context
    // This would be implemented with proper state management
    
    // For now, pass the score as a parameter
    router.push({
      pathname: '/quizzes/GAD7/gad_7Results',
      params: { score }
    });
  };

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
          <Text style={styles.headerTitle}>GAD-7 Assessment</Text>
          <View style={styles.headerSpacer} />
        </View>
        <Text style={styles.headerSubtitle}>
          Over the last 2 weeks, how often have you been bothered by the following problems?
        </Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.contentPadding}>
          {questions.map((question, index) => (
            <View key={index} style={styles.questionCard}>
              <Text style={styles.questionNumber}>Question {index + 1}</Text>
              <Text style={styles.questionText}>{question}</Text>
              
              <View style={styles.optionsContainer}>
                {options.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.optionButton,
                      answers[`q${index + 1}`] === option.value && styles.selectedOption
                    ]}
                    onPress={() => handleSelect(`q${index + 1}`, option.value)}
                  >
                    <Text 
                      style={[
                        styles.optionText,
                        answers[`q${index + 1}`] === option.value && styles.selectedOptionText
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}
          
          <TouchableOpacity 
            style={[styles.submitButton, !isAllAnswered() && styles.disabledButton]}
            onPress={handleSubmit}
            disabled={!isAllAnswered()}
          >
            <LinearGradient
              colors={isAllAnswered() ? [Colors.PRIMARY, Colors.DARK_BLUE] : [Colors.GRAY, Colors.GRAY_DARK]}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>Submit Answers</Text>
              <ChevronRight size={20} color={Colors.WHITE} />
            </LinearGradient>
          </TouchableOpacity>
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
  headerSubtitle: {
    fontSize: 16,
    color: Colors.WHITE,
    marginTop: 10,
    textAlign: 'center',
    opacity: 0.9,
  },
  content: {
    flex: 1,
  },
  contentPadding: {
    padding: 20,
  },
  questionCard: {
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
  questionNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.PRIMARY,
    marginBottom: 5,
  },
  questionText: {
    fontSize: 18,
    fontWeight: '500',
    color: Colors.TEXT,
    marginBottom: 20,
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
  selectedOption: {
    backgroundColor: Colors.PRIMARY + '20',
    borderColor: Colors.PRIMARY,
  },
  optionText: {
    fontSize: 16,
    color: Colors.TEXT,
  },
  selectedOptionText: {
    color: Colors.PRIMARY,
    fontWeight: '500',
  },
  submitButton: {
    marginVertical: 20,
    borderRadius: 10,
    overflow: 'hidden',
  },
  disabledButton: {
    opacity: 0.7,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  buttonText: {
    color: Colors.WHITE,
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
  },
});
import React from 'react';
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
import { ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react-native';
import { Colors } from '../../../constant/Colors';

export default function PHQ9DisclaimerScreen() {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={[Colors.ERROR, Colors.ERROR_DARK]}
        style={styles.header}
      >
        <View style={styles.headerRow}>
          <TouchableOpacity 
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <ArrowLeft size={24} color={Colors.WHITE} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>PHQ-9 Assessment</Text>
          <View style={styles.headerSpacer} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.contentPadding}>
          <View style={styles.disclaimerCard}>
            <AlertCircle size={40} color={Colors.ERROR} style={styles.disclaimerIcon} />
            <Text style={styles.disclaimerTitle}>Before You Begin</Text>
            
            <Text style={styles.disclaimerText}>
              The PHQ-9 (Patient Health Questionnaire-9) is a screening tool for depression. Please note:
            </Text>
            
            <View style={styles.bulletPoints}>
              <View style={styles.bulletPoint}>
                <View style={styles.bullet} />
                <Text style={styles.bulletText}>This is not a diagnostic tool and does not replace professional medical advice.</Text>
              </View>
              
              <View style={styles.bulletPoint}>
                <View style={styles.bullet} />
                <Text style={styles.bulletText}>Your responses are confidential and stored securely.</Text>
              </View>
              
              <View style={styles.bulletPoint}>
                <View style={styles.bullet} />
                <Text style={styles.bulletText}>If you’re experiencing thoughts of harming yourself, please contact emergency services or the National Suicide Prevention Lifeline at 988 immediately.</Text>
              </View>
            </View>
            
            <Text style={styles.instructionText}>
              The assessment consists of 9 questions about how you’ve been feeling over the past 2 weeks. Please answer honestly for the most accurate results.
            </Text>
          </View>
          
          <TouchableOpacity 
            style={styles.continueButton}
            onPress={() => router.push('/quizzes/PHQ9/phq_9Questions')}
          >
            <LinearGradient
              colors={[Colors.ERROR, Colors.ERROR_DARK]}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>Continue to Assessment</Text>
              <CheckCircle size={20} color={Colors.WHITE} />
            </LinearGradient>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={() => router.back()}
          >
            <Text style={styles.cancelText}>Cancel</Text>
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
  content: {
    flex: 1,
  },
  contentPadding: {
    padding: 20,
  },
  disclaimerCard: {
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
  disclaimerIcon: {
    alignSelf: 'center',
    marginBottom: 15,
  },
  disclaimerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.TEXT,
    textAlign: 'center',
    marginBottom: 15,
  },
  disclaimerText: {
    fontSize: 16,
    color: Colors.TEXT,
    marginBottom: 15,
    lineHeight: 22,
  },
  bulletPoints: {
    marginBottom: 15,
  },
  bulletPoint: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'flex-start',
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.ERROR,
    marginTop: 8,
    marginRight: 10,
  },
  bulletText: {
    flex: 1,
    fontSize: 15,
    color: Colors.TEXT,
    lineHeight: 22,
  },
  instructionText: {
    fontSize: 16,
    color: Colors.TEXT,
    fontStyle: 'italic',
    lineHeight: 22,
  },
  continueButton: {
    marginBottom: 15,
    borderRadius: 10,
    overflow: 'hidden',
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
  cancelButton: {
    alignItems: 'center',
    padding: 15,
  },
  cancelText: {
    color: Colors.TEXT_SECONDARY,
    fontSize: 16,
  },
});
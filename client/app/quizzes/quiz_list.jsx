import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  ArrowLeft,
  Brain,
  Heart,
  ChevronRight,
  Clock,
  Users,
  Shield
} from 'lucide-react-native';
import { Colors } from '../../constant/Colors';
import { width } from '../../utils/responsive';
import WebLayout from '../../components/WebLayout';

export default function QuizListScreen() {
  const quizzes = [
    {
      id: 'gad7',
      title: 'GAD-7 Anxiety Assessment',
      description: 'Generalized Anxiety Disorder 7-item scale to assess anxiety symptoms',
      duration: '2-3 minutes',
      questions: '7 questions',
      icon: Brain,
      color: Colors.PRIMARY,
      route: '/quizzes/GAD7/gad_7Disclaimer'  //Fixed routed to correct path
    },
    {
      id: 'phq9',
      title: 'PHQ-9 Depression Screening',
      description: 'Patient Health Questionnaire to screen for depression symptoms',
      duration: '3-4 minutes',
      questions: '9 questions',
      icon: Heart,
      color: Colors.ERROR,
      route: '/quizzes/PHQ9/phq_9Disclaimer'  //Fixed routed to correct path
    }
  ];

  const features = [
    {
      icon: Shield,
      title: 'Confidential',
      description: 'Your responses are private and secure'
    },
    {
      icon: Users,
      title: 'Professional',
      description: 'Clinically validated assessment tools'
    },
    {
      icon: Clock,
      title: 'Quick',
      description: 'Takes just a few minutes to complete'
    }
  ];

  if (Platform.OS === 'web') {
    return (
      <WebLayout>
        <ScrollView style={styles.webContainer} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.webHeaderSection}>
            <View style={styles.webHeaderContent}>
              <Text style={styles.webHeaderTitle}>Wellness Assessments</Text>
              <Text style={styles.webHeaderSubtitle}>
                Take a moment to check in with your mental health
              </Text>
            </View>
          </View>

          {/* Information */}
          <View style={styles.webSection}>
            <Text style={styles.webSectionTitle}>About These Assessments</Text>
            <Text style={styles.webInfoText}>
              These are evidence-based screening tools used by mental health professionals. 
              They can help you understand your current mental health status and guide you toward appropriate resources.
            </Text>
            
            <View style={styles.webFeaturesGrid}>
              {features.map((feature, index) => (
                <View key={index} style={styles.webFeatureCard}>
                  <View style={styles.webFeatureIcon}>
                    <feature.icon size={20} color={Colors.SECONDARY} />
                  </View>
                  <Text style={styles.webFeatureTitle}>{feature.title}</Text>
                  <Text style={styles.webFeatureDescription}>{feature.description}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Quiz Cards */}
          <View style={styles.webSection}>
            <Text style={styles.webSectionTitle}>Available Assessments</Text>
            <View style={styles.webQuizzesGrid}>
              {quizzes.map((quiz) => (
                <TouchableOpacity
                  key={quiz.id}
                  style={styles.webQuizCard}
                  onPress={() => router.push(quiz.route)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.webQuizIcon, { backgroundColor: quiz.color + '20' }]}>
                    <quiz.icon size={32} color={quiz.color} />
                  </View>
                  
                  <View style={styles.webQuizContent}>
                    <Text style={styles.webQuizTitle}>{quiz.title}</Text>
                    <Text style={styles.webQuizDescription}>{quiz.description}</Text>
                    
                    <View style={styles.webQuizMeta}>
                      <View style={styles.webMetaItem}>
                        <Clock size={16} color="#64748b" />
                        <Text style={styles.webMetaText}>{quiz.duration}</Text>
                      </View>
                      <View style={styles.webMetaItem}>
                        <Brain size={16} color="#64748b" />
                        <Text style={styles.webMetaText}>{quiz.questions}</Text>
                      </View>
                    </View>
                  </View>
                  
                  <ChevronRight size={24} color="#64748b" />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Disclaimer */}
          <View style={styles.webDisclaimerSection}>
            <View style={styles.webDisclaimerCard}>
              <Text style={styles.webDisclaimerTitle}>Important Notice</Text>
              <Text style={styles.webDisclaimerText}>
                These assessments are for educational purposes and should not replace professional medical advice. 
                If you’re experiencing a mental health crisis, please contact the Crisis Text Line (text HOME to 741741) 
                or call 988 for the Suicide and Crisis Lifeline.
              </Text>
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
          <Text style={styles.headerTitle}>Wellness Assessments</Text>
          <View style={styles.headerSpacer} />
        </View>
        <Text style={styles.headerSubtitle}>
          Take a moment to check in with your mental health
        </Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.contentPadding}>
          {/* Information Card */}
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>About These Assessments</Text>
            <Text style={styles.infoText}>
              These are evidence-based screening tools used by mental health professionals. 
              They can help you understand your current mental health status and guide you toward appropriate resources.
            </Text>
            
            <View style={styles.featuresContainer}>
              {features.map((feature, index) => (
                <View key={index} style={styles.featureRow}>
                  <View style={styles.featureIconContainer}>
                    <feature.icon size={20} color={Colors.SECONDARY} />
                  </View>
                  <View style={styles.featureContent}>
                    <Text style={styles.featureTitle}>{feature.title}</Text>
                    <Text style={styles.featureDescription}>{feature.description}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Quiz Cards */}
          <Text style={styles.sectionTitle}>Available Assessments</Text>
          {quizzes.map((quiz) => (
            <TouchableOpacity
              key={quiz.id}
              style={styles.quizCard}
              onPress={() => router.push(quiz.route)}
              activeOpacity={0.8}
            >
              <View style={[styles.quizIconContainer, { backgroundColor: quiz.color + '20' }]}>
                <quiz.icon size={32} color={quiz.color} />
              </View>
              
              <View style={styles.quizContent}>
                <Text style={styles.quizTitle}>{quiz.title}</Text>
                <Text style={styles.quizDescription}>{quiz.description}</Text>
                
                <View style={styles.quizMeta}>
                  <View style={styles.metaItem}>
                    <Clock size={16} color={Colors.GRAY} />
                    <Text style={styles.metaText}>{quiz.duration}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Brain size={16} color={Colors.GRAY} />
                    <Text style={styles.metaText}>{quiz.questions}</Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.quizArrow}>
                <ChevronRight size={24} color={Colors.GRAY} />
              </View>
            </TouchableOpacity>
          ))}

          {/* Disclaimer */}
          <View style={styles.disclaimerCard}>
            <Text style={styles.disclaimerTitle}>Important Notice</Text>
            <Text style={styles.disclaimerText}>
              These assessments are for educational purposes and should not replace professional medical advice. If you’re experiencing a mental health crisis, please contact the Crisis Text Line (text HOME to 741741) or call 988 for the Suicide and Crisis Lifeline.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.LIGHT_GRAY,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 24,
    paddingHorizontal: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: Colors.WHITE + '20',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.WHITE,
  },
  headerSpacer: {
    width: 40,
  },
  headerSubtitle: {
    fontSize: 16,
    color: Colors.LIGHT_GOLD,
    textAlign: 'center',
    marginTop: 8,
  },
  content: {
    flex: 1,
  },
  contentPadding: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  infoCard: {
    backgroundColor: Colors.WHITE,
    borderRadius: 16,
    padding: 24,
    marginTop: 20,
    marginBottom: 24,
    shadowColor: Colors.BLACK,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    borderLeftWidth: 4,
    borderLeftColor: Colors.PRIMARY,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.PRIMARY,
    marginBottom: 12,
  },
  infoText: {
    fontSize: 16,
    color: Colors.DARK_GRAY,
    lineHeight: 24,
    marginBottom: 20,
  },
  featuresContainer: {
    gap: 16,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.SECONDARY + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.PRIMARY,
    marginBottom: 2,
  },
  featureDescription: {
    fontSize: 14,
    color: Colors.GRAY,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.PRIMARY,
    marginBottom: 16,
  },
  quizCard: {
    backgroundColor: Colors.WHITE,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: Colors.BLACK,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quizIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  quizContent: {
    flex: 1,
  },
  quizTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.PRIMARY,
    marginBottom: 6,
  },
  quizDescription: {
    fontSize: 14,
    color: Colors.GRAY,
    lineHeight: 20,
    marginBottom: 12,
  },
  quizMeta: {
    flexDirection: 'row',
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: Colors.GRAY,
    fontWeight: '500',
  },
  quizArrow: {
    marginLeft: 12,
  },
  disclaimerCard: {
    backgroundColor: Colors.WHITE,
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    shadowColor: Colors.BLACK,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: Colors.WARNING,
  },
  disclaimerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.PRIMARY,
    marginBottom: 8,
  },
  disclaimerText: {
    fontSize: 14,
    color: Colors.GRAY,
    lineHeight: 20,
  },
  
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
  webInfoText: {
    fontSize: width < 640 ? 16 : 18,
    color: '#64748b',
    lineHeight: width < 640 ? 24 : 28,
    marginBottom: 40,
    textAlign: 'center',
    maxWidth: 800,
    alignSelf: 'center',
  },
  webFeaturesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: width < 640 ? 16 : width < 1024 ? 20 : 24,
    maxWidth: 1200,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  webFeatureCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: width < 640 ? 16 : width < 1024 ? 20 : 24,
    width: width < 640 ? '100%' : '48%',
    minWidth: width < 640 ? 0 : 250,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
  },
  webFeatureIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.SECONDARY + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  webFeatureTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.PRIMARY,
    marginBottom: 8,
    textAlign: 'center',
  },
  webFeatureDescription: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 20,
  },
  webQuizzesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: width < 640 ? 16 : width < 1024 ? 20 : 24,
    maxWidth: 1200,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  webQuizCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: width < 640 ? 20 : width < 1024 ? 24 : 28,
    width: width < 640 ? '100%' : '48%',
    minWidth: width < 640 ? 0 : 350,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 4,
    gap: 16,
  },
  webQuizIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  webQuizContent: {
    flex: 1,
  },
  webQuizTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.PRIMARY,
    marginBottom: 8,
  },
  webQuizDescription: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
    marginBottom: 12,
  },
  webQuizMeta: {
    flexDirection: 'row',
    gap: 16,
  },
  webMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  webMetaText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  webDisclaimerSection: {
    paddingVertical: 40,
    paddingHorizontal: width < 640 ? 16 : width < 1024 ? 32 : 60,
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },
  webDisclaimerCard: {
    backgroundColor: '#fef3c7',
    borderRadius: 16,
    padding: width < 640 ? 20 : width < 1024 ? 24 : 28,
    borderWidth: 1,
    borderColor: '#fde68a',
    borderLeftWidth: 4,
    borderLeftColor: Colors.WARNING,
  },
  webDisclaimerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#92400e',
    marginBottom: 12,
  },
  webDisclaimerText: {
    fontSize: 14,
    color: '#92400e',
    lineHeight: 20,
  },
});

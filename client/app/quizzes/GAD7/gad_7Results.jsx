import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Home, BarChart, Share2 } from 'lucide-react-native';
import { Colors } from '../../../constant/Colors';

export default function GAD7ResultsScreen() {
  const params = useLocalSearchParams();
  const [score, setScore] = useState(0);
  const [date] = useState(new Date());
  
  useEffect(() => {
    if (params.score) {
      setScore(parseInt(params.score));
    }
  }, [params]);

  const getAnxietyLevel = (score) => {
    if (score >= 0 && score <= 4) return { level: 'Minimal Anxiety', color: Colors.SUCCESS };
    if (score >= 5 && score <= 9) return { level: 'Mild Anxiety', color: Colors.WARNING };
    if (score >= 10 && score <= 14) return { level: 'Moderate Anxiety', color: Colors.ORANGE };
    return { level: 'Severe Anxiety', color: Colors.ERROR };
  };

  const anxietyInfo = getAnxietyLevel(score);

  const getRecommendations = (score) => {
    if (score >= 0 && score <= 4) {
      return [
        'Continue monitoring your mental health',
        'Practice regular self-care activities',
        'Maintain healthy sleep and exercise habits'
      ];
    } else if (score >= 5 && score <= 9) {
      return [
        'Consider speaking with a counselor about your anxiety',
        'Try mindfulness and relaxation techniques',
        'Maintain a regular sleep schedule',
        'Limit caffeine and alcohol consumption'
      ];
    } else if (score >= 10 && score <= 14) {
      return [
        'Schedule an appointment with a mental health professional',
        'Learn and practice anxiety management techniques',
        'Consider joining a support group',
        'Establish a regular exercise routine'
      ];
    } else {
      return [
        'Consult with a mental health professional as soon as possible',
        'Consider reaching out to Cal State LA Counseling Services',
        'Practice grounding techniques for immediate anxiety relief',
        'Ensure you have support from friends, family, or campus resources'
      ];
    }
  };

  const recommendations = getRecommendations(score);

  const saveResult = () => {
    // This would save the result to AsyncStorage or context
    // For now, we'll just navigate back to the home screen
    router.push('/home_screen/home');
  };

  const viewHistory = () => {
    // This would navigate to a history screen
    // For now, we'll just navigate to the profile screen
    router.push('/user_profile/profile');
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
          <Text style={styles.headerTitle}>Assessment Results</Text>
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

          <View style={styles.resultCard}>
            <Text style={styles.resultTitle}>GAD-7 Assessment Results</Text>
            
            <View style={styles.scoreContainer}>
              <View style={[styles.scoreCircle, { borderColor: anxietyInfo.color }]}>
                <Text style={[styles.scoreText, { color: anxietyInfo.color }]}>{score}</Text>
                <Text style={styles.scoreMax}>/21</Text>
              </View>
            </View>
            
            <Text style={[styles.anxietyLevel, { color: anxietyInfo.color }]}>
              {anxietyInfo.level}
            </Text>
            
            <View style={styles.divider} />
            
            <Text style={styles.sectionTitle}>What This Means</Text>
            <Text style={styles.explanationText}>
              {score >= 10 ? 
                'Your responses suggest you may be experiencing significant anxiety symptoms. This is not a diagnosis, but it may be beneficial to discuss these results with a mental health professional.' :
                'Your responses suggest you may be experiencing some anxiety symptoms. While this is not a diagnosis, monitoring your mental health is important.'}
            </Text>
            
            <Text style={styles.sectionTitle}>Recommendations</Text>
            <View style={styles.recommendationsList}>
              {recommendations.map((recommendation, index) => (
                <View key={index} style={styles.recommendationItem}>
                  <View style={[styles.recommendationBullet, { backgroundColor: anxietyInfo.color }]} />
                  <Text style={styles.recommendationText}>{recommendation}</Text>
                </View>
              ))}
            </View>
          </View>
          
          <View style={styles.actionsContainer}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={saveResult}
            >
              <LinearGradient
                colors={[Colors.PRIMARY, Colors.DARK_BLUE]}
                style={styles.actionGradient}
              >
                <Home size={20} color={Colors.WHITE} />
                <Text style={styles.actionText}>Save & Return Home</Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={viewHistory}
            >
              <LinearGradient
                colors={[Colors.SECONDARY, Colors.DARK_GOLD]}
                style={styles.actionGradient}
              >
                <BarChart size={20} color={Colors.WHITE} />
                <Text style={styles.actionText}>View History</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity style={styles.shareButton}>
            <Share2 size={20} color={Colors.PRIMARY} />
            <Text style={styles.shareText}>Share Results with Provider</Text>
          </TouchableOpacity>
          
          <Text style={styles.disclaimerText}>
            Note: This assessment is a screening tool and not a diagnostic instrument. 
            Please consult with a qualified healthcare provider for a proper evaluation.
          </Text>
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
  resultCard: {
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
  resultTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.TEXT,
    textAlign: 'center',
    marginBottom: 20,
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  scoreCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  scoreText: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  scoreMax: {
    fontSize: 16,
    color: Colors.TEXT_SECONDARY,
    marginTop: 5,
  },
  anxietyLevel: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.BORDER,
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.TEXT,
    marginBottom: 10,
  },
  explanationText: {
    fontSize: 16,
    color: Colors.TEXT,
    lineHeight: 22,
    marginBottom: 20,
  },
  recommendationsList: {
    marginBottom: 10,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  recommendationBullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 7,
    marginRight: 10,
  },
  recommendationText: {
    flex: 1,
    fontSize: 16,
    color: Colors.TEXT,
    lineHeight: 22,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 5,
    borderRadius: 10,
    overflow: 'hidden',
  },
  actionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  actionText: {
    color: Colors.WHITE,
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    marginBottom: 20,
  },
  shareText: {
    color: Colors.PRIMARY,
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  disclaimerText: {
    fontSize: 14,
    color: Colors.TEXT_SECONDARY,
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 20,
  },
});
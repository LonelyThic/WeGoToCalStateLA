import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Chrome as Home,
  Calendar,
  Brain,
  BookOpen,
  User,
  MessageCircle,
  Heart,
  TrendingUp,
  Clock,
  MessageSquare,
} from 'lucide-react-native';
import { Colors } from '../../constant/Colors';
import { width } from '../../utils/responsive';
import WebLayout from '../../components/WebLayout';

const quickActions = [
  {
    id: 'daily',
    title: 'Daily Check-in',
    subtitle: 'How are you feeling today?',
    icon: Heart,
    color: Colors.PRIMARY,
    route: 'daily',
  },
  {
    id: 'quiz',
    title: 'Wellness Quiz',
    subtitle: 'Take a wellbeing assessment',
    icon: Brain,
    color: Colors.PRIMARY,
    route: 'quizzes',
  },
  {
    id: 'resources',
    title: 'Resources',
    subtitle: 'Find help and support',
    icon: BookOpen,
    color: Colors.PRIMARY,
    route: 'resources',
  },
  {
    id: 'threads',
    title: 'Threads',
    subtitle: 'Share anonymously',
    icon: MessageSquare,
    color: Colors.SECONDARY,
    route: 'threads',
  },
  {
    id: 'progress',
    title: 'My Progress',
    subtitle: 'Track your wellness journey',
    icon: TrendingUp,
    color: Colors.SECONDARY,
    route: 'profile',
  },
];

export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState('home');

  const navigateToScreen = (screen) => {
    switch (screen) {
      case 'events':
        router.push('/home_screen/events');
        break;
      case 'quizzes':
        router.push('/quizzes/quiz_list');
        break;
      case 'resources':
        router.push('/resources/resource');
        break;
      case 'profile':
        router.push('/profile');
        break;
      case 'daily':
        router.push('/daily_check_in/daily');
        break;
      case 'progress':
        router.push('/daily_check_in/progress');
        break;
      case 'chat':
        router.push('/chat_bot/chatbotui');
        break;
      case 'threads':
        router.push('/threads/feed');
        break;
      default:
        break;
    }
  };

  const webQuickActionsGrid = {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: width < 640 ? 16 : width < 1024 ? 20 : 24,
    justifyContent: 'center',
  };

  const webStyles = {
    webContainer: {
      flex: 1,
      backgroundColor: '#f8fafc',
    },
    webWelcomeSection: {
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
    webWelcomeContent: {
      maxWidth: 1200,
      alignSelf: 'center',
      width: '100%',
      alignItems: 'center',
    },
    webWelcomeTitle: {
      fontSize: width < 640 ? 32 : width < 1024 ? 42 : 56,
      fontWeight: '900',
      color: Colors.PRIMARY,
      textAlign: 'center',
      marginBottom: 16,
      letterSpacing: -1.5,
    },
    webWelcomeSubtitle: {
      fontSize: width < 640 ? 18 : 22,
      fontWeight: '600',
      color: Colors.SECONDARY,
      textAlign: 'center',
      marginBottom: 24,
    },
    webWelcomeDescription: {
      fontSize: width < 640 ? 16 : 18,
      color: '#64748b',
      textAlign: 'center',
      lineHeight: width < 640 ? 24 : 28,
      maxWidth: 600,
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
      textAlign: 'center',
      marginBottom: width < 640 ? 24 : width < 1024 ? 32 : 40,
      letterSpacing: -0.5,
    },
    webQuickActionsGrid,
    webActionCard: {
      backgroundColor: '#f8fafc',
      borderRadius: 16,
      padding: width < 640 ? 20 : width < 1024 ? 24 : 28,
      width: width < 640 ? '100%' : width < 1024 ? '48%' : '23%',
      minWidth: width < 640 ? 0 : 200,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: '#e2e8f0',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.05,
      shadowRadius: 12,
      elevation: 4,
    },
    webActionIcon: {
      width: 60,
      height: 60,
      borderRadius: 30,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 16,
    },
    webActionTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: Colors.PRIMARY,
      textAlign: 'center',
      marginBottom: 8,
    },
    webActionSubtitle: {
      fontSize: 14,
      color: '#64748b',
      textAlign: 'center',
      lineHeight: 20,
    },
    webHighlightCard: {
      backgroundColor: '#f8fafc',
      borderRadius: 16,
      padding: width < 640 ? 24 : width < 1024 ? 28 : 32,
      borderWidth: 1,
      borderColor: '#e2e8f0',
      borderLeftWidth: 4,
      borderLeftColor: Colors.SECONDARY,
      maxWidth: 800,
      alignSelf: 'center',
    },
    webHighlightHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      marginBottom: 16,
    },
    webHighlightTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: Colors.PRIMARY,
    },
    webHighlightText: {
      fontSize: 18,
      color: '#374151',
      lineHeight: 28,
      fontStyle: 'italic',
      marginBottom: 16,
      textAlign: 'center',
    },
    webHighlightAuthor: {
      fontSize: 14,
      color: '#64748b',
      fontWeight: '500',
      textAlign: 'right',
    },
  };

  if (Platform.OS === 'web') {
    return (
      <WebLayout>
        <ScrollView
          style={webStyles.webContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Welcome Section */}
          <View style={webStyles.webWelcomeSection}>
            <View style={webStyles.webWelcomeContent}>
              <Text style={webStyles.webWelcomeTitle}>Welcome Back!</Text>
              <Text style={webStyles.webWelcomeSubtitle}>
                Cal State LA Golden Eagles
              </Text>
              <Text style={webStyles.webWelcomeDescription}>
                Take charge of your mental health with personalized tools and
                resources designed for Cal State LA students.
              </Text>
            </View>
          </View>

          {/* Quick Actions */}
          <View style={webStyles.webSection}>
            <Text style={webStyles.webSectionTitle}>Quick Actions</Text>
            <View style={webStyles.webQuickActionsGrid}>
              {quickActions.map((action) => (
                <TouchableOpacity
                  key={action.id}
                  style={webStyles.webActionCard}
                  onPress={() => navigateToScreen(action.route)}
                  activeOpacity={0.8}
                >
                  <View
                    style={[
                      webStyles.webActionIcon,
                      { backgroundColor: action.color + '20' },
                    ]}
                  >
                    <action.icon size={28} color={action.color} />
                  </View>
                  <Text style={webStyles.webActionTitle}>{action.title}</Text>
                  <Text style={webStyles.webActionSubtitle}>
                    {action.subtitle}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Today's Highlight */}
          <View style={webStyles.webSection}>
            <Text style={webStyles.webSectionTitle}>Today’s Focus</Text>
            <View style={webStyles.webHighlightCard}>
              <View style={webStyles.webHighlightHeader}>
                <Clock size={20} color={Colors.SECONDARY} />
                <Text style={webStyles.webHighlightTitle}>
                  Daily Inspiration
                </Text>
              </View>
              <Text style={webStyles.webHighlightText}>
                “Mental health is not a destination, but a process. It’s about
                how you drive, not where you’re going.”
              </Text>
              <Text style={webStyles.webHighlightAuthor}>
                - Noam Shpancer
              </Text>
            </View>
          </View>
        </ScrollView>
      </WebLayout>
    );
  }

  const TabButton = ({ icon: Icon, label, isActive, onPress }) => (
    <TouchableOpacity
      style={[styles.tabButton, isActive && styles.activeTabButton]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Icon size={24} color={isActive ? Colors.WHITE : Colors.BLACK} />
      <Text style={[styles.tabLabel, isActive && styles.activeTabLabel]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={[Colors.PRIMARY, Colors.DARK_BLUE]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Welcome Back!</Text>
          <Text style={styles.headerSubtitle}>Cal State LA Golden Eagles</Text>
        </View>
      </LinearGradient>

      {/* Main Content */}
      <ScrollView
        style={styles.mainContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentPadding}>
          {/* Welcome Card */}
          <View style={styles.welcomeCard}>
            <Text style={styles.welcomeTitle}>Your Wellness Journey</Text>
            <Text style={styles.welcomeText}>
              Connecting you to the Cal State LA community, events, and essential resources.
            </Text>
          </View>

          {/* Student Login Button */}
          <TouchableOpacity
            style={styles.studentLoginButton}
            onPress={() => router.push('/authentication/login')}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[Colors.PRIMARY, Colors.SECONDARY]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.studentLoginButtonGradient}
            >
              <Text style={styles.studentLoginButtonText}>Student Login</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Quick Actions */}
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={styles.actionCard}
                onPress={() => navigateToScreen(action.route)}
                activeOpacity={0.8}
              >
                <View
                  style={[
                    styles.actionIconContainer,
                    { backgroundColor: action.color + '20' },
                  ]}
                >
                  <action.icon size={28} color={action.color} />
                </View>
                <Text style={styles.actionTitle}>{action.title}</Text>
                <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Today's Highlight */}
          <View style={styles.highlightCard}>
            <View style={styles.highlightHeader}>
              <Clock size={20} color={Colors.SECONDARY} />
              <Text style={styles.highlightTitle}>Today’s Focus</Text>
            </View>
            <Text style={styles.highlightText}>
              “Mental health is not a destination, but a process. It’s about how
              you drive, not where you’re going.”
            </Text>
            <View style={styles.highlightFooter}>
              <Text style={styles.highlightAuthor}>- Noam Shpancer</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Floating Chatbot Button */}
      <TouchableOpacity
        style={styles.chatButton}
        onPress={() => navigateToScreen('chat')}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={[Colors.SECONDARY, Colors.DARK_GOLD]}
          style={styles.chatButtonGradient}
        >
          <MessageCircle size={28} color={Colors.BLACK} />
        </LinearGradient>
      </TouchableOpacity>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <LinearGradient
          colors={[Colors.PRIMARY, Colors.DARK_BLUE]}
          style={styles.navGradient}
        >
          <View style={styles.tabContainer}>
            <TabButton
              icon={Home}
              label="Home"
              isActive={activeTab === 'home'}
              onPress={() => setActiveTab('home')}
            />
            <TabButton
              icon={Calendar}
              label="Events"
              isActive={activeTab === 'events'}
              onPress={() => {
                setActiveTab('events');
                navigateToScreen('events');
              }}
            />
            <TabButton
              icon={Brain}
              label="Quizzes"
              isActive={activeTab === 'quizzes'}
              onPress={() => {
                setActiveTab('quizzes');
                navigateToScreen('quizzes');
              }}
            />
            <TabButton
              icon={MessageSquare}
              label="Threads"
              isActive={activeTab === 'threads'}
              onPress={() => {
                setActiveTab('threads');
                navigateToScreen('threads');
              }}
            />
            <TabButton
              icon={BookOpen}
              label="Resources"
              isActive={activeTab === 'resources'}
              onPress={() => {
                setActiveTab('resources');
                navigateToScreen('resources');
              }}
            />
            <TabButton
              icon={User}
              label="Profile"
              isActive={activeTab === 'profile'}
              onPress={() => {
                setActiveTab('profile');
                navigateToScreen('profile');
              }}
            />
          </View>
        </LinearGradient>
      </View>
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
    paddingBottom: 25,
    paddingHorizontal: 20,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.WHITE,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: Colors.LIGHT_GOLD,
    fontWeight: '500',
  },
  mainContent: {
    flex: 1,
  },
  contentPadding: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  welcomeCard: {
    backgroundColor: Colors.WHITE,
    borderRadius: 16,
    padding: 24,
    marginTop: 20,
    marginBottom: 30,
    shadowColor: Colors.BLACK,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    borderLeftWidth: 4,
    borderLeftColor: Colors.SECONDARY,
  },
  studentLoginButton: {
    marginTop: 20,
    marginBottom: 30,
    borderRadius: 16,
    overflow: 'hidden',
    width: '100%',
    alignSelf: 'center',
  },
  studentLoginButtonGradient: {
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  studentLoginButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.WHITE,
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.PRIMARY,
    marginBottom: 12,
  },
  welcomeText: {
    fontSize: 16,
    color: Colors.BLACK,
    lineHeight: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.PRIMARY,
    marginBottom: 16,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  actionCard: {
    backgroundColor: Colors.WHITE,
    borderRadius: 16,
    padding: 20,
    width: (width - 60) / 2,
    marginBottom: 16,
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
  actionIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.PRIMARY,
    textAlign: 'center',
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 12,
    color: Colors.BLACK,
    textAlign: 'center',
    lineHeight: 16,
  },
  highlightCard: {
    backgroundColor: Colors.WHITE,
    borderRadius: 16,
    padding: 20,
    shadowColor: Colors.BLACK,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: Colors.PRIMARY,
  },
  highlightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  highlightTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.PRIMARY,
    marginLeft: 8,
  },
  highlightText: {
    fontSize: 16,
    color: Colors.DARK_GRAY,
    lineHeight: 24,
    fontStyle: 'italic',
    marginBottom: 12,
  },
  highlightFooter: {
    alignItems: 'flex-end',
  },
  highlightAuthor: {
    fontSize: 14,
    color: Colors.GRAY,
    fontWeight: '500',
  },
  chatButton: {
    position: 'absolute',
    right: 20,
    bottom: 110,
    width: 60,
    height: 60,
    borderRadius: 30,
    shadowColor: Colors.BLACK,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  chatButtonGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  navGradient: {
    paddingTop: 12,
    paddingBottom: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tabButton: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    minWidth: 60,
  },
  activeTabButton: {
    backgroundColor: Colors.LIGHT_BLUE + '30',
  },
  tabLabel: {
    fontSize: 12,
    color: Colors.BLACK,
    marginTop: 4,
    fontWeight: '500',
  },
  activeTabLabel: {
    color: Colors.WHITE,
    fontWeight: 'bold',
  },
});

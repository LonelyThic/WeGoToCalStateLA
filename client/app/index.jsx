 
import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Platform,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withDelay
} from 'react-native-reanimated';
import { Heart, Brain, Users, Shield, Sparkles, ArrowRight, CircleCheck as CheckCircle, Phone, MapPin, GraduationCap, Clock, UserCheck } from 'lucide-react-native';
import { Colors } from '../constant/Colors';
import { responsive, width } from '../utils/responsive';
import WebLayout from '../components/WebLayout';



export default function LandingPage() {
  if (Platform.OS === 'web') {
    return <WebLandingPage />;
  }
  return <MobileSplashScreen />;
}

function WebLandingPage() {
  const features = [
    {
      icon: Heart,
      title: 'Daily Wellness Check-ins',
      description: 'Track your mental health with personalized daily assessments and mood monitoring.',
      color: '#ef4444',
    },
    {
      icon: Brain,
      title: 'Professional Assessments',
      description: 'Access validated mental health screening tools like PHQ-9 and GAD-7.',
      color: Colors.PRIMARY,
    },
    {
      icon: Users,
      title: 'Campus Community',
      description: 'Connect with fellow Golden Eagles and participate in wellness events.',
      color: '#06b6d4',
    },
    {
      icon: Shield,
      title: 'Privacy & Security',
      description: 'Your mental health data is protected with enterprise-grade security.',
      color: '#10b981',
    },
  ];

  const campusResources = [
    {
      icon: Phone,
      title: 'Crisis Support',
      description: 'Immediate help available 24/7',
      contact: '988 or (323) 343-3700',
      color: '#ef4444',
    },
    {
      icon: Users,
      title: 'Counseling Services',
      description: 'Professional mental health support',
      contact: '(323) 343-3371',
      color: '#ffffff',
    },
    {
      icon: Heart,
      title: 'Student Health Center',
      description: 'Comprehensive health services',
      contact: '(323) 343-3300',
      color: '#10b981',
    },
  ];

  const navigateToApp = () => {
    router.push('/home_screen/home');
  };

  const navigateToLogin = () => {
    router.push('/authentication/login');
  };

  return (
    <WebLayout>
      <ScrollView style={styles.webContainer} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.heroContent}>
            <View style={styles.heroText}>
              <View style={styles.badgeContainer}>
                <GraduationCap size={16} color={Colors.PRIMARY} />
                <Text style={styles.badgeText}>Cal State LA Student Wellness</Text>
              </View>
              
              <Text style={styles.heroTitle}>
                Supporting Golden Eagles{'\n'}
                <Text style={styles.heroTitleAccent}>Community & Engagement</Text>
              </Text>
              
              <Text style={styles.heroDescription}>
                Your central hub for Cal State LA. Discover events, connect with the community, and access essential resources for students and families.
              </Text>
              
              <View style={styles.heroButtons}>
                <TouchableOpacity style={styles.primaryButton} onPress={navigateToApp}>
                  <Text style={styles.primaryButtonText}>Access Wellness Tools</Text>
                  <ArrowRight size={20} color={Colors.PRIMARY} />
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.secondaryButton} onPress={navigateToLogin}>
                  <Text style={styles.secondaryButtonText}>Student Login</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.trustIndicators}>
                <View style={styles.trustItem}>
                  <Shield size={16} color={Colors.SUCCESS} />
                  <Text style={styles.trustText}>Confidential & Secure</Text>
                </View>
                <View style={styles.trustItem}>
                  <UserCheck size={16} color={Colors.SUCCESS} />
                  <Text style={styles.trustText}>For Cal State LA Students</Text>
                </View>
                <View style={styles.trustItem}>
                  <CheckCircle size={16} color={Colors.SUCCESS} />
                  <Text style={styles.trustText}>Always Free</Text>
                </View>
              </View>
            </View>
            
            <View style={styles.heroVisual}>
              <View style={styles.heroImageContainer}>
                <Image
                  source={{ uri: 'https://images.pexels.com/photos/7176026/pexels-photo-7176026.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop' }}
                  style={styles.heroImage}
                />
                <View style={styles.heroOverlay}>
                  <View style={styles.heroCard}>
                    <View style={styles.heroCardHeader}>
                      <Heart size={24} color={Colors.PRIMARY} />
                      <Text style={styles.heroCardTitle}>Wellness Check-in</Text>
                    </View>
                    <Text style={styles.heroCardDescription}>
                      Track your daily mental health
                    </Text>
                    <View style={styles.moodOptions}>
                      {['😊', '😐', '😔'].map((emoji, index) => (
                        <TouchableOpacity key={index} style={styles.moodOption}>
                          <Text style={styles.moodEmoji}>{emoji}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Campus Resources Section */}
        <View style={styles.resourcesSection}>
          <View style={styles.resourcesContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Campus Mental Health Resources</Text>
              <Text style={styles.sectionDescription}>
                Professional support services available to all Cal State LA students
              </Text>
            </View>
            
            <View style={styles.resourcesGrid}>
              {campusResources.map((resource, index) => {
                const IconComponent = resource.icon;
                return (
                  <View key={index} style={styles.resourceCard}>
                    <View style={[styles.resourceIcon, { backgroundColor: resource.color + '15' }]}>
                      <IconComponent size={32} color={resource.color} />
                    </View>
                    <Text style={styles.resourceTitle}>{resource.title}</Text>
                    <Text style={styles.resourceDescription}>{resource.description}</Text>
                    <Text style={styles.resourceContact}>{resource.contact}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        </View>

        {/* Features Section */}
        <View style={styles.featuresSection}>
          <View style={styles.featuresContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Comprehensive Mental Health Tools</Text>
              <Text style={styles.sectionDescription}>
                Evidence-based tools and resources designed for student mental wellness
              </Text>
            </View>
            
            <View style={styles.featuresGrid}>
              {features.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <View key={index} style={styles.featureCard}>
                    <View style={[styles.featureIcon, { backgroundColor: feature.color + '15' }]}>
                      <IconComponent size={32} color={feature.color} />
                    </View>
                    <Text style={styles.featureTitle}>{feature.title}</Text>
                    <Text style={styles.featureDescription}>{feature.description}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        </View>

        {/* About Section */}
        <View style={styles.aboutSection}>
          <View style={styles.aboutContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>About WeGo Mental Health Platform</Text>
              <Text style={styles.sectionDescription}>
                Developed specifically for California State University, Los Angeles students
              </Text>
            </View>
            
            <View style={styles.aboutGrid}>
              <View style={styles.aboutCard}>
                <GraduationCap size={48} color={Colors.PRIMARY} />
                <Text style={styles.aboutCardTitle}>Student-Focused</Text>
                <Text style={styles.aboutCardDescription}>
                  Designed specifically for the unique challenges and needs of Cal State LA students, 
                  from academic stress to life transitions.
                </Text>
              </View>
              
              <View style={styles.aboutCard}>
                <Brain size={48} color={Colors.PRIMARY} />
                <Text style={styles.aboutCardTitle}>Evidence-Based</Text>
                <Text style={styles.aboutCardDescription}>
                  Built on clinically validated assessment tools and evidence-based mental health practices 
                  used by professionals worldwide.
                </Text>
              </View>
              
              <View style={styles.aboutCard}>
                <Clock size={48} color={Colors.PRIMARY} />
                <Text style={styles.aboutCardTitle}>Always Available</Text>
                <Text style={styles.aboutCardDescription}>
                  Access mental health resources and support 24/7, whether you’re on campus, 
                  at home, or anywhere you need support.
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* CTA Section */}
        <View style={styles.ctaSection}>
          <View style={styles.ctaContainer}>
            <View style={styles.ctaContent}>
              <Heart size={48} color={Colors.PRIMARY} />
              <Text style={styles.ctaTitle}>Take the First Step Toward Better Mental Health</Text>
              <Text style={styles.ctaDescription}>
                Your mental health matters. Start your wellness journey today with tools and resources 
                designed specifically for Golden Eagles.
              </Text>
              <View style={styles.ctaButtons}>
                <TouchableOpacity style={styles.ctaPrimaryButton} onPress={navigateToApp}>
                  <Text style={styles.ctaPrimaryButtonText}>Begin Wellness Journey</Text>
                  <ArrowRight size={20} color={Colors.PRIMARY} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.ctaSecondaryButton} onPress={navigateToLogin}>
                  <Text style={styles.ctaSecondaryButtonText}>Student Login</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.ctaNote}>Free for all Cal State LA students • Confidential & Secure</Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.footerContainer}>
            <View style={styles.footerContent}>
              <View style={styles.footerBrand}>
                <View style={styles.footerLogo}>
                  <Sparkles size={24} color={Colors.PRIMARY} />
                </View>
                <Text style={styles.footerBrandText}>WeGoToCalStateLA</Text>
                <Text style={styles.footerBrandSubtext}>
                  Your Hub for Cal State LA Community & Resources
                </Text>
              </View>
              
              <View style={styles.footerLinks}>
                <View style={styles.footerColumn}>
                  <Text style={styles.footerColumnTitle}>Platform</Text>
                  <TouchableOpacity style={styles.footerLink}>
                    <Text style={styles.footerLinkText}>Daily Check-ins</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.footerLink}>
                    <Text style={styles.footerLinkText}>Assessments</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.footerLink}>
                    <Text style={styles.footerLinkText}>Campus Resources</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.footerLink}>
                    <Text style={styles.footerLinkText}>AI Assistant</Text>
                  </TouchableOpacity>
                </View>
                
                <View style={styles.footerColumn}>
                  <Text style={styles.footerColumnTitle}>Support</Text>
                  <TouchableOpacity style={styles.footerLink}>
                    <Text style={styles.footerLinkText}>Crisis Resources</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.footerLink}>
                    <Text style={styles.footerLinkText}>Counseling Services</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.footerLink}>
                    <Text style={styles.footerLinkText}>Student Health Center</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.footerLink}>
                    <Text style={styles.footerLinkText}>Privacy Policy</Text>
                  </TouchableOpacity>
                </View>
                
                <View style={styles.footerColumn}>
                  <Text style={styles.footerColumnTitle}>Emergency Contact</Text>
                  <View style={styles.contactItem}>
                    <Phone size={16} color="#64748b" />
                    <Text style={styles.contactText}>Crisis: 988</Text>
                  </View>
                  <View style={styles.contactItem}>
                    <Phone size={16} color="#64748b" />
                    <Text style={styles.contactText}>Campus: (323) 343-3700</Text>
                  </View>
                  <View style={styles.contactItem}>
                    <MapPin size={16} color="#64748b" />
                    <Text style={styles.contactText}>5151 State University Dr, LA</Text>
                  </View>
                </View>
              </View>
            </View>
            
            <View style={styles.footerBottom}>
              <Text style={styles.footerCopyright}>
                © 2025 California State University, Los Angeles. All rights reserved.
              </Text>
              <View style={styles.footerBottomLinks}>
                <TouchableOpacity>
                  <Text style={styles.footerBottomLink}>Terms of Service</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                  <Text style={styles.footerBottomLink}>Privacy Policy</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                  <Text style={styles.footerBottomLink}>Accessibility</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </WebLayout>
  );
}

function MobileSplashScreen() {
   const logoScale = useSharedValue(0);
   const cardOpacity = useSharedValue(0);
   const buttonScale = useSharedValue(0);

   useEffect(() => {
     logoScale.value = withSpring(1, { duration: 800 });
     cardOpacity.value = withDelay(300, withSpring(1, { duration: 600 }));
     buttonScale.value = withDelay(600, withSpring(1, { duration: 500 }));
   }, [logoScale, cardOpacity, buttonScale]);

   const logoAnimatedStyle = useAnimatedStyle(() => ({
     transform: [{ scale: logoScale.value }],
   }));

   const cardAnimatedStyle = useAnimatedStyle(() => ({
     opacity: cardOpacity.value,
   }));

   const buttonAnimatedStyle = useAnimatedStyle(() => ({
     transform: [{ scale: buttonScale.value }],
   }));

   const handleEnterApp = () => {
     // Navigate directly to the login screen on mobile
     router.push('/home_screen/home');
   };

   return (
     <SafeAreaView style={styles.container}>
       <LinearGradient
         colors={[Colors.PRIMARY, Colors.SECONDARY]}
         start={{ x: 0, y: 0 }}
         end={{ x: 1, y: 1 }}
         style={styles.gradient}
       >
         <View style={styles.content}>
           <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
             <Image
               source={{ uri: 'https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg' }}
               style={styles.logo}
             />
           </Animated.View>

           <Animated.View style={[styles.card, cardAnimatedStyle]}>
             <Text style={styles.title}>WeGoToCalStateLA</Text>
             <Text style={styles.subtitle}>Cal State LA Wellbeing Platform</Text>
             <Text style={styles.description}>
                          Connecting families of Cal State LA students to community, events, and essential resources.
                        </Text>
             
             <Animated.View style={buttonAnimatedStyle}>
               <TouchableOpacity 
                 style={styles.enterButton}
                 onPress={handleEnterApp}
                 activeOpacity={0.8}
               >
                 <Text style={styles.enterButtonText}>Enter App</Text>
               </TouchableOpacity>
             </Animated.View>


           </Animated.View>
         </View>
       </LinearGradient>
     </SafeAreaView>
   );
 }

const styles = StyleSheet.create({
  // Web Landing Page Styles
  webContainer: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  
  // Hero Section
  heroSection: {
    paddingVertical: responsive({ xs: 60, md: 80, lg: 120 }),
    paddingHorizontal: responsive({ xs: 16, md: 32, lg: 60 }),
    backgroundColor: 'white',
    marginHorizontal: responsive({ xs: 16, md: 24, lg: 32 }),
    marginBottom: responsive({ xs: 16, md: 20, lg: 24 }),
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  heroContent: {
    flexDirection: responsive({ xs: 'column', lg: 'row' }),
    alignItems: 'center',
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
    gap: responsive({ xs: 40, md: 60, lg: 80 }),
  },
  heroText: {
    flex: 1,
    alignItems: responsive({ xs: 'center', lg: 'flex-start' }),
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.SECONDARY_500,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 32,
    gap: 8,
  },
  badgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.PRIMARY,
  },
  heroTitle: {
    fontSize: width < 640 ? 36 : width < 1024 ? 48 : 64,
    fontWeight: '900',
    color: '#1e293b',
    lineHeight: width < 640 ? 44 : width < 1024 ? 56 : 72,
    marginBottom: 32,
    letterSpacing: -2,
    textAlign: width < 1024 ? 'center' : 'left',
  },
  heroTitleAccent: {
    color: Colors.PRIMARY,
  },
  heroDescription: {
    fontSize: width < 640 ? 18 : 22,
    color: '#64748b',
    textAlign: width < 1024 ? 'center' : 'left',
    lineHeight: width < 640 ? 28 : 34,
    marginBottom: 48,
    fontWeight: '400',
  },
  heroButtons: {
    flexDirection: width < 640 ? 'column' : 'row',
    gap: 20,
    marginBottom: 48,
    width: width < 640 ? '100%' : 'auto',
  },
  primaryButton: {
    backgroundColor: Colors.SECONDARY_900,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 18,
    borderRadius: 12,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: Colors.PRIMARY,
    fontSize: 18,
    fontWeight: '700',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#e2e8f0',
    paddingHorizontal: 32,
    paddingVertical: 18,
    borderRadius: 12,
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: '#475569',
    fontSize: 18,
    fontWeight: '600',
  },
  trustIndicators: {
    flexDirection: width < 640 ? 'column' : 'row',
    gap: width < 640 ? 16 : 32,
    alignItems: 'center',
  },
  trustItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  trustText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  
  // Hero Visual
  heroVisual: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    display: width < 768 ? 'none' : 'flex',
  },
  heroImageContainer: {
    position: 'relative',
    width: width < 1024 ? 400 : 500,
    height: width < 1024 ? 320 : 400,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.15,
    shadowRadius: 40,
    elevation: 20,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    position: 'absolute',
    bottom: 24,
    left: 24,
    right: 24,
  },
  heroCard: {
    backgroundColor: Colors.SECONDARY_500,
    borderRadius: 16,
    padding: 24,
    backdropFilter: 'blur(10px)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  heroCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  heroCardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.PRIMARY,
  },
  heroCardDescription: {
    fontSize: 16,
    color: Colors.TEXT_SECONDARY,
    marginBottom: 20,
  },
  moodOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  moodOption: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e2e8f0',
  },
  moodEmoji: {
    fontSize: 24,
  },
  
  // Campus Resources Section
  resourcesSection: {
    paddingVertical: width < 640 ? 60 : 80,
    backgroundColor: 'white',
    marginHorizontal: width < 640 ? 16 : width < 1024 ? 24 : 32,
    marginBottom: width < 640 ? 16 : width < 1024 ? 20 : 24,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  resourcesContainer: {
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
    paddingHorizontal: width < 640 ? 16 : 32,
  },
  resourcesGrid: {
    flexDirection: width < 640 ? 'column' : 'row',
    gap: width < 640 ? 24 : 40,
    justifyContent: 'center',
  },
  resourceCard: {
    backgroundColor: Colors.SECONDARY_700,
    borderRadius: 16,
    padding: 32,
    flex: 1,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 4,
  },
  resourceIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  resourceTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.PRIMARY,
    marginBottom: 12,
    textAlign: 'center',
  },
  resourceDescription: {
    fontSize: 16,
    color: Colors.TEXT_SECONDARY,
    lineHeight: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  resourceContact: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.PRIMARY,
    textAlign: 'center',
  },
  
  // Features Section
  featuresSection: {
    paddingVertical: width < 640 ? 80 : 120,
    backgroundColor: 'white',
    marginHorizontal: width < 640 ? 16 : width < 1024 ? 24 : 32,
    marginBottom: width < 640 ? 16 : width < 1024 ? 20 : 24,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  featuresContainer: {
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
    paddingHorizontal: width < 640 ? 16 : 32,
  },
  sectionHeader: {
    alignItems: 'center',
    marginBottom: 80,
  },
  sectionTitle: {
    fontSize: width < 640 ? 32 : 48,
    fontWeight: '900',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: 24,
    letterSpacing: -1,
  },
  sectionDescription: {
    fontSize: 20,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 32,
    maxWidth: 600,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 40,
    justifyContent: 'center',
  },
  featureCard: {
    backgroundColor: Colors.SECONDARY_700,
    borderRadius: 20,
    padding: 40,
    width: width < 640 ? '100%' : width < 1024 ? '45%' : '45%',
    minWidth: width < 640 ? 0 : 320,
    maxWidth: 480,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 24,
    elevation: 8,
  },
  featureIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  featureTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.PRIMARY,
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  featureDescription: {
    fontSize: 16,
    color: Colors.TEXT_SECONDARY,
    lineHeight: 26,
  },
  
  // About Section
  aboutSection: {
    paddingVertical: width < 640 ? 80 : 120,
    backgroundColor: 'white',
    marginHorizontal: width < 640 ? 16 : width < 1024 ? 24 : 32,
    marginBottom: width < 640 ? 16 : width < 1024 ? 20 : 24,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  aboutContainer: {
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
    paddingHorizontal: width < 640 ? 16 : 32,
  },
  aboutGrid: {
    flexDirection: width < 768 ? 'column' : 'row',
    gap: 40,
    justifyContent: 'center',
  },
  aboutCard: {
    flex: 1,
    backgroundColor: Colors.SECONDARY_700,
    borderRadius: 20,
    padding: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 24,
    elevation: 8,
    maxWidth: width < 768 ? '100%' : 380,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
  },
  aboutCardTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.PRIMARY,
    marginTop: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  aboutCardDescription: {
    fontSize: 16,
    color: Colors.TEXT_SECONDARY,
    lineHeight: 26,
    textAlign: 'center',
  },
  
  // CTA Section
  ctaSection: {
    paddingVertical: width < 640 ? 80 : 120,
    backgroundColor: '#1e293b',
    marginHorizontal: width < 640 ? 16 : width < 1024 ? 24 : 32,
    marginBottom: width < 640 ? 16 : width < 1024 ? 20 : 24,
    borderRadius: 12,
  },
  ctaContainer: {
    maxWidth: 800,
    alignSelf: 'center',
    width: '100%',
    paddingHorizontal: width < 640 ? 16 : 32,
  },
  ctaContent: {
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: width < 640 ? 32 : 48,
    fontWeight: '900',
    color: Colors.PRIMARY,
    textAlign: 'center',
    marginTop: 24,
    marginBottom: 24,
    letterSpacing: -1,
  },
  ctaDescription: {
    fontSize: 20,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 32,
    marginBottom: 48,
  },
  ctaButtons: {
    flexDirection: width < 640 ? 'column' : 'row',
    gap: 20,
    marginBottom: 24,
    width: width < 640 ? '100%' : 'auto',
  },
  ctaPrimaryButton: {
    backgroundColor: Colors.SECONDARY_900,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 18,
    borderRadius: 12,
    gap: 12,
    shadowColor: Colors.BLACK_OPACITY_20,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 10,
  },
  ctaPrimaryButtonText: {
    color: Colors.PRIMARY,
  },
  ctaSecondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#475569',
    paddingHorizontal: 40,
    paddingVertical: 18,
    borderRadius: 12,
    justifyContent: 'center',
  },
  ctaSecondaryButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  ctaNote: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
  },
  
  // Footer
  footer: {
    backgroundColor: '#0f172a',
    paddingVertical: width < 640 ? 60 : 80,
    marginHorizontal: width < 640 ? 16 : width < 1024 ? 24 : 32,
    borderRadius: 12,
  },
  footerContainer: {
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
    paddingHorizontal: width < 640 ? 16 : 32,
  },
  footerContent: {
    flexDirection: width < 768 ? 'column' : 'row',
    gap: width < 768 ? 40 : 80,
    marginBottom: 60,
  },
  footerBrand: {
    flex: 1,
    maxWidth: width < 768 ? '100%' : 300,
    alignItems: width < 768 ? 'center' : 'flex-start',
  },
  footerLogo: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: Colors.PRIMARY + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  footerBrandText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  footerBrandSubtext: {
    fontSize: 16,
    color: '#94a3b8',
    lineHeight: 24,
    textAlign: width < 768 ? 'center' : 'left',
  },
  footerLinks: {
    flexDirection: width < 768 ? 'column' : 'row',
    gap: width < 768 ? 32 : 80,
    flex: 2,
  },
  footerColumn: {
    flex: 1,
    alignItems: width < 768 ? 'center' : 'flex-start',
  },
  footerColumnTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 20,
  },
  footerLink: {
    marginBottom: 12,
  },
  footerLinkText: {
    fontSize: 14,
    color: '#94a3b8',
    fontWeight: '500',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  contactText: {
    fontSize: 14,
    color: '#94a3b8',
    fontWeight: '500',
  },
  footerBottom: {
    flexDirection: width < 768 ? 'column' : 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 40,
    borderTopWidth: 1,
    borderTopColor: '#334155',
    gap: width < 768 ? 16 : 0,
  },
  footerCopyright: {
    fontSize: 14,
    color: '#64748b',
    textAlign: width < 768 ? 'center' : 'left',
  },
  footerBottomLinks: {
    flexDirection: 'row',
    gap: 32,
  },
  footerBottomLink: {
    fontSize: 14,
    color: '#94a3b8',
    fontWeight: '500',
  },
  
  // Mobile Splash Screen Styles
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logoContainer: {
    marginBottom: 40,
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: Colors.WHITE,
  },
  card: {
    backgroundColor: Colors.WHITE,
    borderRadius: 20,
    padding: 30,
    marginHorizontal: 20,
    alignItems: 'center',
    shadowColor: Colors.BLACK,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 15,
    maxWidth: width * 0.9,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.PRIMARY,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: Colors.DARK_BLUE,
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: '600',
  },
  description: {
    fontSize: 16,
    color: Colors.GRAY,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  enterButton: {
    backgroundColor: Colors.SECONDARY,
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 30,
    shadowColor: Colors.BLACK,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
    marginBottom: 20,
  },
  enterButtonText: {
    color: Colors.PRIMARY,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  demoNote: {
    fontSize: 14,
    color: Colors.PRIMARY,
    fontStyle: 'italic',
  },
});
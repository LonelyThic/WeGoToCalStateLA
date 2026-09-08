import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, SafeAreaView, KeyboardAvoidingView, ActivityIndicator } from 'react-native';
import WebLayout from '../../components/WebLayout';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Sparkles, ArrowLeft, GraduationCap, Shield, CheckCircle, User, Mail, Lock, Eye, EyeOff } from 'lucide-react-native';
import Colors from '../../constant/Colors';
import { useAuth } from '../../context/AuthContext';
import { initiateGoogleLogin, checkAuth, signupWithEmail, loginWithEmail } from '../../services/authService';

import { isWeb, width } from '../../utils/responsive';


export default function SignupScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSignup = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      await signupWithEmail(email.trim(), password);
      await loginWithEmail(email.trim(), password);

      const userData = await checkAuth();

      if (userData && userData.userId) {
        login(userData);
        router.push('/home_screen/home');
      } else {
        setErrorMessage('Account created but failed to load user data.');
      }
    } catch (err) {
      if (err.status === 400 && err.data) {
        const messages = Object.values(err.data).join('\n');
        setErrorMessage(messages);
      } else if (err.status === 409) {
        const msg = 'An account with this email already exists.';
        setErrorMessage(msg);
      } else {
        const msg = 'An unexpected error occurred. Please try again.';
        setErrorMessage(msg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      setOauthLoading(true);

      await initiateGoogleLogin();
    } catch (error) {
      console.error('OAuth error:', error);
      Alert.alert('Error', 'An error occurred during sign-up. Please try again.');
    } finally {
      setOauthLoading(false);
    }
  };



  return isWeb ? (
    <WebLayout>
      <View style={styles.webMainContent}>
        {/* Left Side - Branding */}
        <View style={styles.webLeftSide}>
          <View style={styles.brandingSection}>
            <View style={styles.universityLogo}>
              <GraduationCap size={80} color={Colors.PRIMARY} />
            </View>
            <Text style={styles.universityTitle}>Cal State LA</Text>
            <Text style={styles.universitySubtitle}>Cal State LA Wellbeing Platform</Text>
            <Text style={styles.universityDescription}>
              Connecting families of Cal State LA students to community, events, and essential resources.
            </Text>

            <View style={styles.trustFeatures}>

              <View style={styles.trustFeature}>
                <CheckCircle size={20} color={Colors.SUCCESS} />
                <Text style={styles.trustFeatureText}>University Approved</Text>
              </View>

              <View style={styles.trustFeature}>
                <User size={20} color={Colors.SUCCESS} />
                <Text style={styles.trustFeatureText}>Free for Students</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Right Side - Signup Form */}
        <View style={styles.webRightSide}>
          <View style={styles.loginFormContainer}>
            <View style={styles.formHeader}>
              <Text style={styles.formTitle}>Create Your Account</Text>
              <Text style={styles.formSubtitle}>Sign up to get started with WeGo</Text>
            </View>

            {/* Google Sign Up */}
            <View style={styles.socialContainer}>
              <TouchableOpacity
                style={[styles.googleAltButton, oauthLoading && styles.buttonDisabled]}
                onPress={handleGoogleSignup}
                activeOpacity={0.85}
                disabled={oauthLoading}
              >
                {oauthLoading ? (
                  <ActivityIndicator color={Colors.PRIMARY} />
                ) : (
                  <View style={styles.googleButtonContent}>
                    <View style={styles.googleIconWrapper}>
                      <Text style={styles.googleIconText}>G</Text>
                    </View>
                    <Text style={styles.googleAltButtonText}>Sign up with Google</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            {/* Divider */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Optional email sign-up placeholders (not wired) */}
            <View style={styles.loginForm}>
              <View style={styles.inputContainer}>
                <View style={styles.inputIconContainer}>
                  <Mail size={20} color="#9CA3AF" />
                </View>
                <TextInput
                  style={styles.textInput}
                  placeholder="Email Address / Username"
                  placeholderTextColor="#9CA3AF"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
              <View style={styles.inputContainer}>
                <View style={styles.inputIconContainer}>
                  <Lock size={20} color="#9CA3AF" />
                </View>
                <TextInput
                  style={styles.textInput}
                  placeholder="Password"
                  placeholderTextColor="#9CA3AF"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  style={styles.passwordToggle}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff size={20} color="#9CA3AF" />
                  ) : (
                    <Eye size={20} color="#9CA3AF" />
                  )}
                </TouchableOpacity>
              </View>
              {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

              <TouchableOpacity
                style={[styles.signupButton, isLoading && styles.buttonDisabled]}
                onPress={handleSignup}
                disabled={isLoading}
              >
                <LinearGradient
                  colors={[Colors.PRIMARY, Colors.SECONDARY_900]}
                  style={styles.buttonGradient}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.signupButtonText}>Create Account</Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {/* Link to login */}
            <View style={styles.forgotLinksContainer}>
              <TouchableOpacity onPress={() => router.push('/authentication/login')}>
                <Text style={styles.signupLink}>Already have an account? Log in</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </WebLayout>
  ) : (
    // Mobile-specific UI
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.PRIMARY_900 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.mobileScrollContainer}>
          <View style={styles.mobileHeader}>
            <TouchableOpacity onPress={() => router.back()} style={styles.mobileBackButton}>
              <ArrowLeft size={24} color={Colors.WHITE} />
            </TouchableOpacity>
            <Text style={styles.mobileHeaderTitle}>Sign Up</Text>
          </View>

          <View style={styles.mobileContentContainer}>
            <View style={styles.mobileLogoContainer}>
              <GraduationCap size={60} color={Colors.PRIMARY} />
              <Text style={styles.mobileAppTitle}>WeGoToCalStateLA</Text>
            </View>

            <Text style={styles.mobileWelcomeText}>Cal State LA Wellbeing Platform</Text>
            <Text style={styles.mobileInstructionText}>Connecting families of Cal State LA students to community, events, and essential resources.</Text>

            {errorMessage ? (
              <Text style={styles.errorText}>{errorMessage}</Text>
            ) : null}

            <View style={styles.mobileInputGroup}>
              <View style={styles.mobileInputContainer}>
                <Mail size={20} color={Colors.TEXT_SECONDARY} />
                <TextInput
                  style={styles.mobileTextInput}
                  placeholder="Email Address"
                  placeholderTextColor={Colors.TEXT_SECONDARY}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              <View style={styles.mobileInputContainer}>
                <Lock size={20} color={Colors.TEXT_SECONDARY} />
                <TextInput
                  style={styles.mobileTextInput}
                  placeholder="Password"
                  placeholderTextColor={Colors.TEXT_SECONDARY}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  {showPassword ? (
                    <EyeOff size={20} color={Colors.TEXT_SECONDARY} />
                  ) : (
                    <Eye size={20} color={Colors.TEXT_SECONDARY} />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.mobileLoginButton, isLoading && styles.buttonDisabled]}
              onPress={handleSignup}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              <Text style={styles.mobileLoginButtonText}>
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Text>
            </TouchableOpacity>

            <View style={styles.mobileSocialContainer}>
              <View style={styles.mobileDividerRow}>
                <View style={styles.mobileDividerLine} />
                <Text style={styles.mobileDividerText}>or</Text>
                <View style={styles.mobileDividerLine} />
              </View>
              <TouchableOpacity
                style={[styles.mobileGoogleButton, oauthLoading && styles.buttonDisabled]}
                onPress={handleGoogleSignup}
                activeOpacity={0.85}
                disabled={oauthLoading}
              >
                {oauthLoading ? (
                  <ActivityIndicator color={Colors.PRIMARY} />
                ) : (
                  <View style={styles.googleButtonContent}>
                    <View style={styles.googleIconWrapper}>
                      <Text style={styles.googleIconText}>G</Text>
                    </View>
                    <Text style={styles.mobileGoogleButtonText}>Sign up with Google</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.mobileSignupContainer}>
              <Text style={styles.mobileSignupText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/authentication/login')}>
                <Text style={styles.mobileSignupLink}>Log in</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  webMainContent: {
    flexDirection: width < 1024 ? 'column' : 'row',
    minHeight: 'calc(100vh - 60px)',
    maxWidth: 1200,
    width: '100%',
    alignSelf: 'center',
  },
  webLeftSide: {
    flex: 1,
    backgroundColor: '#0f172a',
    padding: width < 640 ? 24 : width < 1024 ? 40 : 64,
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandingSection: {
    width: '100%',
    maxWidth: 500,
    alignItems: 'center',
  },
  universityLogo: {
    width: 120,
    height: 120,
    borderRadius: 16,
    backgroundColor: '#0b1220',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#1f2937',
  },
  universityTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  universitySubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#cbd5e1',
    marginBottom: 12,
  },
  universityDescription: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: 24,
  },
  trustFeatures: {
    flexDirection: 'row',
    gap: 16,
  },
  trustFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  trustFeatureText: {
    color: '#cbd5e1',
    fontSize: 13,
    fontWeight: '600',
  },
  webRightSide: {
    flex: 1,
    padding: width < 640 ? 24 : width < 1024 ? 40 : 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginFormContainer: {
    width: '100%',
    maxWidth: 400,
  },
  formHeader: {
    marginBottom: 24,
  },
  formTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  formSubtitle: {
    fontSize: 14,
    color: '#475569',
  },
  socialContainer: {
    gap: 12,
    marginBottom: 24,
  },
  googleAltButton: {
    height: 48,
    borderRadius: 10,
    backgroundColor: Colors.PRIMARY + '10',
    borderWidth: 2,
    borderColor: Colors.PRIMARY + '30',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleAltButtonText: {
    color: Colors.PRIMARY,
    fontSize: 15,
    fontWeight: '700',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e2e8f0',
  },
  dividerText: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  loginForm: {
    gap: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    marginBottom: 20,
    paddingHorizontal: 16,
    backgroundColor: '#f8fafc',
    height: 56,
  },
  inputIconContainer: {
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#1e293b',
    fontWeight: '400',
  },
  passwordToggle: {
    padding: 4,
  },
  forgotLinksContainer: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  signupLink: {
    color: Colors.PRIMARY,
    fontWeight: '600',
  },
  googleButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  googleIconWrapper: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4285F4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleIconText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 12,
  },
  signupButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 8,
  },
  buttonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signupButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  // Mobile Styles
  mobileScrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 20,
    backgroundColor: Colors.PRIMARY_900,
  },
  mobileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    position: 'absolute', // Position absolute to float over content
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  mobileBackButton: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  mobileHeaderTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.WHITE,
    marginLeft: 15,
  },
  mobileContentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 25,
    marginTop: 80, // Space for header
  },
  mobileLogoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  mobileAppTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.PRIMARY,
    marginTop: 15,
  },
  mobileWelcomeText: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.WHITE,
    marginBottom: 10,
  },
  mobileInstructionText: {
    fontSize: 16,
    color: Colors.TEXT_SECONDARY,
    marginBottom: 30,
  },
  mobileInputGroup: {
    width: '100%',
    marginBottom: 20,
  },
  mobileInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.SECONDARY_700, // Darker background for input
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
    height: 55,
    borderWidth: 1,
    borderColor: Colors.SECONDARY_500,
  },
  mobileTextInput: {
    flex: 1,
    color: Colors.WHITE,
    fontSize: 16,
    paddingLeft: 10,
  },
  mobileForgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 25,
  },
  mobileForgotPasswordText: {
    fontSize: 14,
    color: Colors.PRIMARY,
    fontWeight: '600',
  },
  mobileLoginButton: {
    width: '100%',
    backgroundColor: Colors.BLACK,
    borderRadius: 12,
    paddingVertical: 17,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  mobileLoginButtonText: {
    color: Colors.PRIMARY,
    fontSize: 18,
    fontWeight: '700',
  },
  mobileSocialContainer: {
    width: '100%',
    marginBottom: 20,
  },
  mobileDividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  mobileDividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.SECONDARY_500,
  },
  mobileDividerText: {
    color: Colors.TEXT_SECONDARY,
    marginHorizontal: 10,
    fontSize: 14,
  },
  mobileGoogleButton: {
    flexDirection: 'row',
    backgroundColor: Colors.SECONDARY_700,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.SECONDARY_500,
  },
  mobileGoogleButtonText: {
    color: Colors.WHITE,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  mobileSignupContainer: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'center',
  },
  mobileSignupText: {
    color: Colors.TEXT_SECONDARY,
    fontSize: 15,
  },
  mobileSignupLink: {
    color: Colors.PRIMARY,
    fontWeight: '700',
    fontSize: 15,
  },
});
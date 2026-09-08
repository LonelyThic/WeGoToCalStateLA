import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { checkAuth } from '../../services/authService';
import Colors from '../../constant/Colors';

export default function OAuthCallback() {
  const { login } = useAuth();
  const [error, setError] = useState(null);

  useEffect(() => {
    validateSession();
  }, []);

  const validateSession = async () => {
    try {
      const userData = await checkAuth();

      if (userData && userData.userId) {
        login(userData);
        router.replace('/home_screen/home');
      } else {
        setError('Authentication failed');
        setTimeout(() => {
          router.replace('/authentication/login');
        }, 2000);
      }
    } catch (error) {
      console.error('Session validation error:', error);
      setError('An error occurred');
      setTimeout(() => {
        router.replace('/authentication/login');
      }, 2000);
    }
  };

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
        <Text style={styles.subText}>Redirecting to login...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={Colors.PRIMARY} />
      <Text style={styles.text}>Completing sign in...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.WHITE,
  },
  text: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.TEXT,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 18,
    color: Colors.ERROR || '#EF4444',
    fontWeight: '600',
    marginBottom: 8,
  },
  subText: {
    fontSize: 14,
    color: Colors.TEXT_SECONDARY || '#64748b',
  },
});

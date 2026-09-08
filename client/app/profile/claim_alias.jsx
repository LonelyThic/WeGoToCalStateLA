import React, { useState } from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity, 
    ActivityIndicator, 
    StyleSheet 
} from 'react-native';
import { router } from 'expo-router';
import WebLayout from '../../components/WebLayout';
import { Ionicons } from '@expo/vector-icons';

function generateAlias() {
  const adjectives = ['Quiet', 'Silver', 'Hidden', 'Calm', 'Brave', 'Swift'];
  const nouns = ['Falcon', 'Wolf', 'Hawk', 'River', 'Pine', 'Comet'];
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const num = Math.floor(10 + Math.random() * 90); 
  return `${adj}${noun}${num}`;
}

export default function ClaimAlias() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [claimedAlias, setClaimedAlias] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleClaim = async () => {
    setErrorMsg('');
    setIsLoading(true);

    try {
        //mock function to generate alias
      const alias = generateAlias();
      setClaimedAlias(alias);
      setShowSuccess(true);
      

      // Send alias back to /profile, redirect user back
      setTimeout(() => {
        router.replace({
            pathname: '/profile',
            params: { alias },
      });
    }, 2000); 
    } catch (err) {
      setErrorMsg('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

    if (showSuccess && claimedAlias) {
        return (
            <View style={styles.container}>
              <View style={styles.success}>
                <Ionicons name="checkmark-circle" size={64} color="#16a34a" style={{ marginBottom: 20 }} />
                <Text style={styles.title}>  Success!</Text>
              </View>
              <Text style={styles.subtitle}>
                  Your anonymous alias is <Text style={{ fontWeight: '700' }}>{claimedAlias}</Text>
              </Text>
              <Text style={styles.subtitle}>Redirecting you back to your profile…</Text>
            </View>
        );
    }


  return (
    <WebLayout>
        <View style={styles.container}>
        <Text style={styles.title}>Claim Anonymous Identity</Text>

        <Text style={styles.subtitle}>
            This is optional. If you claim an alias, it can be used across the app to keep your identity anonymous.
        </Text>

        <View style={styles.card}>
            <Text style={styles.cardTitle}>What this does</Text>
            <Text style={styles.bullet}>• Assigns you a random anonymous alias</Text>
            <Text style={styles.bullet}>• Lets you participate without using your real name</Text>
            <Text style={styles.bullet}>• You can still keep your real profile info</Text>
        </View>

        {errorMsg ? <Text style={styles.error}>{errorMsg}</Text> : null}

        <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleClaim}
            disabled={isLoading}
        >
            {isLoading ? (
            <ActivityIndicator />
            ) : (
            <Text style={styles.buttonText}>Claim Now</Text>
            )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondary} onPress={() => router.back()} disabled={isLoading}>
            <Text style={styles.secondaryText}>Cancel</Text>
        </TouchableOpacity>
        </View>
    </WebLayout>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, maxWidth: 700, width: '100%', alignSelf: 'center' },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 10 },
  subtitle: { fontSize: 16, opacity: 0.8, marginBottom: 18, lineHeight: 22 },
  card: { padding: 16, borderWidth: 1, borderRadius: 12, borderColor: '#e5e7eb', marginBottom: 18 },
  cardTitle: { fontSize: 16, fontWeight: '700', marginBottom: 8 },
  bullet: { fontSize: 15, marginBottom: 6, lineHeight: 20 },
  error: { color: '#b91c1c', marginBottom: 10 },
  button: { marginTop: 10, paddingVertical: 12, borderRadius: 10, alignItems: 'center', borderWidth: 1 },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { fontSize: 16, fontWeight: '700' },
  secondary: { marginTop: 14, alignItems: 'center' },
  secondaryText: { fontSize: 14, opacity: 0.75 },
  success:{flexDirection: 'row', alignItems: 'center'}
});
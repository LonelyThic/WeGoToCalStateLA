import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constant/Colors';
import { useTheme } from '../context/ThemeContext';

export default function PersonalInfo() {
  const router = useRouter();
  const { theme } = useTheme();

  console.log("🧪 PersonalInfo theme:", theme);

  const [address, setAddress] = useState('');
  const fullName = 'Salvador Gonzalez';
  const birthDate = '11/12/1988';

  useEffect(() => {
    const loadAddress = async () => {
      try {
        const stored = await AsyncStorage.getItem('userAddress');
        if (stored) setAddress(stored);
      } catch (err) {
        console.warn('Failed to load address:', err);
      }
    };
    loadAddress();
  }, []);

  const handleSave = async () => {
    try {
      await AsyncStorage.setItem('userAddress', address);
      Alert.alert('Success', 'Address updated!');
      router.back();
    } catch (err) {
      Alert.alert('Error', 'Failed to save address.');
    }
  };

  const backIconColor =
    theme === 'high-contrast' ? '#FFFF00' :
    theme === 'dark' ? Colors.WHITE :
    Colors.BLACK;

  return (
    <SafeAreaView key={theme} style={[styles.container, themeStyles[theme].container]}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={24} color={backIconColor} />
        <Text style={[styles.backText, themeStyles[theme].text]}>Back</Text>
      </TouchableOpacity>

      <Text style={[styles.title, themeStyles[theme].title]}>Personal Information</Text>

      <View style={styles.infoBlock}>
        <Text style={[styles.label, themeStyles[theme].text]}>Full Name:</Text>
        <Text style={[styles.value, themeStyles[theme].text]}>{fullName}</Text>
      </View>

      <View style={styles.infoBlock}>
        <Text style={[styles.label, themeStyles[theme].text]}>Birth Date:</Text>
        <Text style={[styles.value, themeStyles[theme].text]}>{birthDate}</Text>
      </View>

      <View style={styles.infoBlock}>
        <Text style={[styles.label, themeStyles[theme].text]}>Address:</Text>
        <TextInput
          style={[styles.inputBase, themeStyles[theme].textInput]}
          value={address}
          onChangeText={setAddress}
          placeholder="Enter your address"
          placeholderTextColor={
            theme === 'dark' ? '#ccc' :
            theme === 'high-contrast' ? '#FFFF00' :
            '#888'
          }
        />
      </View>

      <TouchableOpacity style={[styles.button, themeStyles[theme].button]} onPress={handleSave}>
        <Text style={[styles.buttonText, themeStyles[theme].buttonText]}>Save</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  backText: {
    fontSize: 16,
    marginLeft: 5,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  infoBlock: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
  value: {
    fontSize: 16,
    marginTop: 5,
  },
  inputBase: {
    padding: 10,
    borderRadius: 8,
    marginTop: 5,
  },
  button: {
    padding: 15,
    marginTop: 30,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

const themeStyles = {
  light: {
    container: { backgroundColor: Colors.CREAM },
    title: { color: Colors.BLACK },
    textInput: {
      backgroundColor: Colors.WHITE,
      color: Colors.BLACK,
      borderColor: '#ccc',
      borderWidth: 1,
    },
    button: { backgroundColor: Colors.PRIMARY },
    buttonText: { color: Colors.WHITE },
    text: { color: Colors.BLACK },
  },
  dark: {
    container: { backgroundColor: Colors.M_CHAR },
    title: { color: Colors.WHITE },
    textInput: {
      backgroundColor: Colors.GRAY,
      color: Colors.WHITE,
      borderColor: Colors.WHITE,
      borderWidth: 1,
    },
    button: { backgroundColor: Colors.GRAY },
    buttonText: { color: Colors.WHITE },
    text: { color: Colors.WHITE },
  },
  'high-contrast': {
    container: { backgroundColor: '#000000' },
    title: { color: '#FFFF00' },
    textInput: {
      backgroundColor: '#000000',
      color: '#FFFF00',
      borderColor: '#FFFF00',
      borderWidth: 2,
    },
    button: {
      backgroundColor: '#FFFF00',
      borderWidth: 2,
      borderColor: '#FFFFFF',
    },
    buttonText: { color: '#000000' },
    text: { color: '#FFFF00' },
  },
};

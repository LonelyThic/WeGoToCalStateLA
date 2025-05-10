import React, { useState, useRef, useEffect } from 'react';
import { useChatLogic } from './useChatLogic';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, SafeAreaView, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Feather, Ionicons } from '@expo/vector-icons';
import Colors from '../../constant/Colors';
import { useTheme } from '../context/ThemeContext';

export default function AskUsScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { messages, input, setInput, sendMessage } = useChatLogic([
    { role: 'assistant', content: "Hello {User}, welcome to WeGoToCalStateLA support. How can I help you?" }
  ]);
  
  return (
    <SafeAreaView style={[styles.container, themeStyles[theme].container]}>
      <Stack.Screen options={{
        headerTitle: "ASK US",
        headerTitleAlign: 'center',
        headerTitleStyle: styles.headerTitle,
        headerShadowVisible: false,
        headerStyle: themeStyles[theme].headerStyle
      }} />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View style={{ alignItems: 'center', marginTop: 10 }}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={28} color={theme === "dark" ? "#FFF" : theme === "high-contrast" ? "#FFF" : "#000"} />
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.messagesContainer}>
          {messages.map((message, index) => (
            <View key={message.id || index} style={[
              styles.messageBubbleRow,
              message.role === 'user' ? styles.userRow : styles.aiRow
            ]}>
              {!message.isUser && (
                <View style={styles.logoContainer}>
                  <Image 
                    source={require('../../assets/images/CSULA.png')} 
                    style={styles.logo} 
                  />
                </View>
              )}
              <View style={[
                styles.messageBubble,
                themeStyles[theme].bubble
              ]}>
                <Text style={[
                  styles.messageText,
                ]}>
                  {message.content}
                </Text>
                
                {!message.isUser && (
                  <View style={styles.feedbackButtons}>
                    <TouchableOpacity style={styles.feedbackButton}>
                      <Feather name="thumbs-up" size={20} color="#ffffff" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.feedbackButton}>
                      <Feather name="thumbs-down" size={20} color="#ffffff" />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
              
              {message.isUser && (
                <View style={styles.profileIconContainer}>
                  <View style={styles.profileIcon}>
                    <Feather name="user" size={24} color="black" />
                  </View>
                  <Text style={styles.profileText}>Profile</Text>
                </View>
              )}
            </View>
          ))}
        </ScrollView>
        
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="How can I help you?"
            placeholderTextColor="#888"
          />
          <View style={styles.sendButtonsContainer}>
            <TouchableOpacity style={styles.iconButton} onPress={() => sendMessage(input)}>
              <Feather name="send" size={24} color="black" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f2eb',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  messagesContainer: {
    flex: 1,
    padding: 10,
  },
  messageBubbleRow: {
    flexDirection: 'row',
    marginVertical: 8,
    alignItems: 'flex-end',
  },
  userRow: {
    justifyContent: 'flex-end',
  },
  aiRow: {
    justifyContent: 'flex-start',
  },
  messageBubble: {
    borderRadius: 20,
    padding: 12,
    maxWidth: '85%',
    borderBottomRightRadius: 5,
    marginLeft: 5,
  },
  logoContainer: {
    marginRight: 8,
    alignSelf: 'flex-end',
    marginBottom: 4,
  },
  logo: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'gold',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
    flexWrap: 'wrap',
    color: 'white',
  },
  feedbackButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  feedbackButton: {
    marginLeft: 10,
  },
  inputContainer: {
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120,
    fontSize: 16,
    paddingHorizontal: 10,
  },
  sendButtonsContainer: {
    flexDirection: 'row',
  },
  iconButton: {
    padding: 5,
    marginLeft: 5,
  },
  profileIconContainer: {
    marginLeft: 10,
    alignItems: 'center',
  },
  profileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileText: {
    fontSize: 12,
    marginTop: 4,
  },
});

const themeStyles = {
  light: {
    container: { backgroundColor: Colors.CREAM },
    headerStyle: { backgroundColor: Colors.CREAM },
    textInput: { backgroundColor: Colors.WHITE, color: Colors.BLACK },
    bubble: { backgroundColor: Colors.DARK_CY },
  },
  dark: {
    container: { backgroundColor: Colors.M_CHAR },
    headerStyle: { backgroundColor: Colors.M_CHAR },
    textInput: { backgroundColor: Colors.BLACK, color: Colors.WHITE },
    bubble: { backgroundColor: Colors.BLACK },
  },
  'high-contrast': {
    container: { backgroundColor: Colors.BLACK },
    headerStyle: { backgroundColor: Colors.BLACK },
    textInput: {
      backgroundColor: Colors.BLACK,
      color: Colors.YELLOW,
      borderColor: Colors.YELLOW,
      borderWidth: 2,
    },
    bubble: { backgroundColor: Colors.BLACK },
  },
};
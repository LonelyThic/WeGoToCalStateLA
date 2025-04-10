import { Feather } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import React, { useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";

export default function AskUsScreen() {
  // keep track of messages (and giving preliminary messages)
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello {User}, welcome to WeGoToCalStateLA support. How can I help you?",
      isUser: false,
      timestamp: new Date(),
    },
    {
      id: 2,
      text: "Give me a list of resources to help me learn more about CalFresh",
      isUser: true,
      timestamp: new Date(),
    },
    {
      id: 3,
      text: "Absolutely! Here is a list of resources that can help learn about CalFresh:\n\n• https://www.getcalfresh.org/\n• https://www.cdss.ca.gov/calfresh\n• https://benefitscal.com/public/login\n• https://dpss.lacounty.gov/en/food/calfresh.html",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  
  const [inputText, setInputText] = useState('');
  
  const sendMessage = (text) => {
    if (!text.trim()) return;
    
    // Add user message
    const newUserMessage = {
      id: messages.length + 1,
      text: text,
      isUser: true,
      timestamp: new Date()
    };
    
    setMessages([...messages, newUserMessage]);
    setInputText('');
    
    // simulate ai response after a short delay
    setTimeout(() => {
      // probably remove these and default response and eventually straight plug in the ai here
      const aiResponses = {
        "Help me find CalFresh resources": "Here are some CalFresh resources you might find helpful:\n\n• https://www.getcalfresh.org/\n• https://www.cdss.ca.gov/calfresh\n• https://benefitscal.com/public/login\n• Call the CalFresh Helpline: 1-877-847-3663",
        "I need to learn about unemployment benefits": "For unemployment benefits information, please visit the EDD website at https://edd.ca.gov/unemployment/ or call 1-800-300-5616. You can file a claim online, check status, and get more information about eligibility requirements.",
        "Tell me more about CalWorks": "CalWORKs provides temporary financial assistance and employment-focused services to families with minor children. Visit https://www.cdss.ca.gov/calworks for more information or contact your local county office.",
        "How do I apply for a CSU Scholarship?": "To apply for CSU scholarships:\n1. Create an account on the CSU portal\n2. Complete the general scholarship application\n3. Submit by the deadline (typically February 15)\n4. Check with your specific campus for additional scholarship opportunities"
      };
      
      const defaultResponse = "I'll help you find information about that. Could you provide more details about what you're looking for?";
      
      // change this to plug in ai chatbot
      const newAiMessage = {
        id: messages.length + 2,
        text: aiResponses[text] || defaultResponse,
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prevMessages => [...prevMessages, newAiMessage]);
    }, 1000);
  };
  
  return (
    <SafeAreaView style={styles.container}>
    {/* this doesn't show up on the screen? */}
      <Stack.Screen options={{ 
        headerTitle: "ASK US",
        headerTitleAlign: 'center',
        headerTitleStyle: styles.headerTitle,
        headerShadowVisible: false,
        headerStyle: { backgroundColor: '#f5f2eb' }
      }} />
      
      {/* adjusts where keyboard is */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView style={styles.messagesContainer}>
          {messages.map((message) => (
            // seees the user and defines the style based on whether user or ai
            <View key={message.id} style={[
              styles.messageBubbleRow,
              message.isUser ? styles.userRow : styles.aiRow
            ]}>
              {!message.isUser && (
                <View style={styles.logoContainer}>
                  <Image 
                  // goes into images for CSULA
                    source={require('../../assets/images/CSULA.png')} 
                    style={styles.logo} 
                  />
                </View>
              )}
              <View style={[
                styles.messageBubble,
              ]}>
                <Text style={[
                  styles.messageText,
                ]}>
                  {message.text}
                </Text>
                
                {/* if the message is from ai add feedback buttons */}
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
              
              {/* profile circle and face */}
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
            value={inputText}
            onChangeText={setInputText}
            placeholder="How can I help you?"
            placeholderTextColor="#888"
          />
          <View style={styles.sendButtonsContainer}>
            <TouchableOpacity style={styles.iconButton} onPress={() => sendMessage(inputText)}>
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
    backgroundColor: '#1a1a1a',
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
    // move message 10 away
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
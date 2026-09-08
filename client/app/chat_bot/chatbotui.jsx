import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  // Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  ArrowLeft,
  Send,
  Bot,
  User,
  Heart,
  Sparkles,
  // MessageCircle,
  Shield
} from 'lucide-react-native';
import { Colors } from '../../constant/Colors';
import { /* responsive, */ isWeb, width } from '../../utils/responsive';
import WebLayout from '../../components/WebLayout';

// const { width: screenWidth } = Dimensions.get('window');

export default function ChatBotScreen() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I’m your Cal State LA wellness assistant. How can I support your mental health journey today?",
      isBot: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const scrollViewRef = useRef();

  const sendMessage = () => {
    if (message.trim()) {
      const userMessage = {
        id: Date.now(),
        text: message.trim(),
        isBot: false,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, userMessage]);
      setMessage('');

      // Simulate bot response
      setTimeout(() => {
        const botResponse = {
          id: Date.now() + 1,
          text: "Thank you for reaching out. I’m here to listen and provide support. As a Cal State LA student, you have access to many wellness resources. Would you like me to help you find specific services or just talk through what you’re experiencing?",
          isBot: true,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, botResponse]);
      }, 1000);
    }
  };

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const MessageBubble = ({ message }) => (
    <View style={[
      styles.messageContainer,
      message.isBot ? styles.botMessageContainer : styles.userMessageContainer
    ]}>
      <View style={[
        styles.messageAvatar,
        { backgroundColor: message.isBot ? Colors.PRIMARY + '20' : Colors.SECONDARY + '20' }
      ]}>
        {message.isBot ? (
          <Bot size={20} color={Colors.PRIMARY} />
        ) : (
          <User size={20} color={Colors.SECONDARY} />
        )}
      </View>
      
      <View style={styles.messageContent}>
        <View style={[
          styles.messageBubble,
          message.isBot ? styles.botBubble : styles.userBubble
        ]}>
          <Text style={[
            styles.messageText,
            message.isBot ? styles.botText : styles.userText
          ]}>
            {message.text}
          </Text>
        </View>
        <Text style={styles.messageTime}>{message.timestamp}</Text>
      </View>
    </View>
  );

  if (isWeb) {
    return (
      <WebLayout>
        <View style={styles.webContainer}>
          {/* Chat Header */}
          <View style={styles.webChatHeader}>
            <View style={styles.webHeaderContent}>
              <View style={styles.webHeaderLeft}>
                <View style={styles.webBotAvatar}>
                  <Sparkles size={24} color={Colors.PRIMARY} />
                </View>
                <View>
                  <Text style={styles.webChatTitle}>WeGoToCalStateLA AI Assistant</Text>
                  <View style={styles.webStatusIndicator}>
                    <View style={styles.webOnlineStatus} />
                    <Text style={styles.webStatusText}>Online • Ready to help</Text>
                  </View>
                </View>
              </View>
              <View style={styles.webHeaderRight}>
                <View style={styles.webSafetyBadge}>
                  <Shield size={16} color={Colors.SUCCESS} />
                  <Text style={styles.webSafetyText}>Safe & Confidential</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Chat Messages */}
          <ScrollView
            ref={scrollViewRef}
            style={styles.webMessagesContainer}
            contentContainerStyle={styles.webMessagesContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.webChatContent}>
              {messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} />
              ))}
            </View>
          </ScrollView>

          {/* Support Notice */}
          <View style={styles.webSupportNotice}>
            <Heart size={16} color={Colors.SECONDARY} />
            <Text style={styles.webSupportNoticeText}>
              Remember: This is a support tool. For emergencies, please contact 988 or campus safety at (323) 343-3700.
            </Text>
          </View>

          {/* Input Area */}
          <View style={styles.webInputContainer}>
            <View style={styles.webInputContent}>
              <View style={styles.webInputRow}>
                <TextInput
                  style={styles.webTextInput}
                  placeholder="Type your message here..."
                  placeholderTextColor="#9CA3AF"
                  value={message}
                  onChangeText={setMessage}
                  multiline
                  maxLength={500}
                />
                <TouchableOpacity
                  style={[styles.webSendButton, !message.trim() && styles.webDisabledSendButton]}
                  onPress={sendMessage}
                  disabled={!message.trim()}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={message.trim() ? [Colors.PRIMARY, '#1e40af'] : ['#d1d5db', '#9ca3af']}
                    style={styles.webSendButtonGradient}
                  >
                    <Send size={20} color={Colors.WHITE} />
                  </LinearGradient>
                </TouchableOpacity>
              </View>
              <Text style={styles.webInputHint}>
                Press Enter to send • Shift + Enter for new line
              </Text>
            </View>
          </View>
        </View>
      </WebLayout>
    );
  }

  // Mobile version (existing code)
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
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Wellness Assistant</Text>
            <View style={styles.statusIndicator}>
              <View style={styles.onlineStatus} />
              <Text style={styles.statusText}>Online</Text>
            </View>
          </View>
          <View style={styles.headerSpacer} />
        </View>
      </LinearGradient>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardContainer}
      >
        {/* Chat Messages */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
        </ScrollView>

        {/* Support Notice */}
        <View style={styles.supportNotice}>
          <Heart size={16} color={Colors.SECONDARY} />
          <Text style={styles.supportNoticeText}>
            Remember: This is a support tool. For emergencies, please contact 988 or campus safety.
          </Text>
        </View>

        {/* Input Area */}
        <View style={styles.inputContainer}>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.textInput}
              placeholder="Type your message..."
              placeholderTextColor={Colors.GRAY}
              value={message}
              onChangeText={setMessage}
              multiline
              maxLength={500}
            />
            <TouchableOpacity
              style={[styles.sendButton, !message.trim() && styles.disabledSendButton]}
              onPress={sendMessage}
              disabled={!message.trim()}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={message.trim() ? [Colors.SECONDARY, Colors.DARK_GOLD] : [Colors.GRAY, Colors.GRAY]}
                style={styles.sendButtonGradient}
              >
                <Send size={20} color={message.trim() ? Colors.BLACK : Colors.WHITE} />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // Web Styles
  /* duplicate webContainer removed */
  webChatHeader: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    paddingVertical: 20,
  },
  /* duplicate webHeaderContent removed */
  /* duplicate webHeaderLeft/webBotAvatar/webChatTitle/webStatusIndicator/webOnlineStatus/webStatusText/webHeaderRight/webSafetyBadge/webSafetyText removed */
  /* duplicate webMessagesContainer/webMessagesContent/webChatContent/webSupportNotice/webSupportNoticeText/webInputContainer/webInputContent/webInputRow/webTextInput/webSendButton/webSendButtonGradient/webDisabledSendButton/webInputHint removed */
  
  // Mobile Styles (existing)
  container: {
    flex: 1,
    backgroundColor: Colors.LIGHT_GRAY,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: Colors.WHITE + '20',
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.WHITE,
    marginBottom: 4,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  onlineStatus: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.GREEN,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    color: Colors.LIGHT_GOLD,
    fontWeight: '500',
  },
  headerSpacer: {
    width: 40,
  },
  keyboardContainer: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-end',
    maxWidth: width < 640 ? '100%' : '80%',
    alignSelf: width < 640 ? 'stretch' : 'center',
  },
  botMessageContainer: {
    justifyContent: 'flex-start',
  },
  userMessageContainer: {
    justifyContent: 'flex-end',
    flexDirection: 'row-reverse',
    alignSelf: 'flex-end',
  },
  messageAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  messageContent: {
    flex: 1,
    maxWidth: '75%',
  },
  messageBubble: {
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: Colors.BLACK,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  botBubble: {
    backgroundColor: Colors.WHITE,
    borderBottomLeftRadius: 4,
  },
  userBubble: {
    backgroundColor: Colors.PRIMARY,
    borderBottomRightRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  botText: {
    color: Colors.DARK_GRAY,
  },
  userText: {
    color: Colors.WHITE,
  },
  messageTime: {
    fontSize: 12,
    color: Colors.GRAY,
    marginTop: 4,
    marginHorizontal: 8,
  },
  supportNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.WHITE,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 20,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: Colors.BLACK,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  supportNoticeText: {
    fontSize: 12,
    color: Colors.GRAY,
    marginLeft: 8,
    flex: 1,
  },
  inputContainer: {
    backgroundColor: Colors.WHITE,
    paddingHorizontal: 20,
    paddingVertical: 16,
    shadowColor: Colors.BLACK,
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  textInput: {
    flex: 1,
    borderWidth: 2,
    borderColor: Colors.LIGHT_GRAY,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.BLACK,
    maxHeight: 100,
    marginRight: 12,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  sendButtonGradient: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledSendButton: {
    opacity: 0.5,
  },
  
  // Web Styles
  webContainer: {
    flex: 1,
    backgroundColor: '#f8fafc',
    maxHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  /* duplicate webChatHeader removed */
  webHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
    paddingHorizontal: width < 640 ? 16 : 32,
  },
  webHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  webBotAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.PRIMARY + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  webChatTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  webStatusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  webOnlineStatus: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.SUCCESS,
  },
  webStatusText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  webHeaderRight: {
    // Header right content
  },
  webSafetyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.SUCCESS + '10',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  webSafetyText: {
    fontSize: 12,
    color: Colors.SUCCESS,
    fontWeight: '600',
  },
  webMessagesContainer: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  webMessagesContent: {
    paddingVertical: 20,
  },
  webChatContent: {
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
    paddingHorizontal: width < 640 ? 16 : 32,
  },
  webSupportNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef3c7',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  webSupportNoticeText: {
    fontSize: 14,
    color: '#92400e',
    flex: 1,
    fontWeight: '500',
    textAlign: 'center',
  },
  webInputContainer: {
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingVertical: 20,
  },
  webInputContent: {
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
    paddingHorizontal: width < 640 ? 16 : 32,
  },
  webInputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 16,
    marginBottom: 8,
  },
  webTextInput: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 16,
    color: '#1e293b',
    maxHeight: 120,
    backgroundColor: '#f8fafc',
    fontWeight: '400',
  },
  webSendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  webSendButtonGradient: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  webDisabledSendButton: {
    opacity: 0.5,
  },
  webInputHint: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
    fontWeight: '400',
  },
});
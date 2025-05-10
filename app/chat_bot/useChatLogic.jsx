import React, { useState } from 'react';
import { CHATBOT_CONFIG, PROMPT_TEMPLATES, detectContext, CONTEXT_CATEGORIES } from '../configs/config';
import { useRouter } from 'expo-router';
import AWSClient from './aws_client';

/*
Context detection: Uses detectContext(input) to figure out what the message is about
System prompt: Dynamically adds a prompt template to instruct the chatbot
Chat memory: Sends the last 5 messages for context to the API
OpenAI-like API: Sends a request and waits for a bot reply (data.choices[0].message.content) 
*/

export function useChatLogic(initialMessages) {
  const [messages, setMessages] = useState(initialMessages || []);
  const [input, setInput] = useState('');
  const [lastContext, setLastContext] = useState(null);
  const router = useRouter();

  const handleMentalHealthSelection = (input) => {
    const lowerInput = input.toLowerCase();
    
    // Check for GAD-7 selection (option 1)
    if (lowerInput.includes('gad-7') || lowerInput.includes('gad 7') || 
        lowerInput.includes('anxiety') || lowerInput === '1') {
      router.push('/quizzes/quiz_list');
      return 'Taking you to the GAD-7 anxiety assessment.';
    }
    
    // Check for PHQ-9 selection (option 2)
    if (lowerInput.includes('phq-9') || lowerInput.includes('phq 9') || 
        lowerInput.includes('depression') || lowerInput === '2') {
      router.push('/quizzes/quiz_list');
      return 'Taking you to the PHQ-9 depression assessment.';
    }
    
    // Check for previous results (option 3)
    if (lowerInput.includes('previous') || lowerInput.includes('view') || 
        lowerInput.includes('results') || lowerInput === '3') {
      router.push('/home');
      return 'Taking you to your assessment results.';
    }
    
    // Check for learning about scores (option 4)
    if (lowerInput.includes('learn') || lowerInput.includes('scores') || 
        lowerInput.includes('mean') || lowerInput === '4') {
      return `Here's what the scores mean:
      
GAD-7 (Anxiety):
- 0-4: Minimal anxiety
- 5-9: Mild anxiety
- 10-14: Moderate anxiety
- 15-21: Severe anxiety

PHQ-9 (Depression):
- 0-4: Minimal depression
- 5-9: Mild depression
- 10-14: Moderate depression
- 15-19: Moderately severe depression
- 20-27: Severe depression`;
    }
    
    // Check for mental health resources (option 5)
    if (lowerInput.includes('resource') || lowerInput.includes('find') || 
        lowerInput === '5') {
      router.push('/resources');
      return 'Taking you to our mental health resources page.';
    }

    // If no specific option was selected, show the menu again
    return PROMPT_TEMPLATES.MENTAL_HEALTH;
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { id: Date.now(), role: 'user', content: input };
    console.log('Sending user message:', userMessage);
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    try {
      const context = detectContext(input);
      console.log("Detected context:", context);

      // If we're in a mental health context and have shown the menu,
      // check for specific selections
      if (lastContext === CONTEXT_CATEGORIES.MENTAL_HEALTH) {
        const response = handleMentalHealthSelection(input);
        setMessages(prev => [...prev, { 
          id: Date.now(), 
          role: 'assistant', 
          content: response 
        }]);
        // Reset context if a valid selection was made
        if (response !== PROMPT_TEMPLATES.MENTAL_HEALTH) {
          setLastContext(null);
        }
        return;
      }

      // Handle special contexts immediately without calling OpenAI
      if (context === CONTEXT_CATEGORIES.EMERGENCY) {
        setMessages(prev => [...prev, { 
          id: Date.now(), 
          role: 'assistant', 
          content: PROMPT_TEMPLATES.EMERGENCY_RESPONSE 
        }]);
        return;
      }

      if (context === CONTEXT_CATEGORIES.MENTAL_HEALTH) {
        setMessages(prev => [...prev, { 
          id: Date.now(), 
          role: 'assistant', 
          content: PROMPT_TEMPLATES.MENTAL_HEALTH 
        }]);
        setLastContext(CONTEXT_CATEGORIES.MENTAL_HEALTH);
        return;
      }

      if (context === CONTEXT_CATEGORIES.LOAN) {
        setMessages(prev => [...prev, { 
          id: Date.now(), 
          role: 'assistant', 
          content: PROMPT_TEMPLATES.LOAN_ASSISTANCE 
        }]);
        return;
      }

      if (context === CONTEXT_CATEGORIES.RESUME) {
        setMessages(prev => [...prev, { 
          id: Date.now(), 
          role: 'assistant', 
          content: PROMPT_TEMPLATES.RESUME_HELP 
        }]);
        return;
      }

      // Only call OpenAI for general inquiries or when we need more specific responses
      const response = await AWSClient.sendMessage({
        message: input,
        context: context,
        messageHistory: messages.slice(-5)
      });

      console.log('Received response from AWS Lambda:', response);

      if (response.status === 'success') {
        console.log('Successfully received chatbot response:', response.message);
        let finalResponse = response.message;

        // If this was a redirect context, append the redirect suggestion
        if (context === CONTEXT_CATEGORIES.REDIRECT) {
          finalResponse = `${response.message}\n\n${PROMPT_TEMPLATES.REDIRECT_RESPONSE}`;
        }

        setMessages(prev => [...prev, { 
          id: Date.now(), 
          role: 'assistant', 
          content: finalResponse 
        }]);
      } else {
        throw new Error(response.error || 'Failed to get response from chatbot');
      }
    } catch (error) {
      console.error("Chatbot Error:", {
        message: error.message,
        stack: error.stack,
        context: detectContext(input),
        input: input,
        lastMessages: messages.slice(-5)
      });
      
      // Use template responses for errors based on context
      const errorContext = detectContext(input);
      let errorResponse = PROMPT_TEMPLATES.ERROR_RESPONSE;
      
      if (errorContext === CONTEXT_CATEGORIES.LOAN) {
        errorResponse = PROMPT_TEMPLATES.LOAN_ASSISTANCE;
      } else if (errorContext === CONTEXT_CATEGORIES.MENTAL_HEALTH) {
        errorResponse = PROMPT_TEMPLATES.MENTAL_HEALTH;
      } else if (errorContext === CONTEXT_CATEGORIES.RESUME) {
        errorResponse = PROMPT_TEMPLATES.RESUME_HELP;
      }

      setMessages(prev => [
        ...prev,
        { id: Date.now(), role: 'assistant', content: errorResponse }
      ]);
    }
  };

  return { messages, input, setInput, sendMessage };
}
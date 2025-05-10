import Constants from 'expo-constants';

// Get the Lambda URL from Expo config
const LAMBDA_URL = Constants.expoConfig?.extra?.lambdaApiUrl;

console.log('Initializing AWS Client with Lambda URL:', LAMBDA_URL);

// For development, if you want to use OpenAI directly instead of Lambda
const USE_OPENAI_DIRECTLY = true; // Set this to true if you want to use OpenAI API directly

class AWSClient {
    static async sendMessage({ message, context, messageHistory }) {
        try {
            // Development helper message
            if (!LAMBDA_URL) {
                console.warn(`
                No Lambda URL configured. You have two options:
                1. Set up a Lambda URL:
                   - Create a .env.local file in your project root
                   - Add: EXPO_PUBLIC_LAMBDA_API_URL=your_lambda_url
                   - Restart your development server
                
                2. Use OpenAI directly (for development):
                   - Set USE_OPENAI_DIRECTLY = true in aws_client.js
                   - Add your OpenAI key to app.config.js
                `);
            }

            // If we're using OpenAI directly (development only)
            if (USE_OPENAI_DIRECTLY) {
                return this.handleOpenAIDirect({ message, context, messageHistory });
            }

            // Check if we have a valid URL for Lambda
            if (!LAMBDA_URL) {
                throw new Error('Lambda URL not configured. Please check the console for setup instructions.');
            }

            console.log('Making request to Lambda:', {
                url: LAMBDA_URL,
                payload: { message, context, messageHistory }
            });

            const response = await fetch(LAMBDA_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    message,
                    context,
                    messageHistory
                })
            });

            console.log('Lambda response status:', response.status);
            
            const responseText = await response.text();
            console.log('Raw response:', responseText);
            
            let data;
            try {
                data = JSON.parse(responseText);
            } catch (parseError) {
                console.error('Failed to parse response as JSON:', parseError);
                throw new Error('Invalid response format from server');
            }

            if (!data) {
                throw new Error('No data received from chatbot');
            }

            return data;
        } catch (error) {
            console.error('Error communicating with chatbot:', {
                error: error.message,
                stack: error.stack,
                url: LAMBDA_URL
            });
            
            return {
                status: 'error',
                error: error.message || 'Failed to communicate with chatbot server',
                details: {
                    url: LAMBDA_URL,
                    context: context,
                    message: message
                }
            };
        }
    }

    // Development only: Direct OpenAI handler
    static async handleOpenAIDirect({ message, context, messageHistory }) {
        const openaiKey = Constants.expoConfig?.extra?.openaiApiKey;
        if (!openaiKey) {
            throw new Error('OpenAI API key not configured in app.config.js');
        }

        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${openaiKey}`
                },
                body: JSON.stringify({
                    model: 'gpt-3.5-turbo',
                    messages: [
                        ...messageHistory,
                        {
                            role: 'system',
                            content: `Context: ${context}. Please provide a helpful response.`
                        },
                        {
                            role: 'user',
                            content: message
                        }
                    ],
                    temperature: 0.7
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error?.message || 'Failed to get response from OpenAI');
            }

            return {
                status: 'success',
                message: data.choices[0].message.content
            };
        } catch (error) {
            console.error('OpenAI API Error:', error);
            return {
                status: 'error',
                error: error.message || 'Failed to communicate with OpenAI',
                details: {
                    context: context,
                    message: message
                }
            };
        }
    }
}

export default AWSClient; 
import Constants from 'expo-constants'

export const CHATBOT_CONFIG = {
  API_ENDPOINT: Constants.expoConfig.extra.apiEndpoint, // put the URL to the backend that handles OpenAI requests
  API_KEY: Constants.expoConfig.extra.openaiApiKey, // Authentication key to access GPT API
  MODEL: 'gpt-4o',
  MAX_TOKENS: 500, // controls how long the model's response can be 
  TEMPERATURE: 0.7, // affects creativity vs. precision 
};

// pre-written 
export const PROMPT_TEMPLATES = {
  SYSTEM_BASE: `You are a helpful assistant for the Well-Guided Transition Center for Successful Living in America (WGTCSLA). 
You help users navigate resources, mental health assessments, and career development tools. 
When responding, avoid using personal pronouns like "I", "me", "my", etc. Use a professional, impersonal tone.`,
  
  LOAN_ASSISTANCE: `Information about the home-buying process is available. 
  Resources and available grants can be accessed. What specific aspect would you like to know more about?
  1. First-time homebuyer programs
  2. Loan application process
  3. Down payment assistance
  4. Credit score requirements
  5. Available grants`,

  MENTAL_HEALTH: `Mental health assessments can be accessed and understood. 
  Would you like to:
  1. Take a new GAD-7 (anxiety) assessment
  2. Take a new PHQ-9 (depression) assessment
  3. View previous assessment results
  4. Learn more about what these scores mean
  5. Find mental health resources`,

  RESUME_HELP: `Assistance with improving resumes is available. To provide the best guidance, please:
  1. Share your current resume or describe your work experience
  2. Specify the type of job you're targeting
  3. Mention any specific areas you'd like to improve`,

  ERROR_RESPONSE: `An error has been encountered. Please try your request again. If the problem persists, please contact our support team.`,
  // triggered by: server request error or technical request error

  REDIRECT_RESPONSE: `We Go To CAL State LA can help with: Loan Assistance, Mental Health Assessments, and Resume Help. Please select one to get started`,

  EMERGENCY_RESPONSE: `Please note, if immediate attention is needed, the National Crisis Hotline can be reached at 988, text HOME to 741741, dial 911, or go to the nearest hospital's emergency room.`
  /*
    When does EMERGENCY_RESPONSE get 
   * PHQ 27 -> threshold >= 15-19 is moderately severe the threshold, 
   * GAD 21 ->
   */
};

export const CONTEXT_CATEGORIES = {
  LOAN: 'loan_assistance',
  MENTAL_HEALTH: 'mental_health',
  RESUME: 'resume_assistance',
  GENERAL: 'general_inquiry',
  ERROR: 'error', 
  REDIRECT: 'redirect_response', 
  EMERGENCY: 'emergency_response'
};

export const detectContext = (message) => {
  const lowerMessage = message.toLowerCase();

  const loanKeywords = ['loan', 'house', 'mortgage', 'buy', 'home', 'condo', 'real estate', 'apartment'];
  const mentalHealthKeywords = ['gad', 'phq', 'mental', 'anxiety', 'depression', 'sad', 'feel', 'hurting', 'pain'];
  const resumeKeywords = ['resume', 'job', 'career', 'work', 'interview', 'professional', 'company'];
  const emergencyKeywords = ['emergency', 'critical', 'severe', 'unbearable','hospital', 'undesirable']

  const containsKeyword = (message, keywords) => 
    keywords.some(keyword => message.includes(keyword));

  if (containsKeyword(lowerMessage, emergencyKeywords)) {
    return CONTEXT_CATEGORIES.EMERGENCY;
  }
  
  if (containsKeyword(lowerMessage, loanKeywords)) {
    return CONTEXT_CATEGORIES.LOAN;
  }

  if (containsKeyword(lowerMessage, mentalHealthKeywords)) {
    return CONTEXT_CATEGORIES.MENTAL_HEALTH;
  }

  if (containsKeyword(lowerMessage, resumeKeywords)) {
    return CONTEXT_CATEGORIES.RESUME;
  }

  
  return CONTEXT_CATEGORIES.REDIRECT;
};

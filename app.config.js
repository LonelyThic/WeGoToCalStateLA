export default ({ config }) => {
  return {
    ...config,
    expo: {
      name: "WeGoToCSLA",
      slug: "WeGoToCSLA",
      extra: {
        openaiApiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY,
        apiEndpoint: "", // Keep this empty as we're using direct OpenAI
        lambdaApiUrl: process.env.EXPO_PUBLIC_LAMBDA_API_URL || 
                    (process.env.NODE_ENV === 'development' 
                      ? "http://localhost:3000" // Default development URL
                      : undefined)
      },
      version: "1.0.0",
      orientation: "portrait",
      icon: "./assets/images/icon.png",
      scheme: "myapp",
      userInterfaceStyle: "automatic",
      newArchEnabled: true,
      ios: {
        supportsTablet: true,
        bundleIdentifier: "com.anonymous.WeGoToCSLA"
      },
      android: {
        adaptiveIcon: {
          foregroundImage: "./assets/images/adaptive-icon.png",
          backgroundColor: "#ffffff"
        },
        package: "com.anonymous.WeGoToCSLA"
      },
      web: {
        bundler: "metro",
        output: "static",
        favicon: "./assets/images/favicon.png"
      },
      plugins: [
        "expo-router",
        [
          "expo-splash-screen",
          {
            "image": "./assets/images/splash-icon.png",
            "imageWidth": 200,
            "resizeMode": "contain",
            "backgroundColor": "#ffffff"
          }
        ],
        "expo-font"
      ],
      experiments: {
        typedRoutes: true
      }
    }
  };
}; 
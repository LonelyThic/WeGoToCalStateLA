import { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';

declare global {
  interface Window {
    frameworkReady?: () => void;
  }
}

export function useFrameworkReady() {
  useEffect(() => {
    const hideSplash = async () => {
      try {
        // Call framework ready if it exists (for web)
        window.frameworkReady?.();
        // Hide splash screen
        await SplashScreen.hideAsync();
      } catch (error) {
        console.warn('Error hiding splash screen:', error);
      }
    };

    hideSplash();
  }, []);
}

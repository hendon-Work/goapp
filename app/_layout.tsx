import { ThemeProvider, DefaultTheme } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { Colors } from '@/constants/Colors';
import { 
  useFonts,
  PlusJakartaSans_400Regular,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold 
} from '@expo-google-fonts/plus-jakarta-sans';
import {
  BeVietnamPro_400Regular,
  BeVietnamPro_500Medium,
  BeVietnamPro_700Bold
} from '@expo-google-fonts/be-vietnam-pro';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { FavoritesProvider } from '@/contexts/FavoritesContext';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

const AppTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: Colors.primary,
    background: Colors.surface,
    card: Colors.surfaceContainerLowest,
    text: Colors.onSurface,
    border: Colors.surfaceContainer,
  },
};

export default function RootLayout() {
  const [loaded, error] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
    BeVietnamPro_400Regular,
    BeVietnamPro_500Medium,
    BeVietnamPro_700Bold,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <FavoritesProvider>
      <ThemeProvider value={AppTheme}>
        <Stack screenOptions={{ 
          headerStyle: { backgroundColor: Colors.surface },
          headerShadowVisible: false,
          headerTitleStyle: { fontFamily: 'PlusJakartaSans_700Bold' },
          contentStyle: { backgroundColor: Colors.surface }
        }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="[id]" options={{ headerShown: false, presentation: 'modal' }} />
        </Stack>
        <StatusBar style="dark" backgroundColor={Colors.surface} />
      </ThemeProvider>
    </FavoritesProvider>
  );
}

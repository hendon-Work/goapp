import { StyleSheet } from 'react-native';
import { Colors } from './Colors';

export const Typography = StyleSheet.create({
  displayLg: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: 56, // 3.5rem
    letterSpacing: -1.12, // -0.02em
    lineHeight: 64,
    color: Colors.onSurface,
  },
  displayMd: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 44, // 2.75rem
    letterSpacing: -0.88,
    lineHeight: 52,
    color: Colors.onSurface,
  },
  headlineLg: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 32, // 2rem
    lineHeight: 40,
    color: Colors.onSurface,
  },
  titleMd: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: 18, // 1.125rem
    lineHeight: 26,
    color: Colors.onSurface,
  },
  bodyLg: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: 16, // 1rem
    lineHeight: 26, // 1.6x
    color: Colors.onSurface,
  },
  bodyMd: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: 14, // 0.875rem
    lineHeight: 22,
    color: Colors.onSurfaceVariant,
  },
  labelMd: {
    fontFamily: 'BeVietnamPro_500Medium',
    fontSize: 12, // 0.75rem
    letterSpacing: 0.5,
    color: Colors.onSurface,
  },
  labelSm: {
    fontFamily: 'BeVietnamPro_500Medium',
    fontSize: 11, // 0.6875rem
    letterSpacing: 0.5,
    color: Colors.onSurfaceVariant,
  },
});

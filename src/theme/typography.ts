import { TextStyle } from 'react-native';

// Weight comes from which Figtree face is selected, never from `fontWeight` —
// `fontWeight` is unreliable on Android with a custom typeface.
export const FontFamily = {
  light: 'Figtree-Light',
  regular: 'Figtree-Regular',
  medium: 'Figtree-Medium',
  semiBold: 'Figtree-SemiBold',
  bold: 'Figtree-Bold',
} as const;

// Map legacy numeric `fontWeight` values to a Figtree face.
export const weightToFamily: Record<string, string> = {
  '300': FontFamily.light,
  '400': FontFamily.regular,
  '500': FontFamily.medium,
  '600': FontFamily.semiBold,
  '700': FontFamily.bold,
  '800': FontFamily.bold,
};

export const fontAssets = {
  [FontFamily.light]: require('@/assets/fonts/Figtree-Light.ttf'),
  [FontFamily.regular]: require('@/assets/fonts/Figtree-Regular.ttf'),
  [FontFamily.medium]: require('@/assets/fonts/Figtree-Medium.ttf'),
  [FontFamily.semiBold]: require('@/assets/fonts/Figtree-SemiBold.ttf'),
  [FontFamily.bold]: require('@/assets/fonts/Figtree-Bold.ttf'),
};

type TextVariant =
  | 'heading1'
  | 'heading2'
  | 'body'
  | 'bodyMedium'
  | 'bodySemiBold'
  | 'caption'
  | 'button';

export const Typography: Record<TextVariant, TextStyle> = {
  heading1: { fontFamily: FontFamily.bold, fontSize: 22, lineHeight: 28 },
  heading2: { fontFamily: FontFamily.bold, fontSize: 18, lineHeight: 24 },
  body: { fontFamily: FontFamily.regular, fontSize: 14, lineHeight: 20 },
  bodyMedium: { fontFamily: FontFamily.medium, fontSize: 14, lineHeight: 20 },
  bodySemiBold: { fontFamily: FontFamily.semiBold, fontSize: 14, lineHeight: 20 },
  caption: { fontFamily: FontFamily.regular, fontSize: 11, lineHeight: 14 },
  button: { fontFamily: FontFamily.semiBold, fontSize: 13, lineHeight: 18 },
};

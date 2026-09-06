import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { FontFamily } from '@/theme/typography';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors, FontSize, Spacing } from '@/utils/constants';

interface NotServiceableViewProps {
  message: string;
  onRetry?: () => void;
  /** When rendered under the compact header, skip the top safe-area padding. */
  embedded?: boolean;
}

export function NotServiceableView({ message, onRetry, embedded = false }: NotServiceableViewProps) {
  const insets = useSafeAreaInsets();

  // A quiet sob — the teary face gives a small shudder every few beats.
  const enter = useSharedValue(0);
  const sob = useSharedValue(0);

  useEffect(() => {
    enter.value = withTiming(1, { duration: 500, easing: Easing.out(Easing.cubic) });
    sob.value = withDelay(
      400,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 220, easing: Easing.out(Easing.quad) }),
          withTiming(0, { duration: 1500, easing: Easing.inOut(Easing.quad) }),
          withDelay(1800, withTiming(0, { duration: 0 })),
        ),
        -1,
        false,
      ),
    );
  }, [enter, sob]);

  const faceStyle = useAnimatedStyle(() => ({
    opacity: enter.value,
    transform: [
      { translateY: (1 - enter.value) * -12 },
      { scale: (0.9 + enter.value * 0.1) * (1 + sob.value * 0.06) },
      { rotate: `${sob.value * 3}deg` },
    ],
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: enter.value,
    transform: [{ translateY: (1 - enter.value) * 10 }],
  }));

  return (
    <View
      style={[
        styles.wrap,
        { paddingTop: embedded ? 0 : insets.top, paddingBottom: insets.bottom },
      ]}
    >
      <Animated.Text style={[styles.emoji, faceStyle]}>🥹</Animated.Text>

      <Animated.View style={[styles.textBlock, textStyle]}>
        <Text style={styles.title}>We haven&apos;t reached your street yet</Text>
        <Text style={styles.message}>
          {message || 'Tap the location up top to pick an area we deliver to.'}
        </Text>
      </Animated.View>

      {onRetry ? (
        <Pressable style={styles.retryButton} onPress={onRetry}>
          <Text style={styles.retryText}>Change location</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xxl,
    gap: Spacing.sm,
    backgroundColor: Colors.background,
  },
  emoji: {
    fontSize: 56,
    marginBottom: Spacing.lg,
  },
  textBlock: {
    alignItems: 'center',
    gap: Spacing.xs,
  },
  title: {
    fontSize: FontSize.xl,
    fontFamily: FontFamily.bold,
    color: Colors.text,
    textAlign: 'center',
  },
  message: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 21,
  },
  retryButton: {
    marginTop: Spacing.lg,
    backgroundColor: Colors.brand,
    paddingHorizontal: Spacing.xl,
    height: 44,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  retryText: {
    color: '#fff',
    fontFamily: FontFamily.bold,
    fontSize: FontSize.md,
  },
});

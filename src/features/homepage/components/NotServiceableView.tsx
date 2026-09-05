import { Pressable, StyleSheet, Text, View } from 'react-native';
import { FontFamily } from '@/theme/typography';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors, FontSize, Spacing } from '@/utils/constants';

interface NotServiceableViewProps {
  message: string;
  onRetry?: () => void;
}

export function NotServiceableView({ message, onRetry }: NotServiceableViewProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrap, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <Text style={styles.emoji}>📍</Text>
      <Text style={styles.title}>We&apos;re not in your area yet</Text>
      <Text style={styles.message}>{message}</Text>
      {onRetry ? (
        <Pressable style={styles.retryButton} onPress={onRetry}>
          <Text style={styles.retryText}>Try again</Text>
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
    fontSize: 48,
    marginBottom: Spacing.md,
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

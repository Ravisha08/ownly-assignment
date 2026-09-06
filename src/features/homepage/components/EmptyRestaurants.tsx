import { MotiView } from 'moti';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { FontFamily } from '@/theme/typography';
import { Colors, Radius, Spacing } from '@/utils/constants';

/**
 * Playful empty state for when the active filters knock the "All restaurants"
 * list down to zero. Pure Views + emoji (no illustration asset in the bundle):
 * a floating plate with an "uh oh" wobble and two orbiting sparkles.
 */
export function EmptyRestaurants({ onReset }: { onReset: () => void }) {
  return (
    <View style={styles.wrap}>
      <View style={styles.stage}>
        <MotiView
          from={{ translateY: -6, rotateZ: '-6deg' }}
          animate={{ translateY: 6, rotateZ: '6deg' }}
          transition={{ type: 'timing', duration: 1600, loop: true, repeatReverse: true }}
          style={styles.plateWrap}
        >
          <View style={styles.plate}>
            <Text style={styles.plateEmoji}>🍽️</Text>
          </View>
        </MotiView>

        <MotiView
          from={{ opacity: 0.2, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'timing', duration: 900, loop: true, repeatReverse: true }}
          style={[styles.sparkle, styles.sparkleTopRight]}
        >
          <Text style={styles.sparkleText}>✨</Text>
        </MotiView>
        <MotiView
          from={{ opacity: 1, scale: 1 }}
          animate={{ opacity: 0.2, scale: 0.6 }}
          transition={{ type: 'timing', duration: 1200, loop: true, repeatReverse: true }}
          style={[styles.sparkle, styles.sparkleBottomLeft]}
        >
          <Text style={styles.sparkleText}>🫙</Text>
        </MotiView>
      </View>

      <Text style={styles.title}>Uh oh, nothing on the menu</Text>
      <Text style={styles.body}>
        Your filters got a little too picky. Loosen them up and we'll find you something tasty.
      </Text>

      <Pressable style={styles.button} onPress={onReset}>
        <Text style={styles.buttonText}>Clear all filters</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xxl,
    paddingBottom: Spacing.xl,
    alignItems: 'center',
  },
  stage: {
    width: 140,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  plateWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  plate: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: Colors.surfaceMuted,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plateEmoji: {
    fontSize: 40,
  },
  sparkle: {
    position: 'absolute',
  },
  sparkleTopRight: {
    top: 4,
    right: 12,
  },
  sparkleBottomLeft: {
    bottom: 6,
    left: 10,
  },
  sparkleText: {
    fontSize: 20,
  },
  title: {
    fontFamily: FontFamily.semiBold,
    fontSize: 16,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  body: {
    fontFamily: FontFamily.regular,
    fontSize: 13,
    lineHeight: 19,
    color: Colors.textSecondary,
    textAlign: 'center',
    maxWidth: 260,
    marginBottom: Spacing.xl,
  },
  button: {
    backgroundColor: Colors.brand,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: Radius.pill,
  },
  buttonText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 13,
    color: '#FFFFFF',
  },
});

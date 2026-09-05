import { Pressable, StyleSheet, Text } from 'react-native';
import { FontFamily } from '@/theme/typography';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';

import { Colors, FontSize, Radius, Shadow } from '@/utils/constants';

export function BackToTopButton({ visible, onPress }: { visible: boolean; onPress: () => void }) {
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: withTiming(visible ? 1 : 0, { duration: 200 }),
    transform: [{ translateY: withTiming(visible ? 0 : 16, { duration: 200 }) }],
  }));

  return (
    <Animated.View pointerEvents={visible ? 'auto' : 'none'} style={[styles.wrap, animatedStyle]}>
      <Pressable style={styles.button} onPress={onPress}>
        <Text style={styles.arrow}>↑</Text>
        <Text style={styles.label}>Back to top</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    bottom: 24,
    alignSelf: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.text,
    paddingHorizontal: 18,
    height: 44,
    borderRadius: Radius.pill,
    ...Shadow.floating,
  },
  arrow: {
    color: '#fff',
    fontFamily: FontFamily.bold,
  },
  label: {
    color: '#fff',
    fontFamily: FontFamily.bold,
    fontSize: FontSize.sm,
  },
});

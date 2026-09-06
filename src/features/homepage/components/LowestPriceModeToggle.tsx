import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { FontFamily } from '@/theme/typography';

interface LowestPriceModeToggleProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
}

const HEIGHT = 42;
const KNOB_WIDTH = 84;
const TRAIL = 32; // exposed state zone beside the knob
const TRACK_WIDTH = KNOB_WIDTH + TRAIL;
const TRAVEL = TRAIL;
const SPRING = { damping: 20, stiffness: 200, mass: 0.9 } as const;

const TRACK_OFF = '#D9D9D9';
const TRACK_ON = '#F7CBDF';
const BRAND = '#E8175D';
const SHADOW_PINK = '#C71585'; // dark hot pink

export function LowestPriceModeToggle({ value, onValueChange }: LowestPriceModeToggleProps) {
  // Explicit deps: React Compiler + Reanimated on Android won't reliably
  // re-run the worklet from an auto-detected `value` capture otherwise.
  const trackStyle = useAnimatedStyle(
    () => ({
      backgroundColor: withTiming(value ? TRACK_ON : TRACK_OFF, { duration: 220 }),
    }),
    [value],
  );

  const ringStyle = useAnimatedStyle(
    () => ({ opacity: withTiming(value ? 1 : 0, { duration: 220 }) }),
    [value],
  );

  const haloStyle = useAnimatedStyle(
    () => ({
      opacity: withTiming(value ? 1 : 0, { duration: 200 }),
      transform: [
        { translateX: withSpring(value ? TRAVEL : 0, SPRING) },
        { scale: withTiming(value ? 1 : 0.9, { duration: 200 }) },
      ],
    }),
    [value],
  );

  const knobStyle = useAnimatedStyle(
    () => ({
      transform: [{ translateX: withSpring(value ? TRAVEL : 0, SPRING) }],
      borderColor: withTiming(value ? '#F4BAD3' : '#E9E9E9', { duration: 220 }),
      // lifted with a drop shadow while off, settles flat when on
      shadowOpacity: withTiming(value ? 0 : 0.22, { duration: 200 }),
      elevation: withTiming(value ? 0 : 4, { duration: 200 }),
    }),
    [value],
  );

  const offLabelStyle = useAnimatedStyle(
    () => ({ opacity: withTiming(value ? 0 : 1, { duration: 150 }) }),
    [value],
  );
  const onLabelStyle = useAnimatedStyle(
    () => ({
      opacity: withTiming(value ? 1 : 0, { duration: 180 }),
      transform: [{ scale: withTiming(value ? 1 : 0.8, { duration: 180 }) }],
    }),
    [value],
  );

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
      accessibilityLabel="Lowest price mode"
      hitSlop={8}
      style={({ pressed }) => [styles.pressable, pressed && styles.pressed]}
      onPress={() => onValueChange(!value)}>
      <Animated.View style={[styles.track, trackStyle]}>
        <Animated.View style={[styles.ring, ringStyle]} pointerEvents="none" />

        <Animated.Text style={[styles.stateOff, offLabelStyle]}>Off</Animated.Text>

        <Animated.View style={[styles.onWrap, onLabelStyle]} pointerEvents="none">
          <View style={styles.sparkRow}>
            <View style={[styles.spark, styles.sparkLeft]} />
            <View style={styles.spark} />
            <View style={[styles.spark, styles.sparkRight]} />
          </View>
          <Text style={styles.onText}>On</Text>
        </Animated.View>

        <Animated.View style={[styles.halo, haloStyle]} pointerEvents="none" />

        <Animated.View style={[styles.knob, knobStyle]}>
          <Text style={styles.line} numberOfLines={1} adjustsFontSizeToFit>
            LOWEST
          </Text>
          <Text style={styles.line} numberOfLines={1} adjustsFontSizeToFit>
            PRICE MODE
          </Text>
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
}

const KNOB_H = HEIGHT;

const styles = StyleSheet.create({
  pressable: {
    alignSelf: 'flex-start',
  },
  pressed: {
    opacity: 0.92,
  },
  track: {
    width: TRACK_WIDTH,
    height: HEIGHT,
    borderRadius: 100,
    justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 100,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.65)',
  },
  stateOff: {
    position: 'absolute',
    right: 11,
    fontFamily: FontFamily.bold,
    fontSize: 10,
    color: '#666666',
  },
  onWrap: {
    position: 'absolute',
    left: 9,
    alignItems: 'center',
  },
  sparkRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 3,
    height: 7,
    marginBottom: 1,
  },
  spark: {
    width: 1.5,
    height: 6,
    borderRadius: 1,
    backgroundColor: '#FFFFFF',
  },
  sparkLeft: {
    height: 4,
    transform: [{ rotate: '-30deg' }],
  },
  sparkRight: {
    height: 4,
    transform: [{ rotate: '30deg' }],
  },
  onText: {
    fontFamily: FontFamily.bold,
    fontSize: 11,
    color: BRAND,
  },
  halo: {
    position: 'absolute',
    left: 0,
    width: KNOB_WIDTH,
    height: KNOB_H,
    borderRadius: 100,
    backgroundColor: '#FFFFFF',
    shadowColor: SHADOW_PINK,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.7,
    shadowRadius: 9,
    elevation: 8,
  },
  knob: {
    width: KNOB_WIDTH,
    height: KNOB_H,
    borderRadius: 100,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E9E9E9',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
  },
  line: {
    fontFamily: FontFamily.bold,
    fontSize: 10,
    lineHeight: 13,
    letterSpacing: 0,
    color: '#666666',
    textAlign: 'center',
  },
});

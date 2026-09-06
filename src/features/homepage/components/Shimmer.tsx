import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { Radius } from '@/utils/constants';

const BASE = '#E4E4E7';
const HIGHLIGHT = '#F2F2F4';
const SWEEP = 2.2; // gradient band is this many multiples of the bone width

interface ShimmerProps {
  width: ViewStyle['width'];
  height: number;
  radius?: number;
  style?: ViewStyle;
}

/** A grey placeholder block with a looping left-to-right sheen.
 *  Built directly on Reanimated 4 (Moti's Skeleton loop doesn't tick on RN
 *  Reanimated 4). */
export function Shimmer({ width, height, radius = Radius.md, style }: ShimmerProps) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(withTiming(1, { duration: 1400 }), -1, false);
    return () => cancelAnimation(progress);
  }, [progress]);

  const sheenStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: `${-SWEEP * 100 + progress.value * (100 + SWEEP * 100)}%` },
    ],
  }));

  return (
    <View
      style={[{ width, height, borderRadius: radius, backgroundColor: BASE }, styles.clip, style]}
    >
      <Animated.View style={[styles.sheen, { width: `${SWEEP * 100}%` }, sheenStyle]}>
        <LinearGradient
          colors={['rgba(242,242,244,0)', HIGHLIGHT, 'rgba(242,242,244,0)']}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  clip: { overflow: 'hidden' },
  sheen: { position: 'absolute', top: 0, bottom: 0, left: 0 },
});

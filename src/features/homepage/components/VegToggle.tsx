import { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';

interface VegToggleProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
}

const TRACK_W = 34;
const TRACK_H = 20;
const PAD = 2;
const KNOB = TRACK_H - PAD * 2;
const TRAVEL = TRACK_W - KNOB - PAD * 2;

export function VegToggle({ value, onValueChange }: VegToggleProps) {
  const anim = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: value ? 1 : 0,
      duration: 160,
      useNativeDriver: true,
    }).start();
  }, [value, anim]);

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
      accessibilityLabel="Veg only"
      hitSlop={16}
      onPress={() => onValueChange(!value)}>
      <View style={[styles.track, { backgroundColor: value ? '#7CD98A' : '#E3E0E6' }]}>
        <Animated.View
          style={[
            styles.knob,
            {
              transform: [
                { translateX: anim.interpolate({ inputRange: [0, 1], outputRange: [0, TRAVEL] }) },
              ],
            },
          ]}
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  track: {
    width: TRACK_W,
    height: TRACK_H,
    borderRadius: TRACK_H / 2,
    padding: PAD,
    justifyContent: 'center',
  },
  knob: {
    width: KNOB,
    height: KNOB,
    borderRadius: KNOB / 2,
    backgroundColor: '#fff',
    shadowColor: '#1A1023',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
});

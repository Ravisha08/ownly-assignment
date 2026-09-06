import { Image } from 'expo-image';
import { FontFamily } from '@/theme/typography';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  SharedValue,
  useAnimatedReaction,
  useAnimatedRef,
  useAnimatedScrollHandler,
  scrollTo,
} from 'react-native-reanimated';

import { Colors, Spacing } from '@/utils/constants';
import type { CuratedListDetail } from '@/types/fixtures';

export function CravingGrid({
  items,
  showTitle = true,
  scrollX,
  active,
}: {
  items: CuratedListDetail[];
  showTitle?: boolean;
  // Shared horizontal offset so the in-list rail and its stuck overlay twin
  // stay at the same scroll position when one takes over from the other.
  scrollX?: SharedValue<number>;
  active?: SharedValue<boolean>;
}) {
  const ref = useAnimatedRef<Animated.ScrollView>();

  const handler = useAnimatedScrollHandler({
    onScroll: (e) => {
      if (scrollX) scrollX.value = e.contentOffset.x;
    },
  });

  useAnimatedReaction(
    () => scrollX?.value ?? 0,
    (x) => {
      // Only follow the shared value when this twin isn't the one being dragged.
      if (active && active.value) return;
      scrollTo(ref, x, 0, false);
    },
  );

  return (
    <View style={styles.wrap}>
      {showTitle ? <Text style={styles.title}>What are you craving today?</Text> : null}
      <Animated.ScrollView
        ref={ref}
        horizontal
        onScroll={handler}
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
        decelerationRate="normal">
        {items.map((item) => (
          <View key={item.id} style={styles.item}>
            <Image source={{ uri: item.imageUrl }} style={styles.image} contentFit="cover" transition={150} />
            <Text style={styles.label} numberOfLines={1}>
              {item.name}
            </Text>
          </View>
        ))}
      </Animated.ScrollView>
    </View>
  );
}

const IMAGE_SIZE = 64;

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: Colors.background,
  },
  title: {
    fontSize: 14,
    fontFamily: FontFamily.semiBold,
    color: '#333333',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  list: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.lg,
  },
  item: {
    alignItems: 'center',
    width: IMAGE_SIZE + 12,
  },
  image: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: IMAGE_SIZE / 2,
  },
  label: {
    marginTop: 6,
    fontSize: 12,
    fontFamily: FontFamily.semiBold,
    color: '#666666',
  },
});

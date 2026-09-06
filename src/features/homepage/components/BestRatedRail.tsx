import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { FontFamily } from '@/theme/typography';

import { BestRatedCard } from '@/features/homepage/components/BestRatedCard';
import { Spacing } from '@/utils/constants';
import type { RestaurantEntity } from '@/types/fixtures';

export function BestRatedRail({ items }: { items: RestaurantEntity[] }) {
  if (!items.length) return null;
  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>Best rated restos near you!</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
        decelerationRate="normal">
        {items.map((item) => (
          <BestRatedCard key={item.entityId} item={item} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: Spacing.xxxl,
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
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.lg,
    gap: Spacing.md,
  },
});

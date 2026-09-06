import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { FontFamily } from '@/theme/typography';

import { ReorderCard } from '@/features/homepage/components/ReorderCard';
import { Spacing } from '@/utils/constants';
import type { RestaurantEntity } from '@/types/fixtures';

export function ReorderRail({ items }: { items: RestaurantEntity[] }) {
  if (!items.length) return null;
  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>Order Again!</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
        decelerationRate="normal">
        {items.map((item) => (
          <ReorderCard key={item.entityId} item={item} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: Spacing.xxl,
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

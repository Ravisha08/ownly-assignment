import { StyleSheet, Text, View } from 'react-native';
import { FontFamily } from '@/theme/typography';

import { Colors, FontSize, Radius, Spacing } from '@/utils/constants';
import type { Rating } from '@/types/fixtures';

function formatCount(count: number) {
  if (count >= 1000) return `${(count / 1000).toFixed(count % 1000 >= 100 ? 1 : 0)}k+`;
  return `${count}`;
}

export function RatingPill({ rating, compact }: { rating?: Rating; compact?: boolean }) {
  if (!rating || !rating.value) return null;
  return (
    <View style={styles.wrap}>
      <View style={styles.badge}>
        <Text style={styles.star}>★</Text>
        <Text style={styles.value}>{rating.value.toFixed(1)}</Text>
      </View>
      {!compact ? <Text style={styles.count}>({formatCount(rating.count)})</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: Colors.rating,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.sm,
  },
  star: {
    color: '#fff',
    fontSize: FontSize.xs,
  },
  value: {
    color: '#fff',
    fontSize: FontSize.xs,
    fontFamily: FontFamily.bold,
  },
  count: {
    color: Colors.textMuted,
    fontSize: FontSize.xs,
  },
});

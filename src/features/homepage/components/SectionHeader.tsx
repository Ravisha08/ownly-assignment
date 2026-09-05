import { Pressable, StyleSheet, Text, View } from 'react-native';
import { FontFamily } from '@/theme/typography';

import { Colors, FontSize, Spacing } from '@/utils/constants';

interface SectionHeaderProps {
  title: string;
  onSeeAll?: () => void;
  style?: object;
}

export function SectionHeader({ title, onSeeAll, style }: SectionHeaderProps) {
  return (
    <View style={[styles.row, style]}>
      <Text style={styles.title}>{title}</Text>
      {onSeeAll ? (
        <Pressable hitSlop={8} onPress={onSeeAll}>
          <Text style={styles.seeAll}>See all ›</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: FontSize.xl,
    fontFamily: FontFamily.bold,
    color: Colors.text,
  },
  seeAll: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.semiBold,
    color: Colors.brand,
  },
});

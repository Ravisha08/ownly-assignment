import { StyleSheet, View } from 'react-native';
import type { SharedValue } from 'react-native-reanimated';

import { CravingGrid } from '@/features/homepage/components/CravingGrid';
import { Colors, Spacing } from '@/utils/constants';
import type { CuratedListDetail } from '@/types/fixtures';

export function DiscoverBarContent({
  items,
  showTitle = true,
  scrollX,
  active,
}: {
  items: CuratedListDetail[];
  showTitle?: boolean;
  scrollX?: SharedValue<number>;
  active?: SharedValue<boolean>;
}) {
  return (
    <View style={styles.wrap}>
      <CravingGrid items={items} showTitle={showTitle} scrollX={scrollX} active={active} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: Colors.background,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.lg,
  },
});

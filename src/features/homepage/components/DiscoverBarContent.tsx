import { StyleSheet, View } from 'react-native';

import { CravingGrid } from '@/features/homepage/components/CravingGrid';
import { Colors, Spacing } from '@/utils/constants';
import type { CuratedListDetail } from '@/types/fixtures';

export function DiscoverBarContent({
  items,
  showTitle = true,
}: {
  items: CuratedListDetail[];
  showTitle?: boolean;
}) {
  return (
    <View style={styles.wrap}>
      <CravingGrid items={items} showTitle={showTitle} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: Colors.background,
    paddingVertical: Spacing.lg,
  },
});

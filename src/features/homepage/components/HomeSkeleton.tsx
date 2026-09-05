import { Skeleton } from 'moti/skeleton';
import { StyleSheet, View } from 'react-native';

import { Colors, Radius, Spacing } from '@/utils/constants';

export function HomeSkeleton() {
  return (
    <View style={styles.wrap}>
      <Skeleton colorMode="light" radius={Radius.xl} height={220} width="100%" />
      <View style={styles.row}>
        <Skeleton colorMode="light" radius={Radius.lg} height={130} width="48%" />
        <Skeleton colorMode="light" radius={Radius.lg} height={130} width="48%" />
      </View>
      <View style={styles.row}>
        <Skeleton colorMode="light" radius={32} height={64} width={64} />
        <Skeleton colorMode="light" radius={32} height={64} width={64} />
        <Skeleton colorMode="light" radius={32} height={64} width={64} />
        <Skeleton colorMode="light" radius={32} height={64} width={64} />
      </View>
      <Skeleton colorMode="light" radius={Radius.lg} height={200} width="100%" />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    padding: Spacing.lg,
    gap: Spacing.xl,
    backgroundColor: Colors.background,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

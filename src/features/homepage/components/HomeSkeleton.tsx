import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { Shimmer } from '@/features/homepage/components/Shimmer';
import { Colors, Radius, Spacing } from '@/utils/constants';

function Bone({
  width,
  height,
  radius,
}: {
  width: ViewStyle['width'];
  height: number;
  radius?: number;
}) {
  return <Shimmer width={width} height={height} radius={radius} />;
}

function Row({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.row, style]}>{children}</View>;
}

/** All-grey loading state that mirrors the real feed top to bottom:
 *  hero (location / search / banner), reorder rail, craving circles, a meal
 *  rail, a curated rail, the filter bar, then restaurant cards. */
export function HomeSkeleton({ showHero = true }: { showHero?: boolean }) {
  return (
    <ScrollView
      scrollEnabled={false}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.content}
    >
      {/* Hero */}
      {showHero ? (
        <View style={styles.section}>
          <Row style={styles.gap}>
            <View style={styles.grow}>
              <Bone width={120} height={16} radius={4} />
              <View style={styles.h4} />
              <Bone width={170} height={11} radius={4} />
            </View>
            <Bone width={30} height={30} radius={999} />
            <Bone width={34} height={34} radius={999} />
          </Row>

          <Row style={[styles.gap, styles.mt16]}>
            <Bone width="100%" height={44} radius={Radius.pill} />
          </Row>
          <View style={styles.mt12}>
            <Bone width="100%" height={150} radius={Radius.lg} />
          </View>
        </View>
      ) : null}

      {/* Reorder rail */}
      <Section titleWidth={140}>
        <Bone width={150} height={90} radius={Radius.lg} />
        <Bone width={150} height={90} radius={Radius.lg} />
        <Bone width={80} height={90} radius={Radius.lg} />
      </Section>

      {/* Craving circles */}
      <View style={styles.section}>
        <Bone width={200} height={14} radius={4} />
        <Row style={[styles.railRow, styles.clip]}>
          {[0, 1, 2, 3, 4].map((i) => (
            <View key={i} style={styles.center}>
              <Bone width={62} height={62} radius={999} />
              <View style={styles.h6} />
              <Bone width={46} height={9} radius={4} />
            </View>
          ))}
        </Row>
      </View>

      {/* Meal-for-one rail */}
      <Section titleWidth={160}>
        <Bone width={160} height={120} radius={Radius.lg} />
        <Bone width={160} height={120} radius={Radius.lg} />
        <Bone width={70} height={120} radius={Radius.lg} />
      </Section>

      {/* Curated rail */}
      <Section titleWidth={180}>
        <Bone width={220} height={150} radius={Radius.lg} />
        <Bone width={120} height={150} radius={Radius.lg} />
      </Section>

      {/* All restaurants + filter bar */}
      <View style={styles.section}>
        <Bone width={130} height={14} radius={4} />
        <Row style={[styles.filterRow, styles.clip]}>
          <Bone width={70} height={32} radius={Radius.pill} />
          <Bone width={90} height={32} radius={Radius.pill} />
          <Bone width={80} height={32} radius={Radius.pill} />
        </Row>
      </View>

      {/* Restaurant cards */}
      <View style={styles.cards}>
        {[0, 1, 2].map((i) => (
          <View key={i}>
            <Bone width="100%" height={180} radius={Radius.lg} />
            <View style={styles.h8} />
            <Bone width="60%" height={14} radius={4} />
            <View style={styles.h6} />
            <Bone width="40%" height={11} radius={4} />
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

function Section({ titleWidth, children }: { titleWidth: number; children: ReactNode }) {
  return (
    <View style={styles.section}>
      <Bone width={titleWidth} height={14} radius={4} />
      <Row style={[styles.railRow, styles.clip]}>{children}</Row>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    backgroundColor: Colors.background,
    paddingBottom: Spacing.xxxl,
  },
  grow: { flex: 1 },
  center: { alignItems: 'center' },
  clip: { overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center' },
  gap: { gap: Spacing.sm },
  mt12: { marginTop: Spacing.md },
  mt16: { marginTop: Spacing.lg },
  h4: { height: Spacing.xs },
  h6: { height: 6 },
  h8: { height: Spacing.sm },
  section: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
  },
  railRow: {
    marginTop: Spacing.md,
    gap: Spacing.md,
  },
  filterRow: {
    marginTop: Spacing.md,
    gap: Spacing.sm,
  },
  cards: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    gap: Spacing.xl,
  },
});

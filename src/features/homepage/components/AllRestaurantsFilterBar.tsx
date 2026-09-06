import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { FontFamily } from '@/theme/typography';
import { Spacing } from '@/utils/constants';

const chevronDown = require('@/assets/images/arrow_down.png');
const googleIcon = require('@/assets/images/google.png');
const starIcon = require('@/assets/images/star.png');

const TEXT_COLOR = '#333333';
const BORDER_COLOR = '#E9E9E9';
const RATING_COLOR = '#17A821';

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <Pressable style={styles.chip}>
      <View style={styles.chipInner}>{children}</View>
    </Pressable>
  );
}

export function AllRestaurantsFilterBar({
  showHeading = true,
  sticky = false,
}: {
  showHeading?: boolean;
  sticky?: boolean;
}) {
  return (
    <View style={styles.wrap}>
      {showHeading ? <Text style={styles.heading}>All restaurants</Text> : null}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        <Chip>
          <Text style={styles.label}>Sort by</Text>
          <Image source={chevronDown} style={styles.chevron} resizeMode="contain" />
        </Chip>
        <Chip>
          {sticky ? (
            <>
              <View style={styles.ratingDot} />
              <Text style={styles.label}>Rating 4+</Text>
            </>
          ) : (
            <>
              <Image source={googleIcon} style={styles.google} resizeMode="contain" />
              <Image source={starIcon} style={styles.star} resizeMode="contain" />
              <Text style={styles.rating}>4+</Text>
            </>
          )}
        </Chip>
        <Chip>
          <Text style={styles.label}>Under 30 mins</Text>
        </Chip>
        <Chip>
          <Text style={styles.label}>Under ₹200</Text>
        </Chip>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: Spacing.md,
  },
  heading: {
    fontFamily: FontFamily.semiBold,
    fontSize: 14,
    color: TEXT_COLOR,
    paddingHorizontal: Spacing.lg,
  },
  row: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
  },
  chip: {
    height: 30,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  chipInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  label: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    color: TEXT_COLOR,
  },
  chevron: {
    width: 10,
    height: 10,
  },
  google: {
    width: 14,
    height: 14,
  },
  star: {
    width: 12,
    height: 12,
  },
  rating: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    color: RATING_COLOR,
  },
  ratingDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: RATING_COLOR,
  },
});

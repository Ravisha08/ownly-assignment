import { FontFamily } from '@/theme/typography';
import { LinearGradient } from 'expo-linear-gradient';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { CARD_WIDTH, FoodItemCard } from '@/features/homepage/components/FoodItemCard';
import type { FoodItem } from '@/types/fixtures';
import { Spacing } from '@/utils/constants';

interface MealForOneRailProps {
  title?: string;
  items: FoodItem[];
}

export function MealForOneRail({ items }: MealForOneRailProps) {
  if (!items.length) return null;
  return (
    <LinearGradient
      colors={['#F7ECDF', '#FCFCFC']}
      start={{ x: 0.9, y: 1 }}
      end={{ x: 0.2, y: 0 }}
      style={styles.wrap}>
      <View style={styles.header}>
        <Image
          source={require('@/assets/images/topdeals.png')}
          style={styles.topDealsImage}
          resizeMode="contain"
        />
        <Pressable hitSlop={8} onPress={() => {}} style={styles.seeAllPress}>
          <LinearGradient
            colors={['#FFFFFF', '#FFFFFF', '#F9F3EC']}
            locations={[0, 0.7, 1]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.seeAllPill}>
            <Text style={styles.seeAllText}>See all</Text>
            <Image
              source={require('@/assets/images/arrow_right.png')}
              style={styles.seeAllChevron}
              resizeMode="contain"
            />
          </LinearGradient>
        </Pressable>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scroll}
        contentContainerStyle={styles.list}
        decelerationRate="fast"
        snapToInterval={CARD_WIDTH + 16}>
        {items.map((item) => (
          <FoodItemCard key={item.foodItemId} item={item} />
        ))}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: Spacing.xxxl,
    marginHorizontal: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 24,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  topDealsImage: {
    width: 98,
    height: 70,
  },
  seeAllPress: {
    marginRight: -16,
  },
  seeAllPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingLeft: 18,
    paddingRight: 16,
    paddingVertical: 10,
    borderTopLeftRadius: 32,
    borderBottomLeftRadius: 32,
  },
  seeAllText: {
    fontSize: 14,
    fontFamily: FontFamily.bold,
    color: '#FF297D',
  },
  seeAllChevron: {
    width: 10,
    height: 10,
    tintColor: '#FF297D',
  },
  scroll: {
    marginHorizontal: -16,
  },
  list: {
    paddingTop: Spacing.md,
    paddingHorizontal: 16,
    gap: 16,
  },
});

import { useRef } from 'react';
import {
  Image,
  type LayoutRectangle,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, { useAnimatedStyle, type SharedValue } from 'react-native-reanimated';

import {
  SORT_OPTIONS,
  type RestaurantFilters,
  type ToggleKey,
} from '@/features/homepage/hooks/useRestaurantFilters';
import { FontFamily } from '@/theme/typography';
import { Spacing } from '@/utils/constants';

const chevronDown = require('@/assets/images/arrow_down.png');
const googleIcon = require('@/assets/images/google.png');
const starIcon = require('@/assets/images/star.png');

const TEXT_COLOR = '#333333';
const BORDER_COLOR = '#E9E9E9';
const RATING_COLOR = '#17A821';
const ACTIVE_BG = '#FDE7EE';
const ACTIVE_BORDER = '#E8175D';

function Chip({
  children,
  active,
  onPress,
  onLayout,
}: {
  children: React.ReactNode;
  active?: boolean;
  onPress?: () => void;
  onLayout?: (rect: LayoutRectangle) => void;
}) {
  return (
    <Pressable
      style={[styles.chip, active && styles.chipActive]}
      onPress={onPress}
      onLayout={onLayout ? (event) => onLayout(event.nativeEvent.layout) : undefined}
    >
      <View style={styles.chipInner}>{children}</View>
    </Pressable>
  );
}

// Cross-fades the Google "★ 4+" rating between the free-scrolling state and the
// stuck filter bar's "● Rating 4+" chip. `progress`: 0 = Google, 1 = stuck.
function RatingChip({
  progress,
  active,
  onPress,
  onLayout,
}: {
  progress?: SharedValue<number>;
  active?: boolean;
  onPress?: () => void;
  onLayout?: (rect: LayoutRectangle) => void;
}) {
  const googleStyle = useAnimatedStyle(() => ({ opacity: progress ? 1 - progress.value : 1 }));
  const stuckStyle = useAnimatedStyle(() => ({ opacity: progress ? progress.value : 0 }));

  // No progress (free-scrolling twin): render just the Google layout in flow.
  if (!progress) {
    return (
      <Chip active={active} onPress={onPress} onLayout={onLayout}>
        <View style={styles.ratingLayout}>
          <Image source={googleIcon} style={styles.google} resizeMode="contain" />
          <Image source={starIcon} style={styles.star} resizeMode="contain" />
          <Text style={styles.rating}>4+</Text>
        </View>
      </Chip>
    );
  }

  return (
    <Chip active={active} onPress={onPress} onLayout={onLayout}>
      {/* stuck layout drives the chip width; Google layout floats over it */}
      <Animated.View style={[styles.ratingLayout, stuckStyle]}>
        <View style={styles.ratingDot} />
        <Text style={[styles.label, active && styles.labelActive]}>Rating 4+</Text>
      </Animated.View>
      <Animated.View style={[styles.ratingLayout, styles.ratingOverlay, googleStyle]}>
        <Image source={googleIcon} style={styles.google} resizeMode="contain" />
        <Image source={starIcon} style={styles.star} resizeMode="contain" />
        <Text style={styles.rating}>4+</Text>
      </Animated.View>
    </Chip>
  );
}

export function AllRestaurantsFilterBar({
  showHeading = true,
  progress,
  filters,
  sortMenuOpen = false,
  onToggleSortMenu,
}: {
  showHeading?: boolean;
  progress?: SharedValue<number>;
  filters?: RestaurantFilters;
  sortMenuOpen?: boolean;
  onToggleSortMenu?: () => void;
}) {
  const sortActive = filters ? filters.sort !== 'relevance' : false;
  const sortLabel = SORT_OPTIONS.find((option) => option.key === filters?.sort)?.label;

  const scrollRef = useRef<ScrollView>(null);
  const layouts = useRef<Record<string, LayoutRectangle>>({});
  const scrollX = useRef(0);
  const viewport = useRef(0);

  // Nudge the horizontal chip strip so a just-selected chip isn't clipped by the
  // viewport edge.
  const revealChip = (key: string) => {
    const rect = layouts.current[key];
    if (!rect || !viewport.current) return;
    const pad = Spacing.lg;
    const visibleStart = scrollX.current;
    const visibleEnd = scrollX.current + viewport.current;
    if (rect.x + rect.width + pad > visibleEnd) {
      scrollRef.current?.scrollTo({ x: rect.x + rect.width + pad - viewport.current, animated: true });
    } else if (rect.x - pad < visibleStart) {
      scrollRef.current?.scrollTo({ x: Math.max(0, rect.x - pad), animated: true });
    }
  };

  const toggle = (key: ToggleKey) => {
    filters?.toggle(key);
    if (!filters?.toggles[key]) revealChip(key);
  };

  return (
    <View style={styles.wrap}>
      {showHeading ? <Text style={styles.heading}>All restaurants</Text> : null}
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
        scrollEventThrottle={16}
        onLayout={(event) => {
          viewport.current = event.nativeEvent.layout.width;
        }}
        onScroll={(event) => {
          scrollX.current = event.nativeEvent.contentOffset.x;
        }}
      >
        <Chip
          active={sortActive || sortMenuOpen}
          onPress={() => (filters ? onToggleSortMenu?.() : undefined)}
          onLayout={(rect) => {
            layouts.current.sort = rect;
          }}
        >
          <Text style={[styles.label, sortActive && styles.labelActive]} numberOfLines={1}>
            {sortActive && sortLabel ? sortLabel : 'Sort by'}
          </Text>
          <Image
            source={chevronDown}
            tintColor={sortActive || sortMenuOpen ? ACTIVE_BORDER : TEXT_COLOR}
            style={[styles.chevron, sortMenuOpen && styles.chevronFlipped]}
            resizeMode="contain"
          />
        </Chip>
        <RatingChip
          progress={progress}
          active={filters?.toggles.rating4}
          onPress={() => toggle('rating4')}
          onLayout={(rect) => {
            layouts.current.rating4 = rect;
          }}
        />
        <Chip
          active={filters?.toggles.under30}
          onPress={() => toggle('under30')}
          onLayout={(rect) => {
            layouts.current.under30 = rect;
          }}
        >
          <Text style={[styles.label, filters?.toggles.under30 && styles.labelActive]}>
            Under 30 mins
          </Text>
        </Chip>
        <Chip
          active={filters?.toggles.under200}
          onPress={() => toggle('under200')}
          onLayout={(rect) => {
            layouts.current.under200 = rect;
          }}
        >
          <Text style={[styles.label, filters?.toggles.under200 && styles.labelActive]}>
            Under ₹200
          </Text>
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
  chipActive: {
    backgroundColor: ACTIVE_BG,
    borderColor: ACTIVE_BORDER,
  },
  chipInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  ratingLayout: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  ratingOverlay: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
  },
  label: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    color: TEXT_COLOR,
  },
  labelActive: {
    color: ACTIVE_BORDER,
    maxWidth: 150,
  },
  chevron: {
    width: 10,
    height: 10,
  },
  chevronFlipped: {
    transform: [{ rotate: '180deg' }],
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

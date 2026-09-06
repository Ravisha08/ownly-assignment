import { StatusBar } from 'expo-status-bar';
import { useCallback, useRef, useState } from 'react';
import { LayoutChangeEvent, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  runOnJS,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated';

import { AllRestaurantsFilterBar } from '@/features/homepage/components/AllRestaurantsFilterBar';
import { BackToTopButton } from '@/features/homepage/components/BackToTopButton';
import { BestRatedRail } from '@/features/homepage/components/BestRatedRail';
import { CuratedRestaurantRail } from '@/features/homepage/components/CuratedRestaurantRail';
import { DiscoverBarContent } from '@/features/homepage/components/DiscoverBarContent';
import { HomeSkeleton } from '@/features/homepage/components/HomeSkeleton';
import { MealForOneRail } from '@/features/homepage/components/MealForOneRail';
import { NotServiceableView } from '@/features/homepage/components/NotServiceableView';
import { ReorderRail } from '@/features/homepage/components/ReorderRail';
import { RestaurantCard } from '@/features/homepage/components/RestaurantCard';
import { TopHero } from '@/features/homepage/components/TopHero';
import { useHomeFeed } from '@/features/homepage/hooks/useHomeFeed';
import { Colors, Shadow, Spacing } from '@/utils/constants';
import type { RestaurantEntity } from '@/types/fixtures';

const BACK_TO_TOP_THRESHOLD = 900;
const STICKY_FADE_DISTANCE = 32;

function renderRestaurant({ item }: { item: RestaurantEntity }) {
  return (
    <View style={styles.mainCardWrap}>
      <RestaurantCard item={item} />
    </View>
  );
}

export function HomeScreen() {
  const feed = useHomeFeed();
  const insets = useSafeAreaInsets();
  const listRef = useRef<any>(null);
  const scrollY = useSharedValue(0);
  const [discoverBarY, setDiscoverBarY] = useState<number | null>(null);
  const [filterBarY, setFilterBarY] = useState<number | null>(null);
  const [stickyCravingHeight, setStickyCravingHeight] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isVeg, setIsVeg] = useState(true);
  const [lowestPriceMode, setLowestPriceMode] = useState(false);

  const handleDiscoverBarLayout = useCallback((event: LayoutChangeEvent) => {
    setDiscoverBarY(event.nativeEvent.layout.y);
  }, []);

  const handleFilterBarLayout = useCallback((event: LayoutChangeEvent) => {
    setFilterBarY(event.nativeEvent.layout.y);
  }, []);

  const handleStickyCravingLayout = useCallback((event: LayoutChangeEvent) => {
    setStickyCravingHeight(event.nativeEvent.layout.height);
  }, []);

  const updateBackToTop = useCallback((y: number) => {
    setShowBackToTop((prev) => {
      const shouldShow = y > BACK_TO_TOP_THRESHOLD;
      return prev === shouldShow ? prev : shouldShow;
    });
  }, []);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
      runOnJS(updateBackToTop)(event.contentOffset.y);
    },
  });

  const barStyle = useDerivedValue<'light' | 'dark'>(() =>
    scrollY.value < 8 ? 'light' : 'dark',
  );

  const notchFillStyle = useAnimatedStyle(() => ({
    backgroundColor: scrollY.value > 4 ? Colors.background : '#FF4088',
  }));
  const [statusBarStyle, setStatusBarStyle] = useState<'light' | 'dark'>('light');
  useDerivedValue(() => {
    runOnJS(setStatusBarStyle)(barStyle.value);
  });

  const scrollToTop = useCallback(() => {
    listRef.current?.scrollToOffset({ offset: 0, animated: true });
  }, []);

  const threshold = discoverBarY ?? Number.MAX_SAFE_INTEGER;
  const stickyAnimatedStyle = useAnimatedStyle(() => {
    const progress = Math.min(Math.max((scrollY.value - (threshold - STICKY_FADE_DISTANCE)) / STICKY_FADE_DISTANCE, 0), 1);
    return {
      opacity: progress,
      transform: [{ translateY: (1 - progress) * -16 }],
      pointerEvents: progress > 0 ? 'box-none' : 'none',
    };
  });

  const filterThreshold =
    filterBarY != null ? filterBarY - stickyCravingHeight : Number.MAX_SAFE_INTEGER;
  const filterStickyStyle = useAnimatedStyle(() => {
    const progress = Math.min(
      Math.max((scrollY.value - (filterThreshold - STICKY_FADE_DISTANCE)) / STICKY_FADE_DISTANCE, 0),
      1,
    );
    return {
      opacity: progress,
      transform: [{ translateY: (1 - progress) * -16 }],
      pointerEvents: progress > 0 ? 'box-none' : 'none',
    };
  });

  if (feed.status === 'not-serviceable') {
    return <NotServiceableView message={feed.notServiceableMessage} onRetry={feed.toggleNotServiceableForDemo} />;
  }

  if (feed.status === 'checking' || feed.status === 'loading') {
    return (
      <View style={[styles.screen, { paddingTop: insets.top }]}>
        <View style={[styles.notchFill, { height: insets.top }]} />
        <StatusBar style="light" />
        <HomeSkeleton />
      </View>
    );
  }

  if (feed.status === 'error') {
    return (
      <View style={[styles.screen, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        <Text style={styles.errorText}>Something went wrong loading the homepage.</Text>
      </View>
    );
  }

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <Animated.View style={[styles.notchFill, { height: insets.top }, notchFillStyle]} />
      <StatusBar style={statusBarStyle} />
      <Animated.FlatList
        ref={listRef}
        data={feed.mainListItems}
        removeClippedSubviews={false}
        keyExtractor={(item) => item.entityId}
        renderItem={renderRestaurant}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View>
            <TopHero
              banner={feed.banner}
              isVeg={isVeg}
              onToggleVeg={setIsVeg}
              lowestPriceMode={lowestPriceMode}
              onToggleLowestPriceMode={setLowestPriceMode}
              onLongPressLocation={feed.toggleNotServiceableForDemo}
            />
            <ReorderRail items={feed.reorderItems} />
            <View onLayout={handleDiscoverBarLayout}>
              <DiscoverBarContent items={feed.cravingItems} />
            </View>
            <MealForOneRail title={feed.mealForOneTitle} items={feed.mealForOneItems} />
            {feed.curatedSections.map((section) =>
              section.title === 'Best rated restos near you' ? (
                <BestRatedRail key={section.id} items={section.items} />
              ) : (
                <CuratedRestaurantRail key={section.id} title={section.title} items={section.items} />
              ),
            )}
            {feed.mainListItems.length > 0 ? (
              <View style={styles.allRestaurantsHeader} onLayout={handleFilterBarLayout}>
                <AllRestaurantsFilterBar />
              </View>
            ) : null}
          </View>
        }
      />

      <Animated.View
        onLayout={handleStickyCravingLayout}
        style={[styles.stickyBar, { top: insets.top }, stickyAnimatedStyle]}
      >
        <DiscoverBarContent items={feed.cravingItems} showTitle={false} />
      </Animated.View>

      <Animated.View
        style={[styles.stickyFilterBar, { top: insets.top + stickyCravingHeight }, filterStickyStyle]}
      >
        <AllRestaurantsFilterBar showHeading={false} sticky />
      </Animated.View>

      <BackToTopButton visible={showBackToTop} onPress={scrollToTop} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  notchFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FF297D',
  },
  listContent: {
    paddingBottom: Spacing.xxxl,
  },
  mainCardWrap: {
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
  },
  allRestaurantsHeader: {
    marginTop: Spacing.xxxl,
    marginBottom: 0,
  },
  stickyBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.background,
    ...Shadow.card,
  },
  stickyFilterBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: Colors.background,
    paddingVertical: Spacing.md,
  },
  errorText: {
    color: Colors.textSecondary,
    textAlign: 'center',
    padding: Spacing.xl,
  },
});

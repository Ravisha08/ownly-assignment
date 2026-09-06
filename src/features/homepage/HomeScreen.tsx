import { StatusBar } from 'expo-status-bar';
import { useCallback, useMemo, useRef, useState } from 'react';
import {
  LayoutChangeEvent,
  Platform,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
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
import { EmptyRestaurants } from '@/features/homepage/components/EmptyRestaurants';
import { HomeSkeleton } from '@/features/homepage/components/HomeSkeleton';
import { MealForOneRail } from '@/features/homepage/components/MealForOneRail';
import { NotServiceableView } from '@/features/homepage/components/NotServiceableView';
import { ReorderRail } from '@/features/homepage/components/ReorderRail';
import { RestaurantCard } from '@/features/homepage/components/RestaurantCard';
import { Shimmer } from '@/features/homepage/components/Shimmer';
import { ServiceabilityMenu } from '@/features/homepage/components/ServiceabilityMenu';
import { SortMenu } from '@/features/homepage/components/SortMenu';
import { TopHero } from '@/features/homepage/components/TopHero';
import { useHomeFeed } from '@/features/homepage/hooks/useHomeFeed';
import { isVegCuisine, isVegFoodItem, isVegRestaurant } from '@/features/homepage/services/vegFilter';
import { useRestaurantFilters } from '@/features/homepage/hooks/useRestaurantFilters';
import { Colors, Spacing } from '@/utils/constants';
import type { RestaurantEntity } from '@/types/fixtures';

const BACK_TO_TOP_THRESHOLD = 900;

// Downward-only drop shadow for the stuck sticky bars. Android `elevation`
// bleeds a shadow above the bar too, so we paint the shadow ourselves as a
// short gradient sitting just below the bar's bottom edge.
function StuckShadow() {
  if (Platform.OS !== 'android') return null;
  return (
    <LinearGradient
      pointerEvents="none"
      colors={['rgba(0,0,0,0.16)', 'rgba(0,0,0,0)']}
      style={styles.stuckShadowGradient}
    />
  );
}

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
  // Shared horizontal offset for the craving rail so the in-list twin and the
  // stuck overlay twin show the same scroll position when control passes over.
  const cravingScrollX = useSharedValue(0);
  const [heroHeight, setHeroHeight] = useState<number | null>(null);
  const [bannerHeight, setBannerHeight] = useState(0);
  // All measured relative to the top of the scroll content (the ListHeader
  // starts at content y = 0, so onLayout y values there are absolute offsets).
  const [cravingY, setCravingY] = useState(Number.MAX_SAFE_INTEGER);
  const [cravingHeight, setCravingHeight] = useState(0);
  const [filterY, setFilterY] = useState(Number.MAX_SAFE_INTEGER);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isVeg, setIsVeg] = useState(false);
  // Drives the switch knob — flips instantly so the toggle animates while the
  // skeleton loads; `isVeg` (the actual filter) catches up when loading ends.
  const [vegVisual, setVegVisual] = useState(false);
  const [vegSwitching, setVegSwitching] = useState(false);
  const vegTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleToggleVeg = useCallback((next: boolean) => {
    if (vegTimer.current) clearTimeout(vegTimer.current);
    listRef.current?.scrollToOffset({ offset: 0, animated: false });
    // Rail twins (in-list + stuck overlay) both read this; the list remounts on
    // the veg flip so reset it here or the stuck overlay keeps the stale offset.
    cravingScrollX.value = 0;
    setVegVisual(next);
    setVegSwitching(true);
    vegTimer.current = setTimeout(() => {
      setIsVeg(next);
      setVegSwitching(false);
    }, 800);
  }, [cravingScrollX]);
  const [lowestPriceMode, setLowestPriceMode] = useState(false);
  const filters = useRestaurantFilters();
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const toggleSortMenu = useCallback(() => setSortMenuOpen((prev) => !prev), []);
  const closeSortMenu = useCallback(() => setSortMenuOpen(false), []);
  const [locationMenuOpen, setLocationMenuOpen] = useState(false);
  const toggleLocationMenu = useCallback(() => setLocationMenuOpen((prev) => !prev), []);
  const closeLocationMenu = useCallback(() => setLocationMenuOpen(false), []);
  const filteredRestaurants = useMemo(() => {
    const base = isVeg ? feed.mainListItems.filter(isVegRestaurant) : feed.mainListItems;
    return filters.apply(base);
  }, [filters, feed.mainListItems, isVeg]);

  // Veg mode also trims every rail above the main list.
  const reorderItems = useMemo(
    () => (isVeg ? feed.reorderItems.filter(isVegRestaurant) : feed.reorderItems),
    [feed.reorderItems, isVeg],
  );
  const cravingItems = useMemo(
    () => (isVeg ? feed.cravingItems.filter(isVegCuisine) : feed.cravingItems),
    [feed.cravingItems, isVeg],
  );
  const mealForOneItems = useMemo(
    () => (isVeg ? feed.mealForOneItems.filter(isVegFoodItem) : feed.mealForOneItems),
    [feed.mealForOneItems, isVeg],
  );
  const curatedSections = useMemo(
    () =>
      isVeg
        ? feed.curatedSections.map((section) => ({
            ...section,
            items: section.items.filter(isVegRestaurant),
          }))
        : feed.curatedSections,
    [feed.curatedSections, isVeg],
  );

  const handleHeroLayout = useCallback((event: LayoutChangeEvent) => {
    setHeroHeight(event.nativeEvent.layout.height);
  }, []);

  const handleBannerLayout = useCallback((event: LayoutChangeEvent) => {
    setBannerHeight(event.nativeEvent.layout.height);
  }, []);

  const handleCravingLayout = useCallback((event: LayoutChangeEvent) => {
    setCravingY(event.nativeEvent.layout.y);
    setCravingHeight(event.nativeEvent.layout.height);
  }, []);

  const handleFilterLayout = useCallback((event: LayoutChangeEvent) => {
    setFilterY(event.nativeEvent.layout.y);
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

  // Point at which the white content scrolls up under the notch.
  const whiteDockAt =
    heroHeight != null ? Math.max(0, heroHeight - insets.top) : Number.MAX_SAFE_INTEGER;
  const NOTCH_FADE = 48;

  const notchProgress = useDerivedValue(() =>
    Math.min(Math.max((scrollY.value - (whiteDockAt - NOTCH_FADE)) / NOTCH_FADE, 0), 1),
  );

  const barStyle = useDerivedValue<'light' | 'dark'>(() =>
    notchProgress.value > 0.5 ? 'dark' : 'light',
  );

  const notchFillStyle = useAnimatedStyle(() => ({ opacity: notchProgress.value }));
  const [statusBarStyle, setStatusBarStyle] = useState<'light' | 'dark'>('light');
  useDerivedValue(() => {
    runOnJS(setStatusBarStyle)(barStyle.value);
  });

  const scrollToTop = useCallback(() => {
    listRef.current?.scrollToOffset({ offset: 0, animated: true });
  }, []);

  // Both sticky bars are transform-tracked overlays that PIN once their in-list
  // twin reaches the top: the craving row at the top, the filter bar directly
  // beneath the pinned craving row. They're only visible while pinned — before
  // that the real in-list twin is what you see. (Keeping them visible while
  // merely "tracking" the twin desyncs on Android's stretch overscroll and makes
  // the row look like a detached floating strip on pull-down.)
  // Whether each overlay is pinned. Mirrored to JS state so we can flip
  // `pointerEvents` — an opacity-0 overlay still sits exactly over its in-list
  // twin and would otherwise swallow that row's touches (e.g. the craving
  // rail's horizontal scroll).
  const [cravingStuck, setCravingStuck] = useState(false);
  const [filterStuck, setFilterStuck] = useState(false);
  const cravingStuckSV = useSharedValue(false);
  const filterStuckSV = useSharedValue(false);
  const cravingInListActive = useDerivedValue(() => !cravingStuckSV.value);

  const cravingOverlayStyle = useAnimatedStyle(() => {
    const stuck = scrollY.value >= cravingY;
    if (stuck !== cravingStuckSV.value) {
      cravingStuckSV.value = stuck;
      runOnJS(setCravingStuck)(stuck);
    }
    return {
      opacity: stuck ? 1 : 0,
      transform: [{ translateY: Math.max(0, cravingY - scrollY.value) }],
    };
  });

  // Ramps 0 -> 1 over the first stretch of scroll past the stick point so the
  // rating chip cross-fades from the Google "★ 4+" mark to the stuck "● Rating 4+".
  const FILTER_MORPH = 24;
  const filterProgress = useDerivedValue(() => {
    const start = filterY - cravingHeight;
    return Math.min(1, Math.max(0, (scrollY.value - start) / FILTER_MORPH));
  });

  const filterOverlayStyle = useAnimatedStyle(() => {
    const stuck = scrollY.value >= filterY - cravingHeight;
    if (stuck !== filterStuckSV.value) {
      filterStuckSV.value = stuck;
      runOnJS(setFilterStuck)(stuck);
    }
    return {
      opacity: stuck ? 1 : 0,
      transform: [{ translateY: Math.max(cravingHeight, filterY - scrollY.value) }],
    };
  });

  // Sort dropdown floats 46px below the filter bar's "Sort by" chip, tracking the
  // bar whether it's free-scrolling or pinned (same transform as the overlay bar).
  const SORT_MENU_ANCHOR = 46;
  const sortMenuStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: Math.max(cravingHeight, filterY - scrollY.value) + SORT_MENU_ANCHOR },
    ],
  }));

  if (feed.status === 'not-serviceable') {
    return (
      <View style={[styles.screen, { paddingTop: insets.top }]}>
        <View style={[styles.notchFill, { height: insets.top }]} />
        <StatusBar style="light" />
        <TopHero
          isVeg={false}
          onToggleVeg={() => {}}
          lowestPriceMode={false}
          onToggleLowestPriceMode={() => {}}
          onPressLocation={toggleLocationMenu}
          compact
        />
        <NotServiceableView message={feed.notServiceableMessage} embedded />

        {locationMenuOpen ? (
          <>
            <Pressable style={styles.sortBackdrop} onPress={closeLocationMenu} />
            <View style={[styles.locationMenuOverlay, { top: insets.top + 52 }]}>
              <ServiceabilityMenu
                notServiceable={feed.isNotServiceable}
                onSelect={feed.setNotServiceable}
                onClose={closeLocationMenu}
              />
            </View>
          </>
        ) : null}
      </View>
    );
  }

  if (feed.status === 'checking' || feed.status === 'loading') {
    return (
      <View style={[styles.screen, { paddingTop: insets.top }]}>
        <View style={[styles.notchFill, styles.notchFillWhite, { height: insets.top }]} />
        <StatusBar style="dark" />
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

  const hasRestaurants = feed.mainListItems.length > 0;

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <View style={[styles.notchFill, { height: insets.top }]} />
      <Animated.View
        style={[styles.notchFill, styles.notchFillWhite, { height: insets.top }, notchFillStyle]}
      />
      <StatusBar style={statusBarStyle} />
      <Animated.FlatList
        ref={listRef}
        key={isVeg ? 'veg' : 'all'}
        data={filteredRestaurants}
        removeClippedSubviews={false}
        refreshControl={
          <RefreshControl
            refreshing={feed.refreshing}
            onRefresh={feed.refresh}
            tintColor="#FF297D"
            colors={['#FF297D']}
            progressViewOffset={insets.top}
          />
        }
        keyExtractor={(item) => item.entityId}
        renderItem={renderRestaurant}
        onScroll={scrollHandler}
        onScrollBeginDrag={() => {
          closeSortMenu();
          closeLocationMenu();
        }}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View>
            {/* Sits above the content origin so it only shows during overscroll —
                a pink fill above the hero, matching it. Needed on Android too:
                the stretch-overscroll on fling-to-top otherwise reveals the
                white screen background between the notch and the hero. */}
            <View style={styles.pullDownFill} pointerEvents="none" />
            <View onLayout={handleHeroLayout}>
              <TopHero
                banner={feed.banner}
                isVeg={vegVisual}
                onToggleVeg={handleToggleVeg}
                lowestPriceMode={lowestPriceMode}
                onToggleLowestPriceMode={setLowestPriceMode}
                onPressLocation={toggleLocationMenu}
                onLongPressLocation={feed.toggleNotServiceableForDemo}
                onBannerLayout={handleBannerLayout}
              />
            </View>
            <ReorderRail items={reorderItems} />
            <View style={styles.cravingTitleWrap}>
              <Text style={styles.cravingTitle}>What are you craving today?</Text>
            </View>
            <View style={styles.stickyRow} onLayout={handleCravingLayout}>
              <DiscoverBarContent
                items={cravingItems}
                showTitle={false}
                scrollX={cravingScrollX}
                active={cravingInListActive}
              />
            </View>
            <MealForOneRail title={feed.mealForOneTitle} items={mealForOneItems} />
            {curatedSections.map((section) =>
              section.title === 'Best rated restos near you' ? (
                <BestRatedRail key={section.id} items={section.items} />
              ) : (
                <CuratedRestaurantRail key={section.id} title={section.title} items={section.items} />
              ),
            )}
            {hasRestaurants ? (
              <>
                <View style={styles.allRestaurantsHeadingWrap}>
                  <Text style={styles.allRestaurantsHeading}>All restaurants</Text>
                </View>
                <View style={[styles.stickyRow, styles.filterBarInner]} onLayout={handleFilterLayout}>
                  <AllRestaurantsFilterBar
                    showHeading={false}
                    filters={filters}
                    sortMenuOpen={sortMenuOpen}
                    onToggleSortMenu={toggleSortMenu}
                  />
                </View>
              </>
            ) : null}
          </View>
        }
        ListEmptyComponent={
          hasRestaurants ? <EmptyRestaurants onReset={filters.reset} /> : null
        }
      />

      {vegSwitching ? (
        <View
          style={[
            styles.vegSkeleton,
            { top: insets.top + (heroHeight ?? 0) - bannerHeight },
          ]}
        >
          {bannerHeight > 0 ? (
            <Shimmer width="100%" height={bannerHeight} radius={0} />
          ) : null}
          <HomeSkeleton showHero={false} />
        </View>
      ) : null}

      <Animated.View
        pointerEvents={cravingStuck ? 'auto' : 'none'}
        style={[
          styles.overlay,
          styles.stickyRow,
          { top: insets.top },
          cravingStuck && !filterStuck && styles.stuckShadow,
          cravingOverlayStyle,
        ]}
      >
        <DiscoverBarContent
          items={cravingItems}
          showTitle={false}
          scrollX={cravingScrollX}
          active={cravingStuckSV}
        />
        {cravingStuck && !filterStuck ? <StuckShadow /> : null}
      </Animated.View>

      {hasRestaurants ? (
        <Animated.View
          pointerEvents={filterStuck ? 'auto' : 'none'}
          style={[
            styles.overlay,
            styles.stickyRow,
            styles.filterBarInner,
            { top: insets.top, zIndex: 6 },
            filterStuck && styles.stuckShadow,
            filterOverlayStyle,
          ]}
        >
          <AllRestaurantsFilterBar
            showHeading={false}
            progress={filterProgress}
            filters={filters}
            sortMenuOpen={sortMenuOpen}
            onToggleSortMenu={toggleSortMenu}
          />
          {filterStuck ? <StuckShadow /> : null}
        </Animated.View>
      ) : null}

      {hasRestaurants && sortMenuOpen ? (
        <>
          <Pressable style={styles.sortBackdrop} onPress={closeSortMenu} />
          <Animated.View
            style={[styles.sortMenuOverlay, { top: insets.top }, sortMenuStyle]}
          >
            <SortMenu filters={filters} onClose={closeSortMenu} />
          </Animated.View>
        </>
      ) : null}

      {locationMenuOpen ? (
        <>
          <Pressable style={styles.sortBackdrop} onPress={closeLocationMenu} />
          <View style={[styles.locationMenuOverlay, { top: insets.top + 52 }]}>
            <ServiceabilityMenu
              notServiceable={feed.isNotServiceable}
              onSelect={feed.setNotServiceable}
              onClose={closeLocationMenu}
            />
          </View>
        </>
      ) : null}

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
    backgroundColor: '#FF4088',
  },
  notchFillWhite: {
    backgroundColor: Colors.background,
  },
  listContent: {
    paddingBottom: Spacing.xxxl * 3,
  },
  pullDownFill: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: '100%',
    height: 600,
    backgroundColor: '#FF4088',
  },
  vegSkeleton: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 20,
    backgroundColor: Colors.background,
  },
  mainCardWrap: {
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
  },
  // Sticky rows (and their overlay twins) must be fully opaque so list content
  // never shows through once they pin under the notch.
  stickyRow: {
    backgroundColor: Colors.background,
  },
  filterBarInner: {
    paddingVertical: Spacing.md,
  },
  cravingTitleWrap: {
    backgroundColor: Colors.background,
    paddingTop: Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },
  cravingTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
  },
  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
  stuckShadow: {
    zIndex: 5,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        // Offset > radius so the blur only spills below the bar, never above/beside it.
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      // Android `elevation` casts on all four edges (visible line above the
      // bar), so we draw a downward-only gradient via <StuckShadow /> instead.
    }),
  },
  stuckShadowGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: -8,
    height: 8,
  },
  allRestaurantsHeadingWrap: {
    marginTop: Spacing.xxxl,
    paddingBottom: Spacing.md,
    backgroundColor: Colors.background,
  },
  allRestaurantsHeading: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    paddingHorizontal: Spacing.lg,
  },
  sortBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 40,
  },
  sortMenuOverlay: {
    position: 'absolute',
    left: Spacing.lg,
    zIndex: 41,
  },
  locationMenuOverlay: {
    position: 'absolute',
    left: Spacing.lg,
    zIndex: 41,
  },
  errorText: {
    color: Colors.textSecondary,
    textAlign: 'center',
    padding: Spacing.xl,
  },
});

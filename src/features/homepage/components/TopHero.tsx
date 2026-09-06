import { Image } from 'expo-image';
import { FontFamily } from '@/theme/typography';
import { LinearGradient } from 'expo-linear-gradient';
import { LayoutChangeEvent, Pressable, StyleSheet, Text, View } from 'react-native';

import { Colors, Radius, Spacing } from '@/utils/constants';
import { LowestPriceModeToggle } from '@/features/homepage/components/LowestPriceModeToggle';
import { VegToggle } from '@/features/homepage/components/VegToggle';
import type { TopBannerItem } from '@/types/fixtures';

interface TopHeroProps {
  banner?: TopBannerItem;
  isVeg: boolean;
  onToggleVeg: (value: boolean) => void;
  lowestPriceMode: boolean;
  onToggleLowestPriceMode: (value: boolean) => void;
  onLongPressLocation?: () => void;
  onPressLocation?: () => void;
  onBannerLayout?: (event: LayoutChangeEvent) => void;
  /** Location row only — used on the not-serviceable screen. */
  compact?: boolean;
}

export function TopHero({
  banner,
  isVeg,
  onToggleVeg,
  lowestPriceMode,
  onToggleLowestPriceMode,
  onLongPressLocation,
  onPressLocation,
  onBannerLayout,
  compact = false,
}: TopHeroProps) {
  return (
    <View style={[styles.wrap, !compact && banner ? styles.wrapWithBanner : null]}>
      <LinearGradient
        colors={['#FF4088', '#FF297D']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        locations={[0, 0.5]}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.topRow}>
        <Pressable
          style={styles.locationBlock}
          onPress={onPressLocation}
          onLongPress={onLongPressLocation}
        >
          <View style={styles.locationTitleRow}>
            <Text style={styles.locationTitle}>HSR Layout</Text>
            <View style={styles.chevron}>
              <View style={styles.chevronArrow} />
            </View>
          </View>
          <Text style={styles.locationSubtitle} numberOfLines={1}>
            3rd main road, 4th cross road
          </Text>
        </Pressable>
        {!compact ? (
          <View style={styles.vegBlock}>
            <Text style={styles.vegLabel}>VEG</Text>
            <VegToggle value={isVeg} onValueChange={onToggleVeg} />
          </View>
        ) : null}
        <View style={styles.avatar}>
          <Image
            source={require('@/assets/images/profile.png')}
            style={styles.avatarImage}
            contentFit="cover"
          />
        </View>
      </View>

      {compact ? null : (
      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Image
            source={require('@/assets/images/search.png')}
            style={styles.searchIcon}
            contentFit="contain"
          />
          <Text style={styles.searchPlaceholder}>Search</Text>
        </View>
        <LowestPriceModeToggle
          value={lowestPriceMode}
          onValueChange={onToggleLowestPriceMode}
        />
      </View>
      )}

      {!compact && banner ? (
        <View style={styles.bannerBox} onLayout={onBannerLayout}>
          <Image
            source={{ uri: banner.imageUrl }}
            style={styles.bannerImage}
            contentFit="contain"
            transition={200}
          />
        </View>
      ) : null}
    </View>
  );
}

const AVATAR_SIZE = 34;

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: '#FF297D',
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xxl,
    borderBottomLeftRadius: Radius.xl,
    borderBottomRightRadius: Radius.xl,
    overflow: 'hidden',
  },
  wrapWithBanner: {
    paddingBottom: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: Spacing.sm,
  },
  locationBlock: {
    flex: 1,
  },
  locationTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  locationTitle: {
    color: '#333333',
    fontSize: 16,
    fontFamily: FontFamily.bold,
  },
  chevron: {
    width: 14,
    height: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chevronArrow: {
    width: 8,
    height: 8,
    borderRightWidth: 1.6,
    borderBottomWidth: 1.6,
    borderColor: '#333333',
    transform: [{ rotate: '45deg' }, { translateY: -2 }],
  },
  locationSubtitle: {
    color: '#333333',
    fontSize: 12,
    fontFamily: FontFamily.regular,
    marginTop: 2,
  },
  vegBlock: {
    alignItems: 'center',
    gap: 4,
  },
  vegLabel: {
    color: '#333333',
    fontSize: 12,
    fontFamily: FontFamily.bold,
    letterSpacing: 0.5,
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: '#fff',
    borderRadius: Radius.pill,
    paddingHorizontal: 24,
    paddingVertical: 12.5,
  },
  searchIcon: {
    width: 18,
    height: 18,
  },
  searchPlaceholder: {
    color: '#999999',
    fontSize: 14,
    fontFamily: FontFamily.regular,
  },
  bannerBox: {
    marginTop: Spacing.xl,
    backgroundColor: Colors.background,
  },
  bannerImage: {
    width: '100%',
    aspectRatio: 1560 / 772,
  },
});

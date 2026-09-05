import { Image } from 'expo-image';
import { FontFamily } from '@/theme/typography';
import { LinearGradient } from 'expo-linear-gradient';
import { Platform, Pressable, StyleSheet, Switch, Text, View } from 'react-native';

import { Colors, FontSize, Radius, Spacing } from '@/utils/constants';
import type { TopBannerItem } from '@/types/fixtures';

interface TopHeroProps {
  banner?: TopBannerItem;
  isVeg: boolean;
  onToggleVeg: (value: boolean) => void;
  onLongPressLocation?: () => void;
}

export function TopHero({ banner, isVeg, onToggleVeg, onLongPressLocation }: TopHeroProps) {
  return (
    <View style={styles.wrap}>
      <LinearGradient
        colors={['#FF297D33', '#FF297D80']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <Pressable style={styles.topRow} onLongPress={onLongPressLocation}>
        <View style={styles.locationBlock}>
          <View style={styles.locationTitleRow}>
            <Text style={styles.locationTitle}>HSR Layout</Text>
            <View style={styles.chevron}>
              <View style={styles.chevronArrow} />
            </View>
          </View>
          <Text style={styles.locationSubtitle} numberOfLines={1}>
            3rd main road, 4th cross road
          </Text>
        </View>
        <View style={styles.vegBlock}>
          <Text style={styles.vegLabel}>VEG</Text>
          <View style={styles.vegSwitchClip}>
            <Switch
              value={isVeg}
              onValueChange={onToggleVeg}
              trackColor={{ true: '#7CD98A', false: '#E3E0E6' }}
              thumbColor="#fff"
              style={styles.vegSwitch}
            />
          </View>
        </View>
        <View style={styles.avatar}>
          <Text style={styles.avatarEmoji}>🙂</Text>
        </View>
      </Pressable>

      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Image
            source={require('@/assets/images/search.png')}
            style={styles.searchIcon}
            contentFit="contain"
          />
          <Text style={styles.searchPlaceholder}>Search</Text>
        </View>
        <View style={styles.priceModeBox}>
          <Text style={styles.priceModeText}>LOWEST PRICE MODE</Text>
          <Switch
            value={false}
            trackColor={{ true: Colors.brandDark, false: '#E3E0E6' }}
            thumbColor="#fff"
            style={styles.priceModeSwitch}
          />
        </View>
      </View>

      {banner ? (
        <View style={styles.bannerBox}>
          <Image
            source={{ uri: banner.imageUrl }}
            style={styles.bannerImage}
            contentFit="cover"
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
    gap: 0,
  },
  vegLabel: {
    color: '#333333',
    fontSize: 12,
    fontFamily: FontFamily.bold,
    letterSpacing: 0.5,
  },
  vegSwitchClip: {
    width: 32,
    height: 16,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  vegSwitch: Platform.select({
    ios: { transform: [{ scaleX: 32 / 51 }, { scaleY: 16 / 31 }] },
    android: { transform: [{ scaleX: 32 / 46 }, { scaleY: 16 / 28 }] },
    default: { transform: [{ scaleX: 32 / 51 }, { scaleY: 16 / 31 }] },
  }),
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmoji: {
    fontSize: 16,
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
    width: '65%',
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
  priceModeBox: {
    flexShrink: 1,
    backgroundColor: '#fff',
    borderRadius: Radius.pill,
    height: 44,
    paddingHorizontal: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  priceModeText: {
    fontSize: 9,
    fontFamily: FontFamily.bold,
    color: Colors.text,
    maxWidth: 46,
  },
  priceModeSwitch: {
    transform: [{ scale: 0.8 }],
  },
  bannerBox: {
    marginTop: Spacing.xl,
  },
  bannerImage: {
    width: '100%',
    height: 180,
  },
});

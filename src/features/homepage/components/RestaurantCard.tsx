import { FontFamily } from '@/theme/typography';
import { Image } from 'expo-image';
import { memo } from 'react';
import { Pressable, Image as RNImage, StyleSheet, Text, View } from 'react-native';

import type { RestaurantEntity } from '@/types/fixtures';
import { Colors, FontSize, Radius, Spacing } from '@/utils/constants';
import { titleCase } from '@/utils/text';

const diamondShine = require('@/assets/images/diamond_shine.png');
const moodHeart = require('@/assets/images/mood_heart.png');
const chessQueen = require('@/assets/images/chess_queen.png');
const lowestPrice = require('@/assets/images/lowest_price.png');
const starIcon = require('@/assets/images/star.png');
const boltIcon = require('@/assets/images/bolt.png');

// Visual treatment per badge label — icon + colours. Fallback covers real trustMarkers
// like "Lowest Price".
const BADGE_STYLES: Record<
  string,
  { icon: number; bg: string; color: string; iconColor?: string; tintIcon?: boolean }
> = {
  'Lowest Price': { icon: lowestPrice, bg: '#C7F464', color: '#4B7400', tintIcon: false },
  'Hidden Gem': { icon: diamondShine, bg: '#E3F6FF', color: '#006DFF' },
  'Crowd Crush': { icon: moodHeart, bg: '#FDECEA', color: '#C6412E' },
  'Regional Royalty': { icon: chessQueen, bg: '#FFFCE6', color: '#ED7756' },
};
const DEFAULT_BADGE_STYLE = { icon: diamondShine, bg: '#FFFFFF', color: Colors.brandDark };

function formatCount(count: number) {
  if (count >= 1000) return `${(count / 1000).toFixed(count % 1000 >= 100 ? 1 : 0)}k+`;
  return `${count}`;
}

interface RestaurantCardProps {
  item: RestaurantEntity;
  variant?: 'full' | 'compact';
}

// Decorative badges seen in the reference design that aren't backed by any fixture field
// (the fixture's only real trustMarker is "Lowest Price"). Applied only when a card has no
// real trust marker of its own, purely for visual polish — not fixture-driven.
const DECORATIVE_BADGES = ['Regional Royalty', 'Hidden Gem', 'Crowd Crush'];

function pickDecorativeBadge(entityId: string) {
  let hash = 0;
  for (let i = 0; i < entityId.length; i += 1) hash = (hash + entityId.charCodeAt(i)) % 997;
  return hash % 2 === 0 ? DECORATIVE_BADGES[hash % DECORATIVE_BADGES.length] : null;
}

export const RestaurantCard = memo(function RestaurantCard({ item, variant = 'full' }: RestaurantCardProps) {
  const isCompact = variant === 'compact';
  const knownFor = item.knownFor?.filter(Boolean).map(titleCase).join(', ');
  const badge = item.trustMarkers?.[0]?.name ?? pickDecorativeBadge(item.entityId);
  const badgeStyle = badge ? BADGE_STYLES[badge] ?? DEFAULT_BADGE_STYLE : null;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        isCompact ? styles.cardCompact : styles.cardFull,
        pressed && styles.pressed,
      ]}>
      <View style={styles.imageWrap}>
        <Image
          source={{ uri: item.imageUrl }}
          style={[styles.image, isCompact ? styles.imageCompact : styles.imageFull]}
          contentFit="cover"
          transition={200}
        />
        {badge && badgeStyle ? (
          <View style={[styles.trustBadge, { backgroundColor: badgeStyle.bg }]}>
            <RNImage
              source={badgeStyle.icon}
              style={[
                styles.trustBadgeIcon,
                badgeStyle.tintIcon === false
                  ? null
                  : { tintColor: badgeStyle.iconColor ?? badgeStyle.color },
              ]}
              resizeMode="contain"
            />
            <Text style={[styles.trustBadgeText, { color: badgeStyle.color }]}>{badge}</Text>
          </View>
        ) : null}
        {knownFor ? (
          <View style={styles.captionWrap}>
            <View style={styles.captionAccent} />
            <View style={styles.captionBar}>
              <Text style={styles.captionText} numberOfLines={1}>
                Famous for its {knownFor}
              </Text>
            </View>
          </View>
        ) : null}
        <View style={styles.dots}>
          {[0, 1, 2].map((i) => (
            <View key={i} style={i === 0 ? styles.dotActive : styles.dotInactive} />
          ))}
        </View>
      </View>
      <View style={[styles.body, !isCompact && styles.bodyFull]}>
        <View style={styles.titleRow}>
          <Text style={styles.name} numberOfLines={2}>
            {item.name}
          </Text>
          <View style={styles.locationCol}>
            <Text style={styles.distance}>{item.distanceInKM} km</Text>
            {item.address?.area ? <Text style={styles.area}>{item.address.area}</Text> : null}
          </View>
        </View>
        <View style={styles.metaRow}>
          {item.platformRating?.value ? (
            <>
              <RNImage source={starIcon} style={styles.starIcon} resizeMode="contain" />
              <Text style={styles.rating}>{item.platformRating.value.toFixed(1)}</Text>
              <Text style={styles.ratingCount}>({formatCount(item.platformRating.count)})</Text>
            </>
          ) : null}
          <View style={styles.ellipse} />
          <RNImage source={boltIcon} style={styles.boltIcon} resizeMode="contain" />
          <Text style={styles.eta}>{item.etaInMinutes} mins</Text>
        </View>
        {item.price ? (
          <Text style={styles.priceForOne} numberOfLines={1}>
            ₹{item.price} for one{knownFor ? ` | ${knownFor}` : ''}
          </Text>
        ) : null}
        {!item.orderingEnabled ? <Text style={styles.closed}>Currently unavailable</Text> : null}
      </View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    boxShadow: '0px 1px 4px 0px rgba(17, 12, 46, 0.12)',
  },
  cardFull: {
    width: '100%',
    minHeight: 308,
    padding: 12,
  },
  cardCompact: {
    width: 220,
  },
  pressed: {
    opacity: 0.9,
  },
  imageWrap: {
    position: 'relative',
  },
  image: {
    width: '100%',
    borderRadius: Radius.lg,
    backgroundColor: Colors.surfaceMuted,
  },
  imageFull: {
    height: 206,
  },
  imageCompact: {
    height: 130,
  },
  trustBadge: {
    position: 'absolute',
    top: Spacing.sm,
    left: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    height: 20,
    paddingHorizontal: 6,
    borderRadius: Radius.pill,
    backgroundColor: '#E3F6FF',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  trustBadgeIcon: {
    width: 10,
    height: 10,
  },
  trustBadgeText: {
    fontSize: 10,
    fontFamily: FontFamily.bold,
    color: '#006DFF',
  },
  captionWrap: {
    position: 'absolute',
    left: 0,
    bottom: 14,
    maxWidth: '82%',
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  captionAccent: {
    width: 4,
    backgroundColor: '#DE4F85',
  },
  captionBar: {
    flex: 1,
    backgroundColor: '#333333E5',
    borderTopRightRadius: 32,
    borderBottomRightRadius: 32,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  captionText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: FontFamily.medium,
  },
  dots: {
    position: 'absolute',
    right: 12,
    bottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  dotActive: {
    width: 20,
    height: 6,
    borderRadius: 8,
    backgroundColor: '#FCFCFC',
  },
  dotInactive: {
    width: 4,
    height: 4,
    borderRadius: 8,
    backgroundColor: '#D9D9D9',
  },
  body: {
    padding: Spacing.md,
    gap: 4,
  },
  bodyFull: {
    paddingHorizontal: 0,
    paddingBottom: 0,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    paddingRight: 80,
  },
  name: {
    flex: 1,
    fontSize: 16,
    fontFamily: FontFamily.bold,
    color: '#333333',
  },
  locationCol: {
    position: 'absolute',
    top: 0,
    right: 0,
    alignItems: 'flex-end',
    gap: 4,
  },
  distance: {
    fontSize: 12,
    fontFamily: FontFamily.semiBold,
    color: '#666666',
  },
  area: {
    fontSize: 12,
    fontFamily: FontFamily.semiBold,
    color: '#999999',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  starIcon: {
    width: 16,
    height: 16,
  },
  rating: {
    fontSize: 12,
    fontFamily: FontFamily.semiBold,
    color: '#17A821',
    marginLeft: 4,
  },
  ratingCount: {
    fontSize: 12,
    fontFamily: FontFamily.semiBold,
    color: '#999999',
    marginLeft: 3,
  },
  ellipse: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#666666',
    marginLeft: 4,
    marginRight: 3,
  },
  boltIcon: {
    width: 12,
    height: 12,
  },
  eta: {
    fontSize: 12,
    fontFamily: FontFamily.semiBold,
    color: '#666666',
    marginLeft: 3,
  },
  priceForOne: {
    fontSize: 12,
    fontFamily: FontFamily.semiBold,
    color: '#999999',
  },
  closed: {
    fontSize: FontSize.xs,
    color: Colors.nonVeg,
    fontFamily: FontFamily.semiBold,
  },
});

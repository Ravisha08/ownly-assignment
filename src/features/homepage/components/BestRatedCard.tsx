import { Image } from 'expo-image';
import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { FontFamily } from '@/theme/typography';

import { titleCase } from '@/utils/text';
import type { RestaurantEntity } from '@/types/fixtures';

const starIcon = require('@/assets/images/star.png');
const boltIcon = require('@/assets/images/bolt.png');
const queenIcon = require('@/assets/images/chess_queen.png');
const lowestPriceIcon = require('@/assets/images/lowest_price.png');
const gemIcon = require('@/assets/images/diamond_shine.png');

const IMAGE_SIZE = 144;
export const CARD_WIDTH = IMAGE_SIZE + 24;

// Decorative badge shown over the image — mirrors RestaurantCard's fallback, since the
// fixture's only real trustMarker is "Lowest Price".
const DECORATIVE_BADGES = ['Regional Royalty', 'Hidden Gem', 'Crowd Crush'];

function pickBadge(entityId: string) {
  let hash = 0;
  for (let i = 0; i < entityId.length; i += 1) hash = (hash + entityId.charCodeAt(i)) % 997;
  return DECORATIVE_BADGES[hash % DECORATIVE_BADGES.length];
}

export const BestRatedCard = memo(function BestRatedCard({ item }: { item: RestaurantEntity }) {
  const rating = item.platformRating;
  const badge = item.trustMarkers?.[0]?.name ?? pickBadge(item.entityId);
  const isLowestPrice = badge === 'Lowest Price';
  const isHiddenGem = badge === 'Hidden Gem';
  const cuisine = item.knownFor?.filter(Boolean).map(titleCase).join(', ');

  return (
    <Pressable style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <View style={styles.imageWrap}>
        <Image source={{ uri: item.imageUrl }} style={styles.image} contentFit="cover" transition={200} />
        {badge ? (
          <View
            style={[
              styles.badge,
              isLowestPrice && styles.badgeLowestPrice,
              isHiddenGem && styles.badgeHiddenGem,
            ]}>
            <Image
              source={isLowestPrice ? lowestPriceIcon : isHiddenGem ? gemIcon : queenIcon}
              style={styles.badgeIcon}
              contentFit="contain"
            />
            <Text
              style={[
                styles.badgeText,
                isLowestPrice && styles.badgeTextLowestPrice,
                isHiddenGem && styles.badgeTextHiddenGem,
              ]}
              numberOfLines={1}>
              {badge}
            </Text>
          </View>
        ) : null}
      </View>

      <Text style={styles.name} numberOfLines={1}>
        {item.name}
      </Text>

      <View style={styles.metaRow}>
        {rating?.value ? (
          <>
            <View style={styles.iconWrap}>
              <Image source={starIcon} style={styles.icon} contentFit="contain" />
            </View>
            <Text style={styles.rating}>{rating.value.toFixed(1)}</Text>
          </>
        ) : null}
        <View style={styles.dot} />
        <View style={styles.iconWrap}>
          <Image source={boltIcon} style={styles.icon} contentFit="contain" />
        </View>
        <Text style={styles.eta} numberOfLines={1}>
          {item.etaInMinutes} mins
        </Text>
      </View>

      {cuisine ? (
        <Text style={styles.cuisine} numberOfLines={1}>
          {cuisine}
        </Text>
      ) : null}
    </Pressable>
  );
});

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    boxShadow: '0px 1px 4px 0px rgba(17, 12, 46, 0.12)',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  pressed: {
    opacity: 0.85,
  },
  imageWrap: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  badge: {
    position: 'absolute',
    left: 8,
    bottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    height: 20,
    backgroundColor: '#FFFCE6',
    paddingHorizontal: 8,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  badgeLowestPrice: {
    backgroundColor: '#CDEBB0',
  },
  badgeHiddenGem: {
    backgroundColor: '#E3F6FF',
  },
  badgeIcon: {
    width: 12,
    height: 12,
  },
  badgeText: {
    fontSize: 10,
    fontFamily: FontFamily.bold,
    color: '#ED7756',
  },
  badgeTextLowestPrice: {
    color: '#2F7A2A',
  },
  badgeTextHiddenGem: {
    color: '#006DFF',
  },
  name: {
    fontSize: 14,
    fontFamily: FontFamily.bold,
    color: '#333333',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  iconWrap: {
    width: 12,
    height: 12,
    flexShrink: 0,
  },
  icon: {
    width: '100%',
    height: '100%',
  },
  rating: {
    fontSize: 12,
    fontFamily: FontFamily.semiBold,
    color: '#17A821',
    marginLeft: 3,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#666666',
    marginHorizontal: 5,
    flexShrink: 0,
  },
  eta: {
    fontSize: 12,
    fontFamily: FontFamily.semiBold,
    color: '#666666',
    marginLeft: 3,
  },
  cuisine: {
    fontSize: 12,
    fontFamily: FontFamily.semiBold,
    color: '#666666',
    marginTop: 6,
  },
});

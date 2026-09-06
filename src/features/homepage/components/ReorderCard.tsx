import { Image } from 'expo-image';
import { memo } from 'react';
import { FontFamily } from '@/theme/typography';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { RestaurantEntity } from '@/types/fixtures';

const starIcon = require('@/assets/images/star.png');
const boltIcon = require('@/assets/images/bolt.png');

export const CARD_WIDTH = 155;
const CARD_HEIGHT = 214;
const IMAGE_SIZE = 131;

function formatCount(count: number) {
  if (count >= 1000) return `${(count / 1000).toFixed(count % 1000 >= 100 ? 1 : 0)}k+`;
  return `${count}`;
}

export const ReorderCard = memo(function ReorderCard({ item }: { item: RestaurantEntity }) {
  const rating = item.platformRating;
  return (
    <Pressable style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <View style={styles.imageWrap}>
        <Image source={{ uri: item.imageUrl }} style={styles.image} contentFit="cover" transition={200} />
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
            <Text style={styles.ratingGroup} numberOfLines={1}>
              <Text style={styles.rating}>{rating.value.toFixed(1)}</Text>
              {rating.count ? <Text style={styles.count}> ({formatCount(rating.count)})</Text> : null}
            </Text>
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
      {item.displayTags?.[0] ? (
        <Text style={styles.lastOrdered} numberOfLines={1}>
          {item.displayTags[0].replace(/^Ordered/, 'Last ordered')}
        </Text>
      ) : null}
    </Pressable>
  );
});

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
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
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E9E9E9',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  name: {
    fontSize: 14,
    fontFamily: FontFamily.bold,
    color: '#333333',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
    marginTop: 2,
    paddingBottom: 8,
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
  ratingGroup: {
    marginLeft: 1,
    flexShrink: 1,
    minWidth: 0,
  },
  rating: {
    fontSize: 12,
    fontFamily: FontFamily.bold,
    color: '#17A821',
  },
  count: {
    fontSize: 12,
    fontFamily: FontFamily.bold,
    color: '#999999',
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#666666',
    marginLeft: 1,
    marginRight: 1,
    flexShrink: 0,
  },
  eta: {
    fontSize: 12,
    fontFamily: FontFamily.bold,
    color: '#666666',
    flexShrink: 1,
    minWidth: 0,
  },
  lastOrdered: {
    fontSize: 10,
    fontFamily: FontFamily.bold,
    color: '#666666',
  },
});

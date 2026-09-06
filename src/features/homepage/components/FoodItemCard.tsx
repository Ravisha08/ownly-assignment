import { Image } from 'expo-image';
import { memo } from 'react';
import { Dimensions, Image as RNImage, Pressable, StyleSheet, Text, View } from 'react-native';
import { FontFamily } from '@/theme/typography';

import type { FoodItem } from '@/types/fixtures';

// Image is a square that scales with the viewport: ~34% of screen width so a bit
// more than two cards peek on a phone, clamped to a sane range for tablets/small
// devices. Everything else (card width, snap interval) derives from this.
const IMAGE_SIZE = Math.round(
  Math.min(148, Math.max(120, Dimensions.get('window').width * 0.34)),
);
export const CARD_WIDTH = IMAGE_SIZE;

export const FoodItemCard = memo(function FoodItemCard({ item }: { item: FoodItem }) {
  const newPrice = item.displayPrice ?? item.price;
  const oldPrice =
    item.price > newPrice ? item.price : Math.round(newPrice / 0.95);
  const rating = item.ResRatingResponse?.value;

  return (
    <Pressable style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <View style={styles.imageWrap}>
        <Image
          source={{ uri: item.imageUrl }}
          style={styles.image}
          contentFit="cover"
          transition={200}
        />
        <View style={styles.addButton}>
          <RNImage
            source={require('@/assets/images/add.png')}
            style={styles.addIcon}
            resizeMode="contain"
          />
        </View>
      </View>

      <View style={styles.body}>
      <Text style={styles.name} numberOfLines={2}>
        <RNImage
          source={require('@/assets/images/red.png')}
          style={styles.vegIcon}
          resizeMode="contain"
        />
        <Text style={styles.nameGap}> </Text>
        {item.name}
      </Text>

      <View style={styles.priceRow}>
        <View style={styles.newPriceBox}>
          <Text style={styles.newPrice}>
            <Text style={styles.newPriceSymbol}>₹</Text>
            {newPrice}
          </Text>
        </View>
        <Text style={styles.oldPrice}>₹{oldPrice}</Text>
      </View>

      <View style={styles.ratingRow}>
        {rating != null ? (
          <>
            <RNImage
              source={require('@/assets/images/star.png')}
              style={styles.starIcon}
              resizeMode="contain"
            />
            <Text style={styles.rating}>{rating.toFixed(1)}</Text>
          </>
        ) : null}
        <RNImage
          source={require('@/assets/images/bolt.png')}
          style={styles.boltIcon}
          resizeMode="contain"
        />
        <Text style={styles.eta}>{item.etaInMinutes} mins</Text>
      </View>

      <Text style={styles.resName} numberOfLines={1}>
        {item.resName}
      </Text>
      </View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    paddingBottom: 12,
  },
  pressed: {
    opacity: 0.85,
  },
  body: {},
  imageWrap: {
    position: 'relative',
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
  },
  image: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: 16,
  },
  addButton: {
    position: 'absolute',
    right: 8,
    bottom: 8,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8175D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addIcon: {
    width: 20,
    height: 20,
  },
  vegIcon: {
    width: 12,
    height: 8,
  },
  nameGap: {
    fontSize: 16,
  },
  name: {
    marginTop: 8,
    fontFamily: FontFamily.medium,
    fontSize: 14,
    lineHeight: 18,
    // Always reserve two lines so the price/rating rows line up across cards,
    // regardless of how long each item name is.
    minHeight: 36,
    color: '#333333',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
  },
  newPriceBox: {
    width: 42,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    borderBottomWidth: 2,
    borderBottomColor: '#FF297D',
  },
  newPrice: {
    fontFamily: FontFamily.bold,
    fontSize: 14,
    color: '#FF297D',
  },
  newPriceSymbol: {
    fontSize: 12,
  },
  oldPrice: {
    fontFamily: FontFamily.regular,
    fontSize: 14,
    color: '#666666',
    textDecorationLine: 'line-through',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
  },
  starIcon: {
    width: 14,
    height: 14,
  },
  rating: {
    fontFamily: FontFamily.semiBold,
    fontSize: 12,
    color: '#17A821',
  },
  boltIcon: {
    width: 12,
    height: 12,
  },
  eta: {
    fontFamily: FontFamily.medium,
    fontSize: 12,
    color: '#666666',
  },
  resName: {
    fontFamily: FontFamily.semiBold,
    fontSize: 12,
    color: '#999999',
    marginTop: 12,
  },
});

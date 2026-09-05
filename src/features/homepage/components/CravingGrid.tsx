import { Image } from 'expo-image';
import { FontFamily } from '@/theme/typography';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Colors, Spacing } from '@/utils/constants';
import type { CuratedListDetail } from '@/types/fixtures';

export function CravingGrid({ items }: { items: CuratedListDetail[] }) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>What are you craving today?</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
        decelerationRate="fast">
        {items.map((item) => (
          <View key={item.id} style={styles.item}>
            <Image source={{ uri: item.imageUrl }} style={styles.image} contentFit="cover" transition={150} />
            <Text style={styles.label} numberOfLines={1}>
              {item.name}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const IMAGE_SIZE = 64;

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: Colors.background,
  },
  title: {
    fontSize: 14,
    fontFamily: FontFamily.semiBold,
    color: '#333333',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  list: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.lg,
  },
  item: {
    alignItems: 'center',
    width: IMAGE_SIZE + 12,
  },
  image: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: IMAGE_SIZE / 2,
  },
  label: {
    marginTop: 6,
    fontSize: 12,
    fontFamily: FontFamily.semiBold,
    color: '#666666',
  },
});

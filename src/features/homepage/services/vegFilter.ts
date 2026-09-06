import type { CuratedListDetail, FoodItem, RestaurantEntity } from '@/types/fixtures';

// The fixture restaurants / cuisines carry no veg flag, so we infer one from
// their cuisine tags: an item counts as veg only when none of its tags match
// this non-veg list. Food items are the exception — they ship a real
// `vegOrNonVeg` flag.
const NON_VEG_KEYWORDS = [
  'egg',
  'biryani',
  'chettinad',
  'andhra',
  'chinese',
  'kebab',
  'chicken',
  'mutton',
  'fish',
  'seafood',
  'prawn',
  'meat',
  'bengali',
  'shawarma',
  'tikka',
  'butter chicken',
  'non veg',
  'non-veg',
];

function hasNonVegKeyword(values: string[]) {
  return values.some((value) => {
    const v = value.toLowerCase();
    return NON_VEG_KEYWORDS.some((kw) => v.includes(kw));
  });
}

export function isVegRestaurant(item: RestaurantEntity) {
  return !hasNonVegKeyword([...(item.knownFor ?? []), item.name]);
}

export function isVegCuisine(item: CuratedListDetail) {
  return !hasNonVegKeyword([item.name]);
}

export function isVegFoodItem(item: FoodItem) {
  return item.vegOrNonVeg === 'veg';
}

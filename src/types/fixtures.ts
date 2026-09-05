export interface Rating {
  type?: string;
  value: number;
  count: number;
}

export interface TrustMarker {
  type: string;
  name: string;
}

export interface CuratedListDetail {
  id: string;
  name: string;
  imageUrl: string;
  backGroundColour?: string;
  section?: string;
  rank?: number;
  deepLinkUrl?: string;
  coverImageUrl?: string;
  subText?: string;
  curatedListType?: string;
  foodType?: string;
}

export interface TopBannerItem {
  id: string;
  name: string;
  curatedListId: string;
  imageUrl: string;
  backGroundColour?: string;
  gifUrl?: string;
  feedConfigId?: string;
  deepLinkUrl?: string;
}

export interface CuratedListGroup {
  id: string;
  name: string;
  imageUrl: string;
  backGroundColour: string | null;
  curatedListIds: string[];
  rank?: number;
  section?: string;
}

export interface FeedConfig {
  mealForOne: {
    id: string;
    name: string;
    section: string;
    curatedListDetailsList: CuratedListDetail[];
  };
  restaurant: {
    id: string;
    name: string;
    section: string;
    topBanner: { banners: TopBannerItem[]; rank: number; section: string };
    curatedListGroups: CuratedListGroup[];
    curatedListDetailsList: CuratedListDetail[];
    reOrderConfig: { name: string; rank: number; imageUrl: string; backGroundColour: string };
  };
  timeRange: { from: number; to: number };
}

export interface RestaurantEntity {
  entityType: 'RESTAURANT';
  entityId: string;
  brandId?: string;
  name: string;
  cleanedName?: string;
  imageUrl: string;
  brandLogo?: string;
  price?: number;
  numberOfRatings?: number;
  etaInMinutes: number;
  distanceInKM: number;
  address?: { city: string; area: string };
  knownFor?: string[];
  isOpen?: boolean;
  displayTags?: string[];
  trustMarkers?: TrustMarker[];
  platformRating?: Rating;
  orderingEnabled: boolean;
}

export interface FoodItem {
  foodItemId: string;
  resId: string;
  resName: string;
  name: string;
  cleanedName?: string;
  description?: string;
  price: number;
  displayPrice?: number;
  imageUrl: string;
  vegOrNonVeg: 'veg' | 'non-veg';
  hasVariants: boolean;
  distanceInKm?: number;
  etaInMinutes: number;
  ResRatingResponse?: Rating;
  resImageUrl?: string;
}

export interface ServiceabilityResponse {
  status: number;
  data: {
    isServiceable: boolean;
    reason: string;
    message: string;
  };
}

export interface FeedConfigResponse {
  status: number;
  data: FeedConfig;
}

export interface EntityResultsResponse {
  status: number;
  data: { SearchId: string; TotalCount: number; EntityResults: RestaurantEntity[] | null; FoodItems: null };
}

export interface FoodItemsResponse {
  status: number;
  data: { SearchId: string; TotalCount: number; EntityResults: null; FoodItems: FoodItem[] };
}

export interface CuratedListDetailsResponse {
  status: number;
  data: CuratedListDetail[];
}

export interface FixturePack {
  serviceability: ServiceabilityResponse;
  not_serviceable: ServiceabilityResponse;
  feed_config: FeedConfigResponse;
  curated_feed_Food_item: FoodItemsResponse;
  curated_feed_res_item: EntityResultsResponse;
  paginated_restaurant_feed: EntityResultsResponse;
  curated_list_details: CuratedListDetailsResponse;
  past_orders: EntityResultsResponse;
}

// ---- View-model consumed by the UI layer (built by the mapper) ----

export interface CuratedRestaurantSection {
  id: string;
  title: string;
  items: RestaurantEntity[];
}

export interface HomeViewModel {
  banner?: TopBannerItem;
  reorderItems: RestaurantEntity[];
  mealForOneTitle: string;
  mealForOneItems: FoodItem[];
  curatedSections: CuratedRestaurantSection[];
  cravingItems: CuratedListDetail[];
  mainListItems: RestaurantEntity[];
}

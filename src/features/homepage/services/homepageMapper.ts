import type {
  CuratedListDetail,
  CuratedListDetailsResponse,
  EntityResultsResponse,
  FeedConfigResponse,
  FoodItemsResponse,
  HomeViewModel,
} from '@/types/fixtures';

/**
 * Design-copy titles for the curated restaurant sections, keyed by the fixture's
 * curatedListDetailsList rank. The fixture's own `name` field ("Great Food, Better
 * Prices" / "Known & Loved") doesn't appear anywhere in the reference design, so per an
 * explicit design-fidelity call, the section headers use the design's copy instead.
 */
const CURATED_SECTION_TITLE_BY_RANK: Record<number, string> = {
  2: 'Best rated restos near you',
  3: 'Top Picks',
};

interface MapHomeViewModelInput {
  feedConfig: FeedConfigResponse;
  mealForOneResponse: FoodItemsResponse;
  curatedSectionResponses: EntityResultsResponse[];
  curatedListDetails: CuratedListDetailsResponse;
  pastOrders: EntityResultsResponse;
  mainFeed: EntityResultsResponse;
}

export function sortCuratedConfigsByRank(feedConfig: FeedConfigResponse) {
  return [...feedConfig.data.restaurant.curatedListDetailsList].sort(
    (a, b) => (a.rank ?? 0) - (b.rank ?? 0),
  );
}

export function mapHomeViewModel({
  feedConfig,
  mealForOneResponse,
  curatedSectionResponses,
  curatedListDetails,
  pastOrders,
  mainFeed,
}: MapHomeViewModelInput): HomeViewModel {
  const restaurantConfig = feedConfig.data.restaurant;
  const sortedCuratedConfigs = sortCuratedConfigsByRank(feedConfig);

  const detailsById = new Map(curatedListDetails.data.map((item) => [item.id, item]));
  const cravingGroup = restaurantConfig.curatedListGroups[0];
  const cravingItems = (cravingGroup?.curatedListIds ?? [])
    .map((id) => detailsById.get(id))
    .filter((item): item is CuratedListDetail => Boolean(item));

  const curatedSections = sortedCuratedConfigs.map((config, index) => ({
    id: config.id,
    title: CURATED_SECTION_TITLE_BY_RANK[config.rank ?? -1] ?? config.name,
    items: curatedSectionResponses[index]?.data.EntityResults ?? [],
  }));

  return {
    banner: restaurantConfig.topBanner.banners[0],
    reorderItems: pastOrders.data.EntityResults ?? [],
    mealForOneTitle: feedConfig.data.mealForOne.curatedListDetailsList[0]?.name ?? 'Meal for one',
    mealForOneItems: mealForOneResponse.data.FoodItems ?? [],
    curatedSections,
    cravingItems,
    mainListItems: mainFeed.data.EntityResults ?? [],
  };
}

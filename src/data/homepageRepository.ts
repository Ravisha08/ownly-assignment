import fixtures from '../../docs/homepage-assignment-candidate-fixtures.json';
import type { FixturePack } from '@/types/fixtures';

const data = fixtures as unknown as FixturePack;

function delay<T>(value: T, ms: number): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

/** Mirrors POST /serviceability/check. Pure mock switch — no real device location. */
export function checkServiceability(useNotServiceable = false) {
  return delay(useNotServiceable ? data.not_serviceable : data.serviceability, 350);
}

/** Mirrors GET /feed-configs/current-feed-config */
export function getFeedConfig() {
  return delay(data.feed_config, 250);
}

/** Mirrors POST /getFeedForCuratedList for the meal-for-one rail */
export function getMealForOneItems() {
  return delay(data.curated_feed_Food_item, 250);
}

/**
 * Mirrors POST /getFeedForCuratedList for a restaurant curated section.
 * The real API is called once per curatedListDetailsList entry with a different id;
 * this fixture pack only ships one restaurant-curated response, reused for both sections
 * per the assignment note.
 */
export function getRestaurantCuratedItems(_curatedListId: string) {
  return delay(data.curated_feed_res_item, 250);
}

/** Mirrors POST /getCuratedListDetails for the "What's on your mind?" grid */
export function getCuratedListDetails() {
  return delay(data.curated_list_details, 200);
}

/** Mirrors POST /get-feed-for-user-past-orders */
export function getPastOrders() {
  return delay(data.past_orders, 250);
}

/** Mirrors POST /getPaginatedRestaurantFeed */
export function getPaginatedRestaurantFeed() {
  return delay(data.paginated_restaurant_feed, 300);
}

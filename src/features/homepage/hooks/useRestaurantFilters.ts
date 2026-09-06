import { useCallback, useMemo, useState } from 'react';

import type { RestaurantEntity } from '@/types/fixtures';

export type SortKey = 'relevance' | 'rating' | 'distance' | 'priceLow';

export const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'rating', label: 'Rating (High to Low)' },
  { key: 'distance', label: 'Distance (Near to Far)' },
  { key: 'priceLow', label: 'Price (Low to High)' },
];

export type ToggleKey = 'rating4' | 'under30' | 'under200';

export interface RestaurantFilters {
  toggles: Record<ToggleKey, boolean>;
  sort: SortKey;
  activeCount: number;
  toggle: (key: ToggleKey) => void;
  setSort: (key: SortKey) => void;
  reset: () => void;
  apply: (items: RestaurantEntity[]) => RestaurantEntity[];
}

const INITIAL_TOGGLES: Record<ToggleKey, boolean> = {
  rating4: false,
  under30: false,
  under200: false,
};

export function useRestaurantFilters(): RestaurantFilters {
  const [toggles, setToggles] = useState(INITIAL_TOGGLES);
  const [sort, setSort] = useState<SortKey>('relevance');

  const toggle = useCallback((key: ToggleKey) => {
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const reset = useCallback(() => {
    setToggles(INITIAL_TOGGLES);
    setSort('relevance');
  }, []);

  const apply = useCallback(
    (items: RestaurantEntity[]) => {
      let next = items;

      if (toggles.rating4) {
        next = next.filter((item) => (item.platformRating?.value ?? 0) >= 4);
      }
      if (toggles.under30) {
        next = next.filter((item) => item.etaInMinutes < 30);
      }
      if (toggles.under200) {
        next = next.filter((item) => (item.price ?? Number.MAX_SAFE_INTEGER) < 200);
      }

      if (sort !== 'relevance') {
        next = [...next].sort((a, b) => {
          if (sort === 'rating') {
            return (b.platformRating?.value ?? 0) - (a.platformRating?.value ?? 0);
          }
          if (sort === 'distance') {
            return (a.distanceInKM ?? 0) - (b.distanceInKM ?? 0);
          }
          return (a.price ?? Number.MAX_SAFE_INTEGER) - (b.price ?? Number.MAX_SAFE_INTEGER);
        });
      }

      return next;
    },
    [toggles, sort],
  );

  const activeCount = useMemo(
    () => Object.values(toggles).filter(Boolean).length + (sort === 'relevance' ? 0 : 1),
    [toggles, sort],
  );

  return useMemo(
    () => ({ toggles, sort, activeCount, toggle, setSort, reset, apply }),
    [toggles, sort, activeCount, toggle, reset, apply],
  );
}

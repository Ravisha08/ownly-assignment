import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  checkServiceability,
  getCuratedListDetails,
  getFeedConfig,
  getMealForOneItems,
  getPaginatedRestaurantFeed,
  getPastOrders,
  getRestaurantCuratedItems,
} from '@/data/homepageRepository';
import { mapHomeViewModel, sortCuratedConfigsByRank } from '@/features/homepage/services/homepageMapper';
import type { HomeViewModel } from '@/types/fixtures';

export type HomeFeedStatus = 'checking' | 'not-serviceable' | 'loading' | 'ready' | 'error';

const EMPTY_VIEW_MODEL: HomeViewModel = {
  banner: undefined,
  reorderItems: [],
  mealForOneTitle: '',
  mealForOneItems: [],
  curatedSections: [],
  cravingItems: [],
  mainListItems: [],
};

export function useHomeFeed() {
  const [status, setStatus] = useState<HomeFeedStatus>('checking');
  const [notServiceableMessage, setNotServiceableMessage] = useState('');
  const [viewModel, setViewModel] = useState<HomeViewModel>(EMPTY_VIEW_MODEL);
  // __DEV__-only demo switch: flips which mocked serviceability response is returned,
  // so both states are easy to show without editing code. Not a real location check.
  const [forceNotServiceable, setForceNotServiceable] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setStatus('checking');
        const serviceability = await checkServiceability(forceNotServiceable);
        if (cancelled) return;

        if (!serviceability.data.isServiceable) {
          setNotServiceableMessage(serviceability.data.message);
          setStatus('not-serviceable');
          return;
        }

        setStatus('loading');

        const feedConfig = await getFeedConfig();
        const sortedCuratedConfigs = sortCuratedConfigsByRank(feedConfig);

        const [mealForOneResponse, curatedSectionResponses, curatedListDetails, pastOrders, mainFeed] =
          await Promise.all([
            getMealForOneItems(),
            Promise.all(sortedCuratedConfigs.map((config) => getRestaurantCuratedItems(config.id))),
            getCuratedListDetails(),
            getPastOrders(),
            getPaginatedRestaurantFeed(),
          ]);
        if (cancelled) return;

        setViewModel(
          mapHomeViewModel({
            feedConfig,
            mealForOneResponse,
            curatedSectionResponses,
            curatedListDetails,
            pastOrders,
            mainFeed,
          }),
        );
        setStatus('ready');
      } catch {
        if (!cancelled) setStatus('error');
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [forceNotServiceable]);

  const toggleNotServiceableForDemo = useCallback(() => {
    if (__DEV__) setForceNotServiceable((prev) => !prev);
  }, []);

  return useMemo(
    () => ({ status, notServiceableMessage, ...viewModel, toggleNotServiceableForDemo }),
    [status, notServiceableMessage, viewModel, toggleNotServiceableForDemo],
  );
}

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
  const [refreshing, setRefreshing] = useState(false);

  // Loads the whole feed. `silent` (pull-to-refresh) keeps the current content on
  // screen instead of dropping back to the skeleton.
  const load = useCallback(
    async (silent = false, isCancelled: () => boolean = () => false) => {
      try {
        if (!silent) setStatus('checking');
        const serviceability = await checkServiceability(forceNotServiceable);
        if (isCancelled()) return;

        if (!serviceability.data.isServiceable) {
          setNotServiceableMessage(serviceability.data.message);
          setStatus('not-serviceable');
          return;
        }

        if (!silent) setStatus('loading');

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
        if (isCancelled()) return;

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
        if (!isCancelled() && !silent) setStatus('error');
      }
    },
    [forceNotServiceable],
  );

  useEffect(() => {
    let cancelled = false;
    load(false, () => cancelled);
    return () => {
      cancelled = true;
    };
  }, [load]);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await load(true);
    } finally {
      setRefreshing(false);
    }
  }, [load]);

  const toggleNotServiceableForDemo = useCallback(() => {
    setForceNotServiceable((prev) => !prev);
  }, []);

  const setNotServiceable = useCallback((value: boolean) => {
    setForceNotServiceable(value);
  }, []);

  return useMemo(
    () => ({
      status,
      notServiceableMessage,
      refreshing,
      refresh,
      ...viewModel,
      isNotServiceable: forceNotServiceable,
      setNotServiceable,
      toggleNotServiceableForDemo,
    }),
    [
      status,
      notServiceableMessage,
      refreshing,
      refresh,
      viewModel,
      forceNotServiceable,
      setNotServiceable,
      toggleNotServiceableForDemo,
    ],
  );
}

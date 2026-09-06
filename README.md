# Ownly — Homepage (React Native / Expo)

A production-like build of the Figma homepage, driven entirely by the local fixture pack.
Focus areas: UI fidelity, motion/interaction polish, and correct fixture-to-section mapping.

**Demo video:** https://drive.google.com/file/d/1j_yp4euw-LuVVlNhuW6flipYMCYo5i8O/view?usp=sharing

## Run instructions

Requirements: Node 20+, and the Expo Go app (or an iOS/Android simulator).

```bash
npm install
npx expo start
```

Then:
- press `i` for the iOS simulator, `a` for Android, or scan the QR with Expo Go
- no backend / network needed — all data is read from `docs/homepage-assignment-candidate-fixtures.json`

Built on **Expo SDK 57** (React Native 0.86, Reanimated 4).

## Data flow

`src/data/homepageRepository.ts` loads the fixture file and exposes each API key.
`src/features/homepage/services/homepageMapper.ts` maps raw fixture shapes to view models.
`src/features/homepage/hooks/useHomeFeed.ts` runs the homepage flow:

1. serviceability gate (`serviceability.data.isServiceable`)
2. `feed_config` → top banner, reorder, meal-for-one, curated sections, "What are you craving today?"
3. section data joined from `past_orders`, `curated_feed_Food_item`, `curated_feed_res_item`, `curated_list_details`, `paginated_restaurant_feed`

Empty sections are hidden; loading shows skeletons; non-serviceable shows a dedicated view.

## Project structure

```
src/
  app/                       expo-router entry
  data/                      fixture repository (single data source)
  theme/                     typography (Figtree, exact Figma scale)
  utils/                     text helpers, constants
  features/homepage/
    HomeScreen.tsx           screen shell + scroll orchestration
    hooks/                   useHomeFeed, useRestaurantFilters
    services/                homepageMapper, vegFilter
    components/              hero, rails, cards, sticky bars, states
```

## What's included

- Runnable Expo project
- Mocked response data (`docs/homepage-assignment-candidate-fixtures.json`)
- `HIGHLIGHTS_AND_ASSUMPTIONS.md` — what I built for polish, plus simplifications and scope notes
- Screen recording — Drive link at the top of this README

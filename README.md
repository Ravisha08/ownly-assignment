# Ownly Homepage (React Native / Expo)

The homepage from the Figma, built in React Native. All data comes from the local fixture file,
there is no backend.

**Demo video:** https://drive.google.com/file/d/1j_yp4euw-LuVVlNhuW6flipYMCYo5i8O/view?usp=sharing

If possible, I'd really appreciate it if you could try the app on **both iOS and Android**. I've
tuned a few things (notch handling, status-bar colour, overscroll, shadows) for each platform
separately, so both get their own polish rather than one shared version.

## How to run

Needs Node 20+. Built on Expo SDK 57 (React Native 0.86). Data is read from
`docs/homepage-assignment-candidate-fixtures.json`.

```bash
npm install
npx expo start
```

Then open it (please try both iOS and Android if you can):

- **iOS Simulator**: press `i` (needs Xcode on a Mac)
- **Android Emulator**: press `a` (needs Android Studio and a virtual device)
- **Real phone**: install **Expo Go** and scan the QR code (phone on the same Wi-Fi)

### Note for running on a real iPhone

Starting with Expo Go SDK 57, Expo now requires you to be logged in with an Expo account to open
a project on a physical iPhone. You have to be signed in both in the terminal and in the Expo Go
app, using the same account. This is an Expo change, not something in this project
([their announcement](https://expo.dev/changelog/expo-go-57-login)).

One-time setup:

1. Make a free account at https://expo.dev/signup
2. In the terminal, run `npx expo login` and sign in
3. In the Expo Go app on the phone, open the account tab and sign in with the same account
4. Run `npx expo start` and scan the QR code

The **iOS Simulator** and **Android** (emulator or Expo Go) do not need any of this, they open
straight away. So if you'd rather skip the account step, those are the quickest options.

## How the data flows

1. `homepageRepository` reads the fixture file.
2. `homepageMapper` turns the raw JSON into clean data for the UI.
3. `useHomeFeed` runs the flow: check serviceability, read `feed_config`, then build each section
   (top banner, reorder, meal-for-one, curated restaurant lists, "What are you craving today?",
   main restaurant list).

Sections with no data are hidden. While loading, skeletons show. If the area is not serviceable,
a separate screen shows instead.

## Folder layout

```
src/
  app/                  expo-router entry
  data/                 the fixture file reader (one source of data)
  theme/                fonts and type scale (Figtree, from Figma)
  utils/                small text helpers, constants
  features/homepage/
    HomeScreen.tsx      the screen + scroll handling
    hooks/              useHomeFeed, useRestaurantFilters
    services/           homepageMapper, vegFilter
    components/         hero, rails, cards, sticky bars, empty states
```

Everything homepage-related sits in `features/homepage/`. Shared code sits outside it.
Filtering is kept in one place (`useRestaurantFilters` and `vegFilter`) so the veg toggle,
the rating chip and lowest-price mode all work off the same list.

## Things I did to make a static screen feel alive

The data is fixed, so most of the work went into making the screen feel like a real app:

- **Skeleton loading** instead of a spinner, shaped like the real content.
- **Sticky header.** The "What are you craving today?" grid and the filter bar stick to the top
  as you scroll past them, and slide back into the feed on the way up. The filter bar gets a
  soft shadow while it is stuck.
- **Notch and status-bar colour change with the scroll.** It matches the banner at the top, then
  turns white once you reach the white part of the feed.
- **Banner colour matched** across the banner image, the header and the notch so the top looks
  like one piece.
- **Gradients** in the top-deals section, matched to Figma.
- **Reanimated** used for the motion so scrolling and the sticky part stay smooth.
- **Horizontal lists** scroll freely, no snapping one card at a time.
- **Empty states are animated**, including the one for when a filter matches nothing.
- **Lowest-price toggle** has its own small animation.
- **Back-to-top button**, not in Figma, taken from the reference video.
- **Close to Figma:** exact colours, the Figtree font, and matching text sizes, weights,
  spacing, padding and corner radius. Images and assets exported from Figma.
- **Veg on/off filter works** and updates the list.
- **Filter bar works:** veg and rating change the list live, with the empty state when nothing
  matches.
- Made custom icons for the ones missing in Figma (veg mark, lowest-price icon).
- Text that comes in lowercase is shown with a capital first letter.

## Assumptions

- **Search is not built.** There was no spec for it and little time, so I left it out instead of
  shipping something half-done, and spent the time on things I could finish well.
- **Serviceability:** to show both the working and the "not serviceable" screens, the header has a
  fixed address with a small menu that switches between them.
- **Lowest-price mode** only plays the animation for now, it does not re-sort the list yet.
- **Filters** (veg, rating) use simple rules I assumed over the fixture data.
- **Top-deal card titles** can be two lines in Figma. To keep the text under each card lined up
  across a row, the title always keeps two lines of space even when it fits on one.
- Both curated restaurant lists use the same `curated_feed_res_item` response, as the brief says
  (the real app calls the same API with different ids).
- The main restaurant list shows the one page from the fixture, no real pagination.

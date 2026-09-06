# Highlights & Assumptions

## How the code is organised

- **Feature-based structure.** Everything for the homepage lives in one place:
  `src/features/homepage/` (screen, hooks, services, components).
  Shared things sit outside it — `src/data`, `src/theme`, `src/utils`.
- **Clear data path:**
  `homepageRepository` reads the fixture file →
  `homepageMapper` turns raw JSON into clean view models →
  `useHomeFeed` runs the flow (serviceability check, then feed_config, then each section) →
  components just render what they are given.
- **Filtering kept in one place** (`useRestaurantFilters` + `services/vegFilter`) so the veg toggle,
  the rating chip and lowest-price mode all work off the same derived list.

## Things I did to make a static screen feel alive

The data is fixed and there is no backend, so most of the effort went into making it feel like a real app:

- **Skeleton loading** screens instead of a spinner, shaped like the real content.
- **Smooth sticky header.** The "What are you craving today?" grid and the filter bar stick to the top
  as you scroll past them, blend back into the feed on the way up, and detach again on the way down.
  The filter bar picks up a drop shadow once it is stuck.
- **Notch / status-bar colour follows the scroll** — it matches the banner gradient at the top,
  fades to the page background, and turns white once you reach the white part of the feed.
- **Banner gradient matched** across the banner image, the header and the notch so the top looks seamless.
- **Linear gradients** in the top-deals section, matched to Figma.
- **Reanimated** used for all the motion so scrolling and the sticky transitions stay smooth.
- **Smooth horizontal rails** — they fling freely, no snapping card by card.
- **Animated empty states**, including one for when filters match nothing.
- **Lowest-price mode toggle** has its own little animation.
- **Back-to-top button** — not in Figma, added from the reference video.
- **Pixel-level polish** — exact Figma colours, the Figtree font from Figma, and every text size,
  weight, line-height, margin, padding and radius matched. Assets exported straight from Figma.
- **Veg on/off filtering** actually works and updates the list.
- **The filter bar works** — veg and rating filters change the list live, with the animated empty
  state when nothing matches.
- Icons that were not in Figma (veg mark, lowest-price icon) were recreated to match the style.
- Text that comes through in lowercase is capitalised for display.

## Assumptions & simplifications

- **Search is not wired up.** I had no spec or context for it and little time, so I left it out
  rather than ship something half-working. I put the time into things I could finish properly.
- **Serviceability:** to show both the serviceable and non-serviceable screens, the header has a
  static address with a small menu (`ServiceabilityMenu`) that switches between the two.
- **Lowest-price mode** currently drives the animation only — it does not re-sort the list yet.
- **Filters** (veg, rating) run on sensible rules I assumed over the fixture data; they change the
  visible list and trigger the empty state when nothing matches.
- **Top-deal card titles** can run to two lines in Figma. To keep the details under each card lined up
  across a row, the title always reserves two lines of height even when it fits on one.
- Both curated restaurant sections use `curated_feed_res_item` as their response (as the brief says —
  the real flow calls the same API with different ids).
- The main restaurant list shows the single fixture page — no real pagination.

// What's new: every change to the apps, written for players. Source of truth for the changelog app,
// and read by whatsnew.js for the "What's new" dot in every app's header. Hand-written.
//
// Add new entries at the TOP. These are published, so write for players, and never quote private
// notes or name anyone's data.
//
// Entry fields:
//   id        unique: "<date>-<slug>". Used for permalinks (#e/<id>), so never change it once published.
//   date      "YYYY-MM-DD", the day it went live
//   kind      new | improved | fixed | data      (see CHANGELOG_KINDS)
//   apps      [app id]: which apps it touches     (see CHANGELOG_APPS; the same ids as SITE.links)
//   title     a few words
//   summary   1–3 sentences: what changed and why a player would care
//   details   optional [text]: bullets with more detail
//   links     optional [{ label, app, q?, hash? } | { label, url }]: where to try it
//   feature   optional: the features/<id>.md this shipped (for the maintainer; not shown)

window.CHANGELOG_KINDS = [
  { id: "new", label: "New" },
  { id: "improved", label: "Improved" },
  { id: "fixed", label: "Fixed" },
  { id: "data", label: "Game data" },
];

window.CHANGELOG_APPS = {
  ships: "Ships",
  items: "Items",
  components: "Ship components",
  locations: "Locations",
  contracts: "Contracts",
  dashboard: "Dashboard",
  careers: "Careers",
  glossary: "Glossary",
  changelog: "What's new",
  roadmap: "Roadmap",
};

window.CHANGELOG = [
  {
    id: "2026-10-18-roadmap",
    date: "2026-10-18",
    kind: "new",
    apps: ["roadmap"],
    title: "Roadmap",
    summary: "See every idea in the works, in the order we plan to build it: accounts and friends, orgs and parties, team dashboards, a job ledger for splitting profits, and more. Shipped ideas link to their What's new entry.",
    details: [
      "Each idea shows its status (Idea, Planned, In progress, Shipped) and what it's waiting on.",
      "Priorities can change as plans firm up.",
    ],
    links: [{ label: "Open the roadmap", app: "roadmap" }],
    feature: "roadmap-app",
  },
  {
    id: "2026-10-18-whats-new",
    date: "2026-10-18",
    kind: "new",
    apps: ["changelog", "ships", "items", "components", "locations", "contracts", "dashboard", "careers", "glossary"],
    title: "What's new",
    summary: "This page: every change to the apps, newest first. A dot next to \"What's new\" in any app's header tells you when there's something you haven't seen yet.",
    details: [
      "Filter by app, or by kind of change.",
      "Every entry has its own link, so you can share one.",
    ],
    feature: "changelog-app",
  },
  {
    id: "2026-10-18-search-links",
    date: "2026-10-18",
    kind: "fixed",
    apps: ["ships", "items", "components", "locations"],
    title: "Links into a search show everything",
    summary: "Links that open the ships, items or ship components app with a search (for example \"Drake ships\" or the locations app's \"Ships sold here\") searched only your wishlist. They now search everything.",
  },
  {
    id: "2026-10-18-glossary-links",
    date: "2026-10-18",
    kind: "improved",
    apps: ["ships", "items", "components", "contracts", "careers", "locations"],
    title: "Names link to the glossary",
    summary: "Makers on ships, items and parts, the contractor on a contract, contractors in the careers rank table, and systems, planets, moons, cities and stations in locations now link to their glossary entry.",
  },
  {
    id: "2026-10-18-glossary",
    date: "2026-10-18",
    kind: "new",
    apps: ["glossary"],
    title: "Lore & Glossary",
    summary: "Look up anything: a contractor like Wikelo, a term like aUEC, QT or CCU, slang like 30k or o7, or the lore of a species, company or place. Every official Galactapedia article, plus game notes on what things mean when you play.",
    details: [
      "Contractors show their contracts, kinds of work, pay per hour and rank ladder from the contracts data.",
      "Makers show how many ships, items and parts they build; places show where they are.",
      "Search understands other names and spellings: CS finds CrimeStat, VLRT finds bounty risk tiers.",
    ],
    links: [{ label: "Look up Wikelo", app: "glossary", hash: "find/Wikelo" }],
  },
  {
    id: "2026-10-18-careers-more",
    date: "2026-10-18",
    kind: "improved",
    apps: ["careers"],
    title: "Nine more careers",
    summary: "Security & escort, piracy, smuggling, courier & data running, gathering & xenobiology, crafting, Wikelo trading, racing, and ship engineer & crew, for 17 careers in all. The index now groups them: combat, industry, transport & trade, support, exploration & sport, and outlaw.",
    details: ["Career stages can point you to contracts that reward crafting blueprints."],
  },
  {
    id: "2026-10-18-careers",
    date: "2026-10-18",
    kind: "new",
    apps: ["careers"],
    title: "Careers",
    summary: "A step-by-step path for each way to play: bounty hunting, hauling, mining, salvage, mercenary work, medical, exploration, and refueling and repair. Each has stages, a checklist, the ships and gear to get, live contract numbers, and the choices along the way.",
    details: [
      "A character page tracks your reputation ranks, the careers you follow, and the steps you've done.",
      "Steps tick themselves when you own the ship or have the rank.",
    ],
  },
  {
    id: "2026-10-18-dashboards-2",
    date: "2026-10-18",
    kind: "improved",
    apps: ["ships", "components", "items", "contracts", "dashboard"],
    title: "More charts across the apps",
    summary: "New views that compare things at a glance.",
    details: [
      "Ships: a My fleet tab showing which roles and careers your ships cover, and your pledge upgrade ladder.",
      "Ship components: a Trade-offs tab (the best part for each type and size) and a power budget chart in the planner.",
      "Items: a Temperature tab for armor and clothing.",
      "Contracts: how pay per hour spreads within each kind of work.",
      "Dashboard: a Price freshness tab showing how old each shop price is.",
    ],
  },
  {
    id: "2026-10-18-dashboard",
    date: "2026-10-18",
    kind: "new",
    apps: ["dashboard", "ships"],
    title: "Dashboard",
    summary: "Charts across the apps: how many hours of contracts it takes to earn everything on your wishlists, and the fewest shop stops to buy it all.",
    details: ["Ships gets a Value map tab: price against a capability you pick, with a best-value line."],
  },
  {
    id: "2026-10-18-components",
    date: "2026-10-18",
    kind: "new",
    apps: ["components"],
    title: "Ship components",
    summary: "Every ship weapon, component, missile, mining and salvage part, utility item and paint, with stats and shop prices, and every ship's stock loadout.",
    details: [
      "The loadout planner swaps parts slot by slot and totals DPS, shields, power and quantum against stock.",
      "It gives you a shopping list, and saves your loadouts as builds.",
    ],
  },
  {
    id: "2026-10-17-compare-charts",
    date: "2026-10-17",
    kind: "improved",
    apps: ["ships"],
    title: "Better ship comparisons",
    summary: "The Compare tab charts each stat with every ship in its own color, and lines up capabilities, stock weapons and components, guides and things to know side by side.",
    details: ["New stats include agility, boost, acceleration, sustained DPS, missile damage, shield regen, quantum speed, fuel and beds."],
  },
  {
    id: "2026-10-17-compare",
    date: "2026-10-17",
    kind: "new",
    apps: ["ships"],
    title: "Compare ships and upgrade costs",
    summary: "Compare up to four ships side by side, with the best values starred, and work out what an upgrade costs in real money and in aUEC, with a warning when an upgrade isn't possible.",
    details: ["Mark ships as bought in game or pledged. The detail panel lists upgrade costs from your pledged ships."],
  },
  {
    id: "2026-10-17-contracts",
    date: "2026-10-17",
    kind: "new",
    apps: ["contracts"],
    title: "Contracts",
    summary: "Every contract in Stanton, Pyro and Nyx, grouped into kinds of work, with pay, pay per hour from community run times, the ranks they need, and their rewards.",
  },
  {
    id: "2026-10-17-locations",
    date: "2026-10-17",
    kind: "new",
    apps: ["locations", "items", "ships"],
    title: "Locations",
    summary: "Every planet, moon, city, station, outpost and shop in Stanton, Pyro and Nyx, with an overview of each planet, search, and directions to the main hubs.",
    details: ["Shop rows in the items and ships apps link to the place."],
  },
  {
    id: "2026-10-17-links",
    date: "2026-10-17",
    kind: "improved",
    apps: ["ships", "items"],
    title: "Apps link to each other",
    summary: "Every app's header links to the others. On wide screens the list and the detail panel scroll on their own.",
  },
  {
    id: "2026-10-17-items",
    date: "2026-10-17",
    kind: "new",
    apps: ["items"],
    title: "Items",
    summary: "About 5,000 personal weapons, armor pieces, clothing items and tools, with shop prices, search filters, matching armor sets, and a wishlist and owned list.",
  },
  {
    id: "2026-10-16-ship-filters",
    date: "2026-10-16",
    kind: "improved",
    apps: ["ships"],
    title: "Search filters for ships",
    summary: "Type filters straight into the search box (cargo>=32, price<2m, maker:drake, is:rentable), or build them from the Filters panel. Filtered views can be bookmarked.",
  },
  {
    id: "2026-10-16-ships",
    date: "2026-10-16",
    kind: "new",
    apps: ["ships"],
    title: "Ships",
    summary: "Every ship and vehicle in Star Citizen, concepts included: stats, pledge and in-game prices, where to buy or rent them, and a wishlist.",
    details: ["Things to know for each ship, and how-to guides for some of them."],
  },
];

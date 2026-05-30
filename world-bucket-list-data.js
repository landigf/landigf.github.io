/* world-bucket-list-data.js — entry point for the World Bucket List dataset.
 *
 * The destination data lives in per-continent files under wbl-data/, each of
 * which defines a global array (window.WBL_EUROPE, window.WBL_ASIA, …). Those
 * files are loaded BEFORE this one in world-bucket-list.html. This file merges
 * them into window.BUCKET_LIST and exposes planning metadata in BUCKET_META.
 *
 * To tweak the dataset later: edit the relevant wbl-data/<continent>.js file.
 *
 * IMPORTANT: every `weekends` and `costUSD` value across the dataset is a ROUGH,
 * per-person PLANNING ESTIMATE (economy / mid-range) — a budgeting device, not a
 * quote or a measured figure. See the "How the numbers work" section on the page.
 */
(function () {
  "use strict";

  window.BUCKET_LIST = [].concat(
    window.WBL_EUROPE || [],
    window.WBL_ASIA || [],
    window.WBL_NORTH_AMERICA || [],
    window.WBL_SOUTH_AMERICA || [],
    window.WBL_AFRICA || [],
    window.WBL_OCEANIA || [],
    window.WBL_ANTARCTICA || []
  );

  window.BUCKET_META = {
    // 1 USD expressed in each currency (approximate, late May 2026).
    ratesFromUSD: { USD: 1, EUR: 0.86, CHF: 0.784 },
    ratesAsOf: "late May 2026 (approx.)",
    currencySymbols: { USD: "$", EUR: "€", CHF: "CHF " },
    regionOrder: [
      "Europe",
      "Asia",
      "North America",
      "South America",
      "Africa",
      "Oceania",
      "Antarctica"
    ],
    estimateNote:
      "All weekend-units and costs are rough per-person planning estimates " +
      "(economy / mid-range), not quotes or measured figures."
  };
})();

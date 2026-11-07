# Testing documentation

## Test environment

- **Date:** 2026-11-07
- **Runtime checks:** Node.js v24.20.0; Python static HTTP server
- **Browser checks:** Integrated Chromium browser (version not reported), served from `127.0.0.1`
- **Viewport widths:** 360, 390, 768, 1024, and 1440 CSS pixels

## Results performed

| Test | Result | Evidence / notes |
|---|---|---|
| JavaScript syntax | Passed | `node --check` completed for all files in `js/`. |
| JSON parsing | Passed | Appliance and tip datasets plus the domestic tariff configuration parsed successfully. |
| Local HTML paths and duplicate IDs | Passed | A Python HTML parser checked all five pages; no missing local references or duplicate IDs found. This is not a W3C validation. |
| Page structure and control labels | Passed | Each page had one H1 and a meta description; form controls had associated labels or accessible names; no `<img>` without `alt` was found. |
| Basic text-token contrast calculation | Passed with scope limit | Against white, calculated ratios were 5.36:1 for `#147A4C`, 8.03:1 for `#105C3B`, 5.57:1 for `#5D6B69`, and 4.76:1 for `#64748B`. This is not a full contrast audit of every text/background pairing. |
| Relative paths under a project subpath | Passed | Served the project as `/WattWise/`; appliance JSON loaded (14 cards) and the calculator loaded its catalogue and query prefill. This is a local simulation, not a published deployment. |
| PUCSL tariff calculation | Passed | `node tests\tariff-calculation.test.js` checks 12 consumption values, detailed block-charge totals, and 6 invalid-input/configuration cases, including rejection of non-domestic categories and invalid tariff blocks/rates. |
| Tariff scenario examples | Passed with correction | 30, 60, 90, 120, 150, and 180 kWh match the requested examples. At 210 kWh, Annex 2 specifies 180 × Rs. 32.50 + 30 × Rs. 100 = Rs. 8,850 energy charge; with Rs. 2,500 fixed charge, the corrected total is Rs. 11,350. This corrects the conflicting supplied Rs. 6,975 / Rs. 9,475 expectation. |
| Tariff boundary values | Passed | Checked 0, 30, 30.5, 60, 60.5, 90, 120, 180, 180.5, and 200 kWh; tier changes and fixed charges match the configuration. |
| Appliance energy estimate | Passed | 75 W × 2 × 8 h/day returned 1.2 kWh/day and 36 kWh/30 days. |
| Calculator add, edit, remove | Passed | Added an entry, edited 75 W to 100 W (monthly estimate updated to 48 kWh), and removed it (estimate returned to zero). |
| Calculator validation | Passed | Rejected a blank name, negative wattage, zero quantity, negative daily hours, and usage above 24 hours. Tariff calculation rejects negative/non-finite consumption, missing or non-domestic tariff configuration, invalid blocks, and negative special rates. |
| Calculator catalogue prefill | Passed | Appliance guide action opened the calculator with the rice cooker name and 700 W example prefilled. |
| LocalStorage restore and clear | Passed | Saved entry returned after reload; Clear all followed by reload restored no entries. |
| Appliance guide interactions | Passed | Loaded 14 examples including an illustrative use scenario; Lighting filter returned one item; descending power sort placed electric kettle first; search found rice cooker. |
| Energy tips interactions | Passed | Loaded 14 tips; Cooling filter returned three; native details expanded; a non-matching search showed the empty state. |
| Mobile navigation | Passed | At 390 px the menu opened, exposed its links, and Escape closed it. |
| Theme toggle | Passed | Both themes switched correctly, the selected theme persisted after reload and across all five pages, and the control remained available on mobile. |
| Responsive overflow | Passed | All five pages were checked at 320, 360, 390, 768, 1024, and 1440 px; no document-width overflow was detected. |
| Browser runtime exceptions | Passed | No uncaught page exceptions were observed during the browser checks. |

## Not performed

- W3C HTML or CSS validator, Lighthouse, WAVE, axe, and formal assistive-technology testing were not run.
- A production GitHub Pages or Netlify deployment was not published; verify the live deployment before release.
- Automated checks do not replace manual keyboard, screen-reader, contrast, or real-device testing.
- The appliance values are illustrative, not manufacturer-verified. General household tips still need review against credible, relevant guidance before public release; see `references.md`.

## Recommended release checks

1. Validate HTML and CSS using the W3C validators.
2. Run Lighthouse and an accessibility checker on a hosted build.
3. Test keyboard navigation and a screen reader on mobile and desktop.
4. Verify the repository-subpath deployment on GitHub Pages and the root deployment on Netlify.
5. Have the group verify data sources and update `references.md` before treating appliance examples or tips as authoritative guidance.

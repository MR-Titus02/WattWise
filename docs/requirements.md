# WattWise requirements and acceptance criteria

| ID | Requirement | Acceptance criteria | Implementation |
|---|---|---|---|
| FR-01 | Shared navigation | All five pages link to each other; current page is identified; mobile menu opens, closes, and supports Escape. | Shared header and `js/navigation.js` |
| FR-02 | Appliance calculator | Add, edit, and remove entries with name, watts, quantity, and daily hours. Reject missing/invalid input, negative power, quantity below one, or hours outside 0–24. | `pages/calculator.html`, `js/calculator.js` |
| FR-03 | Energy estimate | Show daily and 30-day kWh, number of appliance units, highest-use item, and per-appliance comparison. | `js/calculator.js` |
| FR-04 | Domestic tariff estimate | Load the PUCSL standard domestic tariff configuration; apply progressive consumption blocks and the matching fixed charge; show every applied block, category, source, effective date, and an estimate disclaimer. | `data/electricity-tariffs.json`, `pages/calculator.html`, `js/calculator.js` |
| FR-05 | Browser persistence | Restore valid appliance entries after reload; allow explicit clearing; do not transmit the entries. | `js/calculator.js` |
| FR-06 | Appliance guide | Load static JSON; search names/details; filter category; sort by name or example wattage; clear filters; pass a selected example to the calculator. | `data/appliances.json`, `js/appliance-data.js`, `js/appliance-filter.js` |
| FR-07 | Energy tips | Load JSON; search and filter categories; expose each tip with native expandable details and useful empty/error states. | `data/energy-tips.json`, `js/energy-tips.js` |
| FR-08 | About page | Explain purpose, community value, technologies, limitations, and eight unnamed team slots. | `pages/about.html` |
| NFR-01 | Static hosting | No backend, account, database, framework, or build step; relative paths work under a project subpath. | Project structure |
| NFR-02 | Privacy | Calculator data remains in browser LocalStorage and can be removed with the clear action. | `js/calculator.js` |
| NFR-03 | Accessibility | Semantic landmarks, labels, keyboard controls, visible focus, accessible status/error feedback, and reduced-motion support. | HTML, CSS, JavaScript |
| NFR-04 | Responsive design | Layout adapts to phones, tablets, laptops, and desktop without horizontal overflow. | Shared and page CSS |
| NFR-05 | Content responsibility | Use only the sourced 11 May 2026 standard domestic tariff configuration; do not imply other consumer categories, a Time-of-Use tariff, exact billing, or quantified savings. Power examples are labelled approximate. | Site copy and datasets |

Use `testing-documentation.md` for checks actually performed. A test must not be marked passed unless it was run; externally hosted validators and assistive-technology checks are separate from local code checks.

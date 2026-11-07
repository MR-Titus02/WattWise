# WattWise

WattWise is a community-focused static website that helps Sri Lankan households explore electricity consumption, understand appliance use, and consider practical energy habits. It is the Semester 1 group project for **IS 1106 – Foundations of Web Technologies**.

> WattWise is an educational project, not an official electricity billing platform. Calculator results are estimates based on user inputs. Actual bills may include tariff categories, consumption slabs, fixed charges, and other applicable charges.

## Features

- **Electricity calculator:** Add, edit, and remove appliances; estimate daily and 30-day energy use; estimate an LKR bill using PUCSL's May 2026 standard domestic block tariff; compare appliance use; save or clear entries in browser LocalStorage.
- **Appliance guide:** Search, filter, and sort examples for cooling, kitchen, entertainment, household, and lighting appliances. Approximate power values are examples, not product specifications.
- **Energy-saving tips:** Search and filter expandable suggestions for everyday household routines.
- **Project information:** Learn about WattWise, its community purpose, technologies, and limitations; the eight team slots intentionally contain no invented names.
- **Switchable appearance:** Use the header control to switch between light and dark themes. Your preference is saved in browser LocalStorage and follows you across pages.
- **Design showcase:** View a PDF preview of all five pages in both themes at [`docs/WattWise-design-showcase.pdf`](docs/WattWise-design-showcase.pdf).
- **Responsive and accessible interface:** Semantic page structure, keyboard-operable controls, visible focus, skip links, labels, feedback, and reduced-motion support.

## Technology

This project uses HTML5, CSS3, vanilla JavaScript, static JSON, and browser LocalStorage. It has no package manager, build step, backend, database, authentication, or external runtime dependency. The calculator does not transmit entries.

## Project structure

```text
WattWise/
├── index.html
├── pages/                 # Calculator, appliance guide, tips, and about
├── assets/                # Project asset guidance; illustrations are inline SVG/CSS
├── css/                   # Shared design system and page-specific styles
├── js/                    # Navigation, calculator, data loading, filtering, helpers
├── data/                  # Static appliance and tip JSON datasets
├── docs/                  # Proposal, requirements, design, tests, and references
├── README.md
└── LICENSE
```

## How the calculator works

For each entry, WattWise estimates:

```text
Daily kWh = (Power in W × Quantity × Hours used per day) ÷ 1,000
30-day kWh = Daily kWh × 30
```

The estimated domestic bill applies the configured progressive energy blocks and the fixed charge for the applicable consumption band. The tariff configuration is in `data/electricity-tariffs.json`, and the calculation function is `WattWiseCalculator.calculateDomesticBill` in `js/calculator.js`. It currently uses PUCSL's standard domestic tariff effective 11 May 2026, for a 30-day billing cycle. It does not implement Time-of-Use or non-domestic tariffs. Billing periods may be adjusted by the provider; actual bills may include other applicable charges or reflect revisions. The estimate is not an exact CEB or LECO bill.

The calculator saves its appliance list in the visitor's browser under the `wattwise-calculator-v1` LocalStorage key. Use **Clear all** to remove the saved list. Data is not sent to WattWise or another service.

Run the tariff calculation checks with Node.js (no packages required):

```powershell
node tests\tariff-calculation.test.js
```

## Run locally

JSON datasets are fetched by the browser, so open the site through a local HTTP server rather than a `file://` URL.

### VS Code Live Server

1. Open this folder in VS Code.
2. Install the Live Server extension if needed.
3. Open `index.html` and select **Go Live**.

### Python's static file server

From the project directory, run:

```powershell
py -m http.server 8000
```

Then open `http://localhost:8000` in a browser. Python is used only as a local static file server; the project itself has no Python backend or runtime dependency.

## Deploy

### GitHub Pages

1. Push the repository to GitHub.
2. In repository **Settings → Pages**, choose the deployment source and branch/folder (for example, `main` and `/ (root)`).
3. Open the published site and check every page and JSON-backed feature.

### Netlify

Connect the repository in Netlify and publish the repository root as a static site. No build command or publish-directory transformation is required. Alternatively, deploy the root folder using Netlify's manual deploy workflow.

All page, stylesheet, script, and data links are relative so they work from a repository subpath as well as a root deployment.

## Documentation

- [Project proposal](docs/project-proposal.md)
- [Requirements](docs/requirements.md)
- [Design guidelines](docs/design-guidelines.md)
- [Testing documentation](docs/testing-documentation.md)
- [References and data limitations](docs/references.md)

## Project limitations

- Results are estimates, not meter readings, exact bill predictions, or official billing-platform output.
- Only the PUCSL standard domestic block tariff effective 11 May 2026 is configured. The optional Time-of-Use and all other consumer categories are out of scope.
- The displayed tariff rules assume the approved 30-day tariff table; provider billing-period adjustments, meter readings, other applicable charges, or later tariff revisions can make an actual bill differ.
- Power values in the appliance catalogue are illustrative examples and require model-specific verification for accurate calculations.
- Household tips are general educational prompts. They do not promise a percentage or amount of savings.
- Browser LocalStorage is specific to the current browser and device; clearing browser storage removes saved entries.
- The site is in English. Its content structure can be translated, but Sinhala and Tamil interfaces are not implemented.
- Eight team placeholders are provided; the project group must decide whether to publish names.
- External claims and references should be reviewed and updated by the project team before public release.

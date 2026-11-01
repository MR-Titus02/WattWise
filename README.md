# WattWise

WattWise is a university group project starter for a static educational website about household electricity consumption and energy awareness. The repository gives eight collaborators a shared, dependency-free foundation; the pages are templates, not a finished product.

## Project overview

Households may find it difficult to translate appliance power ratings and usage habits into understandable energy estimates. WattWise aims to make those concepts easier to explore through an electricity calculator, appliance information, estimated consumption and cost, and energy-saving recommendations.

### Problem statement

People need accessible, understandable ways to learn how everyday electricity use can be estimated. WattWise will present educational estimates and guidance, while clearly explaining their assumptions and limitations. The team should support contextual claims with verified sources; this starter does not assert research findings.

### Project objectives

- Explain the relationship between appliance power, usage time, quantity, and energy.
- Help users explore estimated daily and monthly consumption.
- Allow users to estimate cost using a tariff they provide, without inventing a rate.
- Present appliance information and practical, sourced energy-awareness recommendations.
- Provide a responsive, accessible experience that runs as static files.
- Support collaboration through clear file ownership, review, and testing practices.

### Planned website features

- Electricity consumption calculator and estimated daily/monthly consumption.
- Cost estimate based on a tariff entered by the user, with clearly stated units.
- Searchable/filterable appliance information and example power ratings.
- Categorized energy-saving tips and recommendations.
- Responsive navigation and layouts.

All appliance ratings in `data/appliances.json` are illustrative examples. Verify model-specific or locally applicable information before presenting it as authoritative. Sample tips also require review and sourcing.

## Technology stack

- HTML5 for semantic page structure.
- CSS3 for shared design tokens, components, responsive layouts, and page-specific styles.
- Vanilla JavaScript for page behavior and calculations.
- JSON for static appliance and tip datasets.
- Optional browser `localStorage` only if the team agrees what to save and documents privacy and clearing behavior.
- No backend, database, authentication system, framework, or dependency is required.

## Project structure

```text
WattWise/
├── index.html
├── pages/
│   ├── calculator.html
│   ├── appliances.html
│   ├── energy-tips.html
│   └── about.html
├── assets/
│   ├── images/
│   │   ├── appliances/
│   │   │   └── README.md
│   │   └── README.md
│   ├── icons/
│   │   └── README.md
│   └── fonts/
│       └── README.md
├── css/
│   ├── style.css
│   ├── responsive.css
│   ├── components.css
│   └── pages/
│       ├── home.css
│       ├── calculator.css
│       ├── appliances.css
│       ├── tips.css
│       └── about.css
├── js/
│   ├── main.js
│   ├── navigation.js
│   ├── calculator.js
│   ├── appliance-data.js
│   ├── appliance-filter.js
│   ├── energy-tips.js
│   └── utils.js
├── data/
│   ├── appliances.json
│   └── energy-tips.json
├── docs/
│   ├── project-proposal.md
│   ├── requirements.md
│   ├── design-guidelines.md
│   ├── testing-documentation.md
│   └── references.md
├── .gitignore
├── README.md
└── LICENSE
```

### What every directory and file is for

#### Root and pages

- `index.html` — The home page and entry point for the site. It links the shared styles/scripts and page templates; homepage-specific content belongs here and in `css/pages/home.css`.
- `pages/` — Holds secondary HTML documents. Keeping these separate from the root makes the entry point easy to find; their links to shared resources use `../`.
- `pages/calculator.html` — Semantic template for calculator inputs, validation, and results. It loads the shared UI plus `js/calculator.js` and `css/pages/calculator.css`.
- `pages/appliances.html` — Template for the appliance directory. It will consume `data/appliances.json` through `js/appliance-data.js`, with directory interactions in `js/appliance-filter.js`.
- `pages/energy-tips.html` — Template for tips and categories. It will consume `data/energy-tips.json` through `js/energy-tips.js`.
- `pages/about.html` — Project and team introduction. Add member details only after the team agrees what to publish.

#### Assets

- `assets/` — Shared static media, separate from code and data. Pages and JSON records refer to assets through relative paths.
- `assets/images/` — Approved site photography and illustrations. `assets/images/README.md` explains naming, accessibility, licensing, and source records in `docs/references.md`.
- `assets/images/appliances/` — Appliance-specific imagery referenced by appliance records. `assets/images/appliances/README.md` explains filenames, paths, and provenance requirements.
- `assets/icons/` — Approved icon files for interface use. `assets/icons/README.md` describes accessibility and attribution expectations.
- `assets/fonts/` — Optional locally hosted fonts. `assets/fonts/README.md` explains redistribution permissions; the starter needs no downloaded font.

#### Stylesheets

- `css/` — All site stylesheets. HTML templates link the global files and one page stylesheet.
- `css/style.css` — Global reset, typography, base elements, and CSS custom properties for the starter design system. Change shared colors and sizing here.
- `css/components.css` — Reusable containers, buttons, cards/sections, navigation, focus skip link, and footer styles. Pages use these shared patterns instead of reimplementing components.
- `css/responsive.css` — Shared media queries and narrow-screen navigation/layout behavior. Coordinate edits here because changes can affect every page.
- `css/pages/` — Page-only styles, keeping one page's presentation from leaking into another.
- `css/pages/home.css` — Homepage-only introduction styling; used with `index.html`.
- `css/pages/calculator.css` — Calculator form, results, and validation presentation; used with `pages/calculator.html`.
- `css/pages/appliances.css` — Appliance list, filters, and empty-state presentation; used with `pages/appliances.html`.
- `css/pages/tips.css` — Tip cards and category controls; used with `pages/energy-tips.html`.
- `css/pages/about.css` — About/team presentation; used with `pages/about.html`.

#### JavaScript and data

- `js/` — Browser scripts with separate responsibilities. Scripts are loaded with `defer`; keep page-specific logic out of shared startup.
- `js/main.js` — Shared initialization for site-wide behavior. It should coordinate common startup, not collect every page's logic.
- `js/navigation.js` — Accessible mobile menu interaction, including its expanded state. It is included by each page.
- `js/calculator.js` — Validates calculator-domain inputs and calculates energy estimates. It should not handle global navigation or appliance filtering.
- `js/appliance-data.js` — Loads and checks the static appliance JSON. It provides data to the appliance page without owning search/filter UI.
- `js/appliance-filter.js` — Search, category filtering, and sorting functions for appliance records. It operates on data supplied by the data loader.
- `js/energy-tips.js` — Loads the static tips dataset; page rendering and filtering should stay focused on tips.
- `js/utils.js` — Small shared validation and formatting helpers used by other scripts; avoid turning it into an unrelated catch-all.
- `data/` — Static JSON served with the site. Do not add secrets or user data.
- `data/appliances.json` — Appliance records with IDs, categories, example ratings, descriptions, image paths, and usage notes. It interacts with the data loader and appliance page. The ratings are illustrative, not verified guidance.
- `data/energy-tips.json` — Tip records and their categories, recommendations, and impact caveats. Source claims before publication and record sources in `docs/references.md`.

#### Documentation and project configuration

- `docs/` — Working documents for the proposal, requirements, design, tests, and source provenance; the team should update them as decisions are approved.
- `docs/project-proposal.md` — Scope, problem, objectives, deliverables, risks, and open decisions for the course project.
- `docs/requirements.md` — Functional/non-functional requirements, constraints, acceptance criteria, and links to tests.
- `docs/design-guidelines.md` — Shared visual, responsive, and accessibility guidelines; coordinates the CSS files and design decisions.
- `docs/testing-documentation.md` — Test plan and results log. It explicitly begins with no tests run.
- `docs/references.md` — Verified research sources and asset credits, including appliance/tip provenance and license details.
- `.gitignore` — Excludes common OS/editor clutter, temporary files, and generated/dependency directories while preserving useful shared VS Code recommendations if added.
- `README.md` — This onboarding guide, including contribution workflow and file responsibilities.
- `LICENSE` — Placeholder explaining that the team has not selected a license. It grants no reuse rights; replace it with an approved license before redistribution.

## How the website works

The browser opens `index.html` or a document in `pages/`. Each HTML page links shared CSS plus its page-specific CSS and loads deferred JavaScript. Appliance and tip pages can request static JSON files using `fetch` when served from a local web server or static host. There is no server-side processing. GitHub Pages and Netlify can serve the site as static content.

Do not open a JSON-fetching page as a `file://` URL: browsers commonly block local fetch requests. Use VS Code Live Server or another local HTTP server.

## Electricity calculation

The energy formula is:

```text
Energy (kWh) = (Power (W) × Usage hours × Quantity) / 1000
Monthly energy (kWh) = Daily energy (kWh) × Number of days
```

The starter monthly default is 30 days (`DEFAULT_MONTH_DAYS` in `js/calculator.js`). For example, one 100 W appliance used for 5 hours per day gives:

```text
(100 W × 5 hours × 1) / 1000 = 0.5 kWh per day
0.5 kWh/day × 30 days = 15 kWh per 30-day estimate
```

An eventual cost estimate should multiply energy by a tariff that the user enters:

```text
Estimated cost = Energy (kWh) × User-entered tariff (currency per kWh)
```

The tariff, currency, and whether a tariff includes taxes/fees must be confirmed and clearly labeled. WattWise does not supply or invent an electricity rate. Actual bills can differ due to appliance cycles, usage patterns, tariff structures, and other factors; communicate these limitations in the interface.

## Set up locally

1. Install Git and a current version of Visual Studio Code.
2. Clone the repository using the GitHub URL provided by the project owner:

   ```bash
   git clone <repository-url>
   cd WattWise
   ```

3. Open the project folder in VS Code (`File > Open Folder`).
4. No package installation or build step is required.
5. To preview, use the Live Server steps below.

## Run using VS Code Live Server

1. In VS Code, open Extensions and install the **Live Server** extension.
2. Open `index.html` in the editor.
3. Select **Go Live** in the status bar (or right-click the file and choose **Open with Live Server**).
4. Navigate using the site menu. The local server makes relative links and JSON `fetch` work as intended.

## Git and GitHub collaboration

### Team workflow

1. Clone the repository.
2. Pull the latest `main` branch before starting work.
3. Create a feature branch for the assigned task.
4. Make changes only to assigned files where possible; coordinate shared-file edits.
5. Test changes locally and review the diff.
6. Commit with a clear, meaningful message.
7. Push the feature branch to GitHub.
8. Open a Pull Request (PR) against `main`, explain the change, and identify tests performed.
9. Request a teammate review, resolve feedback, and merge according to the team's agreed policy.

Example commands:

```bash
git switch main
git pull origin main
git switch -c feature/calculator
# edit and test
git add pages/calculator.html js/calculator.js css/pages/calculator.css
git commit -m "feat: add calculator input form"
git push -u origin feature/calculator
```

Avoid simultaneous edits to shared files such as `css/style.css`, `js/main.js`, and `js/navigation.js`. Agree on an owner or coordinate the change in advance to reduce merge conflicts.

### Branch naming conventions

Use lowercase, descriptive names with a category prefix:

- `feature/homepage`
- `feature/calculator`
- `feature/appliances`
- `feature/energy-tips`
- `feature/about`
- `feature/responsive-design`
- `feature/accessibility`
- `fix/issue-description`
- `docs/documentation-update`

### Commit message conventions

Use a short imperative description after one of these prefixes:

- `feat:` — new functionality or page content.
- `fix:` — bug fix.
- `docs:` — documentation-only change.
- `style:` — formatting or visual CSS changes without behavior changes.
- `refactor:` — code restructuring without intended behavior changes.
- `test:` — tests or test documentation.

Examples: `docs: explain appliance data fields`, `fix: handle empty calculator values`.

## Coding standards and contribution guidelines

- Use consistent indentation, descriptive names, and lowercase kebab-case filenames.
- Prefer semantic HTML, reusable CSS, and small JavaScript functions.
- Keep shared styles and helpers in their designated files; do not add unnecessary dependencies.
- Avoid inline CSS/JavaScript and duplicated logic.
- Add comments only to clarify non-obvious intent.
- Use relative paths that work from both root and nested pages, including GitHub Pages project paths.
- Label every form control, preserve visible keyboard focus, and make all interactions keyboard operable.
- Use meaningful alt text for informative images; use empty alt text for purely decorative images.
- Maintain sufficient text/control contrast, avoid color-only meaning, and respect reduced-motion preferences.
- Keep data sourced and limitations visible; never imply illustrative examples are authoritative.
- Keep PRs focused. Describe the user-visible change, list files/areas affected, and report checks actually run.

## Add a new page

1. Create a semantic HTML5 document in `pages/` with language, charset, viewport, title, description, shared navigation/footer, and a unique main heading.
2. Copy the relative-link pattern from an existing page: shared CSS and scripts begin with `../`.
3. Add a page stylesheet under `css/pages/` and link it after shared styles.
4. Add only the script(s) needed by that page with `defer`; reuse shared navigation and utilities.
5. Add the page to navigation on all relevant HTML pages and update this README's directory explanation if new files are introduced.
6. Test links, keyboard operation, narrow layouts, and page loading through Live Server.

## Add an appliance to the JSON dataset

Add a JSON object in `data/appliances.json` with a unique `id`, `name`, `category`, numeric `typicalPowerWatts`, `description`, `image`, and `usageNotes`. Keep valid JSON syntax (double-quoted keys/strings, no trailing comma). Use an empty image value until an approved image exists. State clearly that values are examples, verify the rating against a relevant product/source, and record its source and limitations in `docs/references.md`.

## Add an energy-saving tip

Add an object to `data/energy-tips.json` with a unique `id`, `title`, `category`, `description`, `recommendation`, and `impact`. Keep advice practical, appropriately qualified, and supported by a source. Avoid promising a specific reduction without evidence. Record the source, local applicability, and any limitations in `docs/references.md`.

## Accessibility and responsive design expectations

Use landmark elements, a logical heading hierarchy, descriptive link text, keyboard navigation, visible focus, labels and error messages for forms, and alternatives for meaningful images. Verify contrast rather than relying on color intuition. Check mobile, tablet, and desktop sizes, zoom/reflow, touch target size, and reduced motion. Accessibility is a team responsibility, not a final cosmetic pass.

## Testing and validation tools

No test suite or build tool is included because the starter has no dependencies. During development, use:

- VS Code Live Server to exercise the site over HTTP.
- The browser developer console and network panel for JavaScript errors, missing files, and JSON loading.
- The Nu HTML Checker (validator.w3.org/nu/) for HTML.
- A JSON parser or editor diagnostics for `data/*.json`.
- Browser keyboard/manual checks and an accessibility checker such as axe DevTools, followed by human review.
- Responsive device emulation and actual browser checks where available.

Record the environment and real outcomes in `docs/testing-documentation.md`; do not claim a check passed unless it was run.

## Deploy with GitHub Pages

1. Push the approved site files to the repository's `main` branch.
2. On GitHub, open **Settings > Pages**.
3. Under build and deployment, select **Deploy from a branch**, choose `main` and the repository root (`/`), then save.
4. Wait for the Pages deployment and use the provided URL to test every page and static JSON request.
5. Use relative paths, not hardcoded local paths or domain-root paths such as `/css/style.css`; a project Pages site is hosted below a repository subpath.

If GitHub's settings change, follow the current Pages interface and record the team's chosen deployment process. Netlify can also publish this static repository without a build command.

## Team information

Add or confirm names, roles, and course-approved public contact details. These placeholders are intentionally not populated.

| Member | Name | Role / contribution |
|---|---|---|
| 1 | TBD | TBD |
| 2 | TBD | TBD |
| 3 | TBD | TBD |
| 4 | TBD | TBD |
| 5 | TBD | TBD |
| 6 | TBD | TBD |
| 7 | TBD | TBD |
| 8 | TBD | TBD |

## Academic project disclaimer

WattWise is an educational university project and is not an electricity provider, billing tool, or substitute for professional advice. Consumption and cost figures are estimates based on entered or example values. Appliance ratings and tips must be verified and appropriately sourced before publication.

## License

The project license has not yet been selected. `LICENSE` is an explicit placeholder, not permission to reuse or redistribute the project. The team should agree on a license and replace that file with its full text and accurate copyright details before publishing or accepting external contributions.

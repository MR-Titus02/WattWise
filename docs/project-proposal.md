# WattWise project proposal

## Project context

**Course:** IS 1106 – Foundations of Web Technologies
**Project:** Semester 1 group web project
**Type:** Community-focused static website

## Problem and aim

Households use appliances with different power ratings and usage patterns. Those details can be difficult to connect to understandable energy estimates. WattWise aims to explain the relationship in simple language and provide practical tools for exploring household electricity use in Sri Lanka.

## Objectives

- Explain how power, quantity, and daily hours contribute to estimated kWh.
- Let visitors create, edit, and compare household appliance entries.
- Show 30-day energy estimates and optional costs using a rate entered by the visitor.
- Provide approximate examples for common household appliances and encourage model-specific checks.
- Organize general household energy ideas by category and make them searchable.
- Deliver a responsive, keyboard-accessible site without a backend or build process.

## Audience and community value

The intended audience includes Sri Lankan households, students, young adults managing household expenses, and people who want a plain-language introduction to appliance energy use. WattWise can support learning and informed discussion; it does not claim that using the site automatically reduces a bill.

## Scope and exclusions

Included: a home page, calculator, appliance guide, tips, and about page; static JSON; browser-only calculator storage; responsive navigation; basic SEO metadata; and static-hosting documentation.

Excluded: official billing, meter readings, current tariff calculation, bill prediction, backend services, user accounts, data transmission, language switching, and guaranteed savings. The calculator's rate is optional and visitor-supplied.

## Technology and deployment

HTML5, CSS3, vanilla JavaScript, JSON, and LocalStorage are used. The files can be served by GitHub Pages or Netlify without a build step. A local HTTP server is needed to load JSON while developing.

## Risks and ongoing review

- Appliance power ratings depend on the exact product and operating mode. Catalogue values are clearly marked illustrative and should be checked against manufacturer information before being used as factual specifications.
- The calculator estimates a standard domestic bill from the PUCSL-approved 11 May 2026 30-day tariff schedule. Other consumer categories, Time-of-Use, billing-period adjustments, meter readings, applicable charges, and later tariff revisions are outside this estimate.
- General suggestions may not apply to every appliance or household. Follow safety guidance and manufacturer instructions; no numerical savings are promised.
- Source verification and public-release review remain the responsibility of the student group. See `references.md` and `testing-documentation.md`.
- The team must agree on whether to publish member names; placeholders are used until then.

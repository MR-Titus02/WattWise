# References, data provenance, and asset credits

**Review date:** 2026-11-07

## Official Sri Lankan context consulted

| Title | Organization | URL | Information used | Access date and limitations |
|---|---|---|---|---|
| Ceylon Electricity Board official website | Ceylon Electricity Board (CEB) | https://www.ceb.lk/ | Identified the official utility site as a place for consumers to confirm their own account information. No tariff value, appliance rating, or energy-saving recommendation was taken from the page. | 2026-11-07. The fetched page showed consumer SMS-service information; no current tariff was independently verified. |
| Public Utilities Commission of Sri Lanka official website | Public Utilities Commission of Sri Lanka (PUCSL) | https://www.pucsl.gov.lk/ | Identified the official regulator website as a place to consult for current electricity consumer information. No tariff value or specific recommendation was taken from the page. | 2026-11-07. The fetched page showed contact and organization information; no tariff schedule was independently verified. |

## Appliance examples

`data/appliances.json` contains generic illustrative example wattages, ranges, and use scenarios for demonstration and calculator prefill. These are **not verified product specifications or typical-use research**, do not refer to a particular make or model, and are not represented as official or measured values. They are intentionally labelled illustrative in the catalogue. For an accurate estimate, visitors should use the rating and usage information for their own appliance.

No manufacturer specification or model-specific rating is currently cited. Before public release, the group should verify any value it wishes to present as factual against a named product's manufacturer documentation, recording the product/model, units, page or document, URL, and date checked.

## Household tips

`data/energy-tips.json` contains conditional, non-quantified household prompts. It does not assert a percentage or guaranteed amount of energy or money saved. Tips ask users to follow product instructions and applicable safety guidance. No claim is made that every suggestion is suitable for every household or appliance.

The entries have not been independently reviewed against specific official Sri Lankan household-energy guidance. Before public release, the project group should identify and verify sources for any recommendation it intends to present as factual guidance, and update this table with the title, organization, URL, exact information used, and access date. Do not use the official homepages listed above as evidence for tips they do not contain.

## Tariffs and estimates

| Title | Organization | URL | Information used | Access date and limitations |
|---|---|---|---|---|
| Decision on Electricity Tariff – May 2026, Annex 2 (Tariff Table for a 30 Day Billing Cycle) | Public Utilities Commission of Sri Lanka (PUCSL) | https://www.pucsl.gov.lk/wp-content/uploads/2026/05/Full-Final_Decision-on-Electricity-Tariffs-May-2026.pdf | Standard Domestic category rates and fixed charges through 60 kWh; progressive 60–180 kWh rates and fixed charges; special above-180 schedule (0–180 kWh at LKR 32.50/kWh, excess above 180 kWh at LKR 100/kWh, LKR 2,500 fixed charge). Effective date is stated as 11 May 2026 in the decision. | Accessed and PDF checked 2026-11-07. Annex 2 is the 30-day schedule. WattWise implements the standard domestic category only, not Domestic Time of Use or any other customer category. Actual bills may reflect billing-period adjustments, meter readings, other applicable charges, or revisions. |

Tariff values and rules are stored in `data/electricity-tariffs.json`; the calculator consumes this configuration rather than embedding prices in its interface code. The approved decision's special above-180 rule supersedes the progressive 0–180 blocks when monthly consumption exceeds 180 kWh.

The supplied 210 kWh test expectation of LKR 6,975 energy charge conflicts with Annex 2: 180 × LKR 32.50 + 30 × LKR 100 = LKR 8,850. With the LKR 2,500 fixed charge, the corrected total is LKR 11,350.

No Time-of-Use rates, commercial, industrial, religious, government, or other category rates are implemented. The estimate does not add taxes or unsupported charges and is not an exact CEB or LECO bill.

## Visual assets, fonts, and code

The homepage illustration is original inline SVG authored for this project. Interface symbols use text glyphs; no external icon library or stock imagery is loaded. Typography uses the visitor's local system fonts. No third-party image, font, or script asset is included.

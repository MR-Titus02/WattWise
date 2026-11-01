/* Loads static appliance records from data/appliances.json. */
(function (global) {
  "use strict";

  async function loadAppliances() {
    var response = await fetch("../data/appliances.json");

    if (!response.ok) {
      throw new Error("Unable to load appliance data: HTTP " + response.status);
    }

    var records = await response.json();
    if (!Array.isArray(records)) {
      throw new TypeError("Appliance data must be a JSON array.");
    }

    return records;
  }

  global.WattWiseApplianceData = Object.freeze({
    loadAppliances: loadAppliances
  });
}(window));

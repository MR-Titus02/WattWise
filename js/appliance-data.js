/* Loads and checks the static appliance catalogue. */
(function (global) {
  "use strict";

  async function loadAppliances() {
    var response = await fetch("../data/appliances.json");

    if (!response.ok) {
      throw new Error("Unable to load appliance data: HTTP " + response.status);
    }

    var records = await response.json();
    if (
      !Array.isArray(records) ||
      !records.every(function (record) {
        return (
          record &&
          typeof record.id === "string" &&
          typeof record.name === "string" &&
          typeof record.category === "string" &&
          Number.isFinite(record.typicalPowerWatts) &&
          record.typicalPowerWatts >= 0 &&
          typeof record.powerRange === "string" &&
          typeof record.description === "string" &&
          typeof record.usageExample === "string" &&
          typeof record.usageNotes === "string"
        );
      })
    ) {
      throw new TypeError("Appliance data contains an invalid record.");
    }

    return records;
  }

  global.WattWiseApplianceData = Object.freeze({
    loadAppliances: loadAppliances,
  });
})(window);

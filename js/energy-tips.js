/* Loads static energy-tip records; page rendering and filtering can be added here. */
(function (global) {
  "use strict";

  async function loadEnergyTips() {
    var response = await fetch("../data/energy-tips.json");

    if (!response.ok) {
      throw new Error("Unable to load energy tips: HTTP " + response.status);
    }

    var records = await response.json();
    if (!Array.isArray(records)) {
      throw new TypeError("Energy tips data must be a JSON array.");
    }

    return records;
  }

  global.WattWiseEnergyTips = Object.freeze({
    loadEnergyTips: loadEnergyTips
  });
}(window));

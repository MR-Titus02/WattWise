/* Calculator domain logic. The user interface and tariff input belong to the page. */
(function (global) {
  "use strict";

  var DEFAULT_MONTH_DAYS = 30;

  function calculateEnergyKwh(powerWatts, usageHours, quantity) {
    var inputs = [powerWatts, usageHours, quantity];
    var valid = inputs.every(function (value) {
      return Number.isFinite(value) && value >= 0;
    });

    if (!valid) {
      throw new TypeError("Power, usage hours, and quantity must be finite non-negative numbers.");
    }

    return (powerWatts * usageHours * quantity) / 1000;
  }

  function calculateMonthlyEnergyKwh(dailyEnergyKwh, days) {
    var monthDays = days === undefined ? DEFAULT_MONTH_DAYS : days;

    if (!Number.isFinite(dailyEnergyKwh) || dailyEnergyKwh < 0 ||
        !Number.isFinite(monthDays) || monthDays < 0) {
      throw new TypeError("Daily energy and month days must be finite non-negative numbers.");
    }

    return dailyEnergyKwh * monthDays;
  }

  global.WattWiseCalculator = Object.freeze({
    DEFAULT_MONTH_DAYS: DEFAULT_MONTH_DAYS,
    calculateEnergyKwh: calculateEnergyKwh,
    calculateMonthlyEnergyKwh: calculateMonthlyEnergyKwh
  });
}(window));

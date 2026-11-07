/* Small shared formatting and validation helpers. */
(function (global) {
  "use strict";

  function isFiniteNonNegativeNumber(value) {
    return value !== "" && Number.isFinite(Number(value)) && Number(value) >= 0;
  }

  function formatNumber(value, maximumFractionDigits) {
    if (!Number.isFinite(value)) {
      throw new TypeError("A finite number is required for formatting.");
    }

    return new Intl.NumberFormat("en-LK", {
      maximumFractionDigits: maximumFractionDigits === undefined ? 2 : maximumFractionDigits
    }).format(value);
  }

  function formatRupees(value) {
    if (!Number.isFinite(value)) {
      throw new TypeError("A finite amount is required for formatting.");
    }

    return "Rs. " + new Intl.NumberFormat("en-LK", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  }

  global.WattWiseUtils = Object.freeze({
    isFiniteNonNegativeNumber: isFiniteNonNegativeNumber,
    formatNumber: formatNumber,
    formatRupees: formatRupees
  });
}(window));

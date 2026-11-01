/* Shared helpers for validation, formatting, and safe DOM updates. */
(function (global) {
  "use strict";

  function isFiniteNonNegativeNumber(value) {
    return value !== "" && Number.isFinite(Number(value)) && Number(value) >= 0;
  }

  function formatNumber(value, maximumFractionDigits) {
    if (!Number.isFinite(value)) {
      throw new TypeError("A finite number is required for formatting.");
    }

    return new Intl.NumberFormat(undefined, {
      maximumFractionDigits: maximumFractionDigits === undefined ? 2 : maximumFractionDigits
    }).format(value);
  }

  global.WattWiseUtils = Object.freeze({
    isFiniteNonNegativeNumber: isFiniteNonNegativeNumber,
    formatNumber: formatNumber
  });
}(window));

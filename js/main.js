/* Small site-wide enhancements. */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    document.documentElement.classList.add("js-enabled");
    document.querySelectorAll("[data-current-year]").forEach(function (element) {
      element.textContent = String(new Date().getFullYear());
    });
  });
}());

/* Shared application startup. Keep page-specific behavior in its own script. */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    document.documentElement.classList.add("js-enabled");
  });
}());

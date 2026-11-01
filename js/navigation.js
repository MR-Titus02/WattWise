/* Handles the shared mobile navigation toggle without requiring a framework. */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    var toggle = document.querySelector(".menu-toggle");
    var navigation = document.querySelector("#primary-navigation");

    if (!toggle || !navigation) {
      return;
    }

    toggle.addEventListener("click", function () {
      var isExpanded = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!isExpanded));
      navigation.classList.toggle("is-open", !isExpanded);
    });
  });
}());

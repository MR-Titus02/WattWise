/* Accessible shared mobile navigation. */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    var toggle = document.querySelector(".menu-toggle");
    var navigation = document.querySelector("#primary-navigation");

    if (!toggle || !navigation) {
      return;
    }

    function setExpanded(expanded) {
      toggle.setAttribute("aria-expanded", String(expanded));
      navigation.classList.toggle("is-open", expanded);
    }

    toggle.addEventListener("click", function () {
      setExpanded(toggle.getAttribute("aria-expanded") !== "true");
    });

    navigation.addEventListener("click", function (event) {
      if (event.target.closest("a")) {
        setExpanded(false);
      }
    });

    document.addEventListener("keydown", function (event) {
      if (
        event.key === "Escape" &&
        toggle.getAttribute("aria-expanded") === "true"
      ) {
        setExpanded(false);
        toggle.focus();
      }
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 832) {
        setExpanded(false);
      }
    });
  });
})();

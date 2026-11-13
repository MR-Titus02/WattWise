/* Switch between the existing light theme and optional dark theme. */
(function () {
  "use strict";

  var STORAGE_KEY = "wattwise-theme";

  document.addEventListener("DOMContentLoaded", function () {
    var toggle = document.querySelector(".theme-toggle");
    var darkStylesheet = document.querySelector("#dark-theme-stylesheet");
    var status = document.querySelector(".theme-toggle-status");

    if (!toggle || !darkStylesheet) {
      return;
    }

    var theme = "light";
    try {
      var savedTheme = window.localStorage.getItem(STORAGE_KEY);
      if (savedTheme === "light" || savedTheme === "dark") {
        theme = savedTheme;
      }
    } catch (error) {
      theme = "light";
    }

    function applyTheme(nextTheme) {
      var isDark = nextTheme === "dark";
      darkStylesheet.disabled = !isDark;
      toggle.setAttribute("aria-pressed", String(isDark));
      toggle.setAttribute(
        "aria-label",
        "Switch to " + (isDark ? "light" : "dark") + " theme",
      );
      toggle.querySelector(".theme-toggle-label").textContent = isDark
        ? "Light theme"
        : "Dark theme";
    }

    applyTheme(theme);

    toggle.addEventListener("click", function () {
      theme = theme === "dark" ? "light" : "dark";
      applyTheme(theme);
      if (status) {
        status.textContent = "";
      }

      try {
        window.localStorage.setItem(STORAGE_KEY, theme);
      } catch (error) {
        if (status) {
          status.textContent =
            "Theme changed, but your preference could not be saved in this browser.";
        }
      }
    });
  });
})();

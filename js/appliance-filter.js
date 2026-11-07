/* Search, category filtering, sorting, and rendering for the appliance guide. */
(function (global) {
  "use strict";

  function filterAppliances(appliances, searchTerm, category) {
    var query = (searchTerm || "").trim().toLocaleLowerCase();
    var selectedCategory = (category || "").trim().toLocaleLowerCase();

    return appliances.filter(function (appliance) {
      var searchableText = [
        appliance.name,
        appliance.category,
        appliance.description,
        appliance.powerRange
      ].join(" ").toLocaleLowerCase();
      return (!query || searchableText.includes(query)) &&
        (!selectedCategory || appliance.category.toLocaleLowerCase() === selectedCategory);
    });
  }

  function sortAppliances(appliances, sort) {
    var sorted = appliances.slice();
    if (sort === "power-asc") {
      return sorted.sort(function (first, second) {
        return first.typicalPowerWatts - second.typicalPowerWatts;
      });
    }
    if (sort === "power-desc") {
      return sorted.sort(function (first, second) {
        return second.typicalPowerWatts - first.typicalPowerWatts;
      });
    }
    return sorted.sort(function (first, second) {
      return first.name.localeCompare(second.name);
    });
  }

  function initializePage() {
    var grid = document.querySelector("#appliance-grid");
    if (!grid) {
      return;
    }

    var appliances = [];
    var form = document.querySelector("#appliance-filters");
    var search = document.querySelector("#appliance-search");
    var category = document.querySelector("#category-filter");
    var sort = document.querySelector("#sort-filter");
    var count = document.querySelector("#appliance-count");
    var empty = document.querySelector("#appliance-empty");
    var error = document.querySelector("#appliance-error");

    function renderCard(appliance) {
      var card = document.createElement("article");
      card.className = "appliance-card";

      var top = document.createElement("div");
      top.className = "appliance-card-top";
      var icon = document.createElement("span");
      icon.className = "appliance-icon";
      icon.setAttribute("aria-hidden", "true");
      icon.textContent = appliance.icon || "⌂";
      var categoryLabel = document.createElement("span");
      categoryLabel.className = "category-pill";
      categoryLabel.textContent = appliance.category;
      top.append(icon, categoryLabel);

      var title = document.createElement("h3");
      title.textContent = appliance.name;
      var description = document.createElement("p");
      description.textContent = appliance.description;
      var power = document.createElement("div");
      power.className = "power-example";
      var approximate = document.createElement("span");
      approximate.textContent = "Approximate example";
      var range = document.createElement("strong");
      range.textContent = appliance.powerRange;
      var watts = document.createElement("span");
      watts.textContent = "W";
      power.append(approximate, range, watts);

      var example = document.createElement("p");
      example.className = "appliance-usage-example";
      example.textContent = appliance.usageExample;
      var note = document.createElement("p");
      note.className = "appliance-usage-note";
      note.textContent = appliance.usageNotes;

      var calculate = document.createElement("a");
      calculate.className = "button button-secondary";
      calculate.href = "calculator.html?" + new URLSearchParams({
        appliance: appliance.id,
        name: appliance.name,
        watts: String(appliance.typicalPowerWatts)
      }).toString();
      calculate.textContent = "Calculate this appliance";

      card.append(top, title, description, power, example, note, calculate);
      return card;
    }

    function render() {
      var matches = sortAppliances(
        filterAppliances(appliances, search.value, category.value),
        sort.value
      );
      grid.replaceChildren();
      matches.forEach(function (appliance) {
        grid.appendChild(renderCard(appliance));
      });
      count.textContent = matches.length + (matches.length === 1 ? " appliance" : " appliances");
      empty.hidden = matches.length > 0;
    }

    search.addEventListener("input", render);
    category.addEventListener("change", render);
    sort.addEventListener("change", render);
    form.addEventListener("submit", function (event) {
      event.preventDefault();
    });
    form.addEventListener("reset", function () {
      global.setTimeout(render, 0);
    });

    global.WattWiseApplianceData.loadAppliances().then(function (records) {
      appliances = records;
      var categories = Array.from(new Set(records.map(function (record) {
        return record.category;
      }))).sort();
      categories.forEach(function (label) {
        var option = document.createElement("option");
        option.value = label;
        option.textContent = label;
        category.appendChild(option);
      });
      render();
    }).catch(function (loadError) {
      error.hidden = false;
      error.textContent = "We couldn't load the appliance examples (" + loadError.message +
        "). Please check the page is opened through a local or hosted web server, then try again.";
      count.textContent = "Examples unavailable";
    });
  }

  global.WattWiseApplianceFilter = Object.freeze({
    filterAppliances: filterAppliances,
    sortAppliances: sortAppliances
  });

  document.addEventListener("DOMContentLoaded", initializePage);
}(window));

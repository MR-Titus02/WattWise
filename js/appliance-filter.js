/* Pure filtering and sorting helpers for the appliance directory interface. */
(function (global) {
  "use strict";

  function filterAppliances(appliances, searchTerm, category) {
    var query = (searchTerm || "").trim().toLowerCase();
    var selectedCategory = (category || "").trim().toLowerCase();

    return appliances.filter(function (appliance) {
      var matchesQuery = !query ||
        appliance.name.toLowerCase().includes(query) ||
        appliance.description.toLowerCase().includes(query);
      var matchesCategory = !selectedCategory ||
        appliance.category.toLowerCase() === selectedCategory;

      return matchesQuery && matchesCategory;
    });
  }

  function sortAppliancesByName(appliances) {
    return appliances.slice().sort(function (first, second) {
      return first.name.localeCompare(second.name);
    });
  }

  global.WattWiseApplianceFilter = Object.freeze({
    filterAppliances: filterAppliances,
    sortAppliancesByName: sortAppliancesByName
  });
}(window));

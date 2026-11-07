/* Loads, filters, and renders the household energy tips. */
(function (global) {
  "use strict";

  async function loadEnergyTips() {
    var response = await fetch("../data/energy-tips.json");
    if (!response.ok) {
      throw new Error("Unable to load energy tips: HTTP " + response.status);
    }

    var records = await response.json();
    if (!Array.isArray(records) || !records.every(function (record) {
      return record && typeof record.id === "string" &&
        typeof record.title === "string" && typeof record.category === "string" &&
        typeof record.description === "string" && typeof record.recommendation === "string" &&
        typeof record.impact === "string";
    })) {
      throw new TypeError("Energy tips contain an invalid record.");
    }
    return records;
  }

  function initializePage() {
    var list = document.querySelector("#tips-list");
    if (!list) {
      return;
    }

    var tips = [];
    var form = document.querySelector("#tips-filters");
    var search = document.querySelector("#tips-search");
    var category = document.querySelector("#tips-category");
    var count = document.querySelector("#tips-count");
    var empty = document.querySelector("#tips-empty");
    var error = document.querySelector("#tips-error");

    function renderTip(tip) {
      var details = document.createElement("details");
      details.className = "tip-item";
      var summary = document.createElement("summary");
      var icon = document.createElement("span");
      icon.className = "tip-icon";
      icon.setAttribute("aria-hidden", "true");
      icon.textContent = tip.icon || "✦";
      var titleArea = document.createElement("span");
      titleArea.className = "tip-summary-text";
      var title = document.createElement("strong");
      title.textContent = tip.title;
      var categoryText = document.createElement("small");
      categoryText.textContent = tip.category;
      titleArea.append(title, categoryText);
      var categoryPill = document.createElement("span");
      categoryPill.className = "category-pill";
      categoryPill.textContent = tip.category;
      var chevron = document.createElement("span");
      chevron.className = "tip-chevron";
      chevron.setAttribute("aria-hidden", "true");
      chevron.textContent = "⌄";
      summary.append(icon, titleArea, categoryPill, chevron);

      var content = document.createElement("div");
      content.className = "tip-content";
      var descriptionBlock = document.createElement("section");
      var descriptionTitle = document.createElement("h3");
      descriptionTitle.textContent = "Why it matters";
      var description = document.createElement("p");
      description.textContent = tip.description;
      descriptionBlock.append(descriptionTitle, description);
      var recommendationBlock = document.createElement("section");
      var recommendationTitle = document.createElement("h3");
      recommendationTitle.textContent = "A practical idea";
      var recommendation = document.createElement("p");
      recommendation.textContent = tip.recommendation;
      recommendationBlock.append(recommendationTitle, recommendation);
      var note = document.createElement("section");
      var noteTitle = document.createElement("h3");
      noteTitle.textContent = "Keep in mind";
      var impact = document.createElement("p");
      impact.textContent = tip.impact;
      note.append(noteTitle, impact);
      content.append(descriptionBlock, recommendationBlock, note);
      details.append(summary, content);
      return details;
    }

    function render() {
      var query = search.value.trim().toLocaleLowerCase();
      var selectedCategory = category.value;
      var filtered = tips.filter(function (tip) {
        var searchable = [tip.title, tip.category, tip.description, tip.recommendation, tip.impact]
          .join(" ").toLocaleLowerCase();
        return (!query || searchable.includes(query)) &&
          (!selectedCategory || tip.category === selectedCategory);
      });
      list.replaceChildren();
      filtered.forEach(function (tip) {
        list.appendChild(renderTip(tip));
      });
      count.textContent = filtered.length + (filtered.length === 1 ? " tip" : " tips");
      empty.hidden = filtered.length > 0;
    }

    search.addEventListener("input", render);
    category.addEventListener("change", render);
    form.addEventListener("submit", function (event) {
      event.preventDefault();
    });
    form.addEventListener("reset", function () {
      global.setTimeout(render, 0);
    });

    loadEnergyTips().then(function (records) {
      tips = records;
      Array.from(new Set(records.map(function (tip) {
        return tip.category;
      }))).sort().forEach(function (label) {
        var option = document.createElement("option");
        option.value = label;
        option.textContent = label;
        category.appendChild(option);
      });
      render();
    }).catch(function (loadError) {
      error.hidden = false;
      error.textContent = "We couldn't load the tips (" + loadError.message +
        "). Please check the page is opened through a local or hosted web server, then try again.";
      count.textContent = "Tips unavailable";
    });
  }

  global.WattWiseEnergyTips = Object.freeze({
    loadEnergyTips: loadEnergyTips
  });
  document.addEventListener("DOMContentLoaded", initializePage);
}(window));

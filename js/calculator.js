/* Household energy formulas and calculator interface. */
(function (global) {
  "use strict";

  var DEFAULT_MONTH_DAYS = 30;
  var STORAGE_KEY = "wattwise-calculator-v1";

  function calculateEnergyKwh(powerWatts, usageHours, quantity) {
    if (
      !Number.isFinite(powerWatts) ||
      powerWatts < 0 ||
      !Number.isFinite(usageHours) ||
      usageHours < 0 ||
      usageHours > 24 ||
      !Number.isInteger(quantity) ||
      quantity < 1
    ) {
      throw new TypeError(
        "Use a non-negative power, 0 to 24 daily hours, and a whole quantity of at least one.",
      );
    }

    return (powerWatts * usageHours * quantity) / 1000;
  }

  function calculateMonthlyEnergyKwh(dailyEnergyKwh, days) {
    var monthDays = days === undefined ? DEFAULT_MONTH_DAYS : days;

    if (
      !Number.isFinite(dailyEnergyKwh) ||
      dailyEnergyKwh < 0 ||
      !Number.isFinite(monthDays) ||
      monthDays < 0
    ) {
      throw new TypeError(
        "Daily energy and month days must be finite non-negative numbers.",
      );
    }

    return dailyEnergyKwh * monthDays;
  }

  function calculateDomesticBill(totalMonthlyKwh, tariffConfig) {
    if (!Number.isFinite(totalMonthlyKwh) || totalMonthlyKwh < 0) {
      throw new TypeError(
        "Monthly consumption must be a finite non-negative number.",
      );
    }
    if (
      !tariffConfig ||
      !tariffConfig.calculationRules ||
      tariffConfig.consumerCategory !== "Domestic" ||
      tariffConfig.tariffType !== "Standard block tariff" ||
      tariffConfig.currency !== "LKR" ||
      !Number.isFinite(tariffConfig.billingCycleDays) ||
      tariffConfig.billingCycleDays <= 0 ||
      typeof tariffConfig.effectiveDate !== "string" ||
      !tariffConfig.source ||
      typeof tariffConfig.source.organization !== "string" ||
      typeof tariffConfig.source.title !== "string" ||
      typeof tariffConfig.source.url !== "string"
    ) {
      throw new TypeError("A valid domestic tariff configuration is required.");
    }

    var rules = tariffConfig.calculationRules;
    var lowConsumptionRules = rules.upTo60Kwh;
    var highConsumptionRules = rules.above60Kwh;
    var validSchedule = function (schedule) {
      return (
        schedule &&
        Array.isArray(schedule.energyBlocks) &&
        schedule.energyBlocks.length > 0 &&
        schedule.energyBlocks.every(function (block) {
          return (
            block &&
            typeof block.label === "string" &&
            Number.isFinite(block.fromKwh) &&
            Number.isFinite(block.toKwh) &&
            block.toKwh > block.fromKwh &&
            Number.isFinite(block.rateLkrPerKwh) &&
            block.rateLkrPerKwh >= 0
          );
        }) &&
        Array.isArray(schedule.fixedChargeBands) &&
        schedule.fixedChargeBands.length > 0 &&
        schedule.fixedChargeBands.every(function (band) {
          return (
            band &&
            typeof band.label === "string" &&
            Number.isFinite(band.minimumExclusiveKwh) &&
            (band.maximumInclusiveKwh === null ||
              Number.isFinite(band.maximumInclusiveKwh)) &&
            Number.isFinite(band.fixedChargeLkr) &&
            band.fixedChargeLkr >= 0
          );
        })
      );
    };
    var specialSchedule =
      highConsumptionRules && highConsumptionRules.specialAbove180Kwh;
    if (
      !lowConsumptionRules ||
      !Number.isFinite(lowConsumptionRules.maximumConsumptionKwh) ||
      lowConsumptionRules.maximumConsumptionKwh <= 0 ||
      !validSchedule(lowConsumptionRules) ||
      !validSchedule(highConsumptionRules) ||
      !specialSchedule ||
      typeof specialSchedule.baseBlockLabel !== "string" ||
      typeof specialSchedule.excessBlockLabel !== "string" ||
      !Number.isFinite(specialSchedule.thresholdKwh) ||
      specialSchedule.thresholdKwh <= 0 ||
      !Number.isFinite(specialSchedule.baseRateLkrPerKwh) ||
      specialSchedule.baseRateLkrPerKwh < 0 ||
      !Number.isFinite(specialSchedule.excessRateLkrPerKwh) ||
      specialSchedule.excessRateLkrPerKwh < 0
    ) {
      throw new TypeError(
        "The domestic tariff configuration contains invalid blocks or charges.",
      );
    }

    var isAbove60 = totalMonthlyKwh > rules.upTo60Kwh.maximumConsumptionKwh;
    var selectedRules = isAbove60 ? rules.above60Kwh : rules.upTo60Kwh;
    var fixedBand = selectedRules.fixedChargeBands.find(function (band) {
      return (
        totalMonthlyKwh > band.minimumExclusiveKwh &&
        (band.maximumInclusiveKwh === null ||
          totalMonthlyKwh <= band.maximumInclusiveKwh)
      );
    });

    if (!fixedBand) {
      throw new TypeError(
        "The tariff configuration has no fixed charge for this consumption.",
      );
    }

    var blocks;
    var reachedBlock;
    var progressStart;
    var progressEnd;
    if (
      isAbove60 &&
      totalMonthlyKwh > selectedRules.specialAbove180Kwh.thresholdKwh
    ) {
      var special = selectedRules.specialAbove180Kwh;
      var baseUnits = special.thresholdKwh;
      var excessUnits = totalMonthlyKwh - special.thresholdKwh;
      blocks = [
        {
          label: special.baseBlockLabel,
          unitsConsumed: baseUnits,
          rateLkrPerKwh: special.baseRateLkrPerKwh,
          chargeLkr: baseUnits * special.baseRateLkrPerKwh,
        },
        {
          label: special.excessBlockLabel,
          unitsConsumed: excessUnits,
          rateLkrPerKwh: special.excessRateLkrPerKwh,
          chargeLkr: excessUnits * special.excessRateLkrPerKwh,
        },
      ];
      reachedBlock = special.excessBlockLabel;
      progressStart = special.thresholdKwh;
      progressEnd = null;
    } else {
      blocks = selectedRules.energyBlocks.map(function (block) {
        var unitsConsumed = Math.min(
          Math.max(totalMonthlyKwh - block.fromKwh, 0),
          block.toKwh - block.fromKwh,
        );
        return {
          label: block.label,
          unitsConsumed: unitsConsumed,
          rateLkrPerKwh: block.rateLkrPerKwh,
          chargeLkr: unitsConsumed * block.rateLkrPerKwh,
        };
      });

      var reachedIndex = blocks.findIndex(function (block, index) {
        return totalMonthlyKwh <= selectedRules.energyBlocks[index].toKwh;
      });
      if (reachedIndex === -1) {
        reachedIndex = blocks.length - 1;
      }
      reachedBlock = selectedRules.energyBlocks[reachedIndex].label;
      progressStart = selectedRules.energyBlocks[reachedIndex].fromKwh;
      progressEnd = selectedRules.energyBlocks[reachedIndex].toKwh;
    }

    var energyCharge = blocks.reduce(function (total, block) {
      return total + block.chargeLkr;
    }, 0);
    var fixedCharge = fixedBand.fixedChargeLkr;
    var progressPercent =
      progressEnd === null
        ? 100
        : Math.max(
            0,
            Math.min(
              100,
              ((totalMonthlyKwh - progressStart) /
                (progressEnd - progressStart)) *
                100,
            ),
          );

    return {
      totalConsumptionKwh: totalMonthlyKwh,
      tariffCategory: fixedBand.label,
      energyChargeLkr: energyCharge,
      fixedChargeLkr: fixedCharge,
      totalBillLkr: energyCharge + fixedCharge,
      blocks: blocks,
      reachedBlock: reachedBlock,
      progress: {
        currentKwh: totalMonthlyKwh,
        startKwh: progressStart,
        endKwh: progressEnd,
        percent: progressPercent,
      },
      tariffVersion: {
        effectiveDate: tariffConfig.effectiveDate,
        effectiveDateLabel: tariffConfig.effectiveDateLabel,
        billingCycleDays: tariffConfig.billingCycleDays,
        sourceOrganization: tariffConfig.source.organization,
        sourceTitle: tariffConfig.source.title,
        sourceUrl: tariffConfig.source.url,
      },
    };
  }

  global.WattWiseCalculator = Object.freeze({
    DEFAULT_MONTH_DAYS: DEFAULT_MONTH_DAYS,
    calculateEnergyKwh: calculateEnergyKwh,
    calculateMonthlyEnergyKwh: calculateMonthlyEnergyKwh,
    calculateDomesticBill: calculateDomesticBill,
  });

  document.addEventListener("DOMContentLoaded", function () {
    var form = document.querySelector("#appliance-form");
    if (!form) {
      return;
    }

    var nameInput = document.querySelector("#appliance-name");
    var wattsInput = document.querySelector("#appliance-watts");
    var quantityInput = document.querySelector("#appliance-quantity");
    var hoursInput = document.querySelector("#appliance-hours");
    var catalogueSelect = document.querySelector("#appliance-select");
    var formError = document.querySelector("#form-error");
    var applianceList = document.querySelector("#appliance-list");
    var emptyState = document.querySelector("#empty-state");
    var entryCount = document.querySelector("#entry-count");
    var status = document.querySelector("#calculator-status");
    var entries = [];
    var editingId = null;
    var appliances = [];
    var tariffConfig = null;
    var tariffLoadError = document.querySelector("#tariff-load-error");

    function reportStatus(message, isError) {
      status.textContent = message;
      status.classList.toggle("status-error", Boolean(isError));
    }

    function validEntry(entry) {
      return (
        entry &&
        typeof entry.name === "string" &&
        entry.name.trim().length > 0 &&
        Number.isFinite(entry.watts) &&
        entry.watts >= 0 &&
        Number.isInteger(entry.quantity) &&
        entry.quantity >= 1 &&
        Number.isFinite(entry.hours) &&
        entry.hours >= 0 &&
        entry.hours <= 24
      );
    }

    function saveEntries() {
      try {
        global.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
        return true;
      } catch (error) {
        return false;
      }
    }

    function restoreEntries() {
      try {
        var saved = global.localStorage.getItem(STORAGE_KEY);
        if (!saved) {
          return;
        }

        var parsed = JSON.parse(saved);
        if (!Array.isArray(parsed)) {
          throw new TypeError("Saved calculator data is not a list.");
        }

        entries = parsed.filter(validEntry).map(function (entry, index) {
          return {
            id: typeof entry.id === "string" ? entry.id : "restored-" + index,
            name: entry.name.trim(),
            watts: entry.watts,
            quantity: entry.quantity,
            hours: entry.hours,
          };
        });
        if (entries.length !== parsed.length) {
          reportStatus(
            "Some saved entries were invalid and were not restored.",
            true,
          );
        }
      } catch (error) {
        entries = [];
        reportStatus(
          "Saved entries could not be read. Clear saved data or add appliances again.",
          true,
        );
      }
    }

    function setFormError(message) {
      formError.textContent = message;
      if (!message) {
        [nameInput, wattsInput, quantityInput, hoursInput].forEach(
          function (input) {
            input.removeAttribute("aria-invalid");
          },
        );
      }
    }

    function makeEntryElement(entry) {
      var article = document.createElement("article");
      article.className = "appliance-entry";

      var details = document.createElement("div");
      var titleRow = document.createElement("div");
      titleRow.className = "entry-title-row";
      var title = document.createElement("h3");
      title.textContent = entry.name;
      var quantity = document.createElement("span");
      quantity.className = "entry-quantity";
      quantity.textContent = "× " + entry.quantity;
      titleRow.append(title, quantity);

      var description = document.createElement("p");
      description.textContent =
        entry.watts + " W · " + entry.hours + " hours/day";
      details.append(titleRow, description);

      var usage = document.createElement("span");
      usage.className = "entry-usage";
      usage.textContent =
        global.WattWiseUtils.formatNumber(
          calculateEnergyKwh(entry.watts, entry.hours, entry.quantity),
          2,
        ) + " kWh/day";

      var actions = document.createElement("div");
      actions.className = "entry-actions";
      var editButton = document.createElement("button");
      editButton.type = "button";
      editButton.dataset.action = "edit";
      editButton.dataset.id = entry.id;
      editButton.setAttribute("aria-label", "Edit " + entry.name);
      editButton.textContent = "Edit";
      var removeButton = document.createElement("button");
      removeButton.type = "button";
      removeButton.dataset.action = "remove";
      removeButton.dataset.id = entry.id;
      removeButton.setAttribute("aria-label", "Remove " + entry.name);
      removeButton.textContent = "Remove";
      actions.append(editButton, removeButton);

      article.append(details, usage, actions);
      return article;
    }

    function renderEntries() {
      applianceList.replaceChildren();
      entries.forEach(function (entry) {
        applianceList.appendChild(makeEntryElement(entry));
      });
      emptyState.hidden = entries.length > 0;
      applianceList.hidden = entries.length === 0;
      entryCount.textContent =
        entries.length +
        (entries.length === 1 ? " item added" : " items added");
      renderResults();
    }

    function renderChart(monthlyEntries) {
      var chart = document.querySelector("#consumption-chart");
      chart.replaceChildren();
      var largest = monthlyEntries.reduce(function (maximum, item) {
        return Math.max(maximum, item.monthly);
      }, 0);

      monthlyEntries.forEach(function (item) {
        var row = document.createElement("div");
        row.className = "chart-row";
        var label = document.createElement("span");
        label.className = "chart-name";
        label.textContent = item.name;
        var track = document.createElement("div");
        track.className = "chart-track";
        track.setAttribute("aria-hidden", "true");
        var bar = document.createElement("div");
        bar.className = "chart-fill";
        bar.style.width =
          largest > 0 ? (item.monthly / largest) * 100 + "%" : "0%";
        track.appendChild(bar);
        var value = document.createElement("span");
        value.className = "chart-value";
        value.textContent =
          global.WattWiseUtils.formatNumber(item.monthly, 2) + " kWh";
        row.append(label, track, value);
        chart.appendChild(row);
      });
    }

    function renderResults() {
      var dailyEntries = entries.map(function (entry) {
        return {
          name: entry.name,
          daily: calculateEnergyKwh(entry.watts, entry.hours, entry.quantity),
        };
      });
      var dailyTotal = dailyEntries.reduce(function (total, entry) {
        return total + entry.daily;
      }, 0);
      var monthlyEntries = dailyEntries.map(function (entry) {
        return {
          name: entry.name,
          monthly: calculateMonthlyEnergyKwh(entry.daily),
        };
      });
      var monthlyTotal = calculateMonthlyEnergyKwh(dailyTotal);
      document.querySelector("#daily-total").textContent =
        global.WattWiseUtils.formatNumber(dailyTotal, 2) + " kWh";
      document.querySelector("#monthly-total").textContent =
        global.WattWiseUtils.formatNumber(monthlyTotal, 2) + " kWh";

      var topEntry = monthlyEntries.reduce(function (highest, entry) {
        return !highest || entry.monthly > highest.monthly ? entry : highest;
      }, null);
      var highestName = document.querySelector("#highest-appliance");
      var highestUsage = document.querySelector("#highest-appliance-usage");
      if (!topEntry || topEntry.monthly === 0) {
        highestName.textContent = "—";
        highestUsage.textContent = entries.length
          ? "No estimated use at current inputs"
          : "Add appliances to compare";
      } else {
        highestName.textContent = topEntry.name;
        highestUsage.textContent =
          global.WattWiseUtils.formatNumber(topEntry.monthly, 2) +
          " kWh over 30 days";
      }

      if (tariffConfig) {
        renderBill(calculateDomesticBill(monthlyTotal, tariffConfig));
      }
      renderChart(
        monthlyEntries.slice().sort(function (first, second) {
          return second.monthly - first.monthly;
        }),
      );
    }

    function renderBill(bill) {
      document.querySelector("#bill-total").textContent =
        global.WattWiseUtils.formatRupees(bill.totalBillLkr);
      document.querySelector("#energy-charge-total").textContent =
        global.WattWiseUtils.formatRupees(bill.energyChargeLkr);
      document.querySelector("#fixed-charge-total").textContent =
        global.WattWiseUtils.formatRupees(bill.fixedChargeLkr);
      document.querySelector("#bill-breakdown-total").textContent =
        global.WattWiseUtils.formatRupees(bill.totalBillLkr);
      document.querySelector("#tariff-category").textContent =
        "Domestic · " + bill.tariffCategory;
      document.querySelector("#reached-block").textContent =
        "Reached: " + bill.reachedBlock;

      var progress = document.querySelector("#tariff-progress");
      var roundedProgress = Math.round(bill.progress.percent);
      progress.setAttribute("aria-valuenow", String(roundedProgress));
      document.querySelector("#tariff-progress-fill").style.width =
        bill.progress.percent + "%";

      var progressCaption = document.querySelector("#tariff-progress-caption");
      if (bill.progress.endKwh === null) {
        progressCaption.textContent =
          "Above the 180 kWh threshold; the special above-180 tariff applies.";
      } else {
        progressCaption.textContent =
          global.WattWiseUtils.formatNumber(
            bill.progress.currentKwh - bill.progress.startKwh,
            2,
          ) +
          " of " +
          global.WattWiseUtils.formatNumber(
            bill.progress.endKwh - bill.progress.startKwh,
            0,
          ) +
          " kWh in this tariff block.";
      }

      var notice = document.querySelector("#tariff-notice");
      notice.hidden = bill.totalConsumptionKwh <= 60;
      if (bill.totalConsumptionKwh > 180) {
        notice.textContent =
          "Consumption is above 180 kWh. Under the published special block, the first 180 kWh use Rs. 32.50/kWh and units above 180 use Rs. 100/kWh.";
        notice.className = "tariff-notice tariff-notice-high";
      } else if (bill.totalConsumptionKwh > 60) {
        notice.textContent =
          "Consumption is above 60 kWh, so the standard above-60 domestic block schedule applies.";
        notice.className = "tariff-notice";
      }

      var tableBody = document.querySelector("#tariff-breakdown");
      tableBody.replaceChildren();
      bill.blocks.forEach(function (block) {
        var row = document.createElement("tr");
        if (block.label === bill.reachedBlock) {
          row.className = "current-tariff-block";
        }
        var label = document.createElement("th");
        label.scope = "row";
        label.textContent = block.label;
        var units = document.createElement("td");
        units.textContent =
          global.WattWiseUtils.formatNumber(block.unitsConsumed, 2) + " kWh";
        var rate = document.createElement("td");
        rate.textContent =
          global.WattWiseUtils.formatRupees(block.rateLkrPerKwh) + " / kWh";
        var charge = document.createElement("td");
        charge.textContent = global.WattWiseUtils.formatRupees(block.chargeLkr);
        row.append(label, units, rate, charge);
        tableBody.appendChild(row);
      });

      var sourceOrganization = document.querySelector("#tariff-source-name");
      sourceOrganization.textContent = bill.tariffVersion.sourceOrganization;
      var effectiveDate = document.querySelector("#tariff-effective-date");
      effectiveDate.dateTime = bill.tariffVersion.effectiveDate;
      effectiveDate.textContent = bill.tariffVersion.effectiveDateLabel;
      var sourceLink = document.querySelector("#tariff-source-link");
      sourceLink.href = bill.tariffVersion.sourceUrl;
    }

    function clearForm() {
      form.reset();
      catalogueSelect.value = "";
      quantityInput.value = "1";
      editingId = null;
      document.querySelector("#submit-label").textContent =
        "Add to my household";
      document.querySelector("#cancel-edit").hidden = true;
      setFormError("");
    }

    function addCatalogueOptions(records) {
      records.forEach(function (appliance) {
        var option = document.createElement("option");
        option.value = appliance.id;
        option.textContent =
          appliance.name + " (approx. " + appliance.typicalPowerWatts + " W)";
        catalogueSelect.insertBefore(
          option,
          catalogueSelect.querySelector('option[value="custom"]'),
        );
      });
    }

    function prefillFromUrl() {
      var params = new URLSearchParams(global.location.search);
      if (!params.has("name") && !params.has("appliance")) {
        return;
      }
      var selected = appliances.find(function (appliance) {
        return appliance.id === params.get("appliance");
      });
      catalogueSelect.value = selected ? selected.id : "custom";
      nameInput.value = params.get("name") || (selected ? selected.name : "");
      wattsInput.value =
        params.get("watts") ||
        (selected ? String(selected.typicalPowerWatts) : "");
      hoursInput.focus();
      setFormError("");
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      setFormError("");
      var name = nameInput.value.trim();
      var watts = Number(wattsInput.value);
      var quantity = Number(quantityInput.value);
      var hours = Number(hoursInput.value);
      var invalidMessage = "";

      if (!name) {
        invalidMessage = "Enter an appliance name.";
        nameInput.setAttribute("aria-invalid", "true");
        nameInput.focus();
      } else if (
        wattsInput.value.trim() === "" ||
        !Number.isFinite(watts) ||
        watts < 0 ||
        watts > 100000
      ) {
        invalidMessage = "Enter a valid power rating from 0 to 100,000 watts.";
        wattsInput.setAttribute("aria-invalid", "true");
        wattsInput.focus();
      } else if (
        quantityInput.value.trim() === "" ||
        !Number.isInteger(quantity) ||
        quantity < 1 ||
        quantity > 100
      ) {
        invalidMessage = "Enter a whole number of appliances from 1 to 100.";
        quantityInput.setAttribute("aria-invalid", "true");
        quantityInput.focus();
      } else if (
        hoursInput.value.trim() === "" ||
        !Number.isFinite(hours) ||
        hours < 0 ||
        hours > 24
      ) {
        invalidMessage = "Enter daily usage from 0 to 24 hours.";
        hoursInput.setAttribute("aria-invalid", "true");
        hoursInput.focus();
      }

      if (invalidMessage) {
        setFormError(invalidMessage);
        return;
      }

      var updatedEntry = {
        id:
          editingId ||
          "appliance-" + Date.now() + "-" + Math.floor(Math.random() * 100000),
        name: name,
        watts: watts,
        quantity: quantity,
        hours: hours,
      };
      var wasEditing = Boolean(editingId);
      if (wasEditing) {
        entries = entries.map(function (entry) {
          return entry.id === editingId ? updatedEntry : entry;
        });
      } else {
        entries.push(updatedEntry);
      }

      clearForm();
      renderEntries();
      var isSaved = saveEntries();
      nameInput.focus();
      reportStatus(
        "Appliance " +
          (wasEditing ? "updated." : "added.") +
          " Your estimate is up to date." +
          (isSaved
            ? " Entries are saved in this browser."
            : " This browser could not save the entries."),
        !isSaved,
      );
    });

    applianceList.addEventListener("click", function (event) {
      var button = event.target.closest("button[data-action]");
      if (!button) {
        return;
      }
      var entry = entries.find(function (item) {
        return item.id === button.dataset.id;
      });
      if (!entry) {
        return;
      }

      if (button.dataset.action === "edit") {
        editingId = entry.id;
        nameInput.value = entry.name;
        wattsInput.value = String(entry.watts);
        quantityInput.value = String(entry.quantity);
        hoursInput.value = String(entry.hours);
        catalogueSelect.value = "custom";
        document.querySelector("#submit-label").textContent = "Save changes";
        document.querySelector("#cancel-edit").hidden = false;
        setFormError("");
        nameInput.focus();
      } else if (button.dataset.action === "remove") {
        entries = entries.filter(function (item) {
          return item.id !== entry.id;
        });
        if (editingId === entry.id) {
          clearForm();
        }
        renderEntries();
        var isSaved = saveEntries();
        reportStatus(
          entry.name +
            " removed. Your estimate is up to date." +
            (isSaved
              ? " Entries are saved in this browser."
              : " This browser could not save the entries."),
          !isSaved,
        );
      }
    });

    catalogueSelect.addEventListener("change", function () {
      var selected = appliances.find(function (appliance) {
        return appliance.id === catalogueSelect.value;
      });
      if (selected) {
        nameInput.value = selected.name;
        wattsInput.value = String(selected.typicalPowerWatts);
      } else if (catalogueSelect.value === "custom") {
        nameInput.value = "";
        wattsInput.value = "";
        nameInput.focus();
      }
    });

    document
      .querySelector("#cancel-edit")
      .addEventListener("click", function () {
        clearForm();
        reportStatus("Editing cancelled.", false);
      });

    document
      .querySelector("#clear-entries")
      .addEventListener("click", function () {
        if (
          entries.length &&
          !global.confirm("Remove all appliance entries saved in this browser?")
        ) {
          return;
        }
        entries = [];
        clearForm();
        renderEntries();
        try {
          global.localStorage.removeItem(STORAGE_KEY);
          reportStatus(
            "All appliance entries have been removed from this browser.",
            false,
          );
        } catch (error) {
          reportStatus(
            "Entries were cleared for this visit, but saved browser data could not be removed.",
            true,
          );
        }
      });

    restoreEntries();
    renderEntries();
    fetch("../data/electricity-tariffs.json")
      .then(function (response) {
        if (!response.ok) {
          throw new Error("HTTP " + response.status);
        }
        return response.json();
      })
      .then(function (config) {
        tariffConfig = config;
        tariffLoadError.hidden = true;
        renderResults();
      })
      .catch(function (error) {
        tariffLoadError.hidden = false;
        tariffLoadError.textContent =
          "The tariff configuration could not be loaded (" +
          error.message +
          "). The bill estimate is unavailable; your appliance energy calculations remain available.";
        document.querySelector("#bill-total").textContent = "Unavailable";
        document.querySelector("#tariff-category").textContent =
          "Tariff data unavailable";
        document.querySelector("#tariff-breakdown").replaceChildren();
        reportStatus(
          "Tariff configuration could not be loaded. Check the static tariff data before using this estimate.",
          true,
        );
      });
    if (global.WattWiseApplianceData) {
      global.WattWiseApplianceData.loadAppliances()
        .then(function (records) {
          appliances = records;
          addCatalogueOptions(records);
          prefillFromUrl();
        })
        .catch(function (error) {
          reportStatus(
            "The example appliance list could not load (" +
              error.message +
              "). You can still add an appliance manually.",
            true,
          );
        });
    } else {
      reportStatus(
        "The example appliance list is unavailable. You can still add an appliance manually.",
        true,
      );
    }
  });
})(window);

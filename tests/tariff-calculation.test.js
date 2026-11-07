"use strict";

var assert = require("node:assert/strict");
var fs = require("node:fs");
var vm = require("node:vm");

var tariffConfig = JSON.parse(fs.readFileSync("data/electricity-tariffs.json", "utf8"));
var browserWindow = {};
var browserDocument = {
  addEventListener: function () {}
};
var context = vm.createContext({
  window: browserWindow,
  document: browserDocument
});
var calculatorSource = fs.readFileSync("js/calculator.js", "utf8");
vm.runInContext(calculatorSource, context);

var cases = [
  { units: 0, energy: 0, fixed: 80, total: 80 },
  { units: 30, energy: 150, fixed: 80, total: 230 },
  { units: 30.5, energy: 154.5, fixed: 210, total: 364.5 },
  { units: 60, energy: 420, fixed: 210, total: 630 },
  { units: 60.5, energy: 850, fixed: 400, total: 1250 },
  { units: 90, energy: 1440, fixed: 400, total: 1840 },
  { units: 120, energy: 2280, fixed: 1000, total: 3280 },
  { units: 150, energy: 3600, fixed: 1500, total: 5100 },
  { units: 180, energy: 4920, fixed: 1500, total: 6420 },
  { units: 180.5, energy: 5900, fixed: 2500, total: 8400 },
  { units: 200, energy: 7850, fixed: 2500, total: 10350 },
  { units: 210, energy: 8850, fixed: 2500, total: 11350 }
];

cases.forEach(function (testCase) {
  var result = browserWindow.WattWiseCalculator.calculateDomesticBill(
    testCase.units,
    tariffConfig
  );
  assert.equal(result.energyChargeLkr, testCase.energy, testCase.units + " kWh energy charge");
  assert.equal(result.fixedChargeLkr, testCase.fixed, testCase.units + " kWh fixed charge");
  assert.equal(result.totalBillLkr, testCase.total, testCase.units + " kWh total bill");
  assert.equal(result.totalConsumptionKwh, testCase.units);
  assert.equal(result.blocks.reduce(function (sum, block) {
    return sum + block.chargeLkr;
  }, 0), testCase.energy);
  assert.equal(result.tariffVersion.billingCycleDays, 30);
  assert.equal(result.tariffVersion.effectiveDate, "2026-05-11");
});

assert.throws(function () {
  browserWindow.WattWiseCalculator.calculateDomesticBill(-1, tariffConfig);
}, /Monthly consumption/);
assert.throws(function () {
  browserWindow.WattWiseCalculator.calculateDomesticBill(NaN, tariffConfig);
}, /Monthly consumption/);
assert.throws(function () {
  browserWindow.WattWiseCalculator.calculateDomesticBill(50, {});
}, /valid domestic tariff configuration/);

var wrongCategory = JSON.parse(JSON.stringify(tariffConfig));
wrongCategory.consumerCategory = "Commercial";
assert.throws(function () {
  browserWindow.WattWiseCalculator.calculateDomesticBill(50, wrongCategory);
}, /valid domestic tariff configuration/);

var missingBlocks = JSON.parse(JSON.stringify(tariffConfig));
missingBlocks.calculationRules.above60Kwh.energyBlocks = null;
assert.throws(function () {
  browserWindow.WattWiseCalculator.calculateDomesticBill(70, missingBlocks);
}, /invalid blocks or charges/);

var negativeRate = JSON.parse(JSON.stringify(tariffConfig));
negativeRate.calculationRules.above60Kwh.specialAbove180Kwh.excessRateLkrPerKwh = -1;
assert.throws(function () {
  browserWindow.WattWiseCalculator.calculateDomesticBill(200, negativeRate);
}, /invalid blocks or charges/);

console.log("Passed " + cases.length + " tariff calculations and 6 validation checks.");

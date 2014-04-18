// Need to initialise these
var years = 0;
var months = 1;
var weeks = 0;
var days = 0;
var hours = 0;

var hourly_rate = 0.007;
var monthly_rate = 5;
var total_cost = 0;

var currPricingPlan;
var pricingPlans = [];

$("#no-of-hours").on("input", function(){
  hours = parseFloat($("#no-of-hours").val());
  hours = isNaN(hours) ? 0 : hours;
  updateCost();
});

$("#no-of-days").on("input", function(){
  days = parseFloat($("#no-of-days").val());
  days = isNaN(days) ? 0 : days;
  updateCost();
});

$("#no-of-weeks").on("input", function(){
  weeks = parseFloat($("#no-of-weeks").val());
  weeks = isNaN(weeks) ? 0 : weeks;
  updateCost();
});

$("#no-of-months").on("input", function(){
  months = parseFloat($("#no-of-months").val());
  months = isNaN(months) ? 0 : months;
  updateCost();
});

$("#no-of-years").on("input", function(){
  years = parseFloat($("#no-of-years").val());
  years = isNaN(years) ? 0 : years;
  updateCost();
});

function updateCost() {
  total_cost = yearlyCost() + monthlyCost() + weeklyCost() + dailyCost() + hourlyCost();
  total_cost = total_cost.toFixed(3);
  $("#total-cost").text("£" + total_cost);
}

function yearlyCost() {
  return currPricingPlan.monthly_rate * 12 * years;
}

function monthlyCost() {
  return currPricingPlan.monthly_rate * months;
}

function weeklyCost() {
  return currPricingPlan.hourly_rate * 24 * 7 * weeks;
}

function dailyCost() {
  return currPricingPlan.hourly_rate * 24 * days;
}

function hourlyCost() {
  return currPricingPlan.hourly_rate * hours;
}

// Represents a pricing plan
function PricingPlan(name, hourly_rate, monthly_rate, memory, processor, storage, transfer) {
  this.name = name;
  this.hourly_rate = hourly_rate;
  this.monthly_rate = monthly_rate;
  this.memory = memory;
  this.processor = processor;
  this.storage = storage;
  this.transfer = transfer;
}

function createPlansFromJSON(file_path) {
  $.ajaxSetup({ cache: false }); // prevent caching caching of JSON

  $.getJSON(file_path, function(plan_hash){
    var plans = plan_hash.plans;
    Object.keys(plans).forEach(function(plan_name){
      var pricingPlan = plans[plan_name];
      pricingPlans.push(new PricingPlan(plan_name, pricingPlan.rates.hourly, pricingPlan.rates.monthly, pricingPlan.specs.memory, pricingPlan.specs.processor, pricingPlan.specs.storage, pricingPlan.specs.transfer));
    });

    initialiseApp();
  });
}

function initialiseApp() {
  currPricingPlan = pricingPlans[0];
  updateCost();
}

createPlansFromJSON("prices.json");



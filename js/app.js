var years = 0;
var months = 1;
var weeks = 0;
var days = 0;
var hours = 0;

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
  total_cost = total_cost.toFixed(2);
  $("#total-cost").text("$" + total_cost);
}

function yearlyCost() {
  return currPricingPlan.monthly_rate * 12 * years;
}

function monthlyCost() {
  return currPricingPlan.monthly_rate * months;
}

// Calculating the cost this way improves accuracy if user uses more weeks
// than necessary. e.g. inputs 6 weeks instead of 2 months and 2 weeks.
// Necessary because of how DigitalOcean applies hourly or monthly rates
// see https://www.digitalocean.com/pricing/ for more info
function weeklyCost() {
  var weekly_cost = currPricingPlan.monthly_rate * Math.floor(weeks / 4);
  weekly_cost += currPricingPlan.hourly_rate * (weeks % 4) * 7 * 24
  return weekly_cost;
}

// Similar to weeklyCost(), more accurate in situations where user inputs
// days greater than necessary. e.g. 42 days instead of 1 month 2 weeks
function dailyCost() {
  var daily_cost = currPricingPlan.monthly_rate * Math.floor(days / 28);
  daily_cost += currPricingPlan.hourly_rate * (days % 28) * 24;
  return daily_cost;
}

function hourlyCost() {
  var hourly_cost = currPricingPlan.monthly_rate * Math.floor(hours / 672);
  hourly_cost += currPricingPlan.hourly_rate * (hours % 672);
  return hourly_cost;
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

    $("#last-updated").html("<a href='https://www.digitalocean.com/pricing/'>Pricing</a> correct as of " + plan_hash.last_updated);
    initialiseApp();
  });
}

function createUI() {
  $(pricingPlans).each(function(index){
    var planContainer = $("<div class='price-plan clearfix'></div>");
    planContainer.data("plan-no", index);
    
    $(planContainer).append($("<p class='plan-rate'></p>").text("$" + this.hourly_rate + "/hr"));

    $(planContainer).append($("<p class='plan-heading'>Memory</p>"));
    $(planContainer).append($("<p class='plan-entry'></p>").text(this.memory));

    $(planContainer).append($("<p class='plan-heading'>Processors</p>"));
    $(planContainer).append($("<p class='plan-entry'></p>").text(this.processor));

    $(planContainer).append($("<p class='plan-heading'>Storage</p>"));
    $(planContainer).append($("<p class='plan-entry'></p>").text(this.storage));

    $(planContainer).append($("<p class='plan-heading'>Transfer</p>"));
    $(planContainer).append($("<p class='plan-entry'></p>").text(this.transfer));

    $("#select-plan").append(planContainer);
  });

  $("#select-plan").on("click", ".price-plan", function(){
    currPricingPlan = pricingPlans[$(this).data("plan-no")];
    $(".plan-rate").removeClass("selected");
    $(this).find(".plan-rate").addClass("selected");
    updateCost();
  });

  // Make sure the UI is in sync, since the default selected plan is the first one
  $(".plan-rate").first().addClass("selected");
}

$("#change-rate-period").on("click", function(e){
  e.preventDefault();
  if ($(this).text() === "Display rates monthly?") {
    $(".plan-rate").each(function(index){
      $(this).text("$" + pricingPlans[index].monthly_rate + "/mo")
    });
    $(this).text("Display rates hourly?");  
  } else {
    $(".plan-rate").each(function(index){
      $(this).text("$" + pricingPlans[index].hourly_rate + "/hr")
    });
    $(this).text("Display rates monthly?");
  }
});

function initialiseApp() {
  createUI();
  currPricingPlan = pricingPlans[0];
  updateCost();
}

createPlansFromJSON("/prices.json");

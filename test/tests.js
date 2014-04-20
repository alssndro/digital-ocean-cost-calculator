// Assumes using 'S' rate of 0.007/hr or 5/month
test("Total Cost", function() {
  setTimes(1, 0, 0, 0, 0); // 1 hour
  equal(total_cost, 0.01);

  setTimes(0, 0, 3, 0, 0); // 3 weeks
  equal(total_cost, 3.53);

  setTimes(0, 0, 0, 1, 0); // 1 month
  equal(total_cost, 5);

  setTimes(0, 0, 0, 0, 1); // 1 year
  equal(total_cost, 60);

  setTimes(0, 0, 0, 10, 0); // 10 months
  equal(total_cost, 50);

  setTimes(10, 0, 0, 10, 0); // 10 hours, 10 months
  equal(total_cost, 50.07);

  setTimes(0, 0, 10, 10, 0); // 10 weeks, 10 months
  equal(total_cost, 62.35);

  setTimes(10, 10, 10, 10, 10); // 10 everything
  equal(total_cost, 664.10);

  setTimes(0, 30, 0, 0, 0); // 30 days
  equal(total_cost, 5.34);

  setTimes(672, 0, 0, 0, 0); // 30 days
  equal(total_cost, 5.00);
});

// Support method for easier testing
function setTimes(newHours, newDays, newWeeks, newMonths, newYears) {
  hours = newHours;
  days = newDays;
  weeks = newWeeks;
  months = newMonths;
  years = newYears;
  updateCost();

  console.log("h\td\tw\tm\ty");
  console.log(hours + "\t" + days + "\t" + weeks + "\t" + months + "\t" + years + "\n");
}

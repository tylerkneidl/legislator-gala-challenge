/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
import main from './main';
import data from './testScenarios';

const fs = require('fs');

const tests = () => {
  // Scenario 1: Generally diverse party of legislators.
  fs.writeFileSync('testOutputs/scenario1.json', main(3, data.allGuests, data.allPlannerPreferences));

  // Scenario 2: EXTREME neutrality (planner has literally zero preferences for seating.)
  fs.writeFileSync('testOutputs/scenario2.json', main(3, data.allGuests, data.prefNeutrality));

  // Scenario 3: Small Room! (one table, thankfully, with no conflicts)
  fs.writeFileSync('testOutputs/scenario3.json', main(1, data.allGuests, data.prefNeutrality));

  // Scenario 4: Where's the love? (too many avoid constraints prevent placement)
  fs.writeFileSync('testOutputs/scenario4.json', main(1, data.allGuests, data.prefAvoidOverload));

  // Scenario 5: Where is everyone? (way too many tables)
  fs.writeFileSync('testOutputs/scenario5.json', main(50, data.allGuests, data.allPlannerPreferences));

  // eslint-disable-next-line no-console
  console.log('All scenarios recorded.');
};

tests();

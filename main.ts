/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
/* eslint-disable quote-props */
import {
  createTable, processGuests, processPreference, groupLegislators, seatLegislators, processOutput,
} from './helpers';
import testData from './testScenarios';
import { Table, Legislator, Preference } from './typeDefinitions';

const fs = require('fs');

// legislators is an easy to access table of a Legislator type for each guest
// (see ./typeDefinitions.ts for fields)
export const legislators = new Map<string, Legislator>();

// legislatorsLookup is a lookup table that places the name of each Legislator as the
// element with an index === their id
export const legislatorsLookup:string[] = [];

// cantSit holds all the people who can't be sat due to avoid constraints.  If this is not empty
// the output will alert the planner that they need to be a little more lenient with constraints.
// it short circuits the rest of the process
export const cantSit: number[] = [];

// main is the, well, main function.  it utlizies helper functions to output a
// json file with a table seating plan based on the number of available tables,
// a guest list and planner preferences.
export const main = (
  numTables: number,
  guestList: string[],
  preferences: Preference[],
) => {
  const tables: Table[] = [];

  for (let i = 0; i < numTables; i += 1) {
    tables[i] = createTable(numTables, guestList.length);
  }
  // processGuests formats guests into an array of Legislators.
  processGuests(guestList);

  // processPreference iterate through the list of preference constraints and adds them
  // to the correct Legislator
  processPreference(preferences);

  // groupLegislators separates each Legislator into a group.

  const [pickyLegislators, lovelyLegislators, easyLegislators] = groupLegislators(legislators);

  // seatLegislators is the main logic function that find a table for each legislator.  If I had
  // more time I'd refactor this becuase, wow, the time complexity is awful.  Sorry.
  // Those with avoid constraints get added first as they are the most difficult to sit.
  seatLegislators(pickyLegislators, tables, 'conflict');
  // Second group is those with pair constraints. They get added to tables with a priority of
  // filling in emptiest tables first.
  seatLegislators(lovelyLegislators, tables, 'friendly');
  // Legislators with no constraints get added last because they are heroes and easy to work with.
  // They also try to fill in seats at emptiest tables first.
  seatLegislators(easyLegislators, tables, 'neutral');

  // processOutput puts the tables into the format you asked for (sort of? I was a little unclear
  // here).  It then returns a json string
  return processOutput(tables);
};

// if you want to run your own files, the second argument to fs.writeFileSync takes the main
// function with the correct parameters.  Just replace what I have here.
fs.writeFileSync('output.json', main(3, testData.allGuests, testData.allPlannerPreferences));
// eslint-disable-next-line no-console
console.log('seating plan generated: /output.json');

export default main;

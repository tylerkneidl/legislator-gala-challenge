/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
/* eslint-disable quote-props */
import testData from './testScenarios';
import { Table, Legislator, Preference } from './typeDefinitions';

const fs = require('fs');

const legislators = new Map<string, Legislator>();
const legislatorsLookup:string[] = [];
const cantSit: number[] = [];
const processGuests = (guestList: string[]) => {
  for (let i = 0; i < guestList.length; i += 1) {
    legislators.set(guestList[i], {
      id: i + 1,
      name: guestList[i],
      doesntLike: [],
      likes: [],
      table: 0,
    });
    legislatorsLookup[i + 1] = guestList[i];
  }
};

const processPreference = (preferences: Preference[]) => {
  preferences.forEach((preference) => {
    const legis1 = preference.guests[0];
    const legis2 = preference.guests[1];
    if (preference.preference === 'avoid' && legislators) {
      legislators.get(legis1)!.doesntLike.push(legislators.get(legis2)!.id);
      legislators.get(legis2)!.doesntLike.push(legislators.get(legis1)!.id);
    }
    if (preference.preference === 'pair' && legislators) {
      legislators.get(legis1)!.likes.push(legislators.get(legis2)!.id);
      legislators.get(legis2)!.likes.push(legislators.get(legis1)!.id);
    }
  });
};

const createTable = (numberOfTables: number, numberOfGuests: number): Table => {
  const table: Table = {
    chairs: Math.ceil(numberOfGuests / numberOfTables) + 1,
    legislators: [],
  };
  return table;
};

const groupLegislators = (legis:Map<string, Legislator>)
:[Legislator[], Legislator[], Legislator[]] => {
  //              avoids       pairs         left overs
  const output:[Legislator[], Legislator[], Legislator[]] = [[], [], []];
  legis.forEach((legislator) => {
    if (legislator.doesntLike.length > 0) {
      output[0].push(legislator);
    } else if (legislator.likes.length > 0) {
      output[1].push(legislator);
    } else output[2].push(legislator);
  });
  return output;
};

const seatLegislators = (legis: Legislator[], tables:Table[], mode:'conflict' | 'friendly' | 'neutral') => {
  const compareTables = (a:Table, b:Table) => {
    if (a.legislators.length < b.legislators.length) return -1;
    if (a.legislators.length > b.legislators.length) return 1;
    return 0;
  };
  switch (mode) {
    case 'conflict':
      if (legis.length === 0) break;
      legis.forEach((l) => {
        for (let i = 0; i < tables.length; i += 1) {
          const conflicts = tables[i].legislators.some((x) => l.doesntLike.includes(x));
          if (!conflicts && l.table === 0) {
            tables[i].legislators.push(l.id);
            l.table = i + 1;
            i -= 1;
          }
        }
        if (l.table === 0) cantSit.push(l.id);
      });
      break;
    case 'friendly':
      if (legis.length === 0) break;
      legis.forEach((l) => {
        for (let i = 0; i < tables.length; i += 1) {
          const sortedTables = tables;
          const friends = tables[i].legislators.some((x) => l.likes.includes(x));
          if (friends && l.table === 0 && tables[i].legislators.length <= tables[i].chairs) {
            tables[i].legislators.push(l.id);
            l.table = tables.indexOf(sortedTables[0]) + 1;
          }
        }
      });
      break;
    default:
      legis.forEach((l) => {
        for (let i = 0; i < tables.length; i += 1) {
          const sortedTables = tables;
          sortedTables.sort(compareTables);
          if (tables[i].legislators.length <= tables[i].chairs && l.table === 0) {
            tables[i].legislators.push(l.id);
            l.table = tables.indexOf(sortedTables[0]) + 1;
          }
        }
      });
  }
};

const processOutput = (tables: Table[]):{} => {
  if (cantSit.length !== 0 && !tables.some((table) => table.legislators.length === 0)) return JSON.stringify('Too many avoid constraints, maybe remove some.  They are grown-ups after all');
  const output: { [key: string]: string[]} = {};
  for (let i = 1; i <= tables.length; i += 1) {
    output[`table_${i}`] = [];
    tables[i - 1].legislators.forEach((l) => {
      output[`table_${i}`].push(legislatorsLookup[l]);
    });
  }
  return JSON.stringify(output, null, 2);
};

export const main = (
  numTables: number,
  guestList: string[],
  preferences: Preference[],
) => {
  const tables: Table[] = [];

  for (let i = 0; i < numTables; i += 1) {
    tables[i] = createTable(numTables, guestList.length);
  }
  processGuests(guestList);
  processPreference(preferences);
  const [pickyLegislators, lovelyLegislators, easyLegislators] = groupLegislators(legislators);
  seatLegislators(pickyLegislators, tables, 'conflict');
  seatLegislators(lovelyLegislators, tables, 'friendly');
  seatLegislators(easyLegislators, tables, 'neutral');
  return processOutput(tables);
};

fs.writeFileSync('output.json', main(3, testData.allGuests, testData.allPlannerPreferences));
// eslint-disable-next-line no-console
console.log('seating plan generated: /output.json');
export default main;

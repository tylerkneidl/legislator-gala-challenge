/* eslint-disable quote-props */
// const fs = require('fs');

type Table = {
    chairs: number;
    legislators: number[];
}

type Legislator = {
  id: number;
  name: string;
  doesntLike: number[];
  likes: number[];
  table: number;
};

type Preference = {
  preference: 'avoid' | 'pair';
  guests: string[];
};

const legislators = new Map<string, Legislator>();

const processGuests = (guestList: string[]) => {
  for (let i = 0; i < guestList.length; i += 1) {
    legislators.set(guestList[i], {
      id: i + 1,
      name: guestList[i],
      doesntLike: [],
      likes: [],
      table: 0,
    });
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
    chairs: Math.ceil(numberOfGuests / numberOfTables),
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
  switch (mode) {
    case 'conflict':
      legis.forEach((l) => {
        for (let i = 0; i < tables.length; i += 1) {
          const conflicts = tables[i].legislators.some((x) => l.doesntLike.includes(x));
          if (!conflicts && !l.table) {
            tables[i].legislators.push(l.id);
            l.table = i + 1;
          }
        }
      });
      break;
    case 'friendly':
      legis.forEach((l) => {
        for (let i = 0; i < tables.length; i += 1) {
          const friends = tables[i].legislators.some((x) => l.likes.includes(x));
          if (friends && !l.table && tables[i].legislators.length <= tables[i].chairs) {
            tables[i].legislators.push(l.id);
            l.table = i + 1;
            i -= 1;
          }
        }
      });
      break;
    default:
      legis.forEach((l) => {
        for (let i = 0; i < tables.length; i += 1) {
          const conflicts = tables[i].legislators.some((x) => l.doesntLike.includes(x));
          if (!conflicts && !l.table && tables[i].legislators.length <= tables[i].chairs) {
            tables[i].legislators.push(l.id);
            l.table = i + 1;
            i -= 1;
          }
        }
      });
  }
};

const main = (
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

  console.log(tables);
};

main(
  2,
  ['jon snow', 'dany targaryan', 'robert baratheon', 'ned stark', 'arya stark'],
  [
    {
      'preference': 'avoid',
      guests: ['dany targaryan', 'robert baratheon'],
    },
    {
      preference: 'pair',
      guests: ['jon snow', 'dany targaryan'],
    },
    {
      preference: 'pair',
      guests: ['robert baratheon', 'ned stark'],
    },
  ],
);

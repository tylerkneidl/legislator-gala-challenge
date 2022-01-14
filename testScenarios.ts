const allGuests = [
  'Ned Stark',
  'Robert Baratheon',
  'Jaime Lannister',
  'Catelyn Stark',
  'Cersei Lannister',
  'Daenerys Targaryen',
  'Jorah Mormont',
  'Jon Snow',
  'Sansa Stark',
  'Bran Stark',
  'Sandor Clegane',
  'Daario Naharis',
  'Jaqen Hghar',
];

const allPlannerPreferences = [
  {
    preference: 'avoid',
    guests: ['Jaime Lannister', 'Catelyn Stark'],
  },
  {
    preference: 'avoid',
    guests: ['Jorah Mormont', 'Daario Naharis'],
  },
  {
    preference: 'avoid',
    guests: ['Catelyn Stark', 'Cersei Lannister'],
  },
  {
    preference: 'pair',
    guests: ['Ned Stark', 'Robert Baratheon'],
  },
  {
    preference: 'pair',
    guests: ['Jon Snow', 'Daenerys Targaryen'],
  },
  {
    preference: 'pair',
    guests: ['Daenerys Targaryen', 'Jorah Mormont'],
  },
  {
    preference: 'avoid',
    guests: ['Robert Baratheon', 'Daenerys Targaryen'],
  },
];

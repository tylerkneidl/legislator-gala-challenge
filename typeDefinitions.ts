export type Table = {
    chairs: number;
    legislators: number[];
}

export type Legislator = {
  id: number;
  name: string;
  doesntLike: number[];
  likes: number[];
  table: number;
};

export type Preference = {
  preference: 'avoid' | 'pair';
  guests: string[];
};

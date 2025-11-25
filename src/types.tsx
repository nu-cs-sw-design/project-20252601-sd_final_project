type Driver = {
  firstName: string,
  lastName: string,
  abbreviation: string,
  number: number
};

type Race = {
  year: number,
  name: string,
  driversInQ3: number[],
};

export type {Race, Driver};

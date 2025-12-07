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

type Point = {
  x: number,
  y: number
};

type LapJSON = {
  driver: string;
  lap_time: number;
  place: number;
  distance: number[];
  speed: number[];
  throttle: number[];
  brake: boolean[];
  location: [number, number, number][];
  time: number[];
  sector_times: [number, number, number];
  n_points: number;
};

export type {Race, Driver, Point, LapJSON};

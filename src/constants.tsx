import type {Driver, Race} from "./types.tsx";

const drivers: Driver[] = [
  { firstName: "Max", lastName: "Verstappen", abbreviation: "VER", number: 1 },
  { firstName: "Oscar", lastName: "Piastri", abbreviation: "PIA", number: 81 },
  { firstName: "Lewis", lastName: "Hamilton", abbreviation: "HAM", number: 44 },
  { firstName: "Fernando", lastName: "Alonso", abbreviation: "ALO", number: 14 },
];

const driverNumberToDriver: Record<number, Driver> = {};

drivers.forEach((d) => {
  driverNumberToDriver[d.number] = d;
});

const races: Race[] = [{
year: 2025,
name: "Suzuka",
driversInQ3: [1, 16, 55, 63, 44, 81, 11, 4, 18, 14]
},{
year: 2025,
name: "Miami",
driversInQ3: [1, 11, 4, 81, 63, 44, 16, 55, 18, 23]
}];

const driverColor: Record<number, string> = {
  1: "Blue",
  81: "Orange",
  44: "Red",
  14: "Green"
};

export {drivers, driverNumberToDriver, races, driverColor};
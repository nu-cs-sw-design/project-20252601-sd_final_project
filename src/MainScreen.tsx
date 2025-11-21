import React, { useState } from "react";
import {

  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack
} from "@mui/material";

import type{
  SelectChangeEvent
} from "@mui/material";

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

function MainScreen(){
  // Mock data for now, will probably make it read from JSON instead later
  // Or even API call if I have time

  const emptyDriver: Driver = {firstName: "N/A", lastName: "N/A", abbreviation: "N/A", number: -1};

  const drivers: Driver[] = [{
    firstName: "Max",
    lastName: "Verstappen",
    abbreviation: "VER",
    number: 1,
  },{
    firstName: "Oscar",
    lastName: "Piastri",
    abbreviation: "PIA",
    number: 81,
  }];

  const races: Race[] = [{
    year: 2025,
    name: "Suzuka",
    driversInQ3: [1, 16, 55, 63, 44, 81, 11, 4, 18, 14]
  },{
    year: 2025,
    name: "Miami",
    driversInQ3: [1, 11, 4, 81, 63, 44, 16, 55, 18, 23]

  }];

  const [year, setYear] = useState<number>();
  const [raceList, setRaceList] = useState<Race[]>([]);
  const [raceName, setRaceName] = useState<string>("");
  const [driverList, setDriverList] = useState<Driver[]>([]);
  const [driver, setDriver] = useState<Driver>(emptyDriver);

  const handleYearSelected = (event: SelectChangeEvent<number>) => {
    const year = event.target.value;
    setYear(year);

    const filtered = races.filter(r => r.year === year);
    setRaceList(filtered);

    setRaceName("");
    setDriverList([]);
    setDriver(emptyDriver);
  };

  const handleRaceSelected = (event: SelectChangeEvent) => {
    const raceName = event.target.value;
    setRaceName(raceName);
    const yearNumber = Number(year);
    const race = races.find(r => r.year === yearNumber && r.name === raceName);
    if (!race) {
      setDriverList([]);
      return;
    }
    const validDriverNumbers = race.driversInQ3;
    const filteredDrivers = drivers.filter(d => validDriverNumbers.includes(d.number));
    setDriverList(filteredDrivers);
    setDriver(emptyDriver);
  };

  const handleDriverSelected = (event: SelectChangeEvent<number>) => {
    const driverNumber = event.target.value;
    const driver = drivers.find(d => d.number === driverNumber);
    if(driver === undefined){
      setDriver(emptyDriver);
    }
    else{
      setDriver(driver);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Lap Viewer</h1>
      <Stack direction="row" spacing={2} sx={{width: '100%', justifyContent: 'space-between'}}>
        <FormControl fullWidth margin="normal" sx={{minWidth: 200}}>
          <InputLabel>Year</InputLabel>
          <Select value={year} label="Year" onChange={handleYearSelected}>
            <MenuItem value={2025}>2025</MenuItem>
            <MenuItem value={2024}>2024</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal" disabled={year === undefined} sx={{minWidth: 200}}>
          <InputLabel>Race</InputLabel>
          <Select value={raceName} label="Race" onChange={handleRaceSelected}>
            {raceList.map((race) => (
              <MenuItem value={race.name}>
                {race.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal" disabled={raceName === ""} sx={{minWidth: 200}}>
          <InputLabel>Driver</InputLabel>
          <Select value={driver.number} label="Driver" onChange={handleDriverSelected}>
            {driverList.map((driver) => (
              <MenuItem value={driver.number}>
                {driver.number} {driver.firstName} {driver.lastName} 
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>
    </div>
  );
};
export default MainScreen;
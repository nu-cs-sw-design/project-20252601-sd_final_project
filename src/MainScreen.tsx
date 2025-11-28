import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Button
} from "@mui/material";

import type{
  SelectChangeEvent
} from "@mui/material";

import type {Driver, Race} from "./types.tsx";
import {drivers, driverNumberToDriver, races} from "./constants.tsx";

function MainScreen(){
  // Mock data for now, will probably make it read from JSON instead later
  // Or even API call if I have time
  const emptyDriver: Driver = {firstName: "N/A", lastName: "N/A", abbreviation: "N/A", number: 0};

  const navigate = useNavigate()
  const [year, setYear] = useState<string>("");
  const [raceList, setRaceList] = useState<Race[]>([]);
  const [raceName, setRaceName] = useState<string>("");
  const [driverList, setDriverList] = useState<Driver[]>([]);
  const [driverNumber, setDriverNumber] = useState<string>("");
  const [driver, setDriver] = useState<Driver>(emptyDriver);

  const handleYearSelected = (event: SelectChangeEvent) => {
    const year = event.target.value;
    setYear(year);

    const filtered = races.filter(r => r.year === Number(year));
    setRaceList(filtered);

    setRaceName("");
    setDriverList([]);
    setDriverNumber("");
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
    setDriverNumber("");
    setDriver(emptyDriver);
  };

  const handleDriverSelected = (event: SelectChangeEvent) => {
    const driverNumber = event.target.value;
    setDriverNumber(driverNumber);
    const driver = driverNumberToDriver[Number(driverNumber)];
    if(driver === undefined){
      setDriver(emptyDriver);
    }
    else{
      setDriver(driver);
    }
  };

  const handleSubmit = () => {
    navigate(`/results/${year}/${raceName}/${driverNumber}`);
  };

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Typography variant="h2" gutterBottom>
        Lap Comparison Tool
      </Typography>
      <Stack direction="row" spacing={2} sx={{}}>
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
          <Select value={driverNumber} label="Driver" onChange={handleDriverSelected}>
            {driverList.map((driver) => (
              <MenuItem value={driver.number}>
                {driver.number} {driver.firstName} {driver.lastName} 
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>
      <Button variant="contained" disabled={driver == emptyDriver} onClick={handleSubmit} sx={{mt: 3}}>
        Submit
      </Button>
    </Box>
  );
};
export default MainScreen;
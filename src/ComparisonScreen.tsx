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
import {drivers, races} from "./constants.tsx";

export default function ComparisonScreen(){
  // Mock data for now, will probably make it read from JSON instead later
  // Or even API call if I have time
  const navigate = useNavigate()
  const [year, setYear] = useState<string>("");
  const [raceList, setRaceList] = useState<Race[]>([]);
  const [raceName, setRaceName] = useState<string>("");
  const [driverList, setDriverList] = useState<Driver[]>([]);
  const [firstDriverNumber, setFirstDriverNumber] = useState<string>("");
  const [secondDriverNumber, setSecondDriverNumber] = useState<string>("");

  const handleYearSelected = (event: SelectChangeEvent) => {
    const year = event.target.value;
    setYear(year);

    const filtered = races.filter(r => r.year === Number(year));
    setRaceList(filtered);

    setRaceName("");
    setDriverList([]);
    setFirstDriverNumber("");
    setFirstDriverNumber("");
  };

  const handleRaceSelected = (event: SelectChangeEvent) => {
    const raceName = event.target.value;
    setRaceName(raceName);
    const yearNumber = Number(year);
    const race = races.find(r => r.year === yearNumber && r.name === raceName);
    if(!race) {
      setDriverList([]);
      return;
    }
    const validDriverNumbers = race.driversInQ3;
    const filteredDrivers = drivers.filter(d => validDriverNumbers.includes(d.number));
    setDriverList(filteredDrivers);
    setFirstDriverNumber("");
    setFirstDriverNumber("");
  };

  const handleFirstDriverSelected = (event: SelectChangeEvent) => {
    const driverNumber = event.target.value;
    setFirstDriverNumber(driverNumber);
  };

  const handleSecondDriverSelected = (event: SelectChangeEvent) => {
    const driverNumber = event.target.value;
    setSecondDriverNumber(driverNumber);
  };

  const handleSubmit = () => {
    navigate(`/results/${year}/${raceName}/${firstDriverNumber}/${secondDriverNumber}`);
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

        <FormControl fullWidth margin="normal" disabled={year === ""} sx={{minWidth: 200}}>
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
          <Select value={firstDriverNumber} label="Driver" onChange={handleFirstDriverSelected}>
            {driverList.map((driver) => (
              <MenuItem value={driver.number}>
                {driver.number} {driver.firstName} {driver.lastName} 
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal" disabled={raceName === ""} sx={{minWidth: 200}}>
          <InputLabel>Driver</InputLabel>
          <Select value={secondDriverNumber} label="Driver" onChange={handleSecondDriverSelected}>
            {driverList.map((driver) => {
              if(!(driver.number === Number(firstDriverNumber))){
                return(
                <MenuItem value={driver.number}>
                  {driver.number} {driver.firstName} {driver.lastName} 
                </MenuItem>);
              }
            })}
          </Select>
        </FormControl>

      </Stack>
      <Button variant="contained" disabled={secondDriverNumber == ""} onClick={handleSubmit} sx={{mt: 3}}>
        Submit
      </Button>
    </Box>
  );
};

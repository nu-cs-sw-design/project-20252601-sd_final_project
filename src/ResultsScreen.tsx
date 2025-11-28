import { useState, useEffect } from 'react'
import { useParams } from "react-router-dom";
import {
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack
} from "@mui/material";

import type{
  SelectChangeEvent
} from "@mui/material";

import type {Driver, Race, Point} from "./types.tsx";
import {drivers, driverNumberToDriver, races} from "./constants.tsx";
import LapDisplay from "./LapDisplay.tsx";

function ResultsScreen(){
  const { year, race, driverNumber } = useParams();
  const driver = driverNumberToDriver[Number(driverNumber)];
  const [points, setPoints] = useState([]);
  const [lapTime, setLapTime] = useState();
  console.log(`/data/${driver.abbreviation.toLowerCase()}_${race?.toLowerCase()}_${year}.json`);
  useEffect(() => {
    fetch(`/data/${driver.abbreviation.toLowerCase()}_${race?.toLowerCase()}_${year}.json`)
      .then(res => res.json())
      .then(info => info["smooth_location"])
      .then(lap => lap.map(([x, y]: [number, number]) => ({ x, y })))
      .then(data => setPoints(data));
  }, [driverNumber, year, race]);

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
      <Typography variant="h3" gutterBottom>
        Best Q3 Lap of {race} {year} for {driverNumberToDriver[Number(driverNumber)].firstName} {driverNumberToDriver[Number(driverNumber)].lastName}
      </Typography>
      <LapDisplay pts={points} color="blue"/>
    </Box>
  );
};
export default ResultsScreen;
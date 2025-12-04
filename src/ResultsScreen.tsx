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

type LapJSON = {
  smooth_location: [number, number][];
  speed: number[];
  [key: string]: any; // for any other unknown fields
};

function ResultsScreen(){
  const { year, race, driverNumber } = useParams();
  const driver = driverNumberToDriver[Number(driverNumber)];
  const [jsonData, setJsonData] = useState<LapJSON|null>(null);
  const [points, setPoints] = useState<Point[]>([]);
  const [lapTime, setLapTime] = useState<string>("");
  const [place, setPlace] = useState<string>("");

  useEffect(() => {
    fetch(`/data/${driver.abbreviation.toLowerCase()}_${race?.toLowerCase()}_${year}.json`)
      .then(res => res.json())
      .then(data => setJsonData(data))
  }, [driverNumber, year, race]);

  useEffect(() => {
    if (!jsonData) return;

    // const data = jsonData["smooth_location"]
    //   .map(([x, y]: [number, number]) => ({ x, y }));
    const data = jsonData["location"]
      .map(([x, y, _]: [number, number, number]) => ({ x, y }));
    setPoints(data);
  }, [jsonData]);

  useEffect(() => {
    if (!jsonData) return;

    setLapTime(jsonData["lap_time"]);
    setPlace(jsonData["place"]);
  }, [jsonData]);

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
      <Typography variant="h4">
        Lap Time {lapTime} | Place: {place}
      </Typography>
      <LapDisplay pts={points} color="blue"/>
    </Box>
  );
};
export default ResultsScreen;
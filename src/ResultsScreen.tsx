import { useState, useEffect } from 'react'
import { useParams } from "react-router-dom";
import {
  Typography,
  Box,
  ToggleButtonGroup,
  ToggleButton,
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
import {drivers, driverNumberToDriver, races, driverColor} from "./constants.tsx";
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
  const [colors, setColors] = useState<string[]>([]);
  const [selected, setSelected] = useState<string>("none");

  useEffect(() => {
    fetch(`/data/${driver.abbreviation.toLowerCase()}_${race?.toLowerCase()}_${year}.json`)
      .then(res => res.json())
      .then(data => setJsonData(data))
  }, [driverNumber, year, race]);

  useEffect(() => {
    if(!jsonData) return;
    const data = jsonData["location"]
      .map(([x, y, _]: [number, number, number]) => ({ x, y }));
    setPoints(data);
  }, [jsonData]);

  useEffect(() => {
    if(!jsonData) return;

    setLapTime(jsonData["lap_time"]);
    setPlace(jsonData["place"]);
    if(driverNumber){
      setColors(new Array(points.length).fill(driverColor[Number(driverNumber)]));
    }
    else{
      setColors(new Array(points.length).fill("black"));
    }
  }, [jsonData]);

  useEffect(() => {
    if(!jsonData || !selected) return;

    if(selected === "none"){
      if(driverNumber){
        setColors(new Array(points.length).fill(driverColor[Number(driverNumber)]));
      }
      else{
        setColors(new Array(points.length).fill("black"));
      }
    }
    else if(selected === "brake"){
      setColors(jsonData["brake"].map((item: boolean) =>{
        if(item === true){
          return "green";
        }
        else{
          return "red";
        }
      }));
    }
    else if(selected === "throttle"){
      setColors(jsonData["throttle"].map((item: number) => {
        let tone = item/100 * 256 * 0.9;
        return `rgb(${tone}, ${tone}, ${tone})`
      }));
    }
    else if(selected === "speed"){
      let maxSpeed = Math.max(...jsonData["speed"]);
      setColors(jsonData["speed"].map((item: number) => {
        let tone = item/maxSpeed * 256 * 0.9;
        return `rgb(${tone}, ${tone}, ${tone})`
      }));
    }
  }, [selected]);


  const handleSelected = (
    _: React.MouseEvent<HTMLElement>,
    selection: string | null)=> {
      if(selection){
        setSelected(selection);
      }
  }

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
      <Stack direction="row" spacing={10} sx={{}}>
        <LapDisplay pts={points} colors={colors}/>
        <Stack direction="column" spacing={2} sx={{}}>
          <Typography variant="h5">
            Pick Analysis Method:
          </Typography>         
          <ToggleButtonGroup
            orientation="vertical"
            value={selected}
            exclusive
            onChange={handleSelected}
          >
            <ToggleButton value="none">None</ToggleButton>
            <ToggleButton value="brake">Brake</ToggleButton>
            <ToggleButton value="throttle">Throttle</ToggleButton>
            <ToggleButton value="speed">Speed</ToggleButton>
          </ToggleButtonGroup>
        </Stack>
      </Stack>
    </Box>
  );
};
export default ResultsScreen;
import { useState, useEffect } from 'react'
import { useParams } from "react-router-dom";
import {
  Typography,
  Box,
  ToggleButtonGroup,
  ToggleButton,
  Stack
} from "@mui/material";

import type {Point} from "./types.tsx";
import type {LegendProps} from "./LegendProp.tsx";
import {driverNumberToDriver, driverColor} from "./constants.tsx";
import LapDisplay from "./LapDisplay.tsx";
import {Legend} from "./LegendProp.tsx";

type LapJSON = {
  smooth_location: [number, number][];
  speed: number[];
  [key: string]: any; // for any other unknown fields
};

export default function SingleResultsScreen(){
  const { year, race, driverNumber } = useParams();
  const driver = driverNumberToDriver[Number(driverNumber)];
  const [jsonData, setJsonData] = useState<LapJSON|null>(null);
  const [points, setPoints] = useState<Point[]>([]);
  const [lapTime, setLapTime] = useState<string>("");
  const [place, setPlace] = useState<string>("");
  const [colors, setColors] = useState<string[]>([]);
  const [selected, setSelected] = useState<string>("none");
  const [legend, setLegend] = useState<LegendProps>({type: "none"});

  useEffect(() => { // readJson
    fetch(`/data/${driver.abbreviation.toLowerCase()}_${race?.toLowerCase()}_${year}.json`)
      .then(res => res.json())
      .then(data => setJsonData(data))
  }, [driverNumber, year, race]);

  useEffect(() => { // parseLocation
    if(!jsonData) return;
    const data = jsonData["location"]
      .map(([x, y, _]: [number, number, number]) => ({ x, y }));
    setPoints(data);
  }, [jsonData]);

  useEffect(() => { // parseMetadata
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

  useEffect(() => { // makeDisplay
    if(!jsonData || !selected) return;

    if(selected === "none"){
      setLegend({
        ...legend,
        type: "none"
      });
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
      setLegend({
        ...legend,
        type: "categorical",
        categories: [{label: "Break", color: "green"}, {label: "Coast/Throttle", color: "red"}]
      });
    }
    else if (selected === "throttle") {
      const throttleValues: number[] = jsonData["throttle"];
      const minThrottle = Math.min(...throttleValues);
      const maxThrottle = Math.max(...throttleValues);

      const throttleColors = throttleValues.map((item: number) => {
        const tone = (item / 100) * 256 * 0.9; // scale to 0-230
        return `rgb(${tone}, ${tone}, ${tone})`;
      });
      setColors(throttleColors);

      const minTone = (minThrottle / 100) * 256 * 0.9;
      const maxTone = (maxThrottle / 100) * 256 * 0.9;
      const minColor = `rgb(${minTone}, ${minTone}, ${minTone})`;
      const maxColor = `rgb(${maxTone}, ${maxTone}, ${maxTone})`;

      setLegend({
        ...legend,
        type: "gradient",
        colors: [minColor, maxColor],
        minLabel: `${minThrottle}%`,
        maxLabel: `${maxThrottle}%`,
      });
    }
    else if (selected === "speed") {
      const speedValues: number[] = jsonData["speed"];
      const minSpeed = Math.min(...speedValues);
      const maxSpeed = Math.max(...speedValues);

      const speedColors = speedValues.map((item: number) => {
        const tone = (item / maxSpeed) * 256 * 0.9; // scale to 0-230
        return `rgb(${tone}, ${tone}, ${tone})`;
      });
      setColors(speedColors);

      const minTone = (minSpeed / maxSpeed) * 256 * 0.9;
      const maxTone = 256 * 0.9;
      const minColor = `rgb(${minTone}, ${minTone}, ${minTone})`;
      const maxColor = `rgb(${maxTone}, ${maxTone}, ${maxTone})`;

      setLegend({
        ...legend,
        type: "gradient",
        colors: [minColor, maxColor],
        minLabel: `${minSpeed.toFixed(1)} km/h`,
        maxLabel: `${maxSpeed.toFixed(1)} km/h`,
      });
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
          <Legend {...legend}></Legend>
        </Stack>
      </Stack>
    </Box>
  );
};

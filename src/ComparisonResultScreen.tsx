import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Typography,
  Box,
  Paper,
  Stack,
  Grid,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";

import type {Point, LapJSON} from "./types.tsx";
import type {LegendProps} from "./LegendProp.tsx";
import {driverNumberToDriver, driverColor} from "./constants.tsx";
import LapDisplay from "./LapDisplay.tsx";
import {Legend} from "./LegendProp.tsx";

function interpolateTimes(distances: number[], times: number[], deltaMeters: number): number[] {
  const finalTimes: number[] = [];
  let runningTotal = 0;
  let i = 0;

  while (runningTotal <= distances[distances.length - 1]) {
    while (i < distances.length && distances[i] < runningTotal) i++;
    if (i === 0) {
      finalTimes.push(times[0]);
    } else if (i === distances.length) {
      finalTimes.push(times[times.length - 1]);
    } else {
      const d1 = distances[i - 1];
      const d2 = distances[i];
      const t1 = times[i - 1];
      const t2 = times[i];
      const ratio = (runningTotal - d1) / (d2 - d1);
      finalTimes.push(t1 + ratio * (t2 - t1));
    }

    runningTotal += deltaMeters;
  }

  return finalTimes;
}

export default function ComparisonResultScreen(){
  const { year, race, firstDriverNumber, secondDriverNumber } = useParams();
  const delta = 30;

  const first = Number(firstDriverNumber);
  const second = Number(secondDriverNumber);
  const drivers = [driverNumberToDriver[first], driverNumberToDriver[second]];
  const possibleColors = [driverColor[first], driverColor[second]]
  const [jsonDatas, setJsonData] = useState<LapJSON[]|null>(null);
  const [points, setPoints] = useState<Point[]>([]);
  const [lapTimes, setLapTimes] = useState<number[]>([]);
  const [places, setPlaces] = useState<number[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [legend, setLegend] = useState<LegendProps>({type: "categorical"});
  const [selected, setSelected] = useState<string>("none");

  useEffect(() => { // readJson
    if (!year || !race) return;
    const fetches: Promise<LapJSON>[] = drivers.map(driver =>
      fetch(`/data/${driver.abbreviation.toLowerCase()}_${race?.toLowerCase()}_${year}.json`)
        .then(res => res.json()) as Promise<LapJSON>
    );
    Promise.all(fetches).then(results => {
      setJsonData(results);
    });
  }, [year, race]);

  useEffect(() => { // parseLocation
    if(!jsonDatas || !jsonDatas[0]) return;
    const data = jsonDatas[0].location
      .map(([x, y, _]: [number, number, number]) => ({ x, y }));
    setPoints(data);
  }, [jsonDatas]);

  useEffect(() => { // parseMetadata
    if(!jsonDatas) return;

    setLapTimes(jsonDatas.map(data => data.lap_time));
    setPlaces(jsonDatas.map(data => data.place));
    setColors(new Array(points.length).fill("black")); // init colors as black
  }, [jsonDatas]);

  useEffect(() => { // makeDisplay
    if(!jsonDatas) return;
    if(selected === "none"){
      const driverDistances = jsonDatas.map(data => data.distance);
      const driverTimes = jsonDatas.map(data => data.time);
      const interpolatedTimes: number[][] = [];
      const tempColors = [...colors];
      for(let i = 0; i < driverDistances.length; i++){
        interpolatedTimes.push(interpolateTimes(driverDistances[i], driverTimes[i], delta));
      }
      const minPoints = Math.min(...interpolatedTimes.map(times => times.length))
      for (let i = 1; i < minPoints; i++) {
        const chunkTimes = interpolatedTimes.map(times => times[i] - times[i - 1]);
        const fasterDriverIndex = chunkTimes.indexOf(Math.min(...chunkTimes));
        const currColor = possibleColors[fasterDriverIndex];
        for (let j = 0; j < driverDistances[0].length; j++) {
          if (driverDistances[0][j] >= (i - 1) * delta && driverDistances[0][j] < i * delta) {
            tempColors[j] = currColor;
          }
        }
      }
      setColors(tempColors);
    }
    else if(selected === "sector"){
      const tempColors: string[] = [];
      const sector1Color: string = jsonDatas[0].sector_times[0] < jsonDatas[1].sector_times[0] ? possibleColors[0] : possibleColors[1];
      const sector2Color: string = jsonDatas[0].sector_times[1] < jsonDatas[1].sector_times[1] ? possibleColors[0] : possibleColors[1];
      const sector3Color: string = jsonDatas[0].sector_times[2] < jsonDatas[1].sector_times[2] ? possibleColors[0] : possibleColors[1];

      for(let i = 0; i < jsonDatas[0].n_points; i++){
        if(jsonDatas[0].time[i] < jsonDatas[0].sector_times[0]){ // in sector 1
          tempColors.push(sector1Color);
        }
        else if(jsonDatas[0].time[i] < jsonDatas[0].sector_times[1]){ // in sector 2
          tempColors.push(sector2Color);
        }
        else{
          tempColors.push(sector3Color);
        }
      }
      setColors(tempColors);
    }
    setLegend({
      ...legend,
      type: "categorical",
      categories: [{label: drivers[0].lastName, color: possibleColors[0]}, {label: drivers[1].lastName, color: possibleColors[1]}]
    });
  }, [jsonDatas, selected]);
  
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
      <Grid container alignItems="center" justifyContent="center" spacing={1}>
        <Grid size={5}>
          <Typography variant="h3" textAlign="right">
            {driverNumberToDriver[first].firstName} {driverNumberToDriver[first].lastName}
          </Typography>
        </Grid>
        <Grid size ={2}>
          <Typography variant="h3" textAlign="center">VS</Typography>
        </Grid>
        <Grid size ={5}>
          <Typography variant="h3" textAlign="left">
            {driverNumberToDriver[second].firstName} {driverNumberToDriver[second].lastName}
          </Typography>
        </Grid>
        <Grid size ={5}>
          <Typography variant="h4" textAlign="right">
            Lap Time: {lapTimes[0]} | Grid Position: {places[0]}
          </Typography>
        </Grid>
        <Grid size ={2}/>
        <Grid size={5}>
          <Typography variant="h4" textAlign="left">
            Lap Time: {lapTimes[1]} | Grid Position: {places[1]}
          </Typography>
        </Grid>
      </Grid>
      <Stack direction="row" spacing={5} sx={{marginTop:5}}>
        <LapDisplay pts={points} colors={colors}/>
        <Stack direction="column" spacing={5}>
          <ToggleButtonGroup
            orientation="vertical"
            value={selected}
            exclusive
            onChange={handleSelected}
          >
            <ToggleButton value="none">Whole Lap</ToggleButton>
            <ToggleButton value="sector">By Sector</ToggleButton>
          </ToggleButtonGroup>
          <Legend {...legend}></Legend>
        </Stack>
      </Stack>
    </Box>
  );
};

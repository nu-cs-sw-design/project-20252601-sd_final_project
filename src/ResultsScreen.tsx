import { useState } from 'react'
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

function ResultsScreen(){
  const { year, race, driverNumber } = useParams();
  console.log(year, race, driverNumber);
  return (<div></div>);
};
export default ResultsScreen;
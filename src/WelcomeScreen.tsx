import { useNavigate } from 'react-router-dom'
import {
  Typography,
  Box,
  Stack,
  Button
} from "@mui/material";
export default function WelcomeScreen(){
  const navigate = useNavigate();
  const handleSubmit1 = () => {
    navigate("/single");
  };
  const handleSubmit2 = () => {
    navigate("/compare");
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
      <Stack direction="row" spacing={2}>
        <Button variant="contained" onClick={handleSubmit1} sx={{mt: 3}}>
          Analyze a Driver's Lap
        </Button>
        <Button variant="contained" onClick={handleSubmit2} sx={{mt: 3}}>
          Compare 2 Drivers' Laps
        </Button>
      </Stack>
    </Box>
  );
};

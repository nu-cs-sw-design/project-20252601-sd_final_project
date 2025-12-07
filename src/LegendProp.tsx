import {
  Typography,
  Box,
  Stack
} from "@mui/material";

export interface LegendProps{
  type: "gradient" | "categorical" | "none";

  colors?: [string, string];
  minLabel?: string;
  maxLabel?: string;

  categories?: { label: string; color: string }[];
}

export function Legend(props: LegendProps){ 
  if (props.type === "none"){ return(<div></div>); }
  if (props.type === "gradient"){
    return (
      <Stack spacing={1}>
        <Box
          sx={{
            width: "100%",
            height: 20,
            borderRadius: 1,
            background: `linear-gradient(to right, ${props.colors?.[0] ?? "black"}, ${props.colors?.[1] ?? "white"})`
          }}
        />
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="body2">{props.minLabel}</Typography>
          <Typography variant="body2">{props.maxLabel}</Typography>
        </Stack>
      </Stack>
    );
  };
  if (props.type === "categorical"){
    return (
      <Stack direction="row" justifyContent="space-between" spacing={5}>
        {props.categories?.map((item: { label: string; color: string }) => (
          <Stack key={item.label} direction="row" spacing={1} alignItems="center">
            <Box
              sx={{
                width: 20,
                height: 20,
                backgroundColor: item.color,
                borderRadius: 1,
              }}
            />
            <Typography variant="body2">{item.label}</Typography>
          </Stack>
        ))}
      </Stack>
    );
  }

  return null;
}

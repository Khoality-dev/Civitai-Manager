import React from "react";
import ModelCard from "./ModelCard";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

function App() {
  const n = 100;
  const model_version_ids = new Array(n).fill(14);
  return (
    <Grid container spacing={5} alignItems="center" justifyContent="space-evenly" padding={5}>
      {model_version_ids.map((value, id) => (
          <Grid item key={id} sm={2}>
            <ModelCard model_version_id={value} />
        </Grid>
      ))}
    </Grid>
  );
}

export default App;

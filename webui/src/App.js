import React from "react";
import ModelCard from "./ModelCard";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

function App() {
  const n = 100;
  const model_version_ids = new Array(n).fill(14);
  return (
    <Box paddingTop={5} paddingLeft={2.5} paddingRight={2.5}>
      <Grid
        container
        alignItems="center"
        justifyContent="space-evenly"
        rowGap={5}
        columnGap={3}
      >
        {model_version_ids.map((value, id) => (
          <Grid
            item
            key={id}
            style={{
              width: 300,
              height: 400,
              display: "flex",
              justifyContent: "space-evenly",
              alignItems: "center",
            }}
          >
            <ModelCard model_version_id={value} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default App;

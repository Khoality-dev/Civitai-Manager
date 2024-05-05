import React from "react";
import ModelCard from "./ModelCard";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import axios from "./axios";
import { useState, useEffect } from "react";
import ModalWindow from "./ModalWindow";
import { Button } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress"

function App() {
  const [models, setModels] = useState([]);
  const [isFetching, setIsFecthing] = useState(false);

  useEffect(() => {
    // Fetch model IDs from the backend
    axios
      .get("/models")
      .then((response) => {
        // Extract model IDs from the response data
        const list_models = response.data["models"];
        // Update the state with the model IDs
        setModels(list_models);
      })
      .catch((error) => {
        console.error("Error fetching model IDs:", error);
      });
  }, []); 

  const [selectedModel, setSelectedModel] = useState(null);

  const handleClick = (modelId) => {
    setSelectedModel(models.filter((model) => model["id"] === modelId)[0]);
  };

  const handleClose = () => {
    setSelectedModel(null);
  };

  const handleFetchAllClick = () => {
    setIsFecthing(true);
    axios.get("/fetch-all-models").then((response) => {
      console.log("Success");
      setIsFecthing(false);
    })
    .catch((error) => {
      console.error("Error fetching model IDs:", error);
    });
  };

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        style={{
          position: "fixed",
          top: 25,
          right: 25,
          zIndex: 999, // Ensure button appears above other content
          
        }}
        disabled={isFetching}
        onClick={handleFetchAllClick}
      >
       {isFetching ? <CircularProgress size={20} /> : "Fetch All"}
      </Button>
      <Box paddingTop={5} paddingLeft={2.5} paddingRight={2.5}>
        <Grid
          container
          alignItems="center"
          justifyContent="space-evenly"
          rowGap={5}
          columnGap={3}
        >
          {models.map((model, id) => (
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
              <ModelCard
                model_id={model["id"]}
                model_title={model["name"]}
                model_type={model["type"]}
                onClickHandler={handleClick}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
      {
        <ModalWindow
          open={selectedModel !== null}
          handleClose={handleClose}
          model={selectedModel}
          setModel={setSelectedModel}
        />
      }
    </>
  );
}

export default App;

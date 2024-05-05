import React from "react";
import ModelCard from "./ModelCard";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import axios from './axios';
import { useState, useEffect } from 'react';
import ModalWindow from "./ModalWindow";


function App() {
  const [models, setModels] = useState([]);

  useEffect(() => {
    // Fetch model IDs from the backend
    axios.get('/models')
      .then(response => {
        // Extract model IDs from the response data
        const list_models = response.data["models"];
        // Update the state with the model IDs
        setModels(list_models);
      })
      .catch(error => {
        console.error('Error fetching model IDs:', error);
      });
  }, []); // Empty dependency array ensures the effect runs only once, like componentDidMount

  const [selectedModel, setSelectedModel] = useState(null);

  const handleClick = (modelId) => {
    setSelectedModel(models.filter((model) => model["id"] === modelId)[0]);
  };

  const handleClose = () => {
    setSelectedModel(null);
  };

  return (
    <>
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
            <ModelCard model_id={model["id"]} model_title={model["name"]}  model_type={model["type"]} onClickHandler={handleClick}/>
          </Grid>
        ))}
      </Grid>
    </Box>
    {<ModalWindow open={(selectedModel !== null)} handleClose={handleClose} model={selectedModel} />}
    </>
  );
}

export default App;

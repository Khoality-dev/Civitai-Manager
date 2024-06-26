import React from "react";
import ModelCard from "./ModelCard";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import axios from "../../axios";
import { useState, useEffect } from "react";
import ModalWindow from "./ModalWindow";
import { Button, Stack } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import SearchBar from "./SearchBar";

function CivitaiManagerPage() {
  const [models, setModels] = useState([]);
  const [isFetching, setIsFecthing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Fetch model IDs from the backend
    const config =
      searchQuery !== ""
        ? {
            params: {
              search: searchQuery,
            },
          }
        : {};
    axios
      .get("/models", config)
      .then((response) => {
        // Extract model IDs from the response data
        const list_models = response.data["models"];
        list_models.sort((a,b) => new Date(b.updated_at) - new Date(a.updated_at));
        // Update the state with the model IDs
        setModels(list_models);
      })
      .catch((error) => {
        console.error("Error fetching model IDs:", error);
      });
  }, [searchQuery]);

  useEffect(() => {
    console.log(models);
  }, [models]);

  const [selectedModel, setSelectedModel] = useState(null);

  const handleClick = (modelId) => {
    setSelectedModel(models.filter((model) => model["id"] === modelId)[0]);
  };

  const handleClose = () => {
    setSelectedModel(null);
  };

  const handleFetchAllClick = () => {
    setIsFecthing(true);
    axios
      .get("/fetch-all-models")
      .then((response) => {
        console.log("Success");
        setIsFecthing(false);
      })
      .catch((error) => {
        console.error("Error fetching model IDs:", error);
      });
  };

  return (
    <>
      <Stack direction="row" spacing={5} margin={2}>
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery}/>
        <Button
          variant="contained"
          color="primary"
          disabled={isFetching}
          onClick={handleFetchAllClick}
          style={{width:"200px"}}

        >
          {isFetching ? <CircularProgress size={20} /> : "Fetch All"}
        </Button>
      </Stack>
      <Box paddingTop={5} paddingLeft={2.5} paddingRight={2.5}>
        <Grid
          container
          alignItems="center"
          justifyContent="space-evenly"
          rowGap={5}
          columnGap={3}
        >
          {models.map((model, index) => (
            <Grid
              item
              key={index}
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

export default CivitaiManagerPage;

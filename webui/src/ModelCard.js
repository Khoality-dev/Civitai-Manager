import React, { useState, useEffect } from "react";
import axios from "./axios";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import { CardActionArea, CardContent } from "@mui/material";
import Box from "@mui/material/Box";
import { Grow } from "@mui/material";
import Typography from "@mui/material/Typography";

function ModelCard({ model_version_id }) {
  const [imageSrc, setImageSrc] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  const cardStandardSize = [340, 280];
  const [raised, setRaised] = useState(false);
  useEffect(() => {
    axios
      .get("/api/image", {
        responseType: "arraybuffer",
        params: {
          model_version_id: model_version_id,
        },
      })
      .then((response) => {
        const base64 = btoa(
          new Uint8Array(response.data).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            ""
          )
        );
        setImageSrc("data:image/jpeg;base64," + base64);
      })
      .catch((error) => console.error("Error fetching image:", error));
  }, []);

  const handleOnMouseEnter = () => {
    setShowDetails(true);
    console.log(showDetails);
  };
  const handleOnMouseLeave = () => {
    setShowDetails(false);
    console.log(showDetails);
  };
  const expandFactor = 1.05;
  return (
    <Grow in={imageSrc !== ""}>
      <Card
        sx={{
          maxWidth: cardStandardSize[1] * (showDetails ? expandFactor : 1),
          maxHeight: cardStandardSize[0] * (showDetails ? expandFactor : 1),
        }}
      >
        <CardActionArea
          onMouseEnter={handleOnMouseEnter}
          onMouseLeave={handleOnMouseLeave}
        >
          <CardMedia
            component="img"
            height={cardStandardSize[0] * (showDetails ? expandFactor : 1)}
            width={cardStandardSize[1] * (showDetails ? expandFactor : 1)}
            image={imageSrc}
            alt="green iguana"
            objectFit="cover"
          />
          {showDetails && (
            <Grow in={showDetails}>
              <Box
                sx={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  width: "100%",
                  bgcolor: "rgba(0, 0, 0, 0.54)",
                  color: "white",
                  padding: "10px",
                }}
              >
                <Typography variant="h5">Lizard</Typography>
                <Typography variant="body2">Subtitle</Typography>
              </Box>
            </Grow>
          )}
        </CardActionArea>
      </Card>
    </Grow>
  );
}

export default ModelCard;

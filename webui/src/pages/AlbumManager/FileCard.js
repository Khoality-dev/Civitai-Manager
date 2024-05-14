import React, { useState, useEffect } from "react";
import axios from "../../axios";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import { Button, CardActionArea, CardContent, IconButton } from "@mui/material";
import Box from "@mui/material/Box";
import { Grow } from "@mui/material";
import Typography from "@mui/material/Typography";
import convertImageBufferToUrl from "../../utils/utils";

function FileCard({ thumbnailImage, name, onClickHandler }) {
  const [showDetails, setShowDetails] = useState(false);
  const cardStandardSize = [380, 320];
  const handleOnMouseEnter = () => {
    setShowDetails(true);
  };
  const handleOnMouseLeave = () => {
    setShowDetails(false);
  };
  const expandFactor = 1.05;
  return (thumbnailImage &&
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
          image={thumbnailImage}
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
              <Typography variant="h5">{name}</Typography>
            </Box>
          </Grow>
        )}
      </CardActionArea>
    </Card>
  );
}

export default FileCard;

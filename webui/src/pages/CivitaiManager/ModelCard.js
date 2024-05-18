import React, { useState, useEffect } from "react";
import axios from "../../axios";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import { Button, CardActionArea, CardContent, IconButton } from "@mui/material";
import Box from "@mui/material/Box";
import { useInView } from "react-intersection-observer";
import { Grow } from "@mui/material";
import Typography from "@mui/material/Typography";
import convertImageBufferToUrl from "../../utils/utils";

function ModelCard({ model_id, model_title, model_type, onClickHandler }) {
  const [imageSrc, setImageSrc] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  const cardStandardSize = [380, 320];

  const retrieveNewImage = () => {
    if (inView) {
      axios
        .get("/model/preview-images", {
          params: {
            id: model_id,
          },
          responseType: "arraybuffer",
        })
        .then((response) => {
          const url = convertImageBufferToUrl(response.data);
          setImageSrc(url);
        })
        .catch((error) => console.error("Error fetching image:", error));
    }
  };

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    const timeoutFunc = () => {
      retrieveNewImage();

      const randomDelay = Math.random() * 100000 + 50000;

      if (inView) {
        setTimeout(timeoutFunc, randomDelay);
      }
    };

    if (inView) {
      const initialDelay = 0;
      setTimeout(timeoutFunc, initialDelay);
    }
  }, [inView]);

  const handleOnMouseEnter = () => {
    setShowDetails(true);
  };
  const handleOnMouseLeave = () => {
    setShowDetails(false);
  };
  const expandFactor = 1.05;
  return (
    <Grow in={imageSrc && imageSrc !== ""} ref={ref}>
      <Card
        sx={{
          maxWidth: cardStandardSize[1] * (showDetails ? expandFactor : 1),
          maxHeight: cardStandardSize[0] * (showDetails ? expandFactor : 1),
        }}
      >
        <CardActionArea
          onMouseEnter={handleOnMouseEnter}
          onMouseLeave={handleOnMouseLeave}
          onMouseDown={() => {
            onClickHandler(model_id);
          }}
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
                <Typography variant="h5">{model_title}</Typography>
                <Typography variant="body2">{model_type}</Typography>
              </Box>
            </Grow>
          )}
        </CardActionArea>
      </Card>
    </Grow>
  );
}

export default ModelCard;

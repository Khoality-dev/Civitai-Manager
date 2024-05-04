import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";
import { IconButton, Stack, Button, Box } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useState } from "react";
import axios from "./axios";
import convertImageBufferToUrl from "./utils";

const ModalWindow = ({ open, handleClose, modelId, modelName }) => {
  const [currentModelVersion, setCurrentModelVersion] = useState(null);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [listPreviewImages, setListPreviewImages] = useState([]);
  const [listVersions, setListVersions] = useState([]);

  useEffect(() => {
    setCurrentImageIndex(0);
    setListPreviewImages([]);
    if (modelId !== -1) {
      axios
        .get("/model/versions", {
          params: {
            id: modelId,
          },
        })
        .then((response) => {
          console.log(response.data);
          setListVersions(response.data["versions"]);
          setCurrentModelVersion(response.data["versions"][0]);
        })
        .catch((error) => {
          console.error("Error fetching model IDs:", error);
        });
    }
  }, [open, modelId]);

  useEffect(() => {
    if (
      currentModelVersion === null ||
      (currentImageIndex < listPreviewImages.length &&
        listPreviewImages[currentImageIndex] !== "")
    ) {
      return;
    }
    axios
      .get("/model/version/preview-images", {
        params: {
          id: currentModelVersion["id"],
          index: currentImageIndex,
        },
        responseType: "arraybuffer",
      })
      .then((response) => {
        const imageBuffer = response.data;
        const url = convertImageBufferToUrl(imageBuffer);
        const newlistPreviewImages = [...listPreviewImages];
        while (currentImageIndex >= newlistPreviewImages.length)
          newlistPreviewImages.push("");
        newlistPreviewImages[currentImageIndex] = url;
        setListPreviewImages(newlistPreviewImages);
      })
      .catch((error) => {
        const uint8Array = new Uint8Array(error.response.data);
        const jsonString = new TextDecoder().decode(uint8Array);
        const data = JSON.parse(jsonString);
        if (data["error"] === "Index out of bound!") {
          setCurrentImageIndex(0);  
        } else {
          console.error("Error fetching model IDs:", error);
        }
      });
  }, [currentModelVersion, currentImageIndex, listVersions]);

  const handleOnSyncClick = () => {
    axios
      .get("/sync-model-version", {
        params: {
          model_version_id: currentModelVersion["id"],
        },
      })
      .then((response) => {
        console.log("Success!");
      })
      .catch((error) => {
        console.error("Error fetching model IDs:", error);
      });
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>{modelName}</DialogTitle>
      <IconButton
        aria-label="close"
        onClick={handleClose}
        style={{ position: "absolute", right: 10, top: 10 }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent style={{ display: "flex" }}>
        {currentImageIndex < listPreviewImages.length &&
        listPreviewImages[currentImageIndex] !== "" ? (
          <img
            src={listPreviewImages[currentImageIndex]}
            style={{ flex: "0 0 50%" }}
            alt="Preview"
          />
        ) : (
          <div
            style={{
              display: "flex",
              flex: "0 0 50%",
              backgroundColor: "black",
            }}
          />
        )}
        <Stack direction="column" marginLeft={"10px"} width={"100%"}>
          <Typography textAlign={"center"}>Hello World</Typography>
          <Typography textAlign={"center"}>Hello World</Typography>
          <Typography textAlign={"center"}>Hello World</Typography>
          <Stack direction={"column"} spacing={2}>
            <Button
              style={{
                backgroundColor: "green",
                color: "white",
              }}
              onClick={handleOnSyncClick}
            >
              Sync
            </Button>
            <Button
              style={{
                backgroundColor: "green",
                color: "white",
              }}
              onClick={() => {
                setCurrentImageIndex(currentImageIndex + 1);
              }}
            >
              Change
            </Button>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default ModalWindow;

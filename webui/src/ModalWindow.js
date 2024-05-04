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
  const [currentModelVersionId, setCurrentModelVersionId] = useState(-1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [listPreviewImages, setListPreviewImages] = useState([]);
  const [maxIndex, setMaxIndex] = useState(-1);
  const [listVersions, setListVersions] = useState([]);

  useEffect(() => {
    if (modelId !== -1) {
      axios
        .get("/model/versions", {
          params: {
            id: modelId,
          },
        })
        .then((response) => {
          setListVersions(response.data["versions"]);
        })
        .catch((error) => {
          console.error("Error fetching model IDs:", error);
        });
    }
  }, []);

  useEffect(() => {
    console.log(listVersions);
    if (listVersions.length > 0) {
      setCurrentModelVersionId(listVersions[0]["id"]);
      setCurrentImageIndex(0);
    }
  }, [listVersions]);

  useEffect(() => {
    if (currentModelVersionId < 0) {
      return;
    }
    axios
      .get("/model/version/preview-images/size", {
        params: {
          id: currentModelVersionId,
        },
      })
      .then((response) => {
        setMaxIndex(Number(response.data["size"]) - 1);
      })
      .catch((error) => {
        console.error("Error fetching model IDs:", error);
      });
  }, [currentModelVersionId]);

  useEffect(() => {
    if (currentImageIndex >= maxIndex) {
      setCurrentImageIndex(0);
    }

    if (
      currentModelVersionId < 0 ||
      (currentImageIndex < listPreviewImages.length &&
        listPreviewImages[currentImageIndex] !== "")
    ) {
      return;
    }

    axios
      .get("/model/version/preview-images", {
        params: {
          id: currentModelVersionId,
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
        console.error("Error fetching model IDs:", error);
      });
  }, [currentImageIndex, maxIndex]);

  const handleOnSyncClick = () => {
    axios
      .get("/sync-model-version", {
        params: {
          model_version_id: currentModelVersionId,
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
      <DialogContent
        style={{ display: "flex" }}
      >
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
          <Typography textAlign={'center'}>Hello World</Typography>
          <Typography textAlign={'center'}>Hello World</Typography>
          <Typography textAlign={'center'}>Hello World</Typography>
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

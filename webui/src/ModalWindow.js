import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import ConfirmationDialog from "./ConfirmationDialog";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  IconButton,
  Stack,
  Button,
  Box,
  Select,
  MenuItem,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useState, version } from "react";
import axios from "./axios";
import InputLabel from "@mui/material/InputLabel";
import convertImageBufferToUrl from "./utils";
import CodeSnippet from "./CodeSnippet";

const ModalWindow = ({ open, handleClose, model, setModel }) => {
  const [currentModelVersion, setCurrentModelVersion] = useState(null);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [listPreviewImages, setListPreviewImages] = useState([]);
  const [listVersions, setListVersions] = useState([]);

  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleDelete = () => {
    if (model !== null) {
      axios
        .get("/delete-model", {
          params: {
            id: model.id,
          },
        })
        .then((response) => {
          setModel(null);
          console.log("Done!");
        })
        .catch((error) => {
          console.error(error);
        });
    }

    setDeleteDialogOpen(false);
  };

  useEffect(() => {
    if (model !== null) {
      axios
        .get("/model/versions", {
          params: {
            id: model.id,
          },
        })
        .then((response) => {
          setListVersions(response.data["versions"]);
          setCurrentModelVersion(response.data["versions"][0]);
        })
        .catch((error) => {
          console.error("Error fetching model IDs:", error);
        });
    }
  }, [open, model]);

  useEffect(() => {
    setCurrentImageIndex(0);
    setListPreviewImages([]);
  }, [currentModelVersion]);

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
  }, [listPreviewImages, currentImageIndex, listVersions]);

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

  const handleOnVersionChange = (versionName) => {
    if (version !== "Unknown") {
      setCurrentModelVersion(
        listVersions.filter((version) => version["name"] === versionName)[0]
      );
    }
  };

  useEffect(() => {
    console.log(currentModelVersion);
  }, [currentModelVersion]);

  return (
    model !== null && (
      <>
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="lg">
          <DialogTitle>{model.name}</DialogTitle>
          <Box style={{ position: "absolute", right: 10, top: 10 }}>
            <IconButton
              aria-label="delete"
              onClick={() => {
                setDeleteDialogOpen(true);
              }}
            >
              <DeleteIcon />
            </IconButton>
            <IconButton aria-label="close" onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Box>
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
                  flex: "0 0 50%",
                  backgroundColor: "white",
                }}
              />
            )}
            <Stack direction="column" marginLeft={"10px"} width={"100%"}>
              {currentModelVersion !== null && (
                <>
                  <InputLabel id="version-label">Version</InputLabel>
                  <Select
                    labelId="version-label"
                    value={currentModelVersion.name} // Assuming "name" is the property you want to use as the value
                    onChange={(event) => {
                      handleOnVersionChange(event.target.value);
                    }}
                  >
                    {listVersions.map((version) => (
                      <MenuItem key={version.name} value={version.name}>
                        {version.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {JSON.parse(currentModelVersion.positive_prompts)[
                    "prompts"
                  ].map((positive_prompt) => (
                    <CodeSnippet
                      label={"Positive Prompt"}
                      content={positive_prompt}
                    />
                  ))}

                  <CodeSnippet
                    label={"Negative Prompt"}
                    content={"Whatever negates this!"}
                  />
                  <CodeSnippet label={"URL"} content={model.url} />
                </>
              )}
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
        <ConfirmationDialog
          open={isDeleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          onConfirm={handleDelete}
          title="Delete Confirmation"
          content="Are you sure you want to delete?"
        />
      </>
    )
  );
};

export default ModalWindow;

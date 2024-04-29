import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";
import { IconButton, Stack, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useState } from "react";
import axios from "./axios";

const ModalWindow = ({ open, handleClose, modelId }) => {
  const [currentModelVersion, setCurrentModelVersion] = useState();

  useEffect(() => {
    if (modelId !== -1)
    {
      axios
      .get("/model/versions", {
        params: {
          id: modelId,
        },
      })
      .then((response) => {
        console.log(response.data);
        const model = response.data["versions"][0];
        setCurrentModelVersion(model);
      })
      .catch((error) => {
        console.error("Error fetching model IDs:", error);
      });
    }
  }, [open]);

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
      <DialogTitle>Mini Window</DialogTitle>
      <IconButton
        aria-label="close"
        onClick={handleClose}
        style={{ position: "absolute", right: 10, top: 10 }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent
        style={{ display: "flex", alignItems: "center", minHeight: "70vh" }}
      >
        <div style={{ display: "flex", width: "100%" }}>
          <div
            style={{ flex: "0 0 50%", backgroundColor: "black", height: 200 }}
          />
          <div style={{ flex: "1", marginLeft: 20 }}>
            <Stack direction="column" alignItems={"center"}>
              <Typography>Hello World</Typography>
              <Typography>Hello World</Typography>
              <Typography>Hello World</Typography>
              <Button
                style={{
                  backgroundColor: "green",
                  color: "white",
                  marginTop: "120%",
                  width: "100%",
                }}
                onClick={handleOnSyncClick}
              >
                Sync
              </Button>
            </Stack>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ModalWindow;

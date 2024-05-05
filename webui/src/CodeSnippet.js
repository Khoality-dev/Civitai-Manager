import { Typography } from "@mui/material";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import React, { useState } from "react";
import InputAdornment from "@mui/material/InputAdornment";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";

const CodeSnippet = ({ label, content }) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <>
      <InputLabel id="code-snippet">{label}</InputLabel>
      <TextField
        id="code-snippet"
        value={content}
        contentEditable={"false"}
        multiline
        spellCheck="false"
        inputProps={{ maxRows: 20 }}
        onMouseEnter={() => {
          setIsHovered(true);
        }}
        onMouseLeave={() => {
          setIsHovered(false);
        }}
        variant="outlined"
        InputProps={{
          endAdornment: isHovered && (
            <IconButton
              aria-label="copy"
              style={{
                position: "absolute",
                top: 10,
                right: 30,
                borderRadius: "4px",
                border: "1px solid rgba(0.5, 0.5, 0.5, 1.)",
              }}
              onClick={() => {
                /* Add your button click handler */
              }}
            >
              <ContentCopyIcon />
            </IconButton>
          ),
        }}
      />
    </>
  );
};

export default CodeSnippet;
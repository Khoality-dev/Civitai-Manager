import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import React, { useState } from "react";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import InputLabel from "@mui/material/InputLabel";
import DoneIcon from '@mui/icons-material/Done';

const CodeSnippet = ({ label, content }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyToClipboardClick = () => {
    navigator.clipboard
      .writeText(content)
      .then(() => {
        console.log("Text copied to clipboard:", content);
        setCopied(true);
        setTimeout(() => {
          setCopied(false);
        }, 1000);
      })
      .catch((error) => {
        console.error("Error copying text to clipboard:", error);
      });
  };

  return (
    <>
      <InputLabel id="code-snippet">{label}</InputLabel>
      <TextField
        id="code-snippet"
        value={content}
        contentEditable={"false"}
        multiline
        spellCheck="false"
        inputProps={{ maxRows: 10 }}
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
              onClick={handleCopyToClipboardClick}
            >
              {copied ? <DoneIcon/> : <ContentCopyIcon />}
            </IconButton>
          ),
        }}
      />
    </>
  );
};

export default CodeSnippet;

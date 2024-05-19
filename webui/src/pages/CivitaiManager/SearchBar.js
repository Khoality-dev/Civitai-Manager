import { TextField } from "@mui/material";
import axios from "../../axios";
import React, { useEffect, useState } from "react";

const SearchBar = ({ searchQuery, setSearchQuery, height }) => {
  let timeoutId;
  const handleInputChange = (event) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
        setSearchQuery(event.target.value);
    }, 100);
  };

  return (
    <TextField
      label="Search"
      variant="outlined"
      fullWidth
      onChange={handleInputChange}
    />
  );
};
export default SearchBar;

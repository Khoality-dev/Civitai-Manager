import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CivitaiManagerPage from "./pages/CivitaiManager/CivitaiManagerPage";
import AlbumManagerPage from "./pages/AlbumManager/AlbumManagerPage";
import { Drawer, List, ListItem, ListItemText } from '@mui/material';

function App() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <BrowserRouter>
      <div>
        <Drawer anchor="left" open={isDrawerOpen} onClose={toggleDrawer}>
          <List>
            <ListItem button component="a" href="/" onClick={toggleDrawer}>
              <ListItemText primary="civitai-manager" />
            </ListItem>
            <ListItem button component="a" href="/album" onClick={toggleDrawer}>
              <ListItemText primary="album" />
            </ListItem>
          </List>
        </Drawer>
        <button onClick={toggleDrawer}>Toggle Drawer</button>
      </div>


      <Routes>
        <Route path="/" element={<CivitaiManagerPage />} />
        <Route path="/album" element={<AlbumManagerPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

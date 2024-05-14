import React, { useEffect, useState } from "react";
import FileCard from "./FileCard";
import axios from "../../axios";

function AlbumManagerPage() {
  const [currentPath, setCurrentPath] = useState("album");

  const [fileList, setFileList] = useState([]);
  useEffect(() => {
    axios
      .get("/file-browser", {
        params: {
          path: currentPath,
        },
      })
      .then((response) => {
        const files = response.data.files;
        const newFileList = [];
        for (const name in files) {
          const file = files[name];

          if (file.hasOwnProperty("base64")) {
            const base64UrlString = "data:image/jpeg;base64," + file["base64"];
            newFileList.push({ name, base64UrlString });
          } else {
            const base64UrlString = "./folder_image.jpg" ;
            newFileList.push({ name, base64UrlString});
          }
        }
        setFileList(newFileList);
      })
      .catch((error) => console.error("Error fetching image:", error));
  }, []);
  return (
    <>
      {fileList.map((file, _) => (
        <FileCard thumbnailImage={file.base64UrlString} name={file.name} />
      ))}
    </>
  );
}

export default AlbumManagerPage;

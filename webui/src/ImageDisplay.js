import React, { useState, useEffect } from "react";
import axios from "./axios";

function ImageDisplay() {
  const [imageSrc, setImageSrc] = useState("");

  useEffect(() => {
    axios
      .get("/api/image", {
        responseType: "arraybuffer",
        params: {
          model_version_id: 14,
        },
      })
      .then((response) => {
        const base64 = btoa(
          new Uint8Array(response.data).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            ""
          )
        );
        setImageSrc("data:image/jpeg;base64," + base64);
      })
      .catch((error) => console.error("Error fetching image:", error));
  }, []);

  return <div>{imageSrc && <img src={imageSrc} alt="Image" />}</div>;
}

export default ImageDisplay;

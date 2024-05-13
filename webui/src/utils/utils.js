export function convertImageBufferToUrl(imageBuffer) {
    const base64 = btoa(
        new Uint8Array(imageBuffer).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ""
        )
      );
      return "data:image/jpeg;base64," + base64;
}


export default convertImageBufferToUrl;
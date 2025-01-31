import Resizer from "react-image-file-resizer";

const resizeImage = (value: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    Resizer.imageFileResizer(
      value,
      1772,
      1181,
      "JPG",
      100,
      0,
      (uri) => {
        if (uri) {
          resolve(uri as string);
        } else {
          reject(new Error("Failed to resize image"));
        }
      },
      "base64",
      900,
      400
    );
  });
};

export default resizeImage;

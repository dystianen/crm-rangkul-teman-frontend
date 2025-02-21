import convertFileToBase64 from "./convertFileToBase64.util";

const convertBlobToBase64 = async (blob: Blob): Promise<string> => {
  try {
    const file = new File([blob], "file");
    const res = await convertFileToBase64(file);
    return res.base64;
  } catch (error) {
    throw new Error("Failed to convert URL to Base64: " + error);
  }
};

export default convertBlobToBase64;

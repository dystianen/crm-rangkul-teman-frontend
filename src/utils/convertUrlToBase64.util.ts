import convertFileToBase64 from "./convertFileToBase64.util";

const convertUrlToBase64 = async (fileUrl: string, originalType: string): Promise<string> => {
  try {
    const response = await fetch(fileUrl);
    if (!response.ok) throw new Error("Failed to fetch file");

    const blob = await response.blob();
    const file = new File([blob], "file", { type: originalType });
    const res = await convertFileToBase64(file);
    return res.base64;
  } catch (error) {
    throw new Error("Failed to convert URL to Base64: " + error);
  }
};

export default convertUrlToBase64;

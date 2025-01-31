import imageCompression from "browser-image-compression";
import convertFileToBase64 from "./convertFileToBase64.util";

async function imageCompress(value: File): Promise<{ base64: string; sizeMB: number }> {
  // ✅ Check if the file is provided
  if (!value) {
    throw new Error("No file provided.");
  }

  // ✅ If file is already ≤ 2MB, convert to Base64 directly
  if (value.size <= 2 * 1024 * 1024) {
    return await convertFileToBase64(value);
  }

  const options = {
    maxSizeMB: 2,
    maxWidthOrHeight: 1920,
    useWebWorker: true, // Optimize performance
    alwaysKeepResolution: true // Maintain quality
  };

  try {
    const compressedFile = await imageCompression(value, options);
    console.log("Compressed File Details:", {
      sizeMB: (compressedFile.size / 1024 / 1024).toFixed(2),
      type: compressedFile.type
    });

    return await convertFileToBase64(compressedFile);
  } catch (error) {
    console.error("Error compressing image:", error);
    throw error; // Re-throw the error to handle it in the calling function
  }
}

export default imageCompress;
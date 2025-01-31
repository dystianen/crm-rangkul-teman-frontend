import imageCompression from "browser-image-compression";

async function imageCompress(value: File): Promise<{ base64: string; sizeMB: number }> {
  // ✅ Check if the file is provided
  if (!value) {
    throw new Error("No file provided.");
  }

  const imageFile = value;

  // ✅ If file is already ≤ 2MB, convert to Base64 directly
  if (imageFile.size <= 2 * 1024 * 1024) {
    return await convertFileToBase64(imageFile);
  }

  const options = {
    maxSizeMB: 2,
    maxWidthOrHeight: 1920,
    useWebWorker: true, // Optimize performance
    alwaysKeepResolution: true // Maintain quality
  };

  try {
    const compressedFile = await imageCompression(imageFile, options);
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

// ✅ Helper function to convert File to Base64
function convertFileToBase64(file: File): Promise<{ base64: string; sizeMB: number }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      resolve({ base64: reader.result as string, sizeMB: file.size / 1024 / 1024 });
    };
    reader.onerror = (error) => {
      reject(error);
    };
  });
}

export default imageCompress;
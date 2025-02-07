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

export default convertFileToBase64
/**
 * Mengonversi string Base64 menjadi objek File.
 * @param base64 - String Base64.
 * @param fileName - Nama file yang dihasilkan.
 * @returns File yang bisa digunakan di input atau upload.
 */
export function base64ToFile(base64: string, fileName: string): File {
  const arr = base64.split(",");
  const mime = arr[0].match(/:(.*?);/)?.[1] || "application/octet-stream";
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], fileName, { type: mime });
}

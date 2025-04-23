import { notifySuccess } from "./devExtremeUtils";

const TAB_SIZE = 4;

export function formatValue(value: any, spaces: number = TAB_SIZE): string {
  if (value && Array.isArray(value[0])) {
    return `[${getLineBreak(spaces)}${value
      .map((item: any) =>
        Array.isArray(item[0]) ? formatValue(item, spaces + TAB_SIZE) : JSON.stringify(item)
      )
      .join(`,${getLineBreak(spaces)}`)}${getLineBreak(spaces - TAB_SIZE)}]`;
  }
  return JSON.stringify(value);
}

function getLineBreak(spaces: number): string {
  return `\r\n${" ".repeat(spaces)}`;
}

export function allowOnlyNumbers(e: KeyboardEvent): void {
  const allowedKeys: string[] = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"];
  const isNumber: boolean = /^[0-9]$/.test(e.key);

  if (!isNumber && !allowedKeys.includes(e.key)) {
    e.preventDefault();
  }
}

export function allowOnlyText(e: KeyboardEvent) {
  const allowedKeys = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab", " "];

  const isLetter = /^[a-zA-Z]$/.test(e.key);

  if (!isLetter && !allowedKeys.includes(e.key)) {
    e.preventDefault();
  }
}

export function isValidBase64(str: string): boolean {
  if (!str || typeof str !== "string") return false;

  const base64Pattern = /^(?:[A-Z\d+/]{4})*(?:[A-Z\d+/]{2}==|[A-Z\d+/]{3}=)?$/i;

  try {
    return base64Pattern.test(str) && btoa(atob(str)) === str;
  } catch (e) {
    return false;
  }
}

export function getFileBase64(file: any): { fileType: string; fileContent: string } | null {
  if (!file) return null;

  // Jika file sudah dalam bentuk base64 (data URI)
  if (typeof file === "string" && file.startsWith("data:")) {
    const matches = file.match(/^data:(.*?);base64,(.*)$/);
    if (matches && matches.length === 3) {
      return {
        fileType: matches[1],
        fileContent: matches[2]
      };
    }
  }

  // Jika file adalah object dengan fileType dan fileContent
  if (typeof file === "object" && file.fileType && file.fileContent) {
    return {
      fileType: file.fileType,
      fileContent: file.fileContent
    };
  }

  return null;
}

export const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text).then(() => {
    notifySuccess("Copied to clipboard!");
  });
};

// 🔹 Fungsi untuk mengonversi koordinat desimal ke derajat-menit-detik (DMS)
export const convertToDMS = (lat: number, lng: number) => {
  const toDMS = (value: number, direction1: string, direction2: string) => {
    const absValue = Math.abs(value);
    const degrees = Math.floor(absValue);
    const minutes = Math.floor((absValue - degrees) * 60);
    const seconds = ((absValue - degrees - minutes / 60) * 3600).toFixed(1);
    const direction = value >= 0 ? direction1 : direction2;
    return `${degrees}°${minutes}'${seconds}"${direction}`;
  };

  return `${toDMS(lat, "N", "S")} ${toDMS(lng, "E", "W")}`;
};

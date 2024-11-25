export const getFileBase64 = (type: string, val: string) => {
  return `data:${type};base64,${val}`;
};

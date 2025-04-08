const TAB_SIZE = 4;

export function formatValue(value: any, spaces: number = TAB_SIZE): string {
  if (value && Array.isArray(value[0])) {
    return `[${getLineBreak(spaces)}${value
      .map((item: any) =>
        Array.isArray(item[0])
          ? formatValue(item, spaces + TAB_SIZE)
          : JSON.stringify(item)
      )
      .join(`,${getLineBreak(spaces)}`)}${getLineBreak(spaces - TAB_SIZE)}]`;
  }
  return JSON.stringify(value);
}

function getLineBreak(spaces: number): string {
  return `\r\n${' '.repeat(spaces)}`;
}

export function allowOnlyNumbers(e: KeyboardEvent): void {
  const allowedKeys: string[] = [
    "Backspace",
    "Delete",
    "ArrowLeft",
    "ArrowRight",
    "Tab",
  ];
  const isNumber: boolean = /^[0-9]$/.test(e.key);

  if (!isNumber && !allowedKeys.includes(e.key)) {
    e.preventDefault();
  }
}

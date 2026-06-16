export function jsonText(value: unknown) {
  return JSON.stringify(value, null, 2);
}

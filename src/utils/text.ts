/** Upper-cases the first letter of each word. "paratha rolls" -> "Paratha Rolls". */
export function titleCase(value: string) {
  return value.replace(/\b\w/g, (c) => c.toUpperCase());
}

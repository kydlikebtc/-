/**
 * Safely converts a value to a number
 * @param value The value to convert
 * @param fallback The fallback value if conversion fails
 * @returns The converted number or fallback value
 */
export const toNumber = (value: string | number | undefined, fallback = 0): number => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? fallback : parsed;
  }
  return fallback;
};

/**
 * Formats a value for display
 * @param value The value to format
 * @param decimals The number of decimal places
 * @returns The formatted string
 */
export const formatValue = (value: string | number | undefined, decimals = 2): string => {
  if (value === undefined) return '-';
  if (typeof value === 'string' && isNaN(parseFloat(value))) return value;
  const num = toNumber(value);
  return num.toFixed(decimals);
};

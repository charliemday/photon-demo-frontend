export const capitalizeFirstLetter = (string: string): string => {
  // Turn string to lower case
  const lower = string.toLowerCase();
  // Capitalize first letter
  return lower.charAt(0).toUpperCase() + lower.slice(1);
};

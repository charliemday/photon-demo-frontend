interface SemrushData {
  costPerLine: number;
  noOfLines: number;
  noOfRequests: number;
}

export const calculateSemrushCost = (semrushData: SemrushData): string => {
  const { costPerLine, noOfLines, noOfRequests } = semrushData;
  const tokenCost = costPerLine * noOfLines * noOfRequests;

  // SEMRush cost per unit is 16666
  const unitCost = 16666;

  return (tokenCost / unitCost).toFixed(2);
};

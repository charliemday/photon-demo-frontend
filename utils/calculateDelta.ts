export const calculateDelta = (current: number, previous: number): number => {
    if (previous === 0) return 0;
    return Math.round(((current - previous) / previous) * 100);
}
export type RecursiveObject = {
    [key: string]: RecursiveObject | {};
};

export const recursiveCount = (obj: RecursiveObject): number => {
    let count = 0;
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            count++;
            if (typeof obj[key] === 'object' && Object.keys(obj[key]).length > 0) {
                count += recursiveCount(obj[key] as RecursiveObject);
            }
        }
    }
    return count;
}
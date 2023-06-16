import parsePath from "parse-path";

export const nestUrls = (urls: string[]): Record<string, any> => {
    /**
     * This function takes an array of urls and returns a nested object
     * e.g. it will take the url https://www.example.com/blog and return:
     * {
     *  www.example.com: {
     *     www.example.com/blog: {
     *       www.example.com/blog/1: {}
     *  }
     * }
     */
    const result: Record<string, any> = {};
    for (const url of urls) {
        const { pathname } = parsePath(url);
        const parts = pathname.split("/").filter((part) => part !== "");
        let current = result;

        for (const part of parts) {
            if (!current[part]) {
                current[part] = {};
            }
            current = current[part];
        }
    }

    return result;
};
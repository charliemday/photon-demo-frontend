export const typeCheckError = (error: any): boolean | string => {
    /**
     * This function is used to check if an error is an API error.
     */
    if (error instanceof Error) {
        return error.message;
    }

    if (typeof error === "string") {
        return error;
    }

    if (typeof error === "object" && error !== null) {
        if ("data" in error) {
            const { data } = error;
            if (typeof data === "object" && data !== null) {
                if ("error" in data) {
                    const { error: errorData } = data;
                    if (typeof errorData === "object" && errorData !== null) {
                        if ("message" in errorData) {
                            const { message } = errorData;
                            if (typeof message === "string") {
                                return message;
                            }
                        }
                    }
                }
            }
        }
    }

    return false;
};

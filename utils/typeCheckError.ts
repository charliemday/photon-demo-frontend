export const typeCheckError = (error: any): boolean | string => {
    /**
     * This function is used to check if an error is an API error and if
     * so does follow the standard type:
     * 
     * "error": {
     *   "status_code": 0,
     *   "message": "",
     *   "details": [],
     * }
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

                        if ("details" in errorData) {
                            const { details } = errorData;
                            if (Array.isArray(details) && details.length > 0 && typeof details[0] === "string") {
                                return details[0];
                            }

                            if (typeof details === "object" && details !== null) {
                                const detailValues = Object.values(details)
                                if (detailValues.length > 0) {
                                    const firstErrorArr = detailValues[0];
                                    if (Array.isArray(firstErrorArr) && firstErrorArr.length > 0) {
                                        return firstErrorArr[0];
                                    }
                                }
                            }
                        }



                        if ("message" in errorData) {
                            const { message } = errorData;
                            if (typeof message === "string") {
                                return message;
                            }
                        }
                    }
                }

                if ("non_field_errors" in data) {
                    const { non_field_errors: nonFieldErrors } = data;
                    if (Array.isArray(nonFieldErrors) && nonFieldErrors.length > 0) {
                        return nonFieldErrors[0];
                    }
                }

            }
        }
    }

    return false;
};

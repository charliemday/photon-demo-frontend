import { useUserDetailsQuery } from "api/user.api";
import { Features } from "types/user";

interface ReturnProps {
    hasAccess: boolean
}

export const useHasProductAccess = (): ReturnProps => {
    /**
     * Determines whether the user has access to WordSeek
     */
    const { data } = useUserDetailsQuery(
        undefined
    )

    return {
        // TODO: Switch over to new feature flags once they are implemented
        // @ts-ignore
        hasAccess: data?.features?.includes(Features.WORD_SEEK) ?? false
    }

};
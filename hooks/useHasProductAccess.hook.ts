import { useUserDetailsQuery } from "api/user.api";
import { PRICEA, PRODUCT_ID } from "config";

interface ReturnProps {
    hasAccess: boolean
}

export const useHasProductAccess = (product: string = PRODUCT_ID, price: string = PRICEA): ReturnProps => {
    /**
     * Determines whether the user has access to a product and the pricing
     */
    const { data } = useUserDetailsQuery(
        undefined
    )

    const targetProduct = data?.products?.[product]

    if (!targetProduct) {
        return { hasAccess: false }
    }

    return {
        hasAccess: targetProduct.includes(price)
    }
};
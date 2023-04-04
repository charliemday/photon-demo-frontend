import { useUserDetailsQuery } from "api/user.api";
import { PRICEB, PRICEC, PRODUCT_ID } from "config";

interface ReturnProps {
    hasAccess: boolean
}

export const useHasProductAccess = (product: string = PRODUCT_ID, prices: string[] = [PRICEB, PRICEC]): ReturnProps => {
    /**
     * Determines whether the user has access to a product and the pricing
     */
    const { data } = useUserDetailsQuery(
        undefined
    )

    const targetProduct: string[] | undefined = data?.products?.[product]

    if (!targetProduct) {
        return { hasAccess: false }
    }

    return {
        hasAccess: prices.some(price => targetProduct?.includes(price))
    }
};
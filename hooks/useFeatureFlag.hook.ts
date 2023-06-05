import { useUserTiersQuery } from "api/user.api";
import { Features } from "types";

interface Props {
    features: Features[];
}

interface ReturnProps {
    hasAccess: (props: Props) => boolean;
}

export const useFeatureFlag = (): ReturnProps => {
    /**
     * Here you can implement your own logic to get the feature flag value
     */
    const { data: userTier } = useUserTiersQuery();

    const hasAccess = (props: Props) => {
        const { features } = props;

        if (!userTier) return false;

        const { featureAccess } = userTier?.tier;

        if (featureAccess.includes(Features.ALL)) return true;

        let access = false;
        if (features.length > 0) {
            /**
             * If a feature is passed, then we need to check the user has access
             * to all the features passed
             */
            access = features.every((feature) => featureAccess.includes(feature));
        } else {
            /**
             * If no feature is passed, then we assume that the user has access to the page
             */
            access = true;
        }

        return access;
    };

    return {
        hasAccess,
    };
};

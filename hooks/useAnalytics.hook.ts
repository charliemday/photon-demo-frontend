import { IS_PROD } from "config";

declare global {
    interface Window {
        fathom: {
            trackGoal: (eventId: string, value: number) => void;
        };
        Rewardful: {
            referral: string;
        };
    }
}

export const useFathom = () => {
    /**
     * Track an event using Fathom
     */
    const trackEvent = (eventId: string) => {
        if (typeof window !== 'undefined' && IS_PROD) {
            window.fathom?.trackGoal(eventId, 0);
        }
    }

    return {
        trackEvent
    }
}

export const useRewardful = () => {
    /**
     * Get the referral code from Rewardful
     */
    const getReferralCode = () => {
        if (typeof window !== 'undefined' && IS_PROD) {
            return window.Rewardful?.referral;
        }

        return "checkout_" + new Date().getTime();
    }

    return {
        getReferralCode
    }
};
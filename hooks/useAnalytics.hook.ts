import { IS_PROD } from "config";

declare global {
    interface Window {
        fathom: {
            trackGoal: (eventId: string, value: number) => void;
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
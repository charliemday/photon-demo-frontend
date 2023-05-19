import { useToast } from "@chakra-ui/react";
import { useTeamPerformanceQuery } from "api/team.api";
import { useEffect } from "react";
import { calculateDelta, typeCheckError } from "utils";
import { useActiveTeam } from "./useActiveTeam.hook";


export interface OverviewStat {
    title: string;
    value: number;
    delta?: number;
    textColor?: string;
    color?: string;
}

interface ReturnProps {
    overviewStats: OverviewStat[];
    isLoading: boolean;
    isError: boolean;
}

export const useBuildOverviewStats = (): ReturnProps => {
    const activeTeam = useActiveTeam();
    const toast = useToast();

    const { data: teamPerformance, isError, isLoading, error } = useTeamPerformanceQuery(
        {
            teamUid: activeTeam?.uid,
        },
        {
            skip: !activeTeam?.uid,
        },
    );

    useEffect(() => {
        if (!isLoading) {
            if (isError) {
                toast({
                    title: "Error",
                    description: typeCheckError(error) || "Something went wrong",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            }
        }
    }, [isError, error, isLoading, toast]);

    const organicTraffic = {
        title: 'Organic Traffic',
        value: teamPerformance?.traffic || 0,
        delta: calculateDelta(teamPerformance?.traffic || 0, teamPerformance?.previousTraffic || 0),
        textColor: "white",
    }

    const keywords = {
        title: 'Keywords',
        value: teamPerformance?.allKeywords || 0,
        delta: calculateDelta(teamPerformance?.allKeywords || 0, teamPerformance?.previousAllKeywords || 0),
        color: "#F7C994",
    }

    const impressions = {
        title: 'Impressions',
        value: teamPerformance?.impressions || 0,
        delta: calculateDelta(teamPerformance?.impressions || 0, teamPerformance?.previousImpressions || 0),
        color: "#978FEF",
    }

    const clicks = {
        title: 'Clicks',
        value: teamPerformance?.clicks || 0,
        delta: calculateDelta(teamPerformance?.clicks || 0, teamPerformance?.previousClicks || 0),
        color: "#F7C994",
    }

    const tasksComplete = {
        title: 'Tasks Complete',
        value: 0,
        delta: 0,
        color: "#978FEF",
    }

    const overviewStats = [
        organicTraffic,
        keywords,
        impressions,
        clicks,
        tasksComplete,
    ]



    return {
        overviewStats,
        isLoading,
        isError,
    }
};
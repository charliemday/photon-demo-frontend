import { useWordSeekJobsQuery } from "api/engine.api";
import { RowDataItem, RowItemTypes } from "components/table";
import { RowItem } from "components/table/table";
import dayjs from "dayjs";
import { useActiveTeam } from "hooks/useActiveTeam.hook";
import { useMemo } from "react";
import { WordSeekJobType } from "types/engine";

interface ReturnProps {
    rowItems: RowItem[];
    isLoading: boolean;
    isError: boolean;
}

interface Props {
    onClick: (jobGroupUuid: string) => void;
}

export const useBuildJobTableData = (props: Props): ReturnProps => {
    const activeTeam = useActiveTeam();
    const { data: wordSeekJobs, isLoading, isError, isFetching } = useWordSeekJobsQuery({
        teamId: activeTeam?.id
    }, {
        refetchOnMountOrArgChange: true,
        skip: !activeTeam?.id
    })


    const sortedJobsByCreated = useMemo(() => {
        if (!wordSeekJobs) return [];
        return [...wordSeekJobs]?.sort((a, b) => {
            return dayjs(a.jobCreated).isBefore(dayjs(b.jobCreated)) ? 1 : -1;
        })
    }, [wordSeekJobs])


    const jobTableData = useMemo(() => sortedJobsByCreated?.map(({
        jobsRemaining,
        progress,
        jobsCompleted,
        jobType,
        user,
        site,
        jobGroupUuid
    }) => {
        const firstName = user?.firstName || "";
        const lastName = user?.lastName || "";

        const rowData: RowDataItem[] = [
            {
                value: site,
                type: RowItemTypes.text,
                flex: 2,
                size: "sm"
            },
            {
                value: jobType === WordSeekJobType.SINGLE_PAGE ? "Single Page" : "Full Site",
                type: RowItemTypes.text,
                size: "sm"
            },
            {
                value: (jobsRemaining + jobsCompleted).toString(),
                type: RowItemTypes.text,
                size: "sm"
            },
            {
                value: progress * 100,
                type: RowItemTypes.progress,
                size: "sm",
                flex: 2,
            },
            {
                value: `${firstName} ${lastName}`,
                type: RowItemTypes.avatar,
                size: "sm",
                flex: 2,
            },
            {
                value: "View",
                type: RowItemTypes.button,
                size: "sm"
            },
        ]
        return {
            rowData,
            rowClick: () => props.onClick(jobGroupUuid),
            rowClickable: false
        }

    }), [
        props,
        sortedJobsByCreated
    ]);


    return {
        rowItems: jobTableData || [],
        isLoading: (isLoading || isFetching) && jobTableData.length === 0,
        isError
    }
};
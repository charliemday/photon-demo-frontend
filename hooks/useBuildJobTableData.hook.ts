import { useWordSeekJobsQuery } from "api/engine.api";
import { RowItem } from "components/table/table";
import { RowDataItem, RowItemTypes } from "components/table/table.row";
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
    const { data: wordSeekJobs, isLoading, isError } = useWordSeekJobsQuery({
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
        jobGroupUuid,
        jobCreated,
    }) => {
        const firstName = user?.firstName || "";
        const lastName = user?.lastName || "";

        const rowData: RowDataItem[] = [
            {
                text: site,
                type: RowItemTypes.text,
                flex: 2,
                size: "sm"
            },
            {
                text: jobType === WordSeekJobType.SINGLE_PAGE ? "Single Page" : "Full Site",
                type: RowItemTypes.text,
                size: "sm"
            },
            {
                text: (jobsRemaining + jobsCompleted).toString(),
                type: RowItemTypes.text,
                size: "sm"
            },
            {
                text: progress * 100,
                type: RowItemTypes.progress,
                size: "sm"
            },
            {
                text: `${firstName} ${lastName}`,
                type: RowItemTypes.avatar,
                size: "sm"
            },
            {
                text: dayjs(jobCreated).format("MM/DD/YYYY"),
                type: RowItemTypes.tag,
                size: "xs"
            },
            {
                text: "View",
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
        wordSeekJobs,
        props,
    ]);


    return {
        rowItems: jobTableData || [],
        isLoading,
        isError
    }
};
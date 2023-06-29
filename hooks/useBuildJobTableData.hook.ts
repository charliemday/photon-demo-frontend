import { useWordSeekJobsQuery } from "api/engine.api";
import { RowDataItem, RowItemTypes } from "components/table";
import { RowItem } from "components/table/table";
import { HeaderItem } from "components/table/table.header";
import dayjs from "dayjs";
import { useActiveTeam } from "hooks/useActiveTeam.hook";
import { useMemo } from "react";
import { WordSeekJobType } from "types/engine";

interface ReturnProps {
    rowItems: RowItem[];
    rowHeaders: HeaderItem[];
    isLoading: boolean;
    isError: boolean;
}

interface Props {
    onClick: (jobGroup: number) => void;
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

    const rowHeaders: HeaderItem[] = [
        {
            text: "Job Name",
            flex: 2,
        },
        {
            text: "Job Type",
        },
        {
            text: "Pages",
        },
        {
            text: "Status",
            flex: 2,
        },
        {
            text: "User",
            flex: 2,
        },
        {
            text: "Result",
        },
    ];

    const jobTableData = useMemo(() => sortedJobsByCreated?.map(({
        jobsRemaining,
        progress,
        jobsCompleted,
        jobType,
        user,
        site,
        jobGroup
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
            rowClick: () => props.onClick(jobGroup),
            rowClickable: false
        }

    }), [
        props,
        sortedJobsByCreated
    ]);


    return {
        rowItems: jobTableData || [],
        rowHeaders,
        isLoading: (isLoading || isFetching) && jobTableData.length === 0,
        isError
    }
};
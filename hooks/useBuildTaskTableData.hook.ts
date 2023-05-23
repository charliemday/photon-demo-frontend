import { useListTasksQuery } from "api/tasks.api";
import { RowItem, RowItemTypes } from "components/table/table.row";
import { ROUTES } from "config";
import { useActiveTeam } from "hooks/useActiveTeam.hook";
import { useRouter } from "next/router";
import { useMemo } from "react";

interface ReturnProps {
    rowItems: {
        rowData: RowItem[];
        rowClick: () => void;
        rowType: string;
    }[];
    isLoading: boolean;
    isError: boolean;
}

export const useBuildTaskTableData = (): ReturnProps => {
    const activeTeam = useActiveTeam();
    const router = useRouter();
    const { data: taskData, isLoading, isError } = useListTasksQuery({
        teamId: activeTeam?.id
    }, {
        refetchOnMountOrArgChange: true,
        skip: !activeTeam?.id
    });


    const taskTableData = useMemo(() => taskData?.map(({
        title,
        id,
        taskType: {
            name,
            slug
        },
        assignee: {
            firstName,
            lastName
        },
        status,
        created,
    }) => {

        const date = created ? new Date(created) : null;
        const dateString = date ? date.toLocaleDateString("default", {
            month: "short",
        }) : "";

        const rowData = [
            {
                text: title,
                type: RowItemTypes.text,
                flex: 3,
            }, {
                text: name,
                type: RowItemTypes.tag,
                flex: 2,
            },
            {
                text: `${firstName} ${lastName}`,
                type: RowItemTypes.avatar,
            },
            {
                text: dateString,
                type: RowItemTypes.tag,
            }, {
                text: status.value,
                type: RowItemTypes.tag,
            }
        ]
        return {
            rowData,
            rowClick: () => router.push(ROUTES.TASK(id)),
            rowType: slug
        }

    }), [taskData, router]);


    return {
        rowItems: taskTableData || [],
        isLoading,
        isError
    }
};
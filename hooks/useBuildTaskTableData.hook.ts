import { useListTasksQuery } from "api/tasks.api";
import { RowItemTypes } from "components/table";
import { RowItem } from "components/table/table";
import { ROUTES } from "config";
import { useActiveTeam } from "hooks/useActiveTeam.hook";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { TaskTypeSlugEnum } from "types";

interface ReturnProps {
    rowItems: RowItem[];
    isLoading: boolean;
    isError: boolean;
}

interface Props {
    // TODO: This is a temporary solution until we have
    // a way to open modals inside of a hook
    onOnboardingClick: () => void;
}

export const useBuildTaskTableData = (props: Props): ReturnProps => {
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
                value: title,
                type: RowItemTypes.text,
                flex: 3,
            }, {
                value: name,
                type: RowItemTypes.tag,
                flex: 2,
            },
            {
                value: `${firstName} ${lastName}`,
                type: RowItemTypes.avatar,
            },
            {
                value: dateString,
                type: RowItemTypes.tag,
            }, {
                value: status.value,
                type: RowItemTypes.tag,
            }
        ]
        return {
            rowData,
            rowType: slug,
            rowClick: () => {
                if (slug === TaskTypeSlugEnum.onboarding && props.onOnboardingClick) {
                    props.onOnboardingClick();
                    return;
                }

                router.push(ROUTES.TASK(id));
            }
        }

    }), [taskData, router, props]);


    return {
        rowItems: taskTableData || [],
        isLoading,
        isError
    }
};
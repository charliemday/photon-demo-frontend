import { Breadcrumb } from 'components/breadcrumbs';
import { ROUTES } from "config";
import { useRouter } from 'next/router';
import { Task, TaskTypeSlugEnum } from 'types';

interface ReturnProps {
    breadcrumbs: Breadcrumb[];
}

export const useBuildTaskBreadcrumbs = (task?: Task): ReturnProps => {

    const router = useRouter();

    const renderTaskType = () => {
        if (task?.taskType.slug === TaskTypeSlugEnum.blog) {
            return "✍️ Blog Post";
        }

        return "👋 Onboarding"
    };

    if (!task) {
        return {
            breadcrumbs: []
        }
    }

    const breadcrumbs: Breadcrumb[] = [
        {
            label: "Home",
            onClick: () => router.push(ROUTES.DASHBOARD),
        },
        {
            label: renderTaskType(),
        },
        {
            label: `${task?.title}`,
        },
    ]


    return {
        breadcrumbs
    }

};
import { Blog } from "./blog";
import { Team } from "./team";
import { User } from "./user";

export enum TaskStatusEnum {
    todo = "To Do",
    done = "Done",
}

export enum TaskStatusNameEnum {
    todo = "to_do",
    done = "done",
}

export enum TaskTypeSlugEnum {
    blog = "blog",
    onboarding = "onboarding",
}

export enum TaskTypeNameEnum {
    blog = "Blog",
    onboarding = "Onboarding",
}

export interface TaskStatusType {
    name: TaskStatusNameEnum;
    label: TaskStatusEnum;
}

export interface TaskType {
    id: number;
    name: TaskTypeNameEnum;
    slug: TaskTypeSlugEnum;
}

export interface Task {
    id: number;
    title: string;
    description: string;
    status: {
        name: TaskStatusNameEnum;
        value: TaskStatusEnum;
    };
    team: Partial<Team>;
    assignee: Partial<User>;
    taskType: TaskType;
    created: string;
    content: Blog | null;
}

export interface CreateUpdateTask extends Omit<Task, "status" | "taskType" | "team" | "assignee"> {
    status: string;
    taskType: number;
    team: number;
    assignee: number;
}

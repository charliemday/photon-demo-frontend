import { Team } from "./team";
import { User } from "./user";

export enum TaskStatusEnum {
    todo = "To Do",
    completed = "Completed",
}

export enum TaskStatusNameEnum {
    todo = "to_do",
    completed = "completed",
}


export enum TaskTypeSlugEnum {
    blog = "blog",
    onboarding = "onboarding",
}

export enum TaskTypeNameEnum {
    blog = "Blog",
    onboarding = "Onboarding",
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
    },
    team: Partial<Team>,
    assignee: Partial<User>,
    taskType: TaskType;
    created: string;
};
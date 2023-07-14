import { baseApi } from "api/base-query";
import { camelizeKeys, decamelizeKeys } from "humps";
import { ConvertToSnakeCase, CreateUpdateTask, Task, TaskStatusType, TaskType } from "types";

import { ListTaskQueryParams } from "./types";
import { tasksUrls } from "./urls";

const {
    LIST_TASKS,
    CREATE_TASK,
    UPDATE_TASK,
    DELETE_TASK,
    RETRIEVE_TASK,
    LIST_STATUSES,
    LIST_TASK_TYPES,
} = tasksUrls;


// Define a service using a base URL and expected endpoints
export const taskApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        /**
         * List all the tasks for a particular team
         */
        listTasks: builder.query<Task[], ListTaskQueryParams>({
            query: (body) => ({
                url: LIST_TASKS(body.teamId),
            }),
            transformResponse: (response: ConvertToSnakeCase<Task[]>) => camelizeKeys(response) as Task[],
        }),
        /**
         * Retrieve a single task by id
         */
        retrieveTask: builder.query<Task, number | undefined>({
            query: (id) => ({
                url: RETRIEVE_TASK(id),
            }),
            transformResponse: (response: ConvertToSnakeCase<Task>) => camelizeKeys(response) as Task,
        }),
        /**
         * List all the task types
         */
        listTaskTypes: builder.query<TaskType[], void>({
            query: () => ({
                url: LIST_TASK_TYPES,
            }),
            transformResponse: (response: TaskType[]) => response,
        }),
        /**
         * List all task statuses
         */
        listStatuses: builder.query<TaskStatusType[], void>({
            query: () => ({
                url: LIST_STATUSES,
            }),
            transformResponse: (response: TaskStatusType[]) => response,
        }),
        /**
         * Update a task
         */
        updateTask: builder.mutation<Task, { taskId: number; body: Partial<CreateUpdateTask> }>({
            query: ({ taskId, body }) => ({
                url: UPDATE_TASK(taskId),
                method: "PATCH",
                body: decamelizeKeys(body),
            }),
            transformResponse: (response: ConvertToSnakeCase<Task>) => camelizeKeys(response) as Task,
        }),
        /**
         * Create a task
         */
        createTask: builder.mutation<Task, { teamId: number; body: Partial<CreateUpdateTask> }>({
            query: ({ teamId, body }) => ({
                url: CREATE_TASK(teamId),
                method: "POST",
                body: decamelizeKeys(body),
            }),
            transformResponse: (response: ConvertToSnakeCase<Task>) => camelizeKeys(response) as Task,
        }),
        /**
         * Delete a task
         */
        deleteTask: builder.mutation<void, number>({
            query: (id) => ({
                url: DELETE_TASK(id),
                method: "DELETE",
            }),
        }),
    }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
    useListTasksQuery,
    useRetrieveTaskQuery,
    useListTaskTypesQuery,
    useListStatusesQuery,
    useCreateTaskMutation,
    useUpdateTaskMutation,
    useDeleteTaskMutation,
} = taskApi;

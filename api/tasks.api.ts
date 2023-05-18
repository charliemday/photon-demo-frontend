import { baseApi } from "api/base-query";
import { camelizeKeys } from "humps";
import { ConvertToSnakeCase, Task } from "types";

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



export interface ListTaskQueryParams {
    teamId: number;
}


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
            transformResponse: (response: ConvertToSnakeCase<Task[]>) => camelizeKeys(response) as Task[]
        }),
        /**
         * Retrieve a single task by id
         */
        retrieveTask: builder.query<Task, number | undefined>({
            query: (id) => ({
                url: RETRIEVE_TASK(id),
            }),
            transformResponse: (response: ConvertToSnakeCase<Task>) => camelizeKeys(response) as Task
        }),

    })

});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useListTasksQuery, useRetrieveTaskQuery } = taskApi;

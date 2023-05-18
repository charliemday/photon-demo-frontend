export const tasksUrls = {
    LIST_TASKS: (teamId: number) => `tasks?team_id=${teamId}`,
    CREATE_TASK: (teamId: number) => `tasks/?team_id=${teamId}`,
    UPDATE_TASK: (taskId: number) => `tasks/${taskId}/`,
    DELETE_TASK: (taskId: number) => `tasks/${taskId}/`,
    RETRIEVE_TASK: (taskId: number | undefined) => `tasks/${taskId}/`,
    LIST_STATUSES: "tasks/statuses/",
    LIST_TASK_TYPES: "tasks/types/",
}
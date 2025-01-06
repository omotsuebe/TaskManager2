import {Task} from "~/models/Task";
import {fetchWith} from "~/utils/fetchWith";
import {getAuthData} from "~/services/userService";
import { API_BASE_URL } from "~/utils/config";

const API_URL = API_BASE_URL+'/tasks';

export const getTasks = async (page = 1, shared?: string, status?: string, priority?: string) => {
    const params = new URLSearchParams({ page: page.toString() });
    if (shared) params.append('shared', shared);
    if (status) params.append('status', status);
    if (priority) params.append('priority', priority);

    const response = await fetchWith<{ data: { tasks: Task[] } }>(`${API_URL}?${params.toString()}`, {
        method: "GET",
        token: getAuthData()?.token,
    });
    return response.data;
};

export const createTask = async (task: Task) => {
    const response = await fetchWith<{ data: { tasks: Task } }>(`${API_URL}`, {
        method: "POST",
        token: getAuthData()?.token,
        body: task,
    });
    return response.data.tasks;
};

export const updateTask = async (id: string, task: Task) => {
    const response = await fetchWith<{ data: { tasks: Task } }>(`${API_URL}/${id}`, {
        method: "PUT",
        token: getAuthData()?.token,
        body: task,
    });
    return response.data.tasks;
};

export const deleteTask = async (id: string) => {
    return await fetchWith<Task>(`${API_URL}/${id}`, {
        method: "DELETE",
        token: getAuthData()?.token,
    });
};

export const shareTask = async (tasks: string[], username: string) => {
    return await fetchWith<Task>(`${API_URL}/share`, {
        method: "POST",
        token: getAuthData()?.token,
        body: { username, tasks },
    });
};

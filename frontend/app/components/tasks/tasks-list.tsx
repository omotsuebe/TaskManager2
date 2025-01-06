import React from "react";
import { getTasks, deleteTask } from "~/services/taskService";
import { Task } from "~/models/Task";
import LoadingIndicator from "~/components/common/loading-indicator";
import { Filter, Plus, Share } from "lucide-react";
import { Button } from "../ui/button";
import { TasksFilterStatus } from "./tasks-filter-status";
import { TaskFormDialog } from "./tasks-form";
import TaskShare from "./tasks-share";
import { TasksFilterPriority } from "./tasks-filter-priority";
import useNotification from "~/hooks/useNotification";

export default function ListTasks() {
    const [tasks, setTasks] = React.useState<Task[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [filterPriority, setFilterPriority] = React.useState<string>("Priority");
    const [filterStatus, setFilterStatus] = React.useState<string>("Status");
    const [filterShared, setFilterShared] = React.useState<string>("");
    const {notifyError, notifySuccess} = useNotification();

    const fetchTasks = async (page = 1, shared='', status='', priority='') => {
        try {
            setLoading(true);
            const tasksData = await getTasks(page, shared, status, priority);
            setTasks(tasksData.tasks);
        } catch (err) {
            if (err instanceof Error) {
                notifyError(err.message || 'An error occurred');
            } else {
                notifyError('An error occurred');
            }
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        fetchTasks();
    }, []);

    const filterTasks = (filterType: 'status' | 'priority', value: string) => {
        if (filterType === 'status') {
            if (value === 'all') {
                setFilterStatus('');
                fetchTasks(1, filterShared, '', filterPriority === 'Priority' ? '' : filterPriority);
                return;
            }
            setFilterStatus(value);
            fetchTasks(1, filterShared, value, filterPriority === 'Priority' ? '' : filterPriority);
        } else if (filterType === 'priority') {
            if (value === 'all') {
                setFilterPriority('');
                fetchTasks(1, filterShared, filterStatus === 'Status' ? '' : filterStatus, '');
                return;
            }
            setFilterPriority(value);
            fetchTasks(1, filterShared, filterStatus === 'Status' ? '' : filterStatus, value);
        }
    };

    const receivedTask = async () => {
        setFilterShared('true');
        fetchTasks(1, 'true');
    };

    const doDeleteTask = async (id: string|undefined) => {
        if (!confirm("Are you sure you want to delete this task?")) return;
        if (!id) return
        try {
            await deleteTask(id);
            fetchTasks();
        } catch (err) {
            if (err instanceof Error) {
                notifyError(err.message || 'An error occurred');
            } else {
                notifyError('An error occurred');
            }
        }
    };

    if (loading) return <LoadingIndicator />;

    return (
        <div>
            <div className="grid lg:grid-cols-2 grid-cols-1 gap-4 items-center mb-2">
                <div className="font-[500]">Manage Tasks</div>
                <div className="flex lg:flex-row flex-col lg:justify-end gap-2">
                    <TasksFilterStatus value={filterStatus} onFilterChange={(value: string) => filterTasks('status', value)} />
                    <TasksFilterPriority value={filterPriority} onFilterChange={(value: string) => filterTasks('priority', value)} />
                    {!filterShared ? (
                        <Button variant="outline" title="Tasks shared with you" onClick={receivedTask}>
                            <Share />Assigned
                        </Button>
                    ) : (
                        <Button variant="outline" title="Show all tasks" onClick={() => { setFilterShared(''); fetchTasks(); }}>
                            All Tasks
                        </Button>
                    )}
                    <TaskFormDialog fetchTasks={fetchTasks} />
                </div>
            </div>
            <div className="grid lg:grid-cols-1 grid-cols-1 gap-4">
                <div className="flex flex-col w-full p-6 bg-white rounded border">
                    <div className="">
                        <div className="">
                            {tasks.length > 0 ? (
                                tasks.map((item, index) => (
                                    <div key={index} className="border rounded p-3 mb-3">
                                        <div className="flex lg:flex-row flex-col w-full item-center">
                                            <div className="flex md:flex-row flex-col gap-3 item-center w-full">
                                                <div className="hidden md:block">
                                                    <svg
                                                        className="w-6 h-6 text-gray-400"
                                                        aria-hidden="true"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="24"
                                                        height="24"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            stroke="currentColor"
                                                            strokeLinecap="round"
                                                            strokeWidth="2"
                                                            d="M5 7h14M5 12h14M5 17h14"
                                                        />
                                                    </svg>
                                                </div>
                                                <div className="font-[500]">{item.title}</div>
                                                <div className="flex lg:flex-row flex-col gap-3">
                                                    <span className="bg-gray-100 py-1 px-2 rounded-lg">
                                                        {item.category}
                                                    </span>
                                                    {item.priority === "high" && (
                                                        <span className="bg-red-200 py-1 px-2 rounded-lg">
                                                            {item.priority}
                                                        </span>
                                                    )}
                                                    {item.priority === "medium" && (
                                                        <span className="bg-amber-200 py-1 px-2 rounded-lg">
                                                            {item.priority}
                                                        </span>
                                                    )}
                                                    {item.priority === "low" && (
                                                        <span className="bg-green-200 py-1 px-2 rounded-lg">
                                                            {item.priority}
                                                        </span>
                                                    )}
                                                    {item.status === "incomplete" && (
                                                        <span className="bg-blue-100 py-1 px-2 rounded-lg">
                                                            {item.status}
                                                        </span>
                                                    )}
                                                    {item.status === "complete" && (
                                                        <span className="bg-amber-100 py-1 px-2 rounded-lg">
                                                            {item.status}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex flex-row lg:justify-end">
                                                <div className="flex lg:flex-row flex-col w-full mt-5 lg:mt-0">
                                                    <TaskFormDialog task={item} fetchTasks={fetchTasks} />
                                                    {item.canShare && <TaskShare task={item} fetchTasks={fetchTasks} />}
                                                    {item.canDelete && (
                                                        <button
                                                            className="w-full cursor-pointer px-2 py-1 bg-red-500 text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                                                            onClick={() => doDeleteTask(item.id)}
                                                        >
                                                            Delete
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-300 text-center pt-3">No tasks added yet</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

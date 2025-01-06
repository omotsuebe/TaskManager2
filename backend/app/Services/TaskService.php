<?php

namespace App\Services;

use App\Models\Task;
use App\Models\SharedTask;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Log;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Validation\ValidationException;
use App\Models\User;

class TaskService
{
    /**
     * Get all tasks for the authenticated user.
     * For advanced applications, pagination is required.
     *
     * @param array $filters
     * @return LengthAwarePaginator
     */
    public function viewTasks(array $filters): LengthAwarePaginator
    {
        try {
            $query = Task::with(['user', 'sharedTasks']);

            if (isset($filters['shared']) && $filters['shared']) {
                $query->whereIn('id', SharedTask::where('shared_with', auth()->id())->pluck('task_id'));
            } else {
                $query->where(function ($query) {
                    $query->where('user_id', auth()->id())
                          ->orWhereIn('id', SharedTask::where('shared_with', auth()->id())->pluck('task_id'));
                });
            }

            // Apply additional filters
            if (isset($filters['status'])) {
                $query->where('status', $filters['status']);
            }
            if (isset($filters['priority'])) {
                $query->where('priority', $filters['priority']);
            }
            if (isset($filters['category'])) {
                $query->where('category', $filters['category']);
            }

            // Dynamic sorting
            $query->orderBy('created_at', 'desc');

            // Paginate results
            $perPage = min($filters['limit'] ?? 20, 20); // Ensure maximum limit is 20
            $currentPage = $filters['page'] ?? 1; // Default to page 1 if not provided

            return $query->paginate($perPage, ['*'], 'page', $currentPage);
        } catch (\Throwable $e) {
            Log::error('Error in TaskService::getAllTasks: ' . $e->getMessage());
            throw new \Exception('Failed to fetch tasks.');
        }
    }

    /**
     * Create a new task for the authenticated user.
     *
     * @param array $data
     * @return Task
     */
    public function createTask(array $data): Task
    {
        $data['status'] = 'incomplete';
        return Task::create(array_merge($data, ['user_id' => auth()->id()]));
    }

    /**
     * Update a task for the authenticated user.
     *
     * @param Task $task
     * @param array $data
     * @return bool
     */
    public function updateTask(Task $task, array $data): bool
    {
        return $task->update($data);
    }

    /**
     * Delete a task for the authenticated user.
     *
     * @param Task $task
     * @return bool|null
     */
    public function deleteTask(Task $task): ?bool
    {
        if(auth()->id() !== $task->user_id) {
            throw new \Exception('You are not authorized to delete this task.', 403);
        }
        return $task->delete();
    }

    /**
     * Share a task with another user.
     *
     * @param array $request
     * @return bool
     * @throws ValidationException
     */
    public function shareTask(array $request): bool
    {
        $user = User::where('username', $request['username'])->first();

        if (!$user) {
            throw new ModelNotFoundException('Username not found.', 404);
        }
        if ($user->id === auth()->id()) {
            throw new \Exception('You cannot share your task with yourself.', 400);
        }

        if (!is_array($request['tasks'])) {
            throw ValidationException::withMessages([
                'tasks' => ['Tasks should be an array.'],
            ]);
        }

        foreach ($request['tasks'] as $task) {
            if ($task) {
                SharedTask::firstOrCreate(
                    [
                        'task_id' => $task,
                        'shared_with' => $user->id
                    ],
                    [
                        'task_id' => $task,
                        'shared_with' => $user->id,
                        'shared_by' => auth()->id()
                    ]
                );
            }
        }

        return true;

    }

}

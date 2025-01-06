<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\BaseApiController;
use App\Http\Requests\Task\StoreTaskRequest;
use App\Http\Requests\Task\GetTaskRequest;
use App\Http\Requests\Task\UpdateTaskRequest;
use App\Http\Resources\TaskResource;
use App\Models\Task;
use App\Services\TaskService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class TaskController extends BaseApiController
{
    public function __construct(private readonly TaskService $taskService){}

    /**
     * Display a listing of the tasks.
     *
     * @return JsonResponse
     */
    public function index(GetTaskRequest $request): JsonResponse
    {
        try {
            $task = $this->taskService->viewTasks($request->validated());

            return $this->jsonSuccessWithData([
                'tasks' => TaskResource::collection($task->items()),
                'meta' => [
                    'current_page' => $task->currentPage(),
                    'per_page' => $task->perPage(),
                    'total' => $task->total(),
                    'last_page' => $task->lastPage(),
                ],
            ], 'Task fetched');
        } catch (\Exception $exception) {
            Log::error('Error in TaskController: '.$exception->getMessage());

            return $this->jsonError($this->defaultErrorMessage);
        }
    }

    /**
     * Store a newly created task in storage.
     *
     * @param StoreTaskRequest $request
     * @return JsonResponse
     */
    public function store(StoreTaskRequest $request): JsonResponse
    {
        try {
            $task = $this->taskService->createTask($request->validated());
            return $this->jsonSuccessWithData(new TaskResource($task),'task created');
        } catch (\Exception $exception){
            Log::error('Error in TaskController@store:' .$exception->getMessage());
            return $this->jsonError($this->defaultErrorMessage);
        }
    }

    /**
     * Display the specified task.
     *
     * @param Task $task
     * @return JsonResponse
     */
    public function show(Task $task): JsonResponse
    {
        try {
            return $this->jsonSuccessWithData(new TaskResource($task),'task');
        }catch (\Exception $exception){
            Log::error('Error in TaskController@show:' .$exception->getMessage());
            return $this->jsonError($this->defaultErrorMessage);
        }
    }

    /**
     * Update the specified task in storage.
     *
     * @param UpdateTaskRequest $request
     * @param Task $task
     * @return JsonResponse
     */
    public function update(UpdateTaskRequest $request, Task $task): JsonResponse
    {
        try {
            $this->taskService->updateTask($task, $request->validated());
            return $this->jsonSuccessWithData(new TaskResource($task),'task updated');
        }catch (\Exception $exception){
            Log::error('Error in TaskController@update:' .$exception->getMessage());
            return $this->jsonError($this->defaultErrorMessage);
        }
    }

    public function shareTasks(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                "tasks"    => "required|array",
                'username' => 'required|string|max:50'
            ]);

            $this->taskService->shareTask($validated);
            return $this->jsonSuccess('Task shared successfully');
        }catch (ValidationException $exception) {
            return $this->jsonError('Validation error: ' . $exception->getMessage());
        } catch (ModelNotFoundException $exception) {
            return $this->jsonError('Username not found', 404);
        } catch (\Exception $exception) {
            $statusCode = $exception->getCode() === 400 ? 400 : 500;
            $errorMessage = $statusCode === 400 ? $exception->getMessage() : $this->defaultErrorMessage;
            Log::error('Error in TaskController@shareTask:' .$exception->getMessage());
            return $this->jsonError($errorMessage, $statusCode);
        }
    }

    /**
     * Remove the specified task from storage.
     *
     * @param Task $task
     * @return JsonResponse
     */
    public function destroy(Task $task): JsonResponse
    {
        try {
            $this->taskService->deleteTask($task);
            return $this->jsonSuccess('task deleted', 200);
        }catch (\Exception $exception){
            $statusCode = $exception->getCode() === 403 ? 403 : 500;
            $errorMessage = $statusCode === 403 ? $exception->getMessage() : $this->defaultErrorMessage;
            Log::error('Error in TaskController@destroy:' .$exception->getMessage());
            return $this->jsonError($errorMessage, $statusCode);
        }
    }
}


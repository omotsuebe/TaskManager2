<?php

namespace Tests\Feature\Api;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\Task;
use App\Models\User;

class TaskControllerTest extends TestCase
{
    use RefreshDatabase;

    private function authUser(): User
    {
        return User::factory()->create([
            'email' => $this->faker->email,
            'username' => $this->faker->userName,
            'password' => bcrypt('Password123!'),
            'email_verified_at' => now(),
        ]);
    }   

    public function test_get_all_tasks(): void
    {

        $response = $this->actingAs($this->authUser())->getJson('/api/v1/tasks');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'result',
                'status',
                'message',
                'data' => [
                    'tasks' => [
                        '*' => [
                            'id',
                            'title',
                            'status',
                            'priority',
                            'category',
                            'created_at',
                            'updated_at',
                            'user',
                        ],
                    ],
                    'meta' => [
                        'current_page',
                        'per_page',
                        'total',
                        'last_page',
                    ],
                ],
            ]);
    }

    public function test_get_all_shared_tasks(): void
    {

        $response = $this->actingAs($this->authUser())->getJson('/api/v1/tasks?shared=true');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'result',
                'status',
                'message',
                'data' => [
                    'tasks' => [
                        '*' => [
                            'id',
                            'title',
                            'status',
                            'priority',
                            'category',
                            'created_at',
                            'updated_at',
                            'user',
                        ],
                    ],
                    'meta' => [
                        'current_page',
                        'per_page',
                        'total',
                        'last_page',
                    ],
                ],
            ]);
    }

   public function test_get_all_tasks_with_filters(): void
    {

        $response = $this->actingAs($this->authUser())->getJson('/api/v1/tasks?status=completed&priority=high&category=work');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'result',
                'status',
                'message',
                'data' => [
                    'tasks' => [
                        '*' => [
                            'id',
                            'title',
                            'status',
                            'priority',
                            'category',
                            'created_at',
                            'updated_at',
                            'user',
                        ],
                    ],
                    'meta' => [
                        'current_page',
                        'per_page',
                        'total',
                        'last_page',
                    ],
                ],
            ]);
    }

    public function test_create_task(): void
    {
        $user = $this->authUser();

        $taskData = [
            'title' => 'New Task',
            'status' => 'incomplete',
            'priority' => 'medium',
            'category' => 'work',
            'user_id' => $user->id,
        ];

        $response = $this->actingAs($user)->postJson('/api/v1/tasks', $taskData);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'result',
                'status',
                'message',
                'data' => [
                    'id',
                    'title',
                    'status',
                    'priority',
                    'category',
                    'created_at',
                    'updated_at',
                    'user',
                ],
            ]);

        $this->assertDatabaseHas('tasks', [
            'title' => 'New Task',
            'status' => 'incomplete',
            'priority' => 'medium',
            'category' => 'work',
            'user_id' => $user->id,
        ]);
    }

    public function test_update_task(): void
    {
        $user = $this->authUser();

        $task = Task::factory()->create([
            'title' => 'Old Task',
            'status' => 'incomplete',
            'priority' => 'medium',
            'category' => 'work',
            'user_id' => $user->id,
        ]);

        $taskData = [
            'title' => 'Updated Task',
            'status' => 'complete',
            'priority' => 'high',
            'category' => 'personal',
        ];

        $response = $this->actingAs($user)->putJson("/api/v1/tasks/{$task->id}", $taskData);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'result',
                'status',
                'message',
                'data' => [
                    'id',
                    'title',
                    'status',
                    'priority',
                    'category',
                    'created_at',
                    'updated_at',
                    'user',
                ],
            ]);

        $this->assertDatabaseHas('tasks', [
            'title' => 'Updated Task',
            'status' => 'complete',
            'priority' => 'high',
            'category' => 'personal',
            'user_id' => $user->id,
        ]);
    }

    public function test_delete_task(): void
    {
        $user = $this->authUser();

        $task = Task::factory()->create([
            'title' => 'Old Task',
            'status' => 'incomplete',
            'priority' => 'medium',
            'category' => 'work',
            'user_id' => $user->id,
        ]);

        $response = $this->actingAs($user)->deleteJson("/api/v1/tasks/{$task->id}");

        $response->assertStatus(200)
            ->assertJson(['result' => true, 'status' => 'success']);

        $this->assertDatabaseMissing('tasks', ['id' => $task->id]);
    }
    
}

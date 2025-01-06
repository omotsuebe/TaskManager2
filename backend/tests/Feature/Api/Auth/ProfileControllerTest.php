<?php

namespace Tests\Feature\Api\Auth;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\User;

class ProfileControllerTest extends TestCase
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

    public function test_get_user_profile(): void
    {
        $response = $this->actingAs($this->authUser())->getJson('/api/v1/auth/profile');

        $response->assertStatus(200)
            ->assertJson(['result' => true, 'status' => 'success']);
    }

    public function test_update_user_profile(): void
    {
        $data = [
            'name' => $this->faker->firstName,
            'username' => $this->faker->userName,
        ];

        $this->actingAs($this->authUser())->putJson('/api/v1/auth/update-profile', $data)
            ->assertStatus(200)
            ->assertJson(['result' => true, 'status' => 'success']);
    }

    public function test_update_profile_validation_errors(): void
    {
        $data = [
            'name' => '',
            'username' => '',
        ];

        $this->actingAs($this->authUser())->putJson('/api/v1/auth/update-profile', $data)
            ->assertStatus(422)
            ->assertJson([
                'message' => 'Validation failed',
                'errors' => [
                    'name' => ['The name field is required.'],
                    'username' => ['The username field is required.'],
                ],
            ]);
    }
}

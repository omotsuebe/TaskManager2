<?php

namespace Tests\Feature\Api\Auth;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use App\Models\User;
use Tests\TestCase;

class AuthControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_register_user_successfully(): void
    {
        $email = $this->faker->email;
        $data = [
            'name' => $this->faker->firstName,
            'username' => $this->faker->userName,
            'email' => $email,
            'password' => 'Password@23',
        ];

        $response = $this->postJson('/api/v1/auth/register', $data);

        $response->assertStatus(200)
            ->assertJson(['result' => true, 'status' => 'success']);

        $this->assertDatabaseHas('users', ['email' => $email]);
    }

    public function test_registration_validation_errors(): void
    {
        $data = [
            'name' => '',
            'username' => '',
            'email' => 'invalid-email',
            'password' => 'short',
        ];

        $this->postJson('/api/v1/auth/register', $data)
        ->assertStatus(422)
            ->assertJson([
                'message' => 'Validation failed',
                'errors' => [
                    'name' => ['The name field is required.'],
                    'email' => ['The email field must be a valid email address.'],
                    'username' => ['The username field is required.'],
                    'password' => ['The password field must be at least 8 characters.'],
                ],
            ]);
    }

    public function test_login_successfully(): void
    {
        $email = $this->faker->email;

        $user = User::factory()->create([
            'email' => $email,
            'username' => $this->faker->userName,
            'password' => bcrypt('Password123!'),
            'email_verified_at' => now(),
        ]);

        $data = [
            'email' => $email,
            'password' => 'Password123!'
        ];

        $this->postJson('/api/v1/auth/login', $data)
            ->assertStatus(200)
            ->assertJsonStructure(['result', 'access_token', 'token_type']);
    }

    public function test_invalid_login(): void
    {
        $data = [
            'email' => 'nonexistent@example.com',
            'password' => 'wrongpassword',
        ];

        $this->postJson('/api/v1/auth/login', $data)
            ->assertStatus(422)->assertJson([
                'status' => false,
                'status' => 'error',
                'message' => 'Validation error: The provided credentials are incorrect.',
                'errors' => []
            ]);
    }

    public function test_unverified_user(): void
    {
        $email = $this->faker->email;

        User::factory()->create([
            'email' => $email,
            'username' => $this->faker->userName,
            'password' => bcrypt('Password123!'),
            'email_verified_at' => null,
        ]);

        $data = [
            'email' => $email,
            'password' => 'Password123!',
        ];

        $this->postJson('/api/v1/auth/login', $data)
            ->assertStatus(422)
            ->assertJson(['status' => 'error']);
    }

    public function test_forgot_password(): void
    {
        $email = $this->faker->email;

        User::factory()->create([
            'email' => $email,
            'username' => $this->faker->userName,
            'password' => bcrypt('Password123!'),
            'email_verified_at' => now(),
        ]);

        $data = ['email' => $email];

        $this->postJson('/api/v1/auth/forgot-password', $data)
            ->assertStatus(200)
            ->assertJson(['status' => 'success']);
    }

    public function test_forgot_password_validation_errors(): void
    {
        $data = ['email' => 'invalid-email'];

        $this->postJson('/api/v1/auth/forgot-password', $data)
            ->assertStatus(404)
            ->assertJson([
                'status' => 'error',
                'message' => 'No email found.',
            ]);
    }

    public function test_resend_verification_code(): void
    {
        $email = $this->faker->email;

        User::factory()->create([
            'email' => $email,
            'username' => $this->faker->userName,
            'password' => bcrypt('Password123!'),
            'email_verified_at' => null,
        ]);

        $data = ['email' => $email];

        $this->postJson('/api/v1/auth/resend-code', $data)
            ->assertStatus(200)
            ->assertJson(['status' => 'success']);
    }

    public function test_resend_verification_code_validation_errors(): void
    {
        $data = ['email' => 'invalid-email'];

        $this->postJson('/api/v1/auth/resend-code', $data)
            ->assertStatus(404)
            ->assertJson([
                'status' => 'error',
                'message' => 'No email found.',
            ]);
    }

    public function test_verify_email(): void
    {
        $email = $this->faker->email;

        $user = User::factory()->create([
            'email' => $email,
            'username' => $this->faker->userName,
            'password' => bcrypt('Password123!'),
            'email_verified_at' => null,
            'otp_expires_at' => now()->addMinutes(20),
            'otp' => '123456',
        ]);

        $data = ['email' => $email, 'code' => $user->otp];

        $this->postJson('/api/v1/auth/verify-email', $data)
            ->assertStatus(200)
            ->assertJson(['status' => 'success']);
    }

    public function test_verify_email_validation_errors(): void
    {
        $data = ['email' => 'invalid-email', 'code' => '123456'];

        $this->postJson('/api/v1/auth/verify-email', $data)
            ->assertStatus(400)
            ->assertJson([
                'status' => 'error',
                'message' => 'Invalid or expired verification code, resend code.',
            ]);
    }

    public function test_verify_email_expired_code(): void
    {
        $email = $this->faker->email;

        $user = User::factory()->create([
            'email' => $email,
            'username' => $this->faker->userName,
            'password' => bcrypt('Password123!'),
            'email_verified_at' => null,
            'otp_expires_at' => now()->subMinutes(20),
            'otp' => '123456',
        ]);

        $data = ['email' => $email, 'code' => $user->otp];

        $this->postJson('/api/v1/auth/verify-email', $data)
            ->assertStatus(400)
            ->assertJson([
                'status' => 'error',
                'message' => 'Invalid or expired verification code, resend code.',
            ]);
    }

    public function test_verify_email_invalid_code(): void
    {
        $email = $this->faker->email;

        User::factory()->create([
            'email' => $email,
            'username' => $this->faker->userName,
            'password' => bcrypt('Password123!'),
            'email_verified_at' => null,
            'otp_expires_at' => now()->addMinutes(20),
            'otp' => '123456',
        ]);

        $data = ['email' => $email, 'code' => '654321'];

        $this->postJson('/api/v1/auth/verify-email', $data)
            ->assertStatus(400)
            ->assertJson([
                'status' => 'error',
                'message' => 'Invalid or expired verification code, resend code.',
            ]);
    }

    public function test_logout(): void
    {
        $email = $this->faker->email;

        $user = User::factory()->create([
            'email' => $email,
            'username' => $this->faker->userName,
            'password' => bcrypt('Password123!'),
            'email_verified_at' => now(),
        ]);

        $data = ['email' => $email, 'password' => 'Password123!'];

        $response = $this->postJson('/api/v1/auth/login', $data);

        $token = $response->json('access_token');

        $this->withHeader('Authorization', 'Bearer ' . $token)
            ->postJson('/api/v1/auth/logout')
            ->assertStatus(200)
            ->assertJson(['status' => 'success']);
    }

}

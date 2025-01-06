<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Controller as BaseController;

class BaseApiController extends BaseController
{
    protected $defaultErrorMessage = 'An unexpected error occurred. Please try again later.';
    
    protected function jsonSuccessWithData($data, string $message = 'Success', int $statusCode = 200): JsonResponse
    {
        return response()->json([
            'result' => true,
            'status' => 'success',
            'message' => $message,
            'data' => $data,
        ], $statusCode);
    }

    protected function jsonSuccess(string $message = 'Success', int $statusCode = 200): JsonResponse
    {
        return response()->json([
            'result' => true,
            'status' => 'success',
            'message' => $message,
        ], $statusCode);
    }

    protected function jsonError(string $message, int $statusCode = 500, array $errors = []): JsonResponse
    {
        return response()->json([
            'result' => false,
            'status' => 'error',
            'message' => $message,
            'errors' => $errors,
        ], $statusCode);
    }

    public function generateToken($user)
    {
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'result' => true,
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => ['name' => $user->name, 'email' => $user->email, 'username' => $user->username],
        ]);
    }

}

<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Http\Controllers\Api\BaseApiController;
use App\Http\Requests\Auth\ChangePasswordRequest;
use App\Http\Requests\Auth\UpdateProfileRequest;
use App\Http\Resources\UserResource;
use App\Services\UserService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ProfileController extends BaseApiController
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct(private readonly UserService $userService) {}

    /**
     * Get user profile
     */
    public function profile(Request $request): JsonResponse
    {
        try {
            $profile = $this->userService->profile($request);

            return $this->jsonSuccessWithData(new UserResource($profile), 'profile data fetched');
        } catch (\Exception $exception) {
            Log::error('Error in ProfileController@profile:'.$exception->getMessage());

            return $this->jsonError($this->defaultErrorMessage);
        }
    }

    /**
     * Update user profile
     */
    public function updateProfile(UpdateProfileRequest $request): JsonResponse
    {
        try {
            $this->userService->updateProfile($request->validated());

            return $this->jsonSuccess('Profile updated successfully');
        } catch (\Exception $exception) {
            Log::error('Error in AuthController@updateProfile:'.$exception->getMessage());

            return $this->jsonError($this->defaultErrorMessage);
        }
    }

    /**
     * Change user password
     */
    public function changePassword(ChangePasswordRequest $request): JsonResponse
    {
        try {
            $this->userService->changePassword($request->validated());

            return $this->jsonSuccess('Password changed successfully');
        } catch (\Exception $exception) {
            $statusCode = $exception->getCode() === 400 ? 400 : 500;
            $errorMessage = $statusCode === 400 ? $exception->getMessage() : $this->defaultErrorMessage;
            Log::error('Error in AuthController@changePassword:'.$exception->getMessage());

            return $this->jsonError($errorMessage, $statusCode);
        }
    }

    /**
     * Logout user
     */
    public function logout(Request $request): JsonResponse
    {
        try {
            $this->userService->logout($request);

            return $this->jsonSuccess('You have successfully logged out');
        } catch (\Exception $exception) {
            Log::error('Error in ProfileController@logout:'.$exception->getMessage());

            return $this->jsonError($this->defaultErrorMessage);
        }
    }
}

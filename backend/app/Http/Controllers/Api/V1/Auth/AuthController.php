<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Http\Controllers\Api\BaseApiController;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Requests\Auth\ResetPasswordRequest;
use App\Services\UserService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class AuthController extends BaseApiController
{

    public function __construct(private readonly UserService $userService){}

    /**
     * User registration
     * @param RegisterRequest $request
     * @return JsonResponse
     */
    public function register(RegisterRequest $request): JsonResponse
    {
        try {
            $this->userService->register($request->validated());
            return $this->jsonSuccess('Successful: An OTP has been sent to your email for verification');
        }catch (\Exception $exception){
            Log::error('Error in AuthController@register:' .$exception->getMessage());
            return $this->jsonError($this->defaultErrorMessage);
        }
    }

    /**
     * Resend verification code
     * @param Request $request
     * @return JsonResponse
     */
    public function resendVerificationCode(Request $request): JsonResponse
    {

        try {
            $this->userService->sendVerificationCode($request->input('email'));
            return $this->jsonSuccess('Verification code resent successfully');
        } catch (\Exception $exception) {
            $statusCode = $exception->getCode() === 404 ? 404 : 500;
            $errorMessage = $statusCode === 404 ? $exception->getMessage() : $this->defaultErrorMessage;
            Log::error('Error in AuthController@resendVerificationCode:' . $exception->getMessage());
            return $this->jsonError($errorMessage, $statusCode);
        }
    }

    /**
     * Verify email
     * @param Request $request
     * @return JsonResponse
     */
    public function verifyEmail(Request $request): JsonResponse
    {
        try {
            $this->userService->verifyEmail($request);
            return $this->jsonSuccess('Email verified successfully');
        } catch (\Exception $exception) {
            $statusCode = $exception->getCode() === 400 ? 400 : 500;
            $errorMessage = $statusCode === 400 ? $exception->getMessage() : $this->defaultErrorMessage;
            Log::error('Error in AuthController@verifyEmail:' . $exception->getMessage());
            return $this->jsonError($errorMessage, $statusCode);
        }
    }

    /**
     * User login
     * @param LoginRequest $request
     * @return JsonResponse
     */
    public function login(LoginRequest $request): JsonResponse
    {
        try {
            $user = $this->userService->login($request->validated());
            return $this->generateToken($user);
        } catch (ValidationException $exception) {
            return $this->jsonError('Validation error: ' . $exception->getMessage(),422);
        } catch (\Exception $exception) {
            Log::error('Error in AuthController@login:' . $exception->getMessage());
            return $this->jsonError($this->defaultErrorMessage);
        }
    }

    /**
     * Forgot password
     * @param Request $request
     * @return JsonResponse
     */
    public function forgotPassword(Request $request): JsonResponse
    {
        try {
            $this->userService->forgotPassword($request);
            return $this->jsonSuccess('An OTP has been sent to your email for password reset');
        } catch (\Exception $exception) {
            $statusCode = $exception->getCode() === 404 ? 404 : 500;
            $errorMessage = $statusCode === 404 ? $exception->getMessage() : $this->defaultErrorMessage;
            Log::error('Error in AuthController@forgotPassword:' . $exception->getMessage());
            return $this->jsonError($errorMessage, $statusCode);
        }
    }

    /**
     * Reset password
     * @param ResetPasswordRequest $request
     * @return JsonResponse
     */
    public function resetPassword(ResetPasswordRequest $request): JsonResponse
    {
        try {
            $this->userService->resetPassword($request->validated());
            return $this->jsonSuccess('Password reset successfully');
        } catch (\Exception $exception) {
            $statusCode = $exception->getCode() === 400 ? 400 : 500;
            $errorMessage = $statusCode === 400 ? $exception->getMessage() : $this->defaultErrorMessage;
            Log::error('Error in AuthController@resetPassword:' . $exception->getMessage());
            return $this->jsonError($errorMessage, $statusCode);
        }
    }

}

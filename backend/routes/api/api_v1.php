<?php

use App\Http\Controllers\Api\V1\Auth\AuthController;
use App\Http\Controllers\Api\V1\Auth\ProfileController;
use App\Http\Controllers\Api\V1\TaskController;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/resend-code', [AuthController::class, 'resendVerificationCode']);
    Route::post('/verify-email', [AuthController::class, 'verifyEmail']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('/reset-password', [AuthController::class, 'resetPassword']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/profile', [ProfileController::class, 'profile']);
        Route::put('/update-profile', [ProfileController::class, 'updateProfile']);
        Route::post('/logout', [ProfileController::class, 'logout']);
        Route::put('/change-password', [ProfileController::class, 'changePassword']);
    });
});

Route::prefix('tasks')->group(function () {
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/', [TaskController::class, 'index']);
        Route::post('/', [TaskController::class, 'store']);
        Route::get('/{task}', [TaskController::class, 'show']);
        Route::put('/{task}', [TaskController::class, 'update']);
        Route::post('/share', [TaskController::class, 'shareTasks']);
        Route::delete('/{task}', [TaskController::class, 'destroy']);
    });
});

<?php

namespace App\Services;

use App\Models\User;
use App\Notifications\AppNotification;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Notification;
use Illuminate\Validation\ValidationException;

class UserService
{
    /**
     * @return mixed
     *
     * @throws ValidationException
     */
    public function login(array $request)
    {
        if (! Auth::attempt($request)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        $user = User::where('email', $request['email'])->firstOrFail();

        if (! $user->email_verified_at) {
            throw ValidationException::withMessages([
                'email' => ['Email not verified.'],
            ]);
        }

        return $user;
    }

    /**
     * Register a new user.
     *
     * @param  array  $request  validated request data
     * @return mixed Returns the created user instance.
     */
    public function register(array $request): mixed
    {
        $user = User::create([
            'name' => $request['name'],
            'email' => $request['email'],
            'username' => $request['username'],
            'password' => Hash::make($request['password']),
        ]);
        $this->sendVerificationCode($user->email);

        return $user;
    }

    /**
     * Send a verification code to the user's email.
     *
     * @param  string  $email  The email address to send the code to.
     * @return string Returns 'verification-code-sent' on success.
     *
     * @throws Exception If the email is not found.
     */
    public function sendVerificationCode(string $email): string
    {
        try {
            $user = User::where('email', $email)->firstOrFail();
        } catch (ModelNotFoundException $e) {
            throw new Exception('No email found.', 404);
        }

        $verificationCode = rand(100000, 999999);
        $user->otp = $verificationCode;
        $user->otp_expires_at = now()->addMinutes(20);
        $user->save();

        // Send email with verification code
        $this->sendCode($user->email, $verificationCode);

        return 'verification-code-sent';
    }

    /**
     * Verify the user's email verification code.
     *
     * @param  Request  $request  The HTTP request instance containing the user's email and verification code.
     * @return mixed Returns 'email-verified' on successful verification.
     *
     * @throws Exception If the verification code is invalid or expired.
     */
    public function verifyEmail(Request $request): mixed
    {
        $user = User::where('email', $request->input('email'))
            ->where('otp', $request->input('code'))
            ->first();

        if (! $user || $user->otp_expires_at->isPast()) {
            throw new Exception('Invalid or expired verification code, resend code.', 400);
        }

        if ($request->input('action') !== 'resetp') {
            $user->email_verified_at = now();
            $user->otp = null;
            $user->otp_expires_at = null;
            $user->save();
        }

        return 'email-verified';
    }

    /**
     * Send a verification code to the user's email.
     *
     * @param  string  $email  The email address to send the code to.
     * @param  string  $code  The verification code to send.
     * @param  string  $title  The title of the email. Default is 'Email Verification'.
     */
    public function sendCode(string $email, string $code, string $title = 'Email Verification'): void
    {
        $message = [
            'subject' => env('APP_NAME').' '.$title,
            'from' => env('MAIL_FROM_ADDRESS'),
            'greeting' => 'You are almost there!',
            'body' => '<p style="text-align: left">Your verification code is</p>',
            'code' => '<h1 style="text-align: left; font-size:20px">'.$code.'</h1>',
        ];
        Notification::route('mail', $email)->notify(new AppNotification($message));
    }

    /**
     * Handle forgot password request.
     *
     * @param  Request  $request  The HTTP request instance containing the user's email.
     * @return mixed Returns 'password-reset-code-sent' on success.
     *
     * @throws ModelNotFoundException|Exception If the user with the given email is not found.
     */
    public function forgotPassword(Request $request): mixed
    {
        try {
            $user = User::where('email', $request->input('email'))->firstOrFail();
        } catch (ModelNotFoundException $e) {
            throw new Exception('No email found.', 404);
        }

        $this->sendVerificationCode($user->email);

        return 'password-reset-code-sent';
    }

    /**
     * Reset the user's password.
     *
     * @param  array  $request  user's email, verification code, and new password.
     * @return mixed Returns a string 'password-reset' on successful password reset.
     *
     * @throws Exception Throws an exception if the verification code is invalid or expired.
     */
    public function resetPassword(array $request): mixed
    {
        $user = User::where('email', $request['email'])
            ->where('otp', $request['code'])
            ->first();

        if (! $user || $user->otp_expires_at->isPast()) {
            throw new Exception('Invalid or expired verification code.', 400);
        }

        $user->password = Hash::make($request['password']);
        $user->otp = null;
        $user->otp_expires_at = null;
        $user->save();

        return 'password-reset';
    }

    /**
     * Get the authenticated user's profile.
     *
     * @param  Request  $request  The HTTP request instance.
     * @return mixed Returns the authenticated user instance.
     */
    public function profile(Request $request): mixed
    {
        return $request->user();
    }

    /**
     * Change the password of the authenticated user.
     *
     * @param  array  $request  The HTTP request instance containing the current and new passwords.
     * @return mixed Returns 'password-changed' on success.
     *
     * @throws Exception If the current password is invalid.
     */
    public function changePassword(array $request): mixed
    {
        $user = auth()->user();
        if (! Hash::check($request['current_password'], $user->password)) {
            throw new Exception('Invalid current password.', 400);
        }

        $user->password = Hash::make($request['new_password']);
        $user->save();

        return 'password-changed';
    }

    /**
     * Logout user
     */
    public function logout(Request $request): mixed
    {
        $request->user()->tokens()->delete();

        return 'logged-out';
    }

    /**
     * Update profile
     */
    public function updateProfile(array $request): mixed
    {
        $user = auth()->user();
        $user->name = $request['name'];
        $user->username = $request['username'];
        $user->save();

        return $user;
    }
}

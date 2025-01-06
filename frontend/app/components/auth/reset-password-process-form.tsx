import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { resetPasswordProcess } from '~/services/userService';
import ErrorAlert from '~/components/common/error-alert';
import LoadingButton from '~/components/common/loading-button';
import { Link, useNavigate } from "@remix-run/react";
import {Card, CardContent, CardHeader, CardTitle} from "~/components/ui/card";
import {Label} from "~/components/ui/label";
import InputError from "~/components/common/input-error";
import useNotification from "~/hooks/useNotification";
import {PasswordInput} from "~/components/common/password-input";

interface PasswordFormData {
  otp: string;
  newPassword: string;
  confirmPassword: string;
}

export default function ResetPasswordProcessForm() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<PasswordFormData>();
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const navigate = useNavigate();
  const [email, setEmail] = useState<string | null>(null);
  const [otp, setOtp] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { notifySuccess} = useNotification();

  useEffect(() => {
    // Retrieve email and OTP from session storage
    const storedEmail = sessionStorage.getItem('emailForOtp');
    const storeOtp = sessionStorage.getItem('storeOtp');
    if (storedEmail) {
      setEmail(storedEmail);
      setOtp(storeOtp);
    } else {
      //router.push('/reset-password'); // Redirect if no email found
    }
  }, [navigate]);

  const onSubmit = async (data: PasswordFormData) => {
    if (!email || !otp) return;

    setFormErrors([]);
    setLoading(true);

    try {
      const response = await resetPasswordProcess(email, otp, data.newPassword);
      sessionStorage.removeItem('storeOtp');
      notifySuccess(response.message || 'Password has been reset successfully.');
      navigate('/signin');
    } catch (error) {
      if (error instanceof Error) {
        setFormErrors([error.message]);
      } else {
        setFormErrors(['An unknown error occurred']);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <ErrorAlert errors={formErrors}/>
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-xl">Reset Password</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-1.5">
                <Label htmlFor="newPassword">New Password</Label>
                <PasswordInput id="newPassword" placeholder="Enter new password" {...register("newPassword", { required: 'New password is required' })} />
                <InputError error={errors?.newPassword?.message} />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <PasswordInput id="confirmPassword" placeholder="Confirm password" {...register("confirmPassword", {
                  required: 'Please confirm your new password',
                  validate: (value) =>
                      value === watch('newPassword') || 'Passwords do not match',
                })} />
                <InputError error={errors?.confirmPassword?.message}/>
              </div>
              <LoadingButton
                  text="Reset Password"
                  loadingText="Processing..."
                  loading={loading}
              />
            </div>
            <div className="mt-4 text-center text-sm">
              <Link to="/signin" className="underline">
                Sign In
              </Link>
            </div>
          </CardContent>
        </Card>
      </form>
  );
};


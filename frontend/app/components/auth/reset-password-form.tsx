
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { resetPassword } from '~/services/userService';
import ErrorAlert from '~/components/common/error-alert';
import LoadingButton from '~/components/common/loading-button';
import {Card, CardContent, CardHeader, CardTitle} from "~/components/ui/card";
import {Label} from "~/components/ui/label";
import {Input} from "~/components/ui/input";
import InputError from "~/components/common/input-error";
import { Link, useNavigate } from "@remix-run/react";
import useNotification from "~/hooks/useNotification";

export default function ResetPasswordForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<{email: string}>();
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useNavigate();
  const {notifySuccess} = useNotification();

  const onSubmit = async (data: {email: string}) => {
    setFormErrors([]);
    setLoading(true);

    try {
      const response = await resetPassword(data.email) as { message: string };
      sessionStorage.setItem('emailForOtp', data.email);
      sessionStorage.setItem('action', 'resetp');
      notifySuccess(response.message || 'Password reset instructions have been sent to your email.');
      router('/verify-otp');
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
      <ErrorAlert errors={formErrors} />
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl">Reset Password</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-1.5">
              <Label htmlFor="email" className="sr-only">Email</Label>
              <Input id="email" type="email" placeholder="Enter your email" {...register("email")} />
              <InputError error={errors?.email?.message}/>
            </div>
            <LoadingButton
                text="Send Reset Instructions"
                loadingText="Sending..."
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
}
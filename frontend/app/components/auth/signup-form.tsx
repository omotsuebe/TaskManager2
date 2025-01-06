import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SignupFormSchema, SignupFormState } from '~/validations/userValidation';
import { userSignUp } from '~/services/userService';
import ErrorAlert from '~/components/common/error-alert';
import LoadingButton from '~/components/common/loading-button';
import { useNavigate, Link } from "@remix-run/react";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "~/components/ui/card";
import {Label} from "~/components/ui/label";
import {Input} from "~/components/ui/input";
import InputError from "~/components/common/input-error";
import {PasswordInput} from "~/components/common/password-input";

export default function SignupForm() {
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormState>({
    resolver: zodResolver(SignupFormSchema),
  });

  const onSubmit = async (data: SignupFormState) => {
    setFormErrors([]); // Clear previous errors
    setLoading(true); // Start loading

    try {
      const response = await userSignUp(data);
      if(response){
        sessionStorage.setItem('emailForOtp', data.email);
        sessionStorage.setItem('action', 'signup');
        router('/verify-otp');
      }
    } catch (error) {

      if (error instanceof Error) {
        // Split error messages into an array for easier display
        setFormErrors(error.message.split(', '));
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
            <CardTitle className="text-xl">Sign Up</CardTitle>
            <CardDescription>
              Create a free account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-1.5">
                <Label htmlFor="name">Name</Label>
                <Input id="name" type="text" placeholder="Enter your name" {...register("name")} />
                <InputError error={errors?.name?.message}/>
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="username">Username</Label>
                <Input id="username" type="text" placeholder="Enter your username" {...register("username")} />
                <InputError error={errors?.username?.message}/>
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="Enter your email" {...register("email")} />
                <InputError error={errors?.email?.message}/>
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="password">Password</Label>
                <PasswordInput id="password" placeholder="Enter your password" {...register("password")} />
                <InputError error={errors?.password?.message} />
              </div>
              <LoadingButton
                  text="Sign In"
                  loadingText="Signing Up..."
                  loading={loading}
              />
            </div>
            <div className="mt-4 text-center text-sm">
              Have an account?{" "}
              <Link to="/signin" className="underline">
                Sign In
              </Link>
            </div>
          </CardContent>
        </Card>
      </form>
  );
}
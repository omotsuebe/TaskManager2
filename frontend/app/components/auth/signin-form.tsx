import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SigninFormSchema, SigninFormState } from "~/validations/userValidation";
import { useNavigate, Link } from "@remix-run/react";
import LoadingButton from '~/components/common/loading-button';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "~/components/ui/card";
import { Label } from "~/components/ui/label"
import { Input } from "~/components/ui/input"
import InputError from "~/components/common/input-error";
import ErrorAlert from "~/components/common/error-alert";
import {PasswordInput} from "~/components/common/password-input";
import { userSingIn, setAuthData } from "~/services/userService";
import { useAuth } from "~/context/auth";

export default function SignInForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SigninFormState>({
    resolver: zodResolver(SigninFormSchema),
  });

  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const { setUser, setToken } = useAuth();

  const onSubmit = async (data: SigninFormState) => {
    setFormErrors([]); // Clear previous errors
    setLoading(true); // Start loading

    try {
      const response = await userSingIn(data.email, data.password);
      if (response) {
        // Update local storage and context
        setAuthData(response.user, response.access_token);
        setUser(response.user);
        setToken(response.access_token);
        navigate("/dashboard");
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
  }

  return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <ErrorAlert errors={formErrors} />
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-xl">Login</CardTitle>
            <CardDescription>
              Enter your email below to login to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" {...register("email")} />
                <InputError error={errors?.email?.message} />
              </div>
              <div className="grid gap-1.5">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link to="/reset-password" className="ml-auto inline-block text-sm underline">
                    Forgot your password?
                  </Link>
                </div>
                <PasswordInput id="password" placeholder="Enter your password" {...register("password")} />
                <InputError error={errors?.password?.message} />
              </div>
              <LoadingButton
                  text="Sign In"
                  loadingText="Signing In..."
                  loading={loading}
              />
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link to="/signup" className="underline">
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      </form>
  );
}
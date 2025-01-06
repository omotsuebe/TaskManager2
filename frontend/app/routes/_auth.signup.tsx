import SignupForm from "~/components/auth/signup-form";
import { Link, MetaFunction } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [{ title: "Sign Up" }];
};

export default function SignUpPage() {
    return (
        <div>
            <SignupForm />
            <div className="text-center mt-4">
                <Link to="/" className="text-slate-600 text-sm hover:text-slate-800 underline">
                    Home
                </Link>
            </div>
        </div>
    );
}
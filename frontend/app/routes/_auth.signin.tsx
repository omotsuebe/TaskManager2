import SignInForm from "~/components/auth/signin-form";
import { Link, MetaFunction } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [{ title: "Sign In" }];
};

export default function SignInPage() {

    return (
        <div className="">
            <SignInForm />
            <div className="text-center mt-4">
                <div>
                    <Link to="/" className="text-slate-600 text-sm hover:text-slate-800 underline">
                        Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
  
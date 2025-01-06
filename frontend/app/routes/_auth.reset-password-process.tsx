import { MetaFunction } from "@remix-run/react";
import ResetPasswordProcessForm from "~/components/auth/reset-password-process-form";

export const meta: MetaFunction = () => {
  return [{ title: "Process Reset Password" }];
};

export default function ResetPasswordProcessPage() {
  return (
    <div>
      <ResetPasswordProcessForm />
    </div>
  );
}

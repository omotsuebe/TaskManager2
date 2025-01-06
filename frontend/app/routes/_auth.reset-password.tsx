import { MetaFunction } from '@remix-run/react';
import ResetPasswordForm from '~/components/auth/reset-password-form';

export const meta: MetaFunction = () => {
  return [{ title: "Reset Password" }];
};

export default function ResetPasswordPage(){
  return (
    <div>
        <ResetPasswordForm />
    </div>
  );
}
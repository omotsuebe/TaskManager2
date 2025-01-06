import ChangePasswordForm from '~/components/auth/account/change-password';
import { MetaFunction } from '@remix-run/react';

export const meta: MetaFunction = () => {
  return [{ title: "Change Password" }];
};

export default function ChangePasswordPage() {

  return (
    <div className="lg:w-[550px] md:w-full">
        <ChangePasswordForm />
    </div>
  );
};
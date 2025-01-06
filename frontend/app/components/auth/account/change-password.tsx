import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { changePassword } from '~/services/userService';
import ErrorAlert from '~/components/common/error-alert';
import LoadingButton from '~/components/common/loading-button';
import { Link, useNavigate } from "@remix-run/react";
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "~/components/ui/card";
import {Label} from "~/components/ui/label";
import InputError from "~/components/common/input-error";
import {PasswordInput} from "~/components/common/password-input";
import {Button} from "~/components/ui/button";
import useNotification from "~/hooks/useNotification";
import {ChevronLeft} from "lucide-react";

interface ChangePasswordFormData {
  currentPassword: string;
  newPassword: string;
}

export default function ChangePasswordForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<ChangePasswordFormData>();
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const { notifySuccess} = useNotification();

  const onSubmit = async (data: ChangePasswordFormData) => {
    setFormErrors([]);
    setLoading(true);

    try {
      const response = await changePassword(data.currentPassword, data.newPassword);
      notifySuccess(response.message || 'Password changed successfully.');
      navigate('/account');
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
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Change Password</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-1.5">
                <Label htmlFor="currentPassword">Current Password</Label>
                <PasswordInput id="currentPassword"
                               placeholder="Enter current password" {...register('currentPassword', {required: 'Current password is required'})} />
                <InputError error={errors?.newPassword?.message}/>
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="newPassword">New Password</Label>
                <PasswordInput id="newPassword"
                               placeholder="Enter new password" {...register("newPassword", {required: 'New password is required'})} />
                <InputError error={errors?.newPassword?.message}/>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">
              <ChevronLeft />
              <Link to="/account" >Cancel</Link>
            </Button>
            <LoadingButton
                text="Update"
                loadingText="Loading..."
                loading={loading}
            />
          </CardFooter>
        </Card>
      </form>
  );
};


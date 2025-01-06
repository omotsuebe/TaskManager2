import React, { useState, useEffect } from 'react';
import { updateProfile } from '~/services/userService';
import LoadingButton from '~/components/common/loading-button';
import { Link, useNavigate } from "@remix-run/react";
import { Button } from "~/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import {Label} from "~/components/ui/label";
import {Input} from "~/components/ui/input";
import ErrorAlert from "~/components/common/error-alert";
import useNotification from "~/hooks/useNotification";
import {ChevronLeft} from "lucide-react";
import { User } from '~/models/User';

export default function UpdateProfileForm({ profile }: { profile: User|null}
){
  const [formData, setFormData] = useState(profile || {
    name: '',
    email: '',
    username: ''
  });

  useEffect(() => {
    setLoading(false);
    if (profile) {
      setFormData(profile);
    }
  }, [profile]);

  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const { notifySuccess} = useNotification();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors([]);

    try {
      setLoading(true);
      const response = await updateProfile(formData);
      notifySuccess(response.message || 'Profile updated successfully.');
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
      <form onSubmit={handleSubmit}>
        <ErrorAlert errors={formErrors} />
        <Card>
          <CardHeader>
            <CardTitle>Update Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-1.5">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" type="text" value={formData.name} placeholder="Enter your name"
                       onChange={handleChange} required />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="username">Username</Label>
                <Input id="username" name="username" type="text" value={formData.username}
                       placeholder="Enter your username" onChange={handleChange} required />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" value={formData.email} placeholder="Enter your email"
                       onChange={handleChange} required />
              </div>

            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">
              <ChevronLeft />
              <Link to="/account">Back</Link>
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


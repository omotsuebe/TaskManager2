import { useEffect, useState } from 'react';
import Profile from '~/components/auth/account/profile';
import { userProfile  } from '~/services/userService';
import {processError} from "~/utils/errorHandler";
import { Link, MetaFunction } from "@remix-run/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import {Button} from "~/components/ui/button";
import {User} from "~/models/User";
import ErrorAlertToast from "~/components/common/error-alert-toast";
import {ChevronRight, Settings} from "lucide-react";
import LoadingIndicator from "~/components/common/loading-indicator";

export const meta: MetaFunction = () => {
  return [{ title: "User Account" }];
};

export default function ProfilePage(){
  const [profile, setProfile] = useState<User | null>(null);
  const [error, setError] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
        try {
            const profileData = await userProfile();
            setProfile(profileData);
            setLoading(false);
          } catch (err) {
            setError(processError(err));
            setLoading(false);
          }
    };
    fetchProfile();
  }, []);

  if (loading) return <LoadingIndicator />;

  return (
      <div className="lg:w-[550px] md:w-full">
        { error && (<ErrorAlertToast errors={error}/>)}
        <Card>
          <CardHeader className="border-b border-gray-100">
            <CardTitle>Account Profile</CardTitle>
            <CardDescription>You can modify your profile</CardDescription>
          </CardHeader>
          <CardContent className="pt-3">
            <div className="grid w-full">
              {profile && <Profile profile={profile} />}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">
              <Link to="/account/update-profile">Update</Link>
              <ChevronRight />
            </Button>
            <Button variant="outline">
              <Settings />
              <Link to="/account/change-password">Security</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
  );
};

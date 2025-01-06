import { useState, useEffect } from 'react';
import type { MetaFunction } from '@remix-run/react';
import UpdateProfileForm from '~/components/auth/account/update-profile';
import { userProfile } from '~/services/userService';
import {User} from "~/models/User";
import {processError} from "~/utils/errorHandler";
import ErrorAlert from "~/components/common/error-alert";
import LoadingIndicator from "~/components/common/loading-indicator";

export const meta: MetaFunction = () => {
  return [{ title: "Update Profile" }];
};

export default function UpdateProfile(){
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
        <div className="flex flex-col w-full">
            <ErrorAlert errors={error} />
            <div className="w-full max-w-md">
                {profile && (<UpdateProfileForm profile={profile} />)}
            </div>
        </div>
    );
};

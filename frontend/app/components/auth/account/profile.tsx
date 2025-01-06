import React from 'react';
import { IUser } from '@/models/User';

export default function Profile({ profile }: {profile: IUser}){
    return (
        <div className="flex flex-col">
            <div className="flex flex-row gap-5 items-center">
                <div><strong>Name:</strong></div>
                <div>{profile.name}</div>
            </div>
            <div className="flex flex-row gap-5 items-center">
                <div><strong>Email:</strong></div>
                <div>{profile.email}</div>
            </div>
        </div>
    );
};

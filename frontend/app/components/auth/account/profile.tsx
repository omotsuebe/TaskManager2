import { User } from '~/models/User';
import { useAuth } from "~/context/auth";
import { useNavigate } from "@remix-run/react";

export default function Profile({ profile }: {profile: User}){

    const { user, logoutUser } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logoutUser();
        navigate('/');
    };

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
            <div className="flex flex-row gap-5 items-center mt-5">
                <button 
                    className="bg-red-500 text-white px-4 py-0.5 rounded" 
                    onClick={handleLogout}>
                    Logout
                </button>
            </div>
        </div>
    );
};

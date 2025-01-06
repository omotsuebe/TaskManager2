import { useEffect } from "react";
import { toast } from "react-toastify";

interface ErrorAlertProps {
    errors: string[] | string;
}

export default function ErrorAlertToast({ errors }: ErrorAlertProps) {
    useEffect(() => {
        if (Array.isArray(errors) && errors.length > 0) {
            errors.forEach((error) => {
                toast.error(error, {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            });
        }
        if (!Array.isArray(errors) && errors.length > 0) {
            toast.error(errors, {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }

    }, [errors]);
    return null;
}

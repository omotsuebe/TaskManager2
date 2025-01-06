import {toast, ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const useNotification = () => {
    const notifySuccess = (message: string) => toast.success(message);
    const notifyError = (message: string) => toast.error(message);
    const notifyInfo = (message: string) => toast.info(message);
    const notifyWarning = (message: string) => toast.warn(message);

    return {
        notifySuccess,
        notifyError,
        notifyInfo,
        notifyWarning,
    };
};

export const NotificationProvider = () => {
    return (
        <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
        />
    );
};

export default useNotification;

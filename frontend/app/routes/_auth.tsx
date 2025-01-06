import { Outlet } from "@remix-run/react";

export default function Auth() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="max-w-sm mx-auto w-full lg:px-2 px-4">
            <Outlet />
        </div>
      </div>
  );
}

import { Separator } from "@radix-ui/react-separator";
import { Navigate, Outlet } from "@remix-run/react";
import CustomBreadcrumb from "~/components/common/custom-breadcrumb";
import { AppSidebar } from "~/components/common/dashboard/app-sidebar";
import { UserNav } from "~/components/common/dashboard/user-nav";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "~/components/ui/sidebar";
import { useAuth } from "~/context/auth";

export default function AppLayout() {
    const { user} = useAuth();
  
    if (!user) {
      return <Navigate to="/signin" />;
    }
  return (
    <div>
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header
                    className="flex h-16 shrink-0 items-center gap-2 border-b border-gray-200 mb-4 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                    <div className="flex flex-row w-full items-center px-4">
                        <div className="flex items-center gap-2 w-full">
                            <SidebarTrigger className="-ml-1"/>
                            <Separator orientation="vertical" className="mr-2 h-4"/>
                            <CustomBreadcrumb />
                        </div>
                        <div className="flex justify-end">
                            <UserNav name={user.name} email={user.email} />
                        </div>
                    </div>
                </header>
                <main className="flex flex-col w-full px-4">
                  <Outlet />
                </main>
            </SidebarInset>
        </SidebarProvider>
    </div>
  );
}
import { MetaFunction } from "@remix-run/react";
import ListTasks from "~/components/tasks/tasks-list";

export const meta: MetaFunction = () => {
  return [{ title: "Tasks Dashboard" }];
};

export default function Dashboard() {
  return (
    <div className="bg-white px-2">
      <div className="relative isolate px-0 lg:px-8">
        <div className="py-2">
          <div className="">
            <div className="mt-2 flex flex-col gap-x-6">
              <ListTasks />
            </div>
          </div>
        </div>
        <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]" aria-hidden="true">
          <div className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#60a5fa] to-[#818cf8] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]" style={{ clipPath: "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)" }}></div>
        </div>
      </div>
    </div>
  );
}
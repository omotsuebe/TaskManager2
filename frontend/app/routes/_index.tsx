import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <div className="bg-white">
        <header className="absolute inset-x-0 top-0 z-50">
          <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
            <div className="flex lg:flex-1">
              <Link to="" className="-m-1.5 p-1.5">
                <span className="sr-only">AppWiz</span>
                <img src="https://appwiz.dev/assets/images/favicon.png" alt="" width={30} height={30}/>
              </Link>
            </div>
            <div className="hidden lg:flex lg:gap-x-12">
              <Link to="#" className="text-sm/6 font-semibold text-gray-900">Product</Link>
              <Link to="#" className="text-sm/6 font-semibold text-gray-900">Features</Link>
            </div>
            <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            {/* <Link to="/dashboard" className="text-sm font-semibold text-gray-900"> Dashboard</Link> */}
            <Link to="/signin" className="text-sm/6 font-semibold text-gray-900">Sign In <span aria-hidden="true">&rarr;</span></Link>
            </div>

          </nav>
        </header>

        <div className="relative isolate px-6 pt-14 lg:px-8">
          <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
               aria-hidden="true">
            <div
                className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#bfdbfe] to-[#e0e7ff] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
          </div>
          <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div className="hidden sm:mb-8 sm:flex sm:justify-center">
              <div className="relative rounded-full px-3 py-1 text-sm/6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
                Announcing our next round of funding. <Link to="#" className="font-semibold text-indigo-600"><span className="absolute inset-0" aria-hidden="true"></span>Read more <span aria-hidden="true">&rarr;</span></Link>
              </div>
            </div>
            <div className="text-center">
              <h1 className="text-balance text-2xl font-semibold tracking-tight text-gray-900 sm:text-xl">Data to
                enrich your online business</h1>
              <p className="mt-8 text-pretty text-lg font-medium text-gray-500 sm:text-xl/8">Get started today</p>
            </div>
          </div>
          <div
              className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
              aria-hidden="true">
            <div
                className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#f5f3ff] to-[#bfdbfe] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"></div>
          </div>
        </div>
      </div>
  );
}

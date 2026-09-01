import { isRouteErrorResponse, useRouteError } from "react-router";
import { lazy } from "react";
import { Loadable } from "components/shared/Loadable/index.js";

const app = {
  401: lazy(() => import("./401")),
  404: lazy(() => import("./404")),
  429: lazy(() => import("./429")),
  500: lazy(() => import("./500")),
};

function RootErrorBoundary() {
  const error = useRouteError();
  if (isRouteErrorResponse(error)) {
    const Component = Loadable(app[error.status]);
    return <Component />;
  }

  return (
    <main className="min-h-100vh grid w-full grow grid-cols-1 place-items-center bg-gray-50 dark:bg-dark-900 p-4">
      <div className="w-full max-w-[26rem] text-center">
        <p className="text-7xl font-bold text-primary-600 dark:text-primary-500">Error</p>
        <p className="mt-4 text-xl font-semibold text-gray-800 dark:text-dark-50">Something went wrong</p>
        <p className="mt-2 text-gray-500 dark:text-dark-200">
          {error?.message || "An unexpected error occurred. Please try again."}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-8 h-11 px-6 text-base rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors font-medium"
        >
          Reload Page
        </button>
      </div>
    </main>
  );
}

export default RootErrorBoundary;

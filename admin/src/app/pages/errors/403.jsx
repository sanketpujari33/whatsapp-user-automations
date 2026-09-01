import { Link } from "react-router";
import { Page } from "components/shared/Page";
import { Button } from "components/ui";
import { routes } from "constants/routeconstants";
import Error404Magnify from "assets/illustrations/error-404-magnify.svg?react";

export default function Error403() {
  return (
    <Page title="Error 403">
      <main className="min-h-100vh grid w-full grow grid-cols-1 place-items-center bg-gray-50 dark:bg-dark-900">
        <div className="w-full max-w-2xl p-6 text-center">
          <Error404Magnify
            className="w-full"
            style={{
              "--primary": "var(--color-primary-600)",
              "--primary-light": "var(--color-primary-400)",
            }}
          />
          <p className="dark:text-dark-50 pt-4 text-xl font-semibold text-gray-800">
            Access Denied
          </p>
          <p className="dark:text-dark-200 pt-2 text-gray-500">
            You do not have permission to access this page. Please contact your administrator.
          </p>
          <div className="mt-8">
            <Button component={Link} to={routes.dashboard} color="primary" className="h-11 text-base">
              Back To Home
            </Button>
          </div>
        </div>
      </main>
    </Page>
  );
}

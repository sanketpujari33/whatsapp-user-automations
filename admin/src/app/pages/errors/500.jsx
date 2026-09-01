import RepairServer from "assets/illustrations/repair-server.svg?react";
import { Page } from "components/shared/Page";

export default function Error500() {
  return (
    <Page title="Error 500">
      <main className="min-h-100vh relative grid w-full grow grid-cols-1 place-items-center p-4 bg-gray-50 dark:bg-dark-900">
        <div className="w-full max-w-[26rem] text-center">
          <RepairServer className="w-full" style={{"--primary":"var(--color-primary-500)","--dark-400":"var(--color-dark-400)","--dark-600":"var(--color-dark-600)"}} />
          <p className="pt-8 text-7xl font-bold text-primary-600 dark:text-primary-500">500</p>
          <p className="pt-4 text-xl font-semibold text-gray-800 dark:text-dark-50">Internal Server Error</p>
          <p className="text-balance pt-2 text-gray-500 dark:text-dark-200">The server has been deserted for a while. Please be patient or try again later.</p>
        </div>
      </main>
    </Page>
  );
}

import { Outlet, ScrollRestoration } from "react-router";
import { lazy } from "react";
import { useSelector } from "react-redux";
import { SplashScreen } from "components/template";
import { Progress } from "components/template";
import { Loadable } from "components/shared";

const Toaster = Loadable(lazy(() => import("components/template/Toaster")));
const Tooltip = Loadable(lazy(() => import("components/template/Tooltip")));

function Root() {
  const isInitialized = useSelector((state) => state.auth.isInitialized);

  if (!isInitialized) {
    return <SplashScreen />;
  }

  return (
    <>
      <Progress />
      <ScrollRestoration />
      <Outlet />
      <Tooltip />
      <Toaster />
    </>
  );
}

export default Root;

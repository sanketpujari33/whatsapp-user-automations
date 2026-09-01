import { createBrowserRouter, Navigate } from "react-router";
import Root from "app/layouts/core/Root";
import RootErrorBoundary from "app/pages/errors/RootErrorBoundary.jsx";
import { SplashScreen } from "components/template/SplashScreen/SplashScreen.jsx";
import { routes } from "constants/routeconstants";
import { protectedRoutes } from "./protected";
import { ghostRoutes } from "./ghost";
import { publicRoutes } from "./public";

const router = createBrowserRouter(
  [
    {
      id: "root",
      Component: Root,
      hydrateFallbackElement: <SplashScreen />,
      ErrorBoundary: RootErrorBoundary,
      children: [
        {
          index: true,
          element: <Navigate to={routes.dashboard} replace />,
        },
        protectedRoutes,
        ghostRoutes,
        publicRoutes,
      ],
    },
  ],
  {
    basename: "/" + (import.meta.env.VITE_PROJECT_NAME || ""),
  }
);

export default router;
// Import Dependencies
import { lazy, useMemo } from "react";

// Local Imports
import { useThemeContext } from "app/contexts/theme/context";
import { Loadable } from "components/shared";
import { SplashScreen } from "components/template";

// ----------------------------------------------------------------------

const themeLayouts = {
  "main-layout": lazy(() => import("../variants/MainLayout")),
  sideblock: lazy(() => import("../variants/Sideblock")),
  horizontal: lazy(() => import("../variants/HorizontalLayout")),
  compact: lazy(() => import("../variants/CompactLayout")),
};

export function DynamicLayout() {
  const { themeLayout } = useThemeContext();

  const CurrentLayout = useMemo(
    () => Loadable(themeLayouts[themeLayout], SplashScreen),
    [themeLayout],
  );

  return <CurrentLayout />;
}

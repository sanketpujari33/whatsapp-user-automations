import { Navigate } from "react-router";
import { AppLayout } from "app/layouts/core/AppLayout";
import { DynamicLayout } from "app/layouts/core/DynamicLayout";
import AuthGuard from "middleware/AuthGuard";
import { routes } from "constants/routeconstants";

const protectedRoutes = {
  id: "protected",
  Component: AuthGuard,
  children: [
    {
      Component: AppLayout,
      children: [
        {
          Component: DynamicLayout,
          children: [
            {
              index: true,
              element: <Navigate to={routes.dashboard || "/dashboard"} replace />,
            },
            {
              path: "dashboard",
              lazy: async () => ({ Component: (await import("app/pages/Dashboard/Dashboard")).default }),
            },
            {
              path: "config",
              lazy: async () => ({ Component: (await import("app/pages/Config/Config")).default }),
            },
            {
              path: routes.settings,
              lazy: async () => ({ Component: (await import("app/pages/Notifications/Notifications")).default }),
            },
            {
              path: "users",
              lazy: async () => ({ Component: (await import("app/pages/Users/Users")).default }),
            },
            {
              path: routes.teamManagement,
              lazy: async () => ({ Component: (await import("app/pages/Team/TeamManagement")).default }),
            },
            {
              path: routes.teamMgr.list,
              lazy: async () => ({ Component: (await import("app/pages/Team/TeamManagement")).default }),
            },
            {
              path: routes.teamMgr.roles,
              lazy: async () => ({ Component: (await import("app/pages/Team/TeamManagement")).default }),
            },
            {
              path: routes.teamMgr.teamManage,
              lazy: async () => ({ Component: (await import("app/pages/Team/TeamManagement")).default }),
            },
            {
              path: routes.teamMgr.pages,
              lazy: async () => ({ Component: (await import("app/pages/Team/TeamManagement")).default }),
            },
            {
              path: routes.fundManagement,
              lazy: async () => ({ Component: (await import("app/pages/FundManagement/FundManagement")).default }),
            },
            {
              path: routes.fundMgr.overview,
              lazy: async () => ({ Component: (await import("app/pages/FundManagement/FundManagement")).default }),
            },
            {
              path: routes.fundMgr.wallets,
              lazy: async () => ({ Component: (await import("app/pages/FundManagement/FundManagement")).default }),
            },
            {
              path: routes.fundMgr.transactions,
              lazy: async () => ({ Component: (await import("app/pages/FundManagement/FundManagement")).default }),
            },
            {
              path: routes.botManagement,
              lazy: async () => ({ Component: (await import("app/pages/BotManagement/BotManagement")).default }),
            },
            {
              path: routes.botMgr.overview,
              lazy: async () => ({ Component: (await import("app/pages/BotManagement/BotManagement")).default }),
            },
            {
              path: routes.botMgr.sessions,
              lazy: async () => ({ Component: (await import("app/pages/BotManagement/BotManagement")).default }),
            },
            {
              path: routes.botMgr.webhook,
              lazy: async () => ({ Component: (await import("app/pages/BotManagement/BotManagement")).default }),
            },
            {
              path: routes.botMgr.messages,
              lazy: async () => ({ Component: (await import("app/pages/BotManagement/BotManagement")).default }),
            },
            {
              path: routes.botMgr.flows,
              lazy: async () => ({ Component: (await import("app/pages/BotManagement/BotManagement")).default }),
            },
            {
              path: routes.themeManagement,
              lazy: async () => ({ Component: (await import("app/pages/Theme/Apperance/Apperance")).default }),
            },
            {
              path: routes.themeMgr.appearance,
              lazy: async () => ({ Component: (await import("app/pages/Theme/Apperance/Apperance")).default }),
            },
            {
              path: routes.themeMgr.layouts,
              lazy: async () => ({ Component: (await import("app/pages/Theme/Layouts/Layouts")).default }),
            },
            {
              path: routes.themeMgr.themes,
              lazy: async () => ({ Component: (await import("app/pages/Theme/Themes/Themes")).default }),
            },
            {
              path: routes.themeMgr.fonts,
              lazy: async () => ({ Component: (await import("app/pages/Theme/Fonts/Fonts")).default }),
            },
            {
              path: routes.themeMgr.themeSettings,
              lazy: async () => ({ Component: (await import("app/pages/Theme/Settings/Settings")).default }),
            },
          ],
        },
      ],
    },
  ],
};

export { protectedRoutes };

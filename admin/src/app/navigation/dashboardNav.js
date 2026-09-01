import { Cog6ToothIcon, SparklesIcon, UserGroupIcon } from "@heroicons/react/24/outline";
import { NAV_TYPE_ROOT, NAV_TYPE_ITEM } from "constants/app.constant";
import { routes } from "constants/routeconstants";

export const dashboardNav = {
  id: "dashboard",
  type: NAV_TYPE_ROOT,
  path: routes.dashboard,
  title: "Dashboard",
  transKey: "nav.astroAdmin.dashboard",
  sidebar: true,
  Icon: SparklesIcon,
  childs: [
    {
      id: "dashboard.home",
      type: NAV_TYPE_ITEM,
      path: routes.dashboard,
      title: "Dashboard",
      transKey: "nav.astroAdmin.dashboard",
      Icon: SparklesIcon,
    },
    {
      id: "dashboard.config",
      type: NAV_TYPE_ITEM,
      path: routes.config,
      title: "Config",
      Icon: Cog6ToothIcon,
    },
    {
      id: "dashboard.users",
      type: NAV_TYPE_ITEM,
      path: routes.users,
      title: "Users",
      Icon: UserGroupIcon,
    },
  ],
};

import {
  SwatchIcon,
  RectangleStackIcon,
  PaintBrushIcon,
  LanguageIcon,
  AdjustmentsHorizontalIcon,
} from "@heroicons/react/24/outline";
import { NAV_TYPE_ITEM, NAV_TYPE_ROOT } from "constants/app.constant";
import { routes } from "constants/routeconstants";

export const themeNav = {
  id: "theme",
  type: NAV_TYPE_ROOT,
  path: routes.themeManagement,
  title: "Theme Management",
  transKey: "nav.theme.title",
  sidebar: true,
  Icon: SwatchIcon,
  childs: [
    {
      id: "theme.appearance",
      type: NAV_TYPE_ITEM,
      path: routes.themeMgr.appearance,
      title: "Appearance",
      transKey: "nav.theme.appearance",
    },
    {
      id: "theme.layouts",
      type: NAV_TYPE_ITEM,
      path: routes.themeMgr.layouts,
      title: "Layouts",
      transKey: "nav.theme.layouts",
    },
    {
      id: "theme.themes",
      type: NAV_TYPE_ITEM,
      path: routes.themeMgr.themes,
      title: "Themes",
      transKey: "nav.theme.themes",
    },
    {
      id: "theme.fonts",
      type: NAV_TYPE_ITEM,
      path: routes.themeMgr.fonts,
      title: "Fonts",
      transKey: "nav.theme.fonts",
    },
    {
      id: "theme.settings",
      type: NAV_TYPE_ITEM,
      path: routes.themeMgr.themeSettings,
      title: "Theme Settings",
      transKey: "nav.theme.settings",
    },
  ],
};

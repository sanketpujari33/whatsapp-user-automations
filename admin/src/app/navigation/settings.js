import {
  UserIcon,
  SwatchIcon,
} from "@heroicons/react/24/outline";
import {
  NAV_TYPE_ROOT,
  NAV_TYPE_ITEM,
  NAV_TYPE_COLLAPSE,
} from "constants/app.constant";
import { routes } from "constants/routeconstants";
import SettingIcon from "assets/dualicons/setting.svg?react";

// ----------------------------------------------------------------------

export const settings = {
  id: "settings",
  type: NAV_TYPE_ROOT,
  path: "/settings",
  title: "Settings",
  transKey: "nav.settings.title",
  sidebar: true,
  Icon: SettingIcon,
  childs: [
    {
      id: "settings.general",
      type: NAV_TYPE_ITEM,
      path: routes.generalTabs.general,
      title: "General",
      transKey: "nav.settings.general",
      Icon: UserIcon,
    },
    {
      id: "settings.appearance",
      type: NAV_TYPE_ITEM,
      path: routes.generalTabs.astrologerApp,
      title: "Appearance",
      transKey: "nav.settings.appearance",
      Icon: SwatchIcon,
    },
  ],
};
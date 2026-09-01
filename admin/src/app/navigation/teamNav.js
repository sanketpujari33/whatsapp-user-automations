import { UserGroupIcon } from "@heroicons/react/24/outline";
import { NAV_TYPE_ROOT, NAV_TYPE_ITEM } from "constants/app.constant";
import { routes } from "constants/routeconstants";

export const teamNav = {
  id: "team",
  type: NAV_TYPE_ROOT,
  path: routes.teamManagement,
  title: "Team Management",
  transKey: "nav.astroAdmin.teamManagement",
  sidebar: true,
  Icon: UserGroupIcon,
  childs: [
    { id: "team.list", type: NAV_TYPE_ITEM, path: routes.teamMgr.list, title: "Team List", transKey: "nav.team.list" },
    { id: "team.roles", type: NAV_TYPE_ITEM, path: routes.teamMgr.roles, title: "Roles & Permissions", transKey: "nav.team.roles" },
    { id: "team.manage", type: NAV_TYPE_ITEM, path: routes.teamMgr.teamManage, title: "Team Management", transKey: "nav.team.manage" },
    { id: "team.pages", type: NAV_TYPE_ITEM, path: routes.teamMgr.pages, title: "Permission Modules", transKey: "nav.team.pages" },
  ],
};

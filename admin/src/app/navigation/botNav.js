import { CommandLineIcon } from "@heroicons/react/24/outline";
import { NAV_TYPE_ITEM, NAV_TYPE_ROOT } from "constants/app.constant";
import { routes } from "constants/routeconstants";

export const botNav = {
  id: "bot-management",
  type: NAV_TYPE_ROOT,
  path: routes.botManagement,
  title: "Bot Management",
  transKey: "nav.bot.title",
  sidebar: true,
  Icon: CommandLineIcon,
  childs: [
    {
      id: "bot.overview",
      type: NAV_TYPE_ITEM,
      path: routes.botMgr.overview,
      title: "Overview",
      transKey: "nav.bot.overview",
    },
    {
      id: "bot.sessions",
      type: NAV_TYPE_ITEM,
      path: routes.botMgr.sessions,
      title: "Sessions",
      transKey: "nav.bot.sessions",
    },
    {
      id: "bot.webhook",
      type: NAV_TYPE_ITEM,
      path: routes.botMgr.webhook,
      title: "Webhook Logs",
      transKey: "nav.bot.webhook",
    },
    {
      id: "bot.messages",
      type: NAV_TYPE_ITEM,
      path: routes.botMgr.messages,
      title: "Message Logs",
      transKey: "nav.bot.messages",
    },
    {
      id: "bot.flows",
      type: NAV_TYPE_ITEM,
      path: routes.botMgr.flows,
      title: "Flows",
      transKey: "nav.bot.flows",
    },
  ],
};

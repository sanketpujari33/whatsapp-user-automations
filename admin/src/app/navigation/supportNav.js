import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
import { NAV_TYPE_ROOT, NAV_TYPE_ITEM } from "constants/app.constant";
import { routes } from "constants/routeconstants";

export const supportNav = {
  id: "support",
  type: NAV_TYPE_ROOT,
  path: routes.support,
  title: "Support Management",
  transKey: "nav.astroAdmin.support",
  sidebar: true,
  Icon: QuestionMarkCircleIcon,
  childs: [
    { id: "support.tickets", type: NAV_TYPE_ITEM, path: routes.supportManager.tickets, title: "Tickets", transKey: "nav.support.tickets" },
    { id: "support.aichat", type: NAV_TYPE_ITEM, path: routes.supportManager.aiChat, title: "AI Chat", transKey: "nav.support.aichat" },
    { id: "support.reports", type: NAV_TYPE_ITEM, path: routes.supportManager.reports, title: "Reports", transKey: "nav.support.reports" },
    { id: "support.contactForm", type: NAV_TYPE_ITEM, path: routes.contactForm, title: "Contact Forms", transKey: "nav.support.contact" },
    { id: "support.feedback", type: NAV_TYPE_ITEM, path: routes.feedback, title: "Feedback", transKey: "nav.support.feedback" },
  ],
};

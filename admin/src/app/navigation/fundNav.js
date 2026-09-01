import { BanknotesIcon } from "@heroicons/react/24/outline";
import { NAV_TYPE_ROOT, NAV_TYPE_ITEM } from "constants/app.constant";
import { routes } from "constants/routeconstants";

export const fundNav = {
  id: "fund-management",
  type: NAV_TYPE_ROOT,
  path: routes.fundManagement,
  title: "Fund Management",
  transKey: "nav.fundManagement.title",
  sidebar: true,
  Icon: BanknotesIcon,
  childs: [
    {
      id: "fund.overview",
      type: NAV_TYPE_ITEM,
      path: routes.fundMgr.overview,
      title: "Fund Overview",
      transKey: "nav.fundManagement.title",
    },
    {
      id: "fund.wallets",
      type: NAV_TYPE_ITEM,
      path: routes.fundMgr.wallets,
      title: "Wallet Management",
      transKey: "nav.fundManagement.viewBeneficiaries",
    },
    {
      id: "fund.transactions",
      type: NAV_TYPE_ITEM,
      path: routes.fundMgr.transactions,
      title: "Transaction Management",
      transKey: "nav.fundManagement.withdrawRequests",
    },
  ],
};

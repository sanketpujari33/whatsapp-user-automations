// Import Dependencies
// import PropTypes from "prop-types";
import { ChevronRightIcon, ChevronLeftIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { useTranslation } from "react-i18next";

// Local Imports
// import { AccordionButton, AccordionItem, AccordionPanel } from "components/ui";
import { MenuItem } from "./MenuItem";
import { useLocaleContext } from "app/contexts/locale/context";
import { Disclosure } from "@headlessui/react";
import { useLocation } from "react-router";

// ----------------------------------------------------------------------

export function SecondLevel({ data }) {
  const { path, transKey, childs, Icon } = data;
  const { t } = useTranslation();
  const { isRtl } = useLocaleContext();

  const location = useLocation();

  const title = t(transKey) || data.title;
  const ChevronIcon = isRtl ? ChevronLeftIcon : ChevronRightIcon;

  const findParentOfMatchingPath = (item, pathname) => {
    // If the item has no children, check its path directly
    if (!item.childs || item.childs.length === 0) {
      return item.path === pathname;
    }

    // If it has children, recursively check each child
    for (const child of item.childs) {
      if (findParentOfMatchingPath(child, pathname)) {
        return true;
      }
    }

    return false;
  };
  const check = findParentOfMatchingPath(data, location.pathname);

  return (
    <Disclosure
      as="div"
      value={path}
      defaultOpen={check}
      className="relative flex flex-1 flex-col px-3"
    >
      {({ open }) => (
        <>
          <Disclosure.Button
            className={clsx(
                "group flex flex-1 cursor-pointer items-center justify-between rounded-lg px-3 py-2 font-medium outline-hidden transition-colors duration-300 ease-in-out",
              open
                ? "bg-white/20 text-white"
                : "text-white/70 hover:bg-white/15 hover:text-white focus:bg-white/15 focus:text-white",
            )}
          >
            <div className="flex min-w-0 items-center gap-3">
              {Icon ? (
                <img
                  src={`${import.meta.env.BASE_URL}${Icon}`}
                  alt=""
                  className={clsx(
                    "size-4 shrink-0",
                    open
                      ? "brightness-0 invert"
                      : "brightness-0 invert opacity-70 group-hover:opacity-100",
                  )}
                />
              ) : (
                <div
                  className={clsx(
                    open
                      ? "bg-white opacity-80"
                      : "opacity-50 transition-all",
                    "size-2 rounded-full border border-white",
                  )}
                />
              )}

              <span className="truncate text-left text-wrap text-white">
                {title}
              </span>
            </div>
            <ChevronIcon
              className={clsx(
                "size-4 shrink-0 transition-transform text-white/70",
                open && "ltr:rotate-90 rtl:-rotate-90",
              )}
            />
          </Disclosure.Button>
          <Disclosure.Panel className="flex flex-col space-y-1 px-3 py-1.5">
            {childs.map((child) => (
              <MenuItem key={child.id} data={child} />
            ))}
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}

// SecondLevel.propTypes = {
//   data: PropTypes.object,
// };

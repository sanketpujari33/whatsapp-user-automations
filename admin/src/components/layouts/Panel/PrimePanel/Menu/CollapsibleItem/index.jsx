// Import Dependencies
import PropTypes from "prop-types";
import clsx from "clsx";
import { ChevronRightIcon, ChevronLeftIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

// Local Imports
import { AccordionButton, AccordionItem, AccordionPanel } from "components/ui";
import { useLocaleContext } from "app/contexts/locale/context";
import { MenuItem } from "./MenuItem";

// ----------------------------------------------------------------------

export function CollapsibleItem({ data }) {
  const { path, childs, transKey, Icon: NavIcon } = data;

  const { t } = useTranslation();
  const { isRtl } = useLocaleContext();
  const title = t(transKey) || data.title;

  const Icon = isRtl ? ChevronLeftIcon : ChevronRightIcon;

  return (
    <AccordionItem value={path}>
      {({ open }) => (
        <>
          <AccordionButton
            className={clsx(
              "text-xs-plus flex w-full min-w-0 cursor-pointer items-center justify-between gap-1 py-2 text-start tracking-wide outline-hidden transition-[color,padding-left,padding-right] duration-300 ease-in-out",
              open
                ? "font-semibold text-white"
                : "text-white/60 hover:text-white focus:text-white",
            )}
          >
            <span className="flex min-w-0  items-center">
              {NavIcon && (
                typeof NavIcon === "string" ? (
                  <img src={`${import.meta.env.BASE_URL}${NavIcon}`} alt="" className="size-4 shrink-0" />
                ) : (
                  <NavIcon className="size-4 shrink-0" />
                )
              )}
              <span className="truncate">{title}</span>
            </span>
            <Icon
              className={clsx(
                "size-4 text-white/60 transition-transform ease-in-out",
                open && [isRtl ? "-rotate-90" : "rotate-90"],
              )}
            />
          </AccordionButton>
          <AccordionPanel>
            {childs.map((i) => (
              <MenuItem key={i.path} data={i} />
            ))}
          </AccordionPanel>
        </>
      )}
    </AccordionItem>
  );
}

CollapsibleItem.propTypes = {
  data: PropTypes.object,
};

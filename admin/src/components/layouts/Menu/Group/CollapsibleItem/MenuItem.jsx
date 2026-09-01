// Import Dependencies
import PropTypes from "prop-types";
import clsx from "clsx";
import { NavLink, useRouteLoaderData } from "react-router";
import { useTranslation } from "react-i18next";

// Local Imports
import { Badge } from "components/ui";
import { useBreakpointsContext } from "app/contexts/breakpoint/context";
import { useSidebarContext } from "app/contexts/sidebar/context";

// ----------------------------------------------------------------------

export function MenuItem({ data }) {
  const { id, transKey, path, Icon } = data;
  const { t } = useTranslation();
  const { lgAndDown } = useBreakpointsContext();
  const { close } = useSidebarContext();

  const title = t(transKey) || data.title;
  const info = useRouteLoaderData("root")?.[id]?.info;

  const handleMenuItemClick = () => lgAndDown && close();

  return (
    <div className="relative flex">
      <NavLink
        to={path}
        onClick={handleMenuItemClick}
        className={({ isActive }) =>
          clsx(
            "group min-w-0 flex-1 rounded-md px-3 py-2 font-medium outline-hidden transition-colors ease-in-out",
            isActive
              ? "text-white bg-white/20"
              : "text-white/70 hover:bg-white/15 hover:text-white focus:bg-white/15 focus:text-white",
          )
        }
      >
        {({ isActive }) => (
          <div
            data-menu-active={isActive}
            className="flex min-w-0 items-center justify-between gap-2.5"
          >
            <div className="flex min-w-0 items-center gap-3">
              {Icon ? (
                <img
                  src={`${import.meta.env.BASE_URL}${Icon}`}
                  alt=""
                  className={clsx(
                    "size-4 shrink-0",
                    isActive
                      ? "brightness-0 invert"
                      : "brightness-0 invert opacity-70 group-hover:opacity-100",
                  )}
                />
              ) : (
                <div
                  className={clsx(
                    isActive
                      ? "bg-blue-300 opacity-80 dark:bg-primary-400"
                      : "opacity-50 transition-all",
                    "size-2 rounded-full border border-current",
                  )}
                />
              )}
              <span className="truncate    text-wrap text-left ">{title}</span>
            </div>
            {info && info.val && (
              <Badge
                color={info.color}
                className="h-5 min-w-[1.25rem] shrink-0 rounded-full p-[5px]"
              >
                {info.val}
              </Badge>
            )}
          </div>
        )}
      </NavLink>
    </div>
  );
}

MenuItem.propTypes = {
  data: PropTypes.object.isRequired,
};

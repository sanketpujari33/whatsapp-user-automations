// Import Dependencies
import PropTypes from "prop-types";
import clsx from "clsx";
import { NavLink, useRouteLoaderData } from "react-router";

// Local Imports
import { Badge } from "components/ui";
import { useBreakpointsContext } from "app/contexts/breakpoint/context";
import { useSidebarContext } from "app/contexts/sidebar/context";
import { useTranslation } from "react-i18next";

// ----------------------------------------------------------------------

export function MenuItem({ data }) {
  const { transKey, path, id, Icon } = data;
  const { lgAndDown } = useBreakpointsContext();
  const { close } = useSidebarContext();
  const { t } = useTranslation();

  const title = t(transKey) || data.title;
  const info = useRouteLoaderData("root")?.[id]?.info;

  const handleMenuItemClick = () => lgAndDown && close();

  return (
    <NavLink
      to={path}
      onClick={handleMenuItemClick}
      id={id}
      className={({ isActive }) =>
        clsx(
          "text-xs-plus flex cursor-pointer items-center justify-between px-2 tracking-wide outline-hidden transition-[color,padding-left,padding-right] duration-300 ease-in-out hover:ltr:pl-4 hover:rtl:pr-4",
          isActive
            ? "font-medium text-white"
            : "text-white/60 hover:text-white focus:text-white",
        )
      }
    >
      {({ isActive }) => (
        <div
          data-menu-active={isActive}
          className="flex min-w-0 items-center justify-between"
          style={{ height: "34px" }}
        >
          {Icon && (
            typeof Icon === "string" ? (
              <img src={`${import.meta.env.BASE_URL}${Icon}`} alt="" className="size-4 shrink-0" />
            ) : (
              <Icon className="size-4 shrink-0" />
            )
          )}
          <span className="truncate">{title}</span>
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
  );
}

MenuItem.propTypes = {
  data: PropTypes.object,
};

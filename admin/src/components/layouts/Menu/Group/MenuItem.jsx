import PropTypes from "prop-types";
import clsx from "clsx";
import { NavLink, useRouteLoaderData } from "react-router";
import { useTranslation } from "react-i18next";
import { Badge } from "components/ui";
import { useBreakpointsContext } from "app/contexts/breakpoint/context";
import { useSidebarContext } from "app/contexts/sidebar/context";

export function MenuItem({ data }) {
  const { Icon, path, id, transKey } = data;
  const { lgAndDown } = useBreakpointsContext();
  const { close } = useSidebarContext();
  const { t } = useTranslation();
  const title = t(transKey) || data.title;
  const info = useRouteLoaderData("root")?.[id]?.info;
  const handleClick = () => lgAndDown && close();

  return (
    <div className="relative flex px-3">
      <NavLink
        to={path}
        onClick={handleClick}
        className={({ isActive }) =>
          clsx(
            "group min-w-0 flex-1 rounded-md px-3 py-2 font-medium outline-hidden transition-colors ease-in-out",
            isActive
              ? "bg-white/20 text-white"
              : "text-white/70 hover:bg-white/15 hover:text-white focus:bg-white/15 focus:text-white",
          )
        }
      >
        {({ isActive }) => (
          <>
            <div data-menu-active={isActive} className="text-xs-plus flex min-w-0 items-center justify-between gap-2 tracking-wide">
              <div className="flex min-w-0 items-center gap-3">
                {Icon && (
                  <img
                    src={`${import.meta.env.BASE_URL}${Icon}`}
                    alt=""
                    className={clsx(
                      "size-5 shrink-0",
                      isActive
                        ? "brightness-0 invert"
                        : "brightness-0 invert opacity-70 group-hover:opacity-100",
                    )}
                  />
                )}
                <span className="truncate">{title}</span>
              </div>
              {info && info.val && (
                <Badge color={info.color} variant="soft" className="text-tiny-plus h-4.5 min-w-[1rem] shrink-0 p-[5px]">
                  {info.val}
                </Badge>
              )}
            </div>
            {isActive && (
              <div className="dark:bg-primary-400 absolute top-1 bottom-1 w-1 bg-white ltr:left-0 ltr:rounded-r-full rtl:right-0 rtl:rounded-l-lg" />
            )}
          </>
        )}
      </NavLink>
    </div>
  );
}

MenuItem.propTypes = { data: PropTypes.object };

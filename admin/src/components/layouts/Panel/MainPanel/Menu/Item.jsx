// Import Dependencies
import PropTypes from "prop-types";
import clsx from "clsx";
import { useRouteLoaderData } from "react-router";

// Local Imports
import { useBreakpointsContext } from "app/contexts/breakpoint/context";
import { Badge } from "components/ui";
import { createScopedKeydownHandler } from "utils/dom/createScopedKeydownHandler";

// ----------------------------------------------------------------------

export function Item({
  id,
  title,
  isActive,
  Icon,
  component,
  onKeyDown,
  ...rest
}) {
  const Element = component || "button";
  const { lgAndUp } = useBreakpointsContext();
  const info = useRouteLoaderData("root")?.[id]?.info;

  return (
    <Element
      data-root-menu-item
      {...{
        "data-tooltip": lgAndUp ? true : undefined,
        "data-tooltip-content": title,
        "data-tooltip-place": "right",
      }}
      className={clsx(
        "relative flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-lg outline-hidden transition-colors duration-200 group",
        isActive
          ? "bg-white/20 text-white"
          : "text-white/70 hover:bg-white/15 hover:text-white focus:bg-white/15 focus:text-white active:bg-white/20",
      )}
      onKeyDown={createScopedKeydownHandler({
        siblingSelector: "[data-root-menu-item]",
        parentSelector: "[data-root-menu]",
        activateOnFocus: false,
        loop: true,
        orientation: "vertical",
        onKeyDown,
      })}
      {...rest}
    >
      {Icon && (
        typeof Icon === "string" ? (
          <img
            src={`${import.meta.env.BASE_URL}${Icon}`}
            alt=""
            className={clsx(
              "size-7 shrink-0",
              isActive
                ? "brightness-0 invert"
                : "brightness-0 invert opacity-70 group-hover:opacity-100",
            )}
          />
        ) : (
          <Icon className="size-7" />
        )
      )}
      {info && info.val && (
        <Badge
          color={info.color}
          className="text-tiny-plus dark:ring-dark-800 absolute top-0 right-0 -m-1 h-4 min-w-[1rem] rounded-full px-1 py-0 ring-1 ring-white"
        >
          <span> {info.val}</span>
        </Badge>
      )}
    </Element>
  );
}

Item.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  isActive: PropTypes.bool,
  Icon: PropTypes.oneOfType([PropTypes.elementType, PropTypes.string]).isRequired,
  component: PropTypes.elementType,
  onKeyDown: PropTypes.func,
};

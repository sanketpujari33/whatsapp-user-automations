// Import Dependencies
import PropTypes from "prop-types";
import { forwardRef } from "react";
import clsx from "clsx";

// Local Imports
import { COLORS } from "constants/app.constant";
import { setThisClass } from 'utils/helpers/setThisClass';

// ----------------------------------------------------------------------

const variants = {
  filled:
    "bg-[var(--color-this)] text-white hover:bg-[var(--color-this-darker)] focus:bg-[var(--color-this-darker)] active:bg-[var(--color-this-darker)]/90 disabled:bg-[var(--color-this-light)] dark:disabled:bg-[var(--color-this-darker)]",
  outlined:
    "border border-[var(--color-this)]/40 text-[var(--color-this)] hover:border-[var(--color-this-darker)] focus:border-[var(--color-this-darker)] dark:border-[var(--color-this-light)]/30 dark:text-[var(--color-this-light)] dark:hover:border-[var(--color-this-darker)] dark:focus:border-[var(--color-this-darker)]",
  soft:
    "text-[var(--color-this-darker)] bg-[var(--color-this)]/10 hover:text-white hover:bg-[var(--color-this-darker)] focus:text-white focus:bg-[var(--color-this-darker)] dark:text-[var(--color-this-light)] dark:bg-[var(--color-this-light)]/20 dark:hover:bg-[var(--color-this-darker)] dark:hover:text-white dark:focus:bg-[var(--color-this-darker)] dark:focus:text-white",
};


const neutralVariants = {
  filled:
    "bg-[var(--color-neutral-base)] text-white hover:bg-[var(--color-neutral-darker)] focus:bg-[var(--color-neutral-darker)] active:bg-[var(--color-neutral-darker)]/90 dark:bg-[var(--color-neutral-dark)] dark:text-white dark:hover:bg-[var(--color-neutral-darker)] dark:focus:bg-[var(--color-neutral-darker)] dark:active:bg-[var(--color-neutral-darker)]/90",
  outlined:
    "border border-[var(--color-neutral-base)]/30 text-[var(--color-neutral-base)] hover:border-[var(--color-neutral-darker)] focus:border-[var(--color-neutral-darker)] dark:border-[var(--color-neutral-light)]/40 dark:text-[var(--color-neutral-light)] dark:hover:border-[var(--color-neutral-dark)] dark:focus:border-[var(--color-neutral-dark)]",
  soft: "text-[var(--color-neutral-darker)] bg-[var(--color-neutral-base)]/10 hover:text-white focus:text-white hover:bg-[var(--color-neutral-darker)] focus:bg-[var(--color-neutral-darker)] active:bg-[var(--color-neutral-darker)]/80 dark:text-[var(--color-neutral-light)] dark:bg-[var(--color-neutral-light)]/15 dark:hover:bg-[var(--color-neutral-darker)] dark:focus:bg-[var(--color-neutral-darker)] dark:active:bg-[var(--color-neutral-darker)]/80",
};

const Button = forwardRef((props, ref) => {
  const {
    component,
    className,
    children,
    color,
    isIcon,
    variant = "filled",
    unstyled,
    type = "button",
    isGlow,
    disabled,
    onClick,
    ...rest
  } = props;

  const Component = component || "button";
  const mergedColor = color || "neutral";


  // console.log({neutralVariants,variant,color})
  return (
    <Component
      className={clsx(
        "btn-base",
        !unstyled
          ? [
              "btn",
              isIcon && "shrink-0 p-0",
              mergedColor === "neutral"
                ? [
                    neutralVariants[variant],
                    isGlow &&
                      "dark:shadow-dark-450/5 shadow-lg shadow-gray-200/50",
                  ]
                : [
                    setThisClass(mergedColor),
                    variants[variant],
                    isGlow &&
                      "shadow-soft shadow-this/50 dark:shadow-this/50 dark:shadow-lg",
                  ],
            ]
          : color && color !== "neutral" && setThisClass(color),

        className,
      )}
      type={type}
      ref={ref}
      disabled={disabled}
      data-disabled={disabled}
      onClick={onClick}
      {...rest}
    >
      {children}
    </Component>
  );
});

Button.displayName = "Button";

Button.propTypes = {
  children: PropTypes.node,
  component: PropTypes.elementType,
  className: PropTypes.string,
  type: PropTypes.string,
  isIcon: PropTypes.bool,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  color: PropTypes.oneOf(COLORS),
  variant: PropTypes.oneOf(["filled", "outlined", "soft", "flat"]),
  unstyled: PropTypes.bool,
  isGlow: PropTypes.bool,
};

export { Button };

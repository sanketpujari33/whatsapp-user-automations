// Import Dependencies
import clsx from "clsx";

// Local Imports
import { useSidebarContext } from "app/contexts/sidebar/context";

// ----------------------------------------------------------------------

export function SidebarToggleBtn() {
  const { toggle, isExpanded } = useSidebarContext();

  return (
    <button
      onClick={toggle}
      className={clsx(
        isExpanded && "active",
        "sidebar-toggle-btn dark:text-primary-400 flex size-7 cursor-pointer flex-col justify-center space-y-1.5 text-white outline-hidden focus:outline-hidden ltr:ml-0.5 rtl:mr-0.5",
      )}
    >
      <span />
      <span />
      <span />
    </button>
  );
}

// Import Dependencies
import PropTypes from "prop-types";

// Local Imports
import { useMemo, useCallback } from "react";
import { useDidUpdate, useIsomorphicEffect } from "hooks";
import { useDispatch, useSelector } from "react-redux";
import { openSidebar, closeSidebar, toggleSidebar } from "store/slices/sidebarSlice";
import { useBreakpointsContext } from "../breakpoint/context";
import { SidebarContext } from "./context";

const initialState = {
  isExpanded: true,
  setIsExpanded: () => {},
};

export function SidebarProvider({ children }) {
  const { xlAndUp, lgAndDown, name } = useBreakpointsContext();
  const dispatch = useDispatch();
  const isExpanded = useSelector((state) => state.sidebar?.isExpanded ?? true);

  const open = useCallback(() => dispatch(openSidebar()), [dispatch]);
  const close = useCallback(() => dispatch(closeSidebar()), [dispatch]);
  const toggle = useCallback(() => dispatch(toggleSidebar()), [dispatch]);

  // Close Sidebar when Breakpoint changed
  useDidUpdate(() => {
    lgAndDown && close();
  }, [name]);

  useIsomorphicEffect(() => {
    const documentBody = document?.body;
    if (documentBody) {
      isExpanded
        ? documentBody.classList.add("is-sidebar-open")
        : documentBody.classList.remove("is-sidebar-open");
    }
  }, [isExpanded]);

  const contextValue = useMemo(() => ({
    isExpanded,
    toggle,
    open,
    close,
  }), [isExpanded, toggle, open, close]);

  if (!children) {
    return;
  }

  return (
    <SidebarContext value={contextValue}>
      {children}
    </SidebarContext>
  );
}

SidebarProvider.propTypes = {
  children: PropTypes.node,
};

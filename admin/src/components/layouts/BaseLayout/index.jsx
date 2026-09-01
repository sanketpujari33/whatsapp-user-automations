import clsx from "clsx";
import { Outlet } from "react-router";
import { Header } from "../Header";
import { Panel } from "../Panel";

/**
 * BaseLayout dynamically renders the layout based on the config.
 * 
 * @param {Object} config
 * @param {Object} config.header - Header config { showNavLinks, showProfile, borderBottom }
 * @param {Object} config.sidebar - Sidebar config { variant: 'single' | 'dual-panel', visible }
 * @param {string} config.contentClass - CSS classes for the main content area
 */
export function BaseLayout({ config }) {
  const { header, sidebar, contentClass } = config;
  return (
    <>
      {header && <Header config={header} />}

      <main className={clsx("main-content transition-content", contentClass)}>
        <Outlet />
      </main>
      {sidebar?.visible && <Panel config={sidebar} />}
    </>
  );
}

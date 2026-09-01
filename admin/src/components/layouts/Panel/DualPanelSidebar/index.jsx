// Import Dependencies
import { useMemo, useState } from "react";
import { useLocation } from "react-router";

// Local Imports
import { useBreakpointsContext } from "app/contexts/breakpoint/context";
import { useSidebarContext } from "app/contexts/sidebar/context";
import { useAuthContext } from "app/contexts/auth/context";
import { useDidUpdate } from "hooks";
import { isRouteActive } from 'utils/helpers/isRouteActive';
import { NAV_TYPE_COLLAPSE, NAV_TYPE_ITEM } from "constants/app.constant";
import { MainPanel } from "../MainPanel";
import { PrimePanel } from "../PrimePanel";

// ----------------------------------------------------------------------

function filterSidebarModules(modules) {
  return modules
    .filter((module) => module.sidebar)
    .map((module) => {
      const filtered = { ...module };
      if (filtered.subModules) {
        filtered.subModules = filterSidebarModules(filtered.subModules);
      }
      if (filtered.items) {
        filtered.items = filterSidebarModules(filtered.items);
      }
      return filtered;
    });
}

function transformModules(modules) {
  return modules.map((module) => {
    const currentPath = `/${module.path}`;

    const baseItem = {
      id: module?._id,
      path: currentPath,
      type:
        module.subModules?.length || module.items?.length
          ? NAV_TYPE_COLLAPSE
          : NAV_TYPE_ITEM,
      title: module.name,
      Icon: module.icon,
    };

    if (module.subModules?.length) {
      baseItem.childs = transformModules(module.subModules);
    } else if (module.items?.length) {
      baseItem.childs = transformModules(module.items);
    }

    return baseItem;
  });
}

export function DualPanelSidebar() {
  const { pathname } = useLocation();
  const { name, lgAndDown } = useBreakpointsContext();
  const { isExpanded, close } = useSidebarContext();
  const { sidebarModule } = useAuthContext();

  const navigation = useMemo(() => {
    const filtered = filterSidebarModules(sidebarModule || []);
    return transformModules(filtered);
  }, [sidebarModule]);

  const initialSegment = useMemo(
    () => navigation.find((item) => isRouteActive(item.path, pathname)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const [activeSegmentPath, setActiveSegmentPath] = useState(
    initialSegment?.path,
  );

  const currentSegment = useMemo(() => {
    return navigation.find((item) => item.path === activeSegmentPath);
  }, [activeSegmentPath, navigation]);

  // Auto-select when navigation first loads from API
  useDidUpdate(() => {
    const activePath = navigation.find((item) =>
      isRouteActive(item.path, pathname),
    )?.path;
    if (activePath) {
      setActiveSegmentPath(activePath);
    }
  }, [navigation]);

  // Update selection when route changes (but not on manual clicks)
  useDidUpdate(() => {
    const activePath = navigation.find((item) =>
      isRouteActive(item.path, pathname),
    )?.path;
    if (activePath && activeSegmentPath !== activePath) {
      setActiveSegmentPath(activePath);
    }
  }, [pathname]);

  useDidUpdate(() => {
    if (lgAndDown && isExpanded) close();
  }, [name]);

  return (
    <>
      <MainPanel
        nav={navigation}
        activeSegment={activeSegmentPath}
        setActiveSegment={setActiveSegmentPath}
      />
      <PrimePanel
        close={close}
        currentSegment={currentSegment}
        pathname={pathname}
      />
    </>
  );
}

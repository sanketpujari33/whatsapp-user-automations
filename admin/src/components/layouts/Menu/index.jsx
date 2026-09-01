// Import Dependencies
import { useLocation } from "react-router";
import { useRef, useState } from "react";
import { useDidUpdate, useIsomorphicEffect } from "hooks";
import SimpleBar from "simplebar-react";

// Local Imports
import { navigation } from "app/navigation";
import { Group } from "./Group";
import { Accordion } from "components/ui";
import { isRouteActive } from 'utils/helpers/isRouteActive';
import { useAuthContext } from "app/contexts/auth/context";
import { NAV_TYPE_COLLAPSE, NAV_TYPE_ITEM } from "constants/app.constant";

// ----------------------------------------------------------------------

export function Menu() {
  const { pathname } = useLocation();
  const { sidebarModule } = useAuthContext();
  const { ref } = useRef();

  const activeGroup = navigation.find((item) => {
    if (item.path) return isRouteActive(item.path, pathname);
  });
  // console.log({activeGroup})

  const activeCollapsible = activeGroup?.childs?.find((item) => {
    if (item.path) return isRouteActive(item.path, pathname);
  });
  // console.log({activeCollapsible})

  const [expanded, setExpanded] = useState(activeCollapsible?.path || null);

  useDidUpdate(() => {
    activeCollapsible?.path !== expanded &&
      setExpanded(activeCollapsible?.path);
  }, [activeCollapsible?.path]);

  useIsomorphicEffect(() => {
    const activeItem = ref?.current.querySelector("[data-menu-active=true]");
    activeItem?.scrollIntoView({ block: "center" });
  }, []);
 


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
        // transKey: `nav.${module.name.toLowerCase().replace(/\s+/g, "-")}`,
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


  // Example usage:
  // const backendData = [/* your data pasted above */];

  const sidebarModules = filterSidebarModules(sidebarModule);
  const navigationData = transformModules(sidebarModules);


  // console.log({navigationData,sidebarModule})


  return (
    <SimpleBar
      scrollableNodeProps={{ ref }}
      className=" mySidebar  h-full overflow-x-hidden pb-6"
    >
      <Accordion value={expanded} onChange={setExpanded} className="space-y-1">
        {/* {navigation.map((nav) => ( */}
          <Group  data={navigationData}  />
        {/* ))} */}
      </Accordion>
    </SimpleBar>
  );
}

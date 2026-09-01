import { createSafeContext } from 'utils/helpers/createSafeContext';

export const [SidebarContext, useSidebarContext] = createSafeContext(
    "useSidebarContext must be used within SidebarProvider"
);

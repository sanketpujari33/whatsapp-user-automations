import { DualPanelSidebar } from "./DualPanelSidebar";
import { SinglePanelSidebar } from "./SinglePanelSidebar";

export function Panel({ config }) {
  if (config?.variant === "single") {
    return <SinglePanelSidebar />;
  }
  return <DualPanelSidebar />;
}
